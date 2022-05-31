import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import {
  DocumentNode,
  Kind,
  ObjectTypeDefinitionNode,
  OperationTypeNode,
} from "graphql";

export interface LocalResolver {
  (...args: any[]): Promise<any>;
}

export interface LocalResolvers {
  [key: string]: LocalResolver;
}

export interface LocalLinkOptions {
  schema: DocumentNode;
  resolvers: LocalResolvers;
}
export class LocalLink extends ApolloLink {
  constructor(options: LocalLinkOptions) {
    const { resolvers, schema } = options;
    super((operation) => {
      const promises = [];
      const res = new Observable<FetchResult>((observer) => {
        operation.query.definitions.forEach((definition) => {
          if (
            definition.kind === "OperationDefinition" &&
            (definition.operation === OperationTypeNode.MUTATION ||
              definition.operation === OperationTypeNode.QUERY)
          ) {
            const operationVariableKeys = definition.variableDefinitions.map(
              (variable) => {
                return variable.variable.name.value;
              }
            );
            const operationVariables = Object.keys(operation.variables)
              .filter((key) => {
                return operationVariableKeys.indexOf(key) > -1;
              })
              .reduce((acc, curr) => {
                return {
                  ...acc,
                  [curr]: operation.variables[curr],
                };
              }, {});

            const requestedOperations = definition.selectionSet.selections
              .map((selection) => {
                return {
                  name:
                    selection.kind === Kind.FIELD
                      ? selection.name.value
                      : undefined,
                  alias:
                    selection.kind === Kind.FIELD
                      ? selection.alias?.value
                      : undefined,
                };
              })
              .filter((_) => _.name);

            const availableOperations = schema.definitions
              .filter((availableOperation) => {
                return availableOperation.kind === Kind.OBJECT_TYPE_DEFINITION
                  ? ["Mutation", "Query"].indexOf(
                      availableOperation.name.value
                    ) > -1
                  : false;
              })
              .flatMap((availableOperation) => {
                return (availableOperation as ObjectTypeDefinitionNode).fields;
              })
              .map((item) => {
                return item.name.value;
              });

            requestedOperations.forEach((requestedOperation) => {
              if (availableOperations.indexOf(requestedOperation.name) > -1) {
                const promise = resolvers[requestedOperation.name](
                  operationVariables
                ).then((data) => {
                  const key = requestedOperation.alias
                    ? requestedOperation.alias
                    : requestedOperation.name;
                  observer.next({
                    context: operation.getContext(),
                    data: {
                      [key]: data,
                    },
                    extensions: operation.extensions,
                  });
                });
                promises.push(promise);
              }
            });
          }
        });
        Promise.all(promises).finally(() => {
          observer.complete();
        });
      });
      return res;
    });
  }
}
