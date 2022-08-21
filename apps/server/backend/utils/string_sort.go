package utils

import (
	"regexp"
	"sort"
	"strings"

	"github.com/thoas/go-funk"
)

type StringSortTypeEnum string

var (
	Default            = StringSortTypeEnum("DEFAULT")
	NaturalNumberOrder = StringSortTypeEnum("NATURAL_NUMBER_ORDER")
)

func SortStringSlice(ss []string, sortType StringSortTypeEnum, descendant bool) []string {
	var result []string

	switch sortType {
	case Default:
		result = append([]string{}, ss...)
		sort.Strings(result)
	case NaturalNumberOrder:
		result = sortStringSliceByNaturalNumberOrder((ss))
	}

	if descendant {
		result = funk.ReverseStrings(result)
	}
	return result
}

func sortStringSliceByNaturalNumberOrder(ss []string) []string {
	numberRegexp := regexp.MustCompile(`\d+`)
	originalStringMap := map[string]string{}
	paddedStringSlice := []string{}
	for _, s := range ss {
		paddedString := numberRegexp.ReplaceAllStringFunc(s, func(s string) string {
			zeroPadded := strings.Repeat("0", 20) + s
			return zeroPadded[len(zeroPadded)-20:]
		})
		paddedStringSlice = append(paddedStringSlice, paddedString)
		originalStringMap[paddedString] = s
	}

	sort.Strings(paddedStringSlice)

	result := []string{}
	for _, ps := range paddedStringSlice {
		result = append(result, originalStringMap[ps])
	}

	return result
}
