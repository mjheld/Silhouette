/** 
 *  The structure that is being created as the game progresses
**/ 
class Structure extends GameObject {
    
    /** 
     *  Represents a Structure
     *  
     *  @constructor
    **/ 
    constructor () {
        super ();
        
        this.cubes         = new Map ();
        this.adjacentCubes = new Map ();
        this.latestCube    = new Cube ();
        this.negBound      = glMatrix.vec3.fromValues ( 0, 0, 0 );
        this.posBound      = glMatrix.vec3.fromValues ( 0, 0, 0 );
        this.diameter      = 1;
    }
    
    /** 
     *  Adds a cube to an existing cube face ( exposed to air ) in the structure
     *  
     *  @returns { glMatrix.vec3 | null } - A vec3 to move the camera in order to keep it
     *                                      centered on the structure or null if no movement
     *                                      is required
    **/ 
    addCube () {
        let key = this.latestCube.position.toString ();
        
        // Add the latest cube in the structure to the list of existing cubes
        this.cubes.set ( key, this.latestCube );
        this.addAdjacentCubes ();
        
        // Choose a new cube to add as the latest cube
        key             = Random.randomEntryInMap ( this.adjacentCubes );
        this.latestCube = this.adjacentCubes.get ( key );
        
        this.adjacentCubes.delete ( key );
        
        return this.updateBounds ();
    }
    
