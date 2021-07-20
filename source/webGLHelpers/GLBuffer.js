/** 
 *  A helper class to create WebGL buffers
**/ 
class GLBuffer {
    
    static buffers = new Map ();
    
    /** 
     *  Represents a GLBuffer
     *  
     *  @constructor
     *  
     *  @param { WebGLRenderingContext } gl - The webgl context
     *  @param { string } name - The key used to identify the buffer
     *  @param { GLenum } target - Specifies the binding point
     *  @param { array } data - The data to put into the buffer
     *  @param { GLenum } usage - Specifies the intended usage pattern of the data
    **/ 
    constructor ( gl, name, target, data, usage ) {
        this.buffer = gl.createBuffer ();
        
        gl.bindBuffer ( target, this.buffer );
        gl.bufferData ( target, data, usage );
        
        GLBuffer.buffers.set ( name, this );
    }
    
}