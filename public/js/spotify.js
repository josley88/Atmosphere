const params = new URLSearchParams(window.location.search)
let player = {}
let playerReady = false
let token = ""
let currentTrackInfo = {}
let deviceId = ""
var last_queued_track
var queue_history = []
var is_first_song = true
let ref_song_queue = []
let topTracks = null
var queue_sync_track = {name: 'Silent Track', uri: 'spotify:track:0o12mLSQuXFgsh4e2Kc4e5'}
var skip_to_first = false;
var can_skip = false;
var queue_lock = false;

// front end player variables
let currState = {position: 0, paused: true, next_tracks: []}

const _getStatePosition = () => {
    
    player.getCurrentState().then(state => {
        try {
            currState.paused = state.paused
            currState.position = state.position
            currState.duration = state.duration
            currState.current_track = state.current_track
            currState.next_tracks = state.next_tracks
            currState.updateTime = performance.now()
        } catch (error) {

        }
    })

    if (currState.paused) {
        return currState.position
    }

    let position = currState.position + (performance.now() - currState.updateTime) / 1000
    return position > currState.duration ? currState.duration : position
}

const _getCurrentTrack = async (token) => {
    const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    }).then(async response => {
        // console.log(result)
        const data = await response.json()
        currentTrackInfo = data
    })
    .catch(error => console.log('error', error))
}

const _transferPlayback = (device_id, token) => {
    var myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + token)
    myHeaders.append("Content-Type", "text/plain")

    var raw = `{"device_ids": ["${device_id}"] }`

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    fetch("https://api.spotify.com/v1/me/player", requestOptions)
    .then(response => response.text())
    .catch(error => console.log('error', error))
}

const _queueTrack = async (token, spotify_uri, device_id = '') => {
    var req_url = 'https://api.spotify.com/v1/me/player/queue?uri=' + spotify_uri
    if (device_id != ''){
        req_url += '&device_id=' + device_id
    }
    const result = await fetch(req_url, {
        method: 'POST',
        headers: { 'Authorization' : 'Bearer ' + token},
    })

    return result
}


function update_queue_elements(){
    for (var i = 0; i < 8; i++) {
        var elementArt = document.getElementById("playlist-art-" + String(i))
        var elementTitle = document.getElementById("playlist-title-" + String(i))
        var elementArtist = document.getElementById("playlist-artist-" + String(i))
        
        elementArtist.innerHTML = song_queue[i].artists[0].name
        elementTitle.innerHTML = song_queue[i].name
        elementArt.src = song_queue[i].album.images[2].url

        // console.log(elementArtist.innerHTML)
    }
}

let preQueue = false
let songsReady = false

