import { Link } from 'solid-app-router';
import { Component, createSignal, For, onMount } from 'solid-js';
import { BookIcon, CheckCircleIcon, CogIcon, StarIcon, UndoIcon } from '../../../component/Icons';
import { useLibraryDataContext } from './Context';
import { AddBookButton } from './partials/AddBook';
import { LibraryBooksFilterConditions } from './partials/FilterConditions';
import { LibrarySettingsDialog } from './partials/LibrarySettings';

export const BookListPage: Component = () => {
  const libCtx = useLibraryDataContext();
  onMount(() => libCtx.reloadLibrary());

  return (
    <div class="container mx-auto w-full h-full overflow-hidden flex flex-col">
      <div class="flex-shrink-0 p-2 flex flex-row items-center gap-x-2 w-full">
        <Link
          class="no-underline text-black flex flex-row items-center gap-x-1 bg-gray-50 hover:bg-gray-100 p-1"
          href="../"
        >
          <UndoIcon />
          <span class="hidden md:block">ライブラリ選択へ戻る</span>
        </Link>
        <span class="text-xl">{libCtx.library().name}</span>
        <div class="flex-1" />
        <SettingsButton libraryId={libCtx.library().id} onRequestedReload={libCtx.reloadLibrary} />
      </div>
      <LibraryBooksFilterConditions />
      <div class="flex-1 overflow-y-auto">
        <div class="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <For each={libCtx.library().books}>
            {(book) => (
              <Link
                class="no-underline text-black p-2 rounded-lg border flex flex-row hover:bg-gray-100"
                href={`book/${encodeURIComponent(book.id)}/`}
              >
                <div class="flex-1 flex flex-row items-center gap-x-1 overflow-hidden">
                  {book.builtinAttributes.isFavorite ? (
                    <StarIcon class="w-6 h-6 flex-shrink-0 text-yellow-500" />
                  ) : (
                    <BookIcon class="w-6 h-6 flex-shrink-0" />
                  )}
                  <span class="truncate">{book.name}</span>
                </div>
                {book.isRead && (
                  <div class="flex flex-row items-center gap-x-1 flex-shrink-0">
                    <CheckCircleIcon class="w-6 h-6 text-green-600" />
                    <span>読了</span>
                  </div>
                )}
              </Link>
            )}
          </For>
          <AddBookButton onFinishAdd={() => libCtx.reloadLibrary()} />
        </div>
      </div>
    </div>
  );
};

interface SettingsButtonProps {
  libraryId: string;
  onRequestedReload: () => void;
}
const SettingsButton: Component<SettingsButtonProps> = (props) => {
  const [open, setIsOpen] = createSignal(false);
  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <>
      <button class="w-8 h-8 p-1 bg-gray-50 hover:bg-gray-100" onClick={toggleIsOpen}>
        <CogIcon class="w-full h-full" />
      </button>
      <LibrarySettingsDialog
        libraryId={props.libraryId}
        open={open()}
        onRequestedReload={props.onRequestedReload}
        onClose={toggleIsOpen}
      />
    </>
  );
};
