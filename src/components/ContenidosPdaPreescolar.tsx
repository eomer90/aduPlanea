type TypePDA = {
  id: string;
  grado: string;
  descripcion: string;
};

type TypeContenidoPDA = {
  id: string;
  nombre: string;
  pdas: TypePDA[];
};

type TypeCamposFormativos = {
  id: string;
  nombre: string;
  contenidos: TypeContenidoPDA[];
};

const contenidosPDA: TypeCamposFormativos[] = [
  {
    id: "campo-1",
    nombre: "Lenguajes",

    contenidos: [
      {
        id: "contenido-1",
        nombre:
          "Comunicación oral de necesidades, emociones, gustos, ideas y saberes, a través de los diversos lenguajes, desde una perspectiva comunitaria.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Emplea palabras, gestos, señas, imágenes, sonidos o movimientos corporales que aprende en su comunidad, para expresar necesidades, ideas, emociones y gustos que reflejan su forma de interpretar y actuar en el mundo. Reconoce que cuando juega y socializa con sus pares, se expresan desde sus posibilidades, vivencias y cultura. Espera su turno al participar en una conversación con sus compañeras o compañeros.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Manifiesta oralmente y de manera clara necesidades, emociones, gustos, preferencias e ideas, que construye en la convivencia diaria, y se da a entender apoyándose de distintos lenguajes. Escucha con atención a sus pares y espera su turno para hablar. Se interesa por lo que otras personas expresan, sienten y saben e intercambia sus puntos de vista.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "De manera oral, expresa ideas completas sobre necesidades, vivencias, emociones, gustos, preferencias y saberes a distintas personas, combinando los lenguajes. Comprende, al interactuar con las demás personas, que existen diversas formas de comunicarse. Conversa y opina sobre diferentes temas y con varias personas interlocutoras.",
          },
        ],
      },

      {
        id: "contenido-2",
        nombre:
          "Narración de historias mediante diversos lenguajes, en un ambiente donde niñas y niños participen y se apropien de la cultura, a través de diferentes textos.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Evoca y narra fragmentos de diferentes textos literarios leyendas, cuentos, fábulas, historias−, y relatos de la comunidad, que escucha en voz de otras personas que las narran o leen. Comparte las emociones que le provocan. Describe lugares o personajes de las historias o textos literarios que conoce y los relaciona con personas, paisajes y otros elementos de su comunidad. Explica lo que interpreta y entiende de las historias y textos literarios que conoce o escucha.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Lee con apoyo y narra con una secuencia lógica, diferentes textos literarios como leyendas, cuentos, fábulas, historias, y relatos de la comunidad, en las que aprecia otras formas de vida, de pensamiento y de comportamiento. Narra con secuencia lógica, historias que conoce o inventa, y las acompaña con recursos de los lenguajes artísticos. Modifica eventos, lugares o personajes de distintas narraciones y textos literarios, utilizando recursos de los lenguajes que reflejan experiencias, emociones y vivencias propias relacionadas con su cultura.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Narra historias que inventa considerando los momentos de inicio, desarrollo y final, de manera individual o colectiva. Describe detalles de personajes y lugares, los comparte con sus pares para evocarlos y enriquecerlos, e incorpora nuevos elementos a partir de los rasgos de su cultura y de otras regiones.",
          },
        ],
      },
      {
        id: "contenido-3",
        nombre:
          "Recursos y juegos del lenguaje que fortalecen la diversidad de formas de expresión oral, y que rescatan la o las lenguas de la comunidad y de otros lugares.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Participa en juegos del lenguaje de la tradición oral de las familias o la comunidad y los expresa con fluidez. Combina recursos de los lenguajes, tales como movimientos corporales, gestos, velocidades, ritmos, entre otros, al decir rimas, poemas, canciones, retahílas, trabalenguas, adivinanzas y otros juegos del lenguaje. Descubre en los juegos del lenguaje, palabras nuevas y se interesa por saber su significado.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Participa en juegos del lenguaje de la tradición oral de la comunidad o de otros lugares, los dice con fluidez, ritmo y claridad. Utiliza distintos recursos de los lenguajes, tales como sonido, ritmo, música, velocidad y movimientos corporales, gestos o señas, para acompañar y modificar adivinanzas, canciones, trabalenguas, retahílas, coplas, entre otros, y con ello crea otras formas de expresión. Interpreta el significado de palabras desconocidas en los juegos del lenguaje, a partir de su contexto.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Propone y organiza con ayuda, juegos del lenguaje para invitar a sus pares a participar. Experimenta con los recursos de los lenguajes para crear, en lo individual y lo colectivo, juegos del lenguaje como adivinanzas, trabalenguas, canciones, rimas, coplas u otros. Combina e inventa nuevas palabras y las integra a su expresión.",
          },
        ],
      },
      {
        id: "contenido-4",
        nombre:
          "Reconocimiento y aprecio de la diversidad lingüística, al identificar las formas en que se comunican las distintas personas de la comunidad.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Reconoce que hay personas que se comunican en lenguas distintas a la propia. Identifica los distintos lenguajes que usan las personas a su alrededor.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Se familiariza con lenguas distintas a la suya que escucha en su comunidad e incorpora a su comunicación, expresiones de origen indígena, extranjero o de las lenguas de señas. Muestra interés por indagar significados de palabras, frases o señas, y las incorpora a su comunicación como una forma de enriquecerla.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Identifica y utiliza algunas palabras, frases o señas de la diversidad lingüística. Reconoce que algunos objetos se nombran de distinta manera, en diferentes regiones. Identifica que algunos nombres propios son de origen indígena y extranjero. Indaga, en distintas fuentes, el significado de términos o palabras que se utilizan en diferentes contextos o regiones.",
          },
        ],
      },
      {
        id: "contenido-5",
        nombre:
          "Representación gráfica de ideas y descubrimientos, al explorar los diversos textos que hay en su comunidad y otros lugares.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Explora y descubre diversos textos de su hogar y escuela, como cuentos, carteles, letreros o mensajes, e interpreta qué dicen a partir de las imágenes y marcas gráficas, e identifica para qué sirven. Relaciona el contenido de los diversos textos de su hogar y escuela con sus experiencias de vida.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Interpreta, a partir de experiencias y referentes culturales, el contenido de diversos textos que le interesan y sabe para qué son. Representa gráficamente, con recursos personales, ideas y descubrimientos del entorno mediante textos conocidos. Comunica a diversas personas, mensajes con distintos propósitos. Comparte con sus pares los diversos textos de su interés, explica qué le gusta y por qué, e identifica su contenido.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Utiliza distintos textos (carteles, avisos, periódico mural, revistas, hojas, cuadernos) para representar gráficamente ideas que descubre del entorno de manera vivencial y al consultar libros, revistas y otras fuentes impresas y digitales. Expresa sus preferencias hacia ciertos textos e identifica algunas de sus funciones, como obtener información y disfrutar historias, entre otras. Interpreta y elabora algunas señalizaciones, símbolos y letreros a partir de entender sus características, elementos gráficos y contexto.",
          },
        ],
      },
      {
        id: "contenido-6",
        nombre:
          "Expresión de emociones y experiencias, en igualdad de oportunidades, apoyándose de recursos gráficos personales y de los lenguajes artísticos.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Representa emociones y experiencias de manera gráfica, haciendo uso de dibujos o recursos de los lenguajes artísticos. Presta atención a las producciones que comparten sus pares, y expresa lo que le provocan. Describe, en su producción gráfica: cómo se siente, por qué se siente así, lo que le provoca, o bien, relata lo que le sucedió.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Elige algunos recursos gráficos, como marcas propias, símbolos, dibujos o algunos otros de los lenguajes artísticos, al representar emociones y experiencias. Observa las producciones de sus pares y expresa su opinión. Intercambia ideas acerca de las producciones de sus compañeras y compañeros, y encuentra semejanzas con las propias. Explica a otras personas lo que representan sus producciones gráficas (alguna emoción, experiencia, paisaje, ser vivo o persona).",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Combina recursos gráficos y de los lenguajes artísticos, en la representación de emociones y experiencias. Explica y comparte sus producciones con las y los demás, dice o señala qué quiso representar y describe detalles para enfatizar ciertas emociones o experiencias. Argumenta su opinión acerca de las producciones de sus pares. Compara sus producciones con las de sus pares, para encontrar semejanzas en los elementos artísticos utilizados y en algunas emociones y experiencias. Reconoce que las demás personas tienen el mismo derecho para expresarse.",
          },
        ],
      },
      {
        id: "contenido-7",
        nombre:
          "Producciones gráficas dirigidas a diversas destinatarias y diversos destinatarios, para establecer vínculos sociales y acercarse a la cultura escrita.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Reconoce que las producciones gráficas, son una forma de establecer comunicación o vínculos con otras personas. Elabora producciones gráficas (mensajes, avisos, recados, entre otros) con marcas propias, dibujos o por medio del dictado, para informar algo a diferentes personas. Identifica su nombre escrito y otras palabras, en distintos objetos personales del aula o su casa. Encuentra semejanzas, ya sea por las grafías o los sonidos, con los nombres de sus pares.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Reconoce que las producciones gráficas son importantes para mantener comunicación con su comunidad. Produce textos o mensajes de interés, con formas gráficas personales, copiando textos o dictando a alguien, con distintos propósitos y destinatarios. Representa su nombre y otras palabras comunes, con recursos propios y con distintos propósitos, tales como marcar sus producciones, registrar su asistencia, entre otros. Distingue semejanzas y diferencias con los nombres de sus pares, por los sonidos, marcas gráficas o letras.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Planifica producciones gráficas, tales como avisos, recomendaciones de libros, recados, letreros, entre otros, de forma individual o en pequeños equipos. Recurre a diversos textos para copiar palabras, combinar letras del nombre propio, el de sus pares o dicta a alguna persona adulta, para establecer vínculos con las familias, la escuela y la comunidad. Usa grafías para representar su nombre y otras palabras conocidas con diversos propósitos. Reconoce las letras de su nombre en textos impresos y digitales.",
          },
        ],
      },
      {
        id: "contenido-8",
        nombre:
          "Reconocimiento de ideas o emociones en la interacción con manifestaciones culturales y artísticas y con la naturaleza, a través de diversos lenguajes.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Describe características de manifestaciones culturales y artísticas de la comunidad, como los colores, texturas, tamaños, sonidos y posturas que reconoce, entre otros elementos. Comenta lo que le gusta, le provocan o le hacen sentir las manifestaciones artísticas o culturales de la comunidad (esculturas, pinturas, obras de teatro, entre otras). Identifica emociones a partir de los elementos que componen las manifestaciones culturales y artísticas. Interpreta manifestaciones artísticas y culturales diversas (fotografías, música regional, murales, danzas, entre otras) a partir de los elementos que las componen.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Interpreta manifestaciones artísticas y culturales diversas (fotografías, música regional, murales, danzas, entre otras) a partir de los elementos que las componen. Explica lo que le provocan las manifestaciones artísticas y culturales; y escucha lo que sus pares comparten. Comparte su experiencia estética con sus pares, al mencionar lo que le gusta, disgusta, lo que le provocan ciertos colores, formas, figuras, rostros, sonidos, posturas, entre otros elementos de las manifestaciones artísticas y culturales de su comunidad u otros lugares. Relaciona en las manifestaciones artísticas y culturales, sucesos, experiencias o emociones personales. Reconoce que existen opiniones diferentes en torno a la diversidad de manifestaciones artísticas y culturales.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Explica lo que le gusta o disgusta, lo que se imagina y le provocan las manifestaciones culturales y artísticas (pinturas, zonas arqueológicas, poemas, artesanías, entre otras), a partir de sus elementos, como formas, trazos, personas, objetos o sonidos y ritmos. Aprecia y expresa gusto por ciertas manifestaciones o por alguna o algún artista. Relaciona en algunas manifestaciones artísticas y culturales, sucesos personales o familiares, así como lo que pasa en su comunidad. Escucha lo que le comparten sus pares y reconoce que hay diversidad de opiniones, gustos o disgustos alrededor de una misma manifestación artística o cultural.",
          },
        ],
      },
      {
        id: "contenido-9",
        nombre:
          "Producción de expresiones creativas con los distintos elementos de los lenguajes artísticos.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Experimenta con los diversos elementos de los lenguajes artísticos y descubre sus posibilidades de creación y expresión. Produce expresiones creativas para representar el mundo cercano, experiencias de su vida personal, familiar, la naturaleza que le rodea o creaciones de su imaginación, recurriendo a los distintos recursos de las artes. Muestra sensibilidad hacia las producciones de sus pares.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Combina elementos de los lenguajes artísticos, tales como formas, colores, texturas, tamaños, líneas, sonidos, música, voces, entre otros, en producciones creativas, para representar el mundo cercano, experiencias personales, situaciones imaginarias o algún cuento. Aprecia con empatía las expresiones de otras personas.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Enriquece sus producciones creativas de expresión gráfica o corporal, al incluir o retomar elementos, tales como líneas, combinación de colores, formas, imágenes, gestos, posturas, sonidos, entre otros, de las manifestaciones artísticas y culturales. Aprecia y opina sobre las creaciones de sus pares y otros artistas de la comunidad.",
          },
        ],
      },
    ],
  },
  {
    id: "campo-2",
    nombre: "Saberes y Pensamiento Científico",

    contenidos: [
      {
        id: "contenido-1",
        nombre:
          "Exploración de la diversidad natural que existe en la comunidad y en otros lugares.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Usa sus sentidos para percibir en su entorno cercano, plantas que le llaman la atención y describe características tales como: olor, color, forma, textura o tamaño, si tienen hojas, flores o frutos. Socializa lo que sabe sobre su entorno natural y hace nuevos descubrimientos con sus pares. Indaga sobre los cuidados que necesitan las plantas y los animales de su comunidad. Experimenta con elementos de la naturaleza para observar los cambios que ocurren y comunica a otros lo que sucedió.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Observa y describe en su lengua materna, animales de su entorno: cómo son, cómo crecen, dónde viven, qué comen, los cuidados que necesitan y otros aspectos que le causan curiosidad. Amplía su conocimiento acerca de las plantas: su proceso de crecimiento, lo que necesitan para vivir, los lugares donde crecen, entre otros. Explica en su lengua materna y con sus palabras, cómo y por qué suceden algunos procesos naturales. Realiza experimentos para poner a prueba sus ideas y supuestos sobre lo que observa en su entorno. Consulta diferentes fuentes de información, digitales o impresas, para ampliar lo que sabe o intuye. Representa de manera gráfica lo que sabe de la naturaleza.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Distingue algunas características del entorno natural: plantas, animales, cuerpos de agua, clima, entre otras. Se apoya en recursos impresos y digitales como fotografías, imágenes o videos para profundizar en sus conocimientos acerca de la diversidad de la naturaleza en su comunidad y otras regiones. Establece con sus pares, formas de organizar a los seres vivos y elementos de la naturaleza para establecer semejanzas y diferencias a la vez que aprecia su diversidad. Observa y experimenta con elementos de la naturaleza, comunica y registra sus hallazgos. Explica con sus palabras y en su lengua materna, procesos, fenómenos naturales y experimentos; los representa con recursos gráficos.",
          },
        ],
      },

      {
        id: "contenido-2",
        nombre:
          "Saberes familiares y comunitarios que resuelven situaciones y necesidades en el hogar y la comunidad.",
        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Identifica saberes familiares que son útiles para la vida, sin poner en riesgo su integridad física y la de las otras personas. Comparte algunos saberes familiares con sus pares y descubre similitudes con los de otras familias. Se familiariza con historias, mitos y leyendas de la tradición oral de la comunidad que explican fenómenos de la naturaleza.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Selecciona saberes familiares y comunitarios útiles, para resolver situaciones diversas, los compara con los de sus pares y cuida su integridad y la de los demás. Reconoce que los saberes familiares se comparten, modifican y enriquecen entre las personas de una comunidad. Explica en su lengua materna y con sus palabras, fenómenos naturales a partir de leyendas e historias de la comunidad, y con ayuda, los contrasta con otras fuentes de consulta.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Propone algunos saberes familiares y comunitarios, para resolver necesidades y situaciones en su hogar, escuela y comunidad. Distingue, con ayuda de otras personas, situaciones en las que los saberes comunitarios son útiles y cuándo deben complementarse y/o contrastarse con otros conocimientos; cuidando su integridad y la de los demás. Indaga en distintas fuentes de consulta, incluyendo medios impresos y digitales, saberes y prácticas de otros lugares para cuidar la naturaleza.",
          },
        ],
      },
      {
        id: "contenido-3",
        nombre:
          "Recursos y juegos del lenguaje que fortalecen la diversidad de formas de expresión oral, y que rescatan la o las lenguas de la comunidad y de otros lugares.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Participa en juegos del lenguaje de la tradición oral de las familias o la comunidad y los expresa con fluidez. Combina recursos de los lenguajes, tales como movimientos corporales, gestos, velocidades, ritmos, entre otros, al decir rimas, poemas, canciones, retahílas, trabalenguas, adivinanzas y otros juegos del lenguaje. Descubre en los juegos del lenguaje, palabras nuevas y se interesa por saber su significado.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Participa en juegos del lenguaje de la tradición oral de la comunidad o de otros lugares, los dice con fluidez, ritmo y claridad. Utiliza distintos recursos de los lenguajes, tales como sonido, ritmo, música, velocidad y movimientos corporales, gestos o señas, para acompañar y modificar adivinanzas, canciones, trabalenguas, retahílas, coplas, entre otros, y con ello crea otras formas de expresión. Interpreta el significado de palabras desconocidas en los juegos del lenguaje, a partir de su contexto.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Propone y organiza con ayuda, juegos del lenguaje para invitar a sus pares a participar. Experimenta con los recursos de los lenguajes para crear, en lo individual y lo colectivo, juegos del lenguaje como adivinanzas, trabalenguas, canciones, rimas, coplas u otros. Combina e inventa nuevas palabras y las integra a su expresión.",
          },
        ],
      },
      {
        id: "contenido-4",
        nombre:
          "Reconocimiento y aprecio de la diversidad lingüística, al identificar las formas en que se comunican las distintas personas de la comunidad.",

        pdas: [
          {
            id: "pda-1",
            grado: "1",
            descripcion:
              "Reconoce que hay personas que se comunican en lenguas distintas a la propia. Identifica los distintos lenguajes que usan las personas a su alrededor.",
          },
          {
            id: "pda-1",
            grado: "2",
            descripcion:
              "Se familiariza con lenguas distintas a la suya que escucha en su comunidad e incorpora a su comunicación, expresiones de origen indígena, extranjero o de las lenguas de señas. Muestra interés por indagar significados de palabras, frases o señas, y las incorpora a su comunicación como una forma de enriquecerla.",
          },
          {
            id: "pda-1",
            grado: "3",
            descripcion:
              "Identifica y utiliza algunas palabras, frases o señas de la diversidad lingüística. Reconoce que algunos objetos se nombran de distinta manera, en diferentes regiones. Identifica que algunos nombres propios son de origen indígena y extranjero. Indaga, en distintas fuentes, el significado de términos o palabras que se utilizan en diferentes contextos o regiones.",
          },
        ],
      },
    ],
  },
];

export default contenidosPDA;
