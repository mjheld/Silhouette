/** 
 *  Generates a visually appealing color scheme
**/ 
class ColorScheme {
    
    static colors = new Map ();
    
    /** 
     *  Returns a clone of the color specified by the key
     *  
     *  Note: Color keys are generated in the ColorScheme constructor
     *  
     *  @param { string } key - The key used when making the color
     *  
     *  @returns { glMatrix.vec3 } - A clone of the color specified by the key
    **/ 
    static get ( key ) {
        return glMatrix.vec3.clone ( ColorScheme.colors.get ( key ) );
    }
    
    /** 
     *  Returns a string representation of the color specified by the key
     *  
     *  Note: Color keys are generated in the ColorScheme constructor
     *  
     *  @param { string } key - The key used when making the color
     *  
     *  @returns { string } - A string representation of the color specified by the key
    **/ 
    static getString ( key ) {
        let color = ColorScheme.colors.get ( key );
        
        return 'rgb( ' +
            Math.floor ( color [ 0 ] * 255.0 ) +
            ', ' +
            Math.floor ( color [ 1 ] * 255.0 ) +
            ', ' +
            Math.floor ( color [ 2 ] * 255.0 ) +
            ' )';
    }
    
    /** 
     *  Generates a new monochromatic color scheme that
     *  is stored in the static variable 'colors' so they
     *  can be accesed anywhere in the program
     *  
     *  @constructor
    **/ 
    constructor () {
        ColorScheme.colors.clear ();
        
        // Generate random main color
        let mainColor = glMatrix.vec3.fromValues (
            Random.randomFloat ( 0.0, 0.5 ),
            Random.randomFloat ( 0.0, 0.5 ),
            Random.randomFloat ( 0.0, 0.5 )
        );
        
        // Make the main color more pastel in color
        glMatrix.vec3.add ( mainColor, mainColor, glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ) );
        glMatrix.vec3.divide ( mainColor, mainColor, glMatrix.vec3.fromValues ( 2.0, 2.0, 2.0 ) );
        
        let darker  = glMatrix.vec3.clone ( mainColor );
        let dark    = glMatrix.vec3.clone ( mainColor );
        let light   = glMatrix.vec3.clone ( mainColor );
        let lighter = glMatrix.vec3.clone ( mainColor );
        
        // Generate shades of main color
        glMatrix.vec3.multiply ( darker, darker, glMatrix.vec3.fromValues ( 0.375, 0.375, 0.375 ) );
        glMatrix.vec3.multiply ( dark, dark, glMatrix.vec3.fromValues ( 0.7, 0.7, 0.7 ) );
        
        // Generate tints of main color
        let temp = glMatrix.vec3.create ();
        
        glMatrix.vec3.subtract ( temp, glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ), light );
        glMatrix.vec3.multiply ( temp, temp, glMatrix.vec3.fromValues ( 0.1, 0.1, 0.1 ) );
        glMatrix.vec3.add ( light, temp, light );
        
        glMatrix.vec3.subtract ( temp, glMatrix.vec3.fromValues ( 1.0, 1.0, 1.0 ), lighter );
        glMatrix.vec3.multiply ( temp, temp, glMatrix.vec3.fromValues ( 0.9, 0.9, 0.9 ) );
        glMatrix.vec3.add ( lighter, temp, lighter );
        
        // These are the keys to use when accessing colors
        ColorScheme.colors.set ( 'DARKER', darker );
        ColorScheme.colors.set ( 'DARK', dark );
        ColorScheme.colors.set ( 'MAIN', mainColor );
        ColorScheme.colors.set ( 'LIGHT', light );
        ColorScheme.colors.set ( 'LIGHTER', lighter );
    }
    
}