// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type BookAttributeSettingUnion interface {
	IsBookAttributeSettingUnion()
}

type IBookAttributeSetting interface {
	IsIBookAttributeSetting()
}

type Book struct {
	ID         string           `json:"id"`
	Name       string           `json:"name"`
	Dir        string           `json:"dir"`
	Pages      []string         `json:"pages"`
	Attributes []*BookAttribute `json:"attributes"`
	Bookmarks  []*BookBookmark  `json:"bookmarks"`
	IsRead     bool             `json:"isRead"`
}

type BookAttribute struct {
	ID           string                     `json:"id"`
	DisplayName  string                     `json:"displayName"`
	ValueType    BookAttributeValueTypeEnum `json:"valueType"`
	Value        string                     `json:"value"`
	ExistingTags []string                   `json:"existingTags"`
}

type BookAttributeInput struct {
	ID    string `json:"id"`
	Value string `json:"value"`
}

type BookAttributeSettingBasic struct {
	ID          string                     `json:"id"`
	DisplayName string                     `json:"displayName"`
	ValueType   BookAttributeValueTypeEnum `json:"valueType"`
}

func (BookAttributeSettingBasic) IsIBookAttributeSetting()     {}
func (BookAttributeSettingBasic) IsBookAttributeSettingUnion() {}

type BookAttributeSettingCreateInput struct {
	ID          *string                    `json:"id"`
	DisplayName string                     `json:"displayName"`
	ValueType   BookAttributeValueTypeEnum `json:"valueType"`
}

type BookAttributeSettingTag struct {
	ID          string                     `json:"id"`
	DisplayName string                     `json:"displayName"`
	ValueType   BookAttributeValueTypeEnum `json:"valueType"`
	Tags        []string                   `json:"tags"`
}

func (BookAttributeSettingTag) IsIBookAttributeSetting()     {}
func (BookAttributeSettingTag) IsBookAttributeSettingUnion() {}

type BookAttributeSettingUpdateInput struct {
	ID          string                      `json:"id"`
	DisplayName *string                     `json:"displayName"`
	ValueType   *BookAttributeValueTypeEnum `json:"valueType"`
}

type BookBookmark struct {
	Page  string                 `json:"page"`
	Name  string                 `json:"name"`
	Error *BookmarkErrorTypeEnum `json:"error"`
}

type BookBookmarkInput struct {
	Name *string `json:"name"`
}

type BookFilterAttributeParams struct {
	ID    string `json:"id"`
	Value string `json:"value"`
}

type BookFilterParams struct {
	IsRead     *bool                        `json:"isRead"`
	Attributes []*BookFilterAttributeParams `json:"attributes"`
}

type BookInitInput struct {
	Dir string `json:"dir"`
}

type BookInput struct {
	Name *string `json:"name"`
}

type BookMin struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	IsRead bool   `json:"isRead"`
}

type Library struct {
	ID         string                      `json:"id"`
	Name       string                      `json:"name"`
	RootDir    string                      `json:"rootDir"`
	Books      []*BookMin                  `json:"books"`
	Attributes []BookAttributeSettingUnion `json:"attributes"`
}

type LibraryCreateInput struct {
	Name    *string `json:"name"`
	RootDir string  `json:"rootDir"`
}

type LibraryMin struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type LibraryUpdateInput struct {
	Name *string `json:"name"`
}

type BookAttributeValueTypeEnum string

const (
	BookAttributeValueTypeEnumString BookAttributeValueTypeEnum = "STRING"
	BookAttributeValueTypeEnumInt    BookAttributeValueTypeEnum = "INT"
	BookAttributeValueTypeEnumTag    BookAttributeValueTypeEnum = "TAG"
)

var AllBookAttributeValueTypeEnum = []BookAttributeValueTypeEnum{
	BookAttributeValueTypeEnumString,
	BookAttributeValueTypeEnumInt,
	BookAttributeValueTypeEnumTag,
}

func (e BookAttributeValueTypeEnum) IsValid() bool {
	switch e {
	case BookAttributeValueTypeEnumString, BookAttributeValueTypeEnumInt, BookAttributeValueTypeEnumTag:
		return true
	}
	return false
}

func (e BookAttributeValueTypeEnum) String() string {
	return string(e)
}

func (e *BookAttributeValueTypeEnum) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = BookAttributeValueTypeEnum(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid BookAttributeValueTypeEnum", str)
	}
	return nil
}

func (e BookAttributeValueTypeEnum) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type BookmarkErrorTypeEnum string

const (
	BookmarkErrorTypeEnumMissingPageFile BookmarkErrorTypeEnum = "MISSING_PAGE_FILE"
)

var AllBookmarkErrorTypeEnum = []BookmarkErrorTypeEnum{
	BookmarkErrorTypeEnumMissingPageFile,
}

func (e BookmarkErrorTypeEnum) IsValid() bool {
	switch e {
	case BookmarkErrorTypeEnumMissingPageFile:
		return true
	}
	return false
}

func (e BookmarkErrorTypeEnum) String() string {
	return string(e)
}

func (e *BookmarkErrorTypeEnum) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = BookmarkErrorTypeEnum(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid BookmarkErrorTypeEnum", str)
	}
	return nil
}

func (e BookmarkErrorTypeEnum) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
