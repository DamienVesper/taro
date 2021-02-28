let shutdownMessages = [
    {
        checkpoint: 1,
        message: `2 hours`,
        timeMS: 120 * 60000
    },
    {
        checkpoint: 2,
        message: `1 hour`,
        timeMS: 60 * 60000
    },
    {
        checkpoint: 3,
        message: `30 minutes`,
        timeMS: 30 * 60000
    },
    {
        checkpoint: 4,
        message: `15 minutes`,
        timeMS: 15 * 60000
    },
    {
        checkpoint: 5,
        message: `5 minutes`,
        timeMS: 5 * 60000
    },
    {
        checkpoint: 6,
        message: `1 minute`,
        timeMS: 1 * 60000
    }
];

let TimerComponent = IgeEntity.extend({
    classId: `TimerComponent`,
    componentId: `timer`,

    init: function () {
        let self = this;

        if (ige.isServer) {
            self.emptyTimeLimit = self.getTimeLimit();
            self.startedAt = new Date(ige.server.startedOn);
            console.log(`initialized timer component`, self.startedAt);
            self.now = self.serverEmptySince = self.startedAt;
        }
    },

    getTimeLimit: function () {
        let timeLimitMin = 5;
        // const totalPlayCount = ige.server.totalPlayCount || 0;

        // // add 1 minute for every 2000 total play count
        // let extraMinutes = totalPlayCount / 2000;
        // extraMinutes = +extraMinutes.toFixed(0);

        // timeLimitMin += extraMinutes;

        return timeLimitMin * 60000;
    },

    getLifeSpan: function () {
        let maxLifeSpan = 6 * 60 * 60 * 1000;
        let lifeSpan = ige.server.lifeSpan;

        if (lifeSpan > maxLifeSpan) {
            lifeSpan = maxLifeSpan;
        }

        return lifeSpan;
    },

    startGameClock: function () {
        let self = this;

        console.log(new Date(), `gameClock started`);
        self.shutdownMessageCheckpoint = -1;

        let everySecond = setInterval(() => {
            self.now = Date.now();
            if (ige.isServer) {
                self.lastTick = self.now;
                // var shouldLog = ige.server.logTriggers && ige.server.logTriggers.timerLogs;
                ige.trigger.fire(`secondTick`);

                // kill tier 1 servers that has been empty for over 15 minutes
                // var playerCount = ige.$$('player').filter(function (player) { return player._stats.controlledBy == 'human' }).length;

                // if (playerCount <= 0) {
                // 	if (self.now - self.serverEmptySince > self.emptyTimeLimit) {
                // 		ige.server.kill("game's been empty for too long (15 min)");
                // 	}
                // }
                // else {
                // 	self.serverEmptySince = self.now;
                // }

                let lifeSpan = self.getLifeSpan();

                // if server's lifeSpan is over, kill it (e.g. kill server after 5 hours)
                let age = self.now - self.startedAt;

                let messageToBroadcast = shutdownMessages.find((messageDetails) => {
                    return age > lifeSpan - messageDetails.timeMS &&
						self.shutdownMessageCheckpoint < messageDetails.checkpoint;
                });

                if (messageToBroadcast) {
                    let message = `shutting down server in ${messageToBroadcast.message}`;
                    self.shutdownMessageCheckpoint = messageToBroadcast.checkpoint;

                    ige.chat.sendToRoom(`1`, message, undefined, undefined);
                }

                // if (shouldLog) {
                // 	console.log(self.now, self.startedAt, age, lifeSpan, age > lifeSpan);
                // }
                // if (age > lifeSpan) {
                // 	ige.server.kill("server lifespan expired");
                // }
            }
            else if (ige.isClient) {
                ige.scoreboard.update();
            }
        }, 1000);
    }
});

if (typeof (module) !== `undefined` && typeof (module.exports) !== `undefined`) { module.exports = TimerComponent; }
