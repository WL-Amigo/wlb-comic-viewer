package serializable

import "github.com/private-gallery-server/models"

type BookAttributeJson struct {
	Id    string `json:"id"`
	Value string `json:"value"`
}

func CreateBookAttributeJsonFromModel(model models.BookAttribute) BookAttributeJson {
	return BookAttributeJson{
		Id:    string(model.Id),
		Value: model.Value,
	}
}

func (attrJson BookAttributeJson) ToModel() models.BookAttribute {
	return models.BookAttribute{
		Id:    models.BookAttributeId(attrJson.Id),
		Value: attrJson.Value,
	}
}

type BookAttributeSettingJson struct {
	Id          string `json:"id"`
	DisplayName string `json:"displayName"`
	ValueType   string `json:"valueType"`
}

func CreateBookAttributeSettingJsonFromModel(model models.BookAttributeSettings) BookAttributeSettingJson {
	return BookAttributeSettingJson{
		Id:          string(model.Id),
		DisplayName: model.DisplayName,
		ValueType:   string(model.ValueType),
	}
}

func (attrJson BookAttributeSettingJson) ToModel() (models.BookAttributeSettings, error) {
	vt, err := models.CastToBookAttributeValueTypeEnum(attrJson.ValueType)
	if err != nil {
		return models.BookAttributeSettings{}, nil
	}

	return models.BookAttributeSettings{
		Id:          models.BookAttributeId(attrJson.Id),
		DisplayName: attrJson.DisplayName,
		ValueType:   vt,
	}, nil
}
