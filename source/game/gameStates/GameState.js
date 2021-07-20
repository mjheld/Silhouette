/** 
 *  The parent class that represents a state that the game can be in
 *  
 *  Note: Use a child class to actually use a game state
**/ 
class GameState {
    
    /** 
     *  Represents a GameState
     *  
     *  @constructor
    **/ 
    constructor () {}
    
    /** 
     *  Called when the game recieves input from the keyboard
     *  
     *  @param { KeyboardEvent } e - The key that was pressed
     *  @param { GameState } state - The GameState that called this function
    **/ 
    getInput ( e, state ) {}
    
    /** 
     *  Updates the logic of the game
     *  
     *  @param { GameState } state - The GameState that called this function
    **/ 
    update ( state ) {}
    
    /** 
     *  Renders the game based on its current state
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { GameState } state - The GameState that called this function
    **/ 
    render ( gl, state ) {}
    
    /** 
     *  Called when the window changes size
     *  
     *  @param { GameState } state - The GameState that called this function
    **/ 
    resize ( state ) {}
    
}