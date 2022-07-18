package env

type EnvironmentSettings struct {
	AllowCrossOriginAccess bool
	EnableLogging          bool
}

func LoadEnvironment() EnvironmentSettings {
	return EnvironmentSettings{
		AllowCrossOriginAccess: true,
		EnableLogging:          true,
	}
}
