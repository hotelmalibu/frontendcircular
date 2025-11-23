import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { allContentData, contentTypeConfig } from '../../data/mockContent'; 

export default function ContentDetailPage() {
  const { slug } = useParams();
  
  // Buscar el contenido basado en el slug (URL)
  const content = allContentData.find(item => item.slug === slug);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenido no encontrado</h2>
        <Link to="/explorar" className="text-[#00AB6D] hover:underline font-semibold">
          ← Volver a explorar
        </Link>
      </div>
    );
  }

  // Obtener configuración de estilo (colores, iconos)
  const config = contentTypeConfig[content.type] || {};
  const Icon = config.icon;

  // URLs para compartir (dinámicas)
  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(content.title);

  return (
    <div className="min-h-screen bg-white fontfamily-montserrat">
     
      {/* --- HERO HEADER --- 
          Detecta si debe mostrar imagen o color sólido (igual que las tarjetas) 
      */}
      <div className={`relative w-full h-[70vh] md:h-[80vh] flex items-end overflow-hidden ${config.isSolid ? config.bgColor : 'bg-gray-900'}`}>

        
        {/* FONDO: Imagen o Color Sólido */}
        {config.isSolid ? (
          // Versión Sólida (Documentos)
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             {/* Icono gigante decorativo */}
             <Icon size={400} strokeWidth={0.5} className="text-white opacity-10 absolute -right-20 -bottom-20 rotate-12" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ) : (
          // Versión Imagen (Noticias)
          <>
            <img 
              src={content.image} 
              alt={content.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D]/90 via-[#1E305D]/40 to-transparent"></div>
          </>
        )}

        {/* TÍTULO Y DATOS EN HERO */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 pb-16 md:pb-20">
          <div className="max-w-4xl">
            {/* Breadcrumb / Tipo */}
            <Link to="/explorar" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
              <ArrowLeft size={16} /> Volver a explorar
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 text-white backdrop-blur-sm border border-white/20`}>
                {content.type}
              </span>
              <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                <Calendar size={14} /> {content.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
              {content.title}
            </h1>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 py-16">
          
          {/* COLUMNA IZQUIERDA (Social Share Sticky) */}
          <div className="lg:w-24 flex-shrink-0">
             <div className="sticky top-32 flex lg:flex-col gap-4 items-center lg:items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:block mb-2">Compartir</span>
                <SocialButton icon={Facebook} url={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} color="hover:bg-blue-600" />
                <SocialButton icon={Twitter} url={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}`} color="hover:bg-sky-500" />
                <SocialButton icon={Linkedin} url={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${shareTitle}`} color="hover:bg-blue-700" />
                <SocialButton icon={Mail} url={`mailto:?subject=${shareTitle}&body=${currentUrl}`} color="hover:bg-gray-600" />
                
                {/* Móvil: Etiqueta compartir */}
                <div className="lg:hidden flex items-center gap-2 text-gray-400 text-sm font-bold ml-auto">
                    <Share2 size={16} /> Compartir
                </div>
             </div>
          </div>

          {/* COLUMNA DERECHA (Texto del Artículo) */}
          <div className="flex-1 max-w-3xl">
            
            {/* Extracto destacado */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed mb-10 border-l-4 border-[#00AB6D] pl-6">
              {content.excerpt}
            </p>

            {/* Cuerpo del texto (Simulado con HTML) */}
            <div className="prose prose-lg prose-headings:text-[#1E305D] prose-a:text-[#00AB6D] text-gray-600">
              <p>
                La transición hacia modelos más sostenibles dejó de ser una tendencia para convertirse en una necesidad estratégica. Hoy, las empresas que integran principios de economía circular en sus cadenas de valor no solo reducen impactos ambientales, sino que también mejoran su competitividad, fortalecen su reputación y abren nuevas oportunidades de negocio
              </p>
              <br />
              <h3><strong>¿Por qué transformar la cadena de valor?</strong></h3>
              <br />
              <p>
                Adoptar prácticas circulares permite repensar procesos, materiales y relaciones con proveedores para crear sistemas más eficientes y resilientes. Esto implica pasar de un modelo lineal —extraer, producir y desechar— a uno regenerativo, donde cada recurso mantiene su valor el mayor tiempo posible.
              </p>
              <br />
              <p> <strong>Entre los impactos más destacados:</strong></p>
              <br />
              <ul>
                <li>Reducción de residuos industriales en un 40%.</li>
                <li>Optimización de la cadena de suministro inversa.</li>
                <li>Generación de nuevos empleos verdes.</li>
              </ul>
                <br />
              <p>
                Estas mejoras no solo fortalecen la sostenibilidad ambiental, sino que también elevan la rentabilidad operativa al disminuir pérdidas y aumentar el valor recuperado.
              </p>
                <br />
              <em>
                "La economía circular no es solo una opción ambiental, es una estrategia de negocio resiliente para el futuro."
              </em>
              <br />
              
            </div>

            {/* Footer del artículo: Tema */}
            <div className="mt-16 pt-8 border-t border-gray-100">
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-4">Temática relacionada:</span>
               <Link to="/explorar" className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-[#00AB6D] hover:text-white transition-colors">
                  {content.topic}
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente Botón Social
function SocialButton({ icon: Icon, url, color }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 hover:text-white hover:border-transparent hover:-translate-y-1 ${color}`}
    >
      <Icon size={20} />
    </a>
  );
}