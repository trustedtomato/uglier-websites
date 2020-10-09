// Invert images & videos
const stylesheet = document.createElement('style')
stylesheet.innerText = "img, image, video { filter: invert(0.7) }"

document.head.appendChild(stylesheet)

// Add a random red box
const div = document.createElement('div')
div.style.backgroundColor = "red"
div.style.position = "fixed"
div.style.width = "100%"
div.style.height = "20%"
div.style.top = "20%"
div.style.left = "0"
div.style.opacity = "0.6"
div.style.pointerEvents = "none"
// "Opera 12.1 supports values up to 2^15-1"
div.style.zIndex = 32767

document.body.appendChild(div)