import { Bookmark } from '@local-core/interfaces';
import { Component, createSignal, Match, Show, Switch } from 'solid-js';
import { Button } from '../../../../../../../../component/Button';
import { TextInput } from '../../../../../../../../component/Form/Inputs';
import {
  BookmarkIcon,
  CheckIcon,
  EditIcon,
  ErrorIcon,
  TrashIcon,
  XIcon,
} from '../../../../../../../../component/Icons';
import { useConfirmDialog } from '../../../../../../../../compositions/ConfirmDialog';
import { useService } from '../../../../../../../../compositions/Dependency';
import { isNotNullOrEmptyString } from '../../../../../../../../utils/emptiness';
import { useLibraryDataContext } from '../../../../../Context';
import { useBookDataContext } from '../../../Context';

interface Props {
  bookmark: Bookmark;
  onPageOpenRequested: (page: string) => void;
}
export const BookmarkButton: Component<Props> = (props) => {
  const [isEditMode, setIsEditMode] = createSignal(false);

  return (
    <>
      <Show when={isEditMode()}>
        <BookmarkEditor currentBookmark={props.bookmark} exitEditMode={() => setIsEditMode(false)} />
      </Show>
      <Show when={!isEditMode()}>
        <div
          class="w-full rounded border px-2 py-1 cursor-pointer flex flex-row items-center group hover:bg-gray-100"
          onClick={() => {
            props.onPageOpenRequested(props.bookmark.page);
          }}
        >
          <div class="flex-1 flex flex-row gap-x-1 items-center overflow-x-hidden">
            <BookmarkIconPresenter bookmark={props.bookmark} />
            <span class="flex-1 truncate">
              {isNotNullOrEmptyString(props.bookmark.name) ? props.bookmark.name : props.bookmark.page}
            </span>
          </div>
          <div class="opacity-100 md:opacity-0 group-hover:opacity-100 flex flex-row gap-x-2">
            <BookmarkDeleteButton bookmark={props.bookmark} />
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                setIsEditMode(true);
              }}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
      </Show>
    </>
  );
};

interface BookmarkIconPresenterProps {
  bookmark: Bookmark;
}
const BookmarkIconPresenter: Component<BookmarkIconPresenterProps> = (props) => {
  return (
    <Switch fallback={<BookmarkIcon />}>
      <Match when={props.bookmark.error === 'MISSING_PAGE_FILE'}>
        <ErrorIcon />
      </Match>
    </Switch>
  );
};

interface EditorProps {
  currentBookmark: Bookmark;
  exitEditMode: () => void;
}
const BookmarkEditor: Component<EditorProps> = (props) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');
  const [currentName, setCurrentName] = createSignal(props.currentBookmark.name);
  const onDetermined = async () => {
    await bookService.updateBookmark(libCtx.library.id, bookCtx.book().id, props.currentBookmark.page, {
      name: currentName(),
    });
    bookCtx.reloadBook();
    props.exitEditMode();
  };

  return (
    <div class="rounded border p-2 flex flex-col gap-y-1">
      <div class="flex flex-row gap-x-1 items-center">
        <span>ブックマーク名:</span>
        <TextInput class="flex-1" value={currentName()} onChange={setCurrentName} />
      </div>
      <div class="flex flex-row justify-between items-center">
        <div>ページファイル名: {props.currentBookmark.page}</div>
        <div class="flex flex-row gap-x-1">
          <Button color="primary" onClick={onDetermined}>
            <CheckIcon />
          </Button>
          <Button onClick={props.exitEditMode}>
            <XIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DeleteButtonProps {
  bookmark: Bookmark;
}
const BookmarkDeleteButton: Component<DeleteButtonProps> = (props) => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');
  const [confirm, dialogNode] = useConfirmDialog();
  const onDelete = async () => {
    const bookmarkName = props.bookmark.name.length > 0 ? props.bookmark.name : props.bookmark.page;
    const result = await confirm({
      type: 'danger',
      description: `「${bookmarkName}」を削除しますか？`,
      okText: '削除',
    });
    if (result === 'confirmed') {
      bookService.deleteBookmark(libCtx.library.id, bookCtx.book().id, props.bookmark.page);
      bookCtx.reloadBook();
    }
  };

  return (
    <>
      <Button
        color="danger"
        onClick={(ev) => {
          ev.stopPropagation();
          onDelete();
        }}
      >
        <TrashIcon />
      </Button>
      {dialogNode()}
    </>
  );
};
