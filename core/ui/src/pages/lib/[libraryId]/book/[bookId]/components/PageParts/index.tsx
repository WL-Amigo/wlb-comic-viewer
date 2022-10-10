import clsx from 'clsx';
import { Component, Show } from 'solid-js';
import { CheckCircleIcon } from '../../../../../../../component/Icons';
import { windi } from '../../../../../../../utils/windi';

interface IsReadMarkProps {
  isRead: boolean;
  class?: string;
}
export const IsReadMark: Component<IsReadMarkProps> = (props) => (
  <Show when={props.isRead}>
    <div class={clsx(windi`flex flex-row items-center gap-x-1`, props.class)}>
      <CheckCircleIcon class="w-6 h-6 text-green-600" />
      <span>読了</span>
    </div>
  </Show>
);
