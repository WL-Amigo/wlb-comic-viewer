import { BookAttribute } from '@local-core/interfaces';
import clsx from 'clsx';
import { Component, createMemo, createSignal, Show } from 'solid-js';
import { EditIcon } from '../../../../../../../../../component/Icons';
import { isNotNullOrEmptyString } from '../../../../../../../../../utils/emptiness';
import { windi } from '../../../../../../../../../utils/windi';
import { BookAttributeEditor } from './components/Editor';

interface Props {
  attribute: BookAttribute;
  onDetermine: (id: string, value: string) => Promise<void>;
}
export const BookAttributeViewAndEditor: Component<Props> = (props) => {
  const [isEditMode, setIsEditMode] = createSignal(false);
  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => setIsEditMode(false);
  const onDetermineLocal = (value: string) => {
    props.onDetermine(props.attribute.id, value);
    exitEditMode();
  };

  return (
    <>
      <div>{props.attribute.displayName}:</div>
      {!isEditMode() ? (
        <ValueViewer value={props.attribute.value} enterEditMode={enterEditMode} />
      ) : (
        <BookAttributeEditor
          initValue={props.attribute.value}
          valueType={props.attribute.valueType}
          onDetermined={onDetermineLocal}
          onCancel={exitEditMode}
        />
      )}
    </>
  );
};

interface ViewerProps {
  value: string;
  enterEditMode: () => void;
}
const ValueViewer: Component<ViewerProps> = (props) => {
  const isValueNotEmpty = createMemo(() => isNotNullOrEmptyString(props.value));

  return (
    <div class="flex flex-row justify-start">
      <div
        class="hover:bg-black/5 group p-1 transition-colors cursor-pointer flex flex-row items-center gap-x-1"
        onClick={props.enterEditMode}
      >
        <Show when={isValueNotEmpty()}>
          <span>{props.value}</span>
        </Show>
        <EditIcon
          class={clsx(
            windi`w-6 h-6 md:group-hover:opacity-100 transition-opacity`,
            isValueNotEmpty() ? windi`md:opacity-0` : windi`md:opacity-25`,
          )}
        />
      </div>
    </div>
  );
};
