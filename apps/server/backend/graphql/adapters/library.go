package adapters

import (
	gqlmodel "github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
)

func CastGqlBookAttributeValueTypeEnum(gqlVt gqlmodel.BookAttributeValueTypeEnum) models.BookAttributeValueTypeEnum {
	switch gqlVt {
	case gqlmodel.BookAttributeValueTypeEnumString:
		return models.BookAttributeValueTypeString
	case gqlmodel.BookAttributeValueTypeEnumInt:
		return models.BookAttributeValueTypeInt
	case gqlmodel.BookAttributeValueTypeEnumTag:
		return models.BookAttributeValueTypeTag
	default:
		panic("invalid enum")
	}
}

func CastModelBookAttributeValueTypeEnum(modelVt models.BookAttributeValueTypeEnum) gqlmodel.BookAttributeValueTypeEnum {
	switch modelVt {
	case models.BookAttributeValueTypeString:
		return gqlmodel.BookAttributeValueTypeEnumString
	case models.BookAttributeValueTypeInt:
		return gqlmodel.BookAttributeValueTypeEnumInt
	case models.BookAttributeValueTypeTag:
		return gqlmodel.BookAttributeValueTypeEnumTag
	default:
		panic("invalid enum")
	}
}
