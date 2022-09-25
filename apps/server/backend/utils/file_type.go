package utils

import (
	"path/filepath"
	"strings"
)

var knownImageFileExtensions = map[string]bool{
	"png":  true,
	"jpg":  true,
	"webp": true,
	"jpeg": true,
	"gif":  true,
}

var knownImageFileMimeType = map[string]string{
	"png":  "image/png",
	"jpg":  "image/jpeg",
	"webp": "image/webp",
	"jpeg": "image/jpeg",
	"gif":  "image/gif",
}

func IsKnownImageFile(filename string) bool {
	_, ok := knownImageFileExtensions[strings.TrimPrefix(filepath.Ext(filename), ".")]
	return ok
}

func GetImageFileMimeType(filename string) string {
	mime, ok := knownImageFileMimeType[strings.TrimPrefix(filepath.Ext(filename), ".")]
	if !ok {
		panic("unknown image file type")
	}
	return mime
}
