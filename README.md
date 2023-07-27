# brew-track

This service is written in [TypeScript](https://www.typescriptlang.org/), compiled/packaged in [Node.js](https://nodejs.org/en/) and uses [Express.js](https://expressjs.com/) as the HTTP routing framework.

## Running Locally

First, ensure that you have the following installed:

```
$> node -v
$>  v16.18.0
```

Once you've cloned the repo modify the `local.env` file to your liking. The defaults should be enough to start (if you've used the 'brew-track-db' project)

```
SERVICE_NAME=brew-track
PORT=8443
LOG_LEVEL=debug
DB_HOST=127.0.0.1
DB_NAME=brew-track-db
DB_USER=brew-track-user
DB_PASS=brew-track-passwd
DB_PORT=3306
DB_CONNECTIONS=1
```

Next, install required packages

```
npm install
npm run dev
```

The local server will start up in **development** mode and you should now be able to access it via:

```
https://localhost:8443/
```

## Configuration

Available Configs:

```
// The name of the actual service
SERVICE_NAME=brew-track

// The port the server should start on
PORT=8443

// The log level, e.g. `emerg`,`alert`,`crit`,`error`,`warning`,`notice`,`info`,`debug`.
// For development purposes, 'debug' is recommended

LOG_LEVEL=debug


// MySQL Database parameters
DB_HOST=127.0.0.1
DB_NAME=brew-track-db
DB_USER=brew-track-user
DB_PASS=brew-track-passwd
DB_PORT=3306
DB_CONNECTIONS=1
```

## Swagger

Swagger documentation is available at https://[server]:[port]/api-doc

## Scripts

```
-   `lint` - Runs `eslint` on the project and fixes any formatting issues
-   `build` - Webpack build that outputs to `dist/index.js`
-   `dev` - Start the environment in 'development' mode.
-   `start` - runs the production version of the code in `dist/index.js`
-   `test` - Runs jest (unit testing)
```

