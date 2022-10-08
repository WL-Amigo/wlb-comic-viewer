package models

type Bookmark struct {
	Page string
	Name string
}

type BookmarkCreateInput struct {
	Page string
	Name string
}

type BookmarkUpdateInput struct {
	Page string
	Name *string
}
