var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');


var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


app = new express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

console.log('Listening on 8888');
app.listen(8888);


var scopes = ['user-read-private', 'user-read-email'],
  redirect_uri = 'http://localhost:8888/callback',
  client_id = '04a7ad8cc9b74d25be441350e9a14846',
  state = generateRandomString(16),
  stateKey = 'spotify_auth_state';

  app.get('/login', function(req, res) {
    
    res.cookie(stateKey, state);
  
    // your application requests authorization
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scopes,
        redirect_uri: redirect_uri,
        state: state
      }));
  });

app.get('/callback', function(req, res) {

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirect_uri,
  clientId: client_id
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);

