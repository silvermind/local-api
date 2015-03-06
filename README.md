![alt text](https://github.com/isaacloud/local-api/raw/dev/logo.png "Local-API logo")

#LocalAPI
LocalAPI application is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a raml file.
The application also generates dummy data json files from templates and serve them as a response body in API module.

**In short: LocalAPI generates dummy data and runs local API based on RAML.**

## Installation
- Install Node.js from http://nodejs.org/
- Install LocalAPI module via npm
```
npm install -g localapi
```

## Usage
- Create a RAML directory with [specified structure](#raml-directory-structure)
- Enter the RAML directory
```
cd example_raml
```
- Run LocalAPI by command
```
localapi -r {YOUR_RAML_FILENAME}.raml
```
Substitute `{YOUR_RAML_FILENAME}.raml` with your raml filename. Example:
```
localapi -r raml_example_file.raml
```
- Wait a moment while the raml file is loaded and json files with dummy data are generated. The following information will show:
```
[localapi] Raml loading finished
[localapi] App listening at http://0.0.0.0:333
```
- LocalAPI will run at http://127.0.0.1:3333/

---
## RAML directory structure
- [dir] assets - additional files
- [dir] examples - dummy data json files (generated from templates)
- [dir] static_examples - dummy data json files (static)
- [dir] schemas - json schemas
- [dir] templates - dummy data templates for [generator](#dummy-data-generator)
- {YOUR_RAML_FILENAME}.RAML - raml file

See [Example RAML directory](example_raml) with generated json files.

---
## Dummy data generator

### Information
Template location: `/templates`<br />
Template format: `*.js`<br />
Example data is generated every time LocalAPI starts.<br />
**TIP** - [Faker.js](https://github.com/marak/Faker.js/) library is available to use.

### How to
1. Create required directories with the structure shown in [RAML directory structure](#raml-directory-structure)
2. Create javascript files with templates in `/templates` directory ([see example](#example-raml)).
3. Run LocalAPI to generate json files ([see Usage](#usage))

### Example RAML directory
See [Example RAML directory](example_raml) with generated json files.

### Methods for template generator
- tmplUtils.**stringId([string_length])**<br>
Returns a string with random characters.<br>
*string_length* - default: 24
```
var id = tmplUtils.stringId();
// id === rd9k0cgdi7ap2e29
```
- tmplUtils.**getTemplate(template_filename)**<br>
Generates and includes dummy data json from the template.<br>
*template_filename* - path to template file
```
var userData = tmplUtils.getTemplate('user.js');
// userData === {user_data_json}
```
- tmplUtils.**multiCollection(min_length, max_length)(loop_function)**<br>
Creates an array with a random number of elements between *min_length* and *max_length*.<br>
Single item in array is the result of *loop_function*. <br>
*min_length* - Minimal length of items in array<br>
*max_length* - Maximal length of items in array<br>
*loop_function* - Function that adds a single item to an array
```
var indexArray = tmplUtils.multiCollection(0, 20)(function (i) {
    return i;
});
// indexArray === [0, 1, 2, 3, 4, 5, 6]
```
```
var indexArray = tmplUtils.multiCollection(1, 3)(function (i) {
    return tmplUtils.getTemplate('user.js');
});
// indexArray === [{user_data_json_1}, {user_data_json_2}]
```
---
## Configuration
File location: `config/config.js`<br />
Description:
- port - port on which the application will run

---
## Changelog
Version `1.2.1`
- fixed method that gets content-type of request

Version `1.2.0`
- **changed path for json-schema for POST and PUT validation** (consistent with the RAML documentation now)
```
before: put/post -> responses -> {code} -> body -> {contentType} -> schema
now: put/post -> body -> {contentType} -> schema
```
- modified example_raml
- fixed merge of objects (example + request body) for response

Version `1.1.1`
- modified and registered the application as global in npm repository
- changed the color of logs
- added feature: make dir 'examples' if does not exist
- a lot of small fixes
