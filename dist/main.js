const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleDefender = require('role.defender');
const spawner = require('spawner');

module.exports.loop = function () {
    spawner.run();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        if (role == 'harvester') {
            roleHarvester.run(creep);
        } else if (role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (role == 'defender') {
            roleDefender.run(creep);
        }
    }
}
