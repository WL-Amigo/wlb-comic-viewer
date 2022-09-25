package json_file_database

import (
	"path"
	"sync"

	"github.com/private-gallery-server/env"
	"github.com/private-gallery-server/services/json_file_database/serializable"
	"github.com/private-gallery-server/utils"
)

type JsonFileDatabase struct {
	rootDir string
	mtx     sync.Mutex
}

func CreateJsonFileDatabase(env env.EnvironmentSettings) *JsonFileDatabase {
	return &JsonFileDatabase{
		rootDir: env.RootDir,
	}
}

func (db *JsonFileDatabase) getLibraryJsonPath() string {
	return path.Join(db.rootDir, librarySettingsFileName)
}

func (db *JsonFileDatabase) readLibraryJson() (serializable.LibrarySettingsRootJson, error) {
	var result serializable.LibrarySettingsRootJson

	libraryJsonFilePath := db.getLibraryJsonPath()
	db.mtx.Lock()
	defer db.mtx.Unlock()
	if err := utils.MaybeReadJsonFile(libraryJsonFilePath, &result); err != nil {
		return result, err
	}

	return result, nil
}

func (db *JsonFileDatabase) writeLibraryJson(settings serializable.LibrarySettingsRootJson) error {
	db.mtx.Lock()
	defer db.mtx.Unlock()
	return utils.WriteJsonFile(db.getLibraryJsonPath(), &settings)
}

func (db *JsonFileDatabase) getBookJsonPath(libRootPath string, bookSubPath string) string {
	return path.Join(db.rootDir, libRootPath, bookSubPath, bookSettingsFileName)
}

func readBookJsonWithAbsPath(path string) (serializable.BookSettingsJson, error) {
	var result serializable.BookSettingsJson

	if err := utils.MaybeReadJsonFile(path, &result); err != nil {
		return result, err
	}

	return result, nil
}

func (db *JsonFileDatabase) readBookJson(libRootPath string, bookSubPath string) (serializable.BookSettingsJson, error) {
	db.mtx.Lock()
	defer db.mtx.Unlock()
	return readBookJsonWithAbsPath(db.getBookJsonPath(libRootPath, bookSubPath))
}

func (db *JsonFileDatabase) writeBookJson(libRootPath string, bookSubPath string, settings serializable.BookSettingsJson) error {
	db.mtx.Lock()
	defer db.mtx.Unlock()
	return utils.WriteJsonFile(db.getBookJsonPath(libRootPath, bookSubPath), &settings)
}
