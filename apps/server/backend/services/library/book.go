package library

import (
	"io/fs"
	"path/filepath"
	"strings"

	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

func (s *LibraryService) GetAllBooksInLibrary(libraryId string) ([]models.BookModelBase, error) {
	cacheBooks, ok := s.booksCacheMap[libraryId]
	if ok {
		return cacheBooks, nil
	}

	books, err := s.dbReader.ReadBooks(libraryId)
	if err != nil {
		return nil, err
	}
	s.booksCacheMap[libraryId] = books

	return books, nil
}

func getBookBaseCacheKey(libraryId string, bookId models.BookId) string {
	return libraryId + ":" + string(bookId)
}

func (s *LibraryService) ReadBookBase(libraryId string, bookId models.BookId) (models.BookModelBase, error) {
	cacheBook, ok := s.bookCacheMap[getBookBaseCacheKey(libraryId, bookId)]
	if ok {
		return cacheBook, nil
	}

	bookBase, err := s.dbReader.ReadBook(libraryId, bookId)
	if err != nil {
		return models.BookModelBase{}, nil
	}
	s.bookCacheMap[getBookBaseCacheKey(libraryId, bookId)] = bookBase

	return bookBase, nil
}

func (s *LibraryService) ReadBook(libraryId string, bookId models.BookId) (models.BookModelDetail, error) {
	bookBase, err := s.ReadBookBase(libraryId, bookId)
	if err != nil {
		return models.BookModelDetail{}, nil
	}

	imageFilePaths := []string{}
	err = filepath.WalkDir(bookBase.DirFullPath, func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() && utils.IsKnownImageFile(path) {
			filePathTrimmed := strings.TrimPrefix(path, bookBase.DirFullPath)
			filePathTrimmed = strings.TrimPrefix(filePathTrimmed, "/")
			imageFilePaths = append(imageFilePaths, filePathTrimmed)
		}
		return nil
	})

	return models.BookModelDetail{
		BookModelBase: bookBase,
		PageFilePaths: utils.SortStringSlice(imageFilePaths, utils.NaturalNumberOrder, false),
	}, nil
}

func (s *LibraryService) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	if settings.Name == "" {
		settings.Name = filepath.Base(bookDir)
	}

	id, err := s.dbWriter.CreateBook(libraryId, bookDir, settings)
	if err != nil {
		return "", err
	}
	delete(s.booksCacheMap, libraryId)
	return id, nil
}
