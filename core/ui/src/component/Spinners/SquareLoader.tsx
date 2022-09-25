import clsx from 'clsx';
import { Component } from 'solid-js';
import './SquareLoader.css';

interface Props {
  class?: string;
  size?: 'sm' | '2x' | '3x';
  isLoading?: boolean;
}
export const SquareLoader: Component<Props> = (props) => {
  const className = () => (props.size ? `la-${props.size}` : '');

  return (
    props.isLoading && (
      <div class="transition-opacity bg-white/25 absolute inset-0 flex justify-center items-center">
        <div class={clsx('la-square-loader', className())}>
          <div />
        </div>
      </div>
    )
  );
};
