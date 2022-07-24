package echo_book_handlers

import "path/filepath"

func (h *BookHandler) GetPageFullPath(libraryId string, bookId string, pageFilePath string) (string, error) {
	bookBase, err := h.library.ReadBookBase(libraryId, bookId)
	if err != nil {
		return "", err
	}

	return filepath.Join(bookBase.DirFullPath, pageFilePath), nil
}
