import getDate from './getDate';
import getTime from './getTime';

import * as JsPDF from 'jspdf';
import '../fonts/Cormorant-Regular-normal';


export default function pdfGenerator ( itemsArray, sortDescending ) {
    if ( itemsArray && itemsArray.length > 0 ) {
        const arr       = sortDescending ? itemsArray : [ ...itemsArray ].reverse();
        const itemsList = arr.reduce( ( res, item ) => {
            res += item.text + '\n\n';
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
}
