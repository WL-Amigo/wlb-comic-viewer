package library

import (
	"io/fs"
	"path/filepath"
	"strings"

	"github.com/bmatcuk/doublestar/v4"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
	"golang.org/x/exp/slices"
)

type BooksFilter struct {
	IsRead     *bool
	IsFavorite *bool
	Attributes []BooksAttributeFilter
}

type BooksAttributeFilter struct {
	Id    models.BookAttributeId
	Value string
}

func filterBooks(books []models.BookModelBase, pred func(b models.BookModelBase) bool) []models.BookModelBase {
	var result []models.BookModelBase
	for _, b := range books {
		if pred(b) {
			result = append(result, b)
		}
	}
	return result
}

func (s *LibraryService) GetAllBooksInLibrary(libraryId string) ([]models.BookModelBase, error) {
	books, err := s.dbReader.ReadBooks(libraryId)
	if err != nil {
		return nil, err
	}

	slices.SortFunc(books, func(a, b models.BookModelBase) bool {
		return a.Name < b.Name
	})
	return books, nil
}

func (s *LibraryService) QueryBooksInLibrary(libraryId string, filter BooksFilter) ([]models.BookModelBase, error) {
	books, err := s.GetAllBooksInLibrary(libraryId)
	if err != nil {
		return nil, err
	}

	if filter.IsRead != nil {
		books = utils.SliceFilter(books, func(b models.BookModelBase) bool { return s.CheckIsBookRead(b) == *filter.IsRead })
	}
	if filter.IsFavorite != nil {
		books = utils.SliceFilter(books, func(b models.BookModelBase) bool {
			return b.BuiltinAttributes.IsFavorite == *filter.IsFavorite
		})
	}
	for _, attrFilter := range filter.Attributes {
		books = utils.SliceFilter(books, func(b models.BookModelBase) bool {
			for _, attr := range b.Attributes {
				if attr.Id == attrFilter.Id && strings.Contains(attr.Value, attrFilter.Value) {
					return true
				}
			}
			return false
		})
	}

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
	return s.dbReader.ReadBook(libraryId, bookId)
}

func (s *LibraryService) ReadBook(libraryId string, bookId models.BookId) (models.BookModelDetail, error) {
	bookBase, err := s.ReadBookBase(libraryId, bookId)
	if err != nil {
		return models.BookModelDetail{}, err
	}

	filteredPages := filterPages(bookBase.KnownPages, bookBase.IgnorePatterns)

	return models.BookModelDetail{
		BookModelBase: bookBase,
		PageFilePaths: utils.SortStringSlice(filteredPages, utils.NaturalNumberOrder, false),
	}, nil
}

func filterPages(pages []string, ignorePatterns []string) []string {
	result := []string{}
	for _, page := range pages {
		shouldExclude := false
		for _, ignorePattern := range ignorePatterns {
			isMatch, err := doublestar.Match(ignorePattern, page)
			if err != nil {
				continue
			}
			if isMatch {
				shouldExclude = true
				break
			}
		}
		if !shouldExclude {
			result = append(result, page)
		}
	}
	return result
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
			return false
		}
	}

	return true
}

func (s *LibraryService) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	if settings.Name == "" {
		settings.Name = filepath.Base(bookDir)
	}

	lib, err := s.GetLibrary(libraryId)
	if err != nil {
		return "", err
	}

	imageFilePaths, err := getAllPagesInBook(filepath.Join(lib.RootDirFullPath, bookDir))
	if err != nil {
		return "", err
	}
	settings.KnownPages = imageFilePaths

	id, err := s.dbWriter.CreateBook(libraryId, bookDir, settings)
	if err != nil {
		return "", err
	}
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

	if input.IgnorePatterns != nil {
		settings.IgnorePatterns = input.IgnorePatterns
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

	return pages, nil
}

func (s *LibraryService) mutateBook(libraryId string, bookId string, mutation func(book models.BookModelBase) (models.BookSettings, error)) error {
	bookIdLocal, err := models.CastToBookId(bookId)
	if err != nil {
		return err
	}

	updateTargetBook, err := s.dbReader.ReadBook(libraryId, bookIdLocal)
	if err != nil {
		return err
	}

	nextSettings, err := mutation(updateTargetBook)
	if err != nil {
		return err
	}

	_, err = s.dbWriter.UpdateBook(libraryId, bookIdLocal, nextSettings)
	if err != nil {
		return err
	}

	return nil
}

