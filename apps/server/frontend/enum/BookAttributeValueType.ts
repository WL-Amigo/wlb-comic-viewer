import { BookAttributeValueType } from "@local-core/interfaces";
import { z } from "zod";
import { BookAttributeValueTypeEnum as GqlBookAttributeValueTypeEnum } from "../graphql/autogen/gql";

const GqlBookAttributeValueTypeSchema = z.nativeEnum(GqlBookAttributeValueTypeEnum);
export const BookAttributeValueTypeOps = {
  toGql: (value: BookAttributeValueType) => GqlBookAttributeValueTypeSchema.parse(value),
  toLocal: (value: GqlBookAttributeValueTypeEnum): BookAttributeValueType => value
}