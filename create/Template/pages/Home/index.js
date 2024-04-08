const componentName = 'p-home';

import { buildComponent } from '../../../../lib/moonsault.js';
import html from './html.js';
import css from './css.js';

// web component
customElements.define(componentName, class extends HTMLElement {
    constructor() {
        super();

        buildComponent(componentName, html, css, this);
    }

    // connect component
    connectedCallback() {
        console.info('Home Page Connected');
    }
});