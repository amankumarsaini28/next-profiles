import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    Observable,
    FetchResult,
    gql,
} from "@apollo/client";
import { Kind, ObjectTypeDefinitionNode, OperationTypeNode } from 'graphql';
import { LocalLink } from 'src/graphql/local-link/local-link';

interface Profile {
    user_display_name: string;
    user_email: string;
    user_gender: string;
    date_of_birth: string;
}

const schema = gql`
    type Profile {
        stamp: string
        user_display_name: string
        user_email: string
        user_gender: string
        date_of_birth: string
    }

    type ProfileInput {
        user_display_name: string
        user_email: string
        user_gender: string
        date_of_birth: string
    }

    type MutationResponse {
        status: string
    }

    type Query {
        getProfile(id: string): Profile @client
    }
    type Mutation {
        saveProfile(profile: ProfileInput): MutationResponse
    }
`;

interface IResolver {
    [key: string]: (any) => Promise<any>
}

let globProfile = {
    stamp: '',
    user_display_name: 'Aman',
    user_email: 'aman@example.com',
    user_gender: 'Male',
    date_of_birth: '01/01/1980'
};

const resolvers: IResolver = {
    saveProfile: ({ profile }: { profile: Profile }) => {
        globProfile = { ...globProfile, ...profile, stamp: `${Date.now()}` }
        return Promise.resolve({ status: 'ok' });
    },
    getProfile: () => {
        return Promise.resolve(globProfile)
    }
}


const client = new ApolloClient({
    typeDefs: schema,
    link: new LocalLink({ schema, resolvers }),
    cache: new InMemoryCache({}),
});

import './app.scss';

interface AppProps<T> {
    Component: React.FC<T>;
    pageProps: T;
}

const App: React.FC<AppProps<{}>> = ({ Component, pageProps }) => (
    <ApolloProvider client={client}>
        <Component {...pageProps} />
    </ApolloProvider>
);

export default App;