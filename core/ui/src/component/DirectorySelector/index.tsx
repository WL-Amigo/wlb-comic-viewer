import clsx from 'clsx';
import { Component, createMemo, createResource, createSignal, For, Show } from 'solid-js';
import { useService } from '../../compositions/Dependency';
import { windi } from '../../utils/windi';
import { Button } from '../Button';
import { ModalBase } from '../ModalBase';

interface Props {
  onSelect: (path: string) => void;
  onCancel: () => void;
  initOpenDirPath?: string;
  baseDirPath?: string;
  isOpen: boolean;
}
const Modal: Component<Props> = (props) => {
  return (
    <ModalBase open={props.isOpen} onClickAway={props.onCancel}>
      <Body {...props} />
    </ModalBase>
  );
};

const Body: Component<Props> = (props) => {
  const [selectedPath, setSelectedPath] = createSignal(props.initOpenDirPath ?? null);
  const canDetermine = createMemo(() => selectedPath() !== null);
  const determineDir = () => {
    let path = selectedPath() ?? '';
    if (props.baseDirPath) {
      path = path.replace(props.baseDirPath, '');
    }
    props.onSelect(path);
  };

  return (
    <div
      class="p-4 bg-white rounded w-full max-w-screen-xl h-auto max-h-full overflow-y-hidden flex flex-col gap-y-2"
      onClick={(ev) => ev.stopPropagation()}
    >
      <div class="p-1 rounded border flex-1 overflow-y-auto">
        <DirList self={props.baseDirPath ?? '/'} selected={selectedPath()} onSelect={setSelectedPath} />
      </div>
      <div class="flex flex-row gap-x-2 justify-end">
        <Button onClick={props.onCancel}>キャンセル</Button>
        <Button onClick={determineDir} disabled={!canDetermine()} color="primary">
          選択
        </Button>
      </div>
    </div>
  );
};

interface DirListProps {
  self: string;
  selected: string | null;
  onSelect: (path: string) => void;
}
const DirList: Component<DirListProps> = (props) => {
  const directoryService = useService('directory');
  const [data] = createResource(
    () => props.self,
    (root) => directoryService.getDirectories(root),
  );

  return (
    <div class="flex flex-col gap-y-1">
      <For
        each={data()}
        fallback={
          data.loading ? <span>loading...</span> : <span class="text-gray-500">子ディレクトリはありません</span>
        }
      >
        {(item) => <DirEntry self={props.self + item} selected={props.selected} onSelect={props.onSelect} />}
      </For>
    </div>
  );
};

interface DirEntryProps {
  self: string;
  selected: string | null;
  onSelect: (path: string) => void;
}
const DirEntry: Component<DirEntryProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(props.selected?.startsWith(props.self) ?? false);
  const selfName = createMemo(() => props.self.split('/').at(-2));
  const isSelected = createMemo(() => props.self === props.selected);

  return (
    <div class="flex flex-col">
      <div class={clsx(windi`flex flex-row gap-x-2`, isSelected() && windi`bg-blue-100`)}>
        <button class="text-left" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen() ? '-' : '+'}
        </button>
        <button class="text-left" onClick={() => props.onSelect(props.self)}>
          {selfName()}
        </button>
      </div>
      <Show when={isOpen()}>
        <div class="pl-4">
          <DirList {...props} />
        </div>
      </Show>
    </div>
  );
};

export const DirectorySelector = Modal;
