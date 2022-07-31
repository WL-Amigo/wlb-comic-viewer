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
  dir: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  pages: Array<Scalars['String']>;
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
  name: Scalars['String'];
};

export type Library = {
  __typename?: 'Library';
  books: Array<BookMin>;
  id: Scalars['ID'];
  name: Scalars['String'];
  rootDir: Scalars['String'];
};

export type LibraryInput = {
  name?: InputMaybe<Scalars['String']>;
  rootDir: Scalars['String'];
};

export type LibraryMin = {
  __typename?: 'LibraryMin';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook: Scalars['ID'];
  createLibrary: Scalars['ID'];
  deleteBook: Scalars['ID'];
  updateBook: Scalars['ID'];
  updateLibrary: Scalars['ID'];
};


export type MutationCreateBookArgs = {
  init: BookInitInput;
  input: BookInput;
  libraryId: Scalars['ID'];
};


export type MutationCreateLibraryArgs = {
  input: LibraryInput;
};


export type MutationDeleteBookArgs = {
  bookId: Scalars['ID'];
  libraryId: Scalars['ID'];
};


export type MutationUpdateBookArgs = {
  bookId: Scalars['ID'];
  input: BookInput;
  libraryId: Scalars['ID'];
};


export type MutationUpdateLibraryArgs = {
  id: Scalars['ID'];
  input: LibraryInput;
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


export type GetBookQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, name: string, pages: Array<string> } };

export type CreateBookMutationVariables = Exact<{
  libraryId: Scalars['ID'];
  bookDir: Scalars['String'];
  bookInput: BookInput;
}>;


export type CreateBookMutation = { __typename?: 'Mutation', createBook: string };

export type GetDirsQueryVariables = Exact<{
  root: Scalars['String'];
}>;


export type GetDirsQuery = { __typename?: 'Query', dirs: Array<string> };

export type LoadAllLibrariesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadAllLibrariesQuery = { __typename?: 'Query', libraries: Array<{ __typename?: 'LibraryMin', id: string, name: string }> };

export type LoadLibraryQueryVariables = Exact<{
  libraryId: Scalars['ID'];
}>;


export type LoadLibraryQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, books: Array<{ __typename?: 'BookMin', id: string, name: string }> } };

export type LoadLibrarySettingsQueryVariables = Exact<{
  libraryId: Scalars['ID'];
}>;


export type LoadLibrarySettingsQuery = { __typename?: 'Query', library: { __typename?: 'Library', id: string, name: string, rootDir: string } };

export type CreateLibraryMutationVariables = Exact<{
  input: LibraryInput;
}>;


export type CreateLibraryMutation = { __typename?: 'Mutation', createLibrary: string };


export const GetBookDocument = gql`
    query getBook($libraryId: ID!, $bookId: ID!) {
  book(libraryId: $libraryId, bookId: $bookId) {
    id
    name
    pages
  }
}
    `;
export const CreateBookDocument = gql`
    mutation createBook($libraryId: ID!, $bookDir: String!, $bookInput: BookInput!) {
  createBook(libraryId: $libraryId, init: {dir: $bookDir}, input: $bookInput)
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
    query loadLibrary($libraryId: ID!) {
  library(id: $libraryId) {
    id
    name
    books {
      id
      name
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
  }
}
    `;
export const CreateLibraryDocument = gql`
    mutation createLibrary($input: LibraryInput!) {
  createLibrary(input: $input)
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
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;