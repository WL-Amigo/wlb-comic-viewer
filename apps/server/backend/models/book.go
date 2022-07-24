package models

type BookSettings struct {
	Name string
}

type BookModelBase struct {
	BookSettings
	Id          string
	Dir         string
	DirFullPath string
}

type BookModelDetail struct {
	BookModelBase
	PageFilePaths []string
}
