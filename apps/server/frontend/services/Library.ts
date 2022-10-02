import {
  BookAttributeSettingsCreateParams,
  BookAttributeSettingsUpdateParams,
  ILibraryMutationService,
  ILibraryService,
  LibraryForView,
  LibraryMin,
  LibrarySettings,
} from "@local-core/interfaces";
import { BooksFilterParams } from "@local-core/interfaces/src/Library";
import { BookAttributeValueTypeOps } from "../enum/BookAttributeValueType";
import { Sdk } from "../graphql/autogen/gql";

export class LibraryService
  implements ILibraryService, ILibraryMutationService
{
  public constructor(private readonly gqlClient: Sdk) {}

  async loadAllLibraries(): Promise<readonly LibraryMin[]> {
    const result = await this.gqlClient.loadAllLibraries();
    return result.libraries;
  }

  async loadLibrary(libraryId: string, filter?: BooksFilterParams): Promise<LibraryForView> {
    const result = await this.gqlClient.loadLibrary({ libraryId, booksFilter: {
      isRead: filter?.isRead,
      attributes: filter?.attributes
    } });
    return result.library;
  }

  async loadLibrarySettings(libraryId: string): Promise<LibrarySettings> {
    const result = await this.gqlClient.loadLibrarySettings({ libraryId });
    return result.library;
  }

  async createLibrary(settings: LibrarySettings): Promise<string> {
    const result = await this.gqlClient.createLibrary({ input: settings });
    return result.createLibrary;
  }

  async createBookAttributeSettings(
    libraryId: string,
    attributeSettings: readonly BookAttributeSettingsCreateParams[]
  ): Promise<readonly string[]> {
    const result = await this.gqlClient.createBookAttributeSettings({
      libraryId,
      input: attributeSettings.map((p) => ({
        id: p.preferredId,
        displayName: p.displayName,
        valueType: BookAttributeValueTypeOps.toGql(p.valueType),
      })),
    });
    return result.createBookAttributeSettings;
  }

  async updateBookAttributeSettings(
    libraryId: string,
    attributeSettings: readonly BookAttributeSettingsUpdateParams[]
  ): Promise<readonly string[]> {
    const result = await this.gqlClient.updateBookAttributeSettings({
      libraryId,
      input: attributeSettings.map((p) => ({
        id: p.id,
        displayName: p.displayName,
        valueType: p.valueType
          ? BookAttributeValueTypeOps.toGql(p.valueType)
          : undefined,
      })),
    });
    return result.updateBookAttributeSettings;
  }
}
