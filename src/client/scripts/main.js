let pathArray = window.location.href.split(`/`);
let igeRoot = `${window.location.protocol}//${pathArray[2]}/engine/`;
let igeClientRoot = `${window.location.protocol}//${pathArray[2]}`;

$(document).ready(() => {
    const igeCoreConfig = require(`./coreConfig.js`);

    for (const file of igeCoreConfig.include) {
        const loadToClient = file[0].indexOf(`c`) > -1;
        if (loadToClient) require(igeRoot + file[2]);
    }
});

window.igeLoader = (function () {
    // Load the engine stylesheet
    // var css = document.createElement('link');
    // css.rel = 'stylesheet';
    // css.type = 'text/css';
    // css.media = 'all';
    // css.href = igeRoot + 'css/ige.css';

    // document.getElementsByTagName('head')[0].appendChild(css);

    let IgeLoader = function () {
        this.clientConfigReady();
    };

    IgeLoader.prototype.clientConfigReady = function () {
        console.log(igeCoreConfig);

        // Add the two array items into a single array
        this._coreList = igeCoreConfig.include;
        this._clientList = igeClientConfig.include;

        this._fileList = [];
        for (i = 0; i < this._coreList.length; i++) {
            // Check that the file should be loaded on the client
            if (this._coreList[i][0].indexOf(`c`) > -1) {
                this._fileList.push(igeRoot + this._coreList[i][2]);
            }
        }

        for (i = 0; i < this._clientList.length; i++) {
            this._fileList.push(igeClientRoot + this._clientList[i]);
        }

        this.loadNext();
    };

    IgeLoader.prototype.loadNext = function () {
        let url = this._fileList.shift();
        let script = document.createElement(`script`);
        let self = this;

        if (url !== undefined) {
            script.src = url;
            script.onload = function () {
                self.loadNext();
            };

            script.addEventListener(`error`, () => {
                throw new Error(`ERROR LOADING ${url} - does it exist?`);
            }, true);

            document.getElementsByTagName(`head`)[0].appendChild(script);
        }
    };

    return new IgeLoader();
}());
