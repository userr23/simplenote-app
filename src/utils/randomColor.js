import { getRandomArbitrary, getRGBA } from './util';

/**
 * Summary. summary
 *
 * Description. description
 *
 * @param {string}  colorRGBA    Description.
 *
 * @return {string} Description.
 */
export default function randomColor ( colorRGBA ) {
    const { red, green, blue, alpha } = getRGBA( colorRGBA );
    return `rgba(${red * getRandomArbitrary( 0.98, 1.05 )}, ${green * getRandomArbitrary( 0.95, 0.97 )}, ${blue *
    getRandomArbitrary( 0.98, 1.05 )}, ${alpha})`;
}
