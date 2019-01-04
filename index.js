class Lazyloadify {
    /**
     * @constructor
     */
    constructor(options={}) {
        this.imageCount = 0;
        this.observer = false;
        this.selectorClass = options.selectorClass || '.js-lazyload';
        this.loadedClass = options.loadedClass || 'js-lazyloaded';
        this.rootElement = options.rootElement || null;
        this.rootMargin = options.rootMargin || '0px';
        this.treshold = options.treshold || 0;
    }

    /**
     * Add IntersectionObserver to images.
     *
     * @function load
     * @param {Object} options - User options for tweaking the behaviour
     * @return {void}
     */
    load() {
        // Get all of the images that are marked up to lazy load
        const images = document.querySelectorAll(this.selectorClass);
        const config = {
            // If the image gets within 50px in the Y axis, start the download.
            root: this.rootElement,
            rootMargin: this.rootMargin,
            threshold: this.treshold
        };
        this.imageCount = images.length;

        // If we don't have support for intersection observer, loads the images immediately
        if (!('IntersectionObserver' in window)) {
            this.loadImagesImmediately(images);
        } else {
            // It is supported, load the images
            this.observer = new IntersectionObserver(entries => {
                // Disconnect if we've already loaded all of the images
                if (this.imageCount === 0) {
                    this.disconnect();
                }

                // Loop through the entries
                for (const entry of entries) {
                    // Are we in viewport?
                    if (entry.intersectionRatio > 0) {
                        this.imageCount--;

                        // Stop watching and load the image
                        this.observer.unobserve(entry.target);
                        this.preloadImage(entry.target);
                    }
                }
            }, config);

            for (const image of images) {
                if (image.classList.contains(loadedClass)) {
                    continue;
                }

                this.observer.observe(image);
            }
        }
    }

    /**
     * Fetchs the image for the given URL.
     *
     * @function fetchImage
     * @param {String} url - Url from data-src.
     * @return {Promise}
     */
    fetchImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.onload = resolve;
            image.onerror = reject;
        });
    }

    /**
     * Preloads the image.
     *
     * @function preloadImage
     * @param {Object} image - Image to preload.
     * @return {*}
     */
    preloadImage(image) {
        const src = image.dataset.src;
        if (!src) {
            return;
        }

        return this.fetchImage(src).then(() => {
            this.applyImage(image, src);
        });
    }

    /**
     * Load all of the images immediately.
     *
     * @function loadImagesImmediately
     * @param {NodeListOf<Element>} images - Image to load.
     * @return {void}
     */
    loadImagesImmediately(images) {
        for (const image of images) {
            this.preloadImage(image);
        }
    }

    /**
     * Disconnect the observer.
     *
     * @function disconnect
     * @return {void}
     */
    disconnect() {
        if (!this.observer) {
            return;
        }

        this.observer.disconnect();
    }

    /**
     * Apply the image.
     *
     * @function applyImage
     * @param {Object} img - Image HTMLElement.
     * @param {String} src - Source url to apply.
     * @return {void}
     */
    applyImage(img, src) {
        // Prevent this from being lazy loaded a second time.
        img.classList.remove(this.selectorClass);
        img.classList.add(this.loadedClass);

        if (img.tagName.toLowerCase() === 'img') {
            img.src = src;
        } else {
            img.style.backgroundImage = 'url(' + src + ')';
        }
    }
}

export default Lazyloadify;
