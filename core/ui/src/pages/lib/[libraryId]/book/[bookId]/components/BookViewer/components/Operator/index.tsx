import clsx from 'clsx';
import { createSignal, ParentComponent, VoidComponent } from 'solid-js';
import { createDebouncedFn } from '../../../../../../../../../utils/debounce';
import { windi } from '../../../../../../../../../utils/windi';
import { useDrawInputEvents } from './compositions/Draw';

const ViewerButton: ParentComponent<{ onClick: () => void; class?: string }> = (props) => (
  <button class={clsx(windi`bg-black/75 absolute p-2 text-white`, props.class)} onClick={props.onClick}>
    {props.children}
  </button>
);

interface Props {
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onToggleFullScreen: () => void;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  isFullScreen: boolean;
}
export const BookViewerOperator: VoidComponent<Props> = (props) => {
  const [isControlsVisible, setIsControlsVisible] = createSignal(false);
  const hideControlsDebounced = createDebouncedFn(() => setIsControlsVisible(false), 3000);
  const showControls = () => {
    setIsControlsVisible(true);
    hideControlsDebounced();
  };

  const { drawingDirection, handlers } = useDrawInputEvents((dir) =>
    dir === 'left' ? props.onNext() : dir === 'right' ? props.onPrev() : undefined,
  );

  return (
    <div class="absolute inset-0 w-full h-full">
      <div class="pointer-events-none absolute bottom-0 w-full pb-8 text-white flex flex-row justify-center">
        {drawingDirection() === 'left' && <span>次へ</span>}
        {drawingDirection() === 'right' && <span>前へ</span>}
      </div>

      <div
        class={clsx(
          windi`absolute inset-0 w-full h-full transition-opacity`,
          isControlsVisible() ? windi`opacity-100` : windi`opacity-0`,
        )}
        onClick={showControls}
        {...handlers}
      >
        <ViewerButton class="left-0 top-0" onClick={props.onClose}>
          閉じる
        </ViewerButton>
        <div class="absolute top-0 right-0 flex flex-row w-auto">
          <ViewerButton class="relative" onClick={props.toggleBookmark}>
            {props.isBookmarked ? 'ブックマーク解除' : 'ブックマークする'}
          </ViewerButton>
          <ViewerButton class="relative" onClick={props.onToggleFullScreen}>
            {props.isFullScreen ? '全画面を終了' : '全画面にする'}
          </ViewerButton>
        </div>
        <ViewerButton class="left-0 bottom-0" onClick={props.onPrev}>
          前へ
        </ViewerButton>
        <ViewerButton class="right-0 bottom-0" onClick={props.onNext}>
          次へ
        </ViewerButton>
      </div>
    </div>
  );
};
