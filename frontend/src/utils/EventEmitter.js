export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }

    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, onceListener);
            listener.apply(this, args);
        };
        return this.on(event, onceListener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return this;

        if (!listenerToRemove) {
            delete this.events[event];
            return this;
        }

        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );

        if (this.events[event].length === 0) {
            delete this.events[event];
        }

        return this;
    }

    emit(event, ...args) {
        if (!this.events[event]) return false;

        this.events[event].forEach(listener => {
            try {
                listener.apply(this, args);
            } catch (error) {
                console.error(`Error in event listener for '${event}':`, error);
            }
        });

        return true;
    }

    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
        return this;
    }

    listenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }

    eventNames() {
        return Object.keys(this.events);
    }
}
