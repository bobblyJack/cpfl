/**
 * convert data to encoded url
 * @param data object with key-value pairs
 * @returns application/x-www-form-urlencoded
 */
export function formURLEncode(data: Record<string, any>): string {
    // Custom encoding function that replaces certain characters
    function encode(value: string | number | boolean): string {
        return encodeURIComponent(String(value))
            .replace(/%20/g, '+')
            .replace(/[!'()*~]/g, ch => '%' + ch.charCodeAt(0).toString(16).toUpperCase());
    }
  
    // Convert data object to URL-encoded string
    return Object.keys(data)
        .map(key => {
            const encodedKey = encode(key);
            const encodedValue = encode(data[key]);
            return data[key] !== undefined && data[key] !== null ? `${encodedKey}=${encodedValue}` : '';
        })
        .filter(pair => pair !== '')
        .join('&');
}