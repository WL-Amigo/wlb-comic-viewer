package models

import "errors"

type LibrarySettings struct {
	Name               string
	RootDir            string
	Attributes         []BookAttributeSettings
	TagAttributeValues BookAttributeTagValuesMap
}

func (ls LibrarySettings) FindAttributeSettings(id BookAttributeId) (BookAttributeSettings, error) {
	for _, attrSettings := range ls.Attributes {
		if attrSettings.Id == id {
			return attrSettings, nil
		}
	}
	return BookAttributeSettings{}, errors.New("LibrarySettings: attribute settings not found")
}

type LibrarySettingsUpdateInput struct {
	Name *string
}

type LibraryModel struct {
	LibrarySettings
	Id              string
	RootDirFullPath string
}
