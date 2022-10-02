import { useSearchParams } from 'solid-app-router';
import { Accessor, createMemo } from 'solid-js';

interface LibraryBooksSearchParamsRaw {
  isRead: string;
  attributes: string;
  [_: string]: string;
}
export interface LibraryBooksAttributeSearchParams {
  id: string;
  value: string;
}
export interface LibraryBooksSearchParams {
  isRead: boolean | undefined | null;
  attributes: LibraryBooksAttributeSearchParams[];
}

const serializeAttributes = (attributes: readonly LibraryBooksAttributeSearchParams[]): string => {
  return attributes.map((a) => [a.id, a.value].join(' ')).join(',');
};
const parseAttributes = (attributesRaw: string): LibraryBooksAttributeSearchParams[] => {
  const attributesRawList = attributesRaw.split(',');
  const attributesRawTupleList = attributesRawList.map((r) => r.split(' '));
  return attributesRawTupleList
    .map((rt) => ({
      id: rt[0] ?? '',
      value: rt[1] ?? '',
    }))
    .filter((p) => p.id !== '' && p.value !== '');
};

export const useLibraryBooksSearchParams = (): Accessor<LibraryBooksSearchParams> => {
  const [searchParams] = useSearchParams<LibraryBooksSearchParamsRaw>();
  return createMemo((): LibraryBooksSearchParams => {
    return {
      isRead: searchParams.isRead === String(true) ? true : searchParams.isRead === String(false) ? false : undefined,
      attributes: parseAttributes(searchParams.attributes ?? ''),
    };
  });
};

export const useLibraryBooksSearchParamsSetter = (): ((params: Partial<LibraryBooksSearchParams>) => void) => {
  const currentParams = useLibraryBooksSearchParams();
  const [_, setSearchParams] = useSearchParams<LibraryBooksSearchParamsRaw>();
  return (params) => {
    const nextParams: LibraryBooksSearchParams = {
      isRead: params.isRead === null ? undefined : params.isRead ?? currentParams().isRead,
      attributes:
        params.attributes?.filter((attr) => attr.id !== '' && attr.value !== '') ?? currentParams().attributes,
    };
    const nextParamsRaw: LibraryBooksSearchParamsRaw = {
      isRead: String(nextParams.isRead ?? ''),
      attributes: serializeAttributes(nextParams.attributes),
    };
    setSearchParams(nextParamsRaw);
  };
};
