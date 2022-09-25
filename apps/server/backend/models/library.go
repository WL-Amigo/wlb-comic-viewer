package models

type LibrarySettings struct {
	Name       string
	RootDir    string
	Attributes []BookAttributeSettings
}

type LibrarySettingsUpdateInput struct {
	Name *string
}

type LibraryModel struct {
	LibrarySettings
	Id              string
	RootDirFullPath string
}
