import { BookAttribute } from '@local-core/interfaces';
import { Component, createSignal, Match, Switch } from 'solid-js';
import { Button } from '../../../../../../../../../../../component/Button';
import { CheckIcon, XIcon } from '../../../../../../../../../../../component/Icons';
import { IntAttributeValueInput } from './Int';
import { StringAttributeValueInput } from './String';
import { TagAttributeValueInput } from './Tag';

interface Props {
  initValue: string;
  attribute: BookAttribute;
  onDetermined: (value: string) => void;
  onCancel: () => void;
}
export const BookAttributeEditor: Component<Props> = (props) => {
  const [value, setValue] = createSignal(props.initValue);

  const onDeterminedLocal = () => props.onDetermined(value());

  return (
    <div class="flex flex-row gap-x-2 items-center">
      <Switch>
        <Match when={props.attribute.valueType === 'STRING'}>
          <StringAttributeValueInput value={value()} onChange={setValue} />
        </Match>
        <Match when={props.attribute.valueType === 'INT'}>
          <IntAttributeValueInput value={value()} onChange={setValue} />
        </Match>
        <Match when={props.attribute.valueType === 'TAG'}>
          <TagAttributeValueInput value={value()} onChange={setValue} existingTags={props.attribute.existingTags} />
        </Match>
      </Switch>
      <Button onClick={props.onCancel}>
        <XIcon />
      </Button>
      <Button color="primary" onClick={onDeterminedLocal}>
        <CheckIcon />
      </Button>
    </div>
  );
};
