import { encode, decode } from './util';

export default class Storage {
    static set ( key, value ) {
        localStorage.setItem( key, encode( value ) );
    }

    static get ( key ) {
        const storedValue = localStorage.getItem( key );

        return storedValue
            ? decode( storedValue )
            : storedValue;
    }

    static remove ( key ) {
        localStorage.removeItem( key );
    }
}

