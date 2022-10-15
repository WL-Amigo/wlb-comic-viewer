package cache_layer_database

import (
	"github.com/private-gallery-server/models"
)

func (db *CacheLayerDatabase) CreateLibrary(model models.LibrarySettings) (string, error) {
	return db.writerInternal.CreateLibrary(model)
}

func (db *CacheLayerDatabase) UpdateLibrary(id string, model models.LibrarySettings) (string, error) {
	return db.writerInternal.UpdateLibrary(id, model)
}

func (db *CacheLayerDatabase) updateBookCache(libraryId string, bookId models.BookId, settings models.BookSettings) error {
	book, err := db.ReadBook(libraryId, bookId)
	if err != nil {
		return err
	}
	book.BookSettings = settings

	// update book cache
	db.bookCache[getLibraryBookCacheKey(libraryId, bookId)] = book

	// update library-books cache
	cachedBooksMap, ok := db.libraryToBookMapCache[libraryId]
	if ok {
		cachedBooksMap[bookId] = book
	}

	return nil
}

func (db *CacheLayerDatabase) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	id, err := db.writerInternal.CreateBook(libraryId, bookDir, settings)
	if err != nil {
		return "", err
	}

	if err = db.updateBookCache(libraryId, id, settings); err != nil {
		return "", err
	}

	return id, nil
}

func (db *CacheLayerDatabase) UpdateBook(libraryId string, bookId models.BookId, settings models.BookSettings) (models.BookId, error) {
	id, err := db.writerInternal.UpdateBook(libraryId, bookId, settings)
	if err != nil {
		return "", err
	}

	if err = db.updateBookCache(libraryId, id, settings); err != nil {
		return "", err
	}

	return id, nil
}

func (db *CacheLayerDatabase) DeleteBook(libraryId string, bookId models.BookId) error {
	panic("not implemented") // TODO: Implement
}
