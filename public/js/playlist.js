// NOTES:
// web playback sdk player only keeps track of 2 songs in next queue, regardless of if api call adds to spotify queue w/ or w/o specific device id
// no easy access to tracks in spotify's queue
// Player's next_tracks is not a representation of the first 2 songs in the spotify queue

// to purge queue, best method is to next_track() until song playing is one we queued
// best practice seems to be to only add one or two songs to spotify queue at a time to reduce songs that will need to be passed over if weather/time changes
// having difficulty cycling through the queue, just assume queue is empty?

// it's nice to request large numbers of songs to spread repeated songs

// run after spotify.js and theme-engine
let song_queue = null
var weather_data = null

const _getRecommendations = async (token, genres, seed_tracks, target_valence='', target_energy='', target_tempo=100, market='', limit=50) => {
    
    let trackNames = []
    seed_tracks.forEach(element => {
        trackNames.push(element.name)
    })

    // LOGGING
    console.log("______________________RECOMMENDATIONS______________________")
    console.log("Genres: " + genres)
    console.log("Seed Tracks: " + trackNames)
    console.log("Valence: " + target_valence)
    console.log("Energy: " + target_energy)
    console.log("Tempo: " + target_tempo)
    console.log("Market: " + market)
    console.log("___________________________________________________________")




    // for variation
    var target_acousticness = Math.random().toFixed(2)
    
    req_url = 'https://api.spotify.com/v1/recommendations?seed_genres=' + genres.join(',') + '&limit=' + limit + '&target_acousticness=' + target_acousticness + '&target_tempo=' + target_tempo
    if (target_valence != ''){
        req_url += '&target_valence=' + target_valence
    }
    if (target_energy != ''){
        req_url += '&target_energy=' + target_energy
    }
    if (market != ''){
        req_url += '&market=' + market
    }
    
    // get users top tracks to create recommended playlist off of __________________
    if (seed_tracks.length > 0) {
        let tracks = []
        seed_tracks.forEach(element => {
            tracks.push(element.id)
        })
        req_url += '&seed_tracks=' + tracks.toString()
    }
    // _____________________________________________________________________________



    const result = await fetch(req_url, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token},
    }).then(async response => {
        const data = await response.json()
        // console.log("RECOMMENDATIONS DATA: ")
        console.log(data)
        return data
    })
    // console.log("RECOMMENDATIONS RESULT: ")
    // console.log(result)
    return result
}

_getISO = async (latitude, longitude) => {
    req_url = 'https://api.geonames.org/countryCodeJSON?lat=' + latitude +'&lng=' + longitude + '&username=trevorhatch'
    const result = await fetch(req_url, {
        method: 'GET',
    })
    return await result.json()
}

// get user's top tracks with a given offset index (for variation)
_getUserTopItems = async (token, offset) => {
    req_url = 'https://api.spotify.com/v1/me/top/tracks' + "?offset=" + offset + "&time_range=short_term&limit=5"

    const result = await fetch(req_url, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token}
    }).then(async response => {
        const status = response.status
        const data = await response.json()
        
        console.log(status);
        return data
    }).catch((error) => {
        document.getElementById("error-log").innerHTML = "SPOTIFY ERROR: Spotify is experiencing heavy traffic. Try reloading in a few seconds!"
    })
    return result
}

function get_market(latitude, longitude){
    res = ''
    valid_markets = ["AD","AE","AG","AL","AM","AO","AR","AT","AU","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BN","BO","BR","BS","BT","BW","BY","BZ","CA","CD","CG","CH","CI","CL","CM","CO","CR","CV","CW","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","ES","FI","FJ","FM","FR","GA","GB","GD","GE","GH","GM","GN","GQ","GR","GT","GW","GY","HK","HN","HR","HT","HU","ID","IE","IL","IN","IQ","IS","IT","JM","JO","JP","KE","KG","KH","KI","KM","KN","KR","KW","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MN","MO","MR","MT","MU","MV","MW","MX","MY","MZ","NA","NE","NG","NI","NL","NO","NP","NR","NZ","OM","PA","PE","PG","PH","PK","PL","PS","PT","PW","PY","QA","RO","RS","RW","SA","SB","SC","SE","SG","SI","SK","SL","SM","SN","SR","ST","SV","SZ","TD","TG","TH","TJ","TL","TN","TO","TR","TT","TV","TW","TZ","UA","UG","US","UY","UZ","VC","VE","VN","VU","WS","XK","ZA","ZM","ZW"]
    // market = _getISO(latitude, longitude).countryCode
    market = "US"
    if (valid_markets.includes(market)){
        return market
    }
    return res
}

function verifyWeather() {
    if (globalWeather[1] != "Loading...") {
        // console.log(weather_data)
        setTimeout(verifyWeather, 200)
    }
}

