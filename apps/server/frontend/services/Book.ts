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
    const result = await this.gqlClient.updateBook({
      libraryId,
      bookId,
      bookInput: {
        name: params.name,
      },
      attributesInput: params.attributes?.map((p) => ({
        id: p.id,
        value: p.value,
      })),
    });

    return result.updateBook;
  }

  async updateKnownPages(libraryId: string, bookId: string): Promise<string[]> {
    const result = await this.gqlClient.updateBookKnownPages({
      libraryId,
      bookId,
    });
    return result.bookUpdateKnownPages;
  }

  async markAsReadPage(
    libraryId: string,
    bookId: string,
    page: string
  ): Promise<string> {
    const result = await this.gqlClient.markAsReadPage({
      libraryId,
      bookId,
      page,
    });
    return result.bookPageMarkAsRead;
  }

  async bookmarkPage(
    libraryId: string,
    bookId: string,
    page: string,
    isBookmark: boolean
  ): Promise<string> {
    if (isBookmark) {
      const result = await this.gqlClient.bookmarkPage({
        libraryId,
        bookId,
        page,
      });
      return result.bookPageCreateBookmark;
    } else {
      const result = await this.gqlClient.deleteBookmark({
        libraryId,
        bookId,
        page,
      });
      return result.bookPageDeleteBookmark;
    }
  }
}
