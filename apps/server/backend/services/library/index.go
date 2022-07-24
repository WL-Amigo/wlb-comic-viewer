package library

import (
	"github.com/private-gallery-server/env"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/service_interfaces"
)

type BooksSlice []models.BookModelBase

type LibraryService struct {
	rootDir  string
	dbReader service_interfaces.IDatabaseReader
	dbWriter service_interfaces.IDatabaseWriter

	booksCacheMap map[string]BooksSlice
	bookCacheMap  map[string]models.BookModelBase
}

func CreateLibraryService(env env.EnvironmentSettings, dbReader service_interfaces.IDatabaseReader, dbWriter service_interfaces.IDatabaseWriter) *LibraryService {
	return &LibraryService{
		rootDir:       env.RootDir,
		dbReader:      dbReader,
		dbWriter:      dbWriter,
		booksCacheMap: map[string]BooksSlice{},
		bookCacheMap:  map[string]models.BookModelBase{},
	}
}
