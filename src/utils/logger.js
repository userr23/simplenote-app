/* eslint no-console: 0 */

export default {
    log,
    group,
    error
};

export const params = {
    POINT : {
        text : ' Point',
        style: 'color: white; background-color: #2294A5'
    },
    CONST : {
        text : ' Const',
        style: 'color: white; background-color: #80a1d4'
    },
    RESULT: {
        text : 'Result',
        style: 'color: white; background-color: #48A2E8'
    }
};


// realization
function log ( type, text ) {
    console.log( `%c${type.text}`, type.style, text );
}

function group ( name, data ) {
    console.group( name );
    data.forEach( ( [ type, text ] ) => log( type, text ) );
    console.groupEnd();
}

function error ( err ) {
    console.error( err );
}
