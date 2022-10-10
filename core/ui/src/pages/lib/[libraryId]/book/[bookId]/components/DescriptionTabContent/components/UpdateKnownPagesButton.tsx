import { Component } from 'solid-js';
import { Button } from '../../../../../../../../component/Button';
import { RefreshIcon } from '../../../../../../../../component/Icons';
import { useService } from '../../../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../../../Context';
import { useBookDataContext } from '../../../Context';

export const UpdateKnownPagesButton: Component = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('book');
  const onUpdateKnownPages = async () => {
    await bookService.updateKnownPages(libCtx.library.id, bookCtx.book().id);
    bookCtx.reloadBook();
  };

  return (
    <Button class="gap-x-1" onClick={onUpdateKnownPages}>
      <RefreshIcon />
      <span>現在のフォルダ内容を基にページ一覧を更新</span>
    </Button>
  );
};
