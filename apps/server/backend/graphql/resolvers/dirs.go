package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/private-gallery-server/utils"
)

// Dirs is the resolver for the dirs field.
func (r *queryResolver) Dirs(ctx context.Context, root string, includeHidden *bool) ([]string, error) {
	return r.directory.GetDirs(root, utils.UnwrapBoolPtr(includeHidden))
}
