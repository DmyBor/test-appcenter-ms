# appcenter.js

### The program was developed as test task 

## Installation:
1. npm ci
2. npm i -g (for using appcenter in console, otherwise use node index.js <commands>)

#### First of all you need to log in by command 
```
appcenter login -t <token>
```

#### After that you can use commands 
```
appcenter build -a <application> --all for building all branches or
appcenter build -a <application> --list to watch which branches will be builded
appcenter app --list to watch all applications for current token
```
#### Also you can use --help command for list of commands and -v for current version

#### Listing of commands at the end of readme;

### List of improvements:
1. test cases
2. logs in file
3. command controller
4. better error handling
5. i don't like how api working( at least set token in api after login and not passing everywhere)

#### Usage: appcenter [options] [command]
##### CLI for ms appcenter
###### Options:
*  -v, --vers       output the current version
*  -h, --help       display help for command

##### Commands:
*  login [options]
*  build [options]  Build some application
*  help [command]   display help for command

####  Usage: appcenter build [options]
##### Build some application
###### Options:
*  -a, --app <application name>  Name of application
*  --all                         Building all branches of application
*  --list                        Show all branches of application to build
*  -h, --help                    display help for command

#### Usage: appcenter login [options]
##### Command for auth
###### Options:
*  -t, --token <token>  User API token
*  -h, --help           display help for command


#### Usage: appcenter app [options]
##### Get info about application
###### Options:
*  --list      Show all applications of current user
*  -h, --help  display help for command