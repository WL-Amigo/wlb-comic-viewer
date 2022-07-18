package env

import (
	"os"
	"path/filepath"
)

type EnvironmentSettings struct {
	AllowCrossOriginAccess bool
	EnableLogging          bool
	RootDir                string
	WorkingDir             string
}

func LoadEnvironment() EnvironmentSettings {
	rootDir := os.Getenv("PG_ROOT_DIR")
	if rootDir == "" {
		ex, err := os.Executable()
		if err != nil {
			panic(err)
		}
		rootDir = filepath.Dir(ex)
	}
	workingDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	return EnvironmentSettings{
		AllowCrossOriginAccess: true,
		EnableLogging:          true,
		RootDir:                rootDir,
		WorkingDir:             workingDir,
	}
}
