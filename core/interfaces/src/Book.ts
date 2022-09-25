import { BookAttribute, BookAttributeCreateParams, BookAttributeUpdateParams } from './BookAttribute';
import { BookId, LibraryId } from './Id';

export interface BookMin {
  readonly id: string;
  readonly name: string;
  readonly isRead: boolean;
}

export interface Book {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly string[];
  readonly isRead: boolean;
  readonly attributes: readonly BookAttribute[];
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
}
