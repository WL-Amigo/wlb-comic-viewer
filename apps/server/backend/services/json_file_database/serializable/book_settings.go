package serializable

type BookSettingsJson struct {
	Name              string                   `json:"name"`
	BuiltinAttributes BookBuiltinAttributeJson `json:"builtinAttributes"`
	Attributes        []BookAttributeJson      `json:"attributes"`
	KnownPages        []string                 `json:"knownPages"`
	ReadPages         []string                 `json:"readPages"`
	Bookmarks         []BookmarkJson           `json:"bookmarks"`
	IgnorePatterns    []string                 `json:"ignorePatterns"`
}
