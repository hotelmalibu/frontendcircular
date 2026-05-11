/**
 * Utility function to decode HTML entities like &aacute;, &nbsp;, etc.
 * @param {string} text - The string with HTML entities.
 * @returns {string} - The decoded string.
 */
export const decodeHtmlEntities = (text) => {
    if (!text || typeof text !== 'string') return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

/**
 * Utility function to strip HTML tags from a string and decode entities.
 * Useful for displaying plain text summaries from HTML content.
 * @param {string} html - The string containing HTML tags.
 * @returns {string} - The plain text string.
 */
export const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // 1. Remove all tags
    const stripped = html.replace(/<[^>]*>?/gm, '');
    
    // 2. Decode HTML entities
    return decodeHtmlEntities(stripped);
};
