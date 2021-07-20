/** 
 *  A helper class to store information about a line
**/ 
class Line {
    
    /** 
     *  Represents a Line
     *  
     *  @constructor
    **/ 
    constructor () {
        this.point0 = glMatrix.vec2.create ();
        this.pivot0 = glMatrix.vec2.create ();
        this.point1 = glMatrix.vec2.create ();
        this.pivot1 = glMatrix.vec2.create ();
    }
    
}

/** 
 *  The shape the player is trying to match
**/ 
class Silhouette extends GameObject {
    
    /** 
     *  Represents a Silhouette
     *  
     *  @constructor
    **/ 
    constructor () {
        super ();
        
        this.tiles     = new Map ();
        this.outline   = [];
        this.negBound  = glMatrix.vec2.fromValues ( 0, 0 );
        this.posBound  = glMatrix.vec2.fromValues ( 0, 0 );
        this.color     = glMatrix.vec3.fromValues ( 0.2, 0.2, 0.2 );
        this.lineWidth = 1.0;
    }
    
    /** 
     *  Adds a 2D tile as coordinates to the Silhouette
     *  
     *  @param { string } key - The string representation of the 2D cordinates
     *  @param { glMatrix.vec2 } value - The 2D coordinates
    **/ 
    set ( key, value ) {
        // Update the bounds of the Silhouette
        if ( value [ 0 ] < this.negBound [ 0 ] ) { this.negBound [ 0 ] = value [ 0 ]; }
        if ( value [ 1 ] < this.negBound [ 1 ] ) { this.negBound [ 1 ] = value [ 1 ]; }
        if ( value [ 0 ] > this.posBound [ 0 ] ) { this.posBound [ 0 ] = value [ 0 ]; }
        if ( value [ 1 ] > this.posBound [ 1 ] ) { this.posBound [ 1 ] = value [ 1 ]; }
        
        this.tiles.set ( key, value );
    }
    
    /** 
     *  Checks if two Silhouette's are equal
     *  
     *  @param { Silhouette } silhouette - The Silhouette to compare to
     *  
     *  @returns { bool } - True if Silhouette's are equal, false if not
    **/ 
    isEqual ( silhouette ) {
        if ( this.tiles.size != silhouette.tiles.size ) { return false; }
        
        for ( let key of this.tiles.keys () ) {
            if ( !silhouette.tiles.has ( key ) ) { return false; }
        }
        
        return true;
    }
    
    /** 
     *  Scales the visual Silhouette
     *  
     *  @param { glMatrix.vec3 } scaling - The scale factor for each axis
     *  @param { glMatrix.vec3 } pivot - Not taken into consideration but needed to work with Animation class
    **/ 
    scale ( scaling, pivot ) {
        // Iterate through all the lines in the Silhouette
        for ( let i = 0; i < this.outline.length; i++ ) {
            
            // Must scale based on local center for each endpoint of line
            // which was generated when the line was generated
            // ( Can't use global center or Silhouette looks incorrect visually when scaled )
            
            let point0     = this.outline [ i ].point0;
            let pivot0     = this.outline [ i ].pivot0;
            let point1     = this.outline [ i ].point1;
            let pivot1     = this.outline [ i ].pivot1;
            let transform0 = glMatrix.mat4.create ();
            let transform1 = glMatrix.mat4.create ();
            
            // Create transform for first endpoint of the line
            glMatrix.mat4.fromRotationTranslationScaleOrigin (
                transform0,
                glMatrix.quat.create (),
                glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
                scaling,
                glMatrix.vec3.fromValues ( pivot0 [ 0 ], pivot0 [ 1 ], 0.0 )
            );
            
            // Create transform for second endpoint of the line
            glMatrix.mat4.fromRotationTranslationScaleOrigin (
                transform1,
                glMatrix.quat.create (),
                glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
                scaling,
                glMatrix.vec3.fromValues ( pivot1 [ 0 ], pivot1 [ 1 ], 0.0 )
            );
            
            glMatrix.vec2.transformMat4 ( point0, point0, transform0 );
            glMatrix.vec2.transformMat4 ( point1, point1, transform1 );
        }
    }
    
    /** 
     *  Generates the visual lines to create the Silhouette
    **/ 
    generateOutline () {
        this.generateNorthLines ();
        this.generateSouthLines ();
        this.generateEastLines ();
        this.generateWestLines ();
    }
    
