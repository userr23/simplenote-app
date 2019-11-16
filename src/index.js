import * as JsPDF from 'jspdf';
import './fonts/Cormorant-Regular-normal';

import getDate        from './utils/getDate';
import getTime        from './utils/getTime';
import loremGenerator from './utils/loremGenerator';
import Storage        from './utils/Storage';
import randomColor    from './utils/randomColor';

import './styles/main.min.css';
import './styles/index.css';

const CACHE_NAME = 'notes';
const ITEM_COLOR = 'rgba(224, 236, 247, 0.938)';

const form           = document.querySelector( 'form' );
const input          = document.getElementById( 'item' );
const autoComplete   = document.getElementById( 'autoComplete' );
const notePrefix     = document.getElementById( 'checkDate' );
const ul             = document.querySelector( 'ul' );
const buttonTest     = document.getElementById( 'button-test' );
const buttonClear    = document.getElementById( 'button-clear' );
const buttonDownload = document.getElementById( 'button-download' );
let itemsArray       = Storage.get( CACHE_NAME ) ? Storage.get( CACHE_NAME ) : [];


Storage.set( CACHE_NAME, itemsArray );
const data = Storage.get( CACHE_NAME );

document.documentElement.style.setProperty( '--item-color', ITEM_COLOR );

autoComplete.addEventListener( 'change', () => {
    autoComplete.checked
        ? input.setAttribute( 'autocomplete', 'on' )
        : input.setAttribute( 'autocomplete', 'off' );
} );

const listMaker = ( text, bgColor ) => {
    const li       = document.createElement( 'li' );
    li.textContent = text;
    bgColor && ( li.style.backgroundColor = bgColor );
    ul.insertBefore( li, ul.childNodes[ 0 ] );
};

form.addEventListener( 'submit', e => {
    e.preventDefault();
    if ( input.value ) {
        const newItem      = notePrefix.checked
            ? `${getDate( '/' )} ${getTime( '-' )}: ${input.value}`
            : `${input.value}`;
        const newItemColor = randomColor( ITEM_COLOR );

        itemsArray.push( newItem );
        Storage.set( CACHE_NAME, itemsArray );
        listMaker( newItem, newItemColor );
        input.value = '';
        input.focus();
    }
} );


data.forEach( item => {
    listMaker( item );

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
    listMaker( testItem, newItemColor );
} );

buttonDownload.addEventListener( 'click', () => {
    if ( itemsArray.length > 0 ) {
        const itemsList = [ ...itemsArray ].reverse().reduce( ( res, item ) => {
            res += item + '\n\n';
            return res;
        }, '' );

        const pdf = new JsPDF( {
            unit       : 'pt',
            orientation: 'p',
            lineHeight : 1.2
        } );

        pdf.addFont( 'Cormorant-Regular-normal.ttf', 'Cormorant', 'normal' );
        pdf.setFont( 'Cormorant' );
        pdf.setFontType( 'normal' );

        const splitText  = pdf.splitTextToSize( itemsList, 620 );
        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth  = pdf.internal.pageSize.width;

        pdf.setFontSize( 20 );
        pdf.text( pageWidth / 2 - 30, 60, 'NOTES' );

        pdf.setFontSize( 12 );

        let y     = 100;
        let pages = 1;

        for ( let i = 0; i < splitText.length; i++ ) {
            if ( y > ( pageHeight - 50 ) ) {
                pdf.text( pageWidth / 2 - 10, pageHeight - 20, `- ${pages} -` );
                y = 60;
                pages += 1;
                pdf.addPage();
            }

            pdf.text( 80, y, splitText[ i ] );
            y += 14;
        }

        pdf.text( pageWidth / 2 - 10, pageHeight - 20, `- ${pages} -` );

        pdf.save( `Notes_${getDate()}-${getTime()}.pdf` );
    }
} );
