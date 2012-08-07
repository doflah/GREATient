/*
 * jQuery GREAT!-ient
 * Gradient animation with jQuery
 *
 * Homepage: https://github.com/doswdev/GREATient
 * Released without restriction or warranty.
 *
 */

(function ($) {

    /* Everyone else uses backgroundImage but IE uses filter. */
    var gradientProp = $.browser.msie ? "filter" : "backgroundImage",

    /* List of color names, borrowed from the jQuery color plugin */
        colors = {aqua: "#00ffff", azure: "#f0ffff", beige: "#f5f5dc", black: "#000000", blue: "#0000ff", brown: "#a52a2a", cyan: "#00ffff", darkblue: "#00008b",
            darkcyan: "#008b8b", darkgrey: "#a9a9a9", darkgreen: "#006400", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00",
            darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkviolet: "#9400d3", fuchsia: "#ff00ff", gold: "#ffd700", green: "#008000", indigo: "#4b0082",
            khaki: "#f0e68c", lightblue: "#add8e6", lightcyan: "#e0ffff", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightyellow: "#ffffe0",
            lime: "#00ff00", magenta: "#ff00ff", maroon: "#800000", navy: "#000080", olive: "#808000", orange: "#ffa500", pink: "#ffc0cb", purple: "#800080", violet: "#800080",
            red: "#ff0000", silver: "#c0c0c0", white: "#ffffff", yellow: "#ffff00"},

        expression = new RegExp("("+Object.keys(colors).join("|") + ")", "gi"),

    /* pos is between 0 and 1, start and end are arrays of [r,g,b] values.  Returns an rgb formatted color */
        getPartialColor = function (pos, start, end) {
            return "rgb(" + [
                Math.max(Math.min(parseInt((pos * (end[0] - start[0])) + start[0], 10), 255), 0),
                Math.max(Math.min(parseInt((pos * (end[1] - start[1])) + start[1], 10), 255), 0),
                Math.max(Math.min(parseInt((pos * (end[2] - start[2])) + start[2], 10), 255), 0)
            ].join(",") + ")";
        },

    /* Parse the provided colors and convert into numbers for calculation */
        convertColors = function (fx, index) {
            var str = $(fx.elem).css(gradientProp).replace(expression, function(i) {
                    return colors[i.toLowerCase()]; //replace any color names
                }), rgb = (str.match(/(rgb\(.+?\))/g) || str.match(/(#[0-9a-f]{6})/g))[index]();
                $(fx.elem).css(gradientProp, str);
            if (rgb.charAt(0) === "#") {
                fx.start = [parseInt(rgb.substring(1, 3), 16), parseInt(rgb.substring(3, 5), 16), parseInt(rgb.substring(5, 7), 16)];
                fx.format = /(#[0-9a-f]{6})/;
            } else {
                rgb = rgb.match(/\d+/g);
                fx.start = [parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10)];
                fx.format = /(rgb\(.+?\))/;
            }
            rgb = colors[fx.end] || fx.end;
            if (rgb.charAt(0) === "#") {
                fx.end = [parseInt(rgb.substring(1, 3), 16), parseInt(rgb.substring(3, 5), 16), parseInt(rgb.substring(5, 7), 16)];
            } else {
                rgb = rgb.match(/\d+/g);
                fx.end = [parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10)];
            }
        },

    /* Generic function for animating the first (flag == true) or last (flag == false) color */
        animateGradient = function(flag) {
            return function(fx) {
                var tokens, len, counter, index, str;
                if (fx.state === 0) {
                    convertColors(fx, flag?"shift":"pop");
                    tokens = $(fx.elem).css(gradientProp).split(fx.format);
                    for (counter = 0, len = tokens.length; counter < len; counter++) {
                        index = flag?counter:len-counter-1;
                        str = tokens[index];
                        if (str.substring(0, 4) === "rgb(" || str.charAt(0) === "#") {
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
        };

    /* Animates the first color in the gradient  */
    $.fx.step.gradientFrom = animateGradient(true);

    /* Animates the second color in the gradient  */
    $.fx.step.gradientTo = animateGradient(false);
}(jQuery));
