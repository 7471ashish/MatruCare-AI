/**
 * Safe HTTP/HTTPS URL validator using standard WHATWG URL parser
 * Avoids ReDoS (Regular Expression Denial of Service) risks
 */
const isValidHttpUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

module.exports = {
  isValidHttpUrl,
};

