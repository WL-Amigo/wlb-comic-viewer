import { Link } from 'solid-app-router';
import { Component, createSignal, For } from 'solid-js';
import { useLibraryDataContext } from './Context';
import { AddBookButton } from './partials/AddBook';
import { LibrarySettingsDialog } from './partials/LibrarySettings';

export const BookListPage: Component = () => {
  const libCtx = useLibraryDataContext();

  return (
    <div class="container mx-auto w-full h-full overflow-hidden flex flex-col">
      <div class="flex-shrink-0 p-2 flex flex-row items-center gap-x-2 w-full">
        <Link class="no-underline text-black " href="../">
          ＜ライブラリ選択へ戻る
        </Link>
        <span class="text-xl">{libCtx.library.name}</span>
        <div class="flex-1" />
        <SettingsButton libraryId={libCtx.library.id} onRequestedReload={libCtx.reloadLibrary} />
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <For each={libCtx.library.books}>
            {(book) => (
              <Link
                class="no-underline text-black p-2 rounded-lg border flex flex-row"
                href={`book/${encodeURIComponent(book.id)}/`}
              >
                <span class="flex-1">{book.name}</span>
                {book.isRead && (
                  <div class="flex flex-row items-center">
                    <span>✅</span>
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
      <button onClick={toggleIsOpen}>⚙</button>
      <LibrarySettingsDialog
        libraryId={props.libraryId}
        open={open()}
        onRequestedReload={props.onRequestedReload}
        onClose={toggleIsOpen}
      />
    </>
  );
};
