import { Accessor, Component, createEffect, createSignal, Show } from 'solid-js';
import { ModalBase } from '../../../../../../../component/ModalBase';
import { useService } from '../../../../../../../compositions/Dependency';
import { createDocumentFullScreenSignal } from '../../../../../../../compositions/FullScreenState';
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
      bookMutationService.markAsReadPage(libCtx.library.id, bookCtx.book().id, currentPageLocal);
    }
  });
};

interface Props {
  open: boolean;
  initPageIndex: number;
  onClose: () => void;
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

  return (
    <div class="w-full h-full relative" onClick={(ev) => ev.stopPropagation()}>
      <Show when={bookCtx.book().pages.at(currentImageIndex())}>
        {(pageName) => (
          <img
            src={bookService.getBookPageUrl(libCtx.library.id, bookCtx.book().id, pageName)}
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
      />
    </div>
  );
};
