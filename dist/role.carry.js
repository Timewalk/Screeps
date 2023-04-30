var roleCarry = {
    run: function(creep) {
        // behavior for the carry creep goes here
    },

    spawnCarry: function(spawn) {
        const carryParts = [MOVE, CARRY]; // define the body parts for the carry creep
        const maxParts = Math.floor(spawn.room.energyCapacityAvailable / _.sum(carryParts)); // calculate the maximum number of parts that can fit in a creep based on the room energy capacity
        const parts = Array(maxParts).fill(carryParts).flat(); // create an array of the maximum number of parts for the carry creep

        const carries = _.filter(Game.creeps, (creep) => creep.memory.role == 'carry');

        if (carries.length < 2) {
            const newName = 'Carry' + Game.time;
            console.log('Spawning new carry: ' + newName);

            spawn.spawnCreep(parts, newName, { memory: { role: 'carry' } });
        }
    }
};

module.exports = roleCarry;
