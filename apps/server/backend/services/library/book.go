package library

import (
	"fmt"
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

func getAllPagesInBook(dirFullPath string) ([]string, error) {
	imageFilePaths := []string{}
	err := filepath.WalkDir(dirFullPath, func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() && utils.IsKnownImageFile(path) {
			filePathTrimmed := strings.TrimPrefix(path, dirFullPath)
			filePathTrimmed = strings.TrimPrefix(filePathTrimmed, "/")
			imageFilePaths = append(imageFilePaths, filePathTrimmed)
		}
		return nil
	})

	return imageFilePaths, err
}

func (s *LibraryService) ReadBookBase(libraryId string, bookId models.BookId) (models.BookModelBase, error) {
	cacheBook, ok := s.bookCacheMap[getBookBaseCacheKey(libraryId, bookId)]
	if ok {
		return cacheBook, nil
	}

	bookBase, err := s.dbReader.ReadBook(libraryId, bookId)
	if err != nil {
		return models.BookModelBase{}, err
	}
	s.bookCacheMap[getBookBaseCacheKey(libraryId, bookId)] = bookBase

	return bookBase, nil
}

func (s *LibraryService) ReadBook(libraryId string, bookId models.BookId) (models.BookModelDetail, error) {
	bookBase, err := s.ReadBookBase(libraryId, bookId)
	if err != nil {
		return models.BookModelDetail{}, err
	}

	return models.BookModelDetail{
		BookModelBase: bookBase,
		PageFilePaths: utils.SortStringSlice(bookBase.KnownPages, utils.NaturalNumberOrder, false),
	}, nil
}

func (s *LibraryService) CheckIsBookRead(bookBase models.BookModelBase) bool {
	if len(bookBase.KnownPages) == 0 {
		return false
	}

	allReadPageMap := map[string]bool{}
	for _, readPage := range bookBase.ReadPages {
		allReadPageMap[readPage] = true
	}

	for _, page := range bookBase.KnownPages {
		_, ok := allReadPageMap[page]
		if !ok {
			fmt.Println(page)
			return false
		}
	}

	return true
}

func (s *LibraryService) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	if settings.Name == "" {
		settings.Name = filepath.Base(bookDir)
	}

	imageFilePaths, err := getAllPagesInBook(filepath.Join(s.rootDir, bookDir))
	if err != nil {
		return "", err
	}
	settings.KnownPages = imageFilePaths

	id, err := s.dbWriter.CreateBook(libraryId, bookDir, settings)
	if err != nil {
		return "", err
	}
	delete(s.booksCacheMap, libraryId)
	return id, nil
}

func (s *LibraryService) UpdateBook(libraryId string, bookId string, input models.BookSettingsUpdateInput) (models.BookId, error) {
	bookIdLocal, err := models.CastToBookId(bookId)
	if err != nil {
		return "", err
	}

	updateTargetBook, err := s.dbReader.ReadBook(libraryId, bookIdLocal)
	if err != nil {
		return "", err
	}
	settings := updateTargetBook.BookSettings

	if input.Name != nil {
		settings.Name = *input.Name
	}

	if len(input.Attributes) > 0 {
		attrMap := map[models.BookAttributeId]models.BookAttribute{}
		for _, existingAttr := range settings.Attributes {
			attrMap[existingAttr.Id] = existingAttr
		}
		for _, attrInput := range input.Attributes {
			attrMap[attrInput.Id] = attrInput
		}
		nextAttrs := []models.BookAttribute{}
		for _, v := range attrMap {
			nextAttrs = append(nextAttrs, v)
		}
		settings.Attributes = nextAttrs
	}

	_, err = s.dbWriter.UpdateBook(libraryId, bookIdLocal, settings)
	if err != nil {
		return "", err
	}

	delete(s.bookCacheMap, getBookBaseCacheKey(libraryId, bookIdLocal))

	return bookIdLocal, nil
}

func (s *LibraryService) UpdateKnownPagesInBook(libraryId string, bookId string) ([]string, error) {
	bookIdLocal, err := models.CastToBookId(bookId)
	if err != nil {
		return nil, err
	}

	book, err := s.dbReader.ReadBook(libraryId, bookIdLocal)
	if err != nil {
		return nil, err
	}
	settings := book.BookSettings

	imageFilePaths, err := getAllPagesInBook(book.DirFullPath)
	if err != nil {
		return nil, err
	}
	settings.KnownPages = imageFilePaths

	_, err = s.dbWriter.UpdateBook(libraryId, bookIdLocal, settings)
	if err != nil {
		return nil, err
	}

	delete(s.bookCacheMap, getBookBaseCacheKey(libraryId, bookIdLocal))

	return imageFilePaths, nil
}

func (s *LibraryService) MarkAsReadPage(libraryId string, bookId string, pages []string) ([]string, error) {
	bookIdLocal, err := models.CastToBookId(bookId)
	if err != nil {
		return nil, err
	}

	updateTargetBook, err := s.dbReader.ReadBook(libraryId, bookIdLocal)
	if err != nil {
		return nil, err
	}
	settings := updateTargetBook.BookSettings

	readPagesMap := map[string]bool{}
	for _, readPage := range settings.ReadPages {
		readPagesMap[readPage] = true
	}
	for _, page := range pages {
		readPagesMap[page] = true
	}

	nextReadPages := []string{}
	for p := range readPagesMap {
		nextReadPages = append(nextReadPages, p)
	}
	settings.ReadPages = nextReadPages

	_, err = s.dbWriter.UpdateBook(libraryId, bookIdLocal, settings)
	if err != nil {
		return nil, err
	}

	delete(s.bookCacheMap, getBookBaseCacheKey(libraryId, bookIdLocal))

	return pages, nil
}
