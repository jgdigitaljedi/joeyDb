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
I want hot reloading because the current start task is slower than I'd like. What I've found so far with every ts-node-dev or webpack solution I've tried is that the playground is unstable when using those solutions. I use npm start right now but am actively seeking a faster solution.

** Note: While server is running, at any time it can be restarted by typing `rs` and pressing 'Enter'