import { createInputMask } from '@solid-primitives/input-mask';
import { Component } from 'solid-js';
import { TextInput } from '../../../../../../../../../../../component/Form/Inputs';
import { AttributeValueInputProps } from './Types';

const filterOnlyIntRegexp = /(\d+)/;

export const IntAttributeValueInput: Component<AttributeValueInputProps> = (props) => {
  const maskHandler = createInputMask([filterOnlyIntRegexp]);
  const onInput = (_: string, ev: InputEvent) => {
    props.onChange(maskHandler(ev));
  };

  return <TextInput class="flex-1 max-w-screen-md" value={props.value} onChange={onInput} />;
};
