import { BookAttribute, BookAttributeCreateParams, BookAttributeUpdateParams } from './BookAttribute';
import { BookId, LibraryId } from './Id';

export interface BookMin {
  readonly id: string;
  readonly name: string;
}

export interface Book {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly string[];
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
}

export interface IBookMutationService {
  createBook(libraryId: LibraryId, params: BookCreateParams): Promise<BookId>;
  updateBook(libraryId: LibraryId, bookId: BookId, params: BookUpdateParams): Promise<BookId>;
}
