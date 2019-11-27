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
    const form              = document.querySelector( 'form' );
    const input             = document.getElementById( 'item-input' );
    const inputAutoComplete = document.getElementById( 'autoComplete' );
    const notePrefix        = document.getElementById( 'checkDate' );
    const notesList         = document.querySelector( 'ul' );
    const testButton        = document.getElementById( 'button-test' );
    const clearButton       = document.getElementById( 'button-clear' );
    const downloadButton    = document.getElementById( 'button-download' );
    const sortDescending    = document.getElementById( 'sort' );
    const data              = Storage.get( CACHE_NAME ) ? Storage.get( CACHE_NAME ) : [];

    document.documentElement.style.setProperty( '--item-color', ITEM_COLOR );
    input.focus();

    inputAutoComplete.addEventListener( 'change', () => {
        inputAutoComplete.checked
            ? input.setAttribute( 'autocomplete', 'on' )
            : input.setAttribute( 'autocomplete', 'off' );
    } );

    form.addEventListener( 'submit', e => {
        e.preventDefault();
        if ( input.value ) {
            let notesArray     = Storage.get( CACHE_NAME ) ? Storage.get( CACHE_NAME ) : [];
            const text         = notePrefix.checked
                ? `${getDate( '/' )} ${getTime( '-' )}: ${input.value}`
                : `${input.value}`;
            const newItemColor = randomColor( ITEM_COLOR );
            const id           = `${getDate()}${getTime()}_${toFixed( getRandomArbitrary( 10, 99 ), 0 )}`;
            const newNote      = { id: id, text: text };

            notesArray.push( newNote );
            Storage.set( CACHE_NAME, notesArray );
            listItemGenerator( notesList, newNote, newItemColor );
            input.value = '';
            input.focus();
        }
    } );


    data.forEach( item => {
        listItemGenerator( notesList, item );
    } );

    clearButton.addEventListener( 'click', () => {
        Storage.remove( CACHE_NAME );
        while ( notesList.firstChild ) {
            notesList.removeChild( notesList.firstChild );
        }
    } );

    testButton.addEventListener( 'click', () => {
        let notesArray     = Storage.get( CACHE_NAME ) ? Storage.get( CACHE_NAME ) : [];
        const lorem        = loremGenerator( 1 );
        const text         = notePrefix.checked
            ? `${getDate( '/' )} ${getTime( '-' )}: ${lorem}`
            : `${lorem}`;
        const newItemColor = randomColor( ITEM_COLOR );
        const id           = `${getDate()}${getTime()}_${toFixed( getRandomArbitrary( 10, 99 ), 0 )}`;
        const testNote     = { id: id, text: text };

        notesArray.push( testNote );
        Storage.set( CACHE_NAME, notesArray );
        listItemGenerator( notesList, testNote, newItemColor );
    } );

    downloadButton.addEventListener( 'click', () => {
        pdfGenerator( Storage.get( CACHE_NAME ), sortDescending.checked );
    } );

    notesList.addEventListener( 'click', e => {
        e.preventDefault();
        editCurrentNote( e );
    } );
} );

// helpers

function listItemGenerator ( list, item, bgColor ) {
    const li             = document.createElement( 'li' );
    const span           = document.createElement( 'span' );
    const buttonsWrapper = document.createElement( 'div' );
    const deleteButton   = document.createElement( 'button' );
    const editButton     = document.createElement( 'button' );
    const { id, text }   = item;

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
    buttonsWrapper.appendChild( editButton );
    buttonsWrapper.appendChild( deleteButton );
    li.appendChild( span );
    li.appendChild( buttonsWrapper );

    list.insertBefore( li, list.childNodes[ 0 ] );
}

function editCurrentNote ( e ) {
    const currentNote    = e.target.closest( '.item' );
    const buttonsWrapper = currentNote.querySelector( 'div' );
    const textWrapper    = currentNote.firstChild;

    if ( e.target.tagName === 'BUTTON' ) {

        if ( e.target.classList.contains( 'delete-btn' ) ) {
            if ( textWrapper.contentEditable === 'true' ) {
                const storedData = Storage.get( CACHE_NAME );

                textWrapper.textContent     = storedData
                    .filter( item => currentNote.id === item.id )[ 0 ].text;
                textWrapper.contentEditable = 'false';
                textWrapper.removeAttribute( 'class' );
                e.target.textContent                 = '\u2715';
                e.target.previousSibling.textContent = '\u270E';

            } else {
                const storedData   = Storage.get( CACHE_NAME );
                const filteredData = storedData.filter( item => item.id !== currentNote.id );

                Storage.set( CACHE_NAME, filteredData );
                currentNote.remove();

            }
        }

        if ( e.target.classList.contains( 'edit-btn' ) ) {
            if ( textWrapper.contentEditable === 'false' ) {
                textWrapper.contentEditable = 'true';
                textWrapper.setAttribute( 'class', 'edit' );
                e.target.textContent             = '\u2713';
                e.target.nextSibling.textContent = '\u232B';
            } else {
                const storedData = Storage.get( CACHE_NAME );
                const editedData = storedData.map( item => {
                    if ( currentNote.id === item.id ) {
                        item.text = textWrapper.textContent;
                    }
                    return item;
                } );

                Storage.set( CACHE_NAME, editedData );
                textWrapper.contentEditable = 'false';
                textWrapper.removeAttribute( 'class' );
                e.target.textContent             = '\u270E';
                e.target.nextSibling.textContent = '\u2715';
            }
        }
    }

    if ( buttonsWrapper && textWrapper.getAttribute( 'class' ) !== 'edit' ) {
        buttonsWrapper.getAttribute( 'class' )
            ? buttonsWrapper.removeAttribute( 'class' )
            : buttonsWrapper.setAttribute( 'class', 'visible' );
    }
}
