module.exports.loop = function () {
    // for each creep in the game
    for (const name in Game.creeps) {
        // Check if the creep is still alive
        if (!Game.creeps[name]) {
            // If the creep is dead, deregister it from its target
            const creep = Game.creeps[name];
            creep.target.deregister(creep);
            // then delete it from memory
            delete Memory.creeps[name];
            continue;
        }
        // Do work

        Game.creeps[name].work();
    }
}


Creep.prototype.farm = function() {

    let enemyCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (enemyCreep && this.pos.getRangeTo(enemyCreep) < 10) {
        // Calculate the direction to the enemy creep
        let directionToEnemy = this.pos.getDirectionTo(enemyCreep);

        // Calculate the opposite direction
        let oppositeDirection = (directionToEnemy + 4) % 8 + 1;

        // Move in the opposite direction
        this.move(oppositeDirection);
        this.say('Danger!');
    }

    if (this.store.getUsedCapacity() < this.store.getFreeCapacity()) {
        if (this.harvest(this.target) === ERR_NOT_IN_RANGE) {
            this.say('Moving');
            this.moveTo(this.target);
        }
    } else {
        if (this.target.container.hits < this.target.container.hitsMax) {
            this.say('Repairing');
            if (this.repair(this.target.container) === ERR_NOT_IN_RANGE) {
                this.moveTo(this.target.container);
            }
        } else {
            switch (this.transfer(this.target.container, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
                    this.say('Moving');
                    this.moveTo(this.target.container);
                    break;
                case ERR_FULL:
                    this.say('Drop')
                    this.drop(RESOURCE_ENERGY);
                    break;
                case ERR_INVALID_TARGET:
                    this.say('Building')
                    this.build(this.target.container);
                    break;
            }
        }
    }
}

Object.defineProperty(Creep.prototype, 'target', {
    configurable: true,
    get: function() {
        if(!this._target) {
            if(this.memory.targetId){
                // Fetch the target from the memory using the id
                this._target = Game.getObjectById(this.memory.targetId);

                // If the target does not exist anymore in the game (might have been destroyed)
                if (!this._target) {
                    this.memory.targetId = null;
                }
            } else {
                // Define how to set a new target. This highly depends on your game logic.
                // You could find a source, an enemy, a structure to repair, etc.
                // For now, let's just set it to null.
                this._target = null;
            }
        }
        return this._target;
    },
    set: function(target) {
        if (target instanceof RoomObject) {
            this._target = target;
            this.memory.targetId = target.id;
        } else {
            this._target = null;
            this.memory.targetId = null;
        }
    }
});


Creep.prototype.work = function() {

    // Check what type of game object the target is
    if (this.target instanceof Source) {
        this.farm();
    }
}