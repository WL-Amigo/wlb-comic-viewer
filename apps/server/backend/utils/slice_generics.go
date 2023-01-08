package utils

func SliceFilter[T any](s []T, pred func(i T) bool) []T {
	var result []T
	for _, i := range s {
		if pred(i) {
			result = append(result, i)
		}
	}
	return result
}
