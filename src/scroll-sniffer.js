class ScrollSniffer {
    constructor(el) {
        this.listenerElement = document.querySelectorAll(el);
        this.scrollTop = 0;
        this.scrollBottom = window.innerHeight;
        this.currentlyIn = [];
        this.currentlyAllIn = [];
        this.currentlyUp = [];
        this.currentlyAllUp = [];
    }

    listen() {
        if (!this.listenerElement.length) {
            console.error("No elements to listen to!");
        } else {
            this._addEvents();
        }
    }

    _addEvents() {
        window.addEventListener("scroll", (e) => {
            this.scrollTop = window.scrollY;
            this.scrollBottom = window.scrollY + window.innerHeight;
            this._watchListeners();
        });
    }

    _watchListeners() {
        this.listenerElement.forEach((el) => {
            const top = el.offsetTop;
            const bottom = el.offsetTop + el.offsetHeight;

            if (
                top <= this.scrollBottom &&
                top - this.scrollTop > 0 &&
                !this.currentlyUp.includes(el) &&
                !this.currentlyIn.includes(el) &&
                bottom > this.scrollBottom
            ) {
                el.dispatchEvent(new Event("Scroll:in:bottom"));
                el.dispatchEvent(new Event("Scroll:in"));
                this.currentlyIn.push(el);
            }

            if (top > this.scrollBottom && this.currentlyIn.includes(el)) {
                el.dispatchEvent(new Event("Scroll:allOut:bottom"));
                el.dispatchEvent(new Event("Scroll:allOut"));

                this.currentlyIn = this.currentlyIn.filter((e) => e !== el);
                this.currentlyAllIn = this.currentlyAllIn.filter((e) => e !== el);
            }

            if (
                top <= this.scrollBottom &&
                bottom <= this.scrollBottom &&
                !this.currentlyUp.includes(el) &&
                !this.currentlyAllIn.includes(el)
            ) {
                el.dispatchEvent(new Event("Scroll:allIn:bottom"));
                el.dispatchEvent(new Event("Scroll:allIn"));
                this.currentlyAllIn.push(el);
            }

            if (bottom > this.scrollBottom && this.currentlyAllIn.includes(el)) {
                el.dispatchEvent(new Event("Scroll:out:bottom"));
                el.dispatchEvent(new Event("Scroll:out"));
                this.currentlyAllIn = this.currentlyAllIn.filter((e) => e !== el);
            }

            if (top - this.scrollTop < 0 && !this.currentlyUp.includes(el)) {
                el.dispatchEvent(new Event("Scroll:out:top"));
                el.dispatchEvent(new Event("Scroll:out"));
                this.currentlyAllIn = this.currentlyAllIn.filter((e) => e !== el);
                this.currentlyUp.push(el);
            }

            if (top - this.scrollTop > 0 && this.currentlyUp.includes(el)) {
                el.dispatchEvent(new Event("Scroll:allIn:top"));
                el.dispatchEvent(new Event("Scroll:allIn"));
                this.currentlyUp = this.currentlyUp.filter((e) => e !== el);
                this.currentlyAllIn.push(el);
            }

            if (bottom - this.scrollTop < 0 && !this.currentlyAllUp.includes(el)) {
                el.dispatchEvent(new Event("Scroll:allOut:top"));
                el.dispatchEvent(new Event("Scroll:allOut"));
                this.currentlyAllUp.push(el);
                this.currentlyIn = this.currentlyIn.filter((e) => e !== el);
            }

            if (bottom - this.scrollTop >= 0 && this.currentlyAllUp.includes(el)) {
                el.dispatchEvent(new Event("Scroll:in:top"));
                el.dispatchEvent(new Event("Scroll:in"));
                this.currentlyAllUp = this.currentlyAllUp.filter((e) => e !== el);
                this.currentlyIn.push(el);
            }
        });
    }
}

export default ScrollSniffer;