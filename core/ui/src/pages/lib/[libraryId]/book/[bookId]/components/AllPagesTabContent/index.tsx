import { Component, For } from 'solid-js';
import { Button } from '../../../../../../../component/Button';
import { useService } from '../../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../../Context';
import { useBookDataContext } from '../../Context';

interface Props {
  onPageOpenRequested: (pageName: string) => void;
}
export const AllPagesTabContent: Component<Props> = (props) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('book');
  const onUpdateKnownPages = async () => {
    await bookService.updateKnownPages(libCtx.library.id, bookCtx.book().id);
    bookCtx.reloadBook();
  };

  return (
    <div class="w-full h-full overflow-y-auto p-2 flex flex-col gap-y-2">
      <For each={bookCtx.book().pages}>
        {(pageName) => (
          <button class="rounded border p-2 text-left" onClick={() => props.onPageOpenRequested(pageName)}>
            {pageName}
          </button>
        )}
      </For>
      <Button onClick={onUpdateKnownPages}>🔁 現在のフォルダ内容を基にページ一覧を更新</Button>
    </div>
  );
};
