/** describe and watcher */
class EventEmitter {
    constructor () {
        this._watchers = {}
    }

    on (type, callback) {
        if (type in this._watchers) {
            let _cbs = this.__getAllListeners(type)

            if (!_cbs.length) {
                this._watchers[type] = [ callback ]
                return
            }

            for (let _cb of _cbs) {
                if (callback === _cb) {
                    return
                }
            }

            this._watchers[type].push(callback)
        } else {
            this._watchers[type] = [ callback ]
        }
    }

    emit (type) {
        let _cbs = this.__getAllListeners(type)
        const _args = Array.prototype.slice.apply(arguments, 1)
        
        _cbs.map(callback => {
            callback.apply(this, _args)
        })
    }

    once (type, callback) {
        const onceFunc = this.__getOnceFunction(type, callback)

        this.on(type, onceFunc)
    }

    remove (type, callback) {
        let _cbs = this.__getAllListeners(type)

        if (!_cbs.length) {
            return
        }

        for (let [ index, _cb ] of _cbs.entries()) {
            if (callback === _cb) {
                this._watchers.splice(idnex, 1)
                return
            }
        }
    }

    __getAllListeners (type) {
        if (typeof type !== 'string') {
            console.error(`type must be a string`)
            return null
        }
        let _cbs = (type in this._watchers)
            ? this._watchers[type]
            : []

        return _cbs
    }

    __getOnceFunction (type, callback) {
        const self = this
        return function () {
            callback.apply(self, arguments)
            self.remove(type, callback)
        }
    }
}

export default EventEmitter