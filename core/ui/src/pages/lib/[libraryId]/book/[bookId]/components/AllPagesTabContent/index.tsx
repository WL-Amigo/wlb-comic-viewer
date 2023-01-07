import { createVirtualizer, VirtualItem } from '@tanstack/solid-virtual';
import { Component, createMemo, createSignal, For } from 'solid-js';
import { BookOpenIcon, SearchIcon } from '../../../../../../../component/Icons';
import { useBookDataContext } from '../../Context';
import { matchSorter } from 'match-sorter';
import { TextInput } from '../../../../../../../component/Form/Inputs';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const AllPagesTabContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | null>(null);

  const [keyword, setKeyword] = createSignal('');
  const filteredPages = createMemo(() => {
    if (keyword() === '') {
      return bookCtx.book().pages;
    }

    return matchSorter(bookCtx.book().pages, keyword());
  });

  const rowVirtualizer = createVirtualizer({
    get count() {
      return filteredPages().length;
    },
    getScrollElement: containerRef,
    estimateSize: () => 42,
  });

  const disableVirtualize = () => filteredPages().length <= 50;

  return (
    <div class="flex flex-col gap-y-2 px-2 pb-2 w-full h-full">
      <div class="flex flex-row justify-end items-center gap-x-1">
        <SearchIcon class="w-6 h-6 flex-shrink-0" />
        <TextInput class="md:w-80" value={keyword()} onChange={setKeyword} />
      </div>
      <div ref={setContainerRef} class="w-full flex-1 overflow-y-auto">
        {disableVirtualize() ? (
          <For each={filteredPages()}>
            {(page) => <PageButtonNormal pageName={page} onPageOpenRequested={props.onPageOpenRequested} />}
          </For>
        ) : (
          <div class="flex flex-col relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            <For each={rowVirtualizer.getVirtualItems()}>
              {(vi) => (
                <PageButtonVirtualizable
                  virtualItem={vi}
                  pageName={filteredPages()[vi.index]}
                  onPageOpenRequested={props.onPageOpenRequested}
                />
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
};

interface ButtonProps {
  pageName: string;
  onPageOpenRequested: (pageName: string) => void;
}
const PageButtonNormal: Component<ButtonProps> = (props) => {
  return (
    <div class="w-full py-1">
      <button
        type="button"
        class="rounded border px-2 py-1 flex flex-row gap-x-1 items-center hover:bg-gray-100 w-full"
        onClick={() => props.onPageOpenRequested(props.pageName)}
      >
        <BookOpenIcon />
        <span class="truncate text-left flex-1">{props.pageName}</span>
      </button>
    </div>
  );
};

interface VirtualizableButtonProps extends ButtonProps {
  virtualItem: VirtualItem<unknown>;
}
const PageButtonVirtualizable: Component<VirtualizableButtonProps> = (props) => {
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
        <span class="truncate text-left flex-1">{props.pageName}</span>
      </button>
    </div>
  );
};
