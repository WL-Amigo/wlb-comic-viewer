package library

import (
	"errors"
	"path/filepath"

	"github.com/private-gallery-server/models"
)

func (s *LibraryService) GetAllLibraries() ([]models.LibraryModel, error) {
	return s.dbReader.ReadLibraries()
}

func (s *LibraryService) GetLibrary(id string) (models.LibraryModel, error) {
	return s.dbReader.ReadLibrary(id)
}

func (s *LibraryService) CreateLibrary(library models.LibrarySettings) (string, error) {
	if library.RootDir == "" {
		return "", errors.New("Validation Error")
	}
	if library.Name == "" {
		library.Name = filepath.Base(library.RootDir)
	}

	return s.dbWriter.CreateLibrary(library)
}
