/** 
 *  Functions that specify the rate of change of a parameter over time
 *  
 *  Note: Based off of https://easings.net
**/ 
class Ease {
    
    /** 
     *  Eases into the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static inExpo ( pct ) {
        if ( pct == 0.0 ) { return 0.0; }
        else { return Math.pow ( 2.0, 10.0 * pct - 10.0 ); }
    }
    
    /** 
     *  Eases out of the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static outExpo ( pct ) {
        if ( pct == 1.0 ) { return 1.0; }
        else { return 1.0 - Math.pow ( 2.0, -10.0 * pct ); }
    }
    
    /** 
     *  Eases into and out of the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static inOutExpo ( pct ) {
        if ( pct == 0.0 ) { return 0.0; }
        if ( pct == 1.0 ) { return 1.0; }
        if ( pct < 0.5 ) { return Math.pow ( 2.0, 20.0 * pct - 10.0 ) / 2.0; }
        else { return ( 2.0 - Math.pow ( 2.0, -20.0 * pct + 10.0 ) ) / 2.0; }
    }
    
    /** 
     *  Eases out the front of the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static inBack ( pct ) {
        let c0 = pct * pct;
        let c1 = c0 * pct;
        return 2.70158 * c1 - 1.70158 * c0;
    }
    
    /** 
     *  Eases out the back of the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static outBack ( pct ) {
        let c0 = pct - 1.0;
        let c1 = c0 * c0;
        let c2 = c1 * c0;
        return 1.0 + 2.70158 * c2 + 1.70158 * c1;
    }
    
    /** 
     *  Eases out the front and back of the animation
     *  
     *  @param { float } pct - The percent of the animation that has been completed
     *  
     *  @returns { float } - pct transformed over the 0-1 range
    **/ 
    static inOutBack ( pct ) {
        let c0 = pct * 2.0;
        let c1 = c0 - 2.0;
        if ( pct < 0.5 ) { return ( c0 * c0 * ( 3.5949095 * 2.0 * pct - 2.5949095 ) ) / 2.0; }
        else { return ( c1 * c1 * ( 3.5949095 * c1 + 2.5949095 ) + 2.0 ) / 2.0; }
    }
    
}