    /** 
     *  Draws the lines of the Silhouette in front of the camera
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { OrthoCamera } camera - The camera to draw the Silhouette from
    **/ 
    draw ( gl, camera ) {
        let inverseScaling     = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
        let inverseCameraScale = glMatrix.mat4.create ();
        
        // Calculate transform to draw Silhouette in front of the camera
        // ( Only need to change the Silhouette's scale to match the camera's scale )
        glMatrix.vec3.divide ( inverseScaling, inverseScaling, camera.scaling );
        glMatrix.mat4.fromScaling ( inverseCameraScale, inverseScaling );
        
        let uniforms = GLProgram.programs.get ( 'LINE' ).uniforms;
        
        gl.uniformMatrix4fv ( uniforms.get ( 'modelTransform' ), false, this.modelTransform );
        gl.uniformMatrix4fv ( uniforms.get ( 'viewTransform' ), false, inverseCameraScale );
        gl.uniformMatrix4fv ( uniforms.get ( 'projectionTransform' ), false, camera.projectionTransform );
        gl.uniform4f ( uniforms.get ( 'lineColor' ), this.color [ 0 ], this.color [ 1 ], this.color [ 2 ], 1.0 );
        gl.uniform1f ( uniforms.get ( 'lineWidth' ), this.lineWidth );
        
        let indicies = GLBuffer.buffers.get ( 'LINE_INDICES' ).buffer;
        
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, indicies );
        
        for ( let i = 0; i < this.outline.length; i++ ) {
            let point0 = this.outline [ i ].point0;
            let point1 = this.outline [ i ].point1;
            
            gl.uniform4f ( uniforms.get ( 'point0' ), point0 [ 0 ], point0 [ 1 ], 0.0, 1.0 );
            gl.uniform4f ( uniforms.get ( 'point1' ), point1 [ 0 ], point1 [ 1 ], 0.0, 1.0 );
            
            gl.drawElements ( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }
    }
    
    /** 
     *  Generates lines to the north of each 'tile' in the Silhouette
    **/ 
    generateNorthLines () {
        // Iterate through each column of the cordinate grid in Silhouette's bounds
        for ( let y = this.negBound [ 1 ]; y <= this.posBound [ 1 ]; y++ ) {
            let line = null;
            
            // Iterate through each row of the cordinate grid in Silhouette's bounds
            for ( let x = this.negBound [ 0 ]; x <= this.posBound [ 0 ] + 1; x++ ) {
                let tile  = glMatrix.vec2.fromValues ( x, y );
                let west  = glMatrix.vec2.fromValues ( x - 1.0, y );
                let north = glMatrix.vec2.fromValues ( x, y + 1.0 );
                
                // Check if current grid cell is filled and if the cell to the north is empty
                if ( this.tiles.has ( tile.toString () ) && !this.tiles.has ( north.toString () ) ) {
                    if ( line == null ) {
                        let northWest = glMatrix.vec2.fromValues ( x - 1.0, y + 1.0 );
                        
                        line = new Line ();
                        
                        // Start line
                        line.point0 = glMatrix.vec2.fromValues ( x - 0.5, y + 0.5 );
                        line.pivot0 = ( !this.tiles.has ( northWest.toString () ) ) ? tile : west;
                    }
                }
                
                else if ( line != null ) {
                    // End line
                    line.point1 = glMatrix.vec2.fromValues ( x - 0.5, y + 0.5 );
                    line.pivot1 = ( !this.tiles.has ( north.toString () ) ) ? west : tile;
                    
                    this.outline.push ( line );
                    
                    line = null;
                }
            }
        }
    }
    
