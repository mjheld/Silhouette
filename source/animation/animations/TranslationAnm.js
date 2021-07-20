/** 
 *  An animation that changes the position of a GameObject
**/ 
class TranslationAnm extends Animation {
    
    /** 
     *  Represents a TranslationAnm
     *  
     *  @constructor
     *  
     *  @param { glMatrix.vec3 } translation - The vec3 to translate the GameObject by
     *  @param { int } ticks - The number of ticks the animation should last
     *  @param { int } delay - The number of ticks to wait before the animation will begin
     *  @param { null | function } easing - A function that transforms linear progress
     *  @param { bool } shouldLoop - States if the animation should repeat itself when completed
    **/ 
    constructor ( translation, ticks, delay, easing, shouldLoop ) {
        super ( ticks, delay, easing, shouldLoop );
        
        this.finalTranslation = translation;
        this.prevTranslation  = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
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
            
            let translation    = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
            let newTranslation = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
            
            // Interpolate the animation
            glMatrix.vec3.lerp ( newTranslation, newTranslation, this.finalTranslation, progress );
            glMatrix.vec3.subtract ( translation, newTranslation, this.prevTranslation );
            
            this.prevTranslation = newTranslation;
            this.tickCtr++;
            
            // Check if the animation is over
            if ( this.tickCtr == this.ticks ) {
                if ( this.shouldLoop ) {
                    this.prevTranslation = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.tickCtr         = 0;
                }
                
                else { this.isOver = true; }
            }
            
            gameObject.translate ( translation );
        }
        
        else { this.isOver = true; }
    }
    
}