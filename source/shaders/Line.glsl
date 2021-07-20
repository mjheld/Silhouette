/** 
 *  Vertex shader that transforms 4 vertices into a line of
 *  the specified thickness that faces the camera
**/ 
const LINE_VERTEX_SHADER = `
    precision mediump float;
    
    attribute vec2 position;
    
    uniform vec4  point0;
    uniform vec4  point1;
    uniform mat4  modelTransform;
    uniform mat4  viewTransform;
    uniform mat4  projectionTransform;
    uniform vec4  lineColor;
    uniform float lineWidth;
    
    varying vec4 color;
    
    void main () {
        // Transform points into camera space
        vec4 transformedPoint0 = viewTransform * modelTransform * point0;
        vec4 transformedPoint1 = viewTransform * modelTransform * point1;
        
        // Calculate which side of line to use using position.x ( will be either 0 or 1 )
        vec4 line  = transformedPoint1 - transformedPoint0;
        vec4 point = transformedPoint0 + ( line * position.x );
        
        float halfWidth = lineWidth / 2.0;
        
        // Expand the point out in the direction of the
        // line by halfWidth to add an end cap to the line
        vec2 offset = ( normalize ( vec2 ( line ) ) * halfWidth ) * ( -1.0 + ( position.x * 2.0 ) );
        
        // Calculate the offset off the point to create a thicker
        // line using position.y ( will be either -1 or 1 )
        offset += vec2 ( -offset.y, offset.x ) * position.y;
        
        // Apply the offset
        vec4 offsetPoint = vec4 ( point.xy + offset, point.z, point.w );
        
        color       = lineColor;
        gl_Position = projectionTransform * offsetPoint;
    }
`;