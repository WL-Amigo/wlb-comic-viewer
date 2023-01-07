import { Component, createMemo, createResource, createSignal, Show } from 'solid-js';
import { Button } from '../../../../component/Button';
import { DirectorySelector } from '../../../../component/DirectorySelector';
import { PlusIcon } from '../../../../component/Icons';
import { ModalBase } from '../../../../component/ModalBase';
import { useService } from '../../../../compositions/Dependency';
import { useLibraryDataContext } from '../Context';

interface FormValues {
  name: string;
  dirPath: string;
}

interface AddBookButtonProps {
  onFinishAdd: () => void;
}
export const AddBookButton: Component<AddBookButtonProps> = (props) => {
  const { library } = useLibraryDataContext();
  const bookService = useService('bookMutation');
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const closeDialog = () => setIsDialogOpen(false);
  const addBook = (values: FormValues) => {
    bookService
      .createBook(library().id, {
        name: values.name,
        dir: values.dirPath,
      })
      .then(() => {
        closeDialog();
        props.onFinishAdd();
      });
  };

  return (
    <>
      <button
        class="flex flex-row items-center gap-x-1 border rounded p-2 text-lg no-underline text-black bg-blue-50 hover:bg-blue-100"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusIcon />
        <span>ブックを追加する</span>
      </button>
      <AddBookDialog isOpen={isDialogOpen()} onDetermined={addBook} onCancel={closeDialog} />
    </>
  );
};

interface AddBookDialogProps {
  isOpen: boolean;
  onDetermined: (values: FormValues) => void;
  onCancel: () => void;
}
const AddBookDialog: Component<AddBookDialogProps> = (props) => {
  const { library } = useLibraryDataContext();
  const libraryService = useService('library');
  const [booksDirData] = createResource(
    () => props.isOpen,
    () => libraryService.getRegisteredBooksDir(library().id),
  );
  const [libSettings] = createResource(
    () => props.isOpen,
    () => libraryService.loadLibrarySettings(library().id),
  );
  const [nameValue, setName] = createSignal('');
  const [dirPath, setDirPath] = createSignal<string | null>(null);
  const canSave = createMemo(() => dirPath() !== null);
  const [isDirSelectorOpen, setIsDirSelectorOpen] = createSignal(false);
  const onDeterminedLocal = () => {
    props.onDetermined({
      name: nameValue(),
      dirPath: dirPath() ?? '',
    });
  };

  return (
    <ModalBase open={props.isOpen} onClickAway={props.onCancel}>
      <div class="p-4 bg-white rounded flex flex-col gap-y-2" onClick={(ev) => ev.stopPropagation()}>
        <h2 class="text-lg">ブックを追加</h2>
        <div class="grid grid-cols-[auto,1fr] gap-2 items-center">
          <span>名前:</span>
          <input
            type="text"
            class="border p-1"
            onChange={(ev) => setName(ev.currentTarget.value)}
            value={nameValue()}
          />
          <span>ディレクトリ:</span>
          <div class="flex flex-row items-center">
            <span class="flex-1">{dirPath()}</span>
            <Button onClick={() => setIsDirSelectorOpen(true)} color="primary">
              選択
            </Button>
            <Show when={libSettings() && booksDirData()}>
              <DirectorySelector
                isOpen={isDirSelectorOpen()}
                onSelect={(path) => {
                  setDirPath(path);
                  setIsDirSelectorOpen(false);
                }}
                onCancel={() => setIsDirSelectorOpen(false)}
                disableDirPathList={booksDirData()}
                baseDirPath={libSettings()?.rootDir}
              />
            </Show>
          </div>
        </div>
        <div class="flex flex-row justify-end gap-x-2">
          <Button onClick={props.onCancel}>キャンセル</Button>
          <Button onClick={onDeterminedLocal} disabled={!canSave()} color="primary">
            追加
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};