func (s *LibraryService) UpsertBookmark(libraryId string, bookId string, input models.BookmarkCreateInput) (string, error) {
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		nextSettings := book.BookSettings
		nextBookmarks := book.Bookmarks
		isUpdate := false

		nextBookmark, err := models.CreateBookmarkModel(book.DirFullPath, input.Page, models.CreateBookmarkModelOptions{
			BookmarkName: input.Name,
		})
		if err != nil {
			return models.BookSettings{}, err
		}

		for i, bm := range nextBookmarks {
			if bm.Page == input.Page {
				nextBookmarks[i] = nextBookmark
				isUpdate = true
				break
			}
		}
		if !isUpdate {
			nextBookmarks = append(nextBookmarks, nextBookmark)
		}
		nextSettings.Bookmarks = nextBookmarks
		return nextSettings, nil
	})
	if err != nil {
		return "", err
	}
	return input.Page, nil
}

func (s *LibraryService) DeleteBookmark(libraryId string, bookId string, page string) (string, error) {
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		nextSettings := book.BookSettings
		nextBookmarks := []models.Bookmark{}
		for _, bm := range book.Bookmarks {
			if bm.Page != page {
				nextBookmarks = append(nextBookmarks, bm)
			}
		}
		nextSettings.Bookmarks = nextBookmarks
		return nextSettings, nil
	})
	if err != nil {
		return "", err
	}
	return page, nil
}

func (s *LibraryService) ReorderBookmark(libraryId string, bookId string, orderedPages []string) ([]models.Bookmark, error) {
	var resultBookmarks []models.Bookmark
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		nextSettings := book.BookSettings
		nextBookmarks := []models.Bookmark{}

		bookmarkPoolMap := map[string]models.Bookmark{}
		for _, bm := range book.Bookmarks {
			bookmarkPoolMap[bm.Page] = bm
		}

		for _, op := range orderedPages {
			bm, ok := bookmarkPoolMap[op]
			if ok {
				nextBookmarks = append(nextBookmarks, bm)
				delete(bookmarkPoolMap, op)
			}
		}

		// append rest bookmarks to prevent to lost bookmark
		if len(bookmarkPoolMap) > 0 {
			for _, cbm := range book.Bookmarks {
				bm, ok := bookmarkPoolMap[cbm.Page]
				if ok {
					nextBookmarks = append(nextBookmarks, bm)
					delete(bookmarkPoolMap, bm.Page)
				}
			}
		}

		nextSettings.Bookmarks = nextBookmarks
		resultBookmarks = nextBookmarks
		return nextSettings, nil
	})
	if err != nil {
		return nil, err
	}
	return resultBookmarks, nil
}

func (s *LibraryService) UpdateBookAttribute(libraryId string, bookId string, attrs []models.BookAttribute) ([]models.BookAttribute, error) {
	latestAttrs := []models.BookAttribute{}
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		updateAttrMap := map[models.BookAttributeId]models.BookAttribute{}
		for _, attr := range attrs {
			updateAttrMap[attr.Id] = attr
		}

		nextSettings := book.BookSettings
		nextAttrs := []models.BookAttribute{}
		nextAttrsMap := map[models.BookAttributeId]models.BookAttribute{}
		for _, attr := range book.Attributes {
			nextAttrsMap[attr.Id] = attr
		}
		for _, updateAttr := range updateAttrMap {
			nextAttrsMap[updateAttr.Id] = updateAttr
		}
		for _, nextAttr := range nextAttrsMap {
			nextAttrs = append(nextAttrs, nextAttr)
		}
		nextSettings.Attributes = nextAttrs
		latestAttrs = nextAttrs

		return nextSettings, nil
	})
	if err != nil {
		return nil, err
	}

	for _, attr := range attrs {
		err = s.CreateBookAttributeTag(libraryId, attr.Id, attr.Value)
		if err != nil {
			return nil, err
		}
	}
	return latestAttrs, nil
}

func (s *LibraryService) UpdateBookBuiltinAttributes(libraryId string, bookId string, input models.UpdateBookBuiltinAttributesInput) (models.BookBuiltinAttributes, error) {
	var latestBuiltinAttrs models.BookBuiltinAttributes
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		nextSettings := book.BookSettings
		nextAttrs := book.BookSettings.BuiltinAttributes

		if input.IsFavorite != nil {
			nextAttrs.IsFavorite = utils.UnwrapBoolPtr(input.IsFavorite)
		}

		nextSettings.BuiltinAttributes = nextAttrs
		latestBuiltinAttrs = nextAttrs
		return nextSettings, nil
	})
	if err != nil {
		return models.BookBuiltinAttributes{}, nil
	}

	return latestBuiltinAttrs, nil
}
