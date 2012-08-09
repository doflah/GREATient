# jQuery GREAT!-ient #

**Initial release.**  Tested in Firefox, Chrome and Opera.  Linear and radial gradients are supported in all browsers that support them.  jQuery's `animate()` function can take RGB, Hex or a color name.

## Usage ##
    $(foo).animate({"gradientFrom": "rgb(0, 255, 0)"}, 1000);
    $(foo).animate({"gradientTo": "rgb(0, 255, 0)"}, 1000);
    $(foo).animate({"gradientFrom": "#FFFFFF","gradientTo": "white"}, 1000);

## Known issues ##
1. Great is probably an overstatement.
~~2. The original CSS cannot use color names - you need to provide either RGB or Hex color values.  Color names can be supplied to the animation, however.~~
3. Does not support Internet Explorer.
4. Colors are the only gradient component that can be animated.
5. Only animates the first and last colors in a gradient.
