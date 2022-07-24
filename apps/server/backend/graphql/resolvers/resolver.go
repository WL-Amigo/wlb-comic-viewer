package resolvers

import (
	"github.com/private-gallery-server/services/directory"
	"github.com/private-gallery-server/services/library"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	directory *directory.DirectoryService
	library   *library.LibraryService
}

func CreateResolver(directory *directory.DirectoryService, library *library.LibraryService) *Resolver {
	return &Resolver{
		directory: directory,
		library:   library,
	}
}
