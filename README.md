# Northcoders House of Games API -  A Backend Project Game
A backend project whilst learning with Northcoders Bootcamp school

## Link
The link to the hosted version of the backend, frontend Github repo and hosted version of the whole app can be found below. 

Backend endpoints : https://my-ncgame.herokuapp.com/api

The hosted version of this app: https://baldock92-board-games.netlify.app/

The frontend Github repo: https://github.com/baldock92/nc-games



## Summary

You can find the needed information and files to create a database and node.js based API for a website to review board games.
You'll be able to find:
-Test and development data, written in Javascript.
-Seed files to create a Postgresql database.
-API made using express.js and using MVC framework.
-Testing suites for all API endpoints using Jest and Supertest.


## Files to be added:

Anybody looking to clone this project and run it locally must add a .env file for both the development and test database, and assigning the PGDATABASE to the respective database.
You can do this by setting up 2 files, .env.development & .env.test 

The .env.development will connect to the correct database using PGDATABASE=nc_games and the .env.test will connect to the correct database using PGDATABASE=nc_games_test

## Requirements
To deploy and run this project locally:

-Postgres should be version 12.9 or higher
-Node.js should be verison 18.0.0 or higher

## How to run this locally
To deploy and test this project locally (using ubuntu, other OS will vary):
1. Clone repo in terminal
```js
git clone https://github.com/baldock92/backend-project--nc-games
```
2. Install dependencies
```js
npm i
```
3. Create local .env files:

-Creates files .env.test and .env.development in root directory
-Enter the following in each file (without the ''s):
        PGDATABASE='database name here'
-The test database name is : nc_games_test   & the development database name is :   nc_games

4. Seed local database
```js
npm run setup-dbs
```
5. Run tests
```js
npm run test