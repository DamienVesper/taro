// fgnass.github.com/spin.js#v1.3.2

/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */
(function (root, factory) {
    /* CommonJS */
    if (typeof exports === `object`) module.exports = factory();

    /* AMD module */
    else if (typeof define === `function` && define.amd) define(factory);

    /* Browser global */
    else root.Spinner = factory();
}
(this, () => {
    "use strict";

    let prefixes = [`webkit`, `Moz`, `ms`, `O`]; /* Vendor prefixes */
    let animations = {}; /* Animation rules keyed by their name */
    let useCssAnimations; /* Whether to use CSS animations or setTimeout */

    /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
    function createEl (tag, prop) {
        let el = document.createElement(tag || `div`);
        let n;

        for (n in prop) el[n] = prop[n];
        return el;
    }

    /**
   * Appends children and returns the parent.
   */
    function ins (parent /* child1, child2, ... */) {
        for (let i = 1, n = arguments.length; i < n; i++)
            parent.appendChild(arguments[i]);

        return parent;
    }

    /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
    let sheet = (function () {
        let el = createEl(`style`, { type: `text/css` });
        ins(document.getElementsByTagName(`head`)[0], el);
        return el.sheet || el.styleSheet;
    }());

    /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
    function addAnimation (alpha, trail, i, lines) {
        let name = [`opacity`, trail, ~~(alpha * 100), i, lines].join(`-`);
        let start = 0.01 + i / lines * 100;
        let z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha);
        let prefix = useCssAnimations.substring(0, useCssAnimations.indexOf(`Animation`)).toLowerCase();
        let pre = prefix && `-${prefix}-` || ``;

        if (!animations[name]) {
            sheet.insertRule(
                `@${pre}keyframes ${name}{` +
        `0%{opacity:${z}}${
            start}%{opacity:${alpha}}${
            start + 0.01}%{opacity:1}${
            (start + trail) % 100}%{opacity:${alpha}}` +
        `100%{opacity:${z}}` +
        `}`, sheet.cssRules.length);

            animations[name] = 1;
        }

        return name;
    }

    /**
   * Tries various vendor prefixes and returns the first supported property.
   */
    function vendor (el, prop) {
        let s = el.style;
        let pp;
        let i;

        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop;
            if (s[pp] !== undefined) return pp;
        }
        if (s[prop] !== undefined) return prop;
    }

    /**
   * Sets multiple style properties at once.
   */
    function css (el, prop) {
        for (let n in prop)
            el.style[vendor(el, n) || n] = prop[n];

        return el;
    }

    /**
   * Fills in default values.
   */
    function merge (obj) {
        for (let i = 1; i < arguments.length; i++) {
            let def = arguments[i];
            for (let n in def)
                if (obj[n] === undefined) obj[n] = def[n];
        }
        return obj;
    }

    /**
   * Returns the absolute page-offset of the given element.
   */
    function pos (el) {
        let o = { x: el.offsetLeft, y: el.offsetTop };
        while ((el = el.offsetParent))
            o.x += el.offsetLeft, o.y += el.offsetTop;

        return o;
    }

    /**
   * Returns the line color from the given string or array.
   */
    function getColor (color, idx) {
        return typeof color === `string` ? color : color[idx % color.length];
    }

    // Built-in defaults

    let defaults = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 5, // The line thickness
        radius: 10, // The radius of the inner circle
        rotate: 0, // Rotation offset
        corners: 1, // Roundness (0..1)
        color: `#000`, // #rgb or #rrggbb
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 100, // Afterglow percentage
        opacity: 1 / 4, // Opacity of the lines
        fps: 20, // Frames per second when using setTimeout()
        zIndex: 2e9, // Use a high z-index by default
        className: `spinner`, // CSS class to assign to the element
        top: `auto`, // center vertically
        left: `auto`, // center horizontally
        position: `relative` // element position
    };

    /** The constructor */
    function Spinner (o) {
        if (typeof this === `undefined`) return new Spinner(o);
        this.opts = merge(o || {}, Spinner.defaults, defaults);
    }

    // Global defaults that override the built-ins:
    Spinner.defaults = {};

    merge(Spinner.prototype, {

        /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
        spin: function (target) {
            this.stop();

            let self = this;
            let o = self.opts;
            let el = self.el = css(createEl(0, { className: o.className }), { position: o.position, width: 0, zIndex: o.zIndex });
            let mid = o.radius + o.length + o.width;
            let ep; // element position
            let tp; // target position

            if (target) {
                target.insertBefore(el, target.firstChild || null);
                tp = pos(target);
                ep = pos(el);
                css(el, {
                    left: `${o.left == `auto` ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid}px`,
                    top: `${o.top == `auto` ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid}px`
                });
            }

            el.setAttribute(`role`, `progressbar`);
            self.lines(el, self.opts);

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                let i = 0;
                let start = (o.lines - 1) * (1 - o.direction) / 2;
                let alpha;
                let fps = o.fps;
                let f = fps / o.speed;
                let ostep = (1 - o.opacity) / (f * o.trail / 100);
                let astep = f / o.lines

        ;(function anim () {
                    i++;
                    for (let j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity);

                        self.opacity(el, j * o.direction + start, alpha, o);
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps));
                })();
            }
            return self;
        },

        /**
     * Stops and removes the Spinner.
     */
        stop: function () {
            let el = this.el;
            if (el) {
                clearTimeout(this.timeout);
                if (el.parentNode) el.parentNode.removeChild(el);
                this.el = undefined;
            }
            return this;
        },

        /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
        lines: function (el, o) {
            let i = 0;
            let start = (o.lines - 1) * (1 - o.direction) / 2;
            let seg;

            function fill (color, shadow) {
                return css(createEl(), {
                    position: `absolute`,
                    width: `${o.length + o.width}px`,
                    height: `${o.width}px`,
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: `left`,
                    transform: `rotate(${~~(360 / o.lines * i + o.rotate)}deg) translate(${o.radius}px` + `,0)`,
                    borderRadius: `${o.corners * o.width >> 1}px`
                });
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: `absolute`,
                    top: `${1 + ~(o.width / 2)}px`,
                    transform: o.hwaccel ? `translate3d(0,0,0)` : ``,
                    opacity: o.opacity,
                    animation: useCssAnimations && `${addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines)} ${1 / o.speed}s linear infinite`
                });

                if (o.shadow) ins(seg, css(fill(`#000`, `0 0 4px ` + `#000`), { top: `${2}px` }));
                ins(el, ins(seg, fill(getColor(o.color, i), `0 0 1px rgba(0,0,0,.1)`)));
            }
            return el;
        },

        /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
        opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
        }

    });

    function initVML () {
    /* Utility function to create a VML tag */
        function vml (tag, attr) {
            return createEl(`<${tag} xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">`, attr);
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule(`.spin-vml`, `behavior:url(#default#VML)`);

        Spinner.prototype.lines = function (el, o) {
            let r = o.length + o.width;
            let s = 2 * r;

            function grp () {
                return css(
                    vml(`group`, {
                        coordsize: `${s} ${s}`,
                        coordorigin: `${-r} ${-r}`
                    }),
                    { width: s, height: s }
                );
            }

            let margin = `${-(o.width + o.length) * 2}px`;
            let g = css(grp(), { position: `absolute`, top: margin, left: margin });
            let i;

            function seg (i, dx, filter) {
                ins(g,
                    ins(css(grp(), { rotation: `${360 / o.lines * i}deg`, left: ~~dx }),
                        ins(css(vml(`roundrect`, { arcsize: o.corners }), {
                            width: r,
                            height: o.width,
                            left: o.radius,
                            top: -o.width >> 1,
                            filter: filter
                        }),
                        vml(`fill`, { color: getColor(o.color, i), opacity: o.opacity }),
                        vml(`stroke`, { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
                        )
                    )
                );
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++)
                    seg(i, -2, `progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)`);

            for (i = 1; i <= o.lines; i++) seg(i);
            return ins(el, g);
        };

        Spinner.prototype.opacity = function (el, i, val, o) {
            let c = el.firstChild;
            o = o.shadow && o.lines || 0;
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild;
                if (c) c.opacity = val;
            }
        };
    }

    let probe = css(createEl(`group`), { behavior: `url(#default#VML)` });

    if (!vendor(probe, `transform`) && probe.adj) initVML();
    else useCssAnimations = vendor(probe, `animation`);

    return Spinner;
}));
