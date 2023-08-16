import { Component, For, Index, createSignal } from 'solid-js';
import { useLibraryDataContext } from '../../../../../Context';
import { useBookDataContext } from '../../../Context';
import { useService } from '../../../../../../../../compositions/Dependency';
import { Button } from '../../../../../../../../component/Button';
import { CheckIcon, EditIcon, PlusIcon, TrashIcon, XIcon } from '../../../../../../../../component/Icons';
import { TextInput } from '../../../../../../../../component/Form/Inputs';

export const IgnorePatternsViewAndEditor: Component = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');

  const [isEditMode, setIsEditMode] = createSignal(false);
  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => setIsEditMode(false);

  const onDetermined = async (nextPatterns: readonly string[]) => {
    await bookService.updateBook(libCtx.library().id, bookCtx.book().id, {
      ignorePatterns: nextPatterns,
    });
    bookCtx.reloadBook();
    exitEditMode();
  };

  return (
    <div class="flex flex-col items-start gap-1">
      <h2>除外するページのパスパターン</h2>
      {!isEditMode() ? (
        <Viewer ignorePatterns={bookCtx.book().ignorePatterns} enterEditMode={enterEditMode} />
      ) : (
        <Editor
          initIgnorePatterns={bookCtx.book().ignorePatterns}
          onDetermined={onDetermined}
          onCancel={exitEditMode}
        />
      )}
    </div>
  );
};

interface ViewerProps {
  ignorePatterns: readonly string[];
  enterEditMode: () => void;
}
const Viewer: Component<ViewerProps> = (props) => {
  return (
    <div class="flex flex-col items-start gap-1">
      <ul class="list-inside list-disc ml-3 py-1">
        <For each={props.ignorePatterns}>{(p) => <li>{p}</li>}</For>
      </ul>
      <Button onClick={props.enterEditMode}>
        <EditIcon />
        <span class="pl-2">編集</span>
      </Button>
    </div>
  );
};

interface EditorProps {
  initIgnorePatterns: readonly string[];
  onDetermined: (nextIgnorePatterns: readonly string[]) => void;
  onCancel: () => void;
}
const Editor: Component<EditorProps> = (props) => {
  const [values, setValues] = createSignal([...props.initIgnorePatterns]);
  const onDeterminedLocal = () => props.onDetermined(values());

  return (
    <div class="flex flex-col gap-2 items-start">
      <Index each={values()}>
        {(value, index) => (
          <div class="flex flex-row justify-start gap-x-2">
            <TextInput
              class="max-w-screen-md"
              value={value()}
              onChange={(next) =>
                setValues((prevValues) => {
                  const nextValues = [...prevValues];
                  nextValues.splice(index, 1, next);
                  return nextValues;
                })
              }
            />
            <Button onClick={() => setValues((prevValues) => prevValues.filter((_, i) => i !== index))}>
              <TrashIcon />
            </Button>
          </div>
        )}
      </Index>
      <Button onClick={() => setValues((prevValues) => [...prevValues, ''])}>
        <PlusIcon />
        <span class="pl-2">追加</span>
      </Button>
      <div class="flex flex-row justify-end gap-x-2">
        <Button onClick={props.onCancel}>
          <XIcon />
        </Button>
        <Button color="primary" onClick={onDeterminedLocal}>
          <CheckIcon />
        </Button>
      </div>
    </div>
  );
};
