import { z } from 'zod';
import { BookAttribute, BookAttributeCreateParams, BookAttributeUpdateParams } from './BookAttribute';
import { BookId, LibraryId } from './Id';

export interface BookMin {
  readonly id: string;
  readonly name: string;
  readonly builtinAttributes: BookBuiltinAttributes;
  readonly isRead: boolean;
}

const BookmarkErrorTypeEnumSchema = z.enum(['MISSING_PAGE_FILE']);
export type BookmarkErrorType = z.infer<typeof BookmarkErrorTypeEnumSchema>;
export interface Bookmark {
  readonly page: string;
  readonly name: string;
  readonly error?: BookmarkErrorType;
}

export interface Book {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly string[];
  readonly bookmarks: readonly Bookmark[];
  readonly isRead: boolean;
  readonly builtinAttributes: BookBuiltinAttributes;
  readonly attributes: readonly BookAttribute[];
  readonly ignorePatterns: readonly string[];
}

export interface BookBuiltinAttributes {
  readonly isFavorite: boolean;
}

export interface UpdateBookBuiltinAttributesInput {
  isFavorite?: boolean;
}

export interface BookSettings {
  readonly id: string;
  readonly name: string;
  readonly attributes: readonly BookAttribute[];
}

export interface BookCreateParams {
  name: string;
  dir: string;
  attributes?: readonly BookAttributeCreateParams[];
}

export interface BookUpdateParams {
  name?: string;
  attributes?: readonly BookAttributeUpdateParams[];
  ignorePatterns?: readonly string[];
}

export interface BookmarkUpdateParams {
  name?: string;
}

export interface IBookService {
  loadBook(libraryId: LibraryId, bookId: BookId): Promise<Book>;
  loadBookSettings(libraryId: LibraryId, bookId: BookId): Promise<BookSettings>;
  getBookPageUrl(libraryId: LibraryId, bookId: BookId, pageName: string): string;
  updateKnownPages(libraryId: LibraryId, bookId: BookId): Promise<string[]>;
}

export interface IBookMutationService {
  createBook(libraryId: LibraryId, params: BookCreateParams): Promise<BookId>;
  updateBook(libraryId: LibraryId, bookId: BookId, params: BookUpdateParams): Promise<BookId>;
  markAsReadPage(libraryId: LibraryId, bookId: BookId, page: string): Promise<string>;
  bookmarkPage(libraryId: LibraryId, bookId: BookId, page: string, isBookmark: boolean): Promise<string>;
  updateBookmark(libraryId: LibraryId, bookId: BookId, page: string, params: BookmarkUpdateParams): Promise<string>;
  deleteBookmark(libraryId: LibraryId, bookId: BookId, page: string): Promise<string>;
  reorderBookmark(libraryId: LibraryId, bookId: BookId, orderedPages: readonly string[]): Promise<readonly Bookmark[]>;
  updateAttributes(libraryId: LibraryId, bookId: BookId, params: readonly BookAttributeUpdateParams[]): Promise<BookId>;
  updateBuiltinAttributes(
    libraryId: LibraryId,
    bookId: BookId,
    params: UpdateBookBuiltinAttributesInput,
  ): Promise<BookBuiltinAttributes>;
}
