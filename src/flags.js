// src/flags.js

import defaultFlags from './default.flags';
import defaultShapes from './default.shapes';

const WRONG_LINE_ENDINGS = /[^>]$/m;
const MISSING_LINE_ENDINGS = />./m;

// Used to test for any number with more than 1 digit after the decimal point.
const LONG_DECIMALS = /[0-9]\.[0-9]{2}/;

const defaultColors = {
  white: '#fff',
  blue: '#0032A0', // Pantone 286 C https://www.pantone.com/color-finder/286-C
  green: '#4A7729', // Pantone 364 C https://www.pantone.com/color-finder/364-C
  red: '#C8102E', // Pantone 186 C https://www.pantone.com/color-finder/186-C
  yellow: '#FEDD00', // Pantone Yellow C https://www.pantone.com/color-finder/Yellow-C
  black: '#2D2926', // Pantone Black C https://www.pantone.com/color-finder/Black-C
};

function audit(svg) {
  // test('there should be line endings', () => {
  if (!svg.endsWith('>\n')) return 'Missing EOL at the end';
  if (svg.substring(0, svg.length - 1).match(WRONG_LINE_ENDINGS)) return 'Wrong line endings';
  if (svg.match(MISSING_LINE_ENDINGS)) return 'Missing line endings';
  if (svg.match(LONG_DECIMALS)) return 'Long decimals';
  return true;
}

/**
 * Build the SVG for a flag.
 *
 * @param {object} shape A map of functions to draw designs for this shape.
 * @param {mixed[]} design An array of design elements for the flag.
 * @param {object} colors Colours for this flag set.
 * @param {number[]} size The size to draw [width, height].
 */
function buildFlagSvg({ shape, design, colors, outline, file }) {
  // Get the dimensions for this shape and create the svg for the viewBox.
  const { size } = shape;
  const [w, h] = size;
  let parts = [];
  if (file) {
    parts.push('<?xml version="1.0" encoding="UTF-8" ?>\n');
    parts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">\n`
    );
  } else {
    parts.push(`<svg viewBox="0 0 ${w} ${h}">\n`);
  }

  let calculatedColors = colors;
  if (!calculatedColors) {
    calculatedColors = colors === false ? {} : defaultColors;
  }

  let hasOutline = false;
  // Add the svg for each part of the design.
  design.forEach((part) => {
    if (part[0] === 'outline') {
      // This is an outline but we have turned it off.
      if (outline === false) return;
      // Remember we have drawn an outline.
      hasOutline = true;
    }
    parts.push(shape[part[0]](part, { w, h, colors: calculatedColors }));
  });

  // If we are forcing an outline and we haven't drawn one already, draw it now.
  if (outline && !hasOutline) {
    parts.push(shape.outline([], { w, h, colors: calculatedColors }));
  }

  // Close the svg element and return the whole concatenated.
  parts.push('</svg>\n');
  return parts.join('');
}

class Flags {
  constructor(options) {
    const settings = { ...options };
    this.colors = settings.colors;
    this.flags = settings.flags || defaultFlags;
    this.shapes = settings.shapes || defaultShapes;
  }

  getFlag(name) {
    if (name) return this.flags.flags[name];
    return this.flags.flags;
  }

  getSvg(name, options) {
    if (name == null) {
      // Return svg for all flags.
      const svg = {};
      Object.keys(this.flags.flags).forEach((key) => {
        svg[key] = this.getSvg(key, options);
      });
      return svg;
    }
    const { design, shape } = this.flags.flags[name];
    const { shapes, colors } = this;
    return buildFlagSvg({
      // If the flag has no shape use the default shape.
      shape: shapes[shape || 'default'],
      design,
      colors,
      ...options,
    });
  }

  checkSvg(svg) {
    return audit(svg);
  }
}

export default Flags;