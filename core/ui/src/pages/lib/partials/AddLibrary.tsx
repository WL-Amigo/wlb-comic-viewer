import { Component, createMemo, createSignal } from 'solid-js';
import { Button } from '../../../component/Button';
import { DirectorySelector } from '../../../component/DirectorySelector';
import { ModalBase } from '../../../component/ModalBase';
import { useService } from '../../../compositions/Dependency';

interface FormValues {
  name: string;
  dirPath: string;
}

interface AddLibraryButtonProps {
  onFinishAdd: () => void;
}
export const AddLibraryButton: Component<AddLibraryButtonProps> = (props) => {
  const libraryService = useService('libraryMutation');
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const closeDialog = () => setIsDialogOpen(false);
  const addLibrary = (values: FormValues) => {
    libraryService
      .createLibrary({
        name: values.name,
        rootDir: values.dirPath,
      })
      .then(() => {
        closeDialog();
        props.onFinishAdd();
      });
  };

  return (
    <>
      <button
        class="text-left border rounded p-2 text-lg no-underline text-black bg-blue-50 hover:bg-blue-100"
        onClick={() => setIsDialogOpen(true)}
      >
        ライブラリを追加する
      </button>
      <AddLibraryDialog isOpen={isDialogOpen()} onDetermined={addLibrary} onCancel={closeDialog} />
    </>
  );
};

interface AddLibraryDialogProps {
  isOpen: boolean;
  onDetermined: (values: FormValues) => void;
  onCancel: () => void;
}
const AddLibraryDialog: Component<AddLibraryDialogProps> = (props) => {
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
        <h2 class="text-lg">ライブラリを追加</h2>
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
            <DirectorySelector
              isOpen={isDirSelectorOpen()}
              onSelect={(path) => {
                setDirPath(path);
                setIsDirSelectorOpen(false);
              }}
              onCancel={() => setIsDirSelectorOpen(false)}
            />
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
