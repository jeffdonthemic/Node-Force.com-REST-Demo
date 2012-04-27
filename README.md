Simple Node.js sample application using the salesforce.com REST API and OAuth for CRUDing accounts. 

Setup

setup oauth client in sfdc (callback url: http://localhost:3001 - jeff@jeffdouglas.com)

install and run 
npm install restler

node-dev app.js		

heroku config:add --app dooder \
    LOGIN_SERVER="https://login.salesforce.com" \
    CLIENT_ID="3MVG9yZ.WNe6byQDx8PTnyUjr2Y3hox5B618bBK9tbjQT8H1h5C6pdgaY4Fl5SaCmdQklB5qh.k53CXW4uDDj" \
    CLIENT_SECRET="2107217001899926551" \
		REDIRECT_URI="https://dooder.herokuapp.com/token"