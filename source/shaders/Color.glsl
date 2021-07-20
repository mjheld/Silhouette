/** 
 *  Fragment shader that takes in a color and outputs it
**/ 
const COLOR_FRAGMENT_SHADER = `
    precision mediump float;
    
    varying vec4 color;
    
    void main () {
        gl_FragColor = color;
    }
`;