var rest = require('restler');

exports.refresh = function refresh(options) {
    console.log('refresh');
    rest.post(options.oauth.loginServer+'/services/oauth2/token', {
        data: { 
            grant_type: 'refresh_token',
            client_id: options.oauth.clientId,
            client_secret: options.oauth.clientSecret,
            refresh_token: options.oauth.refresh_token
        },
    }).on('complete', function(data, response) {
      if (response.statusCode == 200) {
          console.log('refreshed: '+data.access_token);
          options.callback(data);
      }
    }).on('error', function(e) {
		  console.error(e);
		});    
}

exports.oauth = function oauth(options) {
    var loginServer = options.loginServer || 'https://login.salesforce.com/',
        clientId = options.clientId,
        clientSecret = options.clientSecret,
        redirectUri = options.redirectUri;
    
    return function oauth(req, res, next){
        console.log('oauth');
        console.log('url :'+req.url);
        if (req.session && req.session.oauth) {
            // We're done - decorate the request with the oauth object
            req.oauth = req.session.oauth;
            req.oauth.loginServer = loginServer;
            req.oauth.clientId = clientId;
            req.oauth.clientSecret = clientSecret;
            console.log(req.session.oauth);
            next();
        } else if (req.query.code){
            // Callback from the Authorization Server
            console.log('code: '+req.query.code);
            
            rest.post(loginServer+'/services/oauth2/token', {
                data: { 
                    code: req.query.code,
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    client_secret: clientSecret
                },
            }).on('complete', function(data, response) {
              if (response.statusCode == 200) {
                req.session.oauth = data;
                state = req.session.oauth_state;
                delete req.session.oauth_state;
                console.log('oauth done - redirecting to '+state);
        		res.redirect(state);
              }
            }).on('error', function(e) {
    			  console.error(e);
    		});
        } else {
            // Test for req.session - browser requests favicon.ico but doesn't
            // bother sending cookie?
            if ( req.session ) {
                // We have nothing - redirect to the Authorization Server
                req.session.oauth_state = req.url;
        	    var oauthURL = loginServer + "/services/oauth2/authorize?response_type=code&" +
        	        "client_id=" + clientId + "&redirect_uri=" + redirectUri + "&display=touch";
                console.log('redirecting: '+oauthURL);
        		res.redirect(oauthURL);  // Redirect to salesforce.com
        		res.end();
    		} else {
    		    next();
    		}
        }
    };
};
