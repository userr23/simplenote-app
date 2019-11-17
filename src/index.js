import getDate                         from './utils/getDate';
import getTime                         from './utils/getTime';
import loremGenerator                  from './utils/loremGenerator';
import pdfGenerator                    from './utils/pdfGenerator';
import Storage                         from './utils/Storage';
import randomColor                     from './utils/randomColor';
import { getRandomArbitrary, toFixed } from './utils/util';

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

    if ( !Storage.get( CACHE_NAME ) ) {
        Storage.set( CACHE_NAME, [] );
    }

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
            let itemsArray     = Storage.get( CACHE_NAME );
            const text         = notePrefix.checked
                ? `${getDate( '/' )} ${getTime( '-' )}: ${input.value}`
                : `${input.value}`;
            const newItemColor = randomColor( ITEM_COLOR );
            const id           = `${getDate()}${getTime()}_${toFixed( getRandomArbitrary( 10, 99 ), 0 )}`;
            const newItem      = { id: id, text: text };

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
    } );

    buttonTest.addEventListener( 'click', () => {
        let itemsArray     = Storage.get( CACHE_NAME );
        const lorem        = loremGenerator( 1 );
        const text         = notePrefix.checked
            ? `${getDate( '/' )} ${getTime( '-' )}: ${lorem}`
            : `${lorem}`;
        const newItemColor = randomColor( ITEM_COLOR );
        const id           = `${getDate()}${getTime()}_${toFixed( getRandomArbitrary( 10, 99 ), 0 )}`;
        const testItem     = { id: id, text: text };

        itemsArray.push( testItem );
        Storage.set( CACHE_NAME, itemsArray );
        listItemGenerator( ul, testItem, newItemColor );
    } );

    buttonDownload.addEventListener( 'click', () => {
        pdfGenerator( Storage.get( CACHE_NAME ), sortDescending.checked );
    } );
} );

// helpers

function listItemGenerator ( list, item, bgColor ) {
    const li           = document.createElement( 'li' );
    const span         = document.createElement( 'span' );
    const div          = document.createElement( 'div' );
    const deleteButton = document.createElement( 'button' );
    const editButton   = document.createElement( 'button' );
    const { id, text } = item;

    span.setAttribute( 'class', 'item-content' );
    span.contentEditable = 'false';
    span.textContent     = text;
    li.setAttribute( 'class', 'item' );
    li.setAttribute( 'id', id );
    deleteButton.setAttribute( 'class', 'muted-button delete-btn' );
    deleteButton.textContent = '\u2715';
    editButton.setAttribute( 'class', 'muted-button edit-btn' );
    editButton.textContent = '\u270E';

    bgColor && ( li.style.backgroundColor = bgColor );
    div.appendChild( editButton );
    div.appendChild( deleteButton );
    li.appendChild( span );
    li.appendChild( div );

    list.insertBefore( li, list.childNodes[ 0 ] );

    listenEditItem( editButton );
    listenDeleteItem( deleteButton );
}

function listenEditItem ( element ) {
    element.addEventListener( 'click', e => {
        const itemToEdit = element.closest( '.item' );
        if ( element.closest( '.item' ).firstChild.contentEditable === 'false' ) {
            element.closest( '.item' ).firstChild.contentEditable = 'true';
            element.closest( '.item' ).firstChild.setAttribute( 'class', 'edit' );
            e.target.textContent = '\u2713';
        } else {
            const storedData = Storage.get( CACHE_NAME );
            const editedData = storedData.map( item => {
                if ( itemToEdit.id === item.id ) {
                    item.text = element.closest( '.item' ).firstChild.textContent;
                }
                return item;
            } );

            Storage.set( CACHE_NAME, editedData );
            element.closest( '.item' ).firstChild.contentEditable = 'false';
            element.closest( '.item' ).firstChild.removeAttribute( 'class' );
            e.target.textContent = '\u270E';
        }
        e.stopPropagation();
    } );
}

function listenDeleteItem ( element ) {
    element.addEventListener( 'click', e => {
        const itemToRemove = element.closest( '.item' );
        const storedData   = Storage.get( CACHE_NAME );
        const filteredData = storedData.filter( item => item.id !== itemToRemove.id );

        Storage.set( CACHE_NAME, filteredData );
        element.closest( '.item' ).remove();
        e.stopPropagation();
    } );
}

