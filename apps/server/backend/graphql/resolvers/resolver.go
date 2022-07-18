package resolvers

import "github.com/private-gallery-server/services/directory"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	directory *directory.DirectoryService
}

func CreateResolver(directory *directory.DirectoryService) *Resolver {
	return &Resolver{
		directory: directory,
	}
}
