package utils

import (
	"encoding/hex"

	"github.com/kalafut/imohash"
)

func HashFile(path string) (string, error) {
	hashBytes, err := imohash.SumFile(path)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(hashBytes[:]), nil
}

func HasFileSameHash(path string, hashString string) bool {
	hashBytes, err := imohash.SumFile(path)
	if err != nil {
		return false
	}
	return hex.EncodeToString(hashBytes[:]) == hashString
}
