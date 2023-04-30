var roleDefender = {
    run: function(creep) {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const friends = creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.role == 'defender' });

        if (enemies.length && friends.length >= 2) {
            const rallyPoint = Game.flags['RallyPoint'];
            if (creep.pos.getRangeTo(rallyPoint) > 3) {
                creep.moveTo(rallyPoint);
            } else {
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (targets.length) {
                    creep.rangedAttack(targets[0]);
                }
            }
        } else {
            const rallyPoint = Game.flags['RallyPoint'];
            if (creep.pos.getRangeTo(rallyPoint) > 3) {
                creep.moveTo(rallyPoint);
            }
        }
    },

    spawnDefender: function(spawn) {
        const maxParts = Math.floor((spawn.room.energyCapacityAvailable - 50) / 150);
        const parts = Math.min(maxParts, 16);
        const defenderBody = Array(parts).fill([TOUGH, RANGED_ATTACK, MOVE]).flat();
        const defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');

        if (defenders.length < 2) {
            const newName = 'Defender' + Game.time;
            console.log('Spawning new defender: ' + newName);

            spawn.spawnCreep(defenderBody, newName, { memory: { role: 'defender' } });
        }
    }
};

module.exports = roleDefender;
