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
---
## RAML directory structure
- [dir] assets - additional files
- [dir] examples - dummy data json files (generated from templates)
- [dir] static_examples - dummy data json files (static)
- [dir] schemas - json schemas
- [dir] templates - dummy data templates for [generator](#dummy-data-generator)
- {YOUR_RAML_FILENAME}.RAML - raml file
---
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
See [Example RAML directory](example_raml) with generated json files.

### Methods for template generator
- tmplUtils.**stringId([string_length])**<br>
Return string with random characters.<br>
*string_length* - default: 24
```
var id = tmplUtils.stringId();
// id === rd9k0cgdi7ap2e29
```
- tmplUtils.**getTemplate(template_filename)**<br>
Generate and include dummy data json from template.<br>
*template_filename* - path to template file
```
var userData = tmplUtils.getTemplate('user.js');
// userData === {user_data_json}
```
- tmplUtils.**multiCollection(min_length, max_length)(loop_function)**<br>
Create an array with a random number of elements beetween *min_length* and *max_length*.<br>
Single item in array is result from *loop_function*. <br>
*min_length* - Minimal length of items in array<br>
*max_length* - Maximal length of items in array<br>
*loop_function* - Function that add single item to array
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
- appToken - token which is passed after authorization by OAuth simulator
---
## Changelog
Version `1.1.1`
- modify and register application as global in npm repository
- change color of logs
- make dir 'examples' if does not exist
- a lot of small fixes
