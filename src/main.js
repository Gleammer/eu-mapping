// Initial Modal setup
const modalNode = document.querySelector('.info-modal')
modalNode.classList.add('disabled-modal')
//document.querySelector('.modal-wrapper').removeChild(modalNode)

// Maths and coordinates functions
const getRelativeCoords = (element) => {
    const elementRect = element.getBoundingClientRect()
    
    return{
        x: elementRect.left,
        y: elementRect.top
    }
}

/* Map PINs Event listeners */
// On mouse enter event
const onMouseEnterEvent = (event) => {
    const rez = getRelativeCoords(event.target)
    // console.log(getRelativeCoords(event.target))

    console.log(rez)
    modalNode.style.left = `${rez.x}px`
    modalNode.style.top = `${rez.y}px`

    console.log(`Enter: ${event.target.id}`)
}

// On mouse leave event
const onMouseLeaveEvent = (event) => {
    console.log(`Leave: ${event.target.id}`)
}

// Set mouseevents listeners for pins
const setPinListeners = (pins) => {
    pins.forEach(element => {
        element.addEventListener('mouseenter', onMouseEnterEvent)
        element.addEventListener('mouseleave', onMouseLeaveEvent)
    });
}

// Working with SVG Object
let svgObject = document.querySelector('.eu-map')

svgObject.addEventListener('load', () => {
    svgObject = svgObject.contentDocument

    const pinList = svgObject.querySelectorAll('g[id^="Group-6"]')
    setPinListeners(pinList)
    
    //console.log(pinList)
})