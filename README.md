#LocalAPI
<img align="right" src="https://github.com/isaacloud/local-api/raw/dev/logo.png">
LocalAPI is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a RAML file.
The application also generates dummy data json files from templates and use them as a response body in the API module.

In short: LocalAPI generates dummy data and runs a local API based on RAML.

## Tutorial
**Check out our tutorial for LocalAPI!**
https://github.com/isaacloud/local-api/wiki/Tutorial


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
localapi run {YOUR_RAML_FILENAME}.raml
```
Substitute `{YOUR_RAML_FILENAME}.raml` with your raml filename. Example:
```
localapi run raml_example_file.raml
```
- Wait a moment while the raml file is loaded and json files with dummy data are generated. The following information will show:
```
info: [localapi] App running at http:/0.0.0.0:3333
```
- LocalAPI will run at http://127.0.0.1:3333/

## Run options

### Custom port
To run LocalAPI on a custom port use -p argument
```
localapi run raml_example_file.raml -p 3500
```

### Show running details
To run LocalAPI with additional logs (details mode) use -d argument
```
localapi run raml_example_file.raml -d
```

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
## Changelog
Version `1.3.6`
- fixed bug with baseURI and added support for API versioning

Version `1.3.5`
- added default Content-Type for respones

Version `1.3.4`
- all data types in the request body supported
- improved handling for status codes fos success responses
- fixed json-schema validation issue

Version `1.3.0`
- added commander.js library for better CLI usage
- reorganised run commands
- hidden unnecessary logs on app start
- added 'details mode' which shows all logs on app start (-d argument)
- reorganised logs

Version `1.2.3`
- added a possibility to run an application on a custom port (-p argument)

Version `1.2.2`
- added support for custom headers in response

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
