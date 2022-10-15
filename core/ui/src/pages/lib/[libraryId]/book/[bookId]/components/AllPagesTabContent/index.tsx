import { createVirtualizer, VirtualItem } from '@tanstack/solid-virtual';
import { Component, createEffect, createSignal, For } from 'solid-js';
import { BookOpenIcon } from '../../../../../../../component/Icons';
import { useBookDataContext } from '../../Context';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const AllPagesTabContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | null>(null);
  const rowVirtualizer = createVirtualizer({
    get count() {
      return bookCtx.book().pages.length;
    },
    getScrollElement: containerRef,
    estimateSize: () => 42,
  });

  return (
    <div ref={setContainerRef} class="w-full h-full overflow-y-auto px-2">
      <div class="flex flex-col relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        <For each={rowVirtualizer.getVirtualItems()}>
          {(vi) => (
            <PageButton
              virtualItem={vi}
              pageName={bookCtx.book().pages[vi.index]}
              onPageOpenRequested={props.onPageOpenRequested}
            />
          )}
        </For>
      </div>
    </div>
  );
};

interface ButtonProps {
  pageName: string;
  onPageOpenRequested: (pageName: string) => void;
  virtualItem: VirtualItem<unknown>;
}
const PageButton: Component<ButtonProps> = (props) => {
  return (
    <div
      class="absolute top-0 left-0 w-full py-1"
      style={{
        height: `${props.virtualItem.size}px`,
        transform: `translateY(${props.virtualItem.start}px)`,
      }}
    >
      <button
        type="button"
        class="rounded border px-2 py-1 flex flex-row gap-x-1 items-center hover:bg-gray-100 w-full"
        onClick={() => props.onPageOpenRequested(props.pageName)}
      >
        <BookOpenIcon />
        <span>{props.pageName}</span>
      </button>
    </div>
  );
};
