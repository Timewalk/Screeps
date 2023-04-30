var spawner = {
    run: function() {
        // loop over all spawns
        for(const spawnName in Game.spawns) {
            // get the spawn object
            const spawn = Game.spawns[spawnName];

            // check if we already have cached sources, if not, cache them
            if(!spawn.memory.sources) {
                spawn.memory.sources = spawn.room.find(FIND_SOURCES).map(source => source.id);
            }

            // only create new harvesters if we have energy to spare
            if(spawn.room.energyAvailable < spawn.room.energyCapacityAvailable) {
                continue;
            }

            // calculate the maximum number of parts we can afford
            const maxParts = Math.floor((spawn.room.energyCapacityAvailable - 50) / 150);

            // ensure the harvester's body does not exceed 50 parts
            const parts = Math.min(maxParts, 16);  // 16*3 parts + 1 MOVE part = 49 parts

            // create the harvester's body dynamically
            const harvesterBody = Array(parts).fill([WORK, CARRY]).flat();
            harvesterBody.unshift(MOVE);

            // for each source, check if there is a harvester assigned to it
            for (const sourceId of spawn.memory.sources) {
                const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId);

                // spawn a new harvester if there is not one already
                if(harvesters.length === 0) {
                    const newName = 'Harvester' + Game.time;

                    console.log('Spawning new harvester: ' + newName);

                    spawn.spawnCreep(harvesterBody, newName,
                        {memory: {role: 'harvester', sourceId: sourceId}});
                }
            }
        }
    }
};

module.exports = spawner;
