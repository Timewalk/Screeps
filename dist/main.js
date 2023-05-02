const source = require('./source');
const creep = require('./creep');
const diagnostics = require('./diagnostics');
const spawn = require('./spawn');
const roomObject = require('./roomObject');

module.exports.loop = function () {
    diagnostics.loop();
    creep.loop();

    for(let spawnName in Game.spawns) {
        Game.spawns[spawnName].spawnCreeps();
    }

}
