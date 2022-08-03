let playStatus = false
let trackInfo = {}
let albumInfo = {}

let playButton = document.getElementById("play-button")
let progressBar = document.getElementById("progress-bar")
let progressTimeLeft = document.getElementById("progress-time-left")
let progressTimeRight = document.getElementById("progress-time-right")

let weatherDropDown = document.getElementById("weatherType")
let periodDropDown = document.getElementById("periodType")

let currentTrackArt = document.getElementById("current-track-art")
let currentTrackTitle = document.getElementById("current-track-title" )
let currentTrackAlbum = document.getElementById("current-track-album" )
let currentTrackArtist = document.getElementById("current-track-artist" )
let currentTrackGenre = document.getElementById("current-track-genre" )

let envSwitch = document.getElementById("forceEnv")
let locSwitch = document.getElementById("forceLoc")
let genreSwitch = document.getElementById("forceGenre")
let genreType = document.getElementById("genreType")

let checkPositionInterval = setInterval(updateProgress, 1000)
let tBox = document.getElementById("tBox")
let tPointer = document.getElementById("tPointer")
let tText = document.getElementById("tText")

let width = window.innerWidth
let height = window.innerHeight
let tCounter = 0

let oldElement = null
let removePlaylistBorder = false

console.warn = () => {}



/* -------------------------------------------------------------------------- */
/*                              RUN ON PAGE READY                             */
/* -------------------------------------------------------------------------- */

function pageReady() {
    if (localStorage.getItem("tutorialRan") == null) {
        console.log("This is your first visit. Welcome!");
        setTimeout(() => {
            runTutorial()
            nextTutSection() 
        }, 3000)
        localStorage.setItem("tutorialRan", "true")
    }
}



/* -------------------------------------------------------------------------- */
/*                         LOGIN WITHOUT SPOTIFY/MUSIC                        */
/* -------------------------------------------------------------------------- */

function noMusic() {
    document.getElementById("login-overlay").style.display = "none"
    pageReady()
}



/* -------------------------------------------------------------------------- */
/*                               PLAYER CONTROLS                              */
/* -------------------------------------------------------------------------- */

// update play button icon on click
// playButton.addEventListener("click", () => {
//     if (playStatus) {
//         playButton.innerHTML = "play_arrow"
//     } else {
//         playButton.innerHTML = "pause"
//     }
//     playStatus = !playStatus
// })

