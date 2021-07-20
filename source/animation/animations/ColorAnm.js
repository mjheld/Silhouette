/** 
 *  An animation that changes the color of a GameObject
**/ 
class ColorAnm extends Animation {
    
    /** 
     *  Represents a ColorAnm
     *  
     *  @constructor
     *  
     *  @param { glMatrix.vec3 } currColor - The starting color
     *  @param { glMatrix.vec3 } newColor - The color to animate to
     *  @param { int } ticks - The number of ticks the animation should last
     *  @param { int } delay - The number of ticks to wait before the animation will begin
     *  @param { null | function } easing - A function that transforms linear progress
     *  @param { bool } shouldLoop - States if the animation should repeat itself when completed
    **/ 
    constructor ( currColor, newColor, ticks, delay, easing, shouldLoop ) {
        super ( ticks, delay, easing, shouldLoop );
        
        this.startColor = currColor;
        this.finalColor = newColor;
        this.prevColor  = currColor;
    }
    
    /** 
     *  Advances the animation by one frame
     *  
     *  @param { GameObject } gameObject - The GameObject to perform the animation on
    **/ 
    advance ( gameObject ) {
        if ( this.delayCtr < this.delay ) { this.delayCtr++; }
        
        else if ( this.tickCtr < this.ticks ) {
            // Get linear progress of animation
            let progress = ( this.tickCtr + 1 ) / this.ticks;
            
            // Potentially apply an easing function to the linear progress
            progress = ( this.easing == null ) ? progress : this.easing ( progress );
            
            let color    = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
            let newColor = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
            
            // Interpolate the animation
            glMatrix.vec3.lerp ( newColor, this.startColor, this.finalColor, progress );
            glMatrix.vec3.subtract ( color, newColor, this.prevColor );
            
            this.prevColor = newColor;
            this.tickCtr++;
            
            // Check if the animation is over
            if ( this.tickCtr == this.ticks ) {
                if ( this.shouldLoop ) {
                    this.prevColor = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.tickCtr   = 0;
                }
                
                else { this.isOver = true; }
            }
            
            gameObject.addColor ( color );
        }
        
        else { this.isOver = true; }
    }
    
}