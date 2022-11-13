package serializable

import "github.com/private-gallery-server/models"

type BookmarkJson struct {
	Page         string `json:"page"`
	PageFileHash string `json:"pageFileHash"`
	Name         string `json:"name"`
}

func CreateBookmarkJsonFromModel(model models.Bookmark) BookmarkJson {
	return BookmarkJson{
		Page:         model.Page,
		PageFileHash: model.GetPageFileHash(),
		Name:         model.Name,
	}
}

func (b BookmarkJson) ToModel(bookBasePath string) (models.Bookmark, error) {
	return models.CreateBookmarkModel(bookBasePath, b.Page, models.CreateBookmarkModelOptions{
		PageFileHash: b.PageFileHash,
		BookmarkName: b.Name,
	})
}
