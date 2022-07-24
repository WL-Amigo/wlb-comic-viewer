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

func IsKnownImageFile(filename string) bool {
	_, ok := knownImageFileExtensions[strings.TrimPrefix(filepath.Ext(filename), ".")]
	return ok
}
