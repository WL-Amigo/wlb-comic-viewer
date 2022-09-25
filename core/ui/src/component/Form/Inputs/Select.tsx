import clsx from 'clsx';
import { For } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { windi } from '../../../utils/windi';

export interface SelectOption<ValueType extends string> {
  value: ValueType;
  label: string;
}

interface Props<ValueType extends string> {
  value: ValueType;
  onChange: (value: ValueType) => void;
  options: readonly SelectOption<ValueType>[];
  class?: string;
}
export const SelectInput = <ValueType extends string>(props: Props<ValueType>): JSX.Element => {
  return (
    <select
      class={clsx(windi`bg-white w-full border`, props.class)}
      value={props.value}
      onChange={(ev) => props.onChange(ev.currentTarget.value as ValueType)}
    >
      <For each={props.options}>{(opt) => <option value={opt.value}>{opt.label}</option>}</For>
    </select>
  );
};
