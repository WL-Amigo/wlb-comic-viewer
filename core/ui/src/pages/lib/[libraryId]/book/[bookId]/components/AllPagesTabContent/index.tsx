import { Component, For } from 'solid-js';
import { BookOpenIcon } from '../../../../../../../component/Icons';
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
          <button
            class="rounded border px-2 py-1 flex flex-row gap-x-1 items-center hover:bg-gray-100"
            onClick={() => props.onPageOpenRequested(pageName)}
          >
            <BookOpenIcon />
            <span>{pageName}</span>
          </button>
        )}
      </For>
    </div>
  );
};
