import { ILibraryMutationService, ILibraryService, LibraryForView, LibraryMin, LibrarySettings} from "@local-core/interfaces";
import { Sdk } from "../graphql/autogen/gql";

export class LibraryService implements ILibraryService, ILibraryMutationService {
  public constructor(private readonly gqlClient: Sdk) {}

  async loadAllLibraries(): Promise<readonly LibraryMin[]> {
    const result = await this.gqlClient.loadAllLibraries();
    return result.libraries;
  }

  async loadLibrary(libraryId: string): Promise<LibraryForView> {
    const result = await this.gqlClient.loadLibrary({ libraryId });
    return result.library;
  }

  async loadLibrarySettings(libraryId: string): Promise<LibrarySettings> {
    const result = await this.gqlClient.loadLibrarySettings({libraryId});
    return result.library;
  }

  async createLibrary(settings: LibrarySettings): Promise<string> {
    const result = await this.gqlClient.createLibrary({ input: settings });
    return result.createLibrary;
  }
}