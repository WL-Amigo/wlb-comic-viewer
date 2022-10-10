import clsx from 'clsx';
import { Component, createMemo, createSignal, VoidComponent } from 'solid-js';
import {
  BookmarkIcon,
  BookmarkSolidIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  IconComponent,
  LeftArrowIcon,
  RightArrowIcon,
  XIcon,
} from '../../../../../../../../../component/Icons';
import { createDebouncedFn } from '../../../../../../../../../utils/debounce';
import { windi } from '../../../../../../../../../utils/windi';
import { useDrawInputEvents } from './compositions/Draw';

interface ViewerButtonProps {
  onClick: () => void;
  Icon: IconComponent;
  label: string;
  iconSide?: 'left' | 'right';
  class?: string;
}
const ViewerButton: Component<ViewerButtonProps> = (props) => {
  const iconEl = createMemo(() => <props.Icon class="w-10 h-10 md:h-6 md:w-6" />);
  const iconSide = createMemo(() => props.iconSide ?? 'left');

  return (
    <button
      class={clsx(windi`bg-black/75 absolute p-2 text-white flex flex-row gap-x-1 items-center`, props.class)}
      onClick={props.onClick}
    >
      {iconSide() === 'left' && iconEl()}
      <span class="hidden md:block">{props.label}</span>
      {iconSide() === 'right' && iconEl()}
    </button>
  );
};

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
        {drawingDirection() === 'left' && (
          <div class="flex flex-col items-center">
            <RightArrowIcon class="w-12 h-12" />
            <span>次へ</span>
          </div>
        )}
        {drawingDirection() === 'right' && (
          <div class="flex flex-col items-center">
            <LeftArrowIcon class="w-12 h-12" />
            <span>前へ</span>
          </div>
        )}
      </div>

      <div
        class={clsx(
          windi`absolute inset-0 w-full h-full transition-opacity`,
          isControlsVisible() ? windi`opacity-100` : windi`opacity-0`,
        )}
        onClick={showControls}
        {...handlers}
      >
        <ViewerButton class="left-0 top-0" onClick={props.onClose} Icon={XIcon} label="閉じる" />
        <div class="absolute top-0 right-0 flex flex-row w-auto">
          <ViewerButton
            class="relative"
            onClick={props.toggleBookmark}
            Icon={props.isBookmarked ? BookmarkSolidIcon : BookmarkIcon}
            label={props.isBookmarked ? 'ブックマーク解除' : 'ブックマークする'}
          />
          <ViewerButton
            class="relative"
            onClick={props.onToggleFullScreen}
            Icon={props.isFullScreen ? ExitFullscreenIcon : FullscreenIcon}
            label={props.isFullScreen ? '全画面を終了' : '全画面にする'}
          />
        </div>
        <ViewerButton class="left-0 bottom-0" onClick={props.onPrev} Icon={ChevronLeftIcon} label="前へ" />
        <ViewerButton
          class="right-0 bottom-0"
          onClick={props.onNext}
          Icon={ChevronRightIcon}
          iconSide="right"
          label="次へ"
        />
      </div>
    </div>
  );
};
