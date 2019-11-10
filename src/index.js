import * as JsPDF from 'jspdf';
import './fonts/Cormorant-Regular-normal';

import './styles/main.min.css';
import './styles/index.css';

const form           = document.querySelector( 'form' );
const input          = document.getElementById( 'item' );
const autoComplete   = document.getElementById( 'autoComplete' );
const notePrefix     = document.getElementById( 'checkDate' );
const ul             = document.querySelector( 'ul' );
const buttonTest     = document.getElementById( 'button-test' );
const buttonClear    = document.getElementById( 'button-clear' );
const buttonDownload = document.getElementById( 'button-download' );
let itemsArray       = localStorage.getItem( 'notes' ) ? JSON.parse( localStorage.getItem( 'notes' ) ) : [];

localStorage.setItem( 'notes', JSON.stringify( itemsArray ) );
const data = JSON.parse( localStorage.getItem( 'notes' ) );

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
        const newItemColor = `rgba(${224 * getRandomArbitrary( 0.97, 1 )}, ${236 *
        getRandomArbitrary( 0.93, 1 )}, ${247 * getRandomArbitrary( 0.99, 1 )}, 0.938)`;

        itemsArray.push( newItem );
        localStorage.setItem( 'notes', JSON.stringify( itemsArray ) );
        listMaker( newItem, newItemColor );
        input.value = '';
        input.focus();
    }
} );


data.forEach( item => {
    listMaker( item );

} );

buttonClear.addEventListener( 'click', () => {
    localStorage.clear();
    while ( ul.firstChild ) {
        ul.removeChild( ul.firstChild );
    }
    itemsArray = [];
} );

buttonTest.addEventListener( 'click', () => {
    const lorem        = loremGenerator( 1 );
    const item         = lorem.substring( 0, getRandomArbitrary( 50, lorem.length ) );
    const testItem     = notePrefix.checked ? `${getDate( '/' )} ${getTime( '-' )}: ${item}` : `${item}`;
    const newItemColor = `rgba(${224 * getRandomArbitrary( 0.97, 1 )}, ${236 * getRandomArbitrary( 0.93, 1 )}, ${247 *
    getRandomArbitrary( 0.99, 1 )}, 0.938)`;

    itemsArray.push( testItem );
    localStorage.setItem( 'notes', JSON.stringify( itemsArray ) );
    listMaker( testItem, newItemColor );
} );

buttonDownload.addEventListener( 'click', () => {
    const arrReverse = itemsArray.reverse();
    const itemsList  = arrReverse.reduce( ( res, item ) => {
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
} );


//helpers

function getRandomArbitrary ( min, max ) {
    return Math.random() * ( max - min ) + min;
}

function getDate ( separator = '' ) {
    const today = new Date();
    const month = today.getMonth() < 9 ? '0' + ( today.getMonth() + 1 ) : today.getMonth() + 1;
    const date  = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    return today.getFullYear() + separator + month + separator + date;
}

function getTime ( separator = '' ) {
    const today   = new Date();
    const hours   = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

    return hours + separator + minutes + separator + seconds;
}

function loremGenerator ( paras ) {
    const lorem = 'Lorem ipsum vivamus commodo amet odio enim ipsum duis lorem bibendum integer malesuada. Sagittis' +
        ' tempus, eget a, proin metus bibendum congue ornare nec bibendum, mauris malesuada rutrum enim sem mattis' +
        ' auctor, orci diam lorem, commodo quisque congue gravida. Leo ipsum urna donec porttitor gravida nibh in, sit' +
        ' enim magna. Arcu sit commodo odio vivamus proin maecenas tempus eros, arcu eget: integer metus - sit ut, nam' +
        ' at massa orci ornare orci risus orci, lorem sit. Urna at - sem maecenas bibendum justo, nibh, ornare porta' +
        ' malesuada, eget magna non in diam odio morbi - mattis magna integer cursus.';
    let res     = '';
    for ( let i = 0; i < paras; i++ ) {
        res += lorem;
    }
    return res;
}


