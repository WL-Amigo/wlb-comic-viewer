import {
  Book,
  BookCreateParams,
  BookSettings,
  BookUpdateParams,
  IBookMutationService,
  IBookService,
} from "@local-core/interfaces";
import { Sdk } from "../graphql/autogen/gql";

export class BookService implements IBookService, IBookMutationService {
  public constructor(
    private readonly gqlClient: Sdk,
    private readonly apiHost: string
  ) {}

  async loadBook(libraryId: string, bookId: string): Promise<Book> {
    const result = await this.gqlClient.getBook({ libraryId, bookId });
    return result.book;
  }

  loadBookSettings(libraryId: string, bookId: string): Promise<BookSettings> {
    throw new Error("Method not implemented.");
  }

  getBookPageUrl(libraryId: string, bookId: string, pageName: string): string {
    return new URL(
      `/api/file/lib/${libraryId}/book/${bookId}/${encodeURIComponent(
        pageName
      )}`,
      this.apiHost
    ).toString();
  }

  async createBook(
    libraryId: string,
    params: BookCreateParams
  ): Promise<string> {
    const result = await this.gqlClient.createBook({
      libraryId,
      bookDir: params.dir,
      bookInput: {
        name: params.name,
      },
      attributesInput: params.attributes?.map((p) => ({
        id: p.id,
        value: p.value,
      })),
    });
    return result.createBook;
  }

  async updateBook(
    libraryId: string,
    bookId: string,
    params: BookUpdateParams
  ): Promise<string> {
    const result = await this.gqlClient.UpdateBook({
      libraryId, bookId, 
      bookInput: {
        name: params.name
      },
      attributesInput: params.attributes?.map(p => ({
        id: p.id,
        value: p.value
      }))
    })

    return result.updateBook
  }
}
