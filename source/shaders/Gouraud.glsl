/** 
 *  Vertex shader that lights a model using gouraud shading
**/ 
const GOURAUD_VERTEX_SHADER = `
    precision mediump float;
    
    const float AMBIENT_LIGHT   = 0.33;
    const vec3  LIGHT_DIRECTION = vec3 ( 0.0, 0.0, -1.0 );
    
    attribute vec4 position;
    attribute vec3 normal;
    
    uniform mat4 modelTransform;
    uniform mat4 viewTransform;
    uniform mat4 projectionTransform;
    uniform vec4 surfaceColor;
    
    varying vec4 color;
    
    void main () {
        // Transform normal into camera space
        mat4 modelViewTransform = viewTransform * modelTransform;
        vec3 transformedNormal  = normalize ( mat3 ( modelViewTransform ) * normal );
        
        // Calculate diffuse light
        float diffuseLight = dot ( transformedNormal, -LIGHT_DIRECTION );
        diffuseLight       = clamp ( diffuseLight, 0.0, 1.0 );
        
        color = vec4 (
            surfaceColor.rgb * ( AMBIENT_LIGHT + diffuseLight ),
            surfaceColor.a
        );
        gl_Position = projectionTransform * modelViewTransform * position;
    }
`;