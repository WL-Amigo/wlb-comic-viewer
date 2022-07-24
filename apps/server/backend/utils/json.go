package utils

import (
	"encoding/json"
	"errors"
	"os"
)

func MaybeReadJsonFile(path string, target any) error {
	jsonBytes, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return err
	}

	if err = json.Unmarshal(jsonBytes, target); err != nil {
		return err
	}

	return nil
}

func WriteJsonFile(path string, target any) error {
	libraryJsonBytes, err := json.Marshal(target)
	if err != nil {
		return err
	}

	if err = os.WriteFile(path, libraryJsonBytes, 0644); err != nil {
		return err
	}

	return nil
}
