package models

import (
	"encoding/base64"
	"strings"
)

type BookSettings struct {
	Name              string
	BuiltinAttributes BookBuiltinAttributes
	Attributes        []BookAttribute
	KnownPages        []string
	ReadPages         []string
	Bookmarks         []Bookmark
	IgnorePatterns    []string
}

type BookSettingsUpdateInput struct {
	Name           *string
	Attributes     []BookAttribute
	IgnorePatterns []string
}

type BookId string

type BookModelBase struct {
	BookSettings
	Id          BookId
	Dir         string
	DirFullPath string
}

type BookModelDetail struct {
	BookModelBase
	PageFilePaths []string
}

func CreateBookId(bookDirPath string) BookId {
	bookDirPath = strings.TrimPrefix(bookDirPath, "/")
	bookDirPath = strings.TrimSuffix(bookDirPath, "/")
	b64EncodedDirPath := base64.URLEncoding.EncodeToString([]byte(bookDirPath))
	return BookId(b64EncodedDirPath)
}

func CastToBookId(bookId string) (BookId, error) {
	_, err := base64.URLEncoding.DecodeString(string(bookId))
	if err != nil {
		return "", err
	}
	return BookId(bookId), nil
}

func (id BookId) ToDirPath() (string, error) {
	decoded, err := base64.URLEncoding.DecodeString(string(id))
	if err != nil {
		return "", err
	}
	return string(decoded), nil
}
