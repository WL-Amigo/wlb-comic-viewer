package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"sort"

	"github.com/private-gallery-server/graphql/generated"
	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

// CreateBook is the resolver for the createBook field.
func (r *mutationResolver) CreateBook(ctx context.Context, libraryID string, init model.BookInitInput, input model.BookInput, attributesInput []*model.BookAttributeInput) (string, error) {
	attrs := []models.BookAttribute{}
	for _, attrInput := range attributesInput {
		attrs = append(attrs, models.BookAttribute{
			Id:    models.BookAttributeId(attrInput.ID),
			Value: attrInput.Value,
		})
	}

	id, err := r.library.CreateBook(libraryID, init.Dir, models.BookSettings{
		Name: utils.UnwrapStringPtr(input.Name),
	})
	return string(id), err
}

// UpdateBook is the resolver for the updateBook field.
func (r *mutationResolver) UpdateBook(ctx context.Context, libraryID string, bookID string, input model.BookInput, attributesInput []*model.BookAttributeInput) (string, error) {
	attrs := []models.BookAttribute{}
	for _, attrInput := range attributesInput {
		attrs = append(attrs, models.BookAttribute{
			Id:    models.BookAttributeId(attrInput.ID),
			Value: attrInput.Value,
		})
	}

	updatedId, err := r.library.UpdateBook(libraryID, bookID, models.BookSettingsUpdateInput{
		Name:       input.Name,
		Attributes: attrs,
	})
	if err != nil {
		return "", err
	}

	return string(updatedId), nil
}

// DeleteBook is the resolver for the deleteBook field.
func (r *mutationResolver) DeleteBook(ctx context.Context, libraryID string, bookID string) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// BookUpdateKnownPages is the resolver for the bookUpdateKnownPages field.
func (r *mutationResolver) BookUpdateKnownPages(ctx context.Context, libraryID string, bookID string) ([]string, error) {
	return r.library.UpdateKnownPagesInBook(libraryID, bookID)
}

// BookPageMarkAsRead is the resolver for the bookPageMarkAsRead field.
func (r *mutationResolver) BookPageMarkAsRead(ctx context.Context, libraryID string, bookID string, page string) (string, error) {
	result, err := r.library.MarkAsReadPage(libraryID, bookID, []string{page})
	if err != nil || len(result) == 0 {
		return "", err
	}
	return result[0], nil
}

// BookPageCreateBookmark is the resolver for the bookPageCreateBookmark field.
func (r *mutationResolver) BookPageCreateBookmark(ctx context.Context, libraryID string, bookID string, page string, option *model.BookBookmarkInput) (string, error) {
	input := models.BookmarkCreateInput{
		Page: page,
	}
	if option != nil {
		if option.Name != nil {
			input.Name = *option.Name
		}
	}

	return r.library.UpsertBookmark(libraryID, bookID, input)
}

// BookPageDeleteBookmark is the resolver for the bookPageDeleteBookmark field.
func (r *mutationResolver) BookPageDeleteBookmark(ctx context.Context, libraryID string, bookID string, page string) (string, error) {
	return r.library.DeleteBookmark(libraryID, bookID, page)
}

// Book is the resolver for the book field.
func (r *queryResolver) Book(ctx context.Context, libraryID string, bookID string) (*model.Book, error) {
	attrSettingsMap, err := r.library.GetAttributeSettings(libraryID)
	if err != nil {
		return nil, err
	}
	bookIdLocal, err := models.CastToBookId(bookID)
	if err != nil {
		return nil, err
	}
	bookDetail, err := r.library.ReadBook(libraryID, bookIdLocal)
	if err != nil {
		return nil, err
	}

	bookAttrMap := map[models.BookAttributeId]models.BookAttribute{}
	for _, attr := range bookDetail.Attributes {
		bookAttrMap[attr.Id] = attr
	}

	attrs := []*model.BookAttribute{}
	for _, attrSettingsModel := range attrSettingsMap {
		attr, ok := bookAttrMap[attrSettingsModel.Id]
		if !ok {
			attrs = append(attrs, &model.BookAttribute{
				ID:          string(attrSettingsModel.Id),
				DisplayName: attrSettingsModel.DisplayName,
				ValueType:   model.BookAttributeValueTypeEnum(attrSettingsModel.ValueType),
				Value:       "",
			})
			continue
		}
		attrs = append(attrs, &model.BookAttribute{
			ID:          string(attrSettingsModel.Id),
			DisplayName: attrSettingsModel.DisplayName,
			ValueType:   model.BookAttributeValueTypeEnum(attrSettingsModel.ValueType),
			Value:       attr.Value,
		})
	}
	// TODO: sort by explicitly specified order
	sort.Slice(attrs, func(i, j int) bool { return attrs[i].DisplayName < attrs[j].DisplayName })

	bookmarks := []*model.BookBookmark{}
	for _, bookmarkModel := range bookDetail.Bookmarks {
		bookmarks = append(bookmarks, &model.BookBookmark{
			Page: bookmarkModel.Page,
			Name: bookmarkModel.Name,
		})
	}

	return &model.Book{
		ID:         bookID,
		Name:       bookDetail.Name,
		Dir:        bookDetail.Dir,
		Pages:      bookDetail.PageFilePaths,
		Attributes: attrs,
		Bookmarks:  bookmarks,
		IsRead:     r.library.CheckIsBookRead(bookDetail.BookModelBase),
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
