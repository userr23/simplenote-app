import { pow10 } from '../util';

export default function toFixed ( num, digits = 2 ) {
    const d = pow10( digits );

    return Math.round( num * d ) / d;
}
