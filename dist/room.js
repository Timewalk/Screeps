module.exports.loop = function () {
    // For each source in the room
    this.sources.forEach(source => {
        // If the number of WORK parts in the source's workers is less than the work parts needed to farm it
        if (source.needMoreWorkers()) {
            if (source.openHarvestingSpots() > 0) {
                this.spawnHarvester(source.id)
            }
        }
    });
}


Room.prototype.spawnCreeps = function() {
    this.sources.forEach(source => {
       if (source.needMoreWorkers()) {
           const body = [WORK, CARRY, MOVE]; // Basic body parts for a harvester
           const creepName = 'Harvester' + Game.time;

           const spawnResult = this.spawnCreep(body, creepName, {
               memory: {
                   role: 'harvester',
                   targetId: source.id
               }
           });
       }
    });
}

Object.defineProperty(Room.prototype, 'sources', {
    configurable: true,
    get: function() {
        if (!this._sources) {
            if (!this.memory.sourceIds) {
                this._sources = this.find(FIND_SOURCES);
                this.memory.sourceIds = _.map(this._sources, source => source.id);
            } else {
                this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
            }
        }
        return this._sources; // Return the sources
    }
});
