/**
 * Summary. summary
 *
 * Description. description
 *
 * @param {string}  separator     Description. Separator (default empty string)
 *
 * @return {string} Description. Time in "hhmmss" format with custom separator
 */
export default function getTime ( separator = '' ) {
    const today   = new Date();
    const hours   = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

    return hours + separator + minutes + separator + seconds;
}

