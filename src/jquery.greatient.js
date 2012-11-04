/*
 * jQuery GREAT!-ient
 * Gradient animation with jQuery
 *
 * Homepage: https://github.com/doswdev/GREATient
 * Released without restriction or warranty.
 *
 */

(function ($) {

    "use strict";

    /* Everyone else uses backgroundImage but IE uses filter. */
    var gradientProp = $.browser.msie ? "filter" : "backgroundImage",

        /* List of color names, borrowed from the jQuery color plugin */
        colors = {aqua: "#00ffff", azure: "#f0ffff", beige: "#f5f5dc", black: "#000000", blue: "#0000ff", brown: "#a52a2a",
                  cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgrey: "#a9a9a9", darkgreen: "#006400",
                  darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00",
                  darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkviolet: "#9400d3", fuchsia: "#ff00ff",
                  gold: "#ffd700", green: "#008000", indigo: "#4b0082", khaki: "#f0e68c", lightblue: "#add8e6", lightcyan: "#e0ffff",
                  lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightyellow: "#ffffe0", lime: "#00ff00",
                  magenta: "#ff00ff", maroon: "#800000", navy: "#000080", olive: "#808000", orange: "#ffa500", pink: "#ffc0cb",
                  purple: "#800080", violet: "#800080", red: "#ff0000", silver: "#c0c0c0", white: "#ffffff", yellow: "#ffff00"},

        regex = {
            colorNames: new RegExp("(" + Object.keys(colors).join("|") + ")", "gi"),
            rgb: /(rgba?\([\s\d\,\.]+\))/g,
            hex: /(#[0-9a-f]{6})/g
        };

    /* Chrome returns color names in the css - replace with rgb */
    function replaceCallback(token) {
        var hex = colors[token.toLowerCase()];
        return "rgb(" + [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)].join(",") + ")";
    }

    /* pos is between 0 and 1, start and end are arrays of [r,g,b,a] values.  Returns an rgba formatted color */
    function getPartialColor(pos, start, end) {
        return "rgba(" + [
            Math.round(start[0] + pos * (end[0] - start[0])),
            Math.round(start[1] + pos * (end[1] - start[1])),
            Math.round(start[2] + pos * (end[2] - start[2])),
            start[3] + pos * (end[3] - start[3])
        ].join(",") + ")";
    }

    function parseColor(color) {
        if (color.charAt(0) === "#") {  // #RRGGBB
            return [parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16), 1];
        } // rgb( rrr, ggg, bbb);
        color = color.match(/[\.\d]+/g);
        return [parseInt(color[0], 10), parseInt(color[1], 10), parseInt(color[2], 10), color[3] ? parseFloat(color[3]) : 1];
    }

    /* Parse the provided colors and convert into numbers for calculation */
    function convertColors(fx, end) {
        var str = $(fx.elem).css(gradientProp).replace(regex.colorNames, replaceCallback),
            rgb = (str.match(regex.rgb) || str.match(regex.hex))[end ? "shift" : "pop"]();
        fx.elem.style[gradientProp] = str;
        fx.format = rgb.charAt(0) === "#" ? regex.hex : regex.rgb;
        fx.start = parseColor(rgb);
        fx.end = parseColor(colors[fx.end] || fx.end);
    }

    /* Generic function for animating the first (flag) or last (!flag) color */
    function animateGradient(flag) {
        return function (fx) {
            var tokens, len, counter, index;
            if (fx.state === 0) {
                convertColors(fx, flag);
                tokens = $(fx.elem).css(gradientProp).split(fx.format);
                for (counter = 0, len = tokens.length - 1; counter <= len; counter += 1) {
                    index = flag ? counter : len - counter; //offset from either end
                    if (tokens[index].substr(0, 3) === "rgb" || tokens[index].charAt(0) === "#") {
                        fx.index = index;
                        break;
                    }
                }
            } else {
                tokens = $(fx.elem).css(gradientProp).split(fx.format);
                tokens[fx.index] = getPartialColor(fx.pos, fx.start, fx.end);
                fx.elem.style[gradientProp] = tokens.join("");
            }
        };
    }

    /* Animates the first color in the gradient  */
    $.fx.step.gradientFrom = animateGradient(true);

    /* Animates the second color in the gradient  */
    $.fx.step.gradientTo = animateGradient(false);
}(jQuery));
