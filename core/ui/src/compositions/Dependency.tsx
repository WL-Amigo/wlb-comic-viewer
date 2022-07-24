import { IBookMutationService, IBookService, ILibraryMutationService, ILibraryService } from '@local-core/interfaces';
import { createContext, ParentComponent, useContext } from 'solid-js';

export interface Services {
  library: ILibraryService;
  libraryMutation: ILibraryMutationService;
  book: IBookService;
  bookMutation: IBookMutationService;
}
type ServiceKeys = keyof Services;

const ServiceProviderContext = createContext<Services>();

export const useService = <K extends ServiceKeys>(key: K): Services[K] => {
  const provider = useContext(ServiceProviderContext);
  if (provider === undefined) {
    throw new Error('Services are not injected');
  }

  return provider[key];
};

export const ServiceProvider: ParentComponent<{ services: Services }> = (props) => (
  <ServiceProviderContext.Provider value={props.services}>{props.children}</ServiceProviderContext.Provider>
);
