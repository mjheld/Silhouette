/** 
 *  An animation that changes the rotation of a GameObject
**/ 
class RotationAnm extends Animation {
    
    /** 
     *  Represents a RotationAnm
     *  
     *  @constructor
     *  
     *  @param { glMatrix.quat } rotation - A quaternion representing how to rotate the GameObject
     *  @param { glMatrix.vec3 } pivot - The point to apply the rotation around
     *  @param { int } ticks - The number of ticks the animation should last
     *  @param { int } delay - The number of ticks to wait before the animation will begin
     *  @param { null | function } easing - A function that transforms linear progress
     *  @param { bool } shouldLoop - States if the animation should repeat itself when completed
    **/ 
    constructor ( rotation, pivot, ticks, delay, easing, shouldLoop ) {
        super ( ticks, delay, easing, shouldLoop );
        
        this.finalRotation = rotation;
        this.prevRotation  = glMatrix.quat.create ();
        this.pivot         = pivot;
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
            
            let rotation    = glMatrix.quat.create ();
            let newRotation = glMatrix.quat.create ();
            let prevInverse = glMatrix.quat.create ();
            
            // Interpolate the animation
            glMatrix.quat.invert ( prevInverse, this.prevRotation );
            glMatrix.quat.normalize ( prevInverse, prevInverse );
            
            glMatrix.quat.slerp ( newRotation, newRotation, this.finalRotation, progress );
            glMatrix.quat.normalize ( newRotation, newRotation );
            glMatrix.quat.multiply ( rotation, newRotation, prevInverse );
            glMatrix.quat.normalize ( rotation, rotation );
            
            this.prevRotation = newRotation;
            this.tickCtr++;
            
            // Check if the animation is over
            if ( this.tickCtr == this.ticks ) {
                if ( this.shouldLoop ) {
                    this.prevRotation = glMatrix.quat.create ();
                    this.tickCtr      = 0;
                }
                
                else { this.isOver = true; }
            }
            
            gameObject.rotate ( rotation, this.pivot );
        }
        
        else { this.isOver = true; }
    }
    
}