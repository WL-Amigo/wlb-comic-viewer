package json_file_database

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/services/json_file_database/serializable"
	"github.com/private-gallery-server/utils"
)

func createLibraryModelFromJsonStruct(lib serializable.LibrarySettingsJson, rootDirPath string) models.LibraryModel {
	return models.LibraryModel{
		Id:              lib.Id,
		LibrarySettings: lib.ToSettingsModel(),
		RootDirFullPath: filepath.Join(rootDirPath, lib.RootDir),
	}
}

func (db *JsonFileDatabase) ReadLibraries() ([]models.LibraryModel, error) {
	libraryRootJson, err := db.readLibraryJson()
	if err != nil {
		return nil, err
	}

	result := []models.LibraryModel{}
	for _, lib := range libraryRootJson.Libraries {
		result = append(result, createLibraryModelFromJsonStruct(lib, db.rootDir))
	}

	return result, nil
}

func (db *JsonFileDatabase) ReadLibrary(id string) (models.LibraryModel, error) {
	libraryRootJson, err := db.readLibraryJson()
	if err != nil {
		return models.LibraryModel{}, err
	}

	for _, lib := range libraryRootJson.Libraries {
		if lib.Id == id {
			return createLibraryModelFromJsonStruct(lib, db.rootDir), nil
		}
	}

	return models.LibraryModel{}, errors.New("Not Found")
}

func createBookModelFromJsonStructure(jsonStruct serializable.BookSettingsJson, dirPath string, basePath string) models.BookModelBase {
	attributes := []models.BookAttribute{}
	for _, attrJson := range jsonStruct.Attributes {
		attributes = append(attributes, attrJson.ToModel())
	}

	dirFullPath := filepath.Join(basePath, dirPath)
	bookmarks := []models.Bookmark{}
	for _, bookmarkJson := range jsonStruct.Bookmarks {
		bm, err := bookmarkJson.ToModel(dirFullPath)
		if err != nil {
			continue
		}
		bookmarks = append(bookmarks, bm)
	}

	return models.BookModelBase{
		Id:          models.CreateBookId(dirPath),
		Dir:         dirPath,
		DirFullPath: filepath.Join(basePath, dirPath),
		BookSettings: models.BookSettings{
			Name:              jsonStruct.Name,
			BuiltinAttributes: jsonStruct.BuiltinAttributes.ToModel(),
			Attributes:        attributes,
			KnownPages:        jsonStruct.KnownPages,
			ReadPages:         jsonStruct.ReadPages,
			Bookmarks:         bookmarks,
		},
	}
}

func findBookRecursive(root string, basePath string) ([]models.BookModelBase, error) {
	result := []models.BookModelBase{}
	err := utils.WalkDir(filepath.Join(basePath, root), func(path string) error {
		bookJsonPath := filepath.Join(path, bookSettingsFileName)
		if _, err := os.Stat(bookJsonPath); err != nil {
			return nil
		}
		bookJson, err := readBookJsonWithAbsPath(bookJsonPath)
		if err != nil {
			return nil
		}
		result = append(result, createBookModelFromJsonStructure(bookJson, strings.TrimPrefix(path, basePath), path))

		return nil
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (db *JsonFileDatabase) ReadBooks(libraryId string) ([]models.BookModelBase, error) {
	lib, err := db.ReadLibrary(libraryId)
	if err != nil {
		return nil, err
	}

	return findBookRecursive("./", lib.RootDirFullPath)
}

func (db *JsonFileDatabase) ReadBook(libraryId string, bookId models.BookId) (models.BookModelBase, error) {
	lib, err := db.ReadLibrary(libraryId)
	if err != nil {
		return models.BookModelBase{}, err
	}

	bookDirPath, err := bookId.ToDirPath()
	if err != nil {
		return models.BookModelBase{}, err
	}
	bookJson, err := db.readBookJson(lib.RootDir, bookDirPath)
	if err != nil {
		return models.BookModelBase{}, err
	}

	return createBookModelFromJsonStructure(bookJson, bookDirPath, lib.RootDirFullPath), nil
}
