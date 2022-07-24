package service_interfaces

import "github.com/private-gallery-server/models"

type IDatabaseWriter interface {
	CreateLibrary(model models.LibrarySettings) (string, error)
	UpdateLibrary(id string, model models.LibrarySettings) (string, error)
	CreateBook(libraryId string, bookDir string, settings models.BookSettings) (string, error)
	UpdateBook(libraryId string, bookId string, settings models.BookSettings) (string, error)
	DeleteBook(libraryId string, bookId string) error
}
