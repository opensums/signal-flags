# Signal Flags

Flag images for International Code of Signals Flags.

## Getting started: Signal Flags Loader

To use the automagic Signal Flags Loader see the
[Example Page](https://signalflags.org/examples/index.html).

## Getting started without the Loader

To use in an HTML page, load from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/signal-flags@2/dist/signal-flags.min.js"></script>
```

To use in Node.js install using npm `npm i signal-flags` or yarn `yarn install signal-flags`

```js
const SignalFlags = require('signal-flags');
```

## Usage

```js
// Get the SVG string for a flag.
SignalFlags.get('a');
// ... with no outline.
SignalFlags.get('a', { outline: false });
// ... as a standalone file.
SignalFlags.get('a', { file: true });
// ... as a Data URI for inserting into an IMG tag.
SignalFlags.get('a', { dataUri: true });
// ... using the `primary` colour set.
SignalFlags.get('a', { colors: 'primary });
// ... overriding one or more colours.
SignalFlags.get('a', { colors: white: '#ffffff' });
// ... square option for rectangular flags.
SignalFlags.get('ap', { shape: 'square' });
// ... long option for pennants.
SignalFlags.get('ap', { shape: 'long' });

// Get the SVG strings for all flags (keyed by the flag name).
SignalFlags.all();
// ... with options.
SignalFlags.all({ outline: false, file: true });
```

## Current release v2.4.0

[![build](https://github.com/signal-flags/signal-flags-js/actions/workflows/build.yaml/badge.svg)](https://github.com/signal-flags/signal-flags-js/actions/workflows/build.yaml)

- Design improvements:
  - Reverted triangles to 4:3 ratio.
  - Default pennants are now 3:1 (this was previously the `long` option which is
    now removed), with a new `short` option for the previously `default` 2:1.
- Renamed `port` and `starboard` mark changing flags to `toport` and
  `tostarboard` respectively to avoid future clashes, and `minus` and `plus` to
  `decrease` and `increase` respectively for consistency.

## Changelog

- **v2.3.2**
- Design improvements:
  - triangles now 2:1 ratio matching pennants
  - I, P, and S flags have different inner shape sizes on square flags
  - Improvements to wide pennants for numerals 1, 2, 4 and 8
  - Improvements to mark moving flags +, -, red rectangle, green triangle
- New feature to select options in the JS autoloader with class="sfoption-[key]-[value]"

- **v2.2.1**
  - 6 new designs:
    - orange for the start line
    - plus, minus, port and starboard for mark changes
    - 4th substitute
  - improvements to I (India), P (Papa) and S (Sierra) flags (the centre element
    in each is now larger)
  - `long` shape option added for pennants
  - ponyfill added for `btoa` on nodejs when creating dataURIs
- **v2.1.0**
  - New features:
    - Data URI support to insert images into IMG tags.
    - Using 'white smoke' (#f5f5f5) for white flag elements.
    - Autoloaded images have outlines to suit their size.
  - Bug fixes:
    - fix bottom white stripe path on 2nd Substitute.
  - General improvements to documentation, testing and example page.
- **v2.0.1**
  - fix: Loader should run immediately if DOM is already loaded
- **v2.0.0**
  - v2.0 breaks compatibility with the previous release v0.9.1.
  - v2.0 introduces the following features and improvements:
    - new API with `get()` and `all()` methods replacing `getSvg()`
    - Loader build for browsers with DOM traversal and auto-insertion
    - support for IE 11 and some other browsers through Babel
    - new 'square' shape option
    - new 'primary' colour option
    - improved designs for I, P and S flags
    - better test coverage
    - example HTML page

## Development

[![build](https://github.com/signal-flags/signal-flags-js/actions/workflows/build.yaml/badge.svg?branch=develop)](https://github.com/signal-flags/signal-flags-js/actions/workflows/build.yaml)

### Planned for v3.0

- implement API for changing configuration something like this:

```js
// Get the current configuration.
SignalFlags.config();
// Set the default to no outlines.
SignalFlags.config({ outline: false });
// Set the default colours to the `primary` colour set.
SignalFlags.config('colors', 'primary');
// Set a default colour (leaves other colours unchanged).
SignalFlags.config('colors', { black: '#000' });
```

- better test coverage for `check()` method
- add configuration to `factory()` method
- better test coverage for individual designs
- in-browser testing
- fix API for overrides to `flags` (individual flag designs) and `draw`
  (code implementing designs)

## Important information

Signal Flags code is Copyright © 2020
[signalflags.org](https://signalflags.org/) and is licensed under an
[MIT license](https://github.com/signal-flags/signal-flags-js/blob/master/LICENSE).

Signal Flags designs and images are in the public domain and to the extent
possible under law,
[signalflags.org](https://signalflags.org/) has waived all copyright and related
or neighboring rights to flag designs and images included with this software.

Signal Flags code, designs and images (together "the software") are provided 'as
is', without warranty of any kind, express or implied, including but not limited
to the warranties of merchantability, fitness for a particular purpose and
noninfringement. In no event shall the authors be liable for any claim, damages
or other liability, whether in an action of contract, tort or otherwise, arising
from, out of or in connection with the software or the use or other dealings in
the software.
