package serializable

type LibrarySettingsRootJson struct {
	Libraries []LibrarySettingsJson `json:"libraries"`
}

type LibrarySettingsJson struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	RootDir string `json:"root_dir"`
}
