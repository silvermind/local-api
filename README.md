# LocalAPI
NodeJs application that runs API based on raml file.

## Installation
- Clone repo
```
git clone git@github.com:isaacloud/local-api.git
```
- Enter directory
```
cd local-api
```
- Download all dependencies
```
npm install
```

## Usage
- Run app
```
node localApi.js -r RAML_STRING
```
Replace RAML_STRING with path to your *.raml file.
- Wait for load raml files
```
[log] Raml loading finished
```
- Now LocalAPI is running at http://127.0.0.1:3333