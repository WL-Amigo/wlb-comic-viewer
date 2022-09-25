import clsx from 'clsx';
import { ParentComponent } from 'solid-js';
import { windi } from '../../../utils/windi';

interface TopGroupLabelProps {
  label: string;
  class?: string;
}
export const FormTopGroupLabel: ParentComponent<TopGroupLabelProps> = (props) => {
  return <h1 class={clsx(windi`text-xl font-bold mb-3`, props.class)}>{props.label}</h1>;
};
