import { Component, For, Index } from 'solid-js';
import { Button } from '../../../../../../../component/Button';
import { FormTopGroupLabel } from '../../../../../../../component/Form/Group';
import { BookAttributeSettingsFormValues, createNewBookAttributeSettingsValues } from '../../viewModels';
import { BookAttributeSettingsViewAndEditor } from './AttributeSettingsEditor';

interface Props {
  attributes: BookAttributeSettingsFormValues[];
  onChangeAttributes: (nextAttrs: BookAttributeSettingsFormValues[]) => void;
}
export const LibrarySettingsBookAttributesPage: Component<Props> = (props) => {
  const change = (index: number, attribute: BookAttributeSettingsFormValues) => {
    const next = [...props.attributes];
    next.splice(index, 1, attribute);
    props.onChangeAttributes(next);
  };
  const add = () => {
    props.onChangeAttributes([...props.attributes, createNewBookAttributeSettingsValues()]);
  };

  return (
    <div class="p-2 w-full h-full overflow-y-auto">
      <FormTopGroupLabel label="ブック属性設定" />
      <div class="flex flex-col gap-y-2">
        <For each={props.attributes}>
          {(item, index) => (
            <BookAttributeSettingsViewAndEditor attribute={item} onChange={(attr) => change(index(), attr)} />
          )}
        </For>
        <Button color="primary" onClick={add}>
          追加 ➕
        </Button>
      </div>
    </div>
  );
};
