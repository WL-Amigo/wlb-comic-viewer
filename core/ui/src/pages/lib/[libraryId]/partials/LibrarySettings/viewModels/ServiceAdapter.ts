import { BookAttributeSettingsUpdateParams } from '@local-core/interfaces';
import { Accessor, createResource, createSignal, Resource } from 'solid-js';
import { useService } from '../../../../../../compositions/Dependency';
import { isNotNullOrUndefined } from '../../../../../../utils/emptiness';
import { LibrarySettingsFormValues } from './FormValues';

export const useLibrarySettingsLoader = (
  libraryId: Accessor<string | undefined>,
): Resource<LibrarySettingsFormValues | undefined> => {
  const libraryService = useService('library');

  const [values] = createResource(libraryId, async (libraryId): Promise<LibrarySettingsFormValues> => {
    const settings = await libraryService.loadLibrarySettings(libraryId);
    return {
      name: settings.name,
      attributes: settings.attributes.map((attr) => ({
        isNew: false,
        id: attr.id,
        displayName: attr.displayName,
        valueType: attr.valueType,
      })),
    };
  });

  return values;
};

interface LibrarySettingsUpdater {
  updateLibrary: (settings: LibrarySettingsFormValues) => Promise<void>;
  isSaving: Accessor<boolean>;
}
export const useLibrarySettingsUpdater = (libraryId: Accessor<string>): LibrarySettingsUpdater => {
  const libraryService = useService('libraryMutation');
  const [isSaving, setIsSaving] = createSignal(false);

  const updateLibrary = async (settings: LibrarySettingsFormValues) => {
    setIsSaving(true);

    const attrsNeedCreate = settings.attributes.filter((attr) => attr.isNew);
    const attrsNeedUpdate = settings.attributes.filter((attr) => !attr.isNew);
    try {
      if (attrsNeedCreate.length > 0) {
        await libraryService.createBookAttributeSettings(
          libraryId(),
          attrsNeedCreate.map((attr) => ({
            displayName: attr.displayName,
            valueType: attr.valueType,
            preferredId: attr.id,
          })),
        );
      }
      if (attrsNeedUpdate.length > 0) {
        await libraryService.updateBookAttributeSettings(
          libraryId(),
          attrsNeedUpdate
            .map((attr): BookAttributeSettingsUpdateParams | undefined => {
              if (attr.id === undefined) {
                return undefined;
              } else {
                return {
                  id: attr.id,
                  displayName: attr.displayName,
                  valueType: attr.valueType,
                };
              }
            })
            .filter(isNotNullOrUndefined),
        );
      }
    } catch (_) {
      // TODO: notify to user when error
    } finally {
      setIsSaving(false);
    }
  };

  return {
    updateLibrary,
    isSaving,
  };
};
