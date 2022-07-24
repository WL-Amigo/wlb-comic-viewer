package echo_book_handlers

import (
	"path/filepath"

	"github.com/private-gallery-server/models"
)

func (h *BookHandler) GetPageFullPath(libraryId string, bookId models.BookId, pageFilePath string) (string, error) {
	bookBase, err := h.library.ReadBookBase(libraryId, bookId)
	if err != nil {
		return "", err
	}

	return filepath.Join(bookBase.DirFullPath, pageFilePath), nil
}
