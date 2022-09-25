package library

import (
	"errors"
	"path/filepath"

	"github.com/private-gallery-server/models"
	"github.com/private-gallery-server/utils"
)

func (s *LibraryService) GetAllLibraries() ([]models.LibraryModel, error) {
	return s.dbReader.ReadLibraries()
}

func (s *LibraryService) GetLibrary(id string) (models.LibraryModel, error) {
	return s.dbReader.ReadLibrary(id)
}

func (s *LibraryService) GetAttributeSettings(libraryId string) (map[models.BookAttributeId]models.BookAttributeSettings, error) {
	lib, err := s.GetLibrary(libraryId)
	if err != nil {
		return nil, err
	}

	attrMap := map[models.BookAttributeId]models.BookAttributeSettings{}
	for _, attrSettings := range lib.Attributes {
		attrMap[attrSettings.Id] = attrSettings
	}
	return attrMap, nil
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

func (s *LibraryService) UpdateLibrary(id string, input models.LibrarySettingsUpdateInput) (string, error) {
	lib, err := s.GetLibrary(id)
	if err != nil {
		return "", err
	}
	settings := lib.LibrarySettings

	if input.Name != nil {
		settings.Name = *input.Name
	}

	return s.dbWriter.UpdateLibrary(id, settings)
}

func (s *LibraryService) CreateBookAttributeSettings(id string, input []models.BookAttributeSettingsCreateInput) ([]models.BookAttributeId, error) {
	lib, err := s.GetLibrary(id)
	if err != nil {
		return nil, err
	}
	settings := lib.LibrarySettings

	attrIds := []models.BookAttributeId{}
	for _, existingAttr := range settings.Attributes {
		attrIds = append(attrIds, existingAttr.Id)
	}
	newAttrs := []models.BookAttributeSettings{}
	newAttrIds := []models.BookAttributeId{}
	for _, attrInput := range input {
		newId, err := models.CreateBookAttributeId(attrIds, utils.UnwrapStringPtr((attrInput.Id)))
		if err != nil {
			return nil, err
		}
		newAttrIds = append(newAttrIds, newId)
		newAttrs = append(newAttrs, models.BookAttributeSettings{
			Id:          newId,
			DisplayName: attrInput.DisplayName,
			ValueType:   attrInput.ValueType,
		})
	}
	settings.Attributes = append(lib.Attributes, newAttrs...)

	if _, err := s.dbWriter.UpdateLibrary(id, settings); err != nil {
		return nil, err
	}

	return newAttrIds, nil
}

func (s *LibraryService) UpdateBookAttributeSettings(id string, input []models.BookAttributeSettingsUpdateInput) ([]models.BookAttributeId, error) {
	lib, err := s.GetLibrary(id)
	if err != nil {
		return nil, err
	}
	settings := lib.LibrarySettings

	attrMap := map[models.BookAttributeId]models.BookAttributeSettings{}
	updatedAttrIds := []models.BookAttributeId{}
	for _, existingAttr := range settings.Attributes {
		attrMap[existingAttr.Id] = existingAttr
	}
	for _, attrInput := range input {
		updateTargetAttr, ok := attrMap[attrInput.Id]
		if !ok {
			continue
		}
		updatedAttrIds = append(updatedAttrIds, attrInput.Id)
		if attrInput.DisplayName != nil {
			updateTargetAttr.DisplayName = *attrInput.DisplayName
		}
		if attrInput.ValueType != nil {
			updateTargetAttr.ValueType = *attrInput.ValueType
		}
		attrMap[attrInput.Id] = updateTargetAttr
	}
	nextAttrs := []models.BookAttributeSettings{}
	for _, v := range attrMap {
		nextAttrs = append(nextAttrs, v)
	}
	settings.Attributes = nextAttrs

	if _, err := s.dbWriter.UpdateLibrary(id, settings); err != nil {
		return nil, err
	}

	return updatedAttrIds, nil
}
