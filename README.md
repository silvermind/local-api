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

## RAML directory structure
- assets - additional files
- examples - data exmaples
- schemas - json schemas
- templates - dummy data templates
- xxx.RAML - raml file

## Dummy data generator
Templates location: /templates
Format: js

Example data is generated every time LocalAPI starts.
Faker JS library available to use.

Steps:

1. load templates

2. eval script

3. stringify generated data

4. save received string as json file in /examples directory

Example template
```
module.exports = {
    address: faker.address.streetAddress(),
    avatar: faker.internet.avatar(),
    city: faker.address.city(),
    companyId: 1,
    companyName: faker.company.companyName(),
    country: faker.address.country(),
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    fb: null,
    firstName: faker.name.firstName(),
    id: 1,
    lastName: faker.name.lastName(),
    postCode: faker.address.zipCode(),
    instancesAcl: {
        1: 'admin',
        2: 'viewer'
    },
    updatedAt: faker.date.recent()
}
```

Generated data
```
{
    "address": "6606 Emerald Roads",
    "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/teeragit/128.jpg",
    "city": "Aricview",
    "companyId": 1,
    "companyName": "Rempel-Dibbert",
    "country": "French Guiana",
    "createdAt": "2014-04-01T23:37:41.710Z",
    "email": "Ruby_Schaden@hotmail.com",
    "fb": null,
    "firstName": "Vida",
    "id": 1,
    "lastName": "Wunsch",
    "postCode": "24182-5971",
    "instancesAcl": {
        "1": "admin",
        "2": "viewer"
    },
    "updatedAt": "2014-11-26T17:51:12.460Z"
}
```

## Configuration
File location: config/config.js

Description:
- port - port on which the application will run
- baseUrl - address to which OAuth simulator redirects the request after authorization
- appToken - token which is passed after authorization by OAuth simulator

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