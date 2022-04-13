// Load pin data from json file
let pin_data = []
fetch('./src/pin_data.json')
.then(res => res.json())
.then(res => pin_data = res)
.catch(err => console.warn(err))

fetch()

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

const populateModalNode = (pinID) => {
    // Get data using pinID
    const {data} = pin_data.find(elem => elem.pin_id === pinID)
    // Populate infoNode with information
    modalNode.querySelector('h3').innerText = data.name
    modalNode.querySelector('h5 span.type').innerText = data.type
    modalNode.querySelector('h5 span.address').innerText = data.address
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
let currentPinID = undefined
infoNode.classList.add('disabled')

const populateInfoNode = (pinID) => {
    // Get data using pinID
    const {data} = pin_data.find(elem => elem.pin_id === pinID)
    // Populate infoNode with information
    infoNode.querySelector('h3.title').innerHTML = data.name
    infoNode.querySelector('h5.subtitle').innerHTML = data.type
    infoNode.querySelector('h5.address').innerHTML = data.address
    infoNode.querySelector('.area-of-activity span').innerHTML = data.area_of_activity
    infoNode.querySelector('.type-of-activity span').innerHTML = data.type_of_activity
    infoNode.querySelector('.additional-info').innerHTML = data.additional_info
    infoNode.querySelector('.keywords span').innerHTML = data.keywords
}

/* Map PIN Event listeners */
// On mouse enter event
const onMouseEnterEvent = (event) => {
    // Clear listener and timeout from previous Pin
    removeModalLeaveListener()
    clearTimeout(currentTimeout)
    
    // Repopulate the modalNode
    populateModalNode(event.target.id)

    pin_mouseIsOver = true
    const rez = getRelativeCoords(event.target)
    const { width } = event.target.getBoundingClientRect()
    showModalNode(rez.x + width / 2, rez.y)
    //console.log(`Enter Pin: ${event.target.id}`)
}

// On mouse leave event
const onMouseLeaveEvent = () => {
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
const onClickEvent = (pinID) => {
    // Check if selected Pin is already displayed
    if(pinID === currentPinID){
        infoNode.classList.add('disabled')
        currentPinID = undefined
        return
    }
    // Hide infoNode before updating 
    infoNode.classList.add('disabled')
    // Populate the infoNode with new data after pin select
    populateInfoNode(pinID)
    
    // Display the infoNode
    infoNode.classList.remove('disabled')
    currentPinID = pinID
}

/* Set mouse events listeners for pins */
const setPinListeners = (pins) => {
    pins.forEach(element => {
        element.addEventListener('mouseenter', onMouseEnterEvent)
        element.addEventListener('mouseleave', onMouseLeaveEvent)
        element.addEventListener('click', () => onClickEvent(element.id))
    });
}

// Working with SVG Object
let svgObject = document.querySelector('.eu-map')

svgObject.addEventListener('load', () => {
    svgObject = svgObject.contentDocument
    
    const pinList = svgObject.querySelectorAll('g[id^="Group-6"]')
    setPinListeners(pinList)
})