package library

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

func (s *LibraryService) RecoveryBookmarkPointsToMissingFile(libraryId string, bookId string) ([]models.Bookmark, error) {
	var nextBookmarksResult []models.Bookmark
	err := s.mutateBook(libraryId, bookId, func(book models.BookModelBase) (models.BookSettings, error) {
		nextSettings := book.BookSettings
		nextBookmarks := []models.Bookmark{}

		// since there are maybe bookmark missing page that is not marked IsMissing due to caching,
		// so perform full scan
		for _, bm := range book.Bookmarks {
			pageFullPath := filepath.Join(book.DirFullPath, bm.Page)
			_, err := os.Stat(pageFullPath)
			isMissing := false
			if err != nil {
				if errors.Is(err, os.ErrNotExist) {
					isMissing = true
				} else {
					return models.BookSettings{}, err
				}
			}

			if !isMissing {
				nextBookmarks = append(nextBookmarks, bm)
				continue
			}

			pageFindResult := ""
			err = filepath.WalkDir(book.DirFullPath, func(path string, d fs.DirEntry, err error) error {
				if err != nil {
					return nil
				}
				if d.IsDir() {
					return nil
				}
				if utils.HasFileSameHash(path, bm.GetPageFileHash()) {
					pageFindResult = path
				}
				return nil
			})
			if err != nil {
				return models.BookSettings{}, err
			}
			if pageFindResult == "" {
				nextBookmark, err := models.CreateBookmarkModel(book.DirFullPath, bm.Page, models.CreateBookmarkModelOptions{
					PageFileHash: bm.GetPageFileHash(),
					BookmarkName: bm.Name,
				})
				if err != nil {
					return models.BookSettings{}, err
				}
				nextBookmarks = append(nextBookmarks, nextBookmark)
				continue
			}

			pageFindResultRelative := strings.TrimPrefix(pageFindResult, book.DirFullPath)
			pageFindResultRelative = strings.TrimPrefix(pageFindResultRelative, "/")
			nextBookmark, err := models.CreateBookmarkModel(book.DirFullPath, pageFindResultRelative, models.CreateBookmarkModelOptions{
				BookmarkName: bm.Name,
			})
			if err != nil {
				return models.BookSettings{}, err
			}
			nextBookmarks = append(nextBookmarks, nextBookmark)
		}

		nextSettings.Bookmarks = nextBookmarks
		nextBookmarksResult = nextBookmarks
		return nextSettings, nil
	})
	if err != nil {
		return nil, err
	}
	return nextBookmarksResult, nil
}
