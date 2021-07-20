/** 
 *  Shows the entrance of the title screen
**/ 
class TitleScreenIn extends GameState {
    
    /** 
     *  Represents a TitleScreenIn
     *  
     *  @constructor
     *  
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    constructor ( titleScreen ) {
        super ();
        
        this.delay1 = Random.randomInteger ( 5, 15 );
        this.delay2 = Random.randomInteger ( 5, 15 );
        this.delay3 = Random.randomInteger ( 5, 15 );
        this.tilt0  = glMatrix.quat.create ();
        this.tilt1  = glMatrix.quat.create ();
        this.ctr    = 0;
        
        // Scale cubes to different sizes
        glMatrix.quat.fromEuler ( this.tilt0, 0.0, 0.0, 22.5 );
        glMatrix.quat.fromEuler ( this.tilt1, 0.0, 0.0, -22.5 );
        
        titleScreen.cube1.scale ( new glMatrix.vec3.fromValues ( 2.0, 2.0, 2.0 ), titleScreen.cube1.position );
        titleScreen.cube2.scale ( new glMatrix.vec3.fromValues ( 4.0, 4.0, 4.0 ), titleScreen.cube2.position );
        titleScreen.cube3.scale ( new glMatrix.vec3.fromValues ( 8.0, 8.0, 8.0 ), titleScreen.cube3.position );
        
        // Offset the cubes from each other
        let degrees = Random.randomInteger ( 45, 359 );
        let turn0   = glMatrix.quat.create ();
        let turn1   = glMatrix.quat.create ();
        
        glMatrix.quat.fromEuler ( turn0, 0.0, degrees, 0.0 );
        glMatrix.quat.fromEuler ( turn1, 0.0, degrees - 45, 0.0 );
        
        titleScreen.cube0.rotate ( turn0, titleScreen.cube0.position );
        titleScreen.cube0.rotate ( this.tilt0, titleScreen.cube0.position );
        titleScreen.cube1.rotate ( turn1, titleScreen.cube0.position );
        titleScreen.cube1.rotate ( this.tilt1, titleScreen.cube1.position );
        titleScreen.cube2.rotate ( turn0, titleScreen.cube2.position );
        titleScreen.cube2.rotate ( this.tilt0, titleScreen.cube2.position );
        titleScreen.cube3.rotate ( turn1, titleScreen.cube0.position );
        titleScreen.cube3.rotate ( this.tilt1, titleScreen.cube3.position );
        
        // Animate the cubes in
        let scale = glMatrix.vec3.fromValues ( 1.5, 1.5, 1.5 );
        
        titleScreen.cube0.addAnimation ( new ScalingAnm ( scale, titleScreen.cube0.position, 30, 1, Ease.outBack, false ) );
        titleScreen.cube1.addAnimation ( new ScalingAnm ( scale, titleScreen.cube1.position, 30, this.delay1, Ease.outBack, false ) );
        titleScreen.cube2.addAnimation ( new ScalingAnm ( scale, titleScreen.cube2.position, 30, this.delay2, Ease.outBack, false ) );
        titleScreen.cube3.addAnimation ( new ScalingAnm ( scale, titleScreen.cube3.position, 30, this.delay3, Ease.outBack, false ) );
        
        // Spin the cubes around
        let rotation0 = glMatrix.quat.create ();
        let rotation1 = glMatrix.quat.create ();
                
        glMatrix.quat.fromEuler ( rotation0, 0.0, 90.0, 0.0 );
        glMatrix.quat.fromEuler ( rotation1, 0.0, -90.0, 0.0 );
        
        titleScreen.cube0.addAnimation ( new RotationAnm ( rotation0, titleScreen.cube0.position, 600, 1, null, true ) );
        titleScreen.cube1.addAnimation ( new RotationAnm ( rotation1, titleScreen.cube1.position, 600, 1, null, true ) );
        titleScreen.cube2.addAnimation ( new RotationAnm ( rotation0, titleScreen.cube2.position, 600, 1, null, true ) );
        titleScreen.cube3.addAnimation ( new RotationAnm ( rotation1, titleScreen.cube3.position, 600, 1, null, true ) );
    }
    
    /** 
     *  Called when the game recieves input from the keyboard
     *  
     *  @param { KeyboardEvent } e - The key that was pressed
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    getInput ( e, titleScreen ) {
        if ( this.ctr > 30 ) { titleScreen.state = new TitleScreenOut ( titleScreen ); }
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } titleScreen - The GameState that called this function
    **/ 
    update ( titleScreen ) {
        this.ctr++;
        
        // Delay showing the title
        if ( this.ctr == 30 ) {
            let titleBox = document.getElementById ( 'title' );
            
            titleBox.innerHTML = ( titleScreen.points == -1 ) ?
                'Silhouette' :
                ( '- ' + titleScreen.points + ' -' );
                
            titleBox.style.visibility = 'visible';
            
            document.getElementById ( 'startInfo' ).style.visibility = 'visible';
            
            // Play audio if showing previous game's score
            if ( titleScreen.points != -1 ) { document.getElementById ( 'score' ).play (); }
        }
        
        titleScreen.cube0.rotate ( this.tilt1, titleScreen.cube0.position );
        titleScreen.cube1.rotate ( this.tilt0, titleScreen.cube1.position );
        titleScreen.cube2.rotate ( this.tilt1, titleScreen.cube2.position );
        titleScreen.cube3.rotate ( this.tilt0, titleScreen.cube3.position );
        
        titleScreen.cube0.update ();
        titleScreen.cube1.update ();
        titleScreen.cube2.update ();
        titleScreen.cube3.update ();
        
        titleScreen.cube0.rotate ( this.tilt0, titleScreen.cube0.position );
        titleScreen.cube1.rotate ( this.tilt1, titleScreen.cube1.position );
        titleScreen.cube2.rotate ( this.tilt0, titleScreen.cube2.position );
        titleScreen.cube3.rotate ( this.tilt1, titleScreen.cube3.position );
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
        
        // Delay showing the cubes
        if ( this.ctr >= this.delay1 ) { titleScreen.cube1.drawEdges ( gl, titleScreen.camera ); }
        if ( this.ctr >= this.delay2 ) { titleScreen.cube2.drawEdges ( gl, titleScreen.camera ); }
        if ( this.ctr >= this.delay3 ) { titleScreen.cube3.drawEdges ( gl, titleScreen.camera ); }
    }
    
}