    /** 
     *  Rotates the structure up
    **/ 
    rotateUp () {
        let move     = glMatrix.quat.create ();
        let rotation = glMatrix.quat.clone ( this.orientation );
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.fromEuler ( move, -90.0, 0.0, 0.0 );
        
        glMatrix.quat.invert ( inverse, rotation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        glMatrix.quat.multiply ( this.orientation, this.orientation, inverse );
        glMatrix.quat.multiply ( this.orientation, this.orientation, move );
        glMatrix.quat.multiply ( this.orientation, this.orientation, rotation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
    }
    
    /** 
     *  Rotates the structure down
    **/ 
    rotateDown () {
        let move     = glMatrix.quat.create ();
        let rotation = glMatrix.quat.clone ( this.orientation );
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.fromEuler ( move, 90.0, 0.0, 0.0 );
        
        glMatrix.quat.invert ( inverse, rotation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        glMatrix.quat.multiply ( this.orientation, this.orientation, inverse );
        glMatrix.quat.multiply ( this.orientation, this.orientation, move );
        glMatrix.quat.multiply ( this.orientation, this.orientation, rotation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
    }
    
    /** 
     *  Rotates the structure left
    **/ 
    rotateLeft () {
        let move     = glMatrix.quat.create ();
        let rotation = glMatrix.quat.clone ( this.orientation );
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.fromEuler ( move, 0.0, -90.0, 0.0 );
        
        glMatrix.quat.invert ( inverse, rotation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        glMatrix.quat.multiply ( this.orientation, this.orientation, inverse );
        glMatrix.quat.multiply ( this.orientation, this.orientation, move );
        glMatrix.quat.multiply ( this.orientation, this.orientation, rotation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
    }
    
    /** 
     *  Rotates the structure right
    **/ 
    rotateRight () {
        let move     = glMatrix.quat.create ();
        let rotation = glMatrix.quat.clone ( this.orientation );
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.fromEuler ( move, 0.0, 90.0, 0.0 );
        
        glMatrix.quat.invert ( inverse, rotation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        glMatrix.quat.multiply ( this.orientation, this.orientation, inverse );
        glMatrix.quat.multiply ( this.orientation, this.orientation, move );
        glMatrix.quat.multiply ( this.orientation, this.orientation, rotation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
    }
    
    /** 
     *  Generates a Silhouette based on the orientation of the structure
     *  
     *  @returns { Silhouette } - A Silhouette based on the orientation of the structure
    **/ 
    createSilhouette () {
        
        // The structure is stored in the 'un-rotated' state in order
        // to make reasoning about it easier in other areas of the code.
        // However, it has to be rotated to its real oriention in order
        // to create the Silhouette.
        
        const TWO = glMatrix.vec3.fromValues ( 2.0, 2.0, 2.0 );
        
        let rotatedCenter = glMatrix.vec3.create ();
        
        // Create transform which rotates the center of the
        // structure to the orientation of the structure
        glMatrix.vec3.transformQuat ( rotatedCenter, this.position, this.orientation );
        
        // Make sure floats land at intervals of 0.5 exactly
        glMatrix.vec3.multiply ( rotatedCenter, rotatedCenter, TWO );
        glMatrix.vec3.round ( rotatedCenter, rotatedCenter );
        glMatrix.vec3.divide ( rotatedCenter, rotatedCenter, TWO );
        
        rotatedCenter [ 0 ] = rotatedCenter [ 0 ].toFixed ( 1 );
        rotatedCenter [ 1 ] = rotatedCenter [ 1 ].toFixed ( 1 );
        
        let silhouette  = new Silhouette ();
        let rotatedCube = glMatrix.vec3.create ();
        
        // Create transform which rotates the latest cube in the structure
        glMatrix.vec3.transformQuat ( rotatedCube, this.latestCube.position, this.orientation );
        
        // Center new position based around ( 0, 0 ) which needs to be done when comparing Silhouettes
        let tile = glMatrix.vec2.fromValues (
            Math.round ( rotatedCube [ 0 ] ) - rotatedCenter [ 0 ],
            Math.round ( rotatedCube [ 1 ] ) - rotatedCenter [ 1 ]
        );
        
        let key = tile.toString ();
        
        silhouette.set ( key, tile );
        
        for ( let cube of this.cubes.values () ) {
            // Create transform which rotates a cube in the structure
            glMatrix.vec3.transformQuat ( rotatedCube, cube.position, this.orientation );
            
            // Center new position based around ( 0, 0 ) which needs to be done when comparing Silhouettes
            tile = glMatrix.vec2.fromValues (
                Math.round ( rotatedCube [ 0 ] ) - rotatedCenter [ 0 ],
                Math.round ( rotatedCube [ 1 ] ) - rotatedCenter [ 1 ]
            );
            
            key = tile.toString ();
            
            if ( !silhouette.tiles.has ( key ) ) { silhouette.set ( key, tile ); }
        }
        
        // Tell the Silhouette to generate the visual lines now that we are done creating it
        silhouette.generateOutline ();
        
        return silhouette;
    }
    
    /** 
     *  Determines valid positions to add cubes in the future and stores them in adjacentCubes
    **/ 
    addAdjacentCubes () {
        let pos = this.latestCube.position;
        
        let adjacents = [
            glMatrix.vec3.fromValues ( pos [ 0 ] - 1, pos [ 1 ], pos [ 2 ] ),
            glMatrix.vec3.fromValues ( pos [ 0 ] + 1, pos [ 1 ], pos [ 2 ] ),
            glMatrix.vec3.fromValues ( pos [ 0 ], pos [ 1 ] - 1, pos [ 2 ] ),
            glMatrix.vec3.fromValues ( pos [ 0 ], pos [ 1 ] + 1, pos [ 2 ] ),
            glMatrix.vec3.fromValues ( pos [ 0 ], pos [ 1 ], pos [ 2 ] - 1 ),
            glMatrix.vec3.fromValues ( pos [ 0 ], pos [ 1 ], pos [ 2 ] + 1 )
        ];
        
        for ( let i = 0; i < adjacents.length; i++ ) {
            let key = adjacents [ i ].toString ();
            
            // Determines if the adjacent cube is in the structure already
            // or if it has already been marked as a potiential position
            if ( !this.cubes.has ( key ) && !this.adjacentCubes.has ( key ) ) {
                let newCube = new Cube ();
                
                newCube.translate ( adjacents [ i ] );
                
                this.adjacentCubes.set ( key, newCube );
            }
        }
    }
    
    /** 
     *  Determines if the structure's bounding box needs to be updated
     *  as the result of adding a cube to the structure
     *  
     *  @returns { glMatrix.vec3 | null } - A vec3 to move the camera in order to keep it
     *                                      centered on the structure or null if no movement
     *                                      is required
    **/ 
    updateBounds () {
        let pos = this.latestCube.position;
        
        if ( pos [ 0 ] < this.negBound [ 0 ] ) {
            return this.updateNegBound ( glMatrix.vec3.fromValues ( -1, 0, 0 ) );
        }
        if ( pos [ 1 ] < this.negBound [ 1 ] ) {
            return this.updateNegBound ( glMatrix.vec3.fromValues ( 0, -1, 0 ) );
        }
        if ( pos [ 2 ] < this.negBound [ 2 ] ) {
            return this.updateNegBound ( glMatrix.vec3.fromValues ( 0, 0, -1 ) );
        }
        if ( pos [ 0 ] > this.posBound [ 0 ] ) {
            return this.updatePosBound ( glMatrix.vec3.fromValues ( 1, 0, 0 ) );
        }
        if ( pos [ 1 ] > this.posBound [ 1 ] ) {
            return this.updatePosBound ( glMatrix.vec3.fromValues ( 0, 1, 0 ) );
        }
        if ( pos [ 2 ] > this.posBound [ 2 ] ) {
            return this.updatePosBound ( glMatrix.vec3.fromValues ( 0, 0, 1 ) );
        }
        else { return null; }
    }
    
    /** 
     *  A helper function to update the negative bounding box of the structure
     *  
     *  @param { glMatrix.vec3 } direction - A normalized and axis aligned vec3 that represents
     *                                       the direction to push the bounding box out
     *  
     *  @returns { glMatrix.vec3 } - A vec3 to move the camera in order to keep
     *                               it centered on the structure
    **/ 
    updateNegBound ( direction ) {
        glMatrix.vec3.add ( this.negBound, this.negBound, direction );
        return this.moveCenter ( direction );
    }
    
    /** 
     *  A helper function to update the positive bounding box of the structure
     *  
     *  @param { glMatrix.vec3 } direction - A normalized and axis aligned vec3 that represents
     *                                       the direction to push the bounding box out
     *  
     *  @returns { glMatrix.vec3 } - A vec3 to move the camera in order to keep
     *                               it centered on the structure
    **/ 
    updatePosBound ( direction ) {
        glMatrix.vec3.add ( this.posBound, this.posBound, direction );
        return this.moveCenter ( direction );
    }
    
    /** 
     *  A helper function to move the center of the structure
     *  
     *  @param { glMatrix.vec3 } direction - A normalized and axis aligned vec3 that represents
     *                                       the direction to move the center of the structure
     *  
     *  @returns { glMatrix.vec3 } - A vec3 to move the camera in order to keep
     *                               it centered on the structure
    **/ 
    moveCenter ( direction ) {
        // Check the bounding box to see if the diameter changed
        if (
            this.posBound [ 0 ] - this.negBound [ 0 ] + 1 > this.diameter ||
            this.posBound [ 1 ] - this.negBound [ 1 ] + 1 > this.diameter ||
            this.posBound [ 2 ] - this.negBound [ 2 ] + 1 > this.diameter
        ) {
            this.diameter++;
        }
        
        // As a result of adding a single cube at a time,
        // the center will only move at 0.5 increments
        let translation = glMatrix.vec3.fromValues ( 0.5, 0.5, 0.5 );
        
        glMatrix.vec3.multiply ( translation, translation, direction );
        glMatrix.vec3.add ( this.position, this.position, translation );
        
        return translation;
    }
    
}