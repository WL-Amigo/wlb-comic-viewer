import { Services } from "@local-core/ui";
import { Environments } from "../env";
import { gqlClient } from "../graphql/client";
import { BookService } from "./Book";
import { LibraryService } from "./Library";

const LibraryServiceInst = new LibraryService(gqlClient);
const BookServiceInst = new BookService(gqlClient, Environments.ApiHost);

export const ServiceInstances: Services = {
  library: LibraryServiceInst,
  libraryMutation: LibraryServiceInst,
  book: BookServiceInst,
  bookMutation: BookServiceInst
}