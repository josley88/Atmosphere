let snowElement = null

/* -------------------------------------------------------------------------- */
/*                       CREATE 6 SETS OF SNOW PARTICLES                      */
/* -------------------------------------------------------------------------- */

for (let i = 0; i < 25; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow0")
    snowElement.style.width = "7px"
    snowElement.style.height = "7px"
    snowElement.style.borderRadius = "7px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 5 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 5 + "s"
    document.body.appendChild(snowElement)
}
for (let i = 0; i < 25; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow0-2")
    snowElement.style.width = "7px"
    snowElement.style.height = "7px"
    snowElement.style.borderRadius = "7px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 5 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 5 + "s"
    document.body.appendChild(snowElement)
}
for (let i = 0; i < 50; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow1")
    snowElement.style.width = "5px"
    snowElement.style.height = "5px"
    snowElement.style.borderRadius = "5px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 7 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 7 + "s"
    document.body.appendChild(snowElement)
}
for (let i = 0; i < 50; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow1-2")
    snowElement.style.width = "5px"
    snowElement.style.height = "5px"
    snowElement.style.borderRadius = "5px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 7 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 7 + "s"
    document.body.appendChild(snowElement)
}

for (let i = 0; i < 75; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow2")
    snowElement.style.width = "3px"
    snowElement.style.height = "3px"
    snowElement.style.borderRadius = "2px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 10 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 10 + "s"
    document.body.appendChild(snowElement)
}
for (let i = 0; i < 75; i++) {
    snowElement = document.createElement("div")
    snowElement.classList.add("snow2-2")
    snowElement.style.width = "3px"
    snowElement.style.height = "3px"
    snowElement.style.borderRadius = "2px"
    snowElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    snowElement.style.animationDuration = 10 + Math.random() * 0.3 + "s"
    snowElement.style.animationDelay = Math.random() * 10 + "s"
    document.body.appendChild(snowElement)
}