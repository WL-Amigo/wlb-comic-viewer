package adapters

import (
	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
)

func CastGqlBookAttributeValueTypeEnum(gqlVt model.BookAttributeValueTypeEnum) models.BookAttributeValueTypeEnum {
	switch gqlVt {
	case model.BookAttributeValueTypeEnumString:
		return models.BookAttributeValueTypeString
	case model.BookAttributeValueTypeEnumInt:
		return models.BookAttributeValueTypeInt
	default:
		panic("invalid enum")
	}
}

func CastModelBookAttributeValueTypeEnum(modelVt models.BookAttributeValueTypeEnum) model.BookAttributeValueTypeEnum {
	switch modelVt {
	case models.BookAttributeValueTypeString:
		return model.BookAttributeValueTypeEnumString
	case models.BookAttributeValueTypeInt:
		return model.BookAttributeValueTypeEnumInt
	default:
		panic("invalid enum")
	}
}
