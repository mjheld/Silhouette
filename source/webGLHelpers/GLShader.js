/** 
 *  A helper class to create WebGL shaders
**/ 
class GLShader {
    
    /** 
     *  Represents a GLShader
     *  
     *  @constructor
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { GLenum } type - The type of shader
     *  @param { string } source - The shader code
    **/ 
    constructor ( gl, type, source ) {
        this.shader = gl.createShader ( type );
        
        gl.shaderSource ( this.shader, source );
        gl.compileShader ( this.shader );
        
        // Check if the shader failed to compile
        if ( !gl.getShaderParameter ( this.shader, gl.COMPILE_STATUS ) ) {
            console.log ( gl.getShaderInfoLog ( this.shader ) );
            gl.deleteShader ( this.shader );
        }
    }
    
}