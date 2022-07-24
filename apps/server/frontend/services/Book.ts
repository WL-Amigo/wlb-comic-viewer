import { Book, BookSettings, IBookMutationService, IBookService } from "@local-core/interfaces";
import { Sdk } from "../graphql/autogen/gql";

export class BookService implements IBookService, IBookMutationService {
  public constructor(private readonly gqlClient: Sdk, private readonly apiHost: string) {}

  async loadBook(libraryId: string, bookId: string): Promise<Book> {
    const result = await this.gqlClient.getBook({ libraryId, bookId });
    return result.book;
  }

  loadBookSettings(libraryId: string, bookId: string): Promise<BookSettings> {
    throw new Error("Method not implemented.");
  }

  getBookPageUrl(libraryId: string, bookId: string, pageName: string): string {
    return new URL(`/api/file/lib/${libraryId}/book/${bookId}/${encodeURIComponent(pageName)}`, this.apiHost).toString();
  }

  async createBook(libraryId: string, settings: BookSettings): Promise<string> {
    const result = await this.gqlClient.createBook({ libraryId, bookDir: settings.dir, bookInput: {
      name: settings.name
    } });
    return result.createBook;
  }
}