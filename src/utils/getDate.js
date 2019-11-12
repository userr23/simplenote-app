/**
 * Summary. summary
 *
 * Description. description
 *
 * @param {string}  separator     Description. Separator (default empty string)
 *
 * @return {string} Description. Date in "YYYYMMDD" format with custom separator
 */
export default function getDate ( separator = '' ) {
    const today = new Date();
    const month = today.getMonth() < 9 ? '0' + ( today.getMonth() + 1 ) : today.getMonth() + 1;
    const date  = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    return today.getFullYear() + separator + month + separator + date;
}

