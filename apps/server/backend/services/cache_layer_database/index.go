package cache_layer_database

import (
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/service_interfaces"
)

type booksMap = map[models.BookId]models.BookModelBase
type libraryBookCacheKey string

func getLibraryBookCacheKey(libraryId string, bookId models.BookId) libraryBookCacheKey {
	return libraryBookCacheKey(libraryId + ":" + string(bookId))
}

type CacheLayerDatabase struct {
	readerInternal service_interfaces.IDatabaseReader
	writerInternal service_interfaces.IDatabaseWriter

	libraryToBookMapCache map[string]booksMap
	bookCache             map[libraryBookCacheKey]models.BookModelBase
}

func CreateCacheLayerDatabase(
	reader service_interfaces.IDatabaseReader,
	writer service_interfaces.IDatabaseWriter,
) *CacheLayerDatabase {
	return &CacheLayerDatabase{
		readerInternal:        reader,
		writerInternal:        writer,
		libraryToBookMapCache: map[string]map[models.BookId]models.BookModelBase{},
		bookCache:             map[libraryBookCacheKey]models.BookModelBase{},
	}
}
