import { Component, createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { isNotNullOrEmptyString, isNotNullOrUndefined } from '../../../../../../../../../../../utils/emptiness';
import { AttributeValueInputProps } from './Types';
import { useFloating } from 'solid-floating-ui';
import { Portal } from 'solid-js/web';
import { XIcon } from '../../../../../../../../../../../component/Icons';
import clsx from 'clsx';
import { windi } from '../../../../../../../../../../../utils/windi';

interface TagAttributeValueInputProps extends AttributeValueInputProps {
  existingTags: readonly string[];
}
export const TagAttributeValueInput: Component<TagAttributeValueInputProps> = (props) => {
  const [isEditMode, setIsEditMode] = createSignal(false);
  const isValueSet = createMemo(() => isNotNullOrEmptyString(props.value));

  return (
    <Show
      when={isEditMode()}
      fallback={
        <div
          class={clsx(
            windi`cursor-pointer px-2 py-0.5 rounded flex flex-row gap-x-1 items-center`,
            isValueSet() ? windi`bg-blue-100` : windi`bg-gray-100`,
          )}
          onClick={() => setIsEditMode(true)}
        >
          <span>{isValueSet() ? props.value : '(指定なし)'}</span>
          <Show when={isValueSet()}>
            <button class="flex" type="button" onClick={() => props.onChange('')}>
              <XIcon />
            </button>
          </Show>
        </div>
      }
    >
      <TagAttributeValueEditor
        currentValue={props.value}
        existingTags={props.existingTags}
        onClickAway={() => setIsEditMode(false)}
        onDetermined={(value) => {
          props.onChange(value);
          setIsEditMode(false);
        }}
      />
    </Show>
  );
};

interface EditorProps {
  currentValue: string;
  existingTags: readonly string[];
  onClickAway: () => void;
  onDetermined: (value: string) => void;
}
const TagAttributeValueEditor: Component<EditorProps> = (props) => {
  const [refEl, setRefEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const position = useFloating(refEl, floatingEl, { placement: 'bottom-start' });

  const [filterOrNewTag, setFilterOrNewTag] = createSignal('');
  const filteredTags = createMemo(() => {
    const filterValue = filterOrNewTag();
    if (filterValue === '') {
      return props.existingTags;
    }
    return props.existingTags.filter((t) => t.includes(filterValue));
  });

  createEffect(() => {
    const clickAwayHandler = (ev: MouseEvent) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const currentRefEl = refEl();
      const currentFloatingEl = floatingEl();
      if (isNotNullOrUndefined(currentRefEl) && target.contains(currentRefEl)) {
        return;
      }
      if (isNotNullOrUndefined(currentFloatingEl) && target.contains(currentFloatingEl)) {
        return;
      }
      props.onClickAway();
    };
    document.addEventListener('click', clickAwayHandler);
    onCleanup(() => document.removeEventListener('click', clickAwayHandler));
  });

  return (
    <>
      <input
        class="p-1 border rounded w-64"
        ref={setRefEl}
        value={filterOrNewTag()}
        onInput={(ev) => setFilterOrNewTag(ev.currentTarget.value)}
      />
      <Portal mount={document.getElementById('floating')!}>
        <div
          class="shadow rounded py-1 bg-white flex flex-col"
          ref={setFloatingEl}
          style={{ position: position.strategy, top: `${position.y ?? 0}px`, left: `${position.x ?? 0}px` }}
        >
          <For each={filteredTags()}>
            {(tagName) => (
              <button
                class="text-left px-2 py-0.5 hover:bg-gray-50"
                type="button"
                onClick={() => props.onDetermined(tagName)}
              >
                {tagName}
              </button>
            )}
          </For>
          <Show when={filterOrNewTag() !== ''}>
            <button
              class="text-left px-2 py-0.5 hover:bg-gray-50"
              type="button"
              onClick={() => props.onDetermined(filterOrNewTag())}
            >{`${filterOrNewTag()} タグを追加する`}</button>
          </Show>
        </div>
      </Portal>
    </>
  );
};
