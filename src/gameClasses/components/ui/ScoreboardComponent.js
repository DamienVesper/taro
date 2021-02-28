let ScoreboardComponent = IgeEntity.extend({
    classId: `ScoreboardComponent`,
    componentId: `scoreboard`,

    init: function () {
        let self = this;
        // self.scoreAttributeId = ige.game.data.settings.scoreBoard
        // console.log("ige.game.data.settings", ige.game.data.settings)
        self.scoreAttributeId = ige.game.data.settings.scoreAttributeId;
        self._hidden = false;

        self.setUI();
    },

    setUI: function () {
        if (ige.mobileControls.isMobile) {
            $(`#scoreboard-header`).addClass(`small`);
            $(`#scoreboard`).addClass(`small`);
        }
        else {
            $(`#scoreboard-header`).addClass(`h5`);
            $(`#scoreboard`).addClass(`h6`);
            $(`#leaderboard`)
                .addClass(`h3`)
                .removeClass(`d-none`);
        }

        $(() => {
            $.contextMenu({
                selector: `.scoreboard-user-entry`,
                build: function ($trigger) {
                    let userData = $trigger.data();
                    let myPlayer = ige.client.myPlayer;

                    if (!myPlayer || !myPlayer._stats) {
                        return;
                    }

                    let userId = myPlayer._stats.userId;
                    let mutedUsers = myPlayer._stats.mutedUsers;
                    if (userId === userData.userId) {
                        // user cannot perform action on his/her own player
                        return;
                    }

                    ige.scoreboard.selectedUser = userData;

                    let index = mutedUsers.indexOf(ige.scoreboard.selectedUser.userId);

                    return {
                        callback: function (key) {
                            switch (key) {
                                case `unmute`: {
                                    mutedUsers.splice(index, 1);
                                    $.ajax({
                                        url: `/api/user/toggle-mute/${ige.scoreboard.selectedUser.userId}`,
                                        type: `POST`,
                                        success: function (data) {
                                            console.log(data);											// alert('request sent');
                                        }
                                    });
                                    break;
                                }
                                case `mute`: {
                                    mutedUsers.push(ige.scoreboard.selectedUser.userId);
                                    $.ajax({
                                        url: `/api/user/toggle-mute/${ige.scoreboard.selectedUser.userId}`,
                                        type: `POST`,
                                        success: function (data) {
                                            console.log(data);											// alert('request sent');
                                        }
                                    });
                                    break;
                                }
                                case `addFriend`: {
                                    $.ajax({
                                        url: `/api/user/request/${ige.scoreboard.selectedUser.userId}`,
                                        type: `POST`,
                                        success: function (data) {
                                            alert(`request sent`);
                                        }
                                    });
                                    break;
                                }
                            }
                        },
                        items: {
                            addFriend: {
                                name: `Add Friend`
                            },
                            separator: { type: `cm_separator` },
                            unmute: {
                                name: `Unmute ${ige.scoreboard.selectedUser.userName}`,
                                visible: index > -1
                            },
                            mute: {
                                name: `Mute ${ige.scoreboard.selectedUser.userName}`,
                                visible: index === -1,
                                className: `context-menu-item context-menu-hover context-menu-danger`
                            }
                        }
                    };
                }
            });
        });
    },

    convertNumbersToKMB: function (labelValue) {
        if (ige.game.data.settings.prettifyingScoreboard) {
            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e+9

                ? `${(Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)}B`
            // Six Zeroes for Millions
                : Math.abs(Number(labelValue)) >= 1.0e+6

                    ? `${(Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)}M`
                // Three Zeroes for Thousands
                    : Math.abs(Number(labelValue)) >= 1.0e+3

                        ? `${(Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)}K`

                        : Math.abs(Number(labelValue));
        }
        else {
            return labelValue;
        }
    },
    update: function () {
        let self = this;
        let DEFAULT_COLOR = `white`;

        if (ige.isClient) {
            let scoreboard = ``;
            let sortedScores = [];
            let players = ige.$$(`player`);
            let topPlayersToShow = ige.mobileControls.isMobile ? 3 : 10;

            players.forEach((player) => {
                if (player._stats && player._stats.clientId) // only display human players on scoreboard
                {
                    let clientId = player._stats.clientId;
                    let score = 0;
                    if (self.scoreAttributeId && player._stats.attributes && player._stats.attributes[self.scoreAttributeId]) {
                        let playerAttribute = player._stats.attributes[self.scoreAttributeId];
                        score = playerAttribute.value;
                    }

                    sortedScores.push({
                        key: clientId,
                        value: parseInt(score)
                    });
                }
            });

            sortedScores.sort((a, b) => {
                return a.value - b.value;
            });

            for (let i = sortedScores.length - 1; i >= 0; i--) {
                let clientId = sortedScores[i].key;
                let player = ige.game.getPlayerByClientId(clientId);
                let defaultFontWeight = 500;
                if (player) {
                    let color = null; // color to indicate human, animal, or my player on scoreboard

                    let playerType = ige.game.getAsset(`playerTypes`, player._stats.playerTypeId);

                    if (playerType && playerType.color) {
                        color = playerType.color;
                    }
                    if (player._stats.clientId == ige.network.id()) {
                        defaultFontWeight = 800;
                        color = `#99FF00`;
                    }

                    let readableName = player._stats.name || ``;

                    readableName = readableName.replace(/</g, `&lt;`);
                    readableName = readableName.replace(/>/g, `&gt;`);

                    color = color || DEFAULT_COLOR;
                    scoreboard += `<div data-user-name='${player._stats.name}' data-user-id='${player._stats.userId}' class='cursor-pointer scoreboard-user-entry' style='color: ${color};font-weight:${defaultFontWeight}'>${readableName} <small><span>${self.convertNumbersToKMB(sortedScores[i].value)}</span></small></div>`;
                }
            }

            ige.client.clientCount = sortedScores.length;

            $(`#player-count`).html(players.length);

            if (self._hidden) {
                $(`#scoreboard`).html(``);
                $(`#leaderboard-toggle`).html(`&nbsp;<i class="far fa-caret-square-down" aria-hidden="true" onclick="ige.scoreboard.toggleScores()" style="cursor:pointer;"></i>`);
            } else {
                $(`#scoreboard`).html(scoreboard);
                $(`#leaderboard-toggle`).html(`&nbsp;<i class="far fa-caret-square-up" aria-hidden="true" onclick="ige.scoreboard.toggleScores()" style="cursor:pointer;"></i>`);
            }
        }
    },

    hideScores: function () {
        this._hidden = true;
    },

    showScores: function () {
        this._hidden = false;
    },

    toggleScores: function () {
        this._hidden = !this._hidden;
    }

});

if (typeof (module) !== `undefined` && typeof (module.exports) !== `undefined`) { module.exports = ScoreboardComponent; }
