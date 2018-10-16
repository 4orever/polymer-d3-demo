import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import * as dataUtils from "./data-utils";
import treeDiagram from "./tree-diagram";

/**
 * @customElement
 * @polymer
 */
class PolymerD3DemoApp extends PolymerElement {
    static get template() {
        console.log('template');
        return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>[[dataUri]]</h2>
      <svg width="100" height="100" id="svg"></svg>
    `;
    }

    static get properties() {
        return {
            dataUri: String,
            width: Number,
            height: Number,
        };
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.data = dataUtils.fetch(this.dataUri);
    }

    ready() {
        super.ready();
        this.$.svg.attributes.getNamedItem('width').value = this.width;
        this.$.svg.attributes.getNamedItem('height').value = this.height;

    }
}

window.customElements.define('polymer-d3-demo-app', PolymerD3DemoApp);

const data = dataUtils.fetch('src/pipeline.json'),
    flatTree = dataUtils.normalize(data);

new treeDiagram(flatTree);

