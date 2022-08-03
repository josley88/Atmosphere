const express = require('express')
const connectLiveReload = require('connect-livereload')
const livereload = require('livereload')
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const { env } = require('process');
const favicon = require('serve-favicon')

// refresh browser on file change
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'))
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



// create server
const app = express()
const port = 8080
app.use(favicon('./public/favicon.ico'))

// Declare variables for Spotify auth
var spotify_at, spotify_rt;
const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

// determine callback URL depending on if dev or production
envURL = ''
node_env = process.env.NODE_ENV
if (node_env == 'prod') {
  envURL = 'https://csce-315-atmosphere.herokuapp.com/'
} else if (node_env == 'dev') {
  envURL = 'http://localhost:' + port + "/"
}




// app settings
app.use(express.static("public"))

// if dev environment, use livereload
if (node_env == 'dev') {
  app.use(connectLiveReload())
  console.log("Dev environment")
} else {
  console.log("Prod environment")
}

// using EJS template engine and ExpressJS
app.set('view engine', 'ejs')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// routes
app.get('/', (req, res) => {res.render('home')})

// create Spotify API
var spotifyApi = new SpotifyWebApi({
  clientId: 'dd6b2aa69e4f4ccda5c3a32f6d4c0981',
  clientSecret: '9e9cadd5850f4058a3c3d718270cb2e7',
  redirectUri: envURL + 'callback'
});

// route for spotify auth login prompt
app.get('/spotifylogin', (req, res) => { 
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// callback route for after user-spotify-login prompt
app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];
      spotify_at = access_token;
      spotify_rt = refresh_token;

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // console.log('access_token:', access_token);
      // console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      
      res.redirect(303, '/?access_token=' + access_token + '&' + refresh_token);

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});



// open server to internet
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})