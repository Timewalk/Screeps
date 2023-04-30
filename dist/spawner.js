const defenderSpawner = require('role.defender');
const harvesterSpawner = require('role.harvester');

var spawner = {
    run: function() {
        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];
            harvesterSpawner.spawnHarvester(spawn);
            console.log('Spawn name: ' + spawn);
        }
    }
};

module.exports = spawner;
