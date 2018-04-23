Personal website to showcase personal projects. Website backend and front-end 
built by Harrison as practice as well

See package.json for dependencies

Stack Details:
- NodeJS
- MongoDB
- Express

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