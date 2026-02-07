var lastTimeStamp = null;
var lastMouseX = null;
var lastMouseY = null;
var mouseSpeedX = null;
var mouseSpeedY = null;


document.body.addEventListener('mousemove', event => {
    if (lastTimeStamp === null) {
        lastTimeStamp = Date.now();
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        return;
    }

    const now = Date.now();
    const dt = now - lastTimeStamp;
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;

    mouseSpeedX = Math.round(dx / dt * 100);
    mouseSpeedY = Math.round(dy / dt * 100);
    lastMouseY = event.clientY;
    lastMouseX = event.clientX;
    lastTimeStamp = now;
})

export function getMouseInfo() {
    return {
        speedX: mouseSpeedX,
        speedY: mouseSpeedY,
        x: lastMouseX,
        y: lastMouseY,
    }
}