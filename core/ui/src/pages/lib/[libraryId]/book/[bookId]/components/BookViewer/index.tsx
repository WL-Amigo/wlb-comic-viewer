import { Accessor, Component, createEffect, createMemo, createSignal, Show } from 'solid-js';
import { ModalBase } from '../../../../../../../component/ModalBase';
import { useService } from '../../../../../../../compositions/Dependency';
import { createDocumentFullScreenSignal } from '../../../../../../../compositions/FullScreenState';
import { preloadImage } from '../../../../../../../utils/preloadImage';
import { useLibraryDataContext } from '../../../../Context';
import { useBookDataContext } from '../../Context';
import { BookViewerOperator } from './components/Operator';

const useMarkAsReadEffect = (currentPage: Accessor<string | undefined>) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookMutationService = useService('bookMutation');
  createEffect(() => {
    const currentPageLocal = currentPage();
    if (currentPageLocal !== undefined) {
      bookMutationService.markAsReadPage(libCtx.library().id, bookCtx.book().id, currentPageLocal);
    }
  });
};

interface Props {
  open: boolean;
  initPageIndex: number;
  onClose: () => void;
  onToggleBookmark: (page: string) => void;
}
export const BookViewer: Component<Props> = (props) => {
  return (
    <ModalBase open={props.open} onClickAway={props.onClose}>
      <BookViewerBody {...props} />
    </ModalBase>
  );
};

const BookViewerBody: Component<Omit<Props, 'open'>> = (props) => {
  const bookService = useService('book');
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const [currentImageIndex, setCurrentImageIndex] = createSignal(props.initPageIndex);
  const goNext = () => {
    setCurrentImageIndex((currentIdx) => {
      const nextIdx = currentIdx + 1;
      return nextIdx >= bookCtx.book().pages.length ? 0 : nextIdx;
    });
  };
  const goPrev = () => {
    setCurrentImageIndex((currentIdx) => {
      return currentIdx <= 0 ? bookCtx.book().pages.length - 1 : currentIdx - 1;
    });
  };
  const [isFullScreen, toggleFullScreen] = createDocumentFullScreenSignal();
  const onClose = () => {
    toggleFullScreen(false);
    bookCtx.reloadBook();
    props.onClose();
  };

  useMarkAsReadEffect(() => bookCtx.book().pages[currentImageIndex()]);

  const getCurrentPage = () => bookCtx.book().pages.at(currentImageIndex());
  const isCurrentPageBookmarked = createMemo(() => {
    const currentPage = getCurrentPage();
    if (currentPage === undefined) {
      return false;
    }
    return bookCtx.book().bookmarks.find((bm) => bm.page === currentPage) !== undefined;
  });
  const toggleBookmarkLocal = () => {
    const currentPage = getCurrentPage();
    if (currentPage !== undefined) {
      props.onToggleBookmark(currentPage);
    }
  };

  createEffect(() => {
    const nextPage = bookCtx.book().pages.at(currentImageIndex() + 1);
    if (nextPage === undefined) {
      return;
    }
    preloadImage(bookService.getBookPageUrl(libCtx.library().id, bookCtx.book().id, nextPage));
  });

  return (
    <div class="w-full h-full relative" onClick={(ev) => ev.stopPropagation()}>
      <Show when={bookCtx.book().pages.at(currentImageIndex())} keyed>
        {(pageName) => (
          <img
            src={bookService.getBookPageUrl(libCtx.library().id, bookCtx.book().id, pageName)}
            class="w-full h-full object-contain"
          />
        )}
      </Show>
      <BookViewerOperator
        onClose={onClose}
        onNext={goNext}
        onPrev={goPrev}
        onToggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen()}
        isBookmarked={isCurrentPageBookmarked()}
        toggleBookmark={toggleBookmarkLocal}
        pageName={getCurrentPage() ?? ''}
      />
    </div>
  );
};
