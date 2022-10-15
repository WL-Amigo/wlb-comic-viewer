import { useNavigate, useSearchParams } from 'solid-app-router';
import { Accessor } from 'solid-js';

interface BookViewerOpenStateSearchParamsRaw {
  open: string;
  [_: string]: string;
}
interface OpenStateRefObject {
  openedByThisState: boolean | undefined;
}

export const useBookViewerOpenState = (): [Accessor<boolean>, (isOpen: boolean) => void] => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams<BookViewerOpenStateSearchParamsRaw>();
  const openStateRef: OpenStateRefObject = { openedByThisState: false };
  const isOpenAccessor = () => searchParams.open === String(true);
  const setIsOpen = (isOpen: boolean) => {
    if (isOpen === isOpenAccessor()) {
      return;
    }
    if (isOpen) {
      const param: BookViewerOpenStateSearchParamsRaw = { open: String(true) };
      setSearchParams(param);
      openStateRef.openedByThisState = true;
    } else {
      if (openStateRef.openedByThisState === true) {
        navigate(-1);
        openStateRef.openedByThisState = false;
      } else {
        const param: BookViewerOpenStateSearchParamsRaw = { open: '' };
        setSearchParams(param, { replace: true });
      }
    }
  };
  return [isOpenAccessor, setIsOpen];
};
