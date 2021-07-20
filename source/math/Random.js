/** 
 *  A helper class to generate randomness
**/ 
class Random {
    
    /** 
     *  Generates a random integer withen a range
     *  
     *  @param { int } min - The minimum value
     *  @param { int } max - The maximum value
     *  
     *  @returns { int } - A random integer between min ( inclusive ) and max ( inclusive )
    **/ 
    static randomInteger ( min, max ) {
        return Math.floor ( Math.random () * ( max - min + 1 ) + min );
    }
    
    /** 
     *  Generates a random float within a range
     *  
     *  @param { float } min - The minimum value
     *  @param { float } max - The maximum value
     *  
     *  @returns { float } - A random float between min ( inclusive ) and max ( exclusive )
    **/ 
    static randomFloat ( min, max ) {
        return Math.random () * ( max - min ) + min;
    }
    
    /** 
     *  Picks a random entry in a map
     *  
     *  @param { Map } map - The map to choose an entry from
     *  
     *  @returns { key } - The key to the entry picked
    **/ 
    static randomEntryInMap ( map ) {
        if ( map.size == 0 ) { return null; }
        
        let index   = Random.randomInteger ( 0, map.size - 1 );
        let counter = 0;
        
        for ( let key of map.keys () ) {
            if ( counter == index ) { return key; }
            else { counter++; }
        }
    }
    
}