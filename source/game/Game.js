/** 
 *  Initializes the game and contains the main game loop
**/ 
class Game {
    
    static MS_PER_UPDATE = 1000.0 / 30.0;
    
    /** 
     *  Represents a Game
     *  
     *  @constructor
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { int } width - The width of the game context
     *  @param { int } height - The height of the game context
    **/ 
    constructor ( gl, width, height ) {
        this.gl                = gl;
        this.aspectRatio       = 1.0;
        this.points            = -1;
        this.previousTimeStamp = 0.0;
        this.lag               = 0.0;
        this.wasHidden         = false;
        
        this.init ( this.gl );
        
        this.start = this.start.bind ( this );
        this.state = new TitleScreen ( this );
        
        this.resize ( this.gl, width, height );
    }
    
    /** 
     *  Initializes the game
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
    **/ 
    init ( gl ) {
        let gouraudShader = new GLShader ( gl, gl.VERTEX_SHADER, GOURAUD_VERTEX_SHADER );
        let lineShader    = new GLShader ( gl, gl.VERTEX_SHADER, LINE_VERTEX_SHADER );
        let colorShader   = new GLShader ( gl, gl.FRAGMENT_SHADER, COLOR_FRAGMENT_SHADER );
        
        new GLProgram ( gl, 'GOURAUD', gouraudShader.shader, colorShader.shader );
        new GLProgram ( gl, 'LINE', lineShader.shader, colorShader.shader );
        
        new GLBuffer ( gl, 'CUBE_POSITIONS', gl.ARRAY_BUFFER, CUBE_POSITIONS, gl.STATIC_DRAW );
        new GLBuffer ( gl, 'CUBE_NORMALS', gl.ARRAY_BUFFER, CUBE_NORMALS, gl.STATIC_DRAW );
        new GLBuffer ( gl, 'CUBE_INDICES', gl.ELEMENT_ARRAY_BUFFER, CUBE_INDICES, gl.STATIC_DRAW );
        
        new GLBuffer ( gl, 'LINE_POSITIONS', gl.ARRAY_BUFFER, LINE_POSITIONS, gl.STATIC_DRAW );
        new GLBuffer ( gl, 'LINE_INDICES', gl.ELEMENT_ARRAY_BUFFER, LINE_INDICES, gl.STATIC_DRAW );
        
        gl.enable ( gl.CULL_FACE );
        gl.enable ( gl.DEPTH_TEST );
    }
    
    /** 
     *  The main game loop
     *  
     *  @param { DOMHighResTimeStamp } currentTimeStamp - The current time
    **/ 
    start ( currentTimeStamp ) {
        let elapsedTime = currentTimeStamp - this.previousTimeStamp;
        
        this.lag += elapsedTime;
        this.previousTimeStamp = currentTimeStamp;
        
        // Stops game from freezing up when tab regains focus
        // ( The game would freeze because of the large time difference
        //   between when the tab lost focus and regained it )
        if ( !document.hidden && this.wasHidden ) {
            this.lag       = 0;
            this.wasHidden = false;
        }
        
        // Loops until game catches up to real time
        while ( !document.hidden && this.lag >= Game.MS_PER_UPDATE ) {
            this.update ();
            this.render ( this.gl );
            
            this.lag -= Game.MS_PER_UPDATE;
        }
        
        requestAnimationFrame ( this.start );
    }
    
    /** 
     *  Called when the game recieves input from the keyboard
     *  
     *  @param { KeyboardEvent } e - The key that was pressed
    **/ 
    getInput ( e ) {
        this.state.getInput ( e, this );
    }
    
    /** 
     *  Updates the logic of the game
    **/ 
    update () {
        this.state.update ( this );
    }
    
    /** 
     *  Renders the game based on its current state
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
    **/ 
    render ( gl ) {
        this.state.render ( gl, this );
    }
    
    /** 
     *  Called when the tab changes focus
    **/ 
    visibilityChange () {
        if ( document.visibilityState == 'hidden' ) {
            this.wasHidden = true;
        }
    }
    
    /** 
     *  Called when the window changes size
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { int } width - The width of the game context
     *  @param { int } height - The height of the game context
    **/ 
    resize ( gl, width, height ) {
        this.aspectRatio = width / height;
        
        gl.canvas.width  = width;
        gl.canvas.height = height;
        
        gl.viewport ( 0.0, 0.0, width, height );
        
        this.state.resize ( this );
    }
    
}