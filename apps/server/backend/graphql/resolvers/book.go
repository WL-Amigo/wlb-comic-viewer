package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/private-gallery-server/graphql/generated"
	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

// CreateBook is the resolver for the createBook field.
func (r *mutationResolver) CreateBook(ctx context.Context, libraryID string, init model.BookInitInput, input model.BookInput) (string, error) {
	return r.library.CreateBook(libraryID, init.Dir, models.BookSettings{
		Name: utils.UnwrapStringPtr(input.Name),
	})
}

// UpdateBook is the resolver for the updateBook field.
func (r *mutationResolver) UpdateBook(ctx context.Context, libraryID string, bookID string, input model.BookInput) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// DeleteBook is the resolver for the deleteBook field.
func (r *mutationResolver) DeleteBook(ctx context.Context, libraryID string, bookID string) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// Book is the resolver for the book field.
func (r *queryResolver) Book(ctx context.Context, libraryID string, bookID string) (*model.Book, error) {
	bookDetail, err := r.library.ReadBook(libraryID, bookID)
	if err != nil {
		return nil, err
	}

	return &model.Book{
		ID:    bookID,
		Name:  bookDetail.Name,
		Dir:   bookDetail.Dir,
		Pages: bookDetail.PageFilePaths,
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
