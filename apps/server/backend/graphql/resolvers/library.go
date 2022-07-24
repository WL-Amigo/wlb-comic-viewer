package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

// CreateLibrary is the resolver for the createLibrary field.
func (r *mutationResolver) CreateLibrary(ctx context.Context, input model.LibraryInput) (string, error) {
	return r.library.CreateLibrary(models.LibrarySettings{
		Name:    utils.UnwrapStringPtr(input.Name),
		RootDir: input.RootDir,
	})
}

// UpdateLibrary is the resolver for the updateLibrary field.
func (r *mutationResolver) UpdateLibrary(ctx context.Context, id string, input model.LibraryInput) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// Libraries is the resolver for the libraries field.
func (r *queryResolver) Libraries(ctx context.Context) ([]*model.LibraryMin, error) {
	libraries, err := r.library.GetAllLibraries()
	if err != nil {
		return nil, err
	}

	results := []*model.LibraryMin{}
	for _, lib := range libraries {
		results = append(results, &model.LibraryMin{
			ID:   lib.Id,
			Name: lib.Name,
		})
	}

	return results, nil
}

// Library is the resolver for the library field.
func (r *queryResolver) Library(ctx context.Context, id string) (*model.Library, error) {
	library, err := r.library.GetLibrary(id)
	if err != nil {
		return nil, err
	}
	books, err := r.library.GetAllBooksInLibrary(id)
	if err != nil {
		return nil, err
	}

	resultBooks := []*model.BookMin{}
	for _, book := range books {
		resultBooks = append(resultBooks, &model.BookMin{
			ID:   string(book.Id),
			Name: book.Name,
		})
	}

	return &model.Library{
		ID:      library.Id,
		Name:    library.Name,
		RootDir: library.RootDir,
		Books:   resultBooks,
	}, nil
}
