import { Component, createSignal, For } from 'solid-js';
import { SquareLoader } from '../../../../../../../component/Spinners/SquareLoader';
import { useService } from '../../../../../../../compositions/Dependency';
import { useLibraryDataContext } from '../../../../Context';
import { useBookDataContext } from '../../Context';
import { UpdateKnownPagesButton } from './components/UpdateKnownPagesButton';
import { BookAttributeViewAndEditor } from './components/AttributeViewAndEditor';
import { BookNameViewAndEditor } from './components/NameViewAndEditor';

export const BookDescriptionTabContent: Component = () => {
  return (
    <div class="w-full h-full overflow-y-auto p-2 flex flex-col gap-y-2">
      <BookAttributeSection />
    </div>
  );
};

const BookAttributeSection: Component = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');

  const [isSaving, setIsSaving] = createSignal(false);
  const onChangeAttr = async (id: string, value: string) => {
    setIsSaving(true);
    try {
      await bookService.updateAttributes(libCtx.library().id, bookCtx.book().id, [{ id, value }]);
      bookCtx.reloadBook();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="w-full relative flex flex-col gap-y-6">
      <section>
        <h2 class="text-lg pb-2">基本情報</h2>
        <BookNameViewAndEditor />
      </section>
      <section>
        <h2 class="text-lg pb-2">属性</h2>
        <div class="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-x-2 gap-y-1 items-center">
          <For each={bookCtx.book().attributes}>
            {(item) => <BookAttributeViewAndEditor attribute={item} onDetermine={onChangeAttr} />}
          </For>
        </div>
      </section>
      <section>
        <h2 class="text-lg pb-2">操作</h2>
        <div>
          <UpdateKnownPagesButton />
        </div>
      </section>
      <SquareLoader isLoading={isSaving()} />
    </div>
  );
};
