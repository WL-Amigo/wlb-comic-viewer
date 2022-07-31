import { Link } from 'solid-app-router';
import { Component, For } from 'solid-js';
import { useLibraryDataContext } from './Context';
import { AddBookButton } from './partials/AddBook';

export const BookListPage: Component = () => {
  const libCtx = useLibraryDataContext();

  return (
    <div class="container mx-auto w-full h-full overflow-hidden flex flex-col">
      <div class="flex-shrink-0 p-2 flex flex-row items-center gap-x-2">
        <Link class="no-underline text-black " href="../">
          ＜ライブラリ選択へ戻る
        </Link>
        <span class="text-xl">{libCtx.library.name}</span>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <For each={libCtx.library.books}>
            {(book) => (
              <Link class="no-underline text-black p-2 rounded-lg border" href={`book/${encodeURIComponent(book.id)}/`}>
                {book.name}
              </Link>
            )}
          </For>
          <AddBookButton onFinishAdd={() => libCtx.reloadLibrary()} />
        </div>
      </div>
    </div>
  );
};
