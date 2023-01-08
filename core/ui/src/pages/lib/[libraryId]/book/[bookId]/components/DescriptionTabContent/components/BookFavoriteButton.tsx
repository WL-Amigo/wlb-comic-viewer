import clsx from 'clsx';
import { VoidComponent, createSignal } from 'solid-js';
import { StarIcon, StarOutlinedIcon } from '../../../../../../../../component/Icons';
import { useService } from '../../../../../../../../compositions/Dependency';
import { windi } from '../../../../../../../../utils/windi';
import { useLibraryDataContext } from '../../../../../Context';
import { useBookDataContext } from '../../../Context';

const BookFavoriteButton: VoidComponent = () => {
  const libCtx = useLibraryDataContext();
  const bookCtx = useBookDataContext();
  const bookService = useService('bookMutation');

  const isFavorite = () => bookCtx.book().builtinAttributes.isFavorite;
  const [inProgress, setInProgress] = createSignal(false);
  const toggleFavorite = async () => {
    setInProgress(true);
    try {
      await bookService.updateBuiltinAttributes(libCtx.library().id, bookCtx.book().id, {
        isFavorite: !isFavorite(),
      });
      await bookCtx.reloadBook();
    } finally {
      setInProgress(false);
    }
  };

  return <FavoriteButtonView isFavorite={isFavorite()} onClick={toggleFavorite} disabled={inProgress()} />;
};

const FavoriteButtonView: VoidComponent<{ isFavorite: boolean; onClick: () => void; disabled: boolean }> = (props) => {
  return (
    <button
      disabled={props.disabled}
      onclick={props.onClick}
      class={clsx(
        windi`p-2 rounded w-full flex flex-col gap-y-2 items-center border hover:bg-yellow-50 disabled:cursor-default disabled:hover:bg-transparent group`,
        props.isFavorite ? windi`border-yellow-500` : windi`border-gray-400`,
      )}
    >
      {props.isFavorite ? (
        <StarIcon class="w-6 h-6 text-yellow-500" />
      ) : (
        <StarOutlinedIcon class="w-6 h-6 text-gray-400 group-hover:text-yellow-500" />
      )}
      <span>お気に入り</span>
    </button>
  );
};

export const BookFavoriteEditor: VoidComponent = BookFavoriteButton;
