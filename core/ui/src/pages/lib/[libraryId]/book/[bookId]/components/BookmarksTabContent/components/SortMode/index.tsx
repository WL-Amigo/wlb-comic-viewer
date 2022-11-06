import { Bookmark } from '@local-core/interfaces';
import {
  closestCenter,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  SortableProvider,
} from '@thisbeyond/solid-dnd';
import clsx from 'clsx';
import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { Button } from '../../../../../../../../../component/Button';
import {
  BookmarkIcon,
  CheckIcon,
  DoubleChevronsDownIcon,
  DoubleChevronsUpIcon,
  XIcon,
} from '../../../../../../../../../component/Icons';
import { isNotNullOrEmptyString } from '../../../../../../../../../utils/emptiness';
import { windi } from '../../../../../../../../../utils/windi';
import { useBookDataContext } from '../../../../Context';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      sortable: boolean;
    }
  }
}

const BookmarkButtonBaseClasses = windi`rounded border px-2 py-1 flex flex-row gap-x-1 items-center hover:bg-gray-100`;

interface SortableBookmarkProps {
  bookmark: Bookmark;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
}
const SortableBookmark: Component<SortableBookmarkProps> = (props) => {
  const sortable = createSortable(props.bookmark.page);
  return (
    <div
      use:sortable
      class={clsx(
        BookmarkButtonBaseClasses,
        'group',
        windi`cursor-move justify-between touch-none`,
        sortable.isActiveDraggable && windi`opacity-25`,
      )}
    >
      <div class="flex flex-row gap-x-1">
        <BookmarkIcon />
        <span>{isNotNullOrEmptyString(props.bookmark.name) ? props.bookmark.name : props.bookmark.page}</span>
      </div>
      <div class="flex flex-row gap-x-2 md:opacity-0 md:group-hover:opacity-100">
        <Button onClick={props.onMoveToBottom}>
          <DoubleChevronsDownIcon />
        </Button>
        <Button onClick={props.onMoveToTop}>
          <DoubleChevronsUpIcon />
        </Button>
      </div>
    </div>
  );
};

const BookmarkView: Component<{ bookmark: Bookmark | null; class?: string }> = (props) => {
  return (
    <Show when={props.bookmark} keyed>
      {(bookmark) => (
        <div class={clsx(BookmarkButtonBaseClasses, props.class)}>
          <BookmarkIcon />
          <span>{isNotNullOrEmptyString(bookmark.name) ? bookmark.name : bookmark.page}</span>
        </div>
      )}
    </Show>
  );
};

interface Props {
  onDetermined: (sortedPages: readonly string[]) => void;
  onCancel: () => void;
}
export const SortBookmarksContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();
  const [currentBookmarks, setCurrentBookmarks] = createSignal(bookCtx.book().bookmarks);
  const [activeBookmark, setActiveBookmark] = createSignal<Bookmark | null>(null);
  const pages = createMemo(() => currentBookmarks().map((bm) => bm.page));

  const onDragStart: DragEventHandler = ({ draggable }) => {
    setActiveBookmark(currentBookmarks().find((bm) => bm.page === draggable.id) ?? null);
  };
  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    const draggableId = draggable.id;
    const droppableId = droppable?.id;
    if (typeof draggableId !== 'string' || typeof droppableId !== 'string') {
      return;
    }
    const currentBookmarksLocal = currentBookmarks();
    const fromIdx = currentBookmarksLocal.findIndex((bm) => bm.page === draggableId);
    const toIdx = currentBookmarksLocal.findIndex((bm) => bm.page === droppableId);
    if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
      const updated = currentBookmarksLocal.slice();
      updated.splice(toIdx, 0, ...updated.splice(fromIdx, 1));
      setCurrentBookmarks(updated);
    }

    setActiveBookmark(null);
  };

  const moveBookmarkTo = (bookmark: Bookmark, dest: 'first' | 'last') => {
    const bmIdx = currentBookmarks().findIndex((bm) => bm.page === bookmark.page);
    if (bmIdx === -1) {
      return;
    }
    const nextBookmarks = currentBookmarks().slice();
    const destIdx = dest === 'first' ? 0 : nextBookmarks.length - 1;
    nextBookmarks.splice(destIdx, 0, ...nextBookmarks.splice(bmIdx, 1));
    setCurrentBookmarks(nextBookmarks);
  };

  return (
    <div class="w-full h-full overflow-y-auto px-2 py-1 flex flex-col gap-y-2">
      <div class="flex flex-row gap-x-2 justify-end">
        <Button onClick={props.onCancel}>
          <XIcon />
          <span class="hidden md:block">キャンセル</span>
        </Button>
        <Button
          onClick={() => {
            props.onDetermined(currentBookmarks().map((bm) => bm.page));
          }}
          color="primary"
        >
          <CheckIcon />
          <span class="hidden md:block">確定</span>
        </Button>
      </div>
      <DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
        <DragDropSensors />
        <div class="flex-1 overflow-hidden relative">
          <div class="w-full h-full flex flex-col gap-y-2 overflow-y-auto">
            <SortableProvider ids={pages()}>
              <For each={currentBookmarks()}>
                {(bookmark) => (
                  <SortableBookmark
                    bookmark={bookmark}
                    onMoveToTop={() => moveBookmarkTo(bookmark, 'first')}
                    onMoveToBottom={() => moveBookmarkTo(bookmark, 'last')}
                  />
                )}
              </For>
            </SortableProvider>
          </div>
        </div>
        <DragOverlay>
          <BookmarkView bookmark={activeBookmark()} />
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
};
