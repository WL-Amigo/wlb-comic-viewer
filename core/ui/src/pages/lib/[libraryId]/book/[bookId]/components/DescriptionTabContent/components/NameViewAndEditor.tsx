import { Component, createSignal } from 'solid-js';
import { Button } from '../../../../../../../../component/Button';
import { TextInput } from '../../../../../../../../component/Form/Inputs';
import { CheckIcon, EditIcon, XIcon } from '../../../../../../../../component/Icons';
import { useService } from '../../../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../../../Context';
import { useBookDataContext } from '../../../Context';

export const BookNameViewAndEditor: Component = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');

  const [isEditMode, setIsEditMode] = createSignal(false);
  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => setIsEditMode(false);

  const onDetermined = async (nextName: string) => {
    await bookService.updateBook(libCtx.library().id, bookCtx.book().id, {
      name: nextName,
    });
    bookCtx.reloadBook();
    exitEditMode();
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-x-2 gap-y-1 items-center">
      <span>名前: </span>
      {!isEditMode() ? (
        <NameViewer currentName={bookCtx.book().name} enterEditMode={enterEditMode} />
      ) : (
        <NameEditor initName={bookCtx.book().name} onDetermined={onDetermined} onCancel={exitEditMode} />
      )}
    </div>
  );
};

interface NameViewerProps {
  currentName: string;
  enterEditMode: () => void;
}
const NameViewer: Component<NameViewerProps> = (props) => {
  return (
    <div
      class="hover:bg-black/5 group p-1 transition-colors cursor-pointer flex flex-row items-center gap-x-1"
      onClick={props.enterEditMode}
    >
      <span>{props.currentName}</span>
      <EditIcon class="w-6 h-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

interface NameEditorProps {
  initName: string;
  onDetermined: (nextName: string) => void;
  onCancel: () => void;
}
const NameEditor: Component<NameEditorProps> = (props) => {
  const [value, setValue] = createSignal(props.initName);

  const onDeterminedLocal = () => props.onDetermined(value());

  return (
    <div class="flex flex-col md:flex-row gap-2">
      <TextInput class="max-w-screen-md" value={value()} onChange={setValue} />
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
