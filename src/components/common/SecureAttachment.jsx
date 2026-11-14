import { useEffect, useState } from 'react';
import { fetchSecureFile, openDocumentFile } from '../../utils/secureFiles';

export default function SecureAttachment({ file }) {
  const [url, setUrl] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let objectUrl;
    fetchSecureFile(file.url).then((result) => {
      objectUrl = result;
      if (active) setUrl(result);
      else URL.revokeObjectURL(result);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file.url]);
  return (
    <button type="button" className="group relative h-40 rounded-2xl overflow-hidden border border-gray-200 hover:border-[#2C67B0] transition-all"
      onClick={() => openDocumentFile(file.url, file.original_name || 'adjunto').catch(() => setFailed(true))} disabled={!url}>
      {url ? <img src={url} alt="Evidencia adjunta" className="w-full h-full object-cover" /> : <span>{failed ? 'No se pudo cargar el adjunto' : 'Cargando adjunto…'}</span>}
    </button>
  );
}
