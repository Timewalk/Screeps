
StructureSpawn.prototype.spawnCreeps = function() {
    // Get all sources in the room
    const sources = this.room.find(FIND_SOURCES);


};

StructureSpawn.prototype.spawnHarvester = function(sourceId) {
    const body = [MOVE,CARRY];
    const creepName = 'Harvester' + Game.time;
    // Get the max energy of the room
    let maxEnergy = this.room.energyCapacityAvailable;
    let maxWorkParts = 10;
    maxEnergy -= BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
    while (maxEnergy >= BODYPART_COST[WORK] && maxWorkParts > 0) {
        body.push(WORK);
        maxEnergy -= BODYPART_COST[WORK];
        maxWorkParts--;
    }

    console.log(body);
    const spawnResult = this.spawnCreep(body, creepName, {
        memory: {
            role: 'harvester',
            targetId: sourceId
        }
    });

    if (spawnResult === OK) {
        // If the creep was successfully spawned, add it to the source's worker list
        const source = Game.getObjectById(sourceId);
        source.register(Game.creeps[creepName]);
    }
}

