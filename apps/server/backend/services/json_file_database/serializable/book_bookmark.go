package serializable

import "github.com/private-gallery-server/models"

type BookmarkJson struct {
	Page string `json:"page"`
	Name string `json:"name"`
}

func CreateBookmarkJsonFromModel(model models.Bookmark) BookmarkJson {
	return BookmarkJson{
		Page: model.Page,
		Name: model.Name,
	}
}

func (b BookmarkJson) ToModel() models.Bookmark {
	return models.Bookmark{
		Page: b.Page,
		Name: b.Name,
	}
}
