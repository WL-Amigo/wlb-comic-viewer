import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Book = {
  __typename?: 'Book';
  attributes: Array<BookAttribute>;
  bookmarks: Array<BookBookmark>;
  builtinAttributes: BookBuiltinAttributes;
  dir: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ignorePatterns: Array<Scalars['String']['output']>;
  isRead: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pages: Array<Scalars['String']['output']>;
};

export type BookAttribute = {
  __typename?: 'BookAttribute';
  displayName: Scalars['String']['output'];
  existingTags: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeInput = {
  id: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type BookAttributeSettingBasic = IBookAttributeSetting & {
  __typename?: 'BookAttributeSettingBasic';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeSettingCreateInput = {
  displayName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeSettingTag = IBookAttributeSetting & {
  __typename?: 'BookAttributeSettingTag';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  tags: Array<Scalars['String']['output']>;
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeSettingUnion = BookAttributeSettingBasic | BookAttributeSettingTag;

export type BookAttributeSettingUpdateInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  valueType?: InputMaybe<BookAttributeValueTypeEnum>;
};

export enum BookAttributeValueTypeEnum {
  Int = 'INT',
  String = 'STRING',
  Tag = 'TAG'
}

export type BookBookmark = {
  __typename?: 'BookBookmark';
  error?: Maybe<BookmarkErrorTypeEnum>;
  name: Scalars['String']['output'];
  page: Scalars['String']['output'];
};

export type BookBookmarkInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type BookBuiltinAttributes = {
  __typename?: 'BookBuiltinAttributes';
  isFavorite: Scalars['Boolean']['output'];
};

export type BookBuiltinAttributesInput = {
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BookFilterAttributeParams = {
  id: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type BookFilterParams = {
  attributes?: InputMaybe<Array<BookFilterAttributeParams>>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BookInitInput = {
  dir: Scalars['String']['input'];
};

export type BookInput = {
  ignorePatterns?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum BookmarkErrorTypeEnum {
  MissingPageFile = 'MISSING_PAGE_FILE'
}

export type IBookAttributeSetting = {
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  valueType: BookAttributeValueTypeEnum;
};

export type Library = {
  __typename?: 'Library';
  attributes: Array<BookAttributeSettingUnion>;
  books: Array<Book>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rootDir: Scalars['String']['output'];
};


export type LibraryBooksArgs = {
  filter?: InputMaybe<BookFilterParams>;
};

export type LibraryCreateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  rootDir: Scalars['String']['input'];
};

export type LibraryMin = {
  __typename?: 'LibraryMin';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type LibraryUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bookPageCreateBookmark: Scalars['String']['output'];
  bookPageDeleteBookmark: Scalars['String']['output'];
  bookPageMarkAsRead: Scalars['String']['output'];
  bookPageRecoveryBookmark: Array<BookBookmark>;
  bookPageReorderBookmark: Array<BookBookmark>;
  bookUpdateAttribute: Scalars['ID']['output'];
  bookUpdateBuiltinAttribute: BookBuiltinAttributes;
  bookUpdateKnownPages: Array<Scalars['String']['output']>;
  createBook: Scalars['ID']['output'];
  createBookAttributeSettings: Array<Scalars['ID']['output']>;
  createLibrary: Scalars['ID']['output'];
  deleteBook: Scalars['ID']['output'];
  deleteBookAttributeTag: Scalars['String']['output'];
  updateBook: Scalars['ID']['output'];
  updateBookAttributeSettings: Array<Scalars['ID']['output']>;
  updateLibrary: Scalars['ID']['output'];
};


export type MutationBookPageCreateBookmarkArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
  option?: InputMaybe<BookBookmarkInput>;
  page: Scalars['String']['input'];
};


export type MutationBookPageDeleteBookmarkArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
  page: Scalars['String']['input'];
};


export type MutationBookPageMarkAsReadArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
  page: Scalars['String']['input'];
};


export type MutationBookPageRecoveryBookmarkArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
};


export type MutationBookPageReorderBookmarkArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
  orderedPages: Array<Scalars['String']['input']>;
};


export type MutationBookUpdateAttributeArgs = {
  bookId: Scalars['ID']['input'];
  input: Array<BookAttributeInput>;
  libraryId: Scalars['ID']['input'];
};


export type MutationBookUpdateBuiltinAttributeArgs = {
  bookId: Scalars['ID']['input'];
  input: BookBuiltinAttributesInput;
  libraryId: Scalars['ID']['input'];
};


export type MutationBookUpdateKnownPagesArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
};


export type MutationCreateBookArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeInput>>;
  init: BookInitInput;
  input: BookInput;
  libraryId: Scalars['ID']['input'];
};


