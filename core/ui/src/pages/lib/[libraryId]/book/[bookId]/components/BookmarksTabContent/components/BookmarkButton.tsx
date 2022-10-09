import { Bookmark } from '@local-core/interfaces';
import { Component, createSignal, Show } from 'solid-js';
import { Button } from '../../../../../../../../component/Button';
import { TextInput } from '../../../../../../../../component/Form/Inputs';
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
          class="rounded border p-2 cursor-pointer flex flex-row justify-between items-center group"
          onClick={() => props.onPageOpenRequested(props.bookmark.page)}
        >
          <span>{isNotNullOrEmptyString(props.bookmark.name) ? props.bookmark.name : props.bookmark.page}</span>
          <div class="opacity-100 md:opacity-0 group-hover:opacity-100">
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                setIsEditMode(true);
              }}
            >
              📝
            </Button>
          </div>
        </div>
      </Show>
    </>
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
            ✅
          </Button>
          <Button onClick={props.exitEditMode}>✖️</Button>
        </div>
      </div>
    </div>
  );
};
