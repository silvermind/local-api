#Fake IsaaCloud servers
An application for launching fake servers of the IsaaCloud platform.
The fake servers are launched according to the config.js file (more info on options there).
Three simple implementations of the API, OAuth and Connect servers are supplied.

## Usage
Configure the servers you want to fake in `app/config.js`

Configure the data shared by the servers in `app/data.js`

Run the project with gulp to watch changes and restart the application:

    gulp
or run the server once with node:

    node app/app.js

## Fake API
Currently, the API fake server works only by sending example JSON data parsed from the RAML file.

## Hosts util

There is a simple utility for automatically managing the hosts file entries. However, the current version is not stable
and can sometimes erase the contents of the hosts file due to an unidentified problem with IO operations on node shutdown.
A fix is necessary before the utility is to be used.