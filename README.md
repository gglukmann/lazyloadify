# lazyloadify

A tool for lazy-loading images that reach a parent container, such as the viewport.

## Usage

```code
import Lazyloadify from 'lazyloadify';

const options = {};
const imageLoader = new Lazyloadify(options);

imageLoader.load();
```

## Options

Plain Intersection Observer options. See [Intersection Observer API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
