// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)

/**
 * Main function giving a function stack trace with a forced or passed in Error
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
 * @return {Array} of Strings with functions, lines, files, and arguments where possible
 */
function printStackTrace (options) {
    options = options || { guess: true };
    let ex = options.e || null; let guess = !!options.guess;
    let p = new printStackTrace.implementation(); let result = p.run(ex);
    let res = (guess) ? p.guessAnonymousFunctions(result) : result;
    for (let k = 0; k < 4; k++) {
        res.shift();
    }
    return res;
}

printStackTrace.implementation = function () {
};

printStackTrace.implementation.prototype = {
    run: function (ex) {
        ex = ex || this.createException();
        // Do not use the stored mode: different exceptions in Chrome
        // may or may not have arguments or stack
        let mode = this.mode(ex);
        // Use either the stored mode, or resolve it
        // var mode = this._mode || this.mode(ex);
        if (mode === `other`) {
            return this.other(arguments.callee);
        } else {
            return this[mode](ex);
        }
    },

    createException: function () {
        try {
            this.undef();
            return null;
        } catch (e) {
            return e;
        }
    },

    /**
     * @return {String} mode of operation for the environment in question.
     */
    mode: function (e) {
        if (e.arguments && e.stack) {
            return (this._mode = `chrome`);
        } else if (e.message && typeof window !== `undefined` && window.opera) {
            return (this._mode = e.stacktrace ? `opera10` : `opera`);
        } else if (e.stack) {
            return (this._mode = `firefox`);
        }
        return (this._mode = `other`);
    },

    /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} function to call with a stack trace on invocation
     */
    instrumentFunction: function (context, functionName, callback) {
        context = context || window;
        let original = context[functionName];
        context[functionName] = function instrumented () {
            callback.call(this, printStackTrace().slice(4));
            return context[functionName]._instrumented.apply(this, arguments);
        };
        context[functionName]._instrumented = original;
    },

    /**
     * Given a context and function name of a function that has been
     * instrumented, revert the function to it's original (non-instrumented)
     * state.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to de-instrument
     */
    deinstrumentFunction: function (context, functionName) {
        if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
            context[functionName] = context[functionName]._instrumented;
        }
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function (e) {
        let stack = (`${e.stack}\n`).replace(/^\S[^\(]+?[\n$]/gm, ``)
            .replace(/^\s+at\s+/gm, ``)
            .replace(/^([^\(]+?)([\n$])/gm, `{anonymous}()@$1$2`)
            .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, `{anonymous}()@$1`).split(`\n`);
        stack.pop();
        return stack;
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function (e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, ``).replace(/^\(/gm, `{anonymous}(`).split(`\n`);
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10: function (e) {
        let stack = e.stacktrace;
        let lines = stack.split(`\n`); let ANON = `{anonymous}`; let lineRE = /.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i; let i; let j; let len;
        for (i = 2, j = 0, len = lines.length; i < len - 2; i++) {
            if (lineRE.test(lines[i])) {
                let location = `${RegExp.$6}:${RegExp.$1}:${RegExp.$2}`;
                let fnName = RegExp.$3;
                fnName = fnName.replace(/<anonymous function\:?\s?(\S+)?>/g, ANON);
                lines[j++] = `${fnName}@${location}`;
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    // Opera 7.x-9.x only!
    opera: function (e) {
        let lines = e.message.split(`\n`); let ANON = `{anonymous}`; let lineRE = /Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i; let i; let j; let len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            // TODO: RegExp.exec() would probably be cleaner here
            if (lineRE.test(lines[i])) {
                lines[j++] = `${RegExp.$3 ? `${RegExp.$3}()@${RegExp.$2}${RegExp.$1}` : `${ANON}()@${RegExp.$2}:${RegExp.$1}`} -- ${lines[i + 1].replace(/^\s+/, ``)}`;
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    // Safari, IE, and others
    other: function (curr) {
        let ANON = `{anonymous}`; let fnRE = /function\s*([\w\-$]+)?\s*\(/i; let stack = []; let fn; let args; let maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr.arguments || []);
            stack[stack.length] = `${fn}(${this.stringifyArguments(args)})`;
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} object
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function (args) {
        let slice = Array.prototype.slice;
        for (let i = 0; i < args.length; ++i) {
            let arg = args[i];
            if (arg === undefined) {
                args[i] = `undefined`;
            } else if (arg === null) {
                args[i] = `null`;
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        args[i] = `[${this.stringifyArguments(arg)}]`;
                    } else {
                        args[i] = `[${this.stringifyArguments(slice.call(arg, 0, 1))}...${this.stringifyArguments(slice.call(arg, -1))}]`;
                    }
                } else if (arg.constructor === Object) {
                    args[i] = `#object`;
                } else if (arg.constructor === Function) {
                    args[i] = `#function`;
                } else if (arg.constructor === String) {
                    args[i] = `"${arg}"`;
                }
            }
        }
        return args.join(`,`);
    },

    sourceCache: {},

    /**
     * @return {*} the text from a given URL.
     */
    ajax: function (url) {
        let req = this.createXMLHTTPObject();
        if (!req) {
            return;
        }
        req.open(`GET`, url, false);
        // req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req.send(``);
        return req.responseText;
    },

    /**
     * Try XHR methods in order and store XHR factory.
     *
     * @return <Function> XHR function or equivalent
     */
    createXMLHTTPObject: function () {
        let xmlhttp; let XMLHttpFactories = [
            function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject(`Msxml2.XMLHTTP`);
            }, function () {
                return new ActiveXObject(`Msxml3.XMLHTTP`);
            }, function () {
                return new ActiveXObject(`Microsoft.XMLHTTP`);
            }
        ];
        for (let i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {
            }
        }
    },

    /**
     * Given a URL, check if it is in the same domain (so we can get the source
     * via Ajax).
     *
     * @param url <String> source url
     * @return False if we need a cross-domain request
     */
    isSameDomain: function (url) {
        return url.indexOf(location.hostname) !== -1;
    },

    /**
     * Get source code from given URL if in the same domain.
     *
     * @param url <String> JS source URL
     * @return <Array> Array of source code lines
     */
    getSource: function (url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split(`\n`);
        }
        return this.sourceCache[url];
    },

    guessAnonymousFunctions: function (stack) {
        for (let i = 0; i < stack.length; ++i) {
            let reStack = /\{anonymous\}\(.*\)@(\w+:\/\/([\-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            let frame = stack[i]; let m = reStack.exec(frame);
            if (m) {
                let file = m[1]; let lineno = m[4]; let charno = m[7] || 0; // m[7] is character position in Chrome
                if (file && this.isSameDomain(file) && lineno) {
                    let functionName = this.guessAnonymousFunction(file, lineno, charno);
                    stack[i] = frame.replace(`{anonymous}`, functionName);
                }
            }
        }
        return stack;
    },

    guessAnonymousFunction: function (url, lineNo, charNo) {
        let ret;
        try {
            ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
            ret = `getSource failed with url: ${url}, exception: ${e.toString()}`;
        }
        return ret;
    },

    findFunctionName: function (source, lineNo) {
        // FIXME findFunctionName fails for compressed source
        // (more than one function on the same line)
        // TODO use captured args
        // function {name}({args}) m[1]=name m[2]=args
        let reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
        // {name} = function ({args}) TODO args capture
        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
        let reFunctionExpression = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;
        // {name} = eval()
        let reFunctionEvaluation = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
        // Walk backwards in the source lines until we find
        // the line which matches one of the patterns above
        let code = ``; let line; let maxLines = 10; let m;
        for (let i = 0; i < maxLines; ++i) {
            // FIXME lineNo is 1-based, source[] is 0-based
            line = source[lineNo - i];
            if (line) {
                code = line + code;

                m = reFunctionExpression.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
                m = reFunctionDeclaration.exec(code);
                if (m && m[1]) {
                    // return m[1] + "(" + (m[2] || "") + ")";
                    return m[1];
                }
                m = reFunctionEvaluation.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return `(?)`;
    }
};
