import { BookId, LibraryId } from './Id';

export interface BookMin {
  readonly id: string;
  readonly name: string;
}

export interface Book {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly string[];
}

export interface BookSettings {
  name: string;
  dir: string;
}

export interface IBookService {
  loadBook(libraryId: LibraryId, bookId: BookId): Promise<Book>;
  loadBookSettings(libraryId: LibraryId, bookId: BookId): Promise<BookSettings>;
  getBookPageUrl(libraryId: LibraryId, bookId: BookId, pageName: string): string;
}

export interface IBookMutationService {
  createBook(libraryId: LibraryId, settings: BookSettings): Promise<BookId>;
}
