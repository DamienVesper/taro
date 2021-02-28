
(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { let c = typeof require === `function` && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); let a = new Error(`Cannot find module '${i}'`); throw a.code = `MODULE_NOT_FOUND`, a; } let p = n[i] = { exports: {} }; e[i][0].call(p.exports, (r) => { let n = e[i][1][r]; return o(n || r); }, p, p.exports, r, e, n, t); } return n[i].exports; } for (var u = typeof require === `function` && require, i = 0; i < t.length; i++)o(t[i]); return o; } return r; })()({
    1: [
        function (require, module, exports) {
            'use strict';

            PIXI.extras.cull = {
                Simple: require(`./simple`),
                SpatialHash: require(`./spatial-hash`)
            };
        }, { "./simple": 2, "./spatial-hash": 3 }
    ],
    2: [
        function (require, module, exports) {
            'use strict';

            let _createClass = (function () { function defineProperties (target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (`value` in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

            function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(`Cannot call a class as a function`); } }

            // pixi-cull.SpatialHash
            // Copyright 2018 YOPEY YOPEY LLC
            // David Figatner
            // MIT License

            let Simple = (function () {
                /**
         * creates a simple cull
         * @param {object} [options]
         * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
         * @param {boolean} [options.calculatePIXI=true] calculate pixi.js bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
         * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
         * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }; not needed if options.calculatePIXI=true
         */
                function Simple (options) {
                    _classCallCheck(this, Simple);

                    options = options || {};
                    this.visible = options.visible || `visible`;
                    this.calculatePIXI = typeof options.calculatePIXI !== `undefined` ? options.calculatePIXI : true;
                    this.dirtyTest = typeof options.dirtyTest !== `undefined` ? options.dirtyTest : true;
                    this.renderable = options.visible || `renderable`;
                    this.AABB = options.AABB || `AABB`;
                    this.dirty = options.dirty || `dirty`;
                    this.lists = [[]];
                }

                /**
         * add an array of objects to be culled
         * @param {Array} array
         * @param {boolean} [staticObject] set to true if the object's position/size does not change
         * @return {Array} array
         */

                _createClass(Simple, [
                    {
                        key: `addList`,
                        value: function addList (array, staticObject) {
                            this.lists.push(array);
                            if (staticObject) {
                                array.staticObject = true;
                            }
                            if (this.calculatePIXI && this.dirtyTest) {
                                let _iteratorNormalCompletion = true;
                                let _didIteratorError = false;
                                let _iteratorError;

                                try {
                                    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        let object = _step.value;

                                        this.updateObject(object);
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return) {
                                            _iterator.return();
                                        }
                                    } finally {
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                            }
                            return array;
                        }

                        /**
             * remove an array added by addList()
             * @param {Array} array
             * @return {Array} array
             */

                    }, {
                        key: `removeList`,
                        value: function removeList (array) {
                            this.lists.splice(this.lists.indexOf(array), 1);
                            return array;
                        }

                        /**
             * add an object to be culled
             * @param {*} object
             * @param {boolean} [staticObject] set to true if the object's position/size does not change
             * @return {*} object
             */

                    }, {
                        key: `add`,
                        value: function add (object, staticObject) {
                            if (staticObject) {
                                object.staticObject = true;
                            }
                            if (this.calculatePIXI && (this.dirtyTest || staticObject)) {
                                this.updateObject(object);
                            }
                            this.lists[0].push(object);
                            return object;
                        }

                        /**
             * remove an object added by add()
             * @param {*} object
             * @return {*} object
             */

                    }, {
                        key: `remove`,
                        value: function remove (object) {
                            this.lists[0].splice(this.lists[0].indexOf(object), 1);
                            return object;
                        }

                        /**
             * cull the items in the list by setting visible parameter
             * @param {object} bounds
             * @param {number} bounds.x
             * @param {number} bounds.y
             * @param {number} bounds.width
             * @param {number} bounds.height
             * @param {boolean} [skipUpdate] skip updating the AABB bounding box of all objects
             */

                    }, {
                        key: `cull`,
                        value: function cull (bounds, skipUpdate) {
                            if (this.calculatePIXI && !skipUpdate) {
                                this.updateObjects();
                            }
                            let _iteratorNormalCompletion2 = true;
                            let _didIteratorError2 = false;
                            let _iteratorError2;

                            try {
                                for (var _iterator2 = this.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    let list = _step2.value;
                                    let _iteratorNormalCompletion3 = true;
                                    let _didIteratorError3 = false;
                                    let _iteratorError3;

                                    try {
                                        for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                            let object = _step3.value;
                                            try {
                                                if (!object.tileMap) {
                                                    let box = object[this.AABB];
                                                    object[this.visible] = box.x + box.width > bounds.x && box.x < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y < bounds.y + bounds.height;
                                                    object[this.renderable] = object[this.visible];
                                                }
                                            }
                                            catch (e) {
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError3 = true;
                                        _iteratorError3 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                                _iterator3.return();
                                            }
                                        } finally {
                                            if (_didIteratorError3) {
                                                throw _iteratorError3;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }

                        /**
             * update the AABB for all objects
             * automatically called from update() when calculatePIXI=true and skipUpdate=false
             */

                    }, {
                        key: `updateObjects`,
                        value: function updateObjects () {
                            if (this.dirtyTest) {
                                let _iteratorNormalCompletion4 = true;
                                let _didIteratorError4 = false;
                                let _iteratorError4;

                                try {
                                    for (var _iterator4 = this.lists[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                        let list = _step4.value;

                                        if (!list.staticObject) {
                                            let _iteratorNormalCompletion5 = true;
                                            let _didIteratorError5 = false;
                                            let _iteratorError5;

                                            try {
                                                for (var _iterator5 = list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                                    let object = _step5.value;

                                                    if (!object.staticObject && object[this.dirty]) {
                                                        this.updateObject(object);
                                                        object[this.dirty] = false;
                                                    }
                                                }
                                            } catch (err) {
                                                _didIteratorError5 = true;
                                                _iteratorError5 = err;
                                            } finally {
                                                try {
                                                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                                        _iterator5.return();
                                                    }
                                                } finally {
                                                    if (_didIteratorError5) {
                                                        throw _iteratorError5;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError4 = true;
                                    _iteratorError4 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                            _iterator4.return();
                                        }
                                    } finally {
                                        if (_didIteratorError4) {
                                            throw _iteratorError4;
                                        }
                                    }
                                }
                            } else {
                                let _iteratorNormalCompletion6 = true;
                                let _didIteratorError6 = false;
                                let _iteratorError6;

                                try {
                                    for (var _iterator6 = this.lists[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                        let _list = _step6.value;

                                        if (!_list.staticObject) {
                                            let _iteratorNormalCompletion7 = true;
                                            let _didIteratorError7 = false;
                                            let _iteratorError7;

                                            try {
                                                for (var _iterator7 = _list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                                    let _object = _step7.value;

                                                    if (!_object.staticObject) {
                                                        this.updateObject(_object);
                                                    }
                                                }
                                            } catch (err) {
                                                _didIteratorError7 = true;
                                                _iteratorError7 = err;
                                            } finally {
                                                try {
                                                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                                        _iterator7.return();
                                                    }
                                                } finally {
                                                    if (_didIteratorError7) {
                                                        throw _iteratorError7;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError6 = true;
                                    _iteratorError6 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                            _iterator6.return();
                                        }
                                    } finally {
                                        if (_didIteratorError6) {
                                            throw _iteratorError6;
                                        }
                                    }
                                }
                            }
                        }

                        /**
             * update the has of an object
             * automatically called from updateObjects()
             * @param {*} object
             */

                    }, {
                        key: `updateObject`,
                        value: function updateObject (object) {
                            let box = object.getLocalBounds();
                            object[this.AABB] = object[this.AABB] || {};
                            object[this.AABB].x = object.x + (box.x - object.pivot.x) * object.scale.x;
                            object[this.AABB].y = object.y + (box.y - object.pivot.y) * object.scale.y;
                            object[this.AABB].width = box.width * object.scale.x;
                            object[this.AABB].height = box.height * object.scale.y;
                        }

                        /**
             * returns an array of objects contained within bounding box
             * @param {object} boudns bounding box to search
             * @param {number} bounds.x
             * @param {number} bounds.y
             * @param {number} bounds.width
             * @param {number} bounds.height
             * @return {object[]} search results
             */

                    }, {
                        key: `query`,
                        value: function query (bounds) {
                            let results = [];
                            let _iteratorNormalCompletion8 = true;
                            let _didIteratorError8 = false;
                            let _iteratorError8;

                            try {
                                for (var _iterator8 = this.lists[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                    let list = _step8.value;
                                    let _iteratorNormalCompletion9 = true;
                                    let _didIteratorError9 = false;
                                    let _iteratorError9;

                                    try {
                                        for (var _iterator9 = list[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                            let object = _step9.value;

                                            let box = object[this.AABB];
                                            if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height) {
                                                results.push(object);
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError9 = true;
                                        _iteratorError9 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                                _iterator9.return();
                                            }
                                        } finally {
                                            if (_didIteratorError9) {
                                                throw _iteratorError9;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError8 = true;
                                _iteratorError8 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                        _iterator8.return();
                                    }
                                } finally {
                                    if (_didIteratorError8) {
                                        throw _iteratorError8;
                                    }
                                }
                            }

                            return results;
                        }

                        /**
             * iterates through objects contained within bounding box
             * stops iterating if the callback returns true
             * @param {object} bounds bounding box to search
             * @param {number} bounds.x
             * @param {number} bounds.y
             * @param {number} bounds.width
             * @param {number} bounds.height
             * @param {function} callback
             * @return {boolean} true if callback returned early
             */

                    }, {
                        key: `queryCallback`,
                        value: function queryCallback (bounds, callback) {
                            let _iteratorNormalCompletion10 = true;
                            let _didIteratorError10 = false;
                            let _iteratorError10;

                            try {
                                for (var _iterator10 = this.lists[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                    let list = _step10.value;
                                    let _iteratorNormalCompletion11 = true;
                                    let _didIteratorError11 = false;
                                    let _iteratorError11;

                                    try {
                                        for (var _iterator11 = list[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                            let object = _step11.value;

                                            let box = object[this.AABB];
                                            if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height) {
                                                if (callback(object)) {
                                                    return true;
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError11 = true;
                                        _iteratorError11 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                                _iterator11.return();
                                            }
                                        } finally {
                                            if (_didIteratorError11) {
                                                throw _iteratorError11;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError10 = true;
                                _iteratorError10 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                        _iterator10.return();
                                    }
                                } finally {
                                    if (_didIteratorError10) {
                                        throw _iteratorError10;
                                    }
                                }
                            }

                            return false;
                        }

                        /**
             * get stats (only updated after update() is called)
             * @return {SimpleStats}
             */

                    }, {
                        key: `stats`,
                        value: function stats () {
                            let visible = 0;
                            let count = 0;
                            let _iteratorNormalCompletion12 = true;
                            let _didIteratorError12 = false;
                            let _iteratorError12;

                            try {
                                for (var _iterator12 = this.lists[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                                    let list = _step12.value;

                                    list.forEach((object) => {
                                        visible += object.visible ? 1 : 0;
                                        count++;
                                    });
                                }
                            } catch (err) {
                                _didIteratorError12 = true;
                                _iteratorError12 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                        _iterator12.return();
                                    }
                                } finally {
                                    if (_didIteratorError12) {
                                        throw _iteratorError12;
                                    }
                                }
                            }

                            return { total: count, visible: visible, culled: count - visible };
                        }
                    }
                ]);

                return Simple;
            }());

            /**
     * @typedef {object} SimpleStats
     * @property {number} total
     * @property {number} visible
     * @property {number} culled
     */

            module.exports = Simple;
        }, {}
    ],
    3: [
        function (require, module, exports) {
            'use strict';

            let _createClass = (function () { function defineProperties (target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (`value` in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

            function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(`Cannot call a class as a function`); } }

            // Copyright 2018 YOPEY YOPEY LLC
            // David Figatner
            // MIT License

            let SpatialHash = (function () {
                /**
         * creates a spatial-hash cull
         * @param {object} [options]
         * @param {number} [options.size=1000] cell size used to create hash (xSize = ySize)
         * @param {number} [options.xSize] horizontal cell size
         * @param {number} [options.ySize] vertical cell size
         * @param {boolean} [options.calculatePIXI=true] calculate bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
         * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
         * @param {boolean} [options.simpleTest=true] iterate through visible buckets to check for bounds
         * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
         * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }
         * @param {string} [options.spatial=spatial] object property that holds object's hash list
         * @param {string} [options.dirty=dirty] object property for dirtyTest
         */
                function SpatialHash (options) {
                    _classCallCheck(this, SpatialHash);

                    options = options || {};
                    this.xSize = options.xSize || options.size || 1000;
                    this.ySize = options.ySize || options.size || 1000;
                    this.AABB = options.type || `AABB`;
                    this.spatial = options.spatial || `spatial`;
                    this.calculatePIXI = typeof options.calculatePIXI !== `undefined` ? options.calculatePIXI : true;
                    this.visibleText = typeof options.visibleTest !== `undefined` ? options.visibleTest : true;
                    this.simpleTest = typeof options.simpleTest !== `undefined` ? options.simpleTest : true;
                    this.dirtyTest = typeof options.dirtyTest !== `undefined` ? options.dirtyTest : true;
                    this.visible = options.visible || `visible`;
                    this.renderable = options.visible || `renderable`;
                    this.dirty = options.dirty || `dirty`;
                    this.width = this.height = 0;
                    this.hash = {};
                    this.objects = [];
                    this.containers = [];
                }

                /**
         * add an object to be culled
         * side effect: adds object.spatialHashes to track existing hashes
         * @param {*} object
         * @param {boolean} [staticObject] set to true if the object's position/size does not change
         * @return {*} object
         */

                _createClass(SpatialHash, [
                    {
                        key: `add`,
                        value: function add (object, staticObject) {
                            object[this.spatial] = { hashes: [] };
                            if (this.calculatePIXI && this.dirtyTest) {
                                object[this.dirty] = true;
                            }
                            if (staticObject) {
                                object.staticObject = true;
                            }
                            this.updateObject(object);
                            this.containers[0].push(object);
                        }

                        /**
             * remove an object added by add()
             * @param {*} object
             * @return {*} object
             */

                    }, {
                        key: `remove`,
                        value: function remove (object) {
                            this.containers[0].splice(this.list[0].indexOf(object), 1);
                            this.removeFromHash(object);
                            return object;
                        }

                        /**
             * add an array of objects to be culled
             * @param {PIXI.Container} container
             * @param {boolean} [staticObject] set to true if the objects in the container's position/size do not change
             * note: this only works with pixi v5.0.0rc2+ because it relies on the new container events childAdded and childRemoved
             */

                    }, {
                        key: `addContainer`,
                        value: function addContainer (container, staticObject) {
                            let added = function (object) {
                                object[this.spatial] = { hashes: [] };
                                this.updateObject(object);
                            }.bind(this);

                            let removed = function (object) {
                                this.removeFromHash(object);
                            }.bind(this);

                            let _iteratorNormalCompletion = true;
                            let _didIteratorError = false;
                            let _iteratorError;

                            try {
                                for (var _iterator = container.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    let object = _step.value;

                                    object[this.spatial] = { hashes: [] };
                                    this.updateObject(object);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            container.cull = {};
                            this.containers.push(container);
                            container.on(`childAdded`, added);
                            container.on(`childRemoved`, removed);
                            container.cull.added = added;
                            container.cull.removed = removed;
                            if (staticObject) {
                                container.cull.static = true;
                            }
                        }

                        /**
             * remove an array added by addContainer()
             * @param {PIXI.Container} container
             * @return {PIXI.Container} container
             */

                    }, {
                        key: `removeContainer`,
                        value: function removeContainer (container) {
                            let _this = this;

                            this.containers.splice(this.containers.indexOf(container), 1);
                            container.children.forEach((object) => {
                                return _this.removeFromHash(object);
                            });
                            container.off(`added`, container.cull.added);
                            container.off(`removed`, container.cull.removed);
                            delete container.cull;
                            return container;
                        }

                        /**
             * update the hashes and cull the items in the list
             * @param {AABB} AABB
             * @param {boolean} [skipUpdate] skip updating the hashes of all objects
             * @return {number} number of buckets in results
             */

                    }, {
                        key: `cull`,
                        value: function cull (AABB, skipUpdate) {
                            let _this2 = this;

                            if (!skipUpdate) {
                                this.updateObjects();
                            }
                            this.invisible();
                            let objects = this.query(AABB, this.simpleTest);
                            objects.forEach((object) => {
                                return object[_this2.visible] = true;
                            });
                            return this.lastBuckets;
                        }

                        /**
             * set all objects in hash to visible=false
             */

                    }, {
                        key: `invisible`,
                        value: function invisible () {
                            let _this3 = this;

                            let _iteratorNormalCompletion2 = true;
                            let _didIteratorError2 = false;
                            let _iteratorError2;

                            try {
                                for (var _iterator2 = this.containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    let container = _step2.value;

                                    container.children.forEach((object) => {
                                        return object[_this3.visible] = false;
                                    });
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }

                        /**
             * update the hashes for all objects
             * automatically called from update() when skipUpdate=false
             */

                    }, {
                        key: `updateObjects`,
                        value: function updateObjects () {
                            let _this4 = this;

                            if (this.dirtyTest) {
                                let _iteratorNormalCompletion3 = true;
                                let _didIteratorError3 = false;
                                let _iteratorError3;

                                try {
                                    for (var _iterator3 = this.objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        let object = _step3.value;

                                        if (object[this.dirty]) {
                                            this.updateObject(object);
                                            object[this.dirty] = false;
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError3 = true;
                                    _iteratorError3 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                            _iterator3.return();
                                        }
                                    } finally {
                                        if (_didIteratorError3) {
                                            throw _iteratorError3;
                                        }
                                    }
                                }

                                let _iteratorNormalCompletion4 = true;
                                let _didIteratorError4 = false;
                                let _iteratorError4;

                                try {
                                    for (var _iterator4 = this.containers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                        let container = _step4.value;
                                        let _iteratorNormalCompletion5 = true;
                                        let _didIteratorError5 = false;
                                        let _iteratorError5;

                                        try {
                                            for (var _iterator5 = container.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                                let _object = _step5.value;

                                                if (_object[this.dirty]) {
                                                    this.updateObject(_object);
                                                    _object[this.dirty] = false;
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError5 = true;
                                            _iteratorError5 = err;
                                        } finally {
                                            try {
                                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                                    _iterator5.return();
                                                }
                                            } finally {
                                                if (_didIteratorError5) {
                                                    throw _iteratorError5;
                                                }
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError4 = true;
                                    _iteratorError4 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                            _iterator4.return();
                                        }
                                    } finally {
                                        if (_didIteratorError4) {
                                            throw _iteratorError4;
                                        }
                                    }
                                }
                            } else {
                                let _iteratorNormalCompletion6 = true;
                                let _didIteratorError6 = false;
                                let _iteratorError6;

                                try {
                                    for (var _iterator6 = this.containers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                        let _container = _step6.value;

                                        if (!_container.cull.static) {
                                            _container.children.forEach((object) => {
                                                return _this4.updateObject(object);
                                            });
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError6 = true;
                                    _iteratorError6 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                            _iterator6.return();
                                        }
                                    } finally {
                                        if (_didIteratorError6) {
                                            throw _iteratorError6;
                                        }
                                    }
                                }
                            }
                        }

                        /**
             * update the has of an object
             * automatically called from updateObjects()
             * @param {*} object
             * @param {boolean} [force] force update for calculatePIXI
             */

                    }, {
                        key: `updateObject`,
                        value: function updateObject (object) {
                            let AABB = void 0;
                            if (this.calculatePIXI) {
                                let box = object.getLocalBounds();
                                AABB = object[this.AABB] = {
                                    x: object.x + (box.x - object.pivot.x) * object.scale.x,
                                    y: object.y + (box.y - object.pivot.y) * object.scale.y,
                                    width: box.width * object.scale.x,
                                    height: box.height * object.scale.y
                                };
                            } else {
                                AABB = object[this.AABB];
                            }

                            let spatial = object[this.spatial];
                            if (!spatial) {
                                spatial = object[this.spatial] = { hashes: [] };
                            }

                            let _getBounds = this.getBounds(AABB);
                            let xStart = _getBounds.xStart;
                            let yStart = _getBounds.yStart;
                            let xEnd = _getBounds.xEnd;
                            let yEnd = _getBounds.yEnd;

                            // only remove and insert if mapping has changed

                            if (spatial.xStart !== xStart || spatial.yStart !== yStart || spatial.xEnd !== xEnd || spatial.yEnd !== yEnd) {
                                if (spatial.hashes.length) {
                                    this.removeFromHash(object);
                                }
                                for (let y = yStart; y <= yEnd; y++) {
                                    for (let x = xStart; x <= xEnd; x++) {
                                        let key = `${x},${y}`;
                                        this.insert(object, key);
                                        spatial.hashes.push(key);
                                    }
                                }
                                spatial.xStart = xStart;
                                spatial.yStart = yStart;
                                spatial.xEnd = xEnd;
                                spatial.yEnd = yEnd;
                            }
                        }

                        /**
             * returns an array of buckets with >= minimum of objects in each bucket
             * @param {number} [minimum=1]
             * @return {array} array of buckets
             */

                    }, {
                        key: `getBuckets`,
                        value: function getBuckets () {
                            let minimum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                            let hashes = [];
                            for (let key in this.hash) {
                                let hash = this.hash[key];
                                if (hash.length >= minimum) {
                                    hashes.push(hash);
                                }
                            }
                            return hashes;
                        }

                        /**
             * gets hash bounds
             * @param {AABB} AABB
             * @return {Bounds}
             * @private
             */

                    }, {
                        key: `getBounds`,
                        value: function getBounds (AABB) {
                            let xStart = Math.floor(AABB.x / this.xSize);
                            let yStart = Math.floor(AABB.y / this.ySize);
                            let xEnd = Math.floor((AABB.x + AABB.width) / this.xSize);
                            let yEnd = Math.floor((AABB.y + AABB.height) / this.ySize);
                            return { xStart: xStart, yStart: yStart, xEnd: xEnd, yEnd: yEnd };
                        }

                        /**
             * insert object into the spatial hash
             * automatically called from updateObject()
             * @param {*} object
             * @param {string} key
             */

                    }, {
                        key: `insert`,
                        value: function insert (object, key) {
                            if (!this.hash[key]) {
                                this.hash[key] = [object];
                            } else {
                                this.hash[key].push(object);
                            }
                        }

                        /**
             * removes object from the hash table
             * should be called when removing an object
             * automatically called from updateObject()
             * @param {object} object
             */

                    }, {
                        key: `removeFromHash`,
                        value: function removeFromHash (object) {
                            let spatial = object[this.spatial];
                            while (spatial.hashes.length) {
                                let key = spatial.hashes.pop();
                                let list = this.hash[key];
                                list.splice(list.indexOf(object), 1);
                            }
                        }

                        /**
             * get all neighbors that share the same hash as object
             * @param {*} object in the spatial hash
             * @return {Array} of objects that are in the same hash as object
             */

                    }, {
                        key: `neighbors`,
                        value: function neighbors (object) {
                            let _this5 = this;

                            let results = [];
                            object[this.spatial].hashes.forEach((key) => {
                                return results = results.concat(_this5.hash[key]);
                            });
                            return results;
                        }

                        /**
             * returns an array of objects contained within bounding box
             * @param {AABB} AABB bounding box to search
             * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
             * @return {object[]} search results
             */

                    }, {
                        key: `query`,
                        value: function query (AABB, simpleTest) {
                            simpleTest = typeof simpleTest !== `undefined` ? simpleTest : true;
                            let buckets = 0;
                            let results = [];

                            let _getBounds2 = this.getBounds(AABB);
                            let xStart = _getBounds2.xStart;
                            let yStart = _getBounds2.yStart;
                            let xEnd = _getBounds2.xEnd;
                            let yEnd = _getBounds2.yEnd;

                            for (let y = yStart; y <= yEnd; y++) {
                                for (let x = xStart; x <= xEnd; x++) {
                                    let entry = this.hash[`${x},${y}`];
                                    if (entry) {
                                        if (simpleTest) {
                                            let _iteratorNormalCompletion7 = true;
                                            let _didIteratorError7 = false;
                                            let _iteratorError7;

                                            try {
                                                for (var _iterator7 = entry[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                                    let object = _step7.value;

                                                    let box = object[this.AABB];
                                                    if (box.x + box.width > AABB.x && box.x < AABB.x + AABB.width && box.y + box.height > AABB.y && box.y < AABB.y + AABB.height) {
                                                        results.push(object);
                                                    }
                                                }
                                            } catch (err) {
                                                _didIteratorError7 = true;
                                                _iteratorError7 = err;
                                            } finally {
                                                try {
                                                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                                        _iterator7.return();
                                                    }
                                                } finally {
                                                    if (_didIteratorError7) {
                                                        throw _iteratorError7;
                                                    }
                                                }
                                            }
                                        } else {
                                            results = results.concat(entry);
                                        }
                                        buckets++;
                                    }
                                }
                            }
                            this.lastBuckets = buckets;
                            return results;
                        }

                        /**
             * iterates through objects contained within bounding box
             * stops iterating if the callback returns true
             * @param {AABB} AABB bounding box to search
             * @param {function} callback
             * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
             * @return {boolean} true if callback returned early
             */

                    }, {
                        key: `queryCallback`,
                        value: function queryCallback (AABB, callback, simpleTest) {
                            simpleTest = typeof simpleTest !== `undefined` ? simpleTest : true;

                            let _getBounds3 = this.getBounds(AABB);
                            let xStart = _getBounds3.xStart;
                            let yStart = _getBounds3.yStart;
                            let xEnd = _getBounds3.xEnd;
                            let yEnd = _getBounds3.yEnd;

                            for (let y = yStart; y <= yEnd; y++) {
                                for (let x = xStart; x <= xEnd; x++) {
                                    let entry = this.hash[`${x},${y}`];
                                    if (entry) {
                                        for (let i = 0; i < entry.length; i++) {
                                            let object = entry[i];
                                            if (simpleTest) {
                                                let _AABB = object.AABB;
                                                if (_AABB.x + _AABB.width > _AABB.x && _AABB.x < _AABB.x + _AABB.width && _AABB.y + _AABB.height > _AABB.y && _AABB.y < _AABB.y + _AABB.height) {
                                                    if (callback(object)) {
                                                        return true;
                                                    }
                                                }
                                            } else {
                                                if (callback(object)) {
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return false;
                        }

                        /**
             * get stats
             * @return {Stats}
             */

                    }, {
                        key: `stats`,
                        value: function stats () {
                            let visible = 0;
                            let count = 0;
                            let _iteratorNormalCompletion8 = true;
                            let _didIteratorError8 = false;
                            let _iteratorError8;

                            try {
                                for (var _iterator8 = this.containers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                    let list = _step8.value;

                                    for (let i = 0; i < list.children.length; i++) {
                                        let object = list.children[i];
                                        visible += object.visible ? 1 : 0;
                                        count++;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError8 = true;
                                _iteratorError8 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                        _iterator8.return();
                                    }
                                } finally {
                                    if (_didIteratorError8) {
                                        throw _iteratorError8;
                                    }
                                }
                            }

                            return {
                                total: count,
                                visible: visible,
                                culled: count - visible
                            };
                        }

                        /**
             * helper function to evaluate hash table
             * @return {number} the number of buckets in the hash table
             * */

                    }, {
                        key: `getNumberOfBuckets`,
                        value: function getNumberOfBuckets () {
                            return Object.keys(this.hash).length;
                        }

                        /**
             * helper function to evaluate hash table
             * @return {number} the average number of entries in each bucket
             */

                    }, {
                        key: `getAverageSize`,
                        value: function getAverageSize () {
                            let total = 0;
                            for (let key in this.hash) {
                                total += this.hash[key].length;
                            }
                            return total / this.getBuckets().length;
                        }

                        /**
             * helper function to evaluate the hash table
             * @return {number} the largest sized bucket
             */

                    }, {
                        key: `getLargest`,
                        value: function getLargest () {
                            let largest = 0;
                            for (let key in this.hash) {
                                if (this.hash[key].length > largest) {
                                    largest = this.hash[key].length;
                                }
                            }
                            return largest;
                        }

                        /**
             * gets quadrant bounds
             * @return {Bounds}
             */

                    }, {
                        key: `getWorldBounds`,
                        value: function getWorldBounds () {
                            let xStart = Infinity;
                            let yStart = Infinity;
                            let xEnd = 0;
                            let yEnd = 0;
                            for (let key in this.hash) {
                                let split = key.split(`,`);
                                let x = parseInt(split[0]);
                                let y = parseInt(split[1]);
                                xStart = x < xStart ? x : xStart;
                                yStart = y < yStart ? y : yStart;
                                xEnd = x > xEnd ? x : xEnd;
                                yEnd = y > yEnd ? y : yEnd;
                            }
                            return { xStart: xStart, yStart: yStart, xEnd: xEnd, yEnd: yEnd };
                        }

                        /**
             * helper function to evalute the hash table
             * @param {AABB} [AABB] bounding box to search or entire world
             * @return {number} sparseness percentage (i.e., buckets with at least 1 element divided by total possible buckets)
             */

                    }, {
                        key: `getSparseness`,
                        value: function getSparseness (AABB) {
                            let count = 0;
                            let total = 0;

                            let _ref = AABB ? this.getBounds(AABB) : this.getWorldBounds();
                            let xStart = _ref.xStart;
                            let yStart = _ref.yStart;
                            let xEnd = _ref.xEnd;
                            let yEnd = _ref.yEnd;

                            for (let y = yStart; y < yEnd; y++) {
                                for (let x = xStart; x < xEnd; x++) {
                                    count += this.hash[`${x},${y}`] ? 1 : 0;
                                    total++;
                                }
                            }
                            return count / total;
                        }
                    }
                ]);

                return SpatialHash;
            }());

            /**
     * @typedef {object} Stats
     * @property {number} total
     * @property {number} visible
     * @property {number} culled
     */

            /**
     * @typedef {object} Bounds
     * @property {number} xStart
     * @property {number} yStart
     * @property {number} xEnd
     * @property {number} xEnd
     */

            /**
      * @typedef {object} AABB
      * @property {number} x
      * @property {number} y
      * @property {number} width
      * @property {number} height
      */

            module.exports = SpatialHash;
        }, {}
    ]
}, {}, [1]);
