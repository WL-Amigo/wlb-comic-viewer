import { BookAttributeValueType } from '@local-core/interfaces';
import { Component, createSignal } from 'solid-js';
import { Button } from '../../../../../../../component/Button';
import { TextInput } from '../../../../../../../component/Form/Inputs';
import { SelectInput, SelectOption } from '../../../../../../../component/Form/Inputs/Select';
import { BookAttributeSettingsFormValues } from '../../viewModels';

interface Props {
  attribute: BookAttributeSettingsFormValues;
  onChange: (attribute: BookAttributeSettingsFormValues) => void;
}
export const BookAttributeSettingsViewAndEditor: Component<Props> = (props) => {
  const [isEditMode, setIsEditMode] = createSignal(false);
  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  return (
    <div class="p-2 rounded bg-gray-100">
      {isEditMode() ? (
        <Editor
          initValues={props.attribute}
          onFinishEdit={(values) => {
            props.onChange(values);
            toggleEditMode();
          }}
          onCancel={toggleEditMode}
        />
      ) : (
        <Viewer attribute={props.attribute} onEnterEditMode={toggleEditMode} />
      )}
    </div>
  );
};

interface ViewerProps {
  attribute: BookAttributeSettingsFormValues;
  onEnterEditMode: () => void;
}
const Viewer: Component<ViewerProps> = (props) => {
  return (
    <>
      <div class="flex flex-row justify-between">
        <div class="text-lg font-medium">{props.attribute.displayName}</div>
        <div class="flex flex-row gap-x-2">
          <Button onClick={props.onEnterEditMode}>📝</Button>
        </div>
      </div>
      <div class="text-gray-500 grid gap-2 grid-cols-1 md:grid-cols-2">
        <div>{`ID: ${props.attribute.id ?? '(適用時に自動的に生成します)'}`}</div>
        <div>{`タイプ: ${props.attribute.valueType}`}</div>
      </div>
    </>
  );
};

const ValueTypeSelectOptions: readonly SelectOption<BookAttributeValueType>[] = [
  { value: 'STRING', label: 'STRING' },
  { value: 'INT', label: 'INT' },
];

interface EditorProps {
  initValues: BookAttributeSettingsFormValues;
  onFinishEdit: (values: BookAttributeSettingsFormValues) => void;
  onCancel: () => void;
}
const Editor: Component<EditorProps> = (props) => {
  const [values, setValues] = createSignal(props.initValues);
  const patchValues = (partial: Partial<BookAttributeSettingsFormValues>) =>
    setValues((prev) => ({ ...prev, ...partial }));

  const isDisplayNameError = () => values().displayName.length === 0;
  const hasValidationError = () => isDisplayNameError();

  return (
    <div class="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-2 items-center">
      <div>属性名: </div>
      <TextInput
        value={values().displayName}
        onChange={(displayName) => patchValues({ displayName })}
        isError={isDisplayNameError()}
      />
      <div>タイプ: </div>
      <SelectInput
        value={values().valueType}
        onChange={(valueType) => patchValues({ valueType })}
        options={ValueTypeSelectOptions}
      />
      <div>ID: </div>
      {values().isNew ? (
        <TextInput value={values().id ?? ''} onChange={(id) => patchValues({ id })} />
      ) : (
        <div>{values().id}</div>
      )}
      <div class="col-span-full flex flex-row justify-end gap-x-2">
        <Button onClick={props.onCancel}>❌</Button>
        <Button onClick={() => props.onFinishEdit(values())} disabled={hasValidationError()} color="primary">
          ✅
        </Button>
      </div>
    </div>
  );
};
