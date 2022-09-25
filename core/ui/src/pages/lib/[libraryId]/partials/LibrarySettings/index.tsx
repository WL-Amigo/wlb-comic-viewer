import { Component, createSignal, For, Match, Show, Switch } from 'solid-js';
import { Button } from '../../../../../component/Button';
import { ModalBase } from '../../../../../component/ModalBase';
import { z } from 'zod';
import clsx from 'clsx';
import { windi } from '../../../../../utils/windi';
import { LibrarySettingsFormValues } from './viewModels/FormValues';
import { useLibrarySettingsLoader, useLibrarySettingsUpdater } from './viewModels';
import { LibrarySettingsBasicPage } from './components/Basic';
import { LibrarySettingsBookAttributesPage } from './components/BookAttributes';
import { SelectInput } from '../../../../../component/Form/Inputs/Select';

const PagesSchema = z.enum(['basic', 'book-attributes']);
type Pages = z.infer<typeof PagesSchema>;
const AllPages = PagesSchema.options;
const PageEnumToTextMap: Record<Pages, string> = {
  basic: '基本',
  'book-attributes': 'ブック属性',
};

interface Props {
  open: boolean;
  libraryId: string;
  onRequestedReload: () => void;
  onClose: () => void;
}
export const LibrarySettingsDialog: Component<Props> = (props) => {
  const initValues = useLibrarySettingsLoader(() => (props.open ? props.libraryId : undefined));
  return (
    <ModalBase open={props.open}>
      <Show when={initValues()}>
        {(initValues) => (
          <DialogBody
            libraryId={props.libraryId}
            initValues={initValues}
            onRequestedReload={props.onRequestedReload}
            onClose={props.onClose}
          />
        )}
      </Show>
    </ModalBase>
  );
};

interface BodyProps {
  libraryId: string;
  initValues: LibrarySettingsFormValues;
  onRequestedReload: () => void;
  onClose: () => void;
}
const DialogBody: Component<BodyProps> = (props) => {
  const [currentPage, setCurrentPage] = createSignal<Pages>('basic');
  const [values, setValues] = createSignal(props.initValues);
  const patchValues = (partial: Partial<LibrarySettingsFormValues>) => setValues((prev) => ({ ...prev, ...partial }));

  const { updateLibrary, isSaving } = useLibrarySettingsUpdater(() => props.libraryId);
  const onDetermine = async () => {
    await updateLibrary(values());
    props.onRequestedReload();
    props.onClose();
  };

  return (
    <div class="bg-white md:rounded flex flex-col w-full h-full max-w-screen-md max-h-540px overflow-hidden relative">
      <div class="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
        <SideMenu currentPage={currentPage()} onChangePage={setCurrentPage} />
        <div class="flex-1 overflow-hidden">
          <Switch>
            <Match when={currentPage() === 'basic'}>
              <LibrarySettingsBasicPage
                libraryName={values().name}
                onChangeLibraryName={(name) => patchValues({ name })}
              />
            </Match>
            <Match when={currentPage() === 'book-attributes'}>
              <LibrarySettingsBookAttributesPage
                attributes={values().attributes}
                onChangeAttributes={(nextAttrs) => patchValues({ attributes: nextAttrs })}
              />
            </Match>
          </Switch>
        </div>
      </div>
      <div class="flex flex-row justify-end gap-x-2 p-2 border-t border-gray-200">
        <Button onClick={props.onClose}>キャンセル</Button>
        <Button color="primary" onClick={onDetermine}>
          設定を適用
        </Button>
      </div>
      <Show when={isSaving()}>
        <div class="absolute inset-0 w-full h-full bg-white/50 flex flex-col justify-center items-center">
          <span>保存中…</span>
        </div>
      </Show>
    </div>
  );
};

interface SideMenuProps {
  currentPage: Pages;
  onChangePage: (page: Pages) => void;
}
const SideMenu: Component<SideMenuProps> = (props) => {
  return (
    <>
      <div class="hidden md:flex flex-col border-r border-gray-200 flex-shrink-0 w-48">
        <For each={AllPages}>
          {(page) => (
            <button
              class={clsx(
                windi`py-3 px-2 text-left`,
                props.currentPage === page ? windi`bg-blue-200` : windi`bg-white hover:bg-blue-50`,
              )}
              onClick={() => props.onChangePage(page)}
            >
              {PageEnumToTextMap[page]}
            </button>
          )}
        </For>
      </div>
      <div class="flex md:hidden flex-row justify-center p-2 border-b border-gray-200">
        <SelectInput
          class="text-lg"
          value={props.currentPage}
          onChange={props.onChangePage}
          options={AllPages.map((p) => ({ value: p, label: PageEnumToTextMap[p] }))}
        />
      </div>
    </>
  );
};
