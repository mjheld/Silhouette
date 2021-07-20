/** 
 *  Adds a cube to the structure and moves/scales the camera
**/ 
class GameplayExpand extends GameState {
    
    /** 
     *  Represents a GameplayExpand
     *  
     *  @constructor
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    constructor ( gameplay ) {
        super ();
        
        gameplay.markerCube = new Cube ();
        this.ctr            = 0;
        
        // Update UI
        document.getElementById ( 'controlInfo' ).style.visibility = 'hidden';
        
        // Change the old cube to match the color of the other cubes
        gameplay.structure.latestCube.addAnimation ( new ColorAnm (
            gameplay.structure.latestCube.color,
            glMatrix.vec3.clone ( ColorScheme.get ( 'MAIN' ) ),
            30,
            30,
            null,
            false
        ) );
        
        // Add cube to structure
        let movement = gameplay.structure.addCube ();
        
        // Check if the camera needs to be translated
        if ( movement != null ) {
            gameplay.camera.addAnimation ( new TranslationAnm ( movement, 30, 0, Ease.inOutExpo, false ) );
        }
        
        // Check if the camera needs to be scaled
        if ( gameplay.lastDiameter != gameplay.structure.diameter ) {
            let scale   = ( gameplay.structure.diameter + 1 ) / ( gameplay.lastDiameter + 1 );
            let scaling = glMatrix.vec3.fromValues ( scale, scale, scale );
            
            gameplay.camera.addAnimation ( new ScalingAnm ( scaling, gameplay.camera.position, 30, 0, Ease.inOutExpo, false ) );
            
            gameplay.lastDiameter = gameplay.structure.diameter;
        }
        
        // Update new cube
        gameplay.structure.latestCube.color     = glMatrix.vec3.clone ( ColorScheme.get ( 'DARK' ) );
        gameplay.structure.latestCube.edgeWidth = 0.007;
        
        gameplay.structure.latestCube.scale (
            glMatrix.vec3.fromValues ( 0.8, 0.8, 0.8 ),
            gameplay.structure.latestCube.position
        );
        
        // Scale new cube in
        gameplay.structure.latestCube.addAnimation ( new ScalingAnm (
            glMatrix.vec3.fromValues ( 1.25, 1.25, 1.25 ),
            gameplay.structure.latestCube.position,
            30,
            30,
            Ease.outExpo,
            false
        ) );
        
        // Update marker
        let color = glMatrix.vec3.create ();
        
        glMatrix.vec3.divide ( color, ColorScheme.get ( 'LIGHT' ), Cube.EDGE_COLOR_MULT );
        
        gameplay.markerCube.color     = color;
        gameplay.markerCube.edgeWidth = 0.014;
        
        gameplay.markerCube.translate ( gameplay.structure.latestCube.position );
        
        gameplay.markerCube.scale (
            glMatrix.vec3.fromValues ( 0.8, 0.8, 0.8 ),
            gameplay.markerCube.position
        );
        
        // Scale marker in
        gameplay.markerCube.addAnimation ( new ScalingAnm (
            glMatrix.vec3.fromValues ( 1.25, 1.25, 1.25 ),
            gameplay.markerCube.position,
            30,
            30,
            Ease.outExpo,
            false
        ) );
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } gameplay - The GameState that called this function
    **/ 
    update ( gameplay ) {
        this.ctr++;
        
        // Play audio
        if ( this.ctr == 30 ) { document.getElementById ( 'grow' ).play (); }
        
        gameplay.camera.update ();
        gameplay.markerCube.update ();
        
        for ( let cube of gameplay.structure.cubes.values () ) {
            cube.update ();
        }
        
        gameplay.structure.latestCube.update ();
        
        if ( this.ctr == 60 ) { gameplay.state = new GameplayChoose ( gameplay ) }
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
        
        // Delay showing new cube
        if ( this.ctr >= 30 ) { gameplay.structure.latestCube.draw ( gl, gameplay.camera ); }
        
        program = GLProgram.programs.get ( 'LINE' );
        
        gl.useProgram ( program.program );
        
        gl.bindBuffer ( gl.ARRAY_BUFFER, GLBuffer.buffers.get ( 'LINE_POSITIONS' ).buffer );
        gl.enableVertexAttribArray ( program.attributes.get ( 'position' ) );
        gl.vertexAttribPointer ( program.attributes.get ( 'position' ), 2, gl.FLOAT, false, 0, 0 );
        
        for ( let cube of gameplay.structure.cubes.values () ) {
            cube.drawEdges ( gl, gameplay.camera );
        }
        
        // Delay showing marker
        if ( this.ctr >= 30 ) {
            gameplay.structure.latestCube.drawEdges ( gl, gameplay.camera );
            
            gl.clear ( gl.DEPTH_BUFFER_BIT );
            
            gameplay.markerCube.drawEdges ( gl, gameplay.camera );
        }
    }
    
}