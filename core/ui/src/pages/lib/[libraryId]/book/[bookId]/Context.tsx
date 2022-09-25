import { Book } from '@local-core/interfaces';
import { Outlet, useParams } from 'solid-app-router';
import { Accessor, Component, createContext, createResource, Show, useContext } from 'solid-js';
import { SquareLoader } from '../../../../../component/Spinners/SquareLoader';
import { useService } from '../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../Context';

interface BookDataContextValues {
  readonly book: Accessor<Book>;
  reloadBook(): Promise<void>;
}
const BookDataContext = createContext<BookDataContextValues>();

export const useBookDataContext = (): BookDataContextValues => {
  const values = useContext(BookDataContext);
  if (values === undefined) {
    throw new Error('BookDataContext is not provided');
  }

  return values;
};

export const BookDataProvider: Component = () => {
  const bookService = useService('book');
  const libCtx = useLibraryDataContext();
  const params = useParams<{ bookId: string }>();
  const [data, { refetch }] = createResource(
    () => params.bookId,
    (bookId) => bookService.loadBook(libCtx.library.id, bookId),
  );
  const reloadBook = async () => {
    await refetch();
  };

  return (
    <Show when={data.latest !== undefined}>
      <BookDataContext.Provider value={{ book: () => data.latest!, reloadBook }}>
        <Outlet />
        <SquareLoader size="2x" isLoading={data.loading} />
      </BookDataContext.Provider>
    </Show>
  );
};
