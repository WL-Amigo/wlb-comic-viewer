package json_file_database

import (
	"errors"

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

	attrs := []serializable.BookAttributeSettingJson{}
	for _, attrModel := range model.Attributes {
		attrs = append(attrs, serializable.CreateBookAttributeSettingJsonFromModel(attrModel))
	}
	libraryRoot.Libraries = append(libraryRoot.Libraries, serializable.LibrarySettingsJson{
		Id:         id,
		Name:       model.Name,
		RootDir:    model.RootDir,
		Attributes: attrs,
	})

	if err = db.writeLibraryJson(libraryRoot); err != nil {
		return "", err
	}

	return id, nil
}

func (db *JsonFileDatabase) UpdateLibrary(id string, model models.LibrarySettings) (string, error) {
	libraryRoot, err := db.readLibraryJson()
	if err != nil {
		return "", err
	}

	isExist := false
	nextLibs := []serializable.LibrarySettingsJson{}
	for _, existingLib := range libraryRoot.Libraries {
		if existingLib.Id != id {
			nextLibs = append(nextLibs, existingLib)
			continue
		}

		isExist = true

		attrs := []serializable.BookAttributeSettingJson{}
		for _, attrModel := range model.Attributes {
			attrs = append(attrs, serializable.CreateBookAttributeSettingJsonFromModel(attrModel))
		}
		nextLibs = append(nextLibs, serializable.LibrarySettingsJson{
			Id:         id,
			Name:       model.Name,
			RootDir:    model.RootDir,
			Attributes: attrs,
		})
	}

	if !isExist {
		return "", errors.New("target library is not exist")
	}

	libraryRoot.Libraries = nextLibs
	if err = db.writeLibraryJson(libraryRoot); err != nil {
		return "", err
	}

	return id, nil
}

func (db *JsonFileDatabase) CreateBook(libraryId string, bookDir string, settings models.BookSettings) (models.BookId, error) {
	lib, err := db.ReadLibrary(libraryId)
	if err != nil {
		return "", err
	}
	attrs := []serializable.BookAttributeJson{}
	for _, attrModel := range settings.Attributes {
		attrs = append(attrs, serializable.CreateBookAttributeJsonFromModel(attrModel))
	}
	if err = db.writeBookJson(lib.RootDir, bookDir, serializable.BookSettingsJson{
		Name:       settings.Name,
		Attributes: attrs,
	}); err != nil {
		return "", err
	}

	return models.CreateBookId(bookDir), err
}

func (db *JsonFileDatabase) UpdateBook(libraryId string, bookId models.BookId, settings models.BookSettings) (models.BookId, error) {
	lib, err := db.ReadLibrary(libraryId)
	if err != nil {
		return "", err
	}
	attrs := []serializable.BookAttributeJson{}
	for _, attrModel := range settings.Attributes {
		attrs = append(attrs, serializable.CreateBookAttributeJsonFromModel(attrModel))
	}
	bookDir, err := bookId.ToDirPath()
	if err != nil {
		return "", err
	}
	if err = db.writeBookJson(lib.RootDir, bookDir, serializable.BookSettingsJson{
		Name:       settings.Name,
		Attributes: attrs,
	}); err != nil {
		return "", err
	}

	return bookId, nil
}

func (db *JsonFileDatabase) DeleteBook(libraryId string, bookId models.BookId) error {
	panic("not implemented") // TODO: Implement
}
