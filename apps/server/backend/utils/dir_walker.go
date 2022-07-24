package utils

import (
	"os"
	"path/filepath"
)

type WalkDirVisitorFunc func(path string) error

func WalkDir(root string, visitor WalkDirVisitorFunc) error {
	dirFile, err := os.Open(root)
	if err != nil {
		return err
	}

	fileNames, err := dirFile.Readdirnames(0)
	if err != nil {
		return err
	}
	_ = dirFile.Close()

	for _, fileName := range fileNames {
		if len(filepath.Ext(fileName)) > 0 {
			continue
		}
		nextRoot := filepath.Join(root, fileName)
		stat, err := os.Lstat(nextRoot)
		if err != nil {
			continue
		}
		if !stat.IsDir() {
			continue
		}
		if err = visitor(nextRoot); err != nil {
			return err
		}
		if err = WalkDir(nextRoot, visitor); err != nil {
			return err
		}
	}

	return nil
}
