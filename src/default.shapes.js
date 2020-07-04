// src/shapes/default.shapes.js

function getColor(name, colors) {
  return colors ? colors[name] || name : name;
}
// - Flag 16 x 12
// - Pennant 24 x 12(4)
// - Substitute 16 x 11

const shapes = {
  default: {
    // Dimensions must be divisible by 30.
    // Also w - h / 5 must be divisible by 2 for the cross to work.
    size: [120, 90],

    // Draw a border design - note this is not an outline!
    border(design, { w, h, colors }) {
      const [, clrs] = design;
      const parts = [];

      // Draw the border(s) from the outside in.
      // xbw and ybw are the border widths in the x and y dimension.
      const xbw = w / (clrs.length * 2);
      const ybw = h / (clrs.length * 2);
      let xb = 0;
      let yb = 0;
      for (let i = clrs.length - 1; i > 0; i--) {
        parts.push(`<path d="M${xb},${yb}`);
        parts.push(`H${w - xb}V${h - yb}H${xb}Z`);
        xb += xbw;
        yb += ybw;
        // Draw the 'hole' anti-clockwise so it does not fill.
        parts.push(`M${xb},${yb}`);
        parts.push(`V${h - yb}H${w - xb}V${yb}Z"`);
        parts.push(` fill="${getColor(clrs[i], colors)}"/>\n`);
      }
      // Draw the centre.
      parts.push(`<path d="M${xb},${yb}`);
      parts.push(`H${w - xb}V${h - yb}H${xb}Z"`);
      parts.push(` fill="${getColor(clrs[0], colors)}"/>\n`);
      return parts.join('');
    },

    // Draw a check.
    // Only works for an even number of checks.
    check(design, { w, h, colors }) {
      const [, clrs, nChecks] = design;
      const parts = [];

      // xw and yw are the check widths in the x and y dimension.
      let repeat = nChecks || 2;
      const xw = w / repeat;
      const yw = h / repeat;
      repeat = repeat / 2 - 1;
      let i;
      let x = xw;
      let y = h - yw;
      parts.push(`<path d="M0,0H${x}V${h}`);
      for (i = 0; i < repeat; i++) {
        x += xw;
        parts.push(`H${x}V${0}`);
        x += xw;
        parts.push(`H${x}V${h}`);
      }
      parts.push(`H${w}V${y}H${0}`);
      for (i = 0; i < repeat; i++) {
        y -= yw;
        parts.push(`V${y}H${w}`);
        y -= yw;
        parts.push(`V${y}H${0}`);
      }
      parts.push(`V${0}" fill="${getColor(clrs[0], colors)}"/>\n`);

      x = w - xw;
      y = yw;
      parts.push(`<path d="M${w},0H${x}V${h}`);
      for (i = 0; i < repeat; i++) {
        x -= xw;
        parts.push(`H${x}V${0}`);
        x -= xw;
        parts.push(`H${x}V${h}`);
      }
      parts.push(`H${0}V${y}H${w}`);
      for (i = 0; i < repeat; i++) {
        y += yw;
        parts.push(`V${y}H${0}`);
        y += yw;
        parts.push(`V${y}H${w}`);
      }
      parts.push(`V${0}" fill="${getColor(clrs[1], colors)}"/>\n`);
      return parts.join('');
    },

    // Draw a field (background).
    solid(design, { w, h, colors }) {
      const [, clr] = design;
      return `<path d="M0,0H${w}V${h}H0Z" fill="${getColor(clr, colors)}"/>\n`;
    },

    // Draw a cross (like a +).
    cross(design, { w, h, colors }) {
      const [, clrs] = design;
      const parts = [];
      // Standard cross width is 1/5 of the height of the flag; this means x and y need
      // to be carefully chosen to avoid long fractions.
      const x0 = h / 5;
      const y0 = x0;
      const x1 = (w - x0) / 2;
      const y1 = (h - y0) / 2;
      // Draw the two limbs of the cross - it doesn't matter that they intersect.
      parts.push(`<path d="`);
      parts.push(`M${x1},0H${x1 + x0}V${h}H${x1}Z`);
      parts.push(`M0,${y1}H${w}V${y1 + y0}H${0}Z`);
      parts.push(`" fill="${getColor(clrs[0], colors)}"/>\n`);
      // Draw the four background rectangles.
      parts.push(`<path d="`);
      parts.push(`M0,0H${x1}V${y1}H0Z`);
      parts.push(`M${x1 + x0},0H${w}V${y1}H${x1 + x0}Z`);
      parts.push(`M0,${y1 + y0}H${x1}V${h}H0Z`);
      parts.push(`M${x1 + x0},${y1 + y0}H${w}V${h}H${x1 + x0}Z`);
      parts.push(`" fill="${getColor(clrs[1], colors)}"/>\n`);
      return parts.join('');
    },

    // Draw horizontal stripes.
    horizontal(design, { w, h, colors }) {
      const [, clrs] = design;
      const parts = [];
      const variableHeights = design[2];
      if (variableHeights) {
        // Variable stripe height.
        const sh = h / variableHeights.reduce((sum, stripe) => sum + stripe, 0);
        // t is the top edge of the stripe.
        for (let i = 0, t = 0; i < variableHeights.length; i++) {
          parts.push(`<path d="M0,${t}`);
          t += variableHeights[i] * sh;
          parts.push(`H${w}V${t}H${0}Z"`);
          parts.push(` fill="${getColor(clrs[i], colors)}"/>\n`);
        }
        return parts.join('');
      }

      // Fixed stripe height.
      const sh = h / clrs.length;
      // t is the top edge of the stripe.
      for (let t = 0; t < h; t += sh) {
        parts.push(`<path d="M0,${t}`);
        parts.push(`H${w}V${t + sh}H${0}Z"`);
        parts.push(` fill="${getColor(clrs[t / sh], colors)}"/>\n`);
      }
      return parts.join('');
    },

    // Draw an outline.
    outline(design, { w, h, colors }) {
      const off = 0.5;
      return [
        `<path d="M${off},${off}`,
        `H${w - 0.5 - off}V${h - off}H${off}Z"`,
        ' stroke="black" fill="none"/>\n',
      ].join('');
    },

    // Draw a saltire (like an X).
    saltire(design, { w, h, colors }) {
      const [, clrs] = design;
      const parts = [];
      const x0 = w / 10;
      const y0 = h / 10;
      const x1 = w / 2 - x0;
      const y1 = h / 2 - y0;
      // Draw the two limbs of the cross - it doesn't matter that they intersect.
      parts.push(`<path d="`);
      parts.push(`M0,0H${x0}L${w},${h - y0}V${h}H${w - x0}L0,${y0}Z`);
      parts.push(`M${w - x0},0H${w}V${y0}L${x0},${h}H0V${h - y0}Z`);
      parts.push(`" fill="${getColor(clrs[0], colors)}"/>\n`);
      // Draw the four background triangles.
      parts.push(`<path d="`);
      parts.push(`M${x0},0H${w - x0}L${w / 2},${y1}Z`);
      parts.push(`M${w},${y0}V${h - y0}L${w - x1},${h / 2}Z`);
      parts.push(`M${x0},${h}H${w - x0}L${w / 2},${h - y1}Z`);
      parts.push(`M0,${y0}V${h - y0}L${x1},${h / 2}Z`);
      // parts.push(`M${x1 + x0},0H${w}V${y1}H${x1 + x0}Z`);
      // parts.push(`M0,${y1 + y0}H${x1}V${h}H0Z`);
      // parts.push(`M${x1 + x0},${y1 + y0}H${w}V${h}H${x1 + x0}Z`);
      parts.push(`" fill="${getColor(clrs[1], colors)}"/>\n`);
      return parts.join('');
    },

    // Draw vertical stripes.
    vertical(design, { w, h, colors }) {
      const [, clrs] = design;
      // Stripe width.
      const sw = w / clrs.length;
      const parts = [];
      // l is the left edge of the stripe.
      for (let l = 0; l < w; l += sw) {
        parts.push(`<path d="M${l},0`);
        parts.push(`H${l + sw}V${h}H${l}Z"`);
        parts.push(` fill="${getColor(clrs[l / sw], colors)}"/>\n`);
      }
      return parts.join('');
    },
  },

  pennant: {
    size: [180, 90],

    // Draw a field (background).
    solid(design, { w, h, colors }) {
      const [, clr] = design;
      // Make the fly height 1/3 of the height.
      const fh = h / 3;
      return [
        '<path d="M0,0',
        `L${w},${(h - fh) / 2}V${(h + fh) / 2}L0,${h}Z"`,
        ` fill="${getColor(clr, colors)}"/>\n`,
      ].join('');
    },

    // Draw an outline.
    outline(design, { w, h }) {
      // Make the fly height 1/3 of the height.
      const fh = h / 3;
      const off = 0.5;
      return [
        `<path d="M${off},${off}`,
        `L${w - off},${(h - fh) / 2 + off}V${(h + fh) / 2 - off}L${off},${h - off}Z"`,
        ' stroke="black" fill="none"/>\n',
      ].join('');
    },

    // Draw vertical stripes.
    vertical(design, { w, h, colors }) {
      const [, clrs] = design;
      // Make the fly height 1/3 of the height.
      const fh = h / 3;
      // Stripe width.
      const sw = w / clrs.length;
      // Difference in height per stripe.
      const dh = (h - fh) / (2 * clrs.length);
      const parts = [];
      // t is the top left of the stripe.
      let t = 0;
      // l is the left edge of the stripe.
      for (let l = 0; l < w; l += sw) {
        parts.push(`<path d="M${l},${t}`);
        t += dh;
        parts.push(`L${l + sw},${t}V${h - t}L${l},${h - t + dh}Z"`);
        parts.push(` fill="${getColor(clrs[l / sw], colors)}"/>\n`);
      }
      return parts.join('');
    },
  },

  triangle: {
    size: [120, 90],

    // Draw an outline.
    outline(design, { w, h }) {
      const off = 0.5;
      return [
        `<path d="M${off},${off}`,
        `L${w - off},${h / 2 + off}L${off},${h - off}Z"`,
        ' stroke="black" fill="none"/>\n',
      ].join('');
    },

    // Draw vertical stripes.
    vertical(design, { w, h, colors }) {
      const [, clrs] = design;
      // Stripe width.
      const sw = w / clrs.length * 0.8;
      // Difference in height per stripe.
      const dh = h / (2 * clrs.length) * 0.8;
      const parts = [];
      // t is the top left of the stripe.
      let t = 0;
      // l is the left edge of the stripe.
      for (let l = 0; l < w - sw; l += sw) {
        parts.push(`<path d="M${l},${t}`);
        t += dh;
        parts.push(`L${l + sw},${t}V${h - t}L${l},${h - t + dh}Z"`);
        parts.push(` fill="${getColor(clrs[l / sw], colors)}"/>\n`);
      }
      // Last stripe goes to a point.
      parts.push(`<path d="M${w - sw},${t}`);
      parts.push(`L${w},${h / 2}L${w - sw},${h - t}Z"`);
      parts.push(` fill="${getColor(clrs[clrs.length - 1], colors)}"/>\n`);
      return parts.join('');
    },
  },

  swallowtail: {
    size: [120, 90],

    // Draw a field (background).
    solid(design, { w, h, colors }) {
      // Make the tail 1/4 of the width of the flag.
      const tail = w * 0.25;
      const [, clr] = design;
      return [
        '<path d="M0,0',
        `H${w}L${w - tail},${h / 2}L${w},${h}H0Z"`,
        ` fill="${getColor(clr, colors)}"/>\n`,
      ].join('');
    },

    // Draw an outline.
    outline(design, { w, h }) {
      // Make the tail 1/4 of the width of the flag.
      const tail = w * 0.25;
      const off = 0.5;
      return [
        `<path d="M${off},${off}`,
        `H${w - off}L${w - tail - off},${h / 2}L${w - off},${h - off}H${off}Z"`,
        ' stroke="black" fill="none"/>\n',
      ].join('');
    },

    // Draw vertical stripes.
    vertical(design, { w, h, colors }) {
      const [, clrs] = design;
      // Make the tail 1/4 of the width of the flag.
      const tail = w * 0.25;
      // Stripe width.
      const sw = w / clrs.length;
      const parts = [];
      // l is the left edge of the stripe.
      for (let l = 0; l < w - sw; l += sw) {
        parts.push(`<path d="M${l},0`);
        parts.push(`H${l + sw}V${h}H${l}Z"`);
        parts.push(` fill="${getColor(clrs[l / sw], colors)}"/>\n`);
      }
      // Last stripe has the swallowtail.
      parts.push(`<path d="M${w - sw},0`);
      parts.push(`H${w}L${w - tail},${h / 2}L${w},${h}H${w - sw}Z"`);
      parts.push(` fill="${getColor(clrs[clrs.length - 1], colors)}"/>\n`);
      return parts.join('');
    },
  },
};

export default shapes;