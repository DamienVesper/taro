let CrashColliders = require(`crash-colliders`);

let cc = new CrashColliders({});

let crash = {};
crash.b2Vec2 = cc.Vector;
crash.Box = cc.Box;
crash.createBody = cc.createBody;
crash.onCollision = cc.onCollision;
