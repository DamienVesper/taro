
let pathArray = window.location.href.split(`/`);
let igeRoot = `http://${pathArray[2]}/engine/`;
let igeClientRoot = `http://${pathArray[2]}`;

console.log(`igeRoot`, igeRoot);

window.igeLoader = (function () {
    // Load the engine stylesheet
    // var css = document.createElement('link');
    // css.rel = 'stylesheet';
    // css.type = 'text/css';
    // css.media = 'all';
    // css.href = igeRoot + 'css/ige.css';

    // document.getElementsByTagName('head')[0].appendChild(css);

    let IgeLoader = function () {
        let self = this;
        let ccScript;

        this._loadingCount = 0;

        // Load the clientConfig.js file into browser memory
        ccScript = document.createElement(`script`);
        ccScript.src = `${igeRoot}CoreConfig.js`;
        ccScript.onload = function () {
            self.coreConfigReady();
        };
        ccScript.addEventListener(`error`, () => {
            throw new Error(`ERROR LOADING ${igeRoot}CoreConfig.js` + ` - does it exist?`);
        }, true);

        document.getElementsByTagName(`head`)[0].appendChild(ccScript);
    };

    IgeLoader.prototype.coreConfigReady = function () {
        let self = this;

        if (typeof (igeCoreConfig) !== `undefined`) {
            // Load the client config
            ccScript = document.createElement(`script`);
            ccScript.src = `${igeClientRoot}ClientConfig.js`;
            ccScript.onload = function () {
                self.clientConfigReady();
            };
            ccScript.addEventListener(`error`, () => {
                throw new Error(`ERROR LOADING ClientConfig.js - does it exist?`);
            }, true);

            document.getElementsByTagName(`head`)[0].appendChild(ccScript);
        } else {
            throw new Error(`ERROR READING igeCoreConfig object - was it specified in CoreConfig.js?`);
        }
    };

    IgeLoader.prototype.clientConfigReady = function () {
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
