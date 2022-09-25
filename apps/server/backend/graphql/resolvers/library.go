package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/private-gallery-server/graphql/adapters"
	"github.com/private-gallery-server/graphql/model"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

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

	resultAttrs := []*model.BookAttributeSetting{}
	for _, attr := range library.Attributes {
		resultAttrs = append(resultAttrs, &model.BookAttributeSetting{
			ID:          string(attr.Id),
			DisplayName: attr.DisplayName,
			ValueType:   adapters.CastModelBookAttributeValueTypeEnum(attr.ValueType),
		})
	}

	return &model.Library{
		ID:         library.Id,
		Name:       library.Name,
		RootDir:    library.RootDir,
		Books:      resultBooks,
		Attributes: resultAttrs,
	}, nil
}
