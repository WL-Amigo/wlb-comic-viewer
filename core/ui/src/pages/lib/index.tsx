import { Link } from 'solid-app-router';
import { Component, createResource, For } from 'solid-js';
import { useService } from '../../compositions/Dependency';
import { AddLibraryButton } from './partials/AddLibrary';

export const LibraryListPage: Component = () => {
  const libraryService = useService('library');
  const [libraries, { refetch }] = createResource(() => libraryService.loadAllLibraries());

  return (
    <div class="container mx-auto w-full h-full overflow-y-auto">
      <div class="py-4">
        <h1 class="text-xl pb-2">ライブラリ選択</h1>
        <div class="flex flex-col gap-y-2">
          <For each={libraries()}>
            {(library) => (
              <Link
                href={`/lib/${library.id}/`}
                class="border rounded p-2 text-lg no-underline text-black hover:bg-gray-100"
              >
                <span>{library.name}</span>
              </Link>
            )}
          </For>
          <AddLibraryButton onFinishAdd={refetch} />
        </div>
      </div>
    </div>
  );
};
