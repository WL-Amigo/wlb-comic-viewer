import { BookAttributeValueType } from '@local-core/interfaces';
import { createInputMask } from '@solid-primitives/input-mask';
import { Component, createSignal } from 'solid-js';
import { match } from 'ts-pattern';
import { Button } from '../../../../../../../../../../../component/Button';
import { TextInput } from '../../../../../../../../../../../component/Form/Inputs';
import { CheckIcon, XIcon } from '../../../../../../../../../../../component/Icons';

const filterOnlyIntRegexp = /(\d+)/;

interface Props {
  initValue: string;
  valueType: BookAttributeValueType;
  onDetermined: (value: string) => void;
  onCancel: () => void;
}
export const BookAttributeEditor: Component<Props> = (props) => {
  const [value, setValue] = createSignal(props.initValue);

  const onInput = match<BookAttributeValueType, (value: string, ev: InputEvent) => void>(props.valueType)
    .with('STRING', () => setValue)
    .with('INT', () => {
      const maskHandler = createInputMask([filterOnlyIntRegexp]);
      return (_, ev) => setValue(maskHandler(ev));
    })
    .exhaustive();

  const onDeterminedLocal = () => props.onDetermined(value());

  return (
    <div class="flex flex-row gap-x-2">
      <Button onClick={onDeterminedLocal}>
        <CheckIcon />
      </Button>
      <Button onClick={props.onCancel}>
        <XIcon />
      </Button>
      <TextInput class="flex-1 max-w-screen-md" value={value()} onChange={onInput} />
    </div>
  );
};
