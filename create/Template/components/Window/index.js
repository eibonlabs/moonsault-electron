const componentName = 'c-window';

import { buildComponent } from '../../../../lib/moonsault.js';
import html from './html.js';
import css from './css.js';


/* example html
    <c-window 
        data-x-position="0px" 
        data-y-position="0px" 
        data-width="600px"
        data-height="300px"
        data-draggable="true" 
        data-resizable="true" 
        data-maximize="true" 
        data-minimize="true" 
        data-close="true" 
    >
        <c-hello-world></c-hello-world>
    </c-window>
*/
// web component
customElements.define(componentName, class extends HTMLElement {
    constructor() {
        super();

        buildComponent(componentName, html, css, this);

        this.classList.add('window-parent');

        this.#setModel();

        this.#setWindowContents();

        this.#setBringToFront();

        if (this.#model.draggable === 'true') {
            this.#setDraggable();
        }

        if (this.#model.maximize === 'true') {
            this.#setMaximize();
        }

        if (this.#model.minimize === 'true') {
            this.#setMinimize();
        }

        if (this.#model.close === 'true') {
            this.#setClose();
        }

        if (this.#model.resizable === 'true') {
            this.#enableResizable();
        }
    }

    #model = {
        xPosition: null,
        yPosition: null,
        xOffset: 0,
        yOffset: 0,
        draggable: null,
        dragging: false,
        disableDrag: false,
        resizable: null,
        maximize: null,
        minimize: null,
        close: null,
        maximized: false,
        minimized: false,
        width: null,
        height: null,
        prevX: null,
        prevy: null,
        prevWidth: null,
        prevHeight: null
    };

    getModel() {
        return this.#model;
    }

    // sets the contents of the window
    #setWindowContents() {
        this.querySelector('.window-content').appendChild(this.querySelector(':first-child'));
    }

    // sets the initial internal model used by the window
    #setModel() {
        this.#model.xPosition = this.getAttribute('data-x-position');
        this.#model.yPosition = this.getAttribute('data-y-position');
        this.#model.width = this.getAttribute('data-width');
        this.#model.height = this.getAttribute('data-height');
        this.#model.draggable = this.getAttribute('data-draggable');
        this.#model.resizable = this.getAttribute('data-resizable');
        this.#model.maximize = this.getAttribute('data-maximize');
        this.#model.minimize = this.getAttribute('data-minimize');
        this.#model.close = this.getAttribute('data-close');
    }

    bringToFront() {
        const thisWindow = this;
        const windowsContainer = thisWindow.parentElement;
        windowsContainer.append(thisWindow);
    }

    // when clicking a titlebar, set that window to be on top
    #setBringToFront() {
        this.addEventListener('click', (e) => {
            this.bringToFront();
        });
    }

    maxmize() {
        if (this.#model.minimized === false) {
            if (this.#model.maximized === false) {
                this.#model.prevX = this.#model.xPosition;
                this.#model.prevY = this.#model.yPosition;
                this.#model.prevWidth = this.offsetWidth;
                this.#model.prevHeight = this.offsetHeight;
                this.#model.xPosition = 0;
                this.#model.yPosition = 0;
                this.#model.width = this.parentElement.offsetWidth + 'px';
                this.#model.height = this.parentElement.offsetHeight + 'px';
                this.#model.maximized = true;
                this.#model.disableDrag = true;
                if (this.#model.resizable === 'true') {
                    this.#disableResize();
                }
            } else {
                this.#model.xPosition = this.#model.prevX;
                this.#model.yPosition = this.#model.prevY;
                this.#model.width = this.#model.prevWidth + 'px';
                this.#model.height = this.#model.prevHeight + 'px';
                this.#model.prevWidth = this.offsetWidth;
                this.#model.prevHeight = this.offsetHeight;
                this.#model.prevX = this.#model.xPosition;
                this.#model.prevY = this.#model.yPosition;
                this.#model.maximized = false;
                this.#model.disableDrag = false;
                if (this.#model.resizable === 'true') {
                    this.#enableResizable();
                }
            }

            setTimeout(() => {
                this.classList.add('transtionWindowState');
                this.#render();
            }, 100);
        }
    }

    #setMaximize() {
        this.querySelector('.window-maximize').addEventListener('click', (e) => {
            this.maxmize();
        });
    }

    minimize() {
        if (this.#model.maximized === false) {
            if (this.#model.minimized === false) {
                this.#model.prevX = this.#model.xPosition;
                this.#model.prevY = this.#model.yPosition;
                this.#model.prevWidth = this.offsetWidth;
                this.#model.prevHeight = this.offsetHeight;
                this.#model.yPosition = this.parentElement.offsetHeight - this.querySelector('.window-title-bar').offsetHeight;
                this.#model.width = this.querySelector('.window-title-bar').offsetWidth + 'px';
                this.#model.height = this.querySelector('.window-title-bar').offsetHeight + 'px';
                this.#model.minimized = true;
                this.#model.disableDrag = true;
                if (this.#model.resizable === 'false') {
                    this.#disableResize();
                }
            } else {
                this.#model.xPosition = this.#model.prevX;
                this.#model.yPosition = this.#model.prevY;
                this.#model.width = this.#model.prevWidth + 'px';
                this.#model.height = this.#model.prevHeight + 'px';
                this.#model.prevWidth = this.offsetWidth;
                this.#model.prevHeight = this.offsetHeight;
                this.#model.prevX = this.#model.xPosition;
                this.#model.prevY = this.#model.yPosition;
                this.#model.minimized = false;
                this.#model.disableDrag = false;
                if (this.#model.resizable === 'true') {
                    this.#enableResizable();
                }
            }

            setTimeout(() => {
                this.classList.add('transtionWindowState');
                this.#render();
            }, 100);
        }
    }

    #setMinimize() {
        this.querySelector('.window-minimize').addEventListener('click', (e) => {
            this.minimize();
        });
    }

    close() {
        this.classList.add('transtionWindowState');
        setTimeout(() => {
            this.classList.add('close');
            let animationDuration = getComputedStyle(this)['transitionDuration'].split('s')[0];

            if (getComputedStyle(this)['transitionDuration'].indexOf('.') > 0) {
                animationDuration = parseFloat(animationDuration * 1000);
            } else {
                animationDuration = parseInt(animationDuration * 1000);
            }

            const animationEnd = setTimeout(() => {
                this.classList.remove('transtionWindowState');
                clearTimeout(animationEnd);
                this.remove();
            }, animationDuration);
        }, 0);

    }

    #setClose() {
        this.querySelector('.window-close').addEventListener('click', (e) => {
            this.close();
        });
    }

    #windowInteractionEnd = (e) => {
        this.#model.dragging = false;
        this.#model.width = this.offsetWidth + 'px';
        this.#model.height = this.offsetHeight + 'px';
    };

    #dragWindow = (e) => {
        if (this.#model.dragging === true) {
            e.preventDefault();

            if (e.type === "touchmove") {
                this.#model.xPosition = e.touches[0].clientX - this.#model.xOffset
                this.#model.yPosition = e.touches[0].clientY - this.#model.yOffset;
            } else {
                this.#model.xPosition = e.clientX - this.#model.xOffset;
                this.#model.yPosition = e.clientY - this.#model.yOffset;
            }

            this.#render();
        }
    };

    #dragWindowStart(e) {
        const thisComponent = e.target.closest('.window-parent');
        thisComponent.bringToFront();

        if (thisComponent.#model.disableDrag === false) {
            const element = e.target;
            const elementBounds = element.getBoundingClientRect();
            thisComponent.#model.dragging = true;
            thisComponent.#model.xOffset = e.clientX - elementBounds.left + 2;
            thisComponent.#model.yOffset = e.clientY - elementBounds.top + 2;
        }
    }

    #setDraggable() {
        const titlebar = this.querySelector('.window-title-bar h3');
        titlebar.addEventListener("touchstart", this.#dragWindowStart, false);
        titlebar.addEventListener("touchend", this.#windowInteractionEnd, false);
        titlebar.addEventListener("touchmove", this.#dragWindow, false);

        titlebar.addEventListener("mousedown", this.#dragWindowStart, false);
        this.addEventListener("mouseup", this.#windowInteractionEnd, false);
        titlebar.addEventListener("mouseup", this.#windowInteractionEnd, false);
        titlebar.addEventListener("mousemove", this.#dragWindow, false);
    }

    #disableResize() {
        this.classList.remove('resizable');
    }

    #enableResizable() {
        this.classList.add('resizable');
    }

    #render() {
        this.style.top = `${this.#model.yPosition}px`;
        this.style.left = `${this.#model.xPosition}px`;
        this.style.height = this.#model.height;
        this.style.width = this.#model.width;
        this.style.height = this.#model.height;

        if (this.classList.contains('transtionWindowState')) {
            let animationDuration = getComputedStyle(this)['transitionDuration'].split('s')[0];

            if (getComputedStyle(this)['transitionDuration'].indexOf('.') > 0) {
                animationDuration = parseFloat(animationDuration * 1000);
            } else {
                animationDuration = parseInt(animationDuration * 1000);
            }

            const animationEnd = setTimeout(() => {
                this.classList.remove('transtionWindowState');
                clearTimeout(animationEnd);
                console.log('animation complete')
            }, animationDuration);
        }
    }

    // connect component
    connectedCallback() {
        this.#render();
    }
});