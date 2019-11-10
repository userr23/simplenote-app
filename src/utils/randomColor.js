import { getRandomArbitrary, getRGBA } from './util';

/**
 * Summary. summary
 *
 * Description. description
 *
 * @param {string}  colorRGBA     Description. Base color.
 *
 * @return {string} Description. Random color.
 */
export default function randomColor ( colorRGBA ) {
    const { red, green, blue, alpha } = getRGBA( colorRGBA );
    return `rgba(${red * getRandomArbitrary( 0.97, 1 )}, ${green * getRandomArbitrary( 0.93, 1 )}, ${blue *
    getRandomArbitrary( 0.99, 1 )}, ${alpha})`;
}
