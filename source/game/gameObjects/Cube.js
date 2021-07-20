/** 
 *  A cube in the game
**/ 
class Cube extends GameObject {
    
    static EDGE_COLOR_MULT = glMatrix.vec3.fromValues ( 0.343, 0.343, 0.343 );
    
    /** 
     *  Represents a Cube
     *  
     *  @constructor
    **/ 
    constructor () {
        super ();
        
        this.color     = glMatrix.vec3.fromValues ( 0.5, 0.5, 0.5 );
        this.edgeWidth = 1.0;
    }
    
    /** 
     *  Translates the Cube
     *  
     *  @param { glMatrix.vec3 } translation - The vec3 to translate the Cube by
    **/ 
    translate ( translation ) {
        let transform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromTranslation ( transform, translation );
        
        glMatrix.vec3.add ( this.position, this.position, translation );
        glMatrix.mat4.multiply ( this.modelTransform, this.modelTransform, transform );
    }
    
    /** 
     *  Rotates the Cube
     *  
     *  @param { glMatrix.quat } rotation - A quaternion representing how to rotate the Cube
     *  @param { glMatrix.vec3 } pivot - The point to apply the rotation around
    **/ 
    rotate ( rotation, pivot ) {
        let transform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            transform,
            rotation,
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ),
            pivot
        );
        
        glMatrix.quat.multiply ( this.orientation, this.orientation, rotation );
        glMatrix.quat.normalize ( this.orientation, this.orientation );
        glMatrix.vec3.transformMat4 ( this.position, this.position, transform );
        glMatrix.mat4.multiply ( this.modelTransform, this.modelTransform, transform );
    }
    
    /** 
     *  Scales the Cube
     *  
     *  @param { glMatrix.vec3 } scaling - The scale factor for each axis
     *  @param { glMatrix.vec3 } pivot - The point to apply the scaling from
    **/ 
    scale ( scaling, pivot ) {
        let transform = glMatrix.mat4.create ();
        
        glMatrix.mat4.fromRotationTranslationScaleOrigin (
            transform,
            glMatrix.quat.create (),
            glMatrix.vec3.fromValues ( 0.0, 0.0, 0.0 ),
            scaling,
            pivot
        );
        
        glMatrix.vec3.multiply ( this.scaling, this.scaling, scaling );
        glMatrix.vec3.transformMat4 ( this.position, this.position, transform );
        glMatrix.mat4.multiply ( this.modelTransform, transform, this.modelTransform );
    }
    
    /** 
     *  Adds color to the Cube
     *  
     *  @param { glMatrix.vec3 } color - The color to add to the Cube
    **/ 
    addColor ( color ) {
        glMatrix.vec3.add ( this.color, this.color, color );
    }
    
    /** 
     *  Draws the faces of the Cube
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { OrthoCamera } camera - The camera to draw the Cube from
    **/ 
    draw ( gl, camera ) {
        let uniforms = GLProgram.programs.get ( 'GOURAUD' ).uniforms;
        
        gl.uniformMatrix4fv ( uniforms.get ( 'modelTransform' ), false, this.modelTransform );
        gl.uniformMatrix4fv ( uniforms.get ( 'viewTransform' ), false, camera.inverseModelTransform );
        gl.uniformMatrix4fv ( uniforms.get ( 'projectionTransform' ), false, camera.projectionTransform );
        gl.uniform4f ( uniforms.get ( 'surfaceColor' ), this.color [ 0 ], this.color [ 1 ], this.color [ 2 ], 1.0 );
        
        let indicies = GLBuffer.buffers.get ( 'CUBE_INDICES' ).buffer;
        
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, indicies );
        gl.drawElements ( gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0 );
    }
    
    /** 
     *  Draws the edges of the Cube as a wireframe
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { OrthoCamera } camera - The camera to draw the Cube from
    **/ 
    drawEdges ( gl, camera ) {
        let edgeColor = glMatrix.vec3.clone ( this.color );
        
        glMatrix.vec3.multiply ( edgeColor, edgeColor, Cube.EDGE_COLOR_MULT );
        
        let uniforms = GLProgram.programs.get ( 'LINE' ).uniforms;
        
        gl.uniformMatrix4fv ( uniforms.get ( 'modelTransform' ), false, this.modelTransform );
        gl.uniformMatrix4fv ( uniforms.get ( 'viewTransform' ), false, camera.inverseModelTransform );
        gl.uniformMatrix4fv ( uniforms.get ( 'projectionTransform' ), false, camera.projectionTransform );
        gl.uniform4f ( uniforms.get ( 'lineColor' ), edgeColor [ 0 ], edgeColor [ 1 ], edgeColor [ 2 ], 1.0 );
        gl.uniform1f ( uniforms.get ( 'lineWidth' ), this.edgeWidth );
        
        let indicies = GLBuffer.buffers.get ( 'LINE_INDICES' ).buffer;
        
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, indicies );
        
        // Iterate through the twelve edges of the Cube
        for ( let i = 0; i < 12; i++ ) {
            let index0 = CUBE_EDGE_INDICES [ i * 2 ] * 3;
            let index1 = CUBE_EDGE_INDICES [ i * 2 + 1 ] * 3;
            
            // The first endpoint of the line
            let point0 = glMatrix.vec4.fromValues (
                CUBE_EDGE_POSITIONS [ index0 ],
                CUBE_EDGE_POSITIONS [ index0 + 1 ],
                CUBE_EDGE_POSITIONS [ index0 + 2 ],
                1.0
            );
            
            // The second endpoint of the line
            let point1 = glMatrix.vec4.fromValues (
                CUBE_EDGE_POSITIONS [ index1 ],
                CUBE_EDGE_POSITIONS [ index1 + 1 ],
                CUBE_EDGE_POSITIONS [ index1 + 2 ],
                1.0
            );
            
            gl.uniform4fv ( uniforms.get ( 'point0' ), point0 );
            gl.uniform4fv ( uniforms.get ( 'point1' ), point1 );
            
            gl.drawElements ( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }
    }
    
}