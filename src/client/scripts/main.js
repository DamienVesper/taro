const igeRoot = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === `localhost` ? `:8080` : ``}/engine/`;

$(document).ready(() => {
    const igeCoreConfig = require(`./config/core.js`);

    for (const file of igeCoreConfig.include) {
        const loadToClient = file[0].split(``).includes(`c`);

        if (loadToClient) {
            const script = $(`<script>`);

            script.attr(`src`, `${igeRoot}${file[2]}`);
            $(document.body).append(script);

            console.log(`Loaded script: ${file[1]}.js`);
        }
    }
});
