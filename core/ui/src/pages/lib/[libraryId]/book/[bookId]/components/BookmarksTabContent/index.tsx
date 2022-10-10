import { Component, For, Show } from 'solid-js';
import { BookOpenIcon } from '../../../../../../../component/Icons';
import { useBookDataContext } from '../../Context';
import { BookmarkButton } from './components/BookmarkButton';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const BookmarksTabContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();

  return (
    <div class="w-full h-full overflow-y-auto px-2 py-1 flex flex-col gap-y-2">
      <Show when={bookCtx.book().pages.at(0)}>
        {(firstPage) => (
          <button
            class="rounded border p-2 flex flex-row items-center gap-x-1 hover:bg-gray-100"
            onClick={() => props.onPageOpenRequested(firstPage)}
          >
            <BookOpenIcon />
            <span>最初のページを開く</span>
          </button>
        )}
      </Show>
      <For each={bookCtx.book().bookmarks}>
        {(bookmark) => <BookmarkButton bookmark={bookmark} onPageOpenRequested={props.onPageOpenRequested} />}
      </For>
    </div>
  );
};
