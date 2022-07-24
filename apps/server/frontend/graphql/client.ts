import { GraphQLClient } from "graphql-request";
import { Environments } from "../env";
import { getSdk } from "./autogen/gql";

const gqlClientRaw = new GraphQLClient(new URL('/api/query', Environments.ApiHost).href)
export const gqlClient = getSdk(gqlClientRaw);