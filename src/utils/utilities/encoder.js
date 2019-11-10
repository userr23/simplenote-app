import logger from '../logger';

export function encode ( data ) {
    let result;

    try {
        result = window.btoa( JSON.stringify( data ) )
            .replace( /[=]/g, '' )
            .replace( /[+]/g, '-' )
            .replace( /[/]/g, '_' );
    } catch ( e ) {
        logger.error( `Encoding error for '${JSON.stringify( data )}': ${e.message}` );
    }

    return result;
}

export function decode ( string ) {
    let result;

    if ( string.indexOf( '%' ) !== -1 ) {
        try {
            string = decodeURIComponent( string );
        } catch ( e ) {
            logger.error( `URIComponent decoding error for '${string}': ${e.message}` );
        }
    }

    try {
        string = string.replace( /\s/g, '' );

        string = padString( string )
            .replace( /-/g, '+' )
            .replace( /_/g, '/' );

        result = JSON.parse( window.atob( string ) );
    } catch ( e ) {
        logger.error( `Decoding error for '${string}': ${e.message}` );
    }

    return result;
}

function padString ( string ) {
    const stringLength = string.length;
    const diff         = stringLength % 4;
    let result         = string;

    if ( diff ) {
        let padLength = 4 - diff;

        while ( padLength-- ) {
            result += '=';
        }
    }

    return result;
}
