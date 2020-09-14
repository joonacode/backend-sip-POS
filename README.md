# Sip POS API
![GitHub repo size in bytes](https://img.shields.io/github/repo-size/joonacode/backend-sip-POS)

Tokofuku is an online shop website that is made specifically for e-commerce purposes, for many features to support transactions in online stores

## Build with
* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Redis](https://redis.io/)

## Requirements
* [Node.js](https://nodejs.org/en/)
* [Redis](https://redis.io/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](db_sipPos.sql)

## Project setup

```
npm install
```

### Install nodemon

Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

If you have already installed, skip this step.

```
npm install -g nodemon
```

### Setup .env example

Create .env file in your root project folder.

```
PORT = 4000
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = your_password
DB_DATABASE = db_tokoFUku
PRIVATE_KEY = your_private_key
PRIVATE_KEY_REFRESH_TOKEN = your_private_key
BASE_URL = http://localhost:4000
# For Redirect User When Click Link Activation. Just Change The 'localhost:8080'
BASE_URL_FRONTEND = http://localhost:8080/verify-account
BASE_URL_RESET_PASSWORD = http://localhost:8080/reset-password
PORT_REDIS = 6379
# For Send Email To User
EMAIL_USER = your_email
PASS_USER = your_password_email
```

### Run project for development

```
npm run dev
```

## API documentation link

See [Coming Soon](https://github.com/joonacode/backend-tokofuku)

## License
[MIT](https://choosealicense.com/licenses/mit/)
