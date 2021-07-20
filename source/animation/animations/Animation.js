/** 
 *  The parent class for animations
 *  
 *  Note: Use a child class to actually use an animation
**/ 
class Animation {
    
    /** 
     *  Represents an Animation
     *  
     *  @constructor
     *  
     *  @param { int } ticks - The number of ticks the animation should last
     *  @param { int } delay - The number of ticks to wait before the animation will begin
     *  @param { null | function } easing - A function that transforms linear progress
     *  @param { bool } shouldLoop - States if the animation should repeat itself when completed
    **/ 
    constructor ( ticks, delay, easing, shouldLoop ) {
        this.ticks      = ticks;
        this.tickCtr    = 0;
        this.delay      = delay;
        this.delayCtr   = 0;
        this.easing     = easing;
        this.shouldLoop = shouldLoop;
        this.isOver     = false;
    }
    
    /** 
     *  Advances the animation by one frame
     *  
     *  @param { GameObject } gameObject - The GameObject to perform the animation on
    **/ 
    advance ( gameObject ) {}
    
}