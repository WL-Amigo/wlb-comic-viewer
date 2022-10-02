import { Component, createMemo } from 'solid-js';
import { Button } from '../../../../../component/Button';
import { TextInput } from '../../../../../component/Form/Inputs';
import { SelectInput, SelectOption } from '../../../../../component/Form/Inputs/Select';

export interface BooksFilterAttributeOptionViewModel {
  id: string;
  displayName: string;
}

interface Props {
  selectableAttrOptions: readonly BooksFilterAttributeOptionViewModel[];
  currentId: string;
  onChangeId: (id: string) => void;
  currentValue: string;
  onChangeValue: (value: string) => void;
  onDelete: () => void;
}
export const BooksFilterConditionsAttributeFilterSetter: Component<Props> = (props) => {
  const attrOptionsLocal = createMemo(() =>
    props.selectableAttrOptions.map((opt): SelectOption<string> => ({ value: opt.id, label: opt.displayName })),
  );

  return (
    <div class="bg-blue-100 p-1 flex flex-row gap-x-2 items-center flex-wrap">
      <SelectInput class="w-32" options={attrOptionsLocal()} onChange={props.onChangeId} value={props.currentId} />
      <span>に</span>
      <TextInput class="w-32" value={props.currentValue} onChange={props.onChangeValue} />
      <span>を含む</span>
      <Button onClick={props.onDelete}>🗑️</Button>
    </div>
  );
};
