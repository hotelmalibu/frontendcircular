/**
 * Utility function to strip HTML tags from a string.
 * Useful for displaying plain text summaries from HTML content.
 * @param {string} html - The string containing HTML tags.
 * @returns {string} - The plain text string.
 */
export const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // Use regex to remove tags
    // 1. Remove all tags
    // 2. Decode common HTML entities (if needed, but for hover a simple strip is usually enough)
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};
