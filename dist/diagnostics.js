module.exports.loop = function () {
    // create a syle that all the visuals will use
    const style = {
        align: 'Left',
        backgroundColor: 'rgba(0,0,0,0)',
        padding: 0.1,
        color: '#ffffff',
        font: '0.5 Arial',
        stroke: '#000000',
        strokeWidth: 0.15,
        opacity: 0.5
    }

    // Create a window in the upper left corner of the screen
    // this is where the visuals will be displayed
    let x = 0;
    let y = 0;

    // for each room in the game
    for (const name in Game.rooms) {
        // creae a room visual at the top left corner of the window
        // display the room name
        const roomVisual = new RoomVisual(name);
        roomVisual.text(name, x, y += 1, style);

        // Add a Header for the Sources
        roomVisual.text('Sources', x += 1, y += 1, style);

        // for each source in the room
        // create a room visual at the source position
        // display the source energy level
        for (const source of Game.rooms[name].find(FIND_SOURCES)) {
            roomVisual.text(source.id + ' ' + source.energy, x + 1, y += 1, style);
        }

        // Add a Header for the Creeps
        roomVisual.text('Creeps', x, y += 1, style);
        // for each creep in the room
        // create a room visual at the creep position
        // display the creep role and ticks to live
        for (const creep of Game.rooms[name].find(FIND_CREEPS)) {
            // if the creep is mine display the role and ticks to live
            if (creep.my) {
                roomVisual.text(creep.memory.role + ' ' + creep.ticksToLive, x + 1, y += 1, style);
            } else {
                // if the creep is not mine display the owner and ticks to live
                roomVisual.text(creep.owner.username + ' ' + creep.hitsMax, x + 1, y += 1, style);
            }
        }

        // Add a Header for the Structures
        roomVisual.text('Structures', x, y += 1, style);
        // for each structure in the room
        // create a room visual at the structure position
        // display the structure type and hits
        for (const structure of Game.rooms[name].find(FIND_STRUCTURES)) {
            // if structure is the room controller display the level
            if (structure.structureType === STRUCTURE_CONTROLLER) {
                roomVisual.text(structure.structureType + ' ' + structure.level, x + 1, y += 1, style);
            } else if (structure.structureType === STRUCTURE_SPAWN) {
                // if structure is a spawn display the room energy level
                roomVisual.text(structure.structureType + ' ' + structure.room.energyAvailable + '/' + structure.room.energyCapacityAvailable, x + 1, y += 1, style);
            } else {
                // if structure is not a spawn or controller display the structure type and hits
                roomVisual.text(structure.structureType + ' ' + structure.hits, x + 1, y += 1, style);
            }
        }

        // Add a Header for the Construction Sites
        roomVisual.text('Construction Sites', x, y += 1, style);
        // Get the total number of each type of construction site in the room
        const constructionSites = Game.rooms[name].find(FIND_CONSTRUCTION_SITES);
        const constructionSitesByTypeCount = _.countBy(constructionSites, 'structureType');

        // for each type of construction site
        // display the type and the number of construction sites of that type
        for (const type in constructionSitesByTypeCount) {
            roomVisual.text(type + ' ' + constructionSitesByTypeCount[type], x + 1, y += 1, style);
        }

        // Add a Header for spawns
        roomVisual.text('Spawns', x, y += 1, style);

        // for each spawn in the room
        // Add a line for the spawn
        for (const spawn of Game.rooms[name].find(FIND_MY_SPAWNS)) {
            // if the spawn is spawning display the creep role and time to spawn
            if (spawn.spawning) {
                roomVisual.text(spawn.spawning.name + ' ' + spawn.spawning.remainingTime, x + 1, y += 1, style);
            } else {
                // if not spawning display the room energy level vs the max room energy level
                roomVisual.text(spawn.room.energyAvailable + '/' + spawn.room.energyCapacityAvailable, x + 1, y += 1, style);
            }
        }

    }
}