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
	Port                   string
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
	port := os.Getenv("PG_API_PORT")
	if port == "" {
		port = "9001"
	}

	return EnvironmentSettings{
		AllowCrossOriginAccess: true,
		EnableLogging:          true,
		RootDir:                rootDir,
		WorkingDir:             workingDir,
		Port:                   port,
	}
}