export type MutationCreateBookAttributeSettingsArgs = {
  input?: InputMaybe<Array<BookAttributeSettingCreateInput>>;
  libraryId: Scalars['ID']['input'];
};


export type MutationCreateLibraryArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeSettingCreateInput>>;
  input: LibraryCreateInput;
};


export type MutationDeleteBookArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
};


export type MutationDeleteBookAttributeTagArgs = {
  attributeId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
};


export type MutationUpdateBookArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeInput>>;
  bookId: Scalars['ID']['input'];
  input: BookInput;
  libraryId: Scalars['ID']['input'];
};


export type MutationUpdateBookAttributeSettingsArgs = {
  input?: InputMaybe<Array<BookAttributeSettingUpdateInput>>;
  libraryId: Scalars['ID']['input'];
};


export type MutationUpdateLibraryArgs = {
  id: Scalars['ID']['input'];
  input: LibraryUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  book: Book;
  dirs: Array<Scalars['String']['output']>;
  libraries: Array<LibraryMin>;
  library: Library;
};


export type QueryBookArgs = {
  bookId: Scalars['ID']['input'];
  libraryId: Scalars['ID']['input'];
};


export type QueryDirsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  root: Scalars['String']['input'];
};


export type QueryLibraryArgs = {
  id: Scalars['ID']['input'];
};

export type GetBookQueryVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
}>;


export type GetBookQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, name: string, pages: Array<string>, isRead: boolean, ignorePatterns: Array<string>, bookmarks: Array<{ __typename?: 'BookBookmark', page: string, name: string, error?: BookmarkErrorTypeEnum | null }>, builtinAttributes: { __typename?: 'BookBuiltinAttributes', isFavorite: boolean }, attributes: Array<{ __typename?: 'BookAttribute', id: string, displayName: string, valueType: BookAttributeValueTypeEnum, value: string, existingTags: Array<string> }> } };

export type CreateBookMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookDir: Scalars['String']['input'];
  bookInput: BookInput;
  attributesInput?: InputMaybe<Array<BookAttributeInput> | BookAttributeInput>;
}>;


export type CreateBookMutation = { __typename?: 'Mutation', createBook: string };

export type UpdateBookMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  bookInput: BookInput;
}>;


export type UpdateBookMutation = { __typename?: 'Mutation', updateBook: string };

export type UpdateBookKnownPagesMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
}>;


export type UpdateBookKnownPagesMutation = { __typename?: 'Mutation', bookUpdateKnownPages: Array<string> };

export type MarkAsReadPageMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  page: Scalars['String']['input'];
}>;


export type MarkAsReadPageMutation = { __typename?: 'Mutation', bookPageMarkAsRead: string };

export type BookmarkPageMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  page: Scalars['String']['input'];
  params?: InputMaybe<BookBookmarkInput>;
}>;


export type BookmarkPageMutation = { __typename?: 'Mutation', bookPageCreateBookmark: string };

export type DeleteBookmarkMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  page: Scalars['String']['input'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', bookPageDeleteBookmark: string };

export type ReorderBookmarkMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  orderedPages: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReorderBookmarkMutation = { __typename?: 'Mutation', bookPageReorderBookmark: Array<{ __typename?: 'BookBookmark', page: string, name: string, error?: BookmarkErrorTypeEnum | null }> };

export type UpdateBookAttributeMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  attributesInput: Array<BookAttributeInput> | BookAttributeInput;
}>;


