import { LibraryForView } from '@local-core/interfaces';
import { Outlet, useParams } from 'solid-app-router';
import { createContext, createResource, ParentComponent, Show, useContext } from 'solid-js';
import { useService } from '../../../compositions/Dependency';

interface LibraryDataContextValues {
  readonly library: LibraryForView;
  reloadLibrary(): Promise<void>;
}
const LibraryDataContext = createContext<LibraryDataContextValues>();

export const useLibraryDataContext = (): LibraryDataContextValues => {
  const values = useContext(LibraryDataContext);
  if (values === undefined) {
    throw new Error('LibraryDataContext is not provided');
  }

  return values;
};

export const LibraryDataProvider: ParentComponent = (props) => {
  const libraryService = useService('library');
  const params = useParams<{ libraryId: string }>();
  const [data, { refetch }] = createResource(
    () => params.libraryId,
    (libraryId) => libraryService.loadLibrary(libraryId),
  );
  const reloadLibrary = async () => {
    await refetch();
  };

  return (
    <Show when={!data.loading}>
      <Show when={data()}>
        {(library) => (
          <LibraryDataContext.Provider value={{ library, reloadLibrary }}>
            <Outlet />
          </LibraryDataContext.Provider>
        )}
      </Show>
    </Show>
  );
};
