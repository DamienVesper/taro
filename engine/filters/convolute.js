IgeFilters.createImageData = function (w, h) {
    return IgeFilters.tmpCtx.createImageData(w, h);
};

IgeFilters._convolute = function (pixels, weights, opaque) {
    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side / 2);
    let src = pixels.data;
    let sw = pixels.width;
    let sh = pixels.height;
    // pad output by the convolution matrix
    let w = sw;
    let h = sh;
    let output = IgeFilters.createImageData(w, h);
    let dst = output.data;
    // go through the destination image pixels
    let alphaFac = opaque ? 1 : 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sy = y;
            let sx = x;
            let dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            let r = 0; let g = 0; let b = 0; let a = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    let scy = sy + cy - halfSide;
                    let scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        let srcOff = (scy * sw + scx) * 4;
                        let wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;
                        a += src[srcOff + 3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
};
