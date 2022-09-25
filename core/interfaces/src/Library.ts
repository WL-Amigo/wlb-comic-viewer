import { BookMin } from './Book';
import {
  BookAttributeSettings,
  BookAttributeSettingsCreateParams,
  BookAttributeSettingsUpdateParams,
} from './BookAttribute';
import { BookAttributeId, LibraryId } from './Id';

export interface LibraryMin {
  readonly id: LibraryId;
  readonly name: string;
}

export interface LibraryForView {
  readonly id: LibraryId;
  readonly name: string;
  readonly books: readonly BookMin[];
}

export interface LibrarySettings {
  readonly name: string;
  readonly rootDir: string;
  readonly attributes: readonly BookAttributeSettings[];
}

export interface ILibraryService {
  loadAllLibraries(): Promise<readonly LibraryMin[]>;
  loadLibrary(libraryId: string): Promise<LibraryForView>;
  loadLibrarySettings(libraryId: string): Promise<LibrarySettings>;
}

export interface ILibraryMutationService {
  createLibrary(settings: LibrarySettings): Promise<LibraryId>;
  createBookAttributeSettings(
    libraryId: string,
    attributeSettings: readonly BookAttributeSettingsCreateParams[],
  ): Promise<readonly BookAttributeId[]>;
  updateBookAttributeSettings(
    libraryId: string,
    attributeSettings: readonly BookAttributeSettingsUpdateParams[],
  ): Promise<readonly BookAttributeId[]>;
}
