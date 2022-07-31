export interface IDirectoryService {
  getDirectories(root: string): Promise<readonly string[]>;
}
