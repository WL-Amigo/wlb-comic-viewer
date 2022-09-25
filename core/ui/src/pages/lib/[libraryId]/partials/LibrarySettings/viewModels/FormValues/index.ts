import { BookAttributeSettingsFormValues } from './BookAttribute';

export * from './BookAttribute';

export interface LibrarySettingsFormValues {
  name: string;
  attributes: BookAttributeSettingsFormValues[];
}
