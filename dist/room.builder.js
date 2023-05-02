const roomBuilder = {
    buildRoads: function(room) {

        // update the function to build roads from all sources to my flag called 'RallyPoint'
        // create a Path from the source to the flag and store it in the source memory
        // verify the flag exists and is mine
        // find the flag called 'RallyPoint'
        if (!Game.flags['RallyPoint']) {
            return;
        }
        const rallyPoint = Game.flags['RallyPoint'];
        const sources = room.find(FIND_SOURCES);

        sources.forEach(source => {
            // find the path from the source to the rally point
            const path = source.pos.findPathTo(rallyPoint);

            // make sure the source memory is initialized
            // make sure the source memory has a paths property
            if (!source.memory) {
                source.memory = {};
            }
            if (!source.memory.paths) {
                source.memory.paths = {};
            }

            // store the path in the source memory
            source.memory.paths[rallyPoint.name] = path;

            // for each position in the path
            // create a road construction site at the position
            path.forEach(position => {
                const roomPosition = new RoomPosition(position.x, position.y, room.name);
                console.log('Creating road construction site at ' + roomPosition);
                let result = room.createConstructionSite(roomPosition, STRUCTURE_ROAD);
                console.log('Result: ' + result);
            });
        });
    },

    buildContainers: function(room) {
        const sources = room.find(FIND_SOURCES);

        sources.forEach(source => {
            // for each source in the room
            // create a container construction site at a valid position near the source
            // only if there is not already a container near the source

            // check for nearby containers
            const nearbyContainers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType === STRUCTURE_CONTAINER
            });

            // if there is already a container near the source, don't build another one
            if (nearbyContainers.length !== 0) {
                return;
            }

            // check for nearby construction sites
            const nearbyConstructionSites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                filter: site => site.structureType === STRUCTURE_CONTAINER
            });

            // if there is already a container construction site near the source, don't build another one
            if (nearbyConstructionSites.length !== 0) {
                return;
            }

            // find all valid positions near the source
            const validPositions = [];
            for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
                for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
                    const position = new RoomPosition(x, y, room.name);
                    if (position.lookFor(LOOK_TERRAIN)[0] !== 'wall') {
                        validPositions.push(position);
                    }
                }
            }

            // find the closest valid position to the source and build a container there
            const position = source.pos.findClosestByRange(validPositions);
            room.createConstructionSite(position, STRUCTURE_CONTAINER);
        });
    }
};

module.exports = roomBuilder;
