import { Component, Show } from 'solid-js';
import { useBookDataContext } from '../../Context';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const BookmarksTabContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();

  return (
    <div class="w-full h-full overflow-y-auto p-2 flex flex-col gap-y-2">
      <Show when={bookCtx.book().pages.at(0)}>
        {(firstPage) => (
          <button class="rounded border p-2 text-left" onClick={() => props.onPageOpenRequested(firstPage)}>
            最初のページを開く
          </button>
        )}
      </Show>
    </div>
  );
};