window.onSpotifyWebPlaybackSDKReady = () => {
    token = params.get('access_token')

    // get top tracks from user
    player = new Spotify.Player({
        name: 'Atmosphere Player',
        getOAuthToken: cb => { cb(token) },
        volume: 0.5
    })

    

    // Ready
    player.addListener('ready', ({ device_id }) => {
        deviceId = device_id
        console.log('Ready with Device ID', device_id)

        // remove spotify login page
        let loginOverlay = document.getElementById('login-overlay')
        if (loginOverlay) {loginOverlay.style.display = "none"}
        _transferPlayback(device_id, token)
        playerReady = true

        // console.log("GETTING TOP TRACKS");
        _getUserTopItems(token, Math.floor(Math.random() * 20)).then((result) => {
            // console.log('SUCCESS!');
            // console.log("MY OWN RECOMMENDATIONS")
            topTracks = result.items
            
            let interval = setInterval(waitForTime, 500)

            function waitForTime() {
                if (globalWeather[1] != "Loading...") {
                    song_queue = getLongPlaylist()
                    // console.log(song_queue)
                    if (song_queue != null) {
                        // console.log("DONEEEE");
                        
                        songsReady = true
                        setTimeout(update_queue_elements, 500)
                        clearInterval(interval)
                    }
                }
            }
            
            // console.log("SONG QUEUE NOW LOOKS LIKE:")
            // console.log(song_queue)
        })
        player.resume().then(() => {
            //player.pause()
        })

        // run client.js pageReady when ready to go
        pageReady()

        // if ( != song_queue[0].id){
        //     if(queue_history.length > 1){
        //         if(current_track.id != queue_history[1].id){
        //             player.nextTrack()
        //         }
        //     }
        //     else{
        //         console.log('I really want to skip here')
        //     }
        // }
        preQueue = true
    })

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
    })

    player.addListener('initialization_error', ({ message }) => {
        console.error(message)
    })

    player.addListener('authentication_error', ({ message }) => {
        console.error(message)
    })

    player.addListener('account_error', ({ message }) => {
        console.error(message)
    })

    
    player.addListener('player_state_changed', ({position, duration, track_window: { current_track }}) => {
        
        updateTrackInfo()
        
        if (current_track.name == queue_sync_track.name){
            console.log('on queue sync song')
            /* if (can_skip){
                console.log('skipping queue sync song')
                can_skip = false;
                console.log('skipping rain')
                player.nextTrack().then(() =>{
                    setTimeout(function(){can_skip = true;},500)
                });
            } */
        }
        // console.log("SONG QUEUE 1")
        // console.log(song_queue);
        if (!songsReady) {
            return
        }

        if (typeof current_track != "undefined") {

            // console.log("SONG QUEUE 2")
            // console.log(song_queue);

            if (typeof last_queued_track != "undefined") {
                
                // console.log("SONG QUEUE 3")
                // console.log(song_queue);

                // if currently playing track was last to be queued, queue the next track
                if (last_queued_track.name == current_track.name){

                    // console.log("SONG QUEUE 4")
                    // console.log(song_queue);

                    // queue the first song
                    if(is_first_song){
                        queue_lock = true;

                        // console.log("SONG QUEUE 5")
                        // console.log(song_queue);

                        if (song_queue == null) {
                            console.error("SONG QUEUE DOESNT EXIST")
                            return
                        }

                        is_first_song = false 
                        console.log('QUEUEING: ' + queue_sync_track.name);
                        console.log('QUEUEING: ' + song_queue[0].name);
                        
                        _queueTrack(token, queue_sync_track.uri).then(() => {
                            setTimeout(function(){
                            _queueTrack(token, song_queue[0].uri).then(() => {
                                setTimeout(function(){
                                    flush_queue(player, queue_sync_track)
                                    can_skip = true;
                                    queue_lock = false;
                                }, 3000); 
                                
                                
                            })
                        }, 1000)
                        })
                        
                        last_queued_track = song_queue[0]
                        queue_history.unshift(song_queue[0])
                    }
                    else if (!queue_lock){
                        queue_lock = true;
                        // console.log("LEVEL FOUR");
                        console.log('QUEUEING: ' + song_queue[1].name)
                        _queueTrack(token, song_queue[1].uri).then(() => {
                            queue_lock = false;
                        })
                        last_queued_track = song_queue[1]
                        song_queue.shift()
                        queue_history.unshift(last_queued_track)
                    }
                    
                    update_queue_elements()
                    
                                        
                }

                // check if currently playing song is not a song we queued
                // if (current_track.id != queue_history[0].id){
                //     if(queue_history.length > 1){
                //         if(current_track.id != queue_history[1].id){
                //             player.nextTrack()
                //         }
                //     }
                //     else{
                //         console.log('I really want to skip here')
                //     }
                // }
                
            }
            else{
                last_queued_track = current_track
            }
        }
        if (typeof song_queue != "undefined") {
            if (song_queue.length < 10){

                let new_rec = getLongPlaylist()
                let running = false
                if (!running) {
                    running = true
                    setTimeout(() => {
    
                        for (let i = 0; i < new_rec.length; i++) {
                            song_queue.push(new_rec[i])
                            // console.log("PUSH");
                        }
                        
                        // console.log("Concatenated Playlist:");
                        // console.log(song_queue);
                        running = false
                    }, 1500)
                }
                
                
            }
        }
        else{
            // console.log("ELSE FUNCTION RECOMMENDATIONS")
            getLongPlaylist()
        }
      })
      
    
    player.connect()

    // playback functionality
    document.getElementById('play-button').onclick = function() {
        if (playButton.innerHTML == 'play_arrow'){
            player.resume()
            playButton.innerHTML = 'pause'
        }
        else{
            player.pause()
            playButton.innerHTML = 'play_arrow'
        }
    }
    
    document.getElementById('next-button').onclick = function() {
        player.nextTrack()
        playButton.innerHTML = 'pause'
    }

    document.getElementById('previous-button').onclick = function() {
        //back_queue.push(last_queued_track)
        if (queue_history.length < 3){
            return
        }
        _queueTrack(token, queue_history[2].uri).then(() => {
            player.nextTrack().then(() => {
                player.nextTrack()
                queue_history.shift()
                song_queue.unshift(queue_history[0])
                _queueTrack(token, queue_history[0].uri).then(()=> {
                    update_queue_elements()
                })
                last_queued_track = queue_history[0]
            })
        })
    }


    // Volume slider functionality
    $("#volume").slider({
        min: 0,
        max: 100,
        value: 50,
        range: "min",
        slide: function(event, ui) {
            player.setVolume(ui.value / 100)
        }
    })
}