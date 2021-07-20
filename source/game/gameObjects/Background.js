/** 
 *  The background of the game
**/ 
class Background extends GameObject {
    
    /** 
     *  Represents a Background
     *  
     *  @constructor
    **/ 
    constructor () {
        super ();
        
        this.color = glMatrix.vec3.fromValues ( 0.98, 0.98, 0.98 );
    }
    
    /** 
     *  Draws the Background
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
    **/ 
    draw ( gl ) {
        gl.clearColor ( this.color [ 0 ], this.color [ 1 ], this.color [ 2 ], 1.0 );
        gl.clear ( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    }
    
}