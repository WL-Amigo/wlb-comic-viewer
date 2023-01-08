package serializable

import "github.com/private-gallery-server/models"

type BookBuiltinAttributeJson struct {
	IsFavorite bool `json:"isFavorite"`
}

func (bba BookBuiltinAttributeJson) ToModel() models.BookBuiltinAttributes {
	return models.BookBuiltinAttributes{
		IsFavorite: bba.IsFavorite,
	}
}

func CreateBookBuiltinAttributesJsonFromModel(model models.BookBuiltinAttributes) BookBuiltinAttributeJson {
	return BookBuiltinAttributeJson{
		IsFavorite: model.IsFavorite,
	}
}
