Object.defineProperty(RoomObject.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.memory)) {
            Memory.memory = {};
        }
        if(!_.isObject(Memory.memory)) {
            return undefined;
        }
        return Memory.memory[this.id] =
            Memory.memory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.memory)) {
            Memory.memory = {};
        }
        if(!_.isObject(Memory.memory)) {
            throw new Error('Could not set source memory');
        }
        Memory.memory[this.id] = value;
    }
});

Object.defineProperty(RoomObject.prototype, 'workers', {
    configurable: true,
    get: function() {
        if (!this._workers) {
            this._workers = [];
            if (this.memory.workerNames) {
                this.memory.workerNames.forEach((name) => {
                    let worker = Game.creeps[name];
                    if (worker) {
                        this._workers.push(worker);
                    }
                });
            }
        }
        return this._workers;
    },
    set: function() {
        throw new Error('Use addWorker and removeWorker to modify workers.');
    }
});

RoomObject.prototype.register = function(creep) {
    if (creep instanceof Creep) {
        // Check if the creep is already registered as a worker
        if (!this.workers.some(worker => worker.name === creep.name)) {
            // Add the creep to the workers array
            if (!this._workers) {
                this._workers = [creep];
            } else {
                this._workers.push(creep);
            }
            // Store the creep's name in memory
            if (!this.memory.workerNames) {
                this.memory.workerNames = [creep.name];
            } else {
                this.memory.workerNames.push(creep.name);
            }
        }
    }
};

RoomObject.prototype.addWorker = function(name) {
    if (!this.memory.workerNames) {
        this.memory.workerNames = [name];
    } else {
        this.memory.workerNames.push(name);
    }
}

RoomObject.prototype.deregister = function(creep) {
    if (creep instanceof Creep) {
        // Check if the creep is already registered as a worker
        if (this.workers.some(worker => worker.name === creep.name)) {
            // Remove the creep from the workers array
            if (this._workers) {
                _.remove(this._workers, w => w.name === creep.name);
            }
            // Remove the creep's name from memory
            if (this.memory.workerNames) {
                _.remove(this.memory.workerNames, name => name === creep.name);
            }
        }
    }
};
