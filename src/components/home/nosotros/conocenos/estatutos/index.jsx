import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Building2, ScrollText, Users, Gavel } from "lucide-react";
import fondos_submenus from "../../../../../assets/fondos_submenus.jpg";
export default function Index() {
  const [openChapter, setOpenChapter] = useState(null);

  const toggleChapter = (chapter) => {
    setOpenChapter(openChapter === chapter ? null : chapter);
  };

  const chapters = [
    {
      id: 1,
      title: "Capítulo I: Del Nombre, Naturaleza, Duración y Domicilio",
      icon: <Building2 className="w-5 h-5" />,
      articles: [
        {
          num: "ARTÍCULO 1",
          text: "La Asociación Nacional de Empresarios de Colombia es una persona jurídica de derecho civil perteneciente a la especie de las corporaciones, sin ánimo de lucro, con capacidad para adquirir, poseer, gravar y enajenar bienes. La Asociación tendrá carácter permanente. Se identificará con la sigla ANDI."
        },
        {
          num: "ARTÍCULO 2",
          text: "La Asociación tendrá como domicilio la ciudad de Medellín, pudiendo abrir oficinas en el país o en el exterior, con el personal y atribuciones que consideren convenientes los órganos competentes de la Asociación."
        },
        {
          num: "ARTÍCULO 3",
          text: "Podrán ser miembros de la Asociación las personas naturales o jurídicas, que se rijan por el derecho privado y se ocupen en el ejercicio o en la defensa de actividades lícitas de contenido económico."
        }
      ]
    },
    {
      id: 2,
      title: "Capítulo II: Del objeto de la Asociación",
      icon: <ScrollText className="w-5 h-5" />,
      articles: [
        {
          num: "ARTÍCULO 4",
          text: "En su calidad primordial de vocero de los intereses de la Empresa Privada, la Asociación Nacional de Empresarios de Colombia, ANDI tendrá por objeto:",
          list: [
            "a) Defender, fomentar y difundir los principios políticos, económicos y sociales del sistema de libre empresa, basado en la dignidad humana, en la libertad, la democracia política, la justicia social y el respeto a la propiedad privada. Así mismo, propender por la vigencia y respeto de los valores éticos dentro de la comunidad empresarial.",
            "b) Procurar el desarrollo económico y tecnológico del país y la elevación del progreso social de todos los colombianos, colaborando con el Estado en todo cuanto sea necesario para obtener estos fines.",
            "c) Actuar ante las ramas legislativa y ejecutiva del poder público, y en general ante los organismos del Estado para procurar, por la vía de la concertación, normas convenientes para la Nación, los sectores económicos y los afiliados de la Asociación.",
            "d) Mantener contacto, en representación del sector privado, con entidades nacionales y extranjeras que se ocupen de asuntos económicos y sociales, y facilitar a los afiliados la información que pueda serles útil.",
            "e) Adelantar campañas para explicar y difundir los méritos de la democracia política y económica, así como las ventajas de un mercado libre y competitivo.",
            "f) Cooperar en la defensa de los legítimos intereses de sus afiliados, organizando los servicios que presta la Asociación, así como buscar la solidaridad de los sectores y gremios que representa, para el mejor cumplimiento de estos objetivos."
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Capítulo III: De los Asociados",
      icon: <Users className="w-5 h-5" />,
      articles: [
        {
          num: "ARTÍCULO 5",
          text: "Son miembros de la Asociación las personas naturales y jurídicas indicadas en el artículo 3o., que habiendo solicitado su ingreso a la ANDI, lo hayan obtenido conforme a lo previsto en estos estatutos.",
          paragraphs: [
            "Parágrafo 1: Las Organizaciones Gremiales o Profesionales que se afilien a la ANDI, no pierden su autonomía sectorial.",
            "Parágrafo 2: Los afiliados a una Organización Gremial o Profesional, aceptada como miembro de la Asociación, no serán, por ese solo hecho, afiliados a la ANDI."
          ]
        },
        {
          num: "ARTÍCULO 6",
          text: "Para la afiliación se seguirá el siguiente procedimiento:",
          list: [
            "a) Cualesquiera de las Juntas Directivas Seccionales formulará, a través del respectivo Gerente Seccional, una invitación a la empresa o agremiación de ámbito regional para que presente su candidatura a la Asociación.",
            "b) Recibida ésta, será sometida a la misma Junta Directiva Seccional, la cual deberá decidir si recomienda a la Junta de Dirección General la afiliación respectiva.",
            "c) Si la Junta Directiva Seccional recomienda el ingreso, la solicitud se presentará a la consideración de la Junta de Dirección General, y ésta decidirá sobre su ingreso."
          ],
          paragraphs: [
            "Parágrafo 1: Cuando se trate de agremiaciones de carácter nacional, la invitación la hará la Junta de Dirección General, por conducto del Presidente de la Asociación. En este caso la misma Junta tomará directamente la decisión correspondiente.",
            "Parágrafo 2: Las decisiones que hubieren de tomarse en cumplimiento de este artículo se adoptarán por mayoría absoluta de los votos de los Directores presentes, habiendo quórum. La votación será secreta."
          ]
        },
        {
          num: "ARTÍCULO 7",
          text: "Los miembros de la Asociación participarán activamente en la realización de los fines y objetivos descritos en el artículo 4o. de estos estatutos y acatarán las decisiones de las respectivas Asambleas de Afiliados y Juntas Directivas. Así mismo tendrán como obligación contribuir con sus cuotas al sostenimiento de la Asociación y, por el hecho de ingresar a ésta, se comprometen a pagar oportunamente las cuotas ordinarias y extraordinarias que se fijen por los órganos competentes."
        },
        {
          num: "ARTÍCULO 8",
          text: "El carácter de miembro de la Asociación se perderá por cualesquiera de las siguientes causales: Incompatibilidad de las actuaciones del Afiliado, de sus socios en sociedades de personas, de sus directores o representantes legales, con los principios rectores de la Asociación; retiro voluntario; mora en el pago de las cuotas de sostenimiento, tanto ordinarias como extraordinarias. Excepto el retiro voluntario, todas las demás causales serán materia de decisión por parte de la Junta de Dirección General."
        }
      ]
    },
    {
      id: 4,
      title: "Capítulo IV: De los Órganos de Dirección",
      icon: <Gavel className="w-5 h-5" />,
      articles: [
        {
          num: "ARTÍCULO 9",
          text: "La dirección de la Asociación en el orden nacional corresponde a los siguientes órganos: Asamblea General de Afiliados, Junta de Dirección General y Presidencia de la Asociación. También son órganos directivos de la Asociación, en el orden seccional, las Asambleas Seccionales y las respectivas Juntas Directivas. Los Gerentes Seccionales desempeñan las funciones administrativas previstas en el artículo 53 de estos estatutos."
        },
        {
          num: "ARTÍCULO 10",
          text: "Los expresidentes de la Asociación son consejeros de la misma, y en tal carácter pueden ser convocados a las reuniones de los diferentes órganos de la entidad."
        }
      ]
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white  py-20 px-6 md:px-12 lg:px-20" style={{ backgroundImage: `url(${fondos_submenus})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-5xl mx-auto">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Estatutos de la ANDI
          </h2>
          <div className="h-1 w-32 bg-green-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
            Asociación Nacional de Empresarios de Colombia
          </p>
        </motion.div>

        {/* Acordeones con formato Word + estilos premium */}
        <div className="space-y-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              {/* Header del capítulo */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    {chapter.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {chapter.title}
                  </h3>
                </div>
                <div className="text-gray-600">
                  {openChapter === chapter.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </button>

              {/* Contenido expandido - Formato Word */}
              {openChapter === chapter.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 border-t border-gray-200"
                >
                  <div className="pt-6 space-y-8 text-left">
                    {chapter.articles.map((article, i) => (
                      <div key={i} className="space-y-3">
                        {/* Artículo con número a la izquierda */}
                        <div className="flex">
                          <span className="font-bold text-gray-900 mr-3">{article.num}.</span>
                          <div className="flex-1 space-y-3">
                            {/* Texto principal (hasta ":") */}
                            <p className="text-gray-800 leading-relaxed">
                              {article.text.includes(":")
                                ? article.text.split(":").slice(0, -1).join(":") + ":"
                                : article.text
                              }
                            </p>

                            {/* Contenido después de ":" con sangría */}
                            {article.text.includes(":") && (
                              <p className="text-gray-800 leading-relaxed ml-8">
                                {article.text.split(":").slice(-1)[0]}
                              </p>
                            )}

                            {/* Lista de ítems (a, b, c...) */}
                            {article.list && (
                              <div className="ml-8 space-y-2">
                                {article.list.map((item, idx) => (
                                  <p key={idx} className="text-gray-800 leading-relaxed">
                                    <span className="font-medium text-gray-900">{item.charAt(0)}</span>
                                    {item.slice(1)}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Parágrafos */}
                            {article.paragraphs && (
                              <div className="ml-8 space-y-1 text-sm italic text-gray-700">
                                {article.paragraphs.map((p, idx) => (
                                  <p key={idx}>{p}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Nota final */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-gray-600"
        >
          <p>Documento oficial de los Estatutos de la ANDI • Vigente</p>
        </motion.div>
      </div>
    </section>
  );
}