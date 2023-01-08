import {
  BookAttributeSettings,
  BookAttributeSettingsCreateParams,
  BookAttributeSettingsUpdateParams,
  IBookAttributeSettings,
  ILibraryMutationService,
  ILibraryService,
  LibraryForView,
  LibraryMin,
  LibrarySettings,
} from "@local-core/interfaces";
import { BooksFilterParams } from "@local-core/interfaces/src/Library";
import { match } from "ts-pattern";
import { BookAttributeValueTypeOps } from "../enum/BookAttributeValueType";
import {
  BookAttributeValueTypeEnum,
  Sdk,
  BookAttributeSettingBasic as GqlBookAttributeSettingBasic,
  BookAttributeSettingTag as GqlBookAttributeSettingTag,
} from "../graphql/autogen/gql";

export class LibraryService
  implements ILibraryService, ILibraryMutationService
{
  public constructor(private readonly gqlClient: Sdk) {}

  async loadAllLibraries(): Promise<readonly LibraryMin[]> {
    const result = await this.gqlClient.loadAllLibraries();
    return result.libraries;
  }

  private getAttributeSettings(
    attr: GqlBookAttributeSettingBasic | GqlBookAttributeSettingTag
  ): BookAttributeSettings {
    const base: Omit<IBookAttributeSettings, "valueType"> = {
      id: attr.id,
      displayName: attr.displayName,
    };
    return match<BookAttributeValueTypeEnum, BookAttributeSettings>(
      attr.valueType
    )
      .with(BookAttributeValueTypeEnum.Int, () => ({
        valueType: "INT",
        ...base,
      }))
      .with(BookAttributeValueTypeEnum.String, () => ({
        valueType: "STRING",
        ...base,
      }))
      .with(BookAttributeValueTypeEnum.Tag, () => {
        if (!("tags" in attr)) {
          throw new Error("invalid attribute value settings");
        }
        return {
          valueType: "TAG",
          ...base,
          tags: attr.tags,
        };
      })
      .exhaustive();
  }

  async loadLibrary(
    libraryId: string,
    filter?: BooksFilterParams
  ): Promise<LibraryForView> {
    const { library } = await this.gqlClient.loadLibrary({
      libraryId,
      booksFilter: {
        isRead: filter?.isRead,
        isFavorite: filter?.isFavorite,
        attributes: filter?.attributes,
      },
    });
    return {
      id: library.id,
      name: library.name,
      books: library.books,
      attributes: library.attributes.map((attr) =>
        this.getAttributeSettings(attr)
      ),
    };
  }

  async loadLibrarySettings(libraryId: string): Promise<LibrarySettings> {
    const { library } = await this.gqlClient.loadLibrarySettings({ libraryId });
    return {
      name: library.name,
      rootDir: library.rootDir,
      attributes: library.attributes.map((attr) =>
        this.getAttributeSettings(attr)
      ),
    };
  }

  async getRegisteredBooksDir(libraryId: string): Promise<string[]> {
    const {
      library: { books },
    } = await this.gqlClient.getBooksDir({ libraryId });
    return books.map((b) => b.dir);
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
