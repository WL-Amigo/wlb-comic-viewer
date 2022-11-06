import { Component, createSignal, For, Match, Show, Switch } from 'solid-js';
import { Button } from '../../../../../../../component/Button';
import { BookOpenIcon, SortIcon } from '../../../../../../../component/Icons';
import { useService } from '../../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../../Context';
import { useBookDataContext } from '../../Context';
import { BookmarkButton } from './components/BookmarkButton';
import { SortBookmarksContent } from './components/SortMode';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const BookmarksTabContent: Component<Props> = (props) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');

  const [isSortMode, setSortMode] = createSignal(false);
  const onDeterminedSort = async (sortedPages: readonly string[]) => {
    await bookService.reorderBookmark(libCtx.library.id, bookCtx.book().id, sortedPages);
    bookCtx.reloadBook();
    setSortMode(false);
  };

  return (
    <Switch>
      <Match when={isSortMode()}>
        <SortBookmarksContent onDetermined={onDeterminedSort} onCancel={() => setSortMode(false)} />
      </Match>
      <Match when={!isSortMode()}>
        <div class="w-full h-full overflow-y-hidden px-2 py-1 flex flex-col gap-y-2">
          <div class="flex flex-row justify-end gap-x-2">
            <Button onClick={() => setSortMode(true)}>
              <SortIcon />
              <span class="hidden md:block">並び替え</span>
            </Button>
          </div>
          <div class="flex-1 overflow-y-auto flex flex-col gap-y-2">
            <Show when={bookCtx.book().pages.at(0)} keyed>
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
        </div>
      </Match>
    </Switch>
  );
};
