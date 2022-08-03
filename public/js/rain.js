let rainElement
let rainCounter = 100

/* -------------------------------------------------------------------------- */
/*                      CREATE ONE SET OF RAIN PARTICLES                      */
/* -------------------------------------------------------------------------- */

for (let i = 0; i < rainCounter; i++) {
    rainElement = document.createElement("hr")
    rainElement.style.left = Math.floor(Math.random() * window.innerWidth * 2) + "px"
    rainElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s"
    rainElement.style.animationDelay = Math.random() * 5 + "s"
    document.body.appendChild(rainElement)
}