var spawner = {
    run: function() {
        // define the harvester's body
        const harvesterBody = [WORK, CARRY, MOVE];

        // define the upgrader's body
        const upgraderBody = [WORK, CARRY, MOVE];

        // loop over all spawns
        for(const spawnName in Game.spawns) {
            // get the spawn object
            const spawn = Game.spawns[spawnName];

            // get the sources in the room
            const sources = spawn.room.find(FIND_SOURCES);

            // get the harvesters in the room
            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

            // get the upgraders in the room
            const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

            // spawn a new harvester for each source if there isn't one already
            if(harvesters.length < sources.length) {
                const newName = 'Harvester' + Game.time;

                console.log('Spawning new harvester: ' + newName);

                spawn.spawnCreep(harvesterBody, newName,
                    {memory: {role: 'harvester'}});
            }

            // spawn a new upgrader if there are less than 2
            else if(upgraders.length < 2) {
                const newName = 'Upgrader' + Game.time;

                console.log('Spawning new upgrader: ' + newName);

                spawn.spawnCreep(upgraderBody, newName,
                    {memory: {role: 'upgrader'}});
            }
        }
    }
};

module.exports = spawner;
