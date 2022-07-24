import { Book } from '@local-core/interfaces';
import { Outlet, useParams } from 'solid-app-router';
import { Component, createContext, createResource, Show, useContext } from 'solid-js';
import { useService } from '../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../Context';

interface BookDataContextValues {
  readonly book: Book;
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
    <Show when={!data.loading}>
      <Show when={data()}>
        {(book) => (
          <BookDataContext.Provider value={{ book, reloadBook }}>
            <Outlet />
          </BookDataContext.Provider>
        )}
      </Show>
    </Show>
  );
};
