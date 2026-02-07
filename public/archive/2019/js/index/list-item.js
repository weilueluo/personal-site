import { addClass, addClassOnSiblings, removeClassOnSiblings, removeClass } from "../components/utils.js";


(() => {

    const hoverSiblingClass = "list-item-hover-in-siblings";
    const hoverInClass = "list-item-hover-in";
    const hoverOutClass = "list-item-hover-out";
    const mousedownClass = "list-item-mouse-down";

    document.querySelectorAll(".list-item").forEach(listItem => {
        

        /* click */

        listItem.addEventListener("mousedown", event => {
            addClass(event.target, mousedownClass);
            
            // if mousedown inside but mouseup outside
            document.addEventListener("mouseup", documentEvent => {
                if (!documentEvent.composedPath().includes(event.target)) {
                    removeClass(event.target, mousedownClass);
                }
            }, { once: true })
        })

        listItem.addEventListener("mouseup", event => {
            removeClass(event.target, mousedownClass);
        })

        /* hover */

        listItem.addEventListener("mouseenter", event => {

            removeClass(event.target, hoverOutClass);
            addClass(event.target, hoverInClass);
            addClassOnSiblings(event.target, hoverSiblingClass, 'pointer-events-none');
            
            // disable sibiling hover for sometime, 
            // to avoid uncomfortable flashing when mouse move quickly across different list items
            addClassOnSiblings(event.target, 'pointer-events-none');
            window.setTimeout(() => {
                addClassOnSiblings(event.target, 'pointer-events-none');
            }, 500);

            event.target.enterTime = Date.now();
        })
        
        const minIntervalInMs = 500;
        listItem.addEventListener("mouseout", event => {
            
            let interval = 0;
            if (event.target.enterTime !== undefined) {
                interval = minIntervalInMs - (Date.now() - event.target.enterTime);
            }
            
            // remove later, to avoid uncomfortable flashing effect
            // when mouse is re-enter within a short amount of time
            window.setTimeout(() => {
                removeClass(event.target, hoverInClass);
                removeClassOnSiblings(event.target, hoverSiblingClass, 'pointer-events-none');
                addClass(event.target, hoverOutClass);
                delete event.target.enterTime;
            }, interval);
            
        })

        // disable other list item effects when one is playing
        listItem.addEventListener("animationstart", event => {
            addClassOnSiblings(event.target, 'pointer-events-none');
        })

        listItem.addEventListener("animationend", event => {
            removeClassOnSiblings(event.target, 'pointer-events-none');
        })
    })

    // cv click
    document.querySelector(".list-item-cv").addEventListener("click", event => {
        window.open('assets/cv.pdf', '_blank');
    })

    // about click
    document.querySelector(".list-item-about").addEventListener("click", event => {
        window.open('about.html', '_self');
    })

    // waifu click
    document.querySelector(".list-item-waifu").addEventListener("click", event => {
        window.open('waifu.html', '_self');
    })

    // works click
    document.querySelector(".list-item-works").addEventListener("click", event => {
        window.open('works.html', '_self');
    })

})()