// helper function
function millisToMinAndSec(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// update current song progress in progress bar
function updateProgress() {
    let progressValue = 0
    if (playerReady) {
        progress = _getStatePosition()
        progressValue = (Math.floor((progress / currState.duration) * 1000))
        
        // check that progressValue isn't infinity or NaN or something
        if (progressValue) {
            progressBar.value = progressValue
            progressTimeLeft.innerHTML = millisToMinAndSec(progress)
            progressTimeRight.innerHTML = "-" + millisToMinAndSec(currState.duration - progress)
        }
    }
}



// update Main Album Art
function updateTrackInfo() {
    if (playerReady){
        _getCurrentTrack(token)
        albumInfo = currentTrackInfo.item
        if (albumInfo != null) {
            currentTrackArt.src = albumInfo.album.images[1].url
            currentTrackTitle.innerHTML = albumInfo.name
            currentTrackAlbum.innerHTML = albumInfo.album.name
            currentTrackArtist.innerHTML = albumInfo.artists[0].name
        }
    }
}



/* -------------------------------------------------------------------------- */
/*                            FORCE ENV/LOC/GENRE                             */
/* -------------------------------------------------------------------------- */

// update and set the settings sliders. Can't be both on at the same time
if (localStorage.getItem("forceEnv") == "true") {
    envSwitch.checked = localStorage.getItem("forceEnv")
    weatherDropDown.value = localStorage.getItem("weather")
    periodDropDown.value = localStorage.getItem("period")
}
if (localStorage.getItem("forceLoc") == "true") {
    locSwitch.checked = localStorage.getItem("forceLoc")
    document.getElementById("countryType").value = localStorage.getItem("country")
}
if (localStorage.getItem("forceGenre") == "true") {
    genreSwitch.checked = localStorage.getItem("forceGenre")
    genreType.value = localStorage.getItem("preferredGenre")
}

$("#genreType").on("change", forcePrefGenre)
$("#weatherType").on("change", forceEnvCheck)
$("#periodType").on("change", forceEnvCheck)
$("#countryType").on("change", forceLocCheck)

function forceEnvCheck() {
    if (envSwitch.checked == true) {
        locSwitch.checked = false
        localStorage.setItem("forceLoc", "false")
        localStorage.setItem("weather", weatherDropDown.value)
        localStorage.setItem("period", periodDropDown.value)
    }

    localStorage.setItem("forceEnv", envSwitch.checked)
}

function forceLocCheck() {
    if (locSwitch.checked == true) {
        envSwitch.checked = false
        localStorage.setItem("forceEnv", "false")
        localStorage.setItem("country", document.getElementById("countryType").value)
    }

    localStorage.setItem("forceLoc", locSwitch.checked)
    
}

function forcePrefGenre() {
    if (genreSwitch.checked == true) {
        localStorage.setItem("preferredGenre", genreType.value)
    } else {
        localStorage.setItem("preferredGenre", "null")
    }
    localStorage.setItem("forceGenre", forceGenre.checked)
}



/* -------------------------------------------------------------------------- */
/*                                  TUTORIAL                                  */
/* -------------------------------------------------------------------------- */

// move the tutorial box to a position based off of viewport percentage
function moveTutorial(elementID, x1, y1, str) {
    focusElement = document.getElementById(elementID)
    if (oldElement != null) {
        oldElement.classList.remove("focus")
    }

    if (removePlaylistBorder == true) {
        document.getElementById("playlist").classList.remove("focus")
        removePlaylistBorder = false
    }

    if (elementID == "playlist-container") {
        document.getElementById("playlist").classList.add("focus")
        removePlaylistBorder = true
    }
    
    focusElement.classList.add("focus")
    oldElement = focusElement

    document.documentElement.style.setProperty("--posX", `${x1}vw`)
    document.documentElement.style.setProperty("--posY", `${y1}vh`)
    updateTutorialText(str)
}

// move the tutorial box to a position based off pixels instead of viewport percentage
function moveTutorialPix(elementID, x1, y1, str) {
    focusElement = document.getElementById(elementID)
    if (oldElement != null) {
        oldElement.classList.remove("focus")
    }

    if (removePlaylistBorder == true) {
        document.getElementById("playlist").classList.remove("focus")
        removePlaylistBorder = false
    }
    

    if (elementID == "playlist-container") {
        document.getElementById("playlist").classList.add("focus")
        removePlaylistBorder = true
    }
    
    focusElement.classList.add("focus")
    oldElement = focusElement

    document.documentElement.style.setProperty("--posX", `${x1}px`)
    document.documentElement.style.setProperty("--posY", `${y1}px`)
    updateTutorialText(str)
}

// hides the tutorial box
function hideTutorial() {
    focusElement.classList.remove("focus")
    tBox.style.setProperty("display", "none")
    oldElement = null
    focusElement = null
}

// changes the tutorial box text
function updateTutorialText(str) {
    if (str == "Here is the current weather for your location as well as your local time") {
        var tl = gsap.timeline();
        tText.innerHTML = str
        tl.from(tText, {opacity: 0})
        .to(tText, {duration: .2, opacity: 1})
    } else {
        var tl = gsap.timeline();
        tl.fromTo(tText, {opacity: 1}, {duration: .2, opacity: 0})
        .call(() => {tText.innerHTML = str})
        .to(tText, {duration: .2, opacity: 1})
    }
}

// handles each tutorial location using tCounter 
function nextTutSection() {
    switch (tCounter) {
        case 0:
            moveTutorial("weatherBox", 50, 10, "Here is the current weather for your location as well as your local time")
            tBox.style.setProperty("display", "flex")
            tCounter++
            break


        case 1:
            moveTutorialPix("settingsButton", width - 250, 60, "Click here to access the settings menu")
            tCounter++
            break


        case 2:
            toggleSettingsMenu(1)
            moveTutorial("settings", 65, 30, "Here you can manually change the weather, time, and location")
            tCounter++
            break
        case 3:
            updateTutorialText("Changing these will change the look and sound of the website!")
            tCounter++
            break

        case 4:
            toggleSettingsMenu(0)
            moveTutorial("album-art-container", 17, 50, "Here is the currently playing song")
            tCounter++
            break


        case 5:
            moveTutorial("playlist-container", 55, 40, "Here are the queued songs based on your current weather and time. Feel free to scroll down!")
            tCounter++
            break

        
        case 6:
            moveTutorialPix("controls", 275, height - 260, "Here you can play/pause or skip/rewind the current song")
            tCounter++
            break


        case 7:
            moveTutorial("progress", 50, 72, "This bar shows your current song progress")
            tCounter++
            break

        case 8:
            moveTutorialPix("volume-container", width - 270, height - 260, "You can change the volume using this slider")
            tCounter++
            break


        case 9:
            moveTutorialPix("aboutButton", width - 250, 60, "Learn more about us and the project here")
            tCounter++
            break


        case 10:
            moveTutorialPix("tutorialButton", width - 270, 60, "You can replay this tutorial any time by clicking here")
            tCounter++
            break;


        case 11:
            window.removeEventListener("click", nextTutSection)
            tCounter = 0
            hideTutorial()
            break;
    }
}

// runs the tutorial
function runTutorial() {
    console.log("Running tutorial")
    window.addEventListener("click", nextTutSection)    
}



/* -------------------------------------------------------------------------- */
/*                              SETTINGS TOGGLES                              */
/* -------------------------------------------------------------------------- */

// opens/closes the settings menu. 0=closed, 1=open, and -1=toggle(default)
function toggleSettingsMenu(state=-1) {
    if (state == 1) {
        if (!document.getElementById("settings").classList.contains("show")) {
            document.getElementById("settings").classList.add("show")
            document.getElementById("playlist").classList.remove("show")
        } else {
            document.getElementById("settings").classList.add("show")
            document.getElementById("playlist").classList.remove("show")
        }
    }
    else if (state == 0) {
        if (document.getElementById("settings").classList.contains("show")) {
            document.getElementById("settings").classList.remove("show")
            document.getElementById("playlist").classList.add("show")
        } else {
            document.getElementById("settings").classList.add("show")
            document.getElementById("playlist").classList.remove("show")
        }
    } else {
        if (!document.getElementById("settings").classList.contains("show")) {
            document.getElementById("settings").classList.add("show")
            document.getElementById("playlist").classList.remove("show")
        } else {
            document.getElementById("settings").classList.remove("show")
            document.getElementById("playlist").classList.add("show")
        }
    }
}

// toggles the about section
function toggleAboutSection() {
    if (document.getElementById("about").classList.contains("hide")) {
        document.getElementById("about").classList.remove("hide")
        document.getElementById("about-box").classList.remove("hide")
    } else {
        document.getElementById("about").classList.add("hide")
        document.getElementById("about-box").classList.add("hide")
        
    }
}



/* -------------------------------------------------------------------------- */
/*                             PARALLAX MOUNTAINS                             */
/* -------------------------------------------------------------------------- */

document.addEventListener("mousemove", parallax);
function parallax(event) {
  this.querySelectorAll(".mountain svg").forEach((shift) => {
    const position = shift.getAttribute("value");
    const x = ((window.innerWidth - event.pageX * position) / 90) - 200;
    const y = (window.innerHeight - event.pageY * position) / 200;
    shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
}