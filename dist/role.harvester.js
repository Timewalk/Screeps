const _ = require("lodash/fp");

const roleHarvester = {
    spawnHarvester: function(spawn) {
        // get all the sources in the room
        const sources = spawn.room.find(FIND_SOURCES);
        // get all the harvesters in the room
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        // spawn a new harvester for each source in the room that doesn't already have a harvester assigned to it
        sources.forEach(source => {
            const assignedHarvester = _.find(harvesters, (harvester) => harvester.memory.sourceId == source.id);
            if (!assignedHarvester) {
                // Build the harvester body array with the specified number of parts
                let harvesterParts = [].push([CARRY]);
                let energyCapacity = spawn.room.energyCapacityAvailable - BODYPART_COST[CARRY];

                while (energyCapacity >= (BODYPART_COST[WORK] + BODYPART_COST[MOVE])) {
                    harvesterParts.push([WORK, MOVE]);
                    energyCapacity -= (BODYPART_COST[WORK] + BODYPART_COST[MOVE]);
                }

                const newName = 'Harvester' + Game.time;
                console.log(`Spawning new harvester ${newName} for source ${source.id}`);

                spawn.spawnCreep(harvesterParts, newName, { memory: { role: 'harvester', sourceId: source.id } });
            }
        });
    },

    run: function(creep) {
        const source = Game.getObjectById(creep.memory.sourceId);

        // check for nearby enemies
        const enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
        if (enemies.length > 0) {
            // move away from enemies
            creep.move(creep.pos.getDirectionTo(creep.pos.findClosestByRange(enemies).pos));
        } else {
            // harvest from source
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleHarvester;
