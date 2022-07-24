package utils

func UnwrapBoolPtr(boolPtr *bool) bool {
	if boolPtr == nil {
		return false
	}
	return *boolPtr
}

func UnwrapStringPtr(stringPtr *string) string {
	if stringPtr == nil {
		return ""
	}
	return *stringPtr
}
