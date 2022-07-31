import { IDirectoryService } from "@local-core/interfaces";
import { Sdk } from "../graphql/autogen/gql";

export class DirectoryService implements IDirectoryService {
  public constructor(private readonly gqlClient: Sdk) {}
  
  async getDirectories(root: string): Promise<readonly string[]> {
    const resp = await this.gqlClient.getDirs({ root });
    return resp.dirs;
  }
}