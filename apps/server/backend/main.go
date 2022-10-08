package main

import (
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echo_book_handlers "github.com/private-gallery-server/echo/book"
	"github.com/private-gallery-server/env"
	"github.com/private-gallery-server/graphql/generated"
	"github.com/private-gallery-server/graphql/resolvers"
	"github.com/private-gallery-server/services/directory"
	"github.com/private-gallery-server/services/json_file_database"
	"github.com/private-gallery-server/services/library"
)

func main() {
	e := echo.New()
	env := env.LoadEnvironment()

	if env.AllowCrossOriginAccess {
		e.Use(middleware.CORS())
	}
	if env.EnableLogging {
		e.Use(middleware.Logger())
	}

	// construct services
	directoryServiceInst := directory.CreateDirectoryService(env)
	databaseInst := json_file_database.CreateJsonFileDatabase(env)
	libraryServiceInst := library.CreateLibraryService(env, databaseInst, databaseInst)

	graphqlHandler := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: resolvers.CreateResolver(directoryServiceInst, libraryServiceInst),
			},
		),
	)
	playgroundHandler := playground.Handler("PG GraphQL", "/api/query")
	e.POST("/api/query", func(ctx echo.Context) error {
		graphqlHandler.ServeHTTP(ctx.Response(), ctx.Request())
		return nil
	})
	e.GET("/gql-playground", func(ctx echo.Context) error {
		playgroundHandler.ServeHTTP(ctx.Response(), ctx.Request())
		return nil
	})
	echo_book_handlers.RegisterEchoBookHandlers(e, libraryServiceInst)

	go func() {
		if err := e.Start(":" + env.Port); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal(err)
		}
	}()

	// wait for SIGTERM and shutdown gracefully
	quitCh := make(chan os.Signal, 1)
	signal.Notify(quitCh, syscall.SIGTERM, os.Interrupt)
	<-quitCh

	if err := e.Close(); err != nil {
		e.Logger.Error("Failed to close API server: " + err.Error())
	}
}
