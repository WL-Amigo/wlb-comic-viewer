import { useSearchParams } from 'solid-app-router';
import { Accessor, createMemo } from 'solid-js';
import { z } from 'zod';

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
  return JSON.stringify(attributes.map((a) => [a.id, a.value]));
};
const AttributesQueryParamSchema = z.array(z.tuple([z.string(), z.string()]));
const parseAttributes = (attributesRaw: string): LibraryBooksAttributeSearchParams[] => {
  try {
    const attributesRawList = AttributesQueryParamSchema.parse(JSON.parse(attributesRaw));
    return attributesRawList
      .map((rt) => ({
        id: rt[0] ?? '',
        value: rt[1] ?? '',
      }))
      .filter((p) => p.id !== '' && p.value !== '');
  } catch (_) {
    return [];
  }
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
