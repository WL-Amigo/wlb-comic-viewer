package serializable

type BookSettingsJson struct {
	Name       string              `json:"name"`
	Attributes []BookAttributeJson `json:"attributes"`
}
