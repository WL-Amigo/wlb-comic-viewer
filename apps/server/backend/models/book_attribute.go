package models

import (
	"errors"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

var (
	BookAttributeIdAlreadyTakenError   = errors.New("specified id is already exist")
	BookAttributeValueTypeInvalidError = errors.New("invalid attribute value type")
)

type BookAttributeId string

func CreateBookAttributeId(existingBookAttrIds []BookAttributeId, preferredId string) (BookAttributeId, error) {
	idMap := map[BookAttributeId]bool{}
	for _, id := range existingBookAttrIds {
		idMap[id] = true
	}

	if preferredId != "" {
		if _, ok := idMap[BookAttributeId(preferredId)]; ok {
			return "", BookAttributeIdAlreadyTakenError
		}
		return BookAttributeId(preferredId), nil
	}

	for {
		idCandidate, err := gonanoid.New()
		if err != nil {
			return "", err
		}
		if _, ok := idMap[BookAttributeId(idCandidate)]; ok {
			continue
		}
		return BookAttributeId(idCandidate), nil
	}
}

type BookAttribute struct {
	Id    BookAttributeId
	Value string
}

type BookAttributeValueTypeEnum string

const (
	BookAttributeValueTypeString = BookAttributeValueTypeEnum("STRING")
	BookAttributeValueTypeInt    = BookAttributeValueTypeEnum("INT")
)

func CastToBookAttributeValueTypeEnum(str string) (BookAttributeValueTypeEnum, error) {
	if str == string(BookAttributeValueTypeString) {
		return BookAttributeValueTypeString, nil
	}
	if str == string(BookAttributeValueTypeInt) {
		return BookAttributeValueTypeInt, nil
	}
	return "", BookAttributeValueTypeInvalidError
}

type BookAttributeSettings struct {
	Id          BookAttributeId
	DisplayName string
	ValueType   BookAttributeValueTypeEnum
}

type BookAttributeSettingsCreateInput struct {
	Id          *string
	DisplayName string
	ValueType   BookAttributeValueTypeEnum
}

type BookAttributeSettingsUpdateInput struct {
	Id          BookAttributeId
	DisplayName *string
	ValueType   *BookAttributeValueTypeEnum
}
