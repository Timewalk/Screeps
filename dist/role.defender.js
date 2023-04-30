var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if(enemies.length) {
            if(creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies[0]);
            }
        } else {
            // If there are no enemies, move back to a rally point (for example, near the spawn)
            // The following assumes there's a flag named 'RallyPoint'. Replace as necessary.
            var rallyPoint = Game.flags['RallyPoint'];
            if(rallyPoint && creep.pos.getRangeTo(rallyPoint) > 3) {
                creep.moveTo(rallyPoint);
            }
        }
    }
};

module.exports = roleDefender;
