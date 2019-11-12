import { getRandomIntInclusive, toFixed } from './util';

/**
 * Summary. summary
 *
 * Description. description
 *
 * @param {number}  paras     Description. Number of Lorem paragraph repeats.
 *
 * @return {string} Description. Lorem text.
 */
export default function loremGenerator ( paras ) {
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

    const randomPart = res.substring( 0, toFixed( getRandomIntInclusive( 110, res.length ), 0 ) );

    return randomPart.slice( 0, randomPart.lastIndexOf( '.' ) + 1 );
}
