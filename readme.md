# Joey DB

This repo is a backend I am throwing up to store my video game collection and, eventually, more things as I continue to work on personal projects. It is the first time I am building a GraphQL backend, first time using Apollo, and the first time I am using TypeScript with Node so it is also meant to be a learning experience.

## Setup

clone the project, then:

```
npm i
```

## Tasks

To serve and watch:
```
npm start
```

To build:
```
npm run build
```

To run production build (after build task is run):
```
npm start:prod
```

Experimental:
```
npm run watch
```
I want hot reloading because the current start task is slower than I'd like. What I've found so far with every ts-node-dev or webpack solution I've tried is that the playground is unstable when using those solutions. I use npm start right now but am casually seeking a faster solution (although I've noticed that my current task isn't bad when my laptop isn't in power saving mode so my initial observation that this was slow isn't 100% accurate).

** Note: While server is running, at any time it can be restarted by typing `rs` and pressing 'Enter'

## Playground
Once the server is started, you can run queries and mutations via the Playground at http://localhost:3000/api/graphql.

While running any start task (even in production mode), the api runs at http://localhost:3000/api unless the port is changed in the .env file.


## TODOS
- add admin functionality to users
- finish user methods
- finish everything needed for games to work
- add logging
- add thorough error handling
- add documentation generation
- create console models and methods
- create accessory models and methods
- create clone models and methods
- create collectibles models and methods
- create hardware models and methods
- hookup to homeControl app to use instead of diskDB implementation
- security
- deploy to DO droplet CICD
- integrate with joeyg.me as no-ssr collection view
- think of more things to add
- use as model and learning experience to build retro game collectors site