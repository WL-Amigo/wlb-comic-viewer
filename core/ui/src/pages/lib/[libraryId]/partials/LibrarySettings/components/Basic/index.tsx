import { Component } from 'solid-js';
import { FormTopGroupLabel } from '../../../../../../../component/Form/Group';
import { TextInput } from '../../../../../../../component/Form/Inputs/Text';

interface Props {
  libraryName: string;
  onChangeLibraryName: (libraryName: string) => void;
}

export const LibrarySettingsBasicPage: Component<Props> = (props) => {
  return (
    <div class="p-2 w-full h-full overflow-y-auto">
      <FormTopGroupLabel label="基本設定" />
      <div class="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-2 items-center">
        <div>ライブラリ名: </div>
        <TextInput value={props.libraryName} onChange={props.onChangeLibraryName} />
      </div>
    </div>
  );
};
