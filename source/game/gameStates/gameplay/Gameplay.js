/** 
 *  The screen that displays the main game
**/ 
class Gameplay extends GameState {
    
    /** 
     *  Represents a Gameplay
     *  
     *  @constructor
     *  
     *  @param { GameState } game - The GameState that called this function
    **/ 
    constructor ( game ) {
        super ();
        
        this.background   = new Background ();
        this.camera       = new OrthoCamera ( -1.0, 1.0, -1.0, 1.0, -100.0, 100.0 );
        this.structure    = new Structure ();
        this.lastDiameter = 1;
        this.target       = new Silhouette ();
        this.choice       = new Silhouette ();
        this.markerCube   = new Cube ();
        this.points       = 0;
        this.isOver       = false;
        
        // Update UI
        document.getElementById ( 'points' ).innerHTML = this.points;
        
        // Update background
        this.background.color = ColorScheme.get ( 'LIGHTER' );
        
        // Update first cube
        this.structure.latestCube.color     = ColorScheme.get ( 'MAIN' );
        this.structure.latestCube.edgeWidth = 0.007;
        
        this.resize ( game );
        
        this.state = new GameplayExpand ( this );
    }
    
    /** 
     *  Called when the game recieves input from the keyboard
     *  
     *  @param { KeyboardEvent } e - The key that was pressed
     *  @param { GameState } game - The GameState that called this function
    **/ 
    getInput ( e, game ) {
        this.state.getInput ( e, this );
    }
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } game - The GameState that called this function
    **/ 
    update ( game ) {
        this.state.update ( this );
        
        if ( this.isOver ) {
            game.points = this.points;
            game.state  = new TitleScreen ( game );
        }
    }
    
    /** 
     *  Renders the game based on its current state
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { GameState } game - The GameState that called this function
    **/ 
    render ( gl, game ) {
        this.state.render ( gl, this );
    }
    
    /** 
     *  Called when the window changes size
     *  
     *  @param { GameState } game - The GameState that called this function
    **/ 
    resize ( game ) {
        let width     = 1.0;
        let height    = 1.0;
        let transform = glMatrix.mat4.create ();
        
        if ( game.aspectRatio > 1.0 ) {
            width *= game.aspectRatio;
        }
        
        else if ( game.aspectRatio < 1.0 ) {
            height *= 1.0 / game.aspectRatio;
        }
        
        glMatrix.mat4.ortho ( transform, -width, width, -height, height, -100.0, 100.0 );
        
        this.camera.projectionTransform = transform;
    }
    
}