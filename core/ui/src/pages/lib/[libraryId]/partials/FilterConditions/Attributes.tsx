import { Component, createMemo, Match, Switch } from 'solid-js';
import { Button } from '../../../../../component/Button';
import { TextInput } from '../../../../../component/Form/Inputs';
import { SelectInput, SelectOption } from '../../../../../component/Form/Inputs/Select';
import { TrashIcon } from '../../../../../component/Icons';
import { BooksFilterAttributeOptionViewModel } from './Types';

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
  const currentAttrOption = createMemo(() => props.selectableAttrOptions.find((opt) => opt.id === props.currentId));
  const onChangeAttributeId = (id: string) => {
    props.onChangeValue('');
    props.onChangeId(id);
  };

  return (
    <div class="bg-blue-100 p-1 flex flex-row gap-x-2 items-center flex-wrap">
      <SelectInput class="w-32" options={attrOptionsLocal()} onChange={onChangeAttributeId} value={props.currentId} />
      <Switch>
        <Match when={currentAttrOption()?.valueType === 'STRING'}>
          <BasicAttributeFilterSetter currentValue={props.currentValue} onChangeValue={props.onChangeValue} />
        </Match>
        <Match when={currentAttrOption()?.valueType === 'INT'}>
          <BasicAttributeFilterSetter currentValue={props.currentValue} onChangeValue={props.onChangeValue} />
        </Match>
        <Match when={currentAttrOption()?.valueType === 'TAG'}>
          <TagAttributeFilterSetterProps
            currentValue={props.currentValue}
            onChangeValue={props.onChangeValue}
            tags={currentAttrOption()?.tags ?? []}
          />
        </Match>
      </Switch>
      <Button onClick={props.onDelete}>
        <TrashIcon />
      </Button>
    </div>
  );
};

interface BasicAttributeFilterSetterProps {
  currentValue: string;
  onChangeValue: (value: string) => void;
}
const BasicAttributeFilterSetter: Component<BasicAttributeFilterSetterProps> = (props) => {
  return (
    <>
      <span>に</span>
      <TextInput class="w-32" value={props.currentValue} onChange={props.onChangeValue} />
      <span>を含む</span>
    </>
  );
};

interface TagAttributeFilterSetterProps {
  currentValue: string;
  onChangeValue: (value: string) => void;
  tags: readonly string[];
}
const TagAttributeFilterSetterProps: Component<TagAttributeFilterSetterProps> = (props) => {
  const tagOptions = createMemo(() => props.tags.map((t): SelectOption<string> => ({ value: t, label: t })));

  return (
    <>
      <span>が</span>
      <SelectInput class="w-32" options={tagOptions()} value={props.currentValue} onChange={props.onChangeValue} />
    </>
  );
};
