import clsx from 'clsx';
import { Component } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { windi } from '../../../utils/windi';

interface Props {
  class?: string;
  value: string;
  onChange: (value: string, ev: InputEvent) => void;
  isError?: boolean;
  ref?: JSX.InputHTMLAttributes<HTMLInputElement>['ref'];
}
export const TextInput: Component<Props> = (props) => {
  return (
    <input
      type="text"
      value={props.value}
      onInput={(ev) => props.onChange(ev.currentTarget.value, ev)}
      class={clsx(windi`border p-1 w-full`, props.isError && windi`border-red-400`, props.class)}
      ref={props.ref}
    />
  );
};
