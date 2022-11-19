import { BookAttributeValueType } from '@local-core/interfaces';

export interface BooksFilterAttributeOptionViewModel {
  id: string;
  displayName: string;
  valueType: BookAttributeValueType;
  tags: readonly string[]; // valid when valueType === "TAG"
}
