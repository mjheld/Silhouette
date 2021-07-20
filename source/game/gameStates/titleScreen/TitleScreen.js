/** 
 *  The screen that displays the title or the score from the previous game
**/ 
class TitleScreen extends GameState {
    
    /** 
     *  Represents a TitleScreen
     *  
     *  @constructor
     *  
     *  @param { GameState } game - The GameState that called this function
    **/ 
    constructor ( game ) {
        super ();
        
        this.background = new Background ();
        this.camera     = new OrthoCamera ( -7.5, 7.5, -7.5, 7.5, -10.5, 10.5 );
        this.cube0      = new Cube ();
        this.cube1      = new Cube ();
        this.cube2      = new Cube ();
        this.cube3      = new Cube ();
        this.points     = game.points;
        this.isOver     = false;
        
        // Generate new color scheme
        new ColorScheme ();
        
        // Update UI
        let title = document.getElementById ( 'title' );
        
        title.style.visibility = 'hidden';
        title.style.color      = ColorScheme.getString ( 'DARKER' );
        
        let startInfo = document.getElementById ( 'startInfo' );
        
        startInfo.style.visibility = 'hidden';
        startInfo.style.color      = ColorScheme.getString ( 'DARKER' );
        
        let controlInfo = document.getElementById ( 'controlInfo' );
        
        controlInfo.style.visibility = 'hidden';
        controlInfo.style.color      = ColorScheme.getString ( 'DARKER' );
        
        let points = document.getElementById ( 'points' );
        
        points.style.visibility = 'hidden';
        points.style.color      = ColorScheme.getString ( 'DARKER' );
        
        this.background.color = ColorScheme.get ( 'LIGHTER' );
        
        // Update cubes
        this.cube0.edgeWidth = 0.04;
        this.cube0.color     = ColorScheme.get ( 'MAIN' );
        this.cube1.edgeWidth = 0.02;
        this.cube1.color     = ColorScheme.get ( 'MAIN' );
        this.cube2.edgeWidth = 0.02;
        this.cube2.color     = ColorScheme.get ( 'MAIN' );
        this.cube3.edgeWidth = 0.02;
        this.cube3.color     = ColorScheme.get ( 'MAIN' );
        
        this.resize ( game );
        
        this.state = new TitleScreenIn ( this );
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
        
        if ( this.isOver ) { game.state = new Gameplay ( game ); }
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
        let width     = 7.5;
        let height    = 7.5;
        let transform = glMatrix.mat4.create ();
        
        if ( game.aspectRatio > 1.0 ) {
            width *= game.aspectRatio;
        }
        
        else if ( game.aspectRatio < 1.0 ) {
            height *= 1.0 / game.aspectRatio;
        }
        
        glMatrix.mat4.ortho ( transform, -width, width, -height, height, -10.5, 10.5 );
        
        this.camera.projectionTransform = transform;
    }
    
}