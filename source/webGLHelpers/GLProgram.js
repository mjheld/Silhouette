/** 
 *  A helper class to create WebGL programs
**/ 
class GLProgram {
    
    static programs = new Map ();
    
    /** 
     *  Represents a GLProgram
     *  
     *  @constructor
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { string } name - The key used to identify the program
     *  @param { WebGLShader } vertexShader - The vertex shader to use in the program
     *  @param { WebGLShader } fragmentShader - The fragment shader to use in the program
    **/ 
    constructor ( gl, name, vertexShader, fragmentShader ) {
        this.program    = gl.createProgram ();
        this.attributes = new Map ();
        this.uniforms   = new Map ();
        
        gl.attachShader ( this.program, vertexShader );
        gl.attachShader ( this.program, fragmentShader );
        
        gl.linkProgram ( this.program );
        
        // Check if the program failed to link
        if ( !gl.getProgramParameter ( this.program, gl.LINK_STATUS ) ) {
            console.log ( gl.getProgramInfoLog ( this.program ) );
            gl.deleteProgram ( this.program );
        }
        
        else {
            let attributeNum = gl.getProgramParameter ( this.program, gl.ACTIVE_ATTRIBUTES );
            let uniformNum   = gl.getProgramParameter ( this.program, gl.ACTIVE_UNIFORMS );
            
            // Get the attributes used in the program
            for ( let i = 0; i < attributeNum; i++ ) {
                let info = gl.getActiveAttrib ( this.program, i );
                this.attributes.set ( info.name, gl.getAttribLocation ( this.program, info.name ) );
            }
            
            // Get the uniforms used in the program
            for ( let i = 0; i < uniformNum; i++ ) {
                let info = gl.getActiveUniform ( this.program, i );
                this.uniforms.set ( info.name, gl.getUniformLocation ( this.program, info.name ) );
            }
            
            GLProgram.programs.set ( name, this );
        }
    }
    
}