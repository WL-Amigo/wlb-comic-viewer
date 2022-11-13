package models

import (
	"errors"
	"os"
	"path/filepath"

	"github.com/private-gallery-server/utils"
)

type Bookmark struct {
	Page         string
	Name         string
	pageFileHash string
	isMissing    bool
}

func (b Bookmark) GetPageFileHash() string {
	return b.pageFileHash
}

func (b Bookmark) IsMissing() bool {
	return b.isMissing
}

type CreateBookmarkModelOptions struct {
	PageFileHash string
	BookmarkName string
}

func CreateBookmarkModel(basePath string, pageFileName string, options CreateBookmarkModelOptions) (Bookmark, error) {
	// page file existence check
	pageFullPath := filepath.Join(basePath, pageFileName)
	_, err := os.Stat(pageFullPath)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return Bookmark{
				Page:         pageFileName,
				Name:         options.BookmarkName,
				pageFileHash: options.PageFileHash,
				isMissing:    true,
			}, nil
		}
		return Bookmark{}, err
	}

	hash := options.PageFileHash
	if hash == "" {
		pageFullPath := filepath.Join(basePath, pageFileName)
		var err error
		hash, err = utils.HashFile(pageFullPath)
		if err != nil {
			return Bookmark{}, err
		}
	}
	return Bookmark{
		Page:         pageFileName,
		Name:         options.BookmarkName,
		pageFileHash: hash,
		isMissing:    false,
	}, nil
}

type BookmarkCreateInput struct {
	Page string
	Name string
}

type BookmarkUpdateInput struct {
	Page string
	Name *string
}
