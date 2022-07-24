package echo_book_handlers

import (
	"net/http"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/private-gallery-server/services/library"
)

type BookHandler struct {
	library *library.LibraryService
}

func RegisterEchoBookHandlers(e *echo.Echo, libraryService *library.LibraryService) {
	h := &BookHandler{
		library: libraryService,
	}

	e.GET("/lib/:libraryId/book/:bookId/:page", func(c echo.Context) error {
		libraryId := c.Param("libraryId")
		bookId := c.Param("bookId")
		pageFilePath := c.Param("page")
		if libraryId == "" || bookId == "" || pageFilePath == "" {
			return c.NoContent(http.StatusBadRequest)
		}
		bookId, err := url.QueryUnescape(bookId)
		if err != nil {
			return c.String(http.StatusBadRequest, "bookId decode failed")
		}
		pageFilePath, err = url.QueryUnescape(pageFilePath)
		if err != nil {
			return c.String(http.StatusBadRequest, "page decode failed")
		}

		pageFileFullPath, err := h.GetPageFullPath(libraryId, bookId, pageFilePath)
		if err != nil {
			return err
		}

		return c.File(pageFileFullPath)
	})
}
