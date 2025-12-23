
import type { Path } from '../pathsData';

export const supportNetworkPath: Path = {
  id: 'confiar-en-mi-red',
  title: 'Confiar en mi Red y Dejarme Sostener',
  description: 'Aprende a detectar apoyos nutritivos, pedir ayuda sin culpa y construir vínculos que te sostengan de verdad.',
  dataAiHint: 'support network friends community',
  modules: [
    {
      id: 'apoyo_sem1',
      title: 'Semana 1: ¿Cómo vivo el Pedir Ayuda?',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Cuántas veces has pensado “mejor no digo nada, no quiero molestar”? Esta semana vamos a romper con esa idea. Pedir ayuda no te resta valor, te humaniza. Descubrirás por qué a veces nos cuesta tanto pedir y cómo esos miedos nacen de creencias aprendidas (como “si pido, soy una carga”). Juntos/as vamos a darle la vuelta: aprenderás a ver el apoyo como un recurso legítimo y valioso.',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/INTRODUCCIONSEMANA1.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El mito de “Yo puedo siempre con todo”',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/ElmitodeYopuedosiemprecontodo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Desde pequeños, a veces escuchamos frases como “tienes que ser fuerte” o “no dependas de nadie”. Esto puede sonar motivador… pero llevado al extremo, nos empuja a creer que, si necesito algo de los demás, soy débil. En psicología, este pensamiento se llama creencia disfuncional, porque distorsiona la realidad. La independencia no significa hacerlo todo solo o sola. Igual que un músculo crece mejor con descanso y nutrición, las personas crecemos mejor cuando tenemos apoyo. Imagina que llevas una mochila muy pesada. Puedes cargarla tú solo durante un rato, pero si alguien te ayuda a sostenerla en un tramo, eso no te hace menos fuerte: te permite llegar más lejos. La autosuficiencia absoluta es un mito. La verdadera fortaleza está en saber cuándo avanzar por ti mismo/a y cuándo es momento de dejarte ayudar.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: '“Mejor no molestar” o el miedo a ser una carga',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/Mejornomolestar.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Muchas personas piensan que, si piden algo, están incomodando o restando valor a la relación; como si con la petición estuvieras cargando a la otra persona, incomodándola o generando un “desequilibrio” que empeore la relación. Este miedo suele nacer de experiencias pasadas donde mostrar necesidad tuvo un coste (críticas, rechazo, indiferencia). En TCC, identificamos aquí un patrón de inhibición asertiva: evitar expresar lo que necesitamos para “mantener la paz y que todo siga bien”, aunque eso nos deje con malestar interno. A largo plazo, esta estrategia crea más distancia con los demás. Es como si tuvieras sed y estuvieras en una casa llena de vasos, pero no pides agua por miedo a molestar. Terminas con sed… y los demás ni siquiera saben que necesitas algo. No molestar no siempre es cuidar la relación; a veces es limitar su profundidad.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: '“Ya me las apañaré” o la evitación de la vulnerabilidad',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/Yamelasapanare.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Otro mito común es pensar que “si dependo de alguien, pierdo libertad”. Esto lleva a rechazar ayuda incluso cuando sería beneficiosa. La investigación muestra que negar sistemáticamente el apoyo social incrementa el riesgo de soledad no deseada, que según Holt-Lunstad et al. (2015) tiene un impacto sobre la salud física comparable al tabaquismo o la obesidad. Además, el cerebro social —como explican Lieberman (2013) y Eisenberger (2012)— está diseñado para beneficiarse de la cooperación: cuando nos conectamos con otros, activamos redes neuronales que reducen la percepción de amenaza y favorecen la resiliencia. Es como negarte a usar un mapa porque “quieres orientarte tú solo/a”. Puede que lo logres… pero te costará más tiempo, energía y quizá termines perdido/a. Aceptar ayuda no significa perder tu autonomía, sino optimizar tus recursos para llegar más lejos y más sereno/a.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Apoyo social percibido vs. apoyo real',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/Apoyosocial.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'A veces, el problema no es que no haya apoyo, sino que no lo percibimos como accesible o de calidad. La ciencia muestra que la calidad del apoyo social es más importante que la cantidad (Cohen & Wills, 1985). Una red de personas pequeña pero nutritiva, es más valiosa que un gran número de contactos superficiales.    Según Waldinger y Marc Schulz, la calidad de nuestras relaciones sociales predice mejor nuestra salud y longevidad que el colesterol o la genética. Las conexiones humanas profundas actúan como un “escudo” contra el estrés y mejoran la salud física y mental.   Tener una red de apoyo sólida y positiva se asocia con:   Menor riesgo de ansiedad y depresión.   Mayor resiliencia ante crisis vitales.   Mejor recuperación física tras una enfermedad o cirugía.   Mayor esperanza de vida (Holt-Lunstad et al., 2015).   Por el contrario, la falta de apoyo o las relaciones de baja calidad pueden:   Aumentar la vulnerabilidad al estrés y a la enfermedad.   Favorecer sentimientos de soledad y aislamiento (Cacioppo & Patrick, 2008).   Incrementar la probabilidad de hábitos poco saludables como mala alimentación o sedentarismo.   Es como tener muchos números en la agenda… pero solo unos pocos responden cuando llamas en medio de la noche.   Esta semana aprenderás a reconocer y valorar a quienes están realmente presentes y disponibles para ti.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'El miedo a depender, decepcionar o ser una carga',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/Elmiedo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Estos miedos están profundamente ligados a nuestra historia personal y a cómo aprendimos a vincularnos. Vincularnos significa cómo nos relacionamos y conectamos emocionalmente con otras personas: cómo buscamos afecto, cómo damos apoyo, cómo pedimos ayuda y cómo manejamos la cercanía o la distancia en una relación.    Muchas veces, estos miedos (depender, decepcionar o ser una carga), se forman en la infancia, cuando percibimos (o vivimos) que mostrar necesidad podía implicar rechazo, desaprobación o pérdida de afecto.   En terapia, trabajamos estos miedos como esquemas emocionales que tiñen nuestra interpretación de la realidad:   “Si dependo, perderé mi autonomía o seré abandonado/a.”   “Si muestro mis dificultades, decepcionaré y me rechazarán.”   “Si acepto ayuda, confirmaré que soy débil o incapaz.”   La neurociencia afectiva (Porges, 2011) explica que la conexión segura con otras personas activa nuestro sistema nervioso parasimpático, ayudándonos a reducir la activación por la sensación de amenaza y permitiéndonos sentir calma. Esto significa que aceptar apoyo no solo es una decisión psicológica, sino también una respuesta biológica que favorece la regulación emocional.   Piensa en un puente colgante: si crees que no aguantará tu peso, nunca te atreverás a cruzarlo… aunque esté diseñado para sostener a muchas personas. Dar un paso sobre ese puente —aceptar ayuda— es arriesgarse a descubrir que, lejos de hundirse, la relación se fortalece.   Confiar en otros empieza por darles la oportunidad de demostrar que pueden sostenerte, y por permitirte a ti mismo/a experimentar que recibir no te resta valor: te conecta. RECUERDA no romper nada',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'supportMapExercise',
          title: 'EJERCICIO1: MAPA DE RELACIONES Y APOYO',
          objective: 'Visualiza de forma clara tu red de apoyo y reflexiona sobre cómo te relacionas con las personas que la forman.',
          duration: '10-15 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana1tecnica1.mp3',
        },
        {
          type: 'blockingThoughtsExercise',
          title: 'EJERCICIO 2: REGISTRO DE PENSAMIENTOS BLOQUEANTES AL PEDIR AYUDA',
          objective: 'Aprende a detectar y reformular los pensamientos que te frenan al pedir ayuda.',
          duration: '8-12 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana1tecnica1.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/REFLEXION.mp3',
          prompts: [
            'Tómate unos minutos para responder, sin juzgarte, a estas preguntas. El objetivo no es tener “la respuesta correcta”, sino conocerte mejor y tomar conciencia de tus patrones:',
            'A lo largo de la semana, ¿qué he descubierto acerca de mis creencias sobre pedir ayuda? […]',
            'Mirando la semana en conjunto, qué he descubierto sobre mí mismo/a con relación a cómo me vínculo con los demás y cómo me permito recibir apoyo? […]',
            '¿Qué emoción suele aparecer cuando pienso en pedir apoyo? (Ej. vergüenza, miedo, alivio, gratitud) […]',
            'Esta semana, ¿en qué momento me di cuenta de que podía haber pedido ayuda y no lo hice? ¿Qué me frenó? […]',
            'Si hoy pudiera revivir esa situación, ¿qué haría diferente? […]',
            '¿Cómo me imagino que sería mi vida si pedir ayuda fuera algo natural para mí? […]',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/RESUMEN.mp3',
        },
        {
          type: 'list',
          items: [
            'Pedir ayuda no es debilidad, es una habilidad social y emocional que fortalece vínculos y mejora el bienestar.',
            'El ser humano está diseñado para la conexión: el apoyo social de calidad reduce estrés, mejora la salud física y aumenta la resiliencia.',
            'Las creencias y miedos que bloquean la petición de ayuda pueden identificarse y reformularse con práctica y consciencia.',
            'Calidad es mejor que cantidad: una red pequeña y nutritiva es más valiosa que muchos contactos superficiales.',
            'Aceptar apoyo no resta autonomía: la optimiza y nos permite avanzar con más recursos y energía.',
          ],
        },
        {
          type: 'quote',
          text: '“Dejarte sostener no es caer. Es permitir que alguien más camine contigo un tramo.”',
        },
      ],
    },
    {
      id: 'apoyo_sem2',
      title: 'Semana 2: Identifica Apoyos Reales y Nutritivos',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'No todas las personas que “ayudan” lo hacen de forma que te fortalece. Esta semana aprenderás a reconocer esas diferencias y a identificar tus relaciones nutritivas. Piensa en ello como elegir alimentos: algunos te nutren, otros solo te llenan… o incluso te hacen daño.',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/INTRODUCCIONSEMANA2.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'La diferencia entre sentirte ligero/a o drenado/a',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Ladiferenciaentresentirteligeroodrenado.mp3',
          content: [
            {
              type: 'paragraph',
              text: '¿Has notado que, con ciertas personas, basta una conversación para sentirte más ligero/a, con las ideas más claras… mientras que con otras parece que te quedas sin energía, como si te hubieran drenado la batería interna?   No es casualidad. Nuestro cerebro está programado para responder de manera distinta según la calidad de la interacción. Según la neurociencia social (Eisenberger & Cole, 2012), las relaciones de apoyo sincero activan en el cerebro zonas que generan calma y seguridad, mientras que los vínculos conflictivos o invasivos pueden activar los mismos circuitos que responden al dolor físico.   Esta semana vamos a descubrir cómo reconocer esos apoyos que son como un buen té caliente en un día de frío… y cómo evitar quedarnos enganchados a relaciones que, aunque se presenten como “ayuda”, en realidad nos desgastan.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'No toda ayuda es nutritiva',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Notodaayudaesnutritiva.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Antes de avanzar, quiero contarte algo importante: no toda ayuda es nutritiva.   A veces, alguien puede estar muy presente, pero de una forma que nos resta fuerza en vez de dárnosla.   La ayuda nutritiva es como un buen entrenador: te acompaña, te anima y te respeta, pero sabe que el partido lo juegas tú.   En cambio, la ayuda que no nutre puede parecer útil al principio, pero luego te deja más dependiente, inseguro/a o incluso confundido/a.   Piensa en el agua: limpia y fresca, te hidrata y te revitaliza. Turbia, puede calmarte un momento… pero dañarte después.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Tres caras del apoyo: dependencia, exigencia y acompañamiento',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Trescarasdelapoyodependenciaexigenciayacompanamiento.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Vamos a ponerle nombre a tres formas comunes de “apoyo”:   Dependencia patológica – Cuando una persona cree que sin el otro no puede afrontar nada. Se instala un miedo constante al abandono y la autonomía queda bloqueada. En TCC se ve como un patrón que refuerza inseguridad y baja autoestima.   Exigencia – Se basa en “deberías” y “tienes que”, a veces con chantaje emocional incluido. Esto no es apoyo: es control con otro nombre.   Acompañamiento genuino – El que todos merecemos: respeta, escucha, valida, y a la vez te impulsa a crecer. Como decía Bowlby (1988), un vínculo seguro es esa base estable desde la que nos atrevemos a explorar.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Señales de un vínculo nutritivo',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Senalesdeunvinculonutritivo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Ahora que ya tienes claro qué tipos de apoyo existen, pasemos a las señales que te ayudarán a reconocer si un vínculo es sano y nutritivo:   Puedes mostrarte como eres, sin miedo a ser juzgado/a.   Hay empatía y validación emocional.   Se comparte información personal e íntima.   Hay muestras de cariño y calidez.   Hay coherencia entre lo que la persona dice y lo que hace.   El apoyo fluye en ambas direcciones: a veces das, a veces recibes.   Respetan tus decisiones, incluso cuando no coinciden con ellas.   Pista rápida: si después de estar con alguien te sientes en calma y con ideas claras, probablemente sea un vínculo nutritivo. Si sales con tensión o dudas, quizá toque poner límites.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'El acompañamiento genuino: un faro en la oscuridad',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Elacompanamientogenuinounfaroenlaoscuridad.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'El acompañamiento genuino combina presencia, respeto y fomento de tu autonomía.   Se parece a tener un faro en medio de una noche oscura: no camina por ti, pero ilumina el camino para que tú avances.   Incluye:   Escuchar sin prisas, sin interrumpir y sin hacer de tu historia la suya.   Validar lo que sientes, aunque no esté de acuerdo.   Decirte la verdad con respeto, no con dureza.   Apoyarte sin sobreprotegerte.   Mantener límites claros que cuiden la relación.   Según Feeney y Collins (2015), este tipo de apoyo aumenta la resiliencia y ayuda a que las personas afronten mejor los retos.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Cómo cultivar apoyos seguros',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Comocultivarapoyosseguros.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Una vez que sabes reconocer un buen apoyo, toca cultivarlo. Esto implica cuidar lo que das y lo que recibes.    La neurociencia afectiva (Porges, 2011) muestra que los vínculos seguros activan el sistema nervioso parasimpático, favoreciendo calma y bienestar.   Para fortalecer estos vínculos:   Cumple tus promesas.   Valida emociones, incluso si no piensas igual.   Respeta ritmos y decisiones.   Busca equilibrio: tan importante es dar como recibir.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Mapa de tu red de apoyo',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/Mapadetureddeapoyo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Identificar quién te nutre no significa cortar con todo lo demás, sino dar prioridad a lo que te fortalece y protegerte de lo que te drena.   En las siguientes pantallas trabajaremos con dos ejercicios prácticos para que mapees tu red de apoyo y descubras quiénes son tus verdaderas personas refugio.  Te sorprenderá ver que, al ponerlo por escrito, la imagen de tu red social cambia… y mucho.  RECUERDA no romper nada',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'nutritiveDrainingSupportMapExercise',
          title: 'EJERCICIO 1: MAPA DE APOYOS NUTRITIVOS Y DRENANTES',
          objective: 'Dibuja un mapa claro de quiénes en tu vida te suman y quiénes te restan, para que puedas cuidar mejor tu energía emocional.',
          duration: '10-15 min',
        },
        {
          type: 'nourishingConversationExercise',
          title: 'EJERCICIO 2: LA CONVERSACIÓN QUE NUTRE',
          objective: 'Aprende a provocar más momentos de conexión real y profunda usando claves sencillas de escucha, empatía y autenticidad.',
          duration: '15-20 min',
        },
      ],
    },
    {
      id: 'apoyo_sem3',
      title: 'Semana 3: Aprende a Pedir sin Culpa',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraph',
          text: 'Pedir no es suplicar ni imponer, es comunicar lo que necesitas de forma sencilla y respetuosa. Esta semana entrenaremos cómo hacerlo: qué decir, cómo decirlo y en qué momento. Descubrirás que cuando pides con claridad, das a la otra persona la oportunidad de decidir libremente.',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Necesidad legítima ≠ deuda emocional',
          content: [
            {
              type: 'paragraph',
              text: 'Necesitar algo no significa que tengas que devolverlo multiplicado por diez. Pedir ayuda no es como pedir un préstamo: es compartir una necesidad para que otro pueda decidir si quiere y puede apoyarte.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'El mito de “puedo con todo”',
          content: [
            {
              type: 'paragraph',
              text: 'Vivir bajo la idea de la autosuficiencia total puede dejarte agotado y aislado. Recibir ayuda no te quita valor, te conecta con lo que eres: una persona capaz… y también parte de una red de cuidado.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'clearRequestMapExercise',
          title: 'EJERCICIO 1: EL MAPA DE PETICIONES CLARAS',
          objective: 'Aprende a formular peticiones tan claras que la otra persona sabrá exactamente qué hacer para apoyarte.',
          duration: '10-15 min',
        },
        {
          type: 'supportBankExercise',
          title: 'EJERCICIO 2: EL BANCO DE APOYOS',
          objective: 'Crea tu propio mapa de apoyos para saber a quién pedir ayuda según el momento y la necesidad.',
          duration: '15-20 min',
        },
      ],
    },
    {
      id: 'apoyo_sem4',
      title: 'Semana 4: Construye tu Red con Conciencia y Cuidado Mutuo',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraph',
          text: 'Las redes de apoyo no se improvisan: se cultivan con gestos pequeños y constantes. Esta semana trabajaremos cómo fortalecer vínculos desde la conciencia, el respeto y la reciprocidad. Diseñarás tu propio “círculo de sostén” y un plan simple para mantenerlo vivo.',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Estar para otros sin perderte',
          content: [
            {
              type: 'paragraph',
              text: 'Acompañar a alguien no significa desdibujarte. Si siempre estás disponible para todos, pero nunca para ti, tu energía se vacía. El cuidado genuino nace de cuidarte primero.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Reciprocidad y cuidado mutuo',
          content: [
            {
              type: 'paragraph',
              text: 'Dar y recibir son las dos caras de la misma moneda en las relaciones sanas. El equilibrio no significa que las aportaciones sean idénticas, sino que exista la sensación de que ambos están presentes y comprometidos.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'mutualCareCommitmentExercise',
          title: 'EJERCICIO 1: MI COMPROMISO CON EL CUIDADO MUTUO',
          objective: 'Elige tres acciones concretas para fortalecer las relaciones que te nutren. Son pequeños actos que, repetidos en el tiempo, construyen confianza y conexión.',
          duration: '8-10 min',
        },
        {
          type: 'symbolicSupportCircleExercise',
          title: 'EJERCICIO 2: CÍRCULO DE SOSTÉN SIMBÓLICO',
          objective: 'Crea un símbolo que represente tu red de apoyo, para que puedas acudir a él cuando necesites fuerza o calma.',
          duration: '10-12 min',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Ruta',
          prompts: [
            '¿Qué he descubierto sobre quiénes me sostienen?',
            '¿Cómo ha cambiado mi forma de pedir y recibir apoyo?',
            '¿Qué compromisos quiero mantener para cuidar mi red?',
          ],
        },
        {
          type: 'quote',
          text: 'Una red de apoyo no se mide por la cantidad de personas, sino por la calidad de los vínculos que te sostienen y te hacen crecer.',
        },
      ],
    },
  ],
};
