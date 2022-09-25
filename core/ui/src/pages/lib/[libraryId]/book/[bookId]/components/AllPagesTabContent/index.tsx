import { Component, For } from 'solid-js';
import { useBookDataContext } from '../../Context';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const AllPagesTabContent: Component<Props> = (props) => {
  const bookCtx = useBookDataContext();

  return (
    <div class="w-full h-full overflow-y-auto p-2 flex flex-col gap-y-2">
      <For each={bookCtx.book().pages}>
        {(pageName) => (
          <button class="rounded border p-2 text-left" onClick={() => props.onPageOpenRequested(pageName)}>
            {pageName}
          </button>
        )}
      </For>
    </div>
  );
};
