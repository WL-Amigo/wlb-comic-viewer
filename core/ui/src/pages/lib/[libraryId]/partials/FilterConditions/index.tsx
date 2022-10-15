import { BookAttributeSettings } from '@local-core/interfaces';
import { Component, createMemo, createSignal, Index, Show } from 'solid-js';
import { Button } from '../../../../../component/Button';
import { CaretDownIcon, CaretRightIcon, FilterIcon, FilterSolidIcon, PlusIcon } from '../../../../../component/Icons';
import { areAllValuesEmpty, isNotNullOrUndefined } from '../../../../../utils/emptiness';
import {
  LibraryBooksAttributeSearchParams,
  LibraryBooksSearchParams,
  useLibraryBooksSearchParams,
  useLibraryBooksSearchParamsSetter,
} from '../../compositions/Filter';
import { useLibraryDataContext } from '../../Context';
import { BooksFilterConditionsAttributeFilterSetter } from './Attributes';

export const LibraryBooksFilterConditions: Component = () => {
  const libCtx = useLibraryDataContext();
  const currentParams = useLibraryBooksSearchParams();
  const setParams = useLibraryBooksSearchParamsSetter();
  const onDeterminedParams = (params: Partial<LibraryBooksSearchParams>) => {
    setParams(params);
    setIsOpen(false);
  };
  const [open, setIsOpen] = createSignal(false);
  const currentParamsStringified = () => {
    const cp = currentParams();
    return [
      cp.isRead === true ? '読了済み' : cp.isRead === false ? '' : undefined,
      cp.attributes.length === 0
        ? undefined
        : `属性: ${cp.attributes
            .map(
              (a) =>
                `${
                  libCtx.library.attributes.find((attrSetting) => attrSetting.id === a.id)?.displayName ??
                  '(不明な属性)'
                } に ${a.value} を含む`,
            )
            .join(', ')}`,
    ]
      .filter(isNotNullOrUndefined)
      .join('、');
  };
  const isConditionEmpty = createMemo(() => areAllValuesEmpty([currentParams().isRead, currentParams().attributes]));

  return (
    <div class="px-2">
      <div class="flex flex-col gap-y-1 border border-gray-400 rounded">
        <div
          class="flex flex-row items-center gap-x-2 cursor-pointer hover:bg-gray-100 p-1"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {open() ? <CaretDownIcon /> : <CaretRightIcon />}
          {isConditionEmpty() ? <FilterIcon /> : <FilterSolidIcon />}
          <span>フィルタ</span>
          <span>{currentParamsStringified()}</span>
        </div>
        <Show when={open()}>
          <div class="px-2 pb-1">
            <ConditionsSetter
              initParams={currentParams()}
              bookAttributeSettings={libCtx.library.attributes}
              onDetermined={onDeterminedParams}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

interface SetterProps {
  initParams: LibraryBooksSearchParams;
  bookAttributeSettings: readonly BookAttributeSettings[];
  onDetermined: (params: Partial<LibraryBooksSearchParams>) => void;
  onCancel: () => void;
}
const ConditionsSetter: Component<SetterProps> = (props) => {
  const [params, setParams] = createSignal(props.initParams);

  const onAddAttribute = () =>
    setParams((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { id: '', value: '' }],
    }));
  const onChangeAttributeFilter = (
    index: number,
    genNext: (prev: LibraryBooksAttributeSearchParams) => LibraryBooksAttributeSearchParams,
  ) => {
    setParams((prev) => {
      const prevAttrs = [...prev.attributes];
      const prevAttr = prevAttrs[index];
      if (prevAttr === undefined) {
        return prev;
      }
      prevAttrs.splice(index, 1, genNext(prevAttr));

      return { ...prev, attributes: prevAttrs };
    });
  };
  const onDeleteAttributeFilter = (index: number) => {
    setParams((prev) => {
      const prevAttrs = [...prev.attributes];
      prevAttrs.splice(index, 1);
      return { ...prev, attributes: prevAttrs };
    });
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-1">
      <div class="flex flex-row gap-x-1 items-center">
        <div>読了状態: </div>
        <Button
          onClick={() => setParams((prev) => ({ ...prev, isRead: null }))}
          color={!isNotNullOrUndefined(params().isRead) ? 'primary' : 'default'}
        >
          指定なし
        </Button>
        <Button
          onClick={() => setParams((prev) => ({ ...prev, isRead: true }))}
          color={params().isRead === true ? 'primary' : 'default'}
        >
          読了済み
        </Button>
        <Button
          onClick={() => setParams((prev) => ({ ...prev, isRead: false }))}
          color={params().isRead === false ? 'primary' : 'default'}
        >
          未読
        </Button>
      </div>
      <div class="col-span-full flex flex-col md:flex-row gap-1">
        <div class="pt-1">属性: </div>
        <div class="flex-1 flex flex-col gap-y-1 items-start">
          <Index each={params().attributes}>
            {(item, index) => (
              <BooksFilterConditionsAttributeFilterSetter
                selectableAttrOptions={props.bookAttributeSettings}
                currentId={item().id}
                currentValue={item().value}
                onChangeId={(id) => onChangeAttributeFilter(index, (prev) => ({ ...prev, id }))}
                onChangeValue={(value) => onChangeAttributeFilter(index, (prev) => ({ ...prev, value }))}
                onDelete={() => onDeleteAttributeFilter(index)}
              />
            )}
          </Index>
          <Button onClick={onAddAttribute}>
            <PlusIcon />
            <span>追加</span>
          </Button>
        </div>
      </div>
      <div class="col-span-full flex flex-row justify-end gap-x-2">
        <Button onClick={props.onCancel}>キャンセル</Button>
        <Button color="primary" onClick={() => props.onDetermined(params())}>
          フィルタ実行
        </Button>
      </div>
    </div>
  );
};
