import { Navigate, Route, Router, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';
import { ServiceProvider, Services } from './compositions/Dependency';
import { LibraryListPage } from './pages/lib';
import { BookListPage } from './pages/lib/[libraryId]';
import { BookMainPage } from './pages/lib/[libraryId]/book/[bookId]';
import { BookDataProvider } from './pages/lib/[libraryId]/book/[bookId]/Context';
import { LibraryDataProvider } from './pages/lib/[libraryId]/Context';

const AllRoutes: Component = () => {
  return (
    <Routes>
      <Route path="/lib">
        <Route path="/" component={LibraryListPage} />
        <Route path="/:libraryId" component={LibraryDataProvider}>
          <Route path="/" component={BookListPage} />
          <Route path="/book/:bookId" component={BookDataProvider}>
            <Route path="/" component={BookMainPage} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<Navigate href="/lib/" />} />
    </Routes>
  );
};

const App: Component = () => {
  return (
    <Router>
      <div class="w-full h-full overflow-hidden relative">
        <AllRoutes />
      </div>
    </Router>
  );
};

export const createAppRootComponent =
  (services: Services): Component =>
  () =>
    (
      <ServiceProvider services={services}>
        <App />
      </ServiceProvider>
    );
