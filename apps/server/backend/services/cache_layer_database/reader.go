package cache_layer_database

import (
	"github.com/private-gallery-server/models"
	"golang.org/x/exp/maps"
)

func (db *CacheLayerDatabase) ReadLibraries() ([]models.LibraryModel, error) {
	return db.readerInternal.ReadLibraries()
}

func (db *CacheLayerDatabase) ReadLibrary(id string) (models.LibraryModel, error) {
	return db.readerInternal.ReadLibrary(id)
}

func (db *CacheLayerDatabase) ReadBooks(libraryId string) ([]models.BookModelBase, error) {
	cached, ok := db.libraryToBookMapCache[libraryId]
	if ok {
		books := maps.Values(cached)
		return books, nil
	}

	books, err := db.readerInternal.ReadBooks(libraryId)
	if err != nil {
		return nil, err
	}
	booksMap := booksMap{}
	for _, book := range books {
		booksMap[book.Id] = book
	}
	db.libraryToBookMapCache[libraryId] = booksMap

	return books, nil
}

func (db *CacheLayerDatabase) ReadBook(libraryId string, bookId models.BookId) (models.BookModelBase, error) {
	cached, ok := db.bookCache[getLibraryBookCacheKey(libraryId, bookId)]
	if ok {
		return cached, nil
	}

	book, err := db.readerInternal.ReadBook(libraryId, bookId)
	if err != nil {
		return models.BookModelBase{}, err
	}
	db.bookCache[getLibraryBookCacheKey(libraryId, bookId)] = book

	return book, nil
}
