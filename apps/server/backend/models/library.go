package models

type LibrarySettings struct {
	Name    string
	RootDir string
}

type LibraryModel struct {
	LibrarySettings
	Id              string
	RootDirFullPath string
}
