import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Book = {
  __typename?: 'Book';
  attributes: Array<BookAttribute>;
  bookmarks: Array<BookBookmark>;
  dir: Scalars['String'];
  id: Scalars['ID'];
  isRead: Scalars['Boolean'];
  name: Scalars['String'];
  pages: Array<Scalars['String']>;
};

export type BookAttribute = {
  __typename?: 'BookAttribute';
  displayName: Scalars['String'];
  id: Scalars['ID'];
  value: Scalars['String'];
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeInput = {
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type BookAttributeSetting = {
  __typename?: 'BookAttributeSetting';
  displayName: Scalars['String'];
  id: Scalars['ID'];
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeSettingCreateInput = {
  displayName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  valueType: BookAttributeValueTypeEnum;
};

export type BookAttributeSettingUpdateInput = {
  displayName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  valueType?: InputMaybe<BookAttributeValueTypeEnum>;
};

export enum BookAttributeValueTypeEnum {
  Int = 'INT',
  String = 'STRING'
}

export type BookBookmark = {
  __typename?: 'BookBookmark';
  name: Scalars['String'];
  page: Scalars['String'];
};

export type BookBookmarkInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type BookFilterAttributeParams = {
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type BookFilterParams = {
  attributes?: InputMaybe<Array<BookFilterAttributeParams>>;
  isRead?: InputMaybe<Scalars['Boolean']>;
};

export type BookInitInput = {
  dir: Scalars['String'];
};

export type BookInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type BookMin = {
  __typename?: 'BookMin';
  id: Scalars['ID'];
  isRead: Scalars['Boolean'];
  name: Scalars['String'];
};

export type Library = {
  __typename?: 'Library';
  attributes: Array<BookAttributeSetting>;
  books: Array<BookMin>;
  id: Scalars['ID'];
  name: Scalars['String'];
  rootDir: Scalars['String'];
};


export type LibraryBooksArgs = {
  filter?: InputMaybe<BookFilterParams>;
};

export type LibraryCreateInput = {
  name?: InputMaybe<Scalars['String']>;
  rootDir: Scalars['String'];
};

export type LibraryMin = {
  __typename?: 'LibraryMin';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LibraryUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bookPageCreateBookmark: Scalars['String'];
  bookPageDeleteBookmark: Scalars['String'];
  bookPageMarkAsRead: Scalars['String'];
  bookUpdateKnownPages: Array<Scalars['String']>;
  createBook: Scalars['ID'];
  createBookAttributeSettings: Array<Scalars['ID']>;
  createLibrary: Scalars['ID'];
  deleteBook: Scalars['ID'];
  updateBook: Scalars['ID'];
  updateBookAttributeSettings: Array<Scalars['ID']>;
  updateLibrary: Scalars['ID'];
};


export type MutationBookPageCreateBookmarkArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
  option?: InputMaybe<BookBookmarkInput>;
  page: Scalars['String'];
};


export type MutationBookPageDeleteBookmarkArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
  page: Scalars['String'];
};


export type MutationBookPageMarkAsReadArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
  page: Scalars['String'];
};


export type MutationBookUpdateKnownPagesArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
};


export type MutationCreateBookArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeInput>>;
  init: BookInitInput;
  input: BookInput;
  libraryId: Scalars['ID'];
};


export type MutationCreateBookAttributeSettingsArgs = {
  input?: InputMaybe<Array<BookAttributeSettingCreateInput>>;
  libraryId: Scalars['ID'];
};


export type MutationCreateLibraryArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeSettingCreateInput>>;
  input: LibraryCreateInput;
};


export type MutationDeleteBookArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
};


export type MutationUpdateBookArgs = {
  attributesInput?: InputMaybe<Array<BookAttributeInput>>;
  bookId: Scalars['ID'];
  input: BookInput;
  libraryId: Scalars['ID'];
};


export type MutationUpdateBookAttributeSettingsArgs = {
  input?: InputMaybe<Array<BookAttributeSettingUpdateInput>>;
  libraryId: Scalars['ID'];
};


export type MutationUpdateLibraryArgs = {
  id: Scalars['ID'];
  input: LibraryUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  book: Book;
  dirs: Array<Scalars['String']>;
  libraries: Array<LibraryMin>;
  library: Library;
};


export type QueryBookArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
};


export type QueryDirsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']>;
  root: Scalars['String'];
};


export type QueryLibraryArgs = {
  id: Scalars['ID'];
};

export type GetBookQueryVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
}>;


export type GetBookQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, name: string, pages: Array<string>, isRead: boolean, bookmarks: Array<{ __typename?: 'BookBookmark', page: string, name: string }>, attributes: Array<{ __typename?: 'BookAttribute', id: string, displayName: string, valueType: BookAttributeValueTypeEnum, value: string }> } };

export type CreateBookMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookDir: Scalars['String'];
  bookInput: BookInput;
  attributesInput?: InputMaybe<Array<BookAttributeInput> | BookAttributeInput>;
}>;


export type CreateBookMutation = { __typename?: 'Mutation', createBook: string };

export type UpdateBookMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
  bookInput: BookInput;
  attributesInput?: InputMaybe<Array<BookAttributeInput> | BookAttributeInput>;
}>;


export type UpdateBookMutation = { __typename?: 'Mutation', updateBook: string };

export type UpdateBookKnownPagesMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
}>;


export type UpdateBookKnownPagesMutation = { __typename?: 'Mutation', bookUpdateKnownPages: Array<string> };

