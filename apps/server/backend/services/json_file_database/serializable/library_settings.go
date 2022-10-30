package serializable

import (
	"path/filepath"

	"github.com/private-gallery-server/models"
)

type LibrarySettingsRootJson struct {
	Libraries []LibrarySettingsJson `json:"libraries"`
}

type LibrarySettingsJson struct {
	Id                 string                     `json:"id"`
	Name               string                     `json:"name"`
	RootDir            string                     `json:"root_dir"`
	Attributes         []BookAttributeSettingJson `json:"attributes"`
	TagAttributeValues map[string][]string        `json:"tagAttributeValues"`
}

func CreateLibrarySettingsJsonFromModel(id string, l models.LibrarySettings) LibrarySettingsJson {
	attrs := []BookAttributeSettingJson{}
	for _, attrModel := range l.Attributes {
		attrs = append(attrs, CreateBookAttributeSettingJsonFromModel(attrModel))
	}

	tagAttributeValues := map[string][]string{}
	for k, v := range l.TagAttributeValues {
		tagAttributeValues[string(k)] = v
	}

	return LibrarySettingsJson{
		Id:                 id,
		Name:               l.Name,
		RootDir:            l.RootDir,
		Attributes:         attrs,
		TagAttributeValues: tagAttributeValues,
	}
}

func (l LibrarySettingsJson) ToSettingsModel() models.LibrarySettings {
	attrs := []models.BookAttributeSettings{}
	for _, attrJson := range l.Attributes {
		model, err := attrJson.ToModel()
		if err != nil {
			// TODO: log
			continue
		}
		attrs = append(attrs, model)
	}

	tagAttributeValues := map[models.BookAttributeId][]string{}
	for k, v := range l.TagAttributeValues {
		tagAttributeValues[models.BookAttributeId(k)] = v
	}

	return models.LibrarySettings{
		Name:               l.Name,
		RootDir:            filepath.Clean(l.RootDir) + "/",
		Attributes:         attrs,
		TagAttributeValues: tagAttributeValues,
	}
}
