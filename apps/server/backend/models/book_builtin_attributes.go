package models

type BookBuiltinAttributes struct {
	IsFavorite bool
}

type UpdateBookBuiltinAttributesInput struct {
	IsFavorite *bool
}