function getLongPlaylist(){
    res = []

    var token1 = params.get('access_token')
    var genres = []
    var target_valence = '-1'
    var target_energy = '-1'
    var target_tempo = 90

    var latitude = document.getElementById("latitude-desc").innerHTML
    var longitude = document.getElementById("longitude-desc").innerHTML
    var formattedLat = latitude.split(" ")[1]
    var formattedLong = longitude.split(" ")[1]
    var market, weather, timePeriod

    var seed_tracks = topTracks.slice(0,4)
    
    // console.log("GETTING RECOMMENDATIONS")/;

    // get genre from settings menu if set
    let preferredGenre = localStorage.getItem("preferredGenre")
    if (localStorage.getItem("forceGenre") == "true") {
        genres = []
        genres.push(preferredGenre)
        console.log("USING GENRE: " + genres[0])
    }

    if (localStorage.getItem("forceLoc") == "true") {
        market = document.getElementById("countryType").value
    }

    if (localStorage.getItem("forceEnv") == "true"){
        verifyWeather()
        weather = document.getElementById("weatherType").value
        timePeriod = document.getElementById("periodType").value
    }
    else{
        market = get_market(formattedLat, formattedLong)
        
        verifyWeather()
        
        weather_data = globalWeather
        weather = weather_data[0]
        timePeriod = weather_data[1]
    }



    switch(weather){
        case 'clear':
            target_valence = .9
            break
        case 'par':
        case 'par_cloudy':
            target_valence = .7
            break
        case 'cloudy':
            target_valence = .5
            break
        case 'hazy':
            target_valence = .3
            break
        case 'snowy':
            target_valence = .3
            break
        case 'rainy':
            target_valence = .2
            break
        case 'stormy':
            target_valence = .1
            break
    }
    
    switch(timePeriod){
        case 'morning':
            target_energy = .9
            target_tempo = 120
            break
        case 'afternoon':
            target_energy = .6
            target_tempo = 100
            break
        case 'evening':
            target_energy = .3
            target_tempo = 80
            break
        case 'night':
            target_energy = .1
            target_tempo = 60
            break
    }
    
    let recommendations=[]
    let track_data = null

    if (genres.length > 0) {
        seed_tracks = []
    }
    _getRecommendations(token1, genres, seed_tracks, target_valence, target_energy, target_tempo,market).then(data => {
        // console.log("GOT RECOMMENDATIONS:");
        // console.log(data);
        for (let i = 0; i < data.tracks.length; i++){
            track_data = data.tracks[i]
            recommendations.push(track_data)
            // console.log(recommendations);
        }
    })
    // console.log("RESPONSE BEFORE ASSIGNMENT:");
    // console.log(recommendations)
    // song_queue = recommendations
    return recommendations
}

// returns a list of strings of spotifyUri that are queued in the player
async function get_player_queue(player){
    player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK')
          return
        }
        var queue_data = state.track_window.next_tracks
        var res = []
        for (var i = 0; i < queue_data.length; i++){
            // console.log(queue_data[i].link)
            res.push(queue_data[i].uri)
        }
        // console.log(res)
        return res
    })
}

// given a new playlist, this will add the playlist to the player's queue and skip the songs already in the queue
// player.nextTrack() never actually goes through... tbd
function flush_queue(player, new_track){
    //cycle through queue until we are playing the first song from new_playlist
    player.getCurrentState().then(state => {
        console.log(state.track_window.current_track.name);
        
        if (state.track_window.current_track.name != new_track.name){
            console.log('skipping leftover')
            player.nextTrack().then(() => {
                playButton.innerHTML = 'pause'
                setTimeout(function(){
                flush_queue(player, new_track)
                }, 500)
            })
        }
        else{
            console.log('skipping songqueuetrack')
            flush_until_gone(player, new_track)
        }
    })
    
}

function flush_until_gone(player, new_track){
    player.getCurrentState().then(state => {
        console.log(state.track_window.current_track.name);
        
        if (state.track_window.current_track.name == new_track.name){
            console.log('reskip')
            player.nextTrack().then(() => {
                playButton.innerHTML = 'pause'
                setTimeout(function(){
                    flush_until_gone(player, new_track)
                }, 500)
            })
        }
    })
}

function init_player_tracks(player, token){ //refreshes player with recent recommendended songs
    getLongPlaylist()
    var player_queue = []
    for(var i = 0; i < Math.min(10, song_queue.length); i++){
        player_queue.push(song_queue.shift())
    }
    flush_queue(player, player_queue, token)
    // console.log("longPlaylist: " + player_queue)
}

function updatePlaylists(){
    /* var track_index = song_queue.indexOf(currentTrackInfo.uri)
    // if the currently playing track is not in the long list of tracks from Spotify recommendations then skip
    if (track_index == -1){
        player.nextTrack()
    } */
    
    // if the theme changed and current long_playlist is now outdated
    if (current_weather != weather_type){
        getLongPlaylist()
    }
    // if the song_queue is running out of songs
    else if (song_queue.length <= 10){
        let new_rec = song_queue
        getLongPlaylist()
        new_rec = new_rec.concat(song_queue)
        song_queue = new_rec
    }
    current_weather = weather_type
}