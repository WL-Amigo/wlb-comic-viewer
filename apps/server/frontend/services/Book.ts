import {
  Book,
  Bookmark,
  BookAttributeCreateParams,
  BookCreateParams,
  BookSettings,
  BookUpdateParams,
  IBookMutationService,
  IBookService,
  BookmarkUpdateParams,
  BookmarkErrorType,
} from "@local-core/interfaces";
import { UpdateBookBuiltinAttributesInput, BookBuiltinAttributes } from "@local-core/interfaces/src/Book";
import { match, P } from "ts-pattern";
import {
  BookmarkErrorTypeEnum as GqlBookmarkErrorTypeEnum,
  Sdk,
} from "../graphql/autogen/gql";

const convertGqlBookmark = (gqlBookmark: {
  page: string;
  name: string;
  error?: GqlBookmarkErrorTypeEnum | null;
}): Bookmark => ({
  page: gqlBookmark.page,
  name: gqlBookmark.name,
  error: match<
    GqlBookmarkErrorTypeEnum | null | undefined,
    BookmarkErrorType | undefined
  >(gqlBookmark.error)
    .with(P.nullish, () => undefined)
    .with(GqlBookmarkErrorTypeEnum.MissingPageFile, () => "MISSING_PAGE_FILE")
    .exhaustive(),
});

export class BookService implements IBookService, IBookMutationService {
  public constructor(
    private readonly gqlClient: Sdk,
    private readonly apiHost: string
  ) {}

  public async loadBook(libraryId: string, bookId: string): Promise<Book> {
    const result = await this.gqlClient.getBook({ libraryId, bookId });
    return {
      ...result.book,
      bookmarks: result.book.bookmarks.map(convertGqlBookmark),
    };
  }

  public loadBookSettings(libraryId: string, bookId: string): Promise<BookSettings> {
    throw new Error("Method not implemented.");
  }

  public getBookPageUrl(libraryId: string, bookId: string, pageName: string): string {
    return new URL(
      `/api/file/lib/${libraryId}/book/${bookId}/${encodeURIComponent(
        pageName
      )}`,
      this.apiHost
    ).toString();
  }

  public async createBook(
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

  public async updateBook(
    libraryId: string,
    bookId: string,
    params: BookUpdateParams
  ): Promise<string> {
    const result = await this.gqlClient.updateBook({
      libraryId,
      bookId,
      bookInput: {
        name: params.name,
        ignorePatterns: params.ignorePatterns !== undefined ? [...params.ignorePatterns] : undefined
      },
    });

    return result.updateBook;
  }

  public async updateKnownPages(libraryId: string, bookId: string): Promise<string[]> {
    const result = await this.gqlClient.updateBookKnownPages({
      libraryId,
      bookId,
    });
    return result.bookUpdateKnownPages;
  }

  public async markAsReadPage(
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

  public async bookmarkPage(
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

  public async updateBookmark(
    libraryId: string,
    bookId: string,
    page: string,
    params: BookmarkUpdateParams
  ): Promise<string> {
    const result = await this.gqlClient.bookmarkPage({
      libraryId,
      bookId,
      page,
      params: {
        name: params.name,
      },
    });
    return result.bookPageCreateBookmark;
  }

  public async deleteBookmark(
    libraryId: string,
    bookId: string,
    page: string
  ): Promise<string> {
    const result = await this.gqlClient.deleteBookmark({
      libraryId,
      bookId,
      page,
    });
    return result.bookPageDeleteBookmark;
  }

  public async reorderBookmark(
    libraryId: string,
    bookId: string,
    orderedPages: readonly string[]
  ): Promise<readonly Bookmark[]> {
    const result = await this.gqlClient.reorderBookmark({
      libraryId,
      bookId,
      orderedPages: [...orderedPages],
    });
    return result.bookPageReorderBookmark.map((bm) => ({
      name: bm.name,
      page: bm.page,
    }));
  }

  public async updateAttributes(
    libraryId: string,
    bookId: string,
    params: readonly BookAttributeCreateParams[]
  ): Promise<string> {
    const result = await this.gqlClient.updateBookAttribute({
      libraryId,
      bookId,
      attributesInput: params.map((attr) => ({
        id: attr.id,
        value: attr.value,
      })),
    });
    return result.bookUpdateAttribute;
  }

  public async updateBuiltinAttributes(libraryId: string, bookId: string, params: UpdateBookBuiltinAttributesInput): Promise<BookBuiltinAttributes> {
    const result = await this.gqlClient.updateBookBuiltinAttributes({
      libraryId, bookId, input: params
    })
    return result.bookUpdateBuiltinAttribute;
  }
}
