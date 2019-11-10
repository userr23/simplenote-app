export default function getRGBA ( str ) {
    const match = str.match( /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3}), ?(\d(?:\.\d?))\)?/ );

    return match ? {
        red  : Number( match[ 1 ] ),
        green: Number( match[ 2 ] ),
        blue : Number( match[ 3 ] ),
        alpha: Number( match[ 4 ] )
    } : {};
}
