import { Component } from 'solid-js';
import { TextInput } from '../../../../../../../../../../../component/Form/Inputs';
import { AttributeValueInputProps } from './Types';

export const StringAttributeValueInput: Component<AttributeValueInputProps> = (props) => {
  return <TextInput class="flex-1 max-w-screen-md" value={props.value} onChange={props.onChange} />;
};
