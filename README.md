#LocalAPI
LocalAPI application is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a raml file.
The path to the raml file is passed as a parameter when the application is starting.
LocalAPI also allows for simulating the basic functionality of the OAuth library.

## Installation
- Install Node.js from http://nodejs.org/
- Copy LocalAPI repository using the command
```
git clone git@github.com:isaacloud/local-api.git
```
- Go to the directory using the command
```
cd local-api
```
- Run command to download all dependencies
```
npm install
```

## Usage
- Go to project directory
```
cd local-api
```
- Run LocalAPI by command
```
node localApi.js -r RAML_STRING
```
Substitute RAML_STRING with the path to the raml file. Example:
```
node localApi.js -r raml/test.raml
```
- Wait a moment for the raml file to load. The following information will show:
```
[log] Raml loading finished
```
- LocalAPI will run at http://127.0.0.1:3333/

## OAuth testing mock
There are two available resources simulating OAuth module.

### GET /oauth/auth
Returns redirect to address specified in the parameter and adds information on the token in a hashtag.
**Required parameter: “origin”.**

Example of use:

Request
```
GET http://127.0.0.1:3333/oauth/auth?id=1&test=true&origin=http://test.com
```
Response
```
303 REDIRECT
http://test.com?id=1&test=true&origin=http://test.com#access_token=111&token_type=Bearer&expires_in=3600
```

### POST /oauth/token
Simulation of back-end authorization using the POST method.

Example of use:

Request
```
Method: POST
Url: http://127.0.0.1:3333/oauth/token
Data (payload):
{“grant_type”: “client_credentials”}
Headers:
{
  “Content-Type”: “application/json”,
  “Authorization”: “Basic XXX”
}
```
Response
```
200 OK
Data:
{
  “token_type”: “Bearer”,
  “expires_in”: “3600”,
  “access_token”: YYY
}
```

## Configuration
File location: config/config.js

Description:
- port - port on which the application will run
- baseUrl - address to which OAuth simulator redirects the request after authorization
- appToken - token which is passed after authorization by OAuth simulator