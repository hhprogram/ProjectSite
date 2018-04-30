Personal website to showcase personal projects. Website backend and front-end 
built by Harrison as practice as well

See package.json for dependencies

Stack Details:
- NodeJS
- MongoDB
- Express

REQUIRED:
- Create '.env.default' file within the 'PythonTest' subfolder. Set key `PYTHON` to the absolute path to whatever python executable you want to use. If this is not done then PythonTest page will not work correctly

Notes for NPM install:
- Once node and npm are installed locally. Since my package.json file was up to date. I just cd-ed into the ProjectSite directory
(where the package.json file lives) and then did `npm install` (see: https://stackoverflow.com/questions/8367031/how-do-i-install-package-json-dependencies-in-the-current-directory-using-npm)

Notes on setting up RabbitMQ Locally:
- For now just using default port 5672 for rabbitMQ server. TO DO: learn how to set up config files so that
I can run the rabbitMQ server on custom ports and not just the default
- Note: Used the rabbitMQ console: https://www.rabbitmq.com/management.html#getting-started to set up a username 
and password. Ran: rabbitmq-plugins enable rabbitmq_management and then went to localhost:15672 to config rabbitmq
- Created a virtual host just to test out different user settings. Wanted to use a different server from localhost but
haven't figured out how to do that yet. When setting up virtual hosts in console you can name it whatever. Just note:
when connecting to them via javascript or python the list virtual host name must match exactly as inputted in the
management plugin. (see send.js and receive.js for example)

Notes on environment variable set up file:
- https://codeburst.io/how-to-easily-set-up-node-environment-variables-in-your-js-application-d06740f9b9bd
- Useful above except see comments on the config() line within routes/PythonTest/index.js as needed an argument rather than
just no argument
- used the library 'dotenv' (also see the above link). This allows you to easily access any file called .env.WHATEVER or just .env
and you can set environment variables that you want to access within the project (ie like DB names, passwords, usernames, python paths etc..)
- Created the .env.default file and put it within the PythonTest subfolder (as it made sense for now, might change if other routes require python to be run) and then set the environment variable for python as the string to the instance of python I wanted to run.
This is just the absolute path to the correct python executable file.
- Also, note i put the .env.default file within the .gitignore file to prevent accidentally pushing the .env.default file and having an incorrect path.