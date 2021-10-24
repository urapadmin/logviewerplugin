import { html, css, LitElement } from "lit";
import { API_STATE_ERROR, API_STATE_READY } from "./kioskapi";

export class KioskApp extends LitElement {
    kiosk_base_url = import.meta.env.VITE_KIOSK_BASE_URL;

    static get properties() {
        return {
            /**
             * The Api Context
             */
            apiContext: { type: Object },
            appErrors: { type: Array },
        };
    }

    constructor() {
        super();
        this.appErrors = [];
        this.apiContext = undefined;
    }

    updated(_changedProperties) {
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
                this.addAppError("Cannot connect to Kiosk API.");
            }
        }
    }

    render() {
        let renderedHtml;
        if (this.apiContext && this.apiContext.status === API_STATE_READY) {
            renderedHtml = this.apiRender();
        } else {
            if (this.apiContext && this.apiContext.status === API_STATE_ERROR)
                renderedHtml = this.renderApiError();
            else renderedHtml = this.renderNoContextYet();
        }
        // noinspection HtmlUnknownTarget
        return html`
            <style>
                .system-message {
                    border-style: solid;
                    border-width: 2px;
                    padding: 2px 1em;
                    position: relative;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #882501, #bb3302);
                    color: #fabc02;
                }
            </style>
            <link
                rel="stylesheet"
                href="${this.kiosk_base_url}static/styles.css"
            />
            ${this.renderErrors()} ${renderedHtml}
        `;
    }

    renderNoContextYet() {
        // noinspection HtmlUnknownTarget
        return html`
            <link
                rel="stylesheet"
                href="${this.kiosk_base_url}static/styles.css"
            />
            <h1>please wait ...</h1>
        `;
    }
    renderApiError() {
        return undefined;
    }

    renderErrors() {
        if (this.appErrors.length > 0) {
            return html`
                ${this.appErrors.map(
                    (error) => html`<div class="system-message">${error}</div>`,
                )}
            `;
        } else return undefined;
    }

    addAppError(error) {
        this.appErrors.push(error);
        this.requestUpdate();
    }

    deleteError(error) {
        let foundIndex = -1;
        this.appErrors.find((apiErr, index) => {
            if (apiErr === error) {
                foundIndex = index;
                return true;
            } else return false;
        });
        if (foundIndex > -1) {
            this.appErrors.splice(foundIndex, 1);
            this.appErrors = [...this.appErrors];
            // this.requestUpdate();
        }
    }
}
