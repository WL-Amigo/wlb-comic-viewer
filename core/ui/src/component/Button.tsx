import clsx from 'clsx';
import { createMemo, ParentComponent } from 'solid-js';
import { match } from 'ts-pattern';
import { windi } from '../utils/windi';
import type { JSX } from 'solid-js/jsx-runtime';

interface Props {
  color?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  class?: string;
}
export const Button: ParentComponent<Props> = (props) => {
  const colorClasses = createMemo(() => {
    return match(props.color ?? 'default')
      .with('default', () => windi`bg-white hover:bg-gray-100 border-gray-400`)
      .with(
        'primary',
        () =>
          windi`border-blue-700 bg-blue-700 text-white hover:bg-blue-500 hover:border-blue-500 disabled:hover:bg-blue-700 disabled:hover:border-blue-700`,
      )
      .with(
        'danger',
        () =>
          windi`border-red-700 bg-red-700 text-white hover:bg-red-500 hover:border-red-500 disabled:hover:bg-red-700 disabled:hover:border-red-700`,
      )
      .exhaustive();
  });

  return (
    <button
      class={clsx(
        windi`border rounded px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex flex-row items-center justify-center`,
        colorClasses(),
        props.class,
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
