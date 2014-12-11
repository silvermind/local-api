#LocalAPI
LocalAPI application is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a raml file.
The path to the raml file is passed as a parameter when the application is starting.
<!---
LocalAPI also allows for simulating the basic functionality of the OAuth library.
--->

## Installation
- Install Node.js from http://nodejs.org/
- Install LocalAPI module via npm
```
npm install -g localapi
```

## Usage
- Create RAML directory with [specified structure](#raml-directory-structure)
- Enter RAML directory
```
cd example_raml
```
- Run LocalAPI by command
```
localapi -r {YOUR_RAML_FILENAME}.raml
```
Substitute `{YOUR_RAML_FILENAME}.raml` with the your raml filename. Example:
```
localapi -r raml_example_file.raml
```
- Wait a moment while the raml file is loaded and json files with dummy data are generated. The following information will show:
```
[localapi] Raml loading finished
[localapi] App listening at http://0.0.0.0:333
```
- LocalAPI will run at http://127.0.0.1:3333/

## RAML directory structure
- [dir] assets - additional files
- [dir] examples - dummy data json files (generated from templates)
- [dir] static_examples - dummy data json files (static)
- [dir] schemas - json schemas
- [dir] templates - dummy data templates for [generator](#dummy-data-generator)
- {YOUR_RAML_FILENAME}.RAML - raml file

## Dummy data generator

### Information
Templates location: `/templates`<br />
Templates format: `*.js`<br />
Example data is generated every time LocalAPI starts.<br />
**TIP** - [Faker.js](https://github.com/marak/Faker.js/) library is available to use.

### How to
1. Create required directories with structure shown in [RAML directory structure](#raml-directory-structure)
2. Create javascript files with templates in `/templates` directory ([see example](#example)).
3. Run LocalAPI to generate json files ([see Usage](#usage))

### Example RAML directory


## Configuration
File location: `config/config.js`<br />
Description:
- port - port on which the application will run
- appToken - token which is passed after authorization by OAuth simulator

## Changelog
Version `1.1.1`
- modify and register application as global in npm repository
- change color of logs
- make dir 'examples' if does not exist
- a lot of small fixes
