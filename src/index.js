import getDate        from './utils/getDate';
import getTime        from './utils/getTime';
import loremGenerator from './utils/loremGenerator';
import pdfGenerator   from './utils/pdfGenerator';
import Storage        from './utils/Storage';
import randomColor    from './utils/randomColor';

import './styles/main.min.css';
import './styles/index.css';

const CACHE_NAME = 'notes';
const ITEM_COLOR = 'rgba(224, 236, 247, 0.938)';


document.addEventListener( 'DOMContentLoaded', () => {
    const form           = document.querySelector( 'form' );
    const input          = document.getElementById( 'item' );
    const autoComplete   = document.getElementById( 'autoComplete' );
    const notePrefix     = document.getElementById( 'checkDate' );
    const ul             = document.querySelector( 'ul' );
    const buttonTest     = document.getElementById( 'button-test' );
    const buttonClear    = document.getElementById( 'button-clear' );
    const buttonDownload = document.getElementById( 'button-download' );
    const sortDescending = document.getElementById( 'sort' );
    let itemsArray       = Storage.get( CACHE_NAME ) ? Storage.get( CACHE_NAME ) : [];

    Storage.set( CACHE_NAME, itemsArray );
    const data = Storage.get( CACHE_NAME );

    document.documentElement.style.setProperty( '--item-color', ITEM_COLOR );

    autoComplete.addEventListener( 'change', () => {
        autoComplete.checked
            ? input.setAttribute( 'autocomplete', 'on' )
            : input.setAttribute( 'autocomplete', 'off' );
    } );

    form.addEventListener( 'submit', e => {
        e.preventDefault();
        if ( input.value ) {
            const newItem      = notePrefix.checked
                ? `${getDate( '/' )} ${getTime( '-' )}: ${input.value}`
                : `${input.value}`;
            const newItemColor = randomColor( ITEM_COLOR );

            itemsArray.push( newItem );
            Storage.set( CACHE_NAME, itemsArray );
            listItemGenerator( ul, newItem, newItemColor );
            input.value = '';
            input.focus();
        }
    } );


    data.forEach( item => {
        listItemGenerator( ul, item );
    } );

    buttonClear.addEventListener( 'click', () => {
        Storage.remove( CACHE_NAME );
        while ( ul.firstChild ) {
            ul.removeChild( ul.firstChild );
        }
        itemsArray = [];
    } );

    buttonTest.addEventListener( 'click', () => {
        const item         = loremGenerator( 1 );
        const testItem     = notePrefix.checked
            ? `${getDate( '/' )} ${getTime( '-' )}: ${item}`
            : `${item}`;
        const newItemColor = randomColor( ITEM_COLOR );

        itemsArray.push( testItem );
        Storage.set( CACHE_NAME, itemsArray );
        listItemGenerator( ul, testItem, newItemColor );
    } );

    buttonDownload.addEventListener( 'click', () => {
        pdfGenerator( itemsArray, sortDescending.checked );
    } );
} );

// helper

function listItemGenerator ( list, text, bgColor ) {
    const li = document.createElement( 'li' );

    li.textContent = text;
    bgColor && ( li.style.backgroundColor = bgColor );
    list.insertBefore( li, list.childNodes[ 0 ] );
}