    /** 
     *  Generates lines to the south of each 'tile' in the Silhouette
    **/ 
    generateSouthLines () {
        // Iterate through each column of the cordinate grid in Silhouette's bounds
        for ( let y = this.negBound [ 1 ]; y <= this.posBound [ 1 ]; y++ ) {
            let line = null;
            
            // Iterate through each row of the cordinate grid in Silhouette's bounds
            for ( let x = this.negBound [ 0 ]; x <= this.posBound [ 0 ] + 1; x++ ) {
                let tile  = glMatrix.vec2.fromValues ( x, y );
                let west  = glMatrix.vec2.fromValues ( x - 1.0, y );
                let south = glMatrix.vec2.fromValues ( x, y - 1.0 );
                
                // Check if current grid cell is filled and if the cell to the south is empty
                if ( this.tiles.has ( tile.toString () ) && !this.tiles.has ( south.toString () ) ) {
                    if ( line == null ) {
                        let southWest = glMatrix.vec2.fromValues ( x - 1.0, y - 1.0 );
                        
                        line = new Line ();
                        
                        // Start line
                        line.point0 = glMatrix.vec2.fromValues ( x - 0.5, y - 0.5 );
                        line.pivot0 = ( !this.tiles.has ( southWest.toString () ) ) ? tile : west;
                    }
                }
                
                else if ( line != null ) {
                    // End line
                    line.point1 = glMatrix.vec2.fromValues ( x - 0.5, y - 0.5 );
                    line.pivot1 = ( !this.tiles.has ( south.toString () ) ) ? west : tile;
                    
                    this.outline.push ( line );
                    
                    line = null;
                }
            }
        }
    }
    
    /** 
     *  Generates lines to the east of each 'tile' in the Silhouette
    **/ 
    generateEastLines () {
        // Iterate through each row of the cordinate grid in Silhouette's bounds
        for ( let x = this.negBound [ 0 ]; x <= this.posBound [ 0 ]; x++ ) {
            let line = null;
            
            // Iterate through each column of the cordinate grid in Silhouette's bounds
            for ( let y = this.negBound [ 1 ]; y <= this.posBound [ 1 ] + 1; y++ ) {
                let tile  = glMatrix.vec2.fromValues ( x, y );
                let south = glMatrix.vec2.fromValues ( x, y - 1.0 );
                let east  = glMatrix.vec2.fromValues ( x + 1.0, y );
                
                // Check if current grid cell is filled and if the cell to the east is empty
                if ( this.tiles.has ( tile.toString () ) && !this.tiles.has ( east.toString () ) ) {
                    if ( line == null ) {
                        let southEast = glMatrix.vec2.fromValues ( x + 1.0, y - 1.0 );
                        
                        line = new Line ();
                        
                        // Start line
                        line.point0 = glMatrix.vec2.fromValues ( x + 0.5, y - 0.5 );
                        line.pivot0 = ( !this.tiles.has ( southEast.toString () ) ) ? tile : south;
                    }
                }
                
                else if ( line != null ) {
                    // End line
                    line.point1 = glMatrix.vec2.fromValues ( x + 0.5, y - 0.5 );
                    line.pivot1 = ( !this.tiles.has ( east.toString () ) ) ? south : tile;
                    
                    this.outline.push ( line );
                    
                    line = null;
                }
            }
        }
    }
    
    /** 
     *  Generates lines to the west of each 'tile' in the Silhouette
    **/ 
    generateWestLines () {
        // Iterate through each row of the cordinate grid in Silhouette's bounds
        for ( let x = this.negBound [ 0 ]; x <= this.posBound [ 0 ]; x++ ) {
            let line = null;
            
            // Iterate through each column of the cordinate grid in Silhouette's bounds
            for ( let y = this.negBound [ 1 ]; y <= this.posBound [ 1 ] + 1; y++ ) {
                let tile  = glMatrix.vec2.fromValues ( x, y );
                let south = glMatrix.vec2.fromValues ( x, y - 1.0 );
                let west  = glMatrix.vec2.fromValues ( x - 1.0, y );
                
                // Check if current grid cell is filled and if the cell to the west is empty
                if ( this.tiles.has ( tile.toString () ) && !this.tiles.has ( west.toString () ) ) {
                    if ( line == null ) {
                        let southWest = glMatrix.vec2.fromValues ( x - 1.0, y - 1.0 );
                        
                        line = new Line ();
                        
                        // Start line
                        line.point0 = glMatrix.vec2.fromValues ( x - 0.5, y - 0.5 );
                        line.pivot0 = ( !this.tiles.has ( southWest.toString () ) ) ? tile : south;
                    }
                }
                
                else if ( line != null ) {
                    // End line
                    line.point1 = glMatrix.vec2.fromValues ( x - 0.5, y - 0.5 );
                    line.pivot1 = ( !this.tiles.has ( west.toString () ) ) ? south : tile;
                    
                    this.outline.push ( line );
                    
                    line = null;
                }
            }
        }
    }
    
}