/** 
 *  Shows the user that they made the incorrect move
**/ 
class GameplayIncorrect extends GameState {
    
    /** 
     *  Represents a GameplayIncorrect
     *  
     *  @constructor
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    constructor ( gameplay ) {
        super ();
        
        this.ctr = 0;
        
        let origin      = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
        let translation = glMatrix.vec3.create ();
        let noise       = Random.randomFloat ( -22.5, 22.5 );
        let rotation    = glMatrix.quat.create ();
        
        // Play audio
        document.getElementById ( 'incorrect' ).play ();
        
        // Burst the latest cube
        glMatrix.vec3.subtract ( translation, gameplay.structure.latestCube.position, gameplay.structure.position );
        glMatrix.vec3.rotateZ ( translation, translation, origin, glMatrix.glMatrix.toRadian ( noise ) );
        glMatrix.vec3.normalize ( translation, translation );
        
        gameplay.structure.latestCube.addAnimation ( new TranslationAnm ( translation, 10, 0, null, true ) );
        
        glMatrix.quat.random ( rotation );
        
        gameplay.structure.latestCube.addAnimation ( new RotationAnm ( rotation, gameplay.structure.latestCube.position, 60, 0, null, true ) );
        
        // Burst the rest of the cubes in the structure
        for ( let cube of gameplay.structure.cubes.values () ) {
            translation = glMatrix.vec3.create ();
            noise       = Random.randomFloat ( -22.5, 22.5 );
            rotation    = glMatrix.quat.create ();
            
            glMatrix.vec3.subtract ( translation, cube.position, gameplay.structure.position );
            glMatrix.vec3.rotateZ ( translation, translation, origin, glMatrix.glMatrix.toRadian ( noise ) );
            glMatrix.vec3.normalize ( translation, translation );
            
            cube.addAnimation ( new TranslationAnm ( translation, 10, 0, null, true ) );
            
            glMatrix.quat.random ( rotation );
            
            cube.addAnimation ( new RotationAnm ( rotation, cube.position, 60, 0, null, true ) );
        }
        
        let scaling = glMatrix.vec3.fromValues ( 0.000001, 0.000001, 0.000001 );
        
        // Scale the camera in
        gameplay.camera.addAnimation ( new ScalingAnm ( scaling, gameplay.camera.position, 30, 15, Ease.inExpo, false ) );
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    update ( gameplay ){
        this.ctr++;
        
        gameplay.camera.update ();
        
        for ( let cube of gameplay.structure.cubes.values () ) {
            cube.update ();
        }
        
        gameplay.structure.latestCube.update ();
        
        if ( this.ctr == 60 ) { gameplay.isOver = true; }
    }
    
    /** 
     *  Renders the game based on its current state
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    render ( gl, gameplay ) {
        gameplay.background.draw ( gl );
        
        let program = GLProgram.programs.get ( 'GOURAUD' );
        
        gl.useProgram ( program.program );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'CUBE_POSITIONS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'position' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'position' ), 3, gl.FLOAT, false, 0, 0 );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'CUBE_NORMALS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'normal' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'normal' ), 3, gl.FLOAT, false, 0, 0 );
        
        for ( let cube of gameplay.structure.cubes.values () ) {
            cube.draw ( gl, gameplay.camera );
        }
        
        gameplay.structure.latestCube.draw ( gl, gameplay.camera );
        
        program = GLProgram.programs.get ( 'LINE' );
        
        gl.useProgram ( program.program );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'LINE_POSITIONS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'position' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'position' ), 2, gl.FLOAT, false, 0, 0 );
        
        for ( let cube of gameplay.structure.cubes.values () ) {
            cube.drawEdges ( gl, gameplay.camera );
        }
        
        gameplay.structure.latestCube.drawEdges ( gl, gameplay.camera );
    }
    
}