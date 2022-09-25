import { BookAttribute } from '@local-core/interfaces';
import { Component, createSignal } from 'solid-js';
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
  return (
    <div class="flex flex-row justify-start">
      <div class="hover:bg-black/5 group px-1 transition-colors cursor-pointer" onClick={props.enterEditMode}>
        <span>{props.value}</span>
        <span class="pl-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">📝</span>
      </div>
    </div>
  );
};
