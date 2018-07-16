# Operam test

## [Task](task.md)

## Requirements

- node v8 or higher due to use of `util.promisify` and ES6 features

## Instructions

1.  start MongoDB database with `docker-compose up`
2.  run data ingest with `npm run start:ingest`
3.  start Express server with `npm run start:server` \*
4.  start frontend with `npm run start:frontend`

\* complexity of algorithm that transforms data back to tree structure is O(n), because it uses only 1 loop and depends on the size of input
