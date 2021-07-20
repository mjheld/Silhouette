/** 
 *  A camera that has an orthographic projection
**/ 
class OrthoCamera extends GameObject {
    
    /** 
     *  Represents an OrthoCamera
     *  
     *  @constructor
     *  
     *  @param { float } left - The left bound of the camera
     *  @param { float } right - The right bound of the camera
     *  @param { float } bottom - The bottom bound of the camera
     *  @param { float } top - The top bound of the camera
     *  @param { float } near - The near bound of the camera
     *  @param { float } far - The far bound of the camera
    **/ 
    constructor ( left, right, bottom, top, near, far ) {
        super ();
        
        this.projectionTransform   = glMatrix.mat4.create ();
        this.inverseModelTransform = glMatrix.mat4.create ();
        
        glMatrix.mat4.ortho ( this.projectionTransform, left, right, bottom, top, near, far );
    }
    
    /** 
     *  Translates the OrthoCamera
     *  
     *  @param { glMatrix.vec3 } translation - The vec3 to translate the OrthoCamera by
    **/ 
    translate ( translation ) {
        let inverseTranslation = glMatrix.vec3.create ();
        
        glMatrix.vec3.negate ( inverseTranslation, translation );
        
        let transform        = glMatrix.mat4.create ();
        let inverseTransform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromTranslation ( transform, translation );
        glMatrix.mat4.fromTranslation ( inverseTransform, inverseTranslation );
        
        glMatrix.vec3.add ( this.position, this.position, translation );
        glMatrix.mat4.multiply ( this.modelTransform, this.modelTransform, transform );
        glMatrix.mat4.multiply ( this.inverseModelTransform, this.inverseModelTransform, inverseTransform );
    }
    
    /** 
     *  Rotates the OrthoCamera
     *  
     *  @param { glMatrix.quat } rotation - A quaternion representing how to rotate the OrthoCamera
     *  @param { glMatrix.vec3 } pivot - The point to apply the rotation around
    **/ 
    rotate ( rotation, pivot ) {
        let inverseRotation = glMatrix.quat.create ();
        
        glMatrix.quat.invert ( inverseRotation, rotation );
        
        let transform        = glMatrix.mat4.create ();
        let inverseTransform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            transform,
            rotation,
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ),
            pivot
        );
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            inverseTransform,
            inverseRotation,
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ),
            pivot
        );
        
        glMatrix.quat.multiply ( this.orientation, rotation, this.orientation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
        glMatrix.vec3.transformMat4 ( this.position, this.position, transform );
        glMatrix.mat4.multiply ( this.modelTransform, this.modelTransform, transform );
        glMatrix.mat4.multiply ( this.inverseModelTransform, this.inverseModelTransform, inverseTransform );
    }
    
    /** 
     *  Scales the OrthoCamera
     *  
     *  @param { glMatrix.vec3 } scaling - The scale factor for each axis
     *  @param { glMatrix.vec3 } pivot - The point to apply the scaling from
    **/ 
    scale ( scaling, pivot ) {
        let inverseScaling = glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 );
        
        glMatrix.vec3.divide ( inverseScaling, inverseScaling, scaling );
        
        let transform        = glMatrix.mat4.create ();
        let inverseTransform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            transform,
            glMatrix.quat.create (),
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            scaling,
            pivot
        );
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            inverseTransform,
            glMatrix.quat.create (),
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            inverseScaling,
            pivot
        );
        
        glMatrix.vec3.multiply ( this.scaling, this.scaling, scaling );
        glMatrix.vec3.transformMat4 ( this.position, this.position, transform );
        glMatrix.mat4.multiply ( this.modelTransform, this.modelTransform, transform );
        glMatrix.mat4.multiply ( this.inverseModelTransform, this.inverseModelTransform, inverseTransform );
    }
    
}