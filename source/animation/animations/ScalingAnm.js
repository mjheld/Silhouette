/** 
 *  An animation that changes the scale of a GameObject
**/ 
class ScalingAnm extends Animation {
    
    /** 
     *  Represents a ScalingAnm
     *  
     *  @constructor
     *  
     *  @param { glMatrix.vec3 } scaling - The scale factor for each axis
     *  @param { glMatrix.vec3 } pivot - The point to apply the scaling from
     *  @param { int } ticks - The number of ticks the animation should last
     *  @param { int } delay - The number of ticks to wait before the animation will begin
     *  @param { null | function } easing - A function that transforms linear progress
     *  @param { bool } shouldLoop - States if the animation should repeat itself when completed
    **/ 
    constructor ( scaling, pivot, ticks, delay, easing, shouldLoop ) {
        super ( ticks, delay, easing, shouldLoop );
        
        this.finalScaling = scaling;
        this.prevScaling  = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
        this.pivot        = pivot;
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
            
            let scaling    = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
            let newScaling = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
            
            // Interpolate the animation
            glMatrix.vec3.lerp ( newScaling, newScaling, this.finalScaling, progress );
            glMatrix.vec3.divide ( scaling, newScaling, this.prevScaling );
            
            this.prevScaling = newScaling;
            this.tickCtr++;
            
            // Check if the animation is over
            if ( this.tickCtr == this.ticks ) {
                if ( this.shouldLoop ) {
                    this.prevScaling = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
                    this.tickCtr     = 0;
                }
                
                else { this.isOver = true; }
            }
            
            gameObject.scale ( scaling, this.pivot );
        }
        
        else { this.isOver = true; }
    }
    
}