export type MarkAsReadPageMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
  page: Scalars['String'];
}>;


export type MarkAsReadPageMutation = { __typename?: 'Mutation', bookPageMarkAsRead: string };

export type BookmarkPageMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
  page: Scalars['String'];
  params?: InputMaybe<BookBookmarkInput>;
}>;


export type BookmarkPageMutation = { __typename?: 'Mutation', bookPageCreateBookmark: string };

export type DeleteBookmarkMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookId: Scalars['ID'];
  page: Scalars['String'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', bookPageDeleteBookmark: string };

export type GetDirsQueryVariables = Exact<{
  root: Scalars['String'];
}>;


export type GetDirsQuery = { __typename?: 'Query', dirs: Array<string> };

export type LoadAllLibrariesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadAllLibrariesQuery = { __typename?: 'Query', libraries: Array<{ __typename?: 'LibraryMin', id: string, name: string }> };

export type LoadLibraryQueryVariables = Exact<{
  libraryId: Scalars['ID'];
  booksFilter?: InputMaybe<BookFilterParams>;
}>;


export type LoadLibraryQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, books: Array<{ __typename?: 'BookMin', id: string, name: string, isRead: boolean }>, attributes: Array<{ __typename?: 'BookAttributeSetting', id: string, displayName: string, valueType: BookAttributeValueTypeEnum }> } };

export type LoadLibrarySettingsQueryVariables = Exact<{
  libraryId: Scalars['ID'];
}>;


export type LoadLibrarySettingsQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, rootDir: string, attributes: Array<{ __typename?: 'BookAttributeSetting', id: string, displayName: string, valueType: BookAttributeValueTypeEnum }> } };

export type CreateLibraryMutationVariables = Exact<{
  input: LibraryCreateInput;
}>;


export type CreateLibraryMutation = { __typename?: 'Mutation', createLibrary: string };

export type CreateBookAttributeSettingsMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  input?: InputMaybe<Array<BookAttributeSettingCreateInput> | BookAttributeSettingCreateInput>;
}>;


export type CreateBookAttributeSettingsMutation = { __typename?: 'Mutation', createBookAttributeSettings: Array<string> };

export type UpdateBookAttributeSettingsMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  input?: InputMaybe<Array<BookAttributeSettingUpdateInput> | BookAttributeSettingUpdateInput>;
}>;


export type UpdateBookAttributeSettingsMutation = { __typename?: 'Mutation', updateBookAttributeSettings: Array<string> };


export const GetBookDocument = gql`
    query getBook($libraryId: ID!, $bookId: ID!) {
  book(libraryId: $libraryId, bookId: $bookId) {
    id
    name
    pages
    bookmarks {
      page
      name
    }
    isRead
    attributes {
      id
      displayName
      valueType
      value
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
    mutation updateBook($libraryId: ID!, $bookId: ID!, $bookInput: BookInput!, $attributesInput: [BookAttributeInput!]) {
  updateBook(
    libraryId: $libraryId
    bookId: $bookId
    input: $bookInput
    attributesInput: $attributesInput
  )
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
      isRead
    }
    attributes {
      id
      displayName
      valueType
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
      id
      displayName
      valueType
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getBook(variables: GetBookQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBookQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBookQuery>(GetBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBook', 'query');
    },
    createBook(variables: CreateBookMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateBookMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBookMutation>(CreateBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createBook', 'mutation');
    },
    updateBook(variables: UpdateBookMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateBookMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookMutation>(UpdateBookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBook', 'mutation');
    },
    updateBookKnownPages(variables: UpdateBookKnownPagesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateBookKnownPagesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookKnownPagesMutation>(UpdateBookKnownPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookKnownPages', 'mutation');
    },
    markAsReadPage(variables: MarkAsReadPageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarkAsReadPageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkAsReadPageMutation>(MarkAsReadPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'markAsReadPage', 'mutation');
    },
    bookmarkPage(variables: BookmarkPageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookmarkPageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookmarkPageMutation>(BookmarkPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'bookmarkPage', 'mutation');
    },
    deleteBookmark(variables: DeleteBookmarkMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteBookmarkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteBookmarkMutation>(DeleteBookmarkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteBookmark', 'mutation');
    },
    getDirs(variables: GetDirsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetDirsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDirsQuery>(GetDirsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDirs', 'query');
    },
    loadAllLibraries(variables?: LoadAllLibrariesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoadAllLibrariesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadAllLibrariesQuery>(LoadAllLibrariesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadAllLibraries', 'query');
    },
    loadLibrary(variables: LoadLibraryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoadLibraryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadLibraryQuery>(LoadLibraryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadLibrary', 'query');
    },
    loadLibrarySettings(variables: LoadLibrarySettingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoadLibrarySettingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoadLibrarySettingsQuery>(LoadLibrarySettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loadLibrarySettings', 'query');
    },
    createLibrary(variables: CreateLibraryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateLibraryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateLibraryMutation>(CreateLibraryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createLibrary', 'mutation');
    },
    createBookAttributeSettings(variables: CreateBookAttributeSettingsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateBookAttributeSettingsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBookAttributeSettingsMutation>(CreateBookAttributeSettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createBookAttributeSettings', 'mutation');
    },
    updateBookAttributeSettings(variables: UpdateBookAttributeSettingsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateBookAttributeSettingsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookAttributeSettingsMutation>(UpdateBookAttributeSettingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBookAttributeSettings', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;