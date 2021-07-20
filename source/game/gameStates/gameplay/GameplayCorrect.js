/** 
 *  Shows the user that they made the correct move
**/ 
class GameplayCorrect extends GameState {
    
    /** 
     *  Represents a GameplayCorrect
     *  
     *  @constructor
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    constructor ( gameplay ) {
        super ();
        
        this.pulse0    = gameplay.structure.createSilhouette ();
        this.pulse1    = gameplay.structure.createSilhouette ();
        this.pulse2    = gameplay.structure.createSilhouette ();
        this.duration0 = Random.randomInteger ( 15, 25 );
        this.duration1 = Random.randomInteger ( 15, 25 );
        this.duration2 = Random.randomInteger ( 15, 25 );
        this.ctr       = 0;
        
        gameplay.points++;
        
        // Update UI
        document.getElementById ( 'points' ).innerHTML = gameplay.points;
        
        // Play audio
        document.getElementById ( 'correct' ).play ();
        
        // Update pulses
        this.pulse0.color = ColorScheme.get ( 'DARKER' );
        this.pulse1.color = ColorScheme.get ( 'DARKER' );
        this.pulse2.color = ColorScheme.get ( 'DARKER' );
        
        this.pulse0.lineWidth = Random.randomFloat ( 0.005, 0.01 );
        this.pulse1.lineWidth = Random.randomFloat ( 0.005, 0.01 );
        this.pulse2.lineWidth = Random.randomFloat ( 0.005, 0.01 );
        
        let scale0 = Random.randomFloat ( 1.125, 1.5 );
        let scale1 = Random.randomFloat ( 1.5, 1.75 );
        let scale2 = Random.randomFloat ( 1.5, 1.75 );
        
        let scaling0 = glMatrix.vec3.fromValues ( scale0, scale0, scale0 );
        let scaling1 = glMatrix.vec3.fromValues ( scale1, scale1, scale1 );
        let scaling2 = glMatrix.vec3.fromValues ( scale2, scale2, scale2 );
        
        // Scale pulses out
        this.pulse0.addAnimation ( new ScalingAnm ( scaling0, this.pulse0.position, 15, 0, Ease.outExpo, false ) );
        this.pulse1.addAnimation ( new ScalingAnm ( scaling1, this.pulse1.position, 15, 0, Ease.outExpo, false ) );
        this.pulse2.addAnimation ( new ScalingAnm ( scaling2, this.pulse2.position, 30, 0, Ease.outExpo, false ) );
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    update ( gameplay ){
        this.ctr++;
        
        this.pulse0.update ();
        this.pulse1.update ();
        this.pulse2.update ();
        
        if ( this.ctr == 30 ) { gameplay.state = new GameplayExpand ( gameplay ); }
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
        
        gl.clear ( gl.DEPTH_BUFFER_BIT );
        
        // Stop drawing pulses after their duration
        if ( this.ctr < this.duration0 ) { this.pulse0.draw ( gl, gameplay.camera ); }
        if ( this.ctr < this.duration1 ) { this.pulse1.draw ( gl, gameplay.camera ); }
        if ( this.ctr < this.duration2 ) { this.pulse2.draw ( gl, gameplay.camera ); }
    }
    
}