export type UpdateBookAttributeMutation = { __typename?: 'Mutation', bookUpdateAttribute: string };

export type UpdateBookBuiltinAttributesMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  input: BookBuiltinAttributesInput;
}>;


export type UpdateBookBuiltinAttributesMutation = { __typename?: 'Mutation', bookUpdateBuiltinAttribute: { __typename?: 'BookBuiltinAttributes', isFavorite: boolean } };

export type GetDirsQueryVariables = Exact<{
  root: Scalars['String']['input'];
}>;


export type GetDirsQuery = { __typename?: 'Query', dirs: Array<string> };

export type LoadAllLibrariesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadAllLibrariesQuery = { __typename?: 'Query', libraries: Array<{ __typename?: 'LibraryMin', id: string, name: string }> };

export type LoadLibraryQueryVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  booksFilter?: InputMaybe<BookFilterParams>;
}>;


export type LoadLibraryQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, books: Array<{ __typename?: 'Book', id: string, name: string, isRead: boolean, builtinAttributes: { __typename?: 'BookBuiltinAttributes', isFavorite: boolean } }>, attributes: Array<{ __typename?: 'BookAttributeSettingBasic', id: string, displayName: string, valueType: BookAttributeValueTypeEnum } | { __typename?: 'BookAttributeSettingTag', id: string, displayName: string, valueType: BookAttributeValueTypeEnum, tags: Array<string> }> } };

export type LoadLibrarySettingsQueryVariables = Exact<{
  libraryId: Scalars['ID']['input'];
}>;


export type LoadLibrarySettingsQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, rootDir: string, attributes: Array<{ __typename?: 'BookAttributeSettingBasic', id: string, displayName: string, valueType: BookAttributeValueTypeEnum } | { __typename?: 'BookAttributeSettingTag', id: string, displayName: string, valueType: BookAttributeValueTypeEnum, tags: Array<string> }> } };

export type GetBooksDirQueryVariables = Exact<{
  libraryId: Scalars['ID']['input'];
}>;


export type GetBooksDirQuery = { __typename?: 'Query', library: { __typename?: 'Library', books: Array<{ __typename?: 'Book', dir: string }> } };

export type CreateLibraryMutationVariables = Exact<{
  input: LibraryCreateInput;
}>;


export type CreateLibraryMutation = { __typename?: 'Mutation', createLibrary: string };

export type CreateBookAttributeSettingsMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  input?: InputMaybe<Array<BookAttributeSettingCreateInput> | BookAttributeSettingCreateInput>;
}>;


export type CreateBookAttributeSettingsMutation = { __typename?: 'Mutation', createBookAttributeSettings: Array<string> };

export type UpdateBookAttributeSettingsMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  input?: InputMaybe<Array<BookAttributeSettingUpdateInput> | BookAttributeSettingUpdateInput>;
}>;


export type UpdateBookAttributeSettingsMutation = { __typename?: 'Mutation', updateBookAttributeSettings: Array<string> };

export type DeleteBookAttributeTagMutationVariables = Exact<{
  libraryId: Scalars['ID']['input'];
  attributeId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
}>;


export type DeleteBookAttributeTagMutation = { __typename?: 'Mutation', deleteBookAttributeTag: string };


export const GetBookDocument = gql`
    query getBook($libraryId: ID!, $bookId: ID!) {
  book(libraryId: $libraryId, bookId: $bookId) {
    id
    name
    pages
    bookmarks {
      page
      name
      error
    }
    isRead
    ignorePatterns
    builtinAttributes {
      isFavorite
    }
    attributes {
      id
      displayName
      valueType
      value
      existingTags
    }
  }
}
    `;
export const CreateBookDocument = gql`
    mutation createBook($libraryId: ID!, $bookDir: String!, $bookInput: BookInput!, $attributesInput: [BookAttributeInput!]) {
  createBook(
    libraryId: $libraryId
    init: {dir: $bookDir}
    input: $bookInput
    attributesInput: $attributesInput
  )
}
    `;
