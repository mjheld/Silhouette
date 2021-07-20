/** 
 *  Shows the exit of the title screen
**/ 
class TitleScreenOut extends GameState {
    
    /** 
     *  Represents a TitleScreenOut
     *  
     *  @constructor
     *  
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    constructor ( titleScreen ) {
        super ();
        
        this.duration1 = 32;
        this.duration2 = 29;
        this.duration3 = 26;
        this.ctr    = 0;
        
        // Update UI
        document.getElementById ( 'title' ).style.visibility     = 'hidden';
        document.getElementById ( 'startInfo' ).style.visibility = 'hidden';
        
        // Stop center cube from rotating
        titleScreen.cube0.animations = [];
        
        // Zoom camera in
        let zoom = glMatrix.vec3.fromValues ( 0.2, 0.2, 0.2 );
        
        titleScreen.camera.addAnimation ( new ScalingAnm ( zoom, titleScreen.camera.position, 60, 0, Ease.inOutExpo, false ) );
        
        // Make center cube face camera
        let rotation = glMatrix.quat.create ();
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.invert ( inverse, titleScreen.cube0.orientation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        glMatrix.quat.multiply ( rotation, rotation, inverse );
        glMatrix.quat.normalize ( rotation, rotation );
        
        titleScreen.cube0.addAnimation ( new RotationAnm ( rotation, titleScreen.cube0.position, 60, 0, Ease.inOutExpo, false ) );
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    update ( titleScreen ) {
        this.ctr++;
        
        titleScreen.camera.update ();
        titleScreen.cube0.update ();
        titleScreen.cube1.update ();
        titleScreen.cube2.update ();
        titleScreen.cube3.update ();
        
        if ( this.ctr == 60 ) { titleScreen.isOver = true; }
    }
    
    /** 
     *  Renders the game based on its current state
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    render ( gl, titleScreen ) {
        titleScreen.background.draw ( gl );
        
        let program = GLProgram.programs.get ( 'GOURAUD' );
        
        gl.useProgram ( program.program );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'CUBE_POSITIONS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'position' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'position' ), 3, gl.FLOAT, false, 0, 0 );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'CUBE_NORMALS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'normal' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'normal' ), 3, gl.FLOAT, false, 0, 0 );
        
        titleScreen.cube0.draw ( gl, titleScreen.camera );
        
        program = GLProgram.programs.get ( 'LINE' );
        
        gl.useProgram ( program.program );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'LINE_POSITIONS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'position' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'position' ), 2, gl.FLOAT, false, 0, 0 );
        
        titleScreen.cube0.drawEdges ( gl, titleScreen.camera );
        
        // Stop drawing cubes after their duration
        if ( this.ctr <= this.duration1 ) { titleScreen.cube1.drawEdges ( gl, titleScreen.camera ); }
        if ( this.ctr <= this.duration2 ) { titleScreen.cube2.drawEdges ( gl, titleScreen.camera ); }
        if ( this.ctr <= this.duration3 ) { titleScreen.cube3.drawEdges ( gl, titleScreen.camera ); }
    }
    
}