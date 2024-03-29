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
		Name:           input.Name,
		Attributes:     attrs,
		IgnorePatterns: input.IgnorePatterns,
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

// BookUpdateBuiltinAttribute is the resolver for the bookUpdateBuiltinAttribute field.
func (r *mutationResolver) BookUpdateBuiltinAttribute(ctx context.Context, libraryID string, bookID string, input model.BookBuiltinAttributesInput) (*model.BookBuiltinAttributes, error) {
	serviceInput := models.UpdateBookBuiltinAttributesInput{
		IsFavorite: input.IsFavorite,
	}
	result, err := r.library.UpdateBookBuiltinAttributes(libraryID, bookID, serviceInput)
	if err != nil {
		return nil, err
	}

	return &model.BookBuiltinAttributes{
		IsFavorite: result.IsFavorite,
	}, nil
}

// BookUpdateAttribute is the resolver for the bookUpdateAttribute field.
func (r *mutationResolver) BookUpdateAttribute(ctx context.Context, libraryID string, bookID string, input []*model.BookAttributeInput) (string, error) {
	attrInput := []models.BookAttribute{}
	for _, attr := range input {
		attrInput = append(attrInput, models.BookAttribute{
			Id:    models.BookAttributeId(attr.ID),
			Value: attr.Value,
		})
	}

	_, err := r.library.UpdateBookAttribute(libraryID, bookID, attrInput)
	if err != nil {
		return "", err
	}

	return bookID, nil
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

// BookPageReorderBookmark is the resolver for the bookPageReorderBookmark field.
func (r *mutationResolver) BookPageReorderBookmark(ctx context.Context, libraryID string, bookID string, orderedPages []string) ([]*model.BookBookmark, error) {
	internalResults, err := r.library.ReorderBookmark(libraryID, bookID, orderedPages)
	if err != nil {
		return nil, err
	}

	results := []*model.BookBookmark{}
	for _, bm := range internalResults {
		var bookmarkError *model.BookmarkErrorTypeEnum
		if bm.IsMissing() {
			e := model.BookmarkErrorTypeEnumMissingPageFile
			bookmarkError = &e
		}
		results = append(results, &model.BookBookmark{
			Name:  bm.Name,
			Page:  bm.Page,
			Error: bookmarkError,
		})
	}

	return results, nil
}

// BookPageRecoveryBookmark is the resolver for the bookPageRecoveryBookmark field.
func (r *mutationResolver) BookPageRecoveryBookmark(ctx context.Context, libraryID string, bookID string) ([]*model.BookBookmark, error) {
	internalResults, err := r.library.RecoveryBookmarkPointsToMissingFile(libraryID, bookID)
	if err != nil {
		return nil, err
	}

	results := []*model.BookBookmark{}
	for _, bm := range internalResults {
		var bookmarkError *model.BookmarkErrorTypeEnum
		if bm.IsMissing() {
			e := model.BookmarkErrorTypeEnumMissingPageFile
			bookmarkError = &e
		}
		results = append(results, &model.BookBookmark{
			Name:  bm.Name,
			Page:  bm.Page,
			Error: bookmarkError,
		})
	}

	return results, nil
}

// Book is the resolver for the book field.
func (r *queryResolver) Book(ctx context.Context, libraryID string, bookID string) (*model.Book, error) {
	lib, err := r.library.GetLibrary(libraryID)
	if err != nil {
		return nil, err
	}
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
		var existingTags []string
		if attrSettingsModel.ValueType == models.BookAttributeValueTypeTag {
			existingTags, _ = lib.TagAttributeValues[attrSettingsModel.Id]
		}
		if !ok {
			attrs = append(attrs, &model.BookAttribute{
				ID:           string(attrSettingsModel.Id),
				DisplayName:  attrSettingsModel.DisplayName,
				ValueType:    model.BookAttributeValueTypeEnum(attrSettingsModel.ValueType),
				Value:        "",
				ExistingTags: existingTags,
			})
			continue
		}
		attrs = append(attrs, &model.BookAttribute{
			ID:           string(attrSettingsModel.Id),
			DisplayName:  attrSettingsModel.DisplayName,
			ValueType:    model.BookAttributeValueTypeEnum(attrSettingsModel.ValueType),
			Value:        attr.Value,
			ExistingTags: existingTags,
		})
	}
	// TODO: sort by explicitly specified order
	sort.Slice(attrs, func(i, j int) bool { return attrs[i].DisplayName < attrs[j].DisplayName })

	bookmarks := []*model.BookBookmark{}
	for _, bookmarkModel := range bookDetail.Bookmarks {
		var bookmarkError *model.BookmarkErrorTypeEnum
		if bookmarkModel.IsMissing() {
			e := model.BookmarkErrorTypeEnumMissingPageFile
			bookmarkError = &e
		}
		bookmarks = append(bookmarks, &model.BookBookmark{
			Page:  bookmarkModel.Page,
			Name:  bookmarkModel.Name,
			Error: bookmarkError,
		})
	}

	return &model.Book{
		ID:    bookID,
		Name:  bookDetail.Name,
		Dir:   bookDetail.Dir,
		Pages: bookDetail.PageFilePaths,
		BuiltinAttributes: &model.BookBuiltinAttributes{
			IsFavorite: bookDetail.BuiltinAttributes.IsFavorite,
		},
		Attributes:     attrs,
		Bookmarks:      bookmarks,
		IsRead:         r.library.CheckIsBookRead(bookDetail.BookModelBase),
		IgnorePatterns: bookDetail.IgnorePatterns,
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
