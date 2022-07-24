package service_interfaces

import "github.com/private-gallery-server/models"

type IDatabaseWriter interface {
	CreateLibrary(model models.LibrarySettings) (string, error)
	UpdateLibrary(id string, model models.LibrarySettings) (string, error)
	CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error)
	UpdateBook(libraryId string, bookId models.BookId, settings models.BookSettings) (models.BookId, error)
	DeleteBook(libraryId string, bookId models.BookId) error
}
