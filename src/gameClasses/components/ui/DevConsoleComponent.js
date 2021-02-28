let DevConsoleComponent = IgeEntity.extend({
    classId: `DevConsole`,
    componentId: `ad`,

    init: function () {
        let devDiv = $(`#dev-console-table`);

        // graphs div accordion handle
        devDiv.append(`<div class="col-sm-12 my-2"><div id="graphs-div-accordion" class="px-2 py-1">Graphs</div></div>`);

        let graphsDiv = $(`<div id="graphs-div"></div>`);

        if (mode != `sandbox`) {
            let canvasDiv = $(`<div class="col-sm-12 mb-2"></div>`);

            canvasDiv.append(`<h6>Canvas:</h6>`);

            statsPanels.fps = new Stats();
            statsPanels.fps.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.fps.domElement.style.cssText = `position:relative;display:inline-block;`;
            canvasDiv.append(statsPanels.fps.dom);

            statsPanels.ms = new Stats();
            statsPanels.ms.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.ms.domElement.style.cssText = `position:relative;display:inline-block;`;
            canvasDiv.append(statsPanels.ms.dom);

            graphsDiv.append(canvasDiv);

            let engineDiv = $(`<div class="col-sm-12 mb-2"></div>`);
            engineDiv.append(`<h6>Engine:</h6>`);

            statsPanels.igefps = new Stats();
            statsPanels.igefps.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.igefps.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.igefps._igefpsPanel = statsPanels.igefps.addPanel(new Stats.Panel(`fps`, `#ff8`, `#221`));
            engineDiv.append(statsPanels.igefps.dom);

            statsPanels.igedpf = new Stats();
            statsPanels.igedpf.showPanel(3); // 0: dpf, 1: ms, 2: mb, 3+: custom
            statsPanels.igedpf.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.igedpf._igedpfPanel = statsPanels.igedpf.addPanel(new Stats.Panel(`dpf`, `#ff8`, `#221`));
            engineDiv.append(statsPanels.igedpf.dom);

            igeConfig.debug._timing = true;

            statsPanels.igeut = new Stats();
            statsPanels.igeut.showPanel(3); // 0: ut, 1: ms, 2: mb, 3+: custom
            statsPanels.igeut.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.igeut._igeutPanel = statsPanels.igeut.addPanel(new Stats.Panel(`ut`, `#ff8`, `#221`));
            engineDiv.append(statsPanels.igeut.dom);

            statsPanels.igert = new Stats();
            statsPanels.igert.showPanel(3); // 0: rt, 1: ms, 2: mb, 3+: custom
            statsPanels.igert.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.igert._igertPanel = statsPanels.igert.addPanel(new Stats.Panel(`rt`, `#ff8`, `#221`));
            engineDiv.append(statsPanels.igert.dom);

            statsPanels.igett = new Stats();
            statsPanels.igett.showPanel(3); // 0: tt, 1: ms, 2: mb, 3+: custom
            statsPanels.igett.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.igett._igettPanel = statsPanels.igett.addPanel(new Stats.Panel(`tt`, `#ff8`, `#221`));
            engineDiv.append(statsPanels.igett.dom);

            // GS Div
            let GSDiv = $(`<div class="col-sm-12 mb-2"></div>`);

            GSDiv.append(`<h6>GS:</h6>`);

            statsPanels.serverCpuUser = new Stats();
            statsPanels.serverCpuUser.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.serverCpuUser.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.serverCpuUser._serverCpuUserPanel = statsPanels.serverCpuUser.addPanel(new Stats.Panel(`CpuUser`, `#ff8`, `#221`));
            GSDiv.append(statsPanels.serverCpuUser.dom);

            statsPanels.serverCpuSystem = new Stats();
            statsPanels.serverCpuSystem.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.serverCpuSystem.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.serverCpuSystem._serverCpuSystemPanel = statsPanels.serverCpuSystem.addPanel(new Stats.Panel(`CpuSys`, `#ff8`, `#221`));
            GSDiv.append(statsPanels.serverCpuSystem.dom);

            graphsDiv.append(GSDiv);

            // Connection div
            let connectionDiv = $(`<div class="col-sm-12 mb-2"></div>`);

            connectionDiv.append(`<h6>Connection:</h6>`);

            statsPanels.received = new Stats();
            statsPanels.received.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.received.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.received._receivedPanel = statsPanels.received.addPanel(new Stats.Panel(`B/s↓`, `#ff8`, `#221`));
            connectionDiv.append(statsPanels.received.dom);

            statsPanels.sent = new Stats();
            statsPanels.sent.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.sent.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.sent._sentPanel = statsPanels.sent.addPanel(new Stats.Panel(`B/s↑`, `#f8f`, `#212`));
            connectionDiv.append(statsPanels.sent.dom);

            statsPanels.bandwidth = new Stats();
            statsPanels.bandwidth.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.bandwidth.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.bandwidth._bandwidthPanel = statsPanels.bandwidth.addPanel(new Stats.Panel(`kB`, `#f88`, `#221`));
            connectionDiv.append(statsPanels.bandwidth.dom);

            statsPanels.latency = new Stats();
            statsPanels.latency.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.latency.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.latency._latencyPanel = statsPanels.latency.addPanel(new Stats.Panel(`L(ms)`, `#88f`, `#221`));
            connectionDiv.append(statsPanels.latency.dom);

            statsPanels.clock = new Stats();
            statsPanels.clock.showPanel(3); // 0: fps, 1: ms, 2: mb, 3+: custom
            statsPanels.clock.domElement.style.cssText = `position:relative;display:inline-block;`;
            statsPanels.clock._clockPanel = statsPanels.clock.addPanel(new Stats.Panel(`s`, `#eee`, `#221`));
            statsPanels.clock._started = new Date();
            connectionDiv.append(statsPanels.clock.dom);

            setInterval(() => {
                let now = new Date();
                let elapsed = (now - statsPanels.clock._started) * 0.001;
                statsPanels.clock._clockPanel.update(elapsed, 120);
                statsPanels.igefps._igefpsPanel.update(ige._renderFPS, 60);
                statsPanels.igedpf._igedpfPanel.update(ige._dpf, 1000);
                statsPanels.igeut._igeutPanel.update(ige._updateTime, 100);
                statsPanels.igert._igertPanel.update(ige._renderTime, 100);
                statsPanels.igett._igettPanel.update(ige._tickTime, 100);

                // console.log(ige.physicsTickCount, ige.unitBehaviourCount)
                ige.physicsTickCount = 0;
                ige.unitBehaviourCount = 0;
            }, 1000);

            graphsDiv.append(connectionDiv);

            devDiv.append(graphsDiv);

            // tuning div accordion handle
            devDiv.append(`<div class="col-sm-12 my-2"><div id="tuning-div-accordion" class="px-2 py-1">Tuning</div></div>`);

            // Tuning Div
            let tuningDiv = $(`<div id="tuning-div" class="col-sm-12 mb-4"></div>`);

            ige.client.renderLatencyMs = ige.game.data.settings.renderlatency || 50;

            ige.client.inputDelay = 0;
            // ige.client.streamSendInterval = 15;
            let gui = new dat.GUI({ autoPlace: false, width: 400 });
            // var controllerLatency = gui.add(ige.client, 'streamSendInterval', 15, 1000);
            // controllerLatency.onChange(function (value) {
            //     // Fires on every change, drag, keypress, etc.
            //     value = parseInt(value);
            //     //console.log(value, ' ms');
            //     ige.network.send("setStreamSendInterval", { "interval": value });
            // });

            ige.client.controllerRenderLatency = gui.add(ige.client, `renderLatencyMs`, 0, 1000);
            ige.client.controllerRenderLatency.onChange((value) => {
                // Fires on every change, drag, keypress, etc.
                value = parseInt(value);
                // console.log(value, ' ms');
                ige.network.stream.renderLatency(value);
                ige.client.renderLatencyMs = value;
            });

            let controllerExtrapolation = gui.add(ige.client, `extrapolation`);
            let controllerResolution = gui.add(ige.client, `resolution`, { Auto: 0, "320x240": 320, "640x480": 640, "800x600": 800, "1024x768": 1024, "1280x720": 1280, "1920x1080": 1920 });
            controllerResolution.onChange((value) => {
                if (value == 0) {
                    ige._autoSize = true;
                } else {
                    ige._autoSize = false;
                }
                if (value > 0) {
                    $(`#igeFrontBuffer`).attr(`width`, value);
                    let height = value / 4 * 3;
                    if (value == 1280 || value == 1920) height = value / 16 * 9;
                    $(`#igeFrontBuffer`).attr(`height`, height);
                }
                ige._resizeEvent();
            });
            let controllerScaleMode = gui.add(ige.client, `scaleMode`, { None: 0, Fit: 1, Stretch: 3 });
            controllerScaleMode.onChange((value) => {
                ige._resizeEvent();
            });

            let controllerClientSideInputDelay = gui.add(ige.client, `inputDelay`, 0, 1000);
            controllerClientSideInputDelay.onChange((value) => {

            });

            let f1 = gui.addFolder(`Render control`);

            let controllerMapRenderEnabled = f1.add(ige.client, `mapRenderEnabled`);
            controllerMapRenderEnabled.onChange((value) => {
                // console.log('mapRenderEnabled:',value);
            });

            let controllerUnitRenderEnabled = f1.add(ige.client, `unitRenderEnabled`);
            controllerUnitRenderEnabled.onChange((value) => {
                // console.log('unitRenderEnabled:',value);
            });

            let controllerItemRenderEnabled = f1.add(ige.client, `itemRenderEnabled`);
            controllerItemRenderEnabled.onChange((value) => {
                // console.log('itemRenderEnabled:',value);
            });

            let controllerUiEntityRenderEnabled = f1.add(ige.client, `uiEntityRenderEnabled`);

            let controllerMiniMapEnabled = f1.add(ige.client, `miniMapEnabled`);
            controllerMiniMapEnabled.onChange((value) => {
                // console.log('miniMapEnabled:',value);
            });

            let controllerClearEveryFrame = f1.add(ige.client, `clearEveryFrame`);

            let controllerViewportClippingEnabled = f1.add(ige.client, `viewportClippingEnabled`);

            let controllerCtxAlphaEnabled = f1.add(ige.client, `ctxAlphaEnabled`);
            controllerCtxAlphaEnabled.onChange((value) => {
                // console.log('ctxAlphaEnabled:',value);
                ige.getCtx();
            });

            tuningDiv.append(gui.domElement);

            devDiv.append(tuningDiv);

            devDiv.append(`<div class="col-sm-12 my-2"><div id="variables-div-accordion" class="px-2 py-1">Variables</div></div>`);
            devDiv.append(`<div id="variables-div"></div>`);
        }

        $(`#graphs-div-accordion`).click(() => {
            $(`#graphs-div`).slideToggle(`slow`);
        });

        $(`#tuning-div-accordion`).click(() => {
            $(`#tuning-div`).slideToggle(`slow`);
        });

        $(`#variables-div-accordion`).click(() => {
            $(`#variables-div`).slideToggle(`slow`);
        });
    }
});

if (typeof (module) !== `undefined` && typeof (module.exports) !== `undefined`) { module.exports = DevConsoleComponent; }
