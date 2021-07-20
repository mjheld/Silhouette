/** 
 *  The parent class for game objects
 *  
 *  Note: Use a child class to actually use a game object
**/ 
class GameObject {
    
    /** 
     *  Represents a GameObject
     *  
     *  @constructor
    **/ 
    constructor () {
        this.position       = glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 );
        this.orientation    = glMatrix.quat.create ();
        this.scaling        = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
        this.modelTransform = glMatrix.mat4.create ();
        this.animations     = [];
    }
    
    /** 
     *  Translates the GameObject
     *  
     *  @param { glMatrix.vec3 } translation - The vec3 to translate the GameObject by
    **/ 
    translate ( translation ) {}
    
    /** 
     *  Rotates the GameObject
     *  
     *  @param { glMatrix.quat } rotation - A quaternion representing how to rotate the GameObject
     *  @param { glMatrix.vec3 } pivot - The point to apply the rotation around
    **/ 
    rotate ( rotation, pivot ) {}
    
    /** 
     *  Scales the GameObject
     *  
     *  @param { glMatrix.vec3 } scaling - The scale factor for each axis
     *  @param { glMatrix.vec3 } pivot - The point to apply the scaling from
    **/ 
    scale ( scaling, pivot ) {}
    
    /** 
     *  Adds color to the GameObject
     *  
     *  @param { glMatrix.vec3 } color - The color to add to the GameObject
    **/ 
    addColor ( color ) {}
    
    /** 
     *  Adds an animation to update the GameObject by
     *  
     *  @param { Animation } animation - The animation to update the GameObject by
    **/ 
    addAnimation ( animation ) {
        // Animations added to front of array so they can be removed
        // when iterated from back to front
        this.animations.unshift ( animation );
    }
    
    /** 
     *  Updates the GameObject by advancing the animations it has applied to it
    **/ 
    update () {
        for ( let i = this.animations.length - 1; i >= 0; i-- ) {
            this.animations [ i ].advance ( this );
            
            // Remove the animation if it has completed
            if ( this.animations [ i ].isOver ) { this.animations.splice ( i, 1 ); }
        }
    }
    
}