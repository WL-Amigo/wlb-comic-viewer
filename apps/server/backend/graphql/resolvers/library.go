package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/private-gallery-server/graphql/adapters"
	"github.com/private-gallery-server/graphql/generated"
	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/services/library"
	"github.com/private-gallery-server/utils"
)

// Books is the resolver for the books field.
func (r *libraryResolver) Books(ctx context.Context, obj *model.Library, filter *model.BookFilterParams) ([]*model.Book, error) {
	booksFilter := library.BooksFilter{}
	if filter != nil {
		booksFilter.IsRead = filter.IsRead
		booksFilter.IsFavorite = filter.IsFavorite
		for _, af := range filter.Attributes {
			booksFilter.Attributes = append(booksFilter.Attributes, library.BooksAttributeFilter{
				Id:    models.BookAttributeId(af.ID),
				Value: af.Value,
			})
		}
	}
	books, err := r.library.QueryBooksInLibrary(obj.ID, booksFilter)
	if err != nil {
		return nil, err
	}

	resultBooks := []*model.Book{}
	for _, book := range books {
		resultBooks = append(resultBooks, &model.Book{
			ID:    string(book.Id),
			Name:  book.Name,
			Dir:   book.Dir,
			Pages: book.KnownPages,
			BuiltinAttributes: &model.BookBuiltinAttributes{
				IsFavorite: book.BuiltinAttributes.IsFavorite,
			},
			Attributes: []*model.BookAttribute{}, // TODO
			Bookmarks:  []*model.BookBookmark{},  // TODO
			IsRead:     r.library.CheckIsBookRead(book),
		})
	}

	return resultBooks, nil
}

// CreateLibrary is the resolver for the createLibrary field.
func (r *mutationResolver) CreateLibrary(ctx context.Context, input model.LibraryCreateInput, attributesInput []*model.BookAttributeSettingCreateInput) (string, error) {
	attrs := []models.BookAttributeSettings{}
	for _, attrInput := range attributesInput {
		vt := adapters.CastGqlBookAttributeValueTypeEnum(attrInput.ValueType)

		attrs = append(attrs, models.BookAttributeSettings{
			Id:          models.BookAttributeId(*attrInput.ID),
			DisplayName: attrInput.DisplayName,
			ValueType:   vt,
		})
	}

	return r.library.CreateLibrary(models.LibrarySettings{
		Name:       utils.UnwrapStringPtr(input.Name),
		RootDir:    input.RootDir,
		Attributes: attrs,
	})
}

// UpdateLibrary is the resolver for the updateLibrary field.
func (r *mutationResolver) UpdateLibrary(ctx context.Context, id string, input model.LibraryUpdateInput) (string, error) {
	return r.library.UpdateLibrary(id, models.LibrarySettingsUpdateInput{
		Name: input.Name,
	})
}

// CreateBookAttributeSettings is the resolver for the createBookAttributeSettings field.
func (r *mutationResolver) CreateBookAttributeSettings(ctx context.Context, libraryID string, input []*model.BookAttributeSettingCreateInput) ([]string, error) {
	attrs := []models.BookAttributeSettingsCreateInput{}
	for _, inputAttrs := range input {
		attrs = append(attrs, models.BookAttributeSettingsCreateInput{
			Id:          inputAttrs.ID,
			DisplayName: inputAttrs.DisplayName,
			ValueType:   adapters.CastGqlBookAttributeValueTypeEnum(inputAttrs.ValueType),
		})
	}

	ids, err := r.library.CreateBookAttributeSettings(libraryID, attrs)
	if err != nil {
		return nil, err
	}
	idStrs := []string{}
	for _, id := range ids {
		idStrs = append(idStrs, string(id))
	}
	return idStrs, nil
}

// UpdateBookAttributeSettings is the resolver for the updateBookAttributeSettings field.
func (r *mutationResolver) UpdateBookAttributeSettings(ctx context.Context, libraryID string, input []*model.BookAttributeSettingUpdateInput) ([]string, error) {
	attrs := []models.BookAttributeSettingsUpdateInput{}
	for _, inputAttrs := range input {
		var vt *models.BookAttributeValueTypeEnum
		if inputAttrs.ValueType != nil {
			vtv := adapters.CastGqlBookAttributeValueTypeEnum(*inputAttrs.ValueType)
			vt = &vtv
		}
		attrs = append(attrs, models.BookAttributeSettingsUpdateInput{
			Id:          models.BookAttributeId(inputAttrs.ID),
			DisplayName: inputAttrs.DisplayName,
			ValueType:   vt,
		})
	}

	ids, err := r.library.UpdateBookAttributeSettings(libraryID, attrs)
	if err != nil {
		return nil, err
	}
	idStrs := []string{}
	for _, id := range ids {
		idStrs = append(idStrs, string(id))
	}
	return idStrs, nil
}

// DeleteBookAttributeTag is the resolver for the deleteBookAttributeTag field.
func (r *mutationResolver) DeleteBookAttributeTag(ctx context.Context, libraryID string, attributeID string, tag string) (string, error) {
	err := r.library.DeleteBookAttributeTag(libraryID, models.BookAttributeId(attributeID), tag)
	if err != nil {
		return "", err
	}
	return tag, nil
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
	lib, err := r.library.GetLibrary(id)
	if err != nil {
		return nil, err
	}

	resultAttrs := []model.BookAttributeSettingUnion{}
	for _, attr := range lib.Attributes {
		if attr.ValueType == models.BookAttributeValueTypeTag {
			tags, _ := lib.TagAttributeValues[attr.Id]
			resultAttrs = append(resultAttrs, &model.BookAttributeSettingTag{
				ID:          string(attr.Id),
				DisplayName: attr.DisplayName,
				ValueType:   adapters.CastModelBookAttributeValueTypeEnum(attr.ValueType),
				Tags:        tags,
			})
		} else {
			resultAttrs = append(resultAttrs, &model.BookAttributeSettingBasic{
				ID:          string(attr.Id),
				DisplayName: attr.DisplayName,
				ValueType:   adapters.CastModelBookAttributeValueTypeEnum(attr.ValueType),
			})
		}
	}

	return &model.Library{
		ID:         lib.Id,
		Name:       lib.Name,
		RootDir:    lib.RootDir,
		Attributes: resultAttrs,
	}, nil
}

// Library returns generated.LibraryResolver implementation.
func (r *Resolver) Library() generated.LibraryResolver { return &libraryResolver{r} }

type libraryResolver struct{ *Resolver }
