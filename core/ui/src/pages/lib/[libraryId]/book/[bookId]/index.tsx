import clsx from 'clsx';
import { Link } from '@solidjs/router';
import { Component, createSignal, Match, ParentComponent, Switch } from 'solid-js';
import { UndoIcon } from '../../../../../component/Icons';
import { windi } from '../../../../../utils/windi';
import { AllPagesTabContent } from './components/AllPagesTabContent';
import { BookmarksTabContent } from './components/BookmarksTabContent';
import { BookViewer } from './components/BookViewer';
import { BookDescriptionTabContent } from './components/DescriptionTabContent';
import { IsReadMark } from './components/PageParts';
import { useBookmarkHandler } from './compositions/Bookmark';
import { useBookViewerOpenState } from './compositions/BookViewerOpenState';
import { useBookDataContext } from './Context';

type TabKeys = 'bookmarks' | 'pages' | 'descriptions';

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
  const bookCtx = useBookDataContext();
  const [tab, setTab] = createSignal<TabKeys>('bookmarks');
  const [isViewerOpen, setIsViewerOpen] = useBookViewerOpenState();
  const [firstOpenPageIndex, setFirstOpenPageIndex] = createSignal(0);
  const onPageOpenRequested = (pageName: string) => {
    const idx = bookCtx.book().pages.indexOf(pageName);
    if (idx >= 0) {
      setFirstOpenPageIndex(idx);
      setIsViewerOpen(true);
    }
  };
  const closeViewer = () => setIsViewerOpen(false);

  const handleBookmark = useBookmarkHandler();

  return (
    <div class="container mx-auto w-full h-full overflow-hidden flex flex-col">
      <div class="flex-shrink-0 p-2 flex flex-row items-center gap-x-2">
        <Link
          class="no-underline text-black flex flex-row items-center gap-x-1 bg-gray-50 hover:bg-gray-100 p-1"
          href="../.."
        >
          <UndoIcon />
          <span class="hidden md:block">ライブラリへ戻る</span>
        </Link>
        <span class="text-xl flex-1 truncate">{bookCtx.book().name}</span>
        <IsReadMark class="hidden md:flex" isRead={bookCtx.book().isRead} />
      </div>
      <div class="md:hidden flex flex-row px-4 pb-2">
        <IsReadMark isRead={bookCtx.book().isRead} />
      </div>
      <div class="flex-shrink-0 py-1 px-2 flex flex-row gap-x-2">
        <TabButton isActive={tab() === 'bookmarks'} onClick={() => setTab('bookmarks')}>
          ブックマーク
        </TabButton>
        <TabButton isActive={tab() === 'pages'} onClick={() => setTab('pages')}>
          ページ一覧
        </TabButton>
        <TabButton isActive={tab() === 'descriptions'} onClick={() => setTab('descriptions')}>
          本の情報
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
          <Match when={tab() === 'descriptions'}>
            <BookDescriptionTabContent />
          </Match>
        </Switch>
      </div>
      <BookViewer
        open={isViewerOpen()}
        initPageIndex={firstOpenPageIndex()}
        onClose={closeViewer}
        onToggleBookmark={handleBookmark}
      />
    </div>
  );
};
