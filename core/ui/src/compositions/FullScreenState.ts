import { Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';

export const createDocumentFullScreenSignal = (): [
  isFullScreen: Accessor<boolean>,
  toggleFullScreen: (next?: boolean) => void,
] => {
  const [isFullScreen, setIsFullScreen] = createSignal(document.fullscreenElement !== null);

  createEffect(() => {
    const listener = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', listener);
    onCleanup(() => document.removeEventListener('fullscreenchange', listener));
  });
  const toggleFullScreen = (next?: boolean) => {
    const isFullScreenCurrent = isFullScreen();
    const nextLocal = typeof next === 'boolean' ? next : undefined;
    const isFullScreenRequested = nextLocal ?? !isFullScreenCurrent;
    if (isFullScreenCurrent === isFullScreenRequested) {
      return;
    }
    if (isFullScreenRequested) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return [isFullScreen, toggleFullScreen];
};
