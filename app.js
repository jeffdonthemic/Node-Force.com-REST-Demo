
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , rest = require('./rest.js')
  , oauth = require('./oauth.js')
  , url = require('url');

/**
 * Setup some environment variables (heroku) with defaults if not present
 */
var port = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
var cid = process.env.CLIENT_ID || "YOUR-REMOTE-ACCESS-CONSUMER-KEY";
var csecr = process.env.CLIENT_SECRET || "YOUR-REMOTE-ACCESS-CONSUMER-SECRET";
var lserv = process.env.LOGIN_SERVER || "https://login.salesforce.com";
var redir = process.env.REDIRECT_URI || "http://localhost:" + port + "/token";

/**
 * Middleware to call identity service and attach result to session
 */
function idcheck() {
	return function(req, res, next) {
		// Invoke identity service if we haven't got one or access token has 
		// changed since we got it
	    if (!req.session || !req.session.identity || req.session.identity_check != req.oauth.access_token) {
				rest.api(req).identity(function(data) {
					console.log(data);
					req.session.identity = data;
					req.session.identity_check = req.oauth.access_token;
					next();
				});					
		} else {
			next();			
		}
	}
}

/**
 * Create the server
 */
var app = express.createServer(
    express.cookieParser(),
    express.session({ secret: csecr }),
    express.query(),
    oauth.oauth({
        clientId: cid,
        clientSecret: csecr,
        loginServer: lserv,
        redirectUri: redir,
    }),
	idcheck()
);

/**
 * Configuration the server
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/**
 * Routes
 */

 // 'home' page
app.get('/', routes.index);

// list of accounts - see routes/index.js for more info
app.get('/accounts', routes.accounts);

// form to create a new account
app.get('/accounts/new', function(req, res) {
	// call describe to dynamically generate the form fields
	rest.api(req).describe('Account', function(data) {
		res.render('new', { title: 'New Account', data: data })
	});
});

// create the account in salesforce
app.post('/accounts/create', function(req, res) {
	rest.api(req).create("Account", req.body.account, function(results) {
		if (results.success == true) {
			res.redirect('/accounts/'+results.id);
			res.end();
		}
	});
});

// display the account
app.get('/accounts/:id', function(req, res) {
	rest.api(req).retrieve('Account', req.params.id, null, function(data) {
		res.render('show', { title: 'Account Details', data: data });
	});
});

// form to update an existing account
app.get('/accounts/:id/edit', function(req, res) {
	rest.api(req).retrieve('Account', req.params.id, null, function(data) {
		res.render('edit', { title: 'Edit Account', data: data });
	});
});

// update teh account in salesforce
app.post('/accounts/:id/update', function(req, res) {
	rest.api(req).update("Account", req.params.id, req.body.account, function(results) {
		res.redirect('/accounts/'+req.params.id);
		res.end();
	});	
});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
