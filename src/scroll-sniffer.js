class ScrollSniffer {
  constructor(el) {
    this.listenerElement = document.querySelectorAll(el);
    this.scrollTop = 0;
    this.scrollBottom = window.innerHeight;
    this.currentlyIn = [];
    this.currentlyAllIn = [];
    this.currentlyUp = [];
    this.currentlyAllUp = [];
    this.scrollingUp = false;
    this.scrollingDown = false;
    this.atTop = true;
    this.atBottom = false;
    this.stopFlag = true;
  }

  listen() {
    this._addEvents();
  }

  _addEvents() {
    window.addEventListener("load", () => {
      if (window.scrollY === 0) {
        document.dispatchEvent(new Event("Scroll:atTop"));
        document.dispatchEvent(
          new CustomEvent("Scroll:atTop?", {
            detail: {
              atTop: true,
            },
          })
        );
        this.atTop = true;
      } else {
        document.dispatchEvent(new Event("Scroll:notAtTop"));
        document.dispatchEvent(
          new CustomEvent("Scroll:atTop?", {
            detail: {
              atTop: false,
            },
          })
        );
        this.atTop = false;
      }

      if (this._getDocHeight() === this.scrollTop + window.innerHeight) {
        document.dispatchEvent(new Event("Scroll:atBottom"));
        document.dispatchEvent(
          new CustomEvent("Scroll:atBottom?", {
            detail: {
              atBottom: true,
            },
          })
        );
        this.atBottom = true;
      } else {
        document.dispatchEvent(new Event("Scroll:notAtBottom"));
        document.dispatchEvent(
          new CustomEvent("Scroll:atBottom?", {
            detail: {
              atBottom: false,
            },
          })
        );
        this.atBottom = false;
      }
    });
    window.addEventListener("scroll", (e) => {
      this.scrollTop = window.scrollY;
      this.scrollBottom = window.scrollY + window.innerHeight;

      if (this.listenerElement.length) {
        this._watchListeners();
      }

      if (this.oldScroll > this.scrollTop) {
        if (this.scrollingDown && !this.scrollingUp) {
          document.dispatchEvent(new Event("Scroll:up"));
        } else if (!this.scrollingUp && !this.scrollingDown) {
          document.dispatchEvent(new Event("Scroll:up"));
        }
        this.scrollingUp = true;
        this.scrollingDown = false;
      } else if (this.oldScroll < this.scrollTop) {
        if (this.scrollingUp && !this.scrollingDown) {
          document.dispatchEvent(new Event("Scroll:down"));
        } else if (!this.scrollingUp && !this.scrollingDown) {
          document.dispatchEvent(new Event("Scroll:down"));
        }
        this.scrollingUp = false;
        this.scrollingDown = true;
      }

      if (this.scrollTop === 0) {
        if (!this.atTop) {
          document.dispatchEvent(new Event("Scroll:atTop"));
          document.dispatchEvent(
            new CustomEvent("Scroll:atTop?", {
              detail: {
                atTop: true,
              },
            })
          );
          this.atTop = true;
        }
      } else {
        if (this.atTop) {
          document.dispatchEvent(new Event("Scroll:notAtTop"));
          document.dispatchEvent(
            new CustomEvent("Scroll:atTop?", {
              detail: {
                atTop: false,
              },
            })
          );
          this.atTop = false;
        }
      }

      if (this._getDocHeight() === this.scrollTop + window.innerHeight) {
        if (!this.atBottom) {
          document.dispatchEvent(new Event("Scroll:atBottom"));
          document.dispatchEvent(
            new CustomEvent("Scroll:atBottom?", {
              detail: {
                atBottom: true,
              },
            })
          );
          this.atBottom = true;
        }
      } else {
        if (this.atBottom) {
          document.dispatchEvent(new Event("Scroll:notAtBottom"));
          document.dispatchEvent(
            new CustomEvent("Scroll:atBottom?", {
              detail: {
                atBottom: false,
              },
            })
          );
          this.atBottom = false;
        }
      }

      this.oldScroll = this.scrollTop;
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

  _getDocHeight() {
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    return height;
  }
}

export default ScrollSniffer;