package service_interfaces

import "github.com/private-gallery-server/models"

type IDatabaseReader interface {
	ReadLibraries() ([]models.LibraryModel, error)
	ReadLibrary(id string) (models.LibraryModel, error)
	ReadBooks(libraryId string) ([]models.BookModelBase, error)
	ReadBook(libraryId string, bookId string) (models.BookModelBase, error)
}
