import { BookAttributeId } from './Id';
import { z } from 'zod';

const BookAttributeValueTypeSchema = z.enum(['STRING', 'INT']);
export const BookAttributeValueTypeEnum = BookAttributeValueTypeSchema.Enum;
export type BookAttributeValueType = z.infer<typeof BookAttributeValueTypeSchema>;

export interface BookAttributeSettings {
  readonly id: BookAttributeId;
  readonly displayName: string;
  readonly valueType: BookAttributeValueType;
}

export interface BookAttributeSettingsCreateParams {
  displayName: string;
  valueType: BookAttributeValueType;
  preferredId?: BookAttributeId;
}

export interface BookAttributeSettingsUpdateParams {
  id: BookAttributeId;
  displayName?: string;
  valueType?: BookAttributeValueType;
}

export interface BookAttribute {
  readonly id: BookAttributeId;
  readonly displayName: string;
  readonly valueType: BookAttributeValueType;
  readonly value: string;
}

export interface BookAttributeCreateParams {
  id: BookAttributeId;
  value: string;
}

export type BookAttributeUpdateParams = BookAttributeCreateParams;
