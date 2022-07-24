package json_file_database

import (
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/services/json_file_database/serializable"
)

func (db *JsonFileDatabase) CreateLibrary(model models.LibrarySettings) (string, error) {
	libraryRoot, err := db.readLibraryJson()
	if err != nil {
		return "", err
	}

	var id string
	for {
		id, err = gonanoid.New()
		if err != nil {
			return "", err
		}
		for _, lib := range libraryRoot.Libraries {
			if lib.Id == id {
				continue
			}
		}
		break
	}

	libraryRoot.Libraries = append(libraryRoot.Libraries, serializable.LibrarySettingsJson{
		Id:      id,
		Name:    model.Name,
		RootDir: model.RootDir,
	})

	if err = db.writeLibraryJson(libraryRoot); err != nil {
		return "", err
	}

	return id, nil
}

func (db *JsonFileDatabase) UpdateLibrary(id string, model models.LibrarySettings) (string, error) {
	panic("not implemented") // TODO: Implement
}

func (db *JsonFileDatabase) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	lib, err := db.ReadLibrary(libraryId)
	if err != nil {
		return "", err
	}
	if err = db.writeBookJson(lib.RootDir, bookDir, serializable.BookSettingsJson{
		Name: settings.Name,
	}); err != nil {
		return "", err
	}

	return models.CreateBookId(bookDir), err
}

func (db *JsonFileDatabase) UpdateBook(libraryId string, bookId models.BookId, settings models.BookSettings) (models.BookId, error) {
	panic("not implemented") // TODO: Implement
}

func (db *JsonFileDatabase) DeleteBook(libraryId string, bookId models.BookId) error {
	panic("not implemented") // TODO: Implement
}
