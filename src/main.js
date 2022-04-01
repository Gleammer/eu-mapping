/* Info Modal setup and events */
// Initial Modal setup
const modalNode = document.querySelector('.info-modal')
let currentTimeout = undefined
let modal_mouseIsOver = false
let pin_mouseIsOver = false

// Display info-modal at coordinates
const showModalNode = (x, y) => {
    modalNode.classList.remove('disabled')
    modalNode.style.left = `${x}px`
    modalNode.style.top = `${y}px`
}
// Hide info-modal
const hideModalNode = () => {
    modalNode.classList.add('disabled')
}

// Dispatch on info-modal mouse over event
modalNode.addEventListener('mouseenter', () => {
    modal_mouseIsOver = true
})
// Dispatch on info-modal mouse leave event
modalNode.addEventListener('mouseleave', () => {
    modal_mouseIsOver = false
    // Dispatch event to modalNode
    const leaveEvent = new Event('modal_leave')
    modalNode.dispatchEvent(leaveEvent)
})
// Add Custom modal_leave Event listener
const modalLeaveEvent = () => {
    hideModalNode()
}
const addModalLeaveListener = () => {
    modalNode.addEventListener('modal_leave', modalLeaveEvent)
}
const removeModalLeaveListener = () => {
    modalNode.removeEventListener('modal_leave', modalLeaveEvent)
}

// Maths and coordinates functions
const getRelativeCoords = (element) => {
    const elementRect = element.getBoundingClientRect()
    
    return{
        x: elementRect.left,
        y: elementRect.top
    }
}

/* Info Wrapper setup and modifiers */
const infoNode = document.querySelector('.info-wrapper')
//infoNode.classList.add('disabled')

/* Map PIN Event listeners */
// On mouse enter event
const onMouseEnterEvent = (event) => {
    // Clear listener and timeout from previous Pin
    removeModalLeaveListener()
    clearTimeout(currentTimeout)
    
    pin_mouseIsOver = true
    const rez = getRelativeCoords(event.target)
    const { width } = event.target.getBoundingClientRect()
    showModalNode(rez.x + width / 2, rez.y)
    //console.log(`Enter Pin: ${event.target.id}`)
}

// On mouse leave event
const onMouseLeaveEvent = (event) => {
    pin_mouseIsOver = false
    currentTimeout = setTimeout(() => {
        // Add event listener or disable modal
        if(modal_mouseIsOver){
           addModalLeaveListener()
        } else {
            hideModalNode()
        }
    }, 500) // wait a second in order to give the user some breathing space
    //console.log(`Leave Pin: ${event.target.id}`)
}

// On pin click event
const onClickEvent = (event) => {
    //
}

/* Set mouse events listeners for pins */
const setPinListeners = (pins) => {
    pins.forEach(element => {
        element.addEventListener('mouseenter', onMouseEnterEvent)
        element.addEventListener('mouseleave', onMouseLeaveEvent)
        element.addEventListener('click', onClickEvent)
    });
}

// Working with SVG Object
let svgObject = document.querySelector('.eu-map')

svgObject.addEventListener('load', () => {
    svgObject = svgObject.contentDocument
    
    const pinList = svgObject.querySelectorAll('g[id^="Group-6"]')
    setPinListeners(pinList)
})