import { BookAttributeValueType } from '@local-core/interfaces';

export interface BookAttributeSettingsFormValues {
  readonly isNew: boolean;
  id?: string;
  displayName: string;
  valueType: BookAttributeValueType;
}

export const createNewBookAttributeSettingsValues = (): BookAttributeSettingsFormValues => ({
  isNew: true,
  displayName: '',
  valueType: 'STRING',
});

export const isBookAttributeSettingsFormValuesValid = (values: BookAttributeSettingsFormValues): boolean => {
  if (values.displayName === '') {
    return false;
  }

  return true;
};
