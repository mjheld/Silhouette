/** 
 *  Picks a target and waits for the user to make a move
**/ 
class GameplayChoose extends GameState {
    
    /** 
     *  Represents a GameplayChoose
     *  
     *  @constructor
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    constructor ( gameplay ) {
        super ();
        
        this.marker          = new Cube ();
        this.stateChangeTick = -1;
        this.ctr             = 0;
        
        // Update UI
        if ( gameplay.points == 0 ) {
            document.getElementById ( 'controlInfo' ).style.visibility = 'visible';
        }
        
        document.getElementById ( 'points' ).style.visibility = 'visible';
        
        // Update marker
        let color = glMatrix.vec3.create ();
        
        glMatrix.vec3.divide ( color, ColorScheme.get ( 'LIGHT' ), Cube.EDGE_COLOR_MULT );
        
        this.marker.color     = color;
        this.marker.edgeWidth = 0.007;
        
        this.marker.translate ( gameplay.structure.latestCube.position );
        
        // Pick random rotation to create silhouette from
        switch ( Random.randomInteger ( 0, 3 ) ) {
            case 0 :
                gameplay.structure.rotateUp ();
                gameplay.target = gameplay.structure.createSilhouette ();
                gameplay.structure.rotateDown ();
                break;
                
            case 1 :
                gameplay.structure.rotateDown ();
                gameplay.target = gameplay.structure.createSilhouette ();
                gameplay.structure.rotateUp ();
                break;
                
            case 2 :
                gameplay.structure.rotateLeft ();
                gameplay.target = gameplay.structure.createSilhouette ();
                gameplay.structure.rotateRight ();
                break;
                
            case 3 :
                gameplay.structure.rotateRight ();
                gameplay.target = gameplay.structure.createSilhouette ();
                gameplay.structure.rotateLeft ();
                break;
        }
        
        // Update target
        gameplay.target.color     = ColorScheme.get ( 'DARKER' );
        gameplay.target.lineWidth = 0.03;
        
        gameplay.target.scale ( glMatrix.vec3.fromValues ( 1.25, 1.25, 1.25 ), gameplay.target.position );
        
        let scaling = glMatrix.vec3.fromValues ( 0.8, 0.8, 0.8 );
        
        // Scale target in
        gameplay.target.addAnimation ( new ScalingAnm ( scaling, gameplay.target.position, 30, 0, Ease.outExpo, null ) );
    }
    
    /** 
     *  Called when the game recieves input from the keyboard
     *  
     *  @param { KeyboardEvent } e - The key that was pressed
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    getInput ( e, gameplay ) {
        // Check for correct input
        if (
            this.stateChangeTick == -1 &&
            ( e.code == 'KeyW' || e.code == 'KeyA' ||
              e.code == 'KeyS' || e.code == 'KeyD' ||
              e.code == 'ArrowUp' || e.code == 'ArrowLeft' ||
              e.code == 'ArrowDown' || e.code == 'ArrowRight' )
        ) {
            let rotation = glMatrix.quat.create ();
            
            switch ( e.code ) {
                case 'KeyW' :
                case 'ArrowUp' :
                    glMatrix.quat.fromEuler ( rotation, 90.0, 0.0, 0.0 );
                    gameplay.structure.rotateUp ();
                    break;
                    
                case 'KeyA' :
                case 'ArrowLeft' :
                    glMatrix.quat.fromEuler ( rotation, 0.0, 90.0, 0.0 );
                    gameplay.structure.rotateLeft ();
                    break;
                    
                case 'KeyS' :
                case 'ArrowDown' :
                    glMatrix.quat.fromEuler ( rotation, -90.0, 0.0, 0.0 );
                    gameplay.structure.rotateDown ();
                    break;
                    
                case 'KeyD' :
                case 'ArrowRight' :
                    glMatrix.quat.fromEuler ( rotation, 0.0, -90.0, 0.0 );
                    gameplay.structure.rotateRight ();
                    break;
            }
            
            this.stateChangeTick = this.ctr + 30;
            gameplay.choice      = gameplay.structure.createSilhouette ();
            
            // Rotate camera in the direction the user chose
            gameplay.camera.addAnimation ( new RotationAnm ( rotation, gameplay.camera.position, 30, 0, Ease.inOutExpo, null ) );
        }
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    update ( gameplay ) {
        this.ctr++;
        
        // Repeat scaling the marker
        if ( this.ctr % 60 == 1 ) {
            this.marker = new Cube ();
            
            let color = glMatrix.vec3.create ();
            
            glMatrix.vec3.divide ( color, ColorScheme.get ( 'LIGHT' ), Cube.EDGE_COLOR_MULT );
            
            this.marker.color     = color;
            this.marker.edgeWidth = 0.007;
            
            this.marker.translate ( gameplay.structure.latestCube.position );
            
            let scaling = glMatrix.vec3.fromValues ( 1.25, 1.25, 1.25 );
            
            // Scale marker out
            this.marker.addAnimation ( new ScalingAnm ( scaling, this.marker.position, 90, 0, Ease.outExpo, null ) );
        }
        
        let rotation = glMatrix.quat.clone ( gameplay.camera.orientation );
        let inverse  = glMatrix.quat.create ();
        
        glMatrix.quat.invert ( inverse, rotation );
        glMatrix.quat.normalize ( inverse, inverse );
        
        gameplay.camera.rotate ( inverse, gameplay.camera.position );
        gameplay.camera.update ();
        gameplay.camera.rotate ( rotation, gameplay.camera.position );
        
        gameplay.target.update ();
        this.marker.update ();
        
        // Change state once user has made a move and the camera rotates
        if ( this.ctr == this.stateChangeTick ) {
            gameplay.state = ( gameplay.choice.isEqual ( gameplay.target ) ) ?
                new GameplayCorrect ( gameplay ) :
                new GameplayIncorrect ( gameplay );
        }
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
        
        // Stop drawing the marker once the user makes their move
        if ( this.ctr > this.stateChangeTick ) {
            gameplay.markerCube.drawEdges ( gl, gameplay.camera );
            this.marker.drawEdges ( gl, gameplay.camera );
        }
        
        gl.clear ( gl.DEPTH_BUFFER_BIT );
        
        gameplay.target.draw ( gl, gameplay.camera );
    }
    
}