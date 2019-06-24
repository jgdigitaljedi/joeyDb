const defaultPort = 3000;

interface Environment {
  apollo: {
    introspection: boolean,
    playground: boolean
  },
  port: number | string,
  appRoot: string;
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  port: process.env.PORT || defaultPort,
  appRoot: __dirname
};