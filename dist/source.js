Object.defineProperty(Source.prototype, 'container', {
    configurable: true,
    get: function() {
        if(this.memory.containerId) {
            let container = Game.getObjectById(this.memory.containerId);

            // If the stored object is a completed container, return it
            if(container && container.structureType === STRUCTURE_CONTAINER) {
                return container;
            }
            // If the stored object is a construction site, return it
            else if(container && container.structureType === STRUCTURE_CONSTRUCTION_SITE) {
                return container;
            }
        }

        // Find existing containers or construction sites
        let container = this.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        })[0];

        let constructionSite = this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
            filter: site => site.structureType === STRUCTURE_CONTAINER
        })[0];

        if(container) {
            this.memory.containerId = container.id;
            return container;
        }
        else if(constructionSite) {
            this.memory.containerId = constructionSite.id;
            return constructionSite;
        }
        else {
            // Find all valid positions near the source
            const validPositions = [];
            for (let x = this.pos.x - 1; x <= this.pos.x + 1; x++) {
                for (let y = this.pos.y - 1; y <= this.pos.y + 1; y++) {
                    const position = new RoomPosition(x, y, this.room.name);
                    if (position.lookFor(LOOK_TERRAIN)[0] !== 'wall') {
                        validPositions.push(position);
                    }
                }
            }

            // Find the closest valid position to the source and build a container there
            const position = this.pos.findClosestByRange(validPositions);
            const result = this.room.createConstructionSite(position, STRUCTURE_CONTAINER);

            // If construction site creation was successful, store its id
            if(result === OK) {
                const newConstructionSite = position.lookFor(LOOK_CONSTRUCTION_SITES)[0];
                if(newConstructionSite) {
                    this.memory.containerId = newConstructionSite.id;
                    return newConstructionSite;
                }
            }
        }

        return null;
    }
});

// calculate how many available harvesting spots there are around the source
Source.prototype.getAvailableHarvestingSpots = function() {
    let availableHarvestingSpots = 0;
    for (let x = this.pos.x - 1; x <= this.pos.x + 1; x++) {
        for (let y = this.pos.y - 1; y <= this.pos.y + 1; y++) {
            const position = new RoomPosition(x, y, this.room.name);
            if (position.lookFor(LOOK_TERRAIN)[0] !== 'wall') {
                availableHarvestingSpots++;
            }
        }
    }
    return availableHarvestingSpots;
}

// calculate how many harvesting spots are currently occupied by a creep
Source.prototype.openHarvestingSpots = function() {
    return this.getAvailableHarvestingSpots() - this.workers.length;
}


Source.prototype.needMoreWorkers = function() {
    // Calculate the number of work parts on all workers
    let workParts = 0;
    if (this.workers && this.workers.length > 0) {
        workParts = this.workers.reduce((sum, worker) => sum + worker.getActiveBodyparts(WORK), 0);
    }

    // Calculate the number of work parts needed to fully deplete the source every 300 ticks
    let workPartsNeeded = 5;

    // Return whether more workers are needed
    return (workPartsNeeded > workParts);
};



