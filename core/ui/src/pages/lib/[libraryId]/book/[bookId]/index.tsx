import clsx from 'clsx';
import { Link } from 'solid-app-router';
import { Component, createSignal, Match, ParentComponent, Switch } from 'solid-js';
import { windi } from '../../../../../utils/windi';
import { useLibraryDataContext } from '../../Context';
import { AllPagesTabContent } from './components/AllPagesTabContent';
import { BookmarksTabContent } from './components/BookmarksTabContent';
import { BookViewer } from './components/BookViewer';
import { useBookDataContext } from './Context';

type TabKeys = 'bookmarks' | 'pages';

const TabButton: ParentComponent<{ onClick: () => void; isActive: boolean }> = (props) => (
  <button
    class={clsx(
      windi`px-4 py-2`,
      props.isActive ? windi`bg-blue-600 text-white` : windi`bg-white text-blue-900 hover:bg-blue-100`,
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export const BookMainPage: Component = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const [tab, setTab] = createSignal<TabKeys>('bookmarks');
  const [isViewerOpen, setIsViewerOpen] = createSignal(false);
  const [firstOpenPageIndex, setFirstOpenPageIndex] = createSignal(0);
  const onPageOpenRequested = (pageName: string) => {
    const idx = bookCtx.book.pages.indexOf(pageName);
    if (idx >= 0) {
      setFirstOpenPageIndex(idx);
      setIsViewerOpen(true);
    }
  };
  const closeViewer = () => setIsViewerOpen(false);

  return (
    <div class="container mx-auto w-full h-full overflow-hidden flex flex-col">
      <div class="flex-shrink-0 p-2 flex flex-row items-center gap-x-2">
        <Link class="px-2 py-1 hover:bg-gray-100 no-underline text-black" href="../..">
          ＜ライブラリへ戻る
        </Link>
        <span class="text-xl">
          {libCtx.library.name}/{bookCtx.book.name}
        </span>
      </div>
      <div class="flex-shrink-0 py-1 px-2 flex flex-row gap-x-2">
        <TabButton isActive={tab() === 'bookmarks'} onClick={() => setTab('bookmarks')}>
          ブックマーク
        </TabButton>
        <TabButton isActive={tab() === 'pages'} onClick={() => setTab('pages')}>
          ページ一覧
        </TabButton>
      </div>
      <div class="flex-1 overflow-hidden overflow-x-auto w-full">
        <Switch>
          <Match when={tab() === 'bookmarks'}>
            <BookmarksTabContent onPageOpenRequested={onPageOpenRequested} />
          </Match>
          <Match when={tab() === 'pages'}>
            <AllPagesTabContent onPageOpenRequested={onPageOpenRequested} />
          </Match>
        </Switch>
      </div>
      <BookViewer open={isViewerOpen()} initPageIndex={firstOpenPageIndex()} onClose={closeViewer} />
    </div>
  );
};
