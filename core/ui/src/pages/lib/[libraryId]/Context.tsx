import { LibraryForView } from '@local-core/interfaces';
import { Outlet, useParams } from 'solid-app-router';
import { Accessor, createContext, createResource, createSignal, ParentComponent, Show, useContext } from 'solid-js';
import { SquareLoader } from '../../../component/Spinners/SquareLoader';
import { useService } from '../../../compositions/Dependency';
import { useLibraryBooksSearchParams } from './compositions/Filter';

interface LibraryDataContextValues {
  library: Accessor<LibraryForView>;
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

export const LibraryDataProvider: ParentComponent = () => {
  const libraryService = useService('library');
  const params = useParams<{ libraryId: string }>();
  const searchParams = useLibraryBooksSearchParams();
  const [data, { refetch }] = createResource(
    () => ({
      libraryId: params.libraryId,
      searchParams: searchParams(),
    }),
    ({ libraryId, searchParams }) =>
      libraryService.loadLibrary(libraryId, {
        isRead: searchParams.isRead ?? undefined,
        isFavorite: searchParams.isFavorite ?? undefined,
        attributes: searchParams.attributes,
      }),
  );
  const reloadLibrary = async () => {
    await refetch();
  };

  return (
    <Show when={data.latest} fallback={<SquareLoader isLoading size="2x" />}>
      <LibraryDataContext.Provider value={{ library: () => data.latest!, reloadLibrary }}>
        <Outlet />
        <SquareLoader isLoading={data.loading} size="2x" />
      </LibraryDataContext.Provider>
    </Show>
  );
};
