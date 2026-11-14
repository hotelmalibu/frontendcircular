// Browser logs must not retain API responses, headers, form data or signed URLs.
// Keep only a generic diagnostic category during development; production is silent.
const diagnostic = (level) => () => {
  if (process.env.NODE_ENV === 'development') console[level](`Aplicación: ${level}.`);
};

const clientLogger = {
  log: diagnostic('log'),
  debug: diagnostic('debug'),
  info: diagnostic('info'),
  warn: diagnostic('warn'),
  error: diagnostic('error'),
};

export default clientLogger;
