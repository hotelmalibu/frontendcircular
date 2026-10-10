/**
 * Utility function to decode HTML entities like &aacute;, &nbsp;, etc.
 * Supports multiple passes to unpack double or triple encoded strings.
 * @param {string} text - The string with HTML entities.
 * @returns {string} - The decoded string.
 */
export const decodeHtmlEntities = (text) => {
    if (!text || typeof text !== 'string') return '';
    let str = text;

    for (let i = 0; i < 3; i++) {
        if (!str.includes('&')) break;
        if (typeof document !== 'undefined') {
            const textArea = document.createElement('textarea');
            textArea.innerHTML = str;
            str = textArea.value;
        } else {
            str = str
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, ' ');
        }
    }
    return str;
};

/**
 * Utility function to strip HTML tags from a string and decode entities.
 * Safely removes tags even when encoded as &lt;tag&gt; or mixed.
 * @param {string} html - The string containing HTML tags.
 * @returns {string} - Clean plain text.
 */
export const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // 1. Fully decode entities
    let text = decodeHtmlEntities(html);

    // 2. Remove all HTML tags repeatedly
    text = text.replace(/<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/gim, ' ');
    text = text.replace(/<[^>]*>?/gm, ' ');

    // 3. Clean up non-breaking spaces and redundant whitespaces
    text = text.replace(/\u00A0|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    return text;
};
