Simple Node.js sample application using the salesforce.com REST API and OAuth for CRUDing accounts. 

You can run the application for yourself at the following url. You can authorize access to a production or developer org (recommended) to test out the functionality.

Demo app at [https://node-sfdc-demo.herokuapp.com](https://node-sfdc-demo.herokuapp.com) & [blog post](http://bit.ly/IwbMJV)

Localhost Setup
===============

The first thing you need to do is set up Remote Access for your application running locally. Log into your DE org and go to Setup -> App Setup -> Develop -> Remote Access

Create a new Remote Access and use the callback http://localhost:3001 (or whatever port you config the app for). Copy the values for the consumer key and consumer secret into app.js.

If you don't have node.js installed, you can do so from [http://nodejs.org/#download](http://nodejs.org/#download) 

You'll also need to install [Express](http://expressjs.com). The guide and quick start are available at [http://expressjs.com/guide.html](http://expressjs.com/guide.html) but you can install it globally with:

npm install -g express

You'll also need to install [restler](https://github.com/danwrong/restler), a REST client library for node.js:
 
npm install restler

I would also highly recommend you install [node-dev](https://github.com/fgnass/node-dev)!!! Node-dev is a development tool for Node.js that automatically restarts the node process when a script is modified. With node-dev you don't have to hit CTRL+C Up-Arrow Enter after every change to your Node.js application.

npm install -g node-dev

Now you can start your app with:

node-dev app.js		

Heroku Setup
============

Create a new application on heroku:

heroku create [YOUR-APP-NAME] --stack cedar

Add it to git and then push it to heroku.

To run the application on heroku, you'll need set up another Remote Access that points to your heroku site. Salesforce.com requires that non-localhost applications use SSL. Fortunately heroku makes it extremely easy to add SSL. The piggyback SSL add-on is now a platform feature and available by default to all Heroku applications. No need adding the add-on any more!! Just setup another Remote Access with the following callback url:

https://[YOUR-APP-NAME].herokuapp.com/token

The last thing you should need to do is add your new environment variables to heroku with the following:

1. heroku config:add CLIENT_ID=YOUR-REMOTE-ACCESS-CONSUMER-KEY
2. heroku config:add CLIENT_SECRET=YOUR-REMOTE-ACCESS-CONSUMER-SECRET
3. heroku config:add LOGIN_SERVER=https://login.salesforce.com
4. heroku config:add REDIRECT_URI=https://[YOUR-APP-NAME].herokuapp.com/token

You can confirm your environment variables for your app with:

heroku config

Access your application running on heroku and start the OAuth dance!

https://[YOUR-APP-NAME].herokuapp.com