export const UpdateBookDocument = gql`
    mutation updateBook($libraryId: ID!, $bookId: ID!, $bookInput: BookInput!) {
  updateBook(libraryId: $libraryId, bookId: $bookId, input: $bookInput)
}
    `;
export const UpdateBookKnownPagesDocument = gql`
    mutation updateBookKnownPages($libraryId: ID!, $bookId: ID!) {
  bookUpdateKnownPages(libraryId: $libraryId, bookId: $bookId)
}
    `;
export const MarkAsReadPageDocument = gql`
    mutation markAsReadPage($libraryId: ID!, $bookId: ID!, $page: String!) {
  bookPageMarkAsRead(libraryId: $libraryId, bookId: $bookId, page: $page)
}
    `;
export const BookmarkPageDocument = gql`
    mutation bookmarkPage($libraryId: ID!, $bookId: ID!, $page: String!, $params: BookBookmarkInput) {
  bookPageCreateBookmark(
    libraryId: $libraryId
    bookId: $bookId
    page: $page
    option: $params
  )
}
    `;
export const DeleteBookmarkDocument = gql`
    mutation deleteBookmark($libraryId: ID!, $bookId: ID!, $page: String!) {
  bookPageDeleteBookmark(libraryId: $libraryId, bookId: $bookId, page: $page)
}
    `;
export const ReorderBookmarkDocument = gql`
    mutation reorderBookmark($libraryId: ID!, $bookId: ID!, $orderedPages: [String!]!) {
  bookPageReorderBookmark(
    libraryId: $libraryId
    bookId: $bookId
    orderedPages: $orderedPages
  ) {
    page
    name
    error
  }
}
    `;
export const UpdateBookAttributeDocument = gql`
    mutation updateBookAttribute($libraryId: ID!, $bookId: ID!, $attributesInput: [BookAttributeInput!]!) {
  bookUpdateAttribute(
    libraryId: $libraryId
    bookId: $bookId
    input: $attributesInput
  )
}
    `;
export const UpdateBookBuiltinAttributesDocument = gql`
    mutation updateBookBuiltinAttributes($libraryId: ID!, $bookId: ID!, $input: BookBuiltinAttributesInput!) {
  bookUpdateBuiltinAttribute(
    libraryId: $libraryId
    bookId: $bookId
    input: $input
  ) {
    isFavorite
  }
}
    `;
export const GetDirsDocument = gql`
    query getDirs($root: String!) {
  dirs(root: $root)
}
    `;
export const LoadAllLibrariesDocument = gql`
    query loadAllLibraries {
  libraries {
    id
    name
  }
}
    `;
export const LoadLibraryDocument = gql`
    query loadLibrary($libraryId: ID!, $booksFilter: BookFilterParams) {
  library(id: $libraryId) {
    id
    name
    books(filter: $booksFilter) {
      id
      name
      builtinAttributes {
        isFavorite
      }
      isRead
    }
    attributes {
      ... on IBookAttributeSetting {
        id
        displayName
        valueType
      }
      ... on BookAttributeSettingTag {
        tags
      }
    }
  }
}
    `;
export const LoadLibrarySettingsDocument = gql`
    query loadLibrarySettings($libraryId: ID!) {
  library(id: $libraryId) {
    id
    name
    rootDir
    attributes {
      ... on IBookAttributeSetting {
        id
        displayName
        valueType
      }
      ... on BookAttributeSettingTag {
        tags
      }
    }
  }
}
    `;
export const GetBooksDirDocument = gql`
    query getBooksDir($libraryId: ID!) {
  library(id: $libraryId) {
    books {
      dir
    }
  }
}
    `;
export const CreateLibraryDocument = gql`
    mutation createLibrary($input: LibraryCreateInput!) {
  createLibrary(input: $input)
}
    `;
