class GameCanvas {
    constructor(clickCallback) {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("canvas")
        this.ctx = canvas.getContext('2d')

        this.cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        this.cameraZoom = 1

        this.zoomLimit = { min: 0.1, max: 5 }
        this.scrollSensitivity = 0.25
        this.lastZoom = 1

        this.initialPinchDistance = null
        this.isDragging = false
        this.dragEventLoc = null

        this.clickCallback = null

        canvas.addEventListener('mousedown', (e) => this.onPointerDown(e))
        canvas.addEventListener('touchstart', (e) => this.handleTouch(e, (e) => this.onPointerDown(e)))
        canvas.addEventListener('mouseup', (e) => this.onPointerUp(e))
        canvas.addEventListener('mouseleave', (e) => this.onPointerUp(e))
        canvas.addEventListener('touchend', (e) => this.handleTouch(e, (e) => this.onPointerUp(e)))
        canvas.addEventListener('mousemove', (e) => this.onPointerMove(e))
        canvas.addEventListener('touchmove', (e) => this.handleTouch(e, (e) => this.onPointerMove(e)))
        canvas.addEventListener('wheel', (e) => {
            this.adjustZoom(null, 1 - Math.sign(e.deltaY) * this.scrollSensitivity)
            this.lastZoom = this.cameraZoom
        })
        canvas.addEventListener("contextmenu", (e) => {e.preventDefault()})
    }

    beginDraw() {
        // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
        this.ctx.scale(this.cameraZoom, this.cameraZoom)
        this.ctx.translate(-this.canvas.width / 2 + this.cameraOffset.x, -this.canvas.height / 2 + this.cameraOffset.y)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    getVisibleRect() {
        return {
            min: this.localToGlobal({x: 0, y: 0}),
            max: this.localToGlobal({x: this.canvas.width, y: this.canvas.height})
        }
    }

    setClickCallback(clickCallback) {
        this.clickCallback = clickCallback
    }
    setMoveCallback(moveCallback) {
        this.moveCallback = moveCallback
    }

    // Gets the relevant location from a mouse or single touch event
    getEventLocation(e) {
        if (e.touches && e.touches.length == 1) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        else if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    }

    onPointerDown(e) {
        if (this.getEventLocation(e)) {
            this.dragEventLoc = this.getEventLocation(e)
            this.dragStart = {
                x: this.dragEventLoc.x / this.cameraZoom - this.cameraOffset.x,
                y: this.dragEventLoc.y / this.cameraZoom - this.cameraOffset.y
            }
        }
    }

    localToGlobal(localpos) {
        let pos = localpos
        pos.x -= this.canvas.width / 2
        pos.y -= this.canvas.height / 2
        pos.x /= this.cameraZoom
        pos.y /= this.cameraZoom
        pos.x -= (this.cameraOffset.x - this.canvas.width / 2)
        pos.y -= (this.cameraOffset.y - this.canvas.height / 2)
        return pos
    }

    onPointerUp(e) {
        if (!this.isDragging && this.clickCallback && this.getEventLocation(e)) {
            this.clickCallback(this.localToGlobal(this.getEventLocation(e)), e)
        }
        this.isDragging = false
        this.dragEventLoc = null
        this.initialPinchDistance = null
        this.lastZoom = this.cameraZoom
    }

    onPointerMove(e) {
        if (this.getEventLocation(e)) {
            if (this.dragEventLoc) {
                if (!this.isDragging) {
                    let currentLoc = this.getEventLocation(e)
                    if (
                        Math.abs(currentLoc.x - this.dragEventLoc.x) + 
                        Math.abs(currentLoc.y - this.dragEventLoc.y) > 10
                    ) {
                        this.isDragging = true
                    }
                }
                if (this.isDragging) {
                    this.cameraOffset.x = this.getEventLocation(e).x / this.cameraZoom - this.dragStart.x
                    this.cameraOffset.y = this.getEventLocation(e).y / this.cameraZoom - this.dragStart.y
                }
            }
            if (!this.isDragging) {
                this.moveCallback(this.localToGlobal(this.getEventLocation(e)), e)
            }
        }
    }

    handleTouch(e, singleTouchHandler) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        }
        else if (e.type == "touchmove" && e.touches.length == 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    handlePinch(e) {
        e.preventDefault()
    
        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2
    
        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        }
        else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    }
    
    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.cameraZoom += zoomAmount
            }
            else if (zoomFactor) {
                this.cameraZoom = zoomFactor * this.lastZoom
            }
    
            this.cameraZoom = Math.min(this.cameraZoom, this.zoomLimit.max)
            this.cameraZoom = Math.max(this.cameraZoom, this.zoomLimit.min)
        }
    }

};

