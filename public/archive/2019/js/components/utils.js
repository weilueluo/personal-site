export function applyToAllSiblings(node, callback) {
    node.parentNode.childNodes.forEach(child => {
        if (child != node) {
            callback(child);
        }
    });
}

export function applyToAllElementSiblings(node, callback) {
    applyToAllSiblings(node, sibling => {
        if (sibling.nodeType == Node.ELEMENT_NODE) {
            callback(sibling);
        }
    })
}

export function addClass(element, ...clazz) {
    element.classList.add(...clazz);
}

export function removeClass(element, ...clazz) {
    element.classList.remove(...clazz);
}

export function addClassOnSiblings(element, ...clazz) {
    applyToAllElementSiblings(element, sibling => sibling.classList.add(...clazz));
}

export function removeClassOnSiblings(element, ...clazz) {
    applyToAllElementSiblings(element, sibling => sibling.classList.remove(...clazz));
}

export function getComputedStyles(element) {
    return window.getComputedStyle(element);
}

export function getComputedStyle(element, name) {
    return getComputedStyles(element).getPropertyValue(name);
}