export const CreateBookAttributeSettingsDocument = gql`
    mutation createBookAttributeSettings($libraryId: ID!, $input: [BookAttributeSettingCreateInput!]) {
  createBookAttributeSettings(libraryId: $libraryId, input: $input)
}
    `;
export const UpdateBookAttributeSettingsDocument = gql`
    mutation updateBookAttributeSettings($libraryId: ID!, $input: [BookAttributeSettingUpdateInput!]) {
  updateBookAttributeSettings(libraryId: $libraryId, input: $input)
}
    `;
export const DeleteBookAttributeTagDocument = gql`
    mutation deleteBookAttributeTag($libraryId: ID!, $attributeId: ID!, $tag: String!) {
  deleteBookAttributeTag(
    libraryId: $libraryId
    attributeId: $attributeId
    tag: $tag
  )
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getBook(variables: GetBookQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBookQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBookQuery>(GetBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBook', 'query');
    },
    createBook(variables: CreateBookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateBookMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBookMutation>(CreateBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createBook', 'mutation');
    },
    updateBook(variables: UpdateBookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBookMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookMutation>(UpdateBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBook', 'mutation');
    },
    updateBookKnownPages(variables: UpdateBookKnownPagesMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBookKnownPagesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookKnownPagesMutation>(UpdateBookKnownPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookKnownPages', 'mutation');
    },
    markAsReadPage(variables: MarkAsReadPageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MarkAsReadPageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkAsReadPageMutation>(MarkAsReadPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'markAsReadPage', 'mutation');
    },
    bookmarkPage(variables: BookmarkPageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BookmarkPageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookmarkPageMutation>(BookmarkPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'bookmarkPage', 'mutation');
    },
    deleteBookmark(variables: DeleteBookmarkMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteBookmarkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteBookmarkMutation>(DeleteBookmarkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteBookmark', 'mutation');
    },
    reorderBookmark(variables: ReorderBookmarkMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ReorderBookmarkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReorderBookmarkMutation>(ReorderBookmarkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'reorderBookmark', 'mutation');
    },
    updateBookAttribute(variables: UpdateBookAttributeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBookAttributeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookAttributeMutation>(UpdateBookAttributeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookAttribute', 'mutation');
    },
    updateBookBuiltinAttributes(variables: UpdateBookBuiltinAttributesMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBookBuiltinAttributesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookBuiltinAttributesMutation>(UpdateBookBuiltinAttributesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookBuiltinAttributes', 'mutation');
    },
    getDirs(variables: GetDirsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetDirsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDirsQuery>(GetDirsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDirs', 'query');
    },
    loadAllLibraries(variables?: LoadAllLibrariesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoadAllLibrariesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadAllLibrariesQuery>(LoadAllLibrariesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadAllLibraries', 'query');
    },
    loadLibrary(variables: LoadLibraryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoadLibraryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadLibraryQuery>(LoadLibraryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadLibrary', 'query');
    },
    loadLibrarySettings(variables: LoadLibrarySettingsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoadLibrarySettingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadLibrarySettingsQuery>(LoadLibrarySettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadLibrarySettings', 'query');
    },
    getBooksDir(variables: GetBooksDirQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBooksDirQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBooksDirQuery>(GetBooksDirDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBooksDir', 'query');
    },
    createLibrary(variables: CreateLibraryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateLibraryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateLibraryMutation>(CreateLibraryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createLibrary', 'mutation');
    },
    createBookAttributeSettings(variables: CreateBookAttributeSettingsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateBookAttributeSettingsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBookAttributeSettingsMutation>(CreateBookAttributeSettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createBookAttributeSettings', 'mutation');
    },
    updateBookAttributeSettings(variables: UpdateBookAttributeSettingsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBookAttributeSettingsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookAttributeSettingsMutation>(UpdateBookAttributeSettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookAttributeSettings', 'mutation');
    },
    deleteBookAttributeTag(variables: DeleteBookAttributeTagMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteBookAttributeTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteBookAttributeTagMutation>(DeleteBookAttributeTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteBookAttributeTag', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;