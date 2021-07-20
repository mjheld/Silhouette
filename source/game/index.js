/** 
 *  The entry point of the program
**/ 
function init () {
    let canvas = document.getElementById ( 'canvas' );
    let gl     = canvas.getContext ( 'webgl' );
    let game   = new Game ( gl, window.innerWidth, window.innerHeight );
    
    window.addEventListener (
        'visibilitychange',
        function () {
            game.visibilityChange ();
        }
    );
    
    window.addEventListener (
        'resize',
        function () {
            game.resize ( gl, window.innerWidth, window.innerHeight );
        }
    );
    
    window.addEventListener (
        'keydown',
        function ( e ) {
            game.getInput ( e );
        }
    );
    
    // Start the game loop
    requestAnimationFrame ( game.start );
}