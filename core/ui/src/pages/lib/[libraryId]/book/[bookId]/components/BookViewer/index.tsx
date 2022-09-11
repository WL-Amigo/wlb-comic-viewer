import clsx from 'clsx';
import { Component, createSignal, ParentComponent, Show } from 'solid-js';
import { ModalBase } from '../../../../../../../component/ModalBase';
import { useService } from '../../../../../../../compositions/Dependency';
import { createDocumentFullScreenSignal } from '../../../../../../../compositions/FullScreenState';
import { createDebouncedFn } from '../../../../../../../utils/debounce';
import { windi } from '../../../../../../../utils/windi';
import { useLibraryDataContext } from '../../../../Context';
import { useBookDataContext } from '../../Context';

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

const ViewerButton: ParentComponent<{ onClick: () => void; class?: string }> = (props) => (
  <button class={clsx(windi`bg-black/75 absolute p-2 text-white`, props.class)} onClick={props.onClick}>
    {props.children}
  </button>
);

const BookViewerBody: Component<Omit<Props, 'open'>> = (props) => {
  const bookService = useService('book');
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const [currentImageIndex, setCurrentImageIndex] = createSignal(props.initPageIndex);
  const goNext = () => {
    setCurrentImageIndex((currentIdx) => {
      const nextIdx = currentIdx + 1;
      return nextIdx >= bookCtx.book.pages.length ? 0 : nextIdx;
    });
  };
  const goPrev = () => {
    setCurrentImageIndex((currentIdx) => {
      return currentIdx <= 0 ? bookCtx.book.pages.length - 1 : currentIdx - 1;
    });
  };
  const [isFullScreen, toggleFullScreen] = createDocumentFullScreenSignal();
  const onClose = () => {
    toggleFullScreen(false);
    props.onClose();
  };
  const [isControlsVisible, setIsControlsVisible] = createSignal(false);
  const hideControlsDebounced = createDebouncedFn(() => setIsControlsVisible(false), 3000);
  const showControls = () => {
    setIsControlsVisible(true);
    hideControlsDebounced();
  };

  return (
    <div class="w-full h-full relative" onClick={(ev) => ev.stopPropagation()}>
      <Show when={bookCtx.book.pages.at(currentImageIndex())}>
        {(pageName) => (
          <img
            src={bookService.getBookPageUrl(libCtx.library.id, bookCtx.book.id, pageName)}
            class="w-full h-full object-contain"
          />
        )}
      </Show>
      <div
        class={clsx(
          windi`absolute inset-0 w-full h-full transition-opacity`,
          isControlsVisible() ? windi`opacity-100` : windi`opacity-0`,
        )}
        onClick={showControls}
      >
        <ViewerButton class="left-0 top-0" onClick={onClose}>
          閉じる
        </ViewerButton>
        <ViewerButton class="top-0 right-0" onClick={() => toggleFullScreen()}>
          {isFullScreen() ? '全画面を終了' : '全画面にする'}
        </ViewerButton>
        <ViewerButton class="left-0 bottom-0" onClick={goPrev}>
          前へ
        </ViewerButton>
        <ViewerButton class="right-0 bottom-0" onClick={goNext}>
          次へ
        </ViewerButton>
      </div>
    </div>
  );
};
