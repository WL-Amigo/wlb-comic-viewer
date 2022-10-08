import { useService } from '../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../Context';
import { useBookDataContext } from '../Context';

export const useBookmarkHandler = (): ((page: string) => Promise<void>) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');
  return async (page) => {
    const isBookmark = bookCtx.book().bookmarks.find((bm) => bm.page === page) === undefined;
    await bookService.bookmarkPage(libCtx.library.id, bookCtx.book().id, page, isBookmark);
    bookCtx.reloadBook();
  };
};
