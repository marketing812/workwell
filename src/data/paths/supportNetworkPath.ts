
import type { Path } from '../pathsData';

export const supportNetworkPath: Path = {
  id: 'confiar-en-mi-red',
  title: 'Confiar en mi Red y Dejarme Sostener',
  description: 'Aprende a detectar apoyos nutritivos, pedir ayuda sin culpa y construir vínculos que te sostengan de verdad.',
  dataAiHint: 'support network friends community',
  audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/INTRORUTA11.mp3',
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
          title: 'Pedir ayuda no es debilidad, es inteligencia emocional',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana1/Pedirayudanoesdebilidadesinteligenciaemocional.mp3',
          content: [
            { type: 'paragraph', text: '<p>Pedir ayuda no te hace frágil, te hace humano. Y saber hacerlo con claridad y equilibrio es una forma avanzada de inteligencia emocional. El ser humano es una especie profundamente social. Nuestro cerebro está literalmente diseñado para la conexión.</p><p> Según la neurociencia social (Lieberman, 2013), las mismas áreas que se activan cuando sentimos dolor físico también se activan cuando nos sentimos rechazados o desconectados.</p><p>En cambio, cuando vivimos relaciones positivas y de apoyo, se encienden circuitos neuronales vinculados al bienestar, la recompensa y la seguridad. </p>' }
          ],
        },
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
          objective: 'Esta técnica te ayudará a visualizar de forma clara tu red de apoyo y reflexionar sobre cómo te relacionas con las personas que forman parte de ella. Comprenderás qué tipo de apoyo te ofrece cada una (emocional, práctico, validación, consejo…) y si estás aprovechando ese recurso. Esto aumenta la conciencia y el uso activo de tu red, algo que según Holt-Lunstad et al. (2015) se asocia con mejor salud mental y física.',
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
            '<p>Tómate unos minutos para responder, sin juzgarte, a estas preguntas. El objetivo no es tener “la respuesta correcta”, sino conocerte mejor y tomar conciencia de tus patrones:</p><ul><li>A lo largo de la semana, ¿qué he descubierto acerca de mis creencias sobre pedir ayuda?</li><li>Mirando la semana en conjunto, qué he descubierto sobre mí mismo/a con relación a cómo me vínculo con los demás y cómo me permito recibir apoyo?</li><li>Esta semana, ¿en qué momento me di cuenta de que podía haber pedido ayuda y no lo hice? ¿Qué me frenó?</li><li>Si hoy pudiera revivir esa situación, ¿qué haría diferente?</li><li>¿Qué emoción suele aparecer cuando pienso en pedir apoyo? (Ej. vergüenza, miedo, alivio, gratitud)</li><li>¿Cómo me imagino que sería mi vida si pedir ayuda fuera algo natural para mí?</li></ul>',
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
        { type: 'quote', text: '“Dejarte sostener no es caer. Es permitir que alguien más camine contigo un tramo.”' },
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
              text: 'Una vez que sabes reconocer un buen apoyo, toca cultivarlo. Esto implica cuidar lo que das y lo que recibes.    La neurociencia afectiva (Porges, 2011) muestra que los vínculos seguros activan nuestro sistema nervioso parasimpático, favoreciendo calma y bienestar.   Para fortalecer estos vínculos:   Cumple tus promesas.   Valida emociones, incluso si no piensas igual.   Respeta ritmos y decisiones.   Busca equilibrio: tan importante es dar como recibir.',
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
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana2tecnica1.mp3',
        },
        {
          type: 'nourishingConversationExercise',
          title: 'EJERCICIO 2: LA CONVERSACIÓN QUE NUTRE',
          objective: 'Aprende a provocar más momentos de conexión real y profunda usando claves sencillas de escucha, empatía y autenticidad.',
          duration: '15-20 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana2tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/REFLEXION.mp3',
          prompts: [
            '<ul><li>¿Qué he descubierto sobre quiénes me suman y quiénes me restan energía?</li><li>¿Qué señales me ayudan a reconocer a una persona que me sostiene de verdad?</li><li>¿Cómo me he sentido al tomar más conciencia de mis vínculos?</li><li>A lo largo de la semana, ¿qué he aprendido sobre mis creencias acerca de quién merece estar en mi red de apoyo?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana2/RESUMEN.mp3',
        },
        {
          type: 'list',
          items: [
            'No toda ayuda es nutritiva: lo importante es que sea genuina, respetuosa y recíproca.',
            'Una red segura no es la más grande, sino la más honesta y estable.',
            'Identificar a tus personas refugio fortalece tu sensación de seguridad y confianza.',
            'Cuidar tus vínculos es también una forma de cuidarte a ti mismo/a.',
          ],
        },
        { type: 'quote', text: '“Hay personas que no te salvan, pero te acompañan mientras tú te reconstruyes. Y eso, a veces, es lo más valioso que puedes recibir.”' },
      ],
    },
    {
      id: 'apoyo_sem3',
      title: 'Semana 3: Aprende a Pedir sin Culpa',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'Pedir no es suplicar ni imponer, es comunicar lo que necesitas de forma sencilla y respetuosa. Esta semana entrenaremos cómo hacerlo: qué decir, cómo decirlo y en qué momento. Descubrirás que cuando pides con claridad, das a la otra persona la oportunidad de decidir libremente.',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/INTRODUCCIONSEMANA3.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Pedir ayuda no es “molestar”',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/Pedirayudanoesmolestar.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Seguro que alguna vez has pensado: “Si pido esto, voy a molestar” o “van a pensar que soy una carga”. No estás solo o sola: muchas personas sienten lo mismo.   La realidad es que pedir ayuda es algo profundamente humano. Desde que nacemos, dependemos de otros para sobrevivir, y nuestro cerebro está diseñado para buscar conexión y apoyo (como explica el investigador Matthew Lieberman, especialista en neurociencia social).    Cuando pedimos, no estamos robando tiempo ni energía: estamos invitando a otra persona a formar parte de nuestra historia.   Piensa en cómo te sientes cuando alguien que quieres te pide ayuda y puedes hacerlo. ¿Verdad que te gusta poder estar ahí? Pues al revés también funciona igual.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Necesidad legítima ≠ deuda emocional',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/Necesidadlegitimadeudaemocional.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Aquí va una idea que puede liberarte mucho: necesitar algo no significa que tengas que devolverlo multiplicado por diez.   A veces, esta creencia viene de la infancia (“si te ayudan, tienes que compensar”) o de vivir en entornos donde pedir estaba mal visto. Pero pedir ayuda no es como pedir un préstamo: es compartir una necesidad para que otro u otra pueda decidir si quiere y puede apoyarte.   Imagina que tu amiga necesita que la lleves al médico. La ayudas, y no esperas que te devuelva la gasolina o que se ofrezca a llevarte a ti tres veces más. Lo hiciste porque pudiste y quisiste. Esa es la misma lógica que puedes aplicar cuando tú pides algo.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Cuanto más claro, más fácil decir “sí”',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/Cuantomasclaromasfacildecirsi.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Cuando pedimos algo de forma vaga, dejamos a la otra persona en un limbo: no sabe si puede, no sabe cómo ayudarte y eso genera incomodidad.   Ser claro o clara no es exigir, es facilitar la decisión.   Ejemplo: En vez de decir “necesitaría algo de ayuda con la mudanza”, prueba con “¿podrías venir el sábado de 10 a 12 para ayudarme a cargar cajas?”.    Así la persona sabe exactamente lo que pides y puede decirte “sí” o “no” con tranquilidad.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'El mito de “puedo con todo”',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/Elmitodepuedocontodo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Vivimos en un mundo que aplaude la autosuficiencia. “Ser fuerte” muchas veces se traduce en “no necesito a nadie”. Pero llevar eso al extremo nos puede dejar agotados y aislados.   Los estudios sobre resiliencia (Southwick y Charney, 2018) muestran que quienes aceptan apoyo se recuperan antes de momentos difíciles. No es debilidad: es inteligencia emocional.   Recibir ayuda no te quita valor, te conecta con lo que eres: una persona capaz… y también parte de una red de cuidado.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Recibir sin culpa, dar valor a lo que llega',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/Recibirsinculpadarvaloraloquellega.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'El último paso es aceptar lo que te dan sin sentir que tienes que justificarte o disculparte.    La culpa suele venir de pensamientos como “no me lo merezco” o “me verán como débil”.   Pero cada vez que recibes algo con gratitud, estás enviando un mensaje muy poderoso: “Esto que me das importa y lo aprecio”. Y eso fortalece la relación, igual que cuando eres tú quien da.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'clearRequestMapExercise',
          title: 'EJERCICIO 1: EL MAPA DE PETICIONES CLARAS',
          objective: 'Aprende a formular peticiones tan claras que la otra persona sabrá exactamente qué hacer para apoyarte.',
          duration: '10-15 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana3tecnica1.mp3',
        },
        {
          type: 'supportBankExercise',
          title: 'EJERCICIO 2: EL BANCO DE APOYOS',
          objective: 'Crea tu propio mapa de apoyos para saber a quién pedir ayuda según el momento y la necesidad.',
          duration: '15-20 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana3tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/REFLEXION.mp3',
          prompts: [
            '<p>Tómate unos minutos para responder, sin juzgarte, a estas preguntas. El objetivo no es tener “la respuesta correcta”, sino conocerte mejor y tomar conciencia de tus patrones:</p><ul><li>A lo largo de la semana, ¿qué he descubierto acerca de mis creencias sobre pedir ayuda?</li><li>Mirando la semana en conjunto, qué he descubierto sobre mí mismo/a con relación a cómo me vínculo con los demás y cómo me permito recibir apoyo?</li><li>Esta semana, ¿en qué momento me di cuenta de que podía haber pedido ayuda y no lo hice? ¿Qué me frenó?</li><li>Si hoy pudiera revivir esa situación, ¿qué haría diferente?</li><li>¿Qué emoción suele aparecer cuando pienso en pedir apoyo? (Ej. vergüenza, miedo, alivio, gratitud)</li><li>¿Cómo me imagino que sería mi vida si pedir ayuda fuera algo natural para mí?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana3/RESUMEN.mp3',
        },
        {
          type: 'list',
          items: [
            'Pedir ayuda no es debilidad, es un acto de conexión humana.',
            'Entrenar en lo pequeño nos prepara para lo grande.',
            'Las creencias sobre “molestar” o “ser una carga” pueden transformarse con experiencias positivas.',
            'Observar nuestra reacción es parte del aprendizaje.',
          ],
        },
        { type: 'quote', text: '“Cuando pides ayuda, no pierdes independencia: ganas apoyo y conexión.”' },
      ],
    },
    {
      id: 'apoyo_sem4',
      title: 'Semana 4: Construye tu Red con Conciencia y Cuidado Mutuo',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'Las redes de apoyo no se improvisan: se cultivan con gestos pequeños y constantes. Esta semana trabajaremos cómo fortalecer vínculos desde la conciencia, el respeto y la reciprocidad. Diseñarás tu propio “círculo de sostén” y un plan simple para mantenerlo vivo.',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/INTRODUCCIONSEMANA4.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Las relaciones se entrenan',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Lasrelacionesseentrenan.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Igual que un músculo no se fortalece con una sola sesión en el gimnasio, una relación no crece de un día para otro. Requiere presencia, pequeños gestos constantes y la intención de cuidarla.   Esta semana vamos a trabajar la idea de que tu red de apoyo emocional no es algo que simplemente “tienes” o “no tienes”, sino algo que puedes construir, cultivar y fortalecer como parte de tu autocuidado.   Verás cómo cada conversación, cada límite sano y cada acto de reciprocidad son “nutrientes” para tus vínculos.   Ejemplo: pensar que una amistad de años se mantendrá fuerte sin contacto es como esperar que una planta viva meses sin agua.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Estar para otros sin perderte',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Estarparaotrossinperderte.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Acompañar a alguien no significa desdibujarte ni dejar de atenderte. Es estar presente, escuchar y ofrecer apoyo… pero sin abandonar tus propios espacios, descanso o necesidades.   Si siempre estás disponible para todo el mundo, pero nunca para ti, tu energía se vacía. Y cuando eso pasa, el cuidado deja de ser genuino y se convierte en obligación o agotamiento.   Carl Rogers, uno de los grandes referentes de la psicología humanista, recordaba que “solo puedo ayudar desde la autenticidad”. Esa autenticidad nace de cuidarte primero para luego poder cuidar.   Ejemplo: puedes escuchar a tu amiga después de un mal día, pero si esa conversación interfiere con tu descanso cada noche, es momento de poner límites amables y claros.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Fitness relacional: entrenar los vínculos',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Fitnessrelacionalentrenarlosvinculos.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Piensa en tus relaciones como si fueran tu salud física. Para fortalecer los músculos, no basta con saber que existen: hay que entrenarlos. Lo mismo pasa con los vínculos.   El fitness relacional consiste en practicar habilidades que mantienen viva la conexión: la escucha activa, la empatía, la comunicación honesta y el tiempo compartido de calidad.   Cada vez que te interesas genuinamente por alguien, que expresas gratitud o que compartes un momento de verdad, estás haciendo una “repetición” que fortalece esa relación. Y si dejas de entrenar, poco a poco ese vínculo se debilita.   Ejemplo: un mensaje que diga “Hoy me acordé de ti, ¿cómo estás?” puede ser más valioso que un regalo caro. Es una repetición simple, pero efectiva.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Reciprocidad y cuidado mutuo',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Reciprocidadycuidadomutuo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Dar y recibir son las dos caras de la misma moneda en las relaciones sanas. Si siempre das más de lo que recibes o si solo recibes sin aportar, el equilibrio se rompe y la conexión se resiente.   La investigación de Holt-Lunstad et al. (2010) muestra que las personas que sienten reciprocidad en su red de apoyo tienen menos estrés, mejor salud física y viven más años.   El cuidado mutuo no significa que las aportaciones sean siempre idénticas, sino que exista la sensación de que ambos lados están presentes y comprometidos.   Ejemplo: si hoy tú ayudas a tu hermano a mudarse, y mañana él te acompaña a una cita médica, aunque las acciones sean diferentes, ambas sostienen el vínculo.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Tu red como autocuidado emocional',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Turedcomoautocuidadoemocional.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Cuidar de tus relaciones no es un extra opcional: es parte de tu salud emocional.   Las personas con vínculos positivos tienen menos ansiedad, menos depresión y más capacidad de recuperación después de momentos difíciles.   La clave no es la cantidad, sino la calidad: rodearte de personas que te acepten tal como eres, que te respeten y que también se atrevan a decirte verdades incómodas cuando lo necesites.   Invertir tiempo y energía en tu red de apoyo es una forma de cuidarte tanto como hacer ejercicio o comer bien.   Ejemplo: una sola amistad que te escuche de verdad puede marcar la diferencia en un momento de crisis, más que diez conocidos que solo aparecen en tus buenos momentos.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Construir con conciencia',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/Construirconconciencia.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'No todas las relaciones merecen la misma dedicación.    Construir con conciencia es decidir en qué vínculos vas a invertir tu energía, y cuáles requieren límites claros.   Pregúntate:   ¿Qué relaciones me aportan calma, inspiración o alegría?   ¿Cuáles me generan tensión, cansancio o me alejan de mis valores?   Esto no es egoísmo: es respeto por ti mismo/a y por tu salud emocional. Igual que cuidas tu alimentación para nutrir tu cuerpo, selecciona las relaciones que nutren tu mente y tu corazón.   Recuerda: a veces, cuidar un vínculo también es saber soltarlo.   Ejemplo: si notas que tras cada encuentro con alguien te sientes drenado/a o cuestionado/a, es una señal para reflexionar sobre la energía que pones en esa relación.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'mutualCareCommitmentExercise',
          title: 'EJERCICIO 1: MI COMPROMISO CON EL CUIDADO MUTUO',
          objective: 'Elige tres acciones concretas para fortalecer las relaciones que te nutren. Son pequeños actos que, repetidos en el tiempo, construyen confianza y conexión.',
          duration: '8-10 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana4tecnica1.mp3',
        },
        {
          type: 'symbolicSupportCircleExercise',
          title: 'EJERCICIO 2: CÍRCULO DE SOSTÉN SIMBÓLICO',
          objective: 'Crea un símbolo que represente tu red de apoyo, para que puedas acudir a él cuando necesites fuerza o calma.',
          duration: '10-12 min',
          audioUrl: 'https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana4tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/REFLEXION.mp3',
          prompts: [
            '<p>Esta semana hemos puesto el foco en algo que a veces damos por sentado: las relaciones que nos sostienen. Cuidar un vínculo no es un acto aislado, es una decisión repetida que requiere atención, autenticidad y reciprocidad. Ahora es momento de parar un instante y mirar lo que has descubierto sobre tu forma de construir, cuidar y nutrir tu red de apoyo.</p><ul><li>¿Qué descubrí esta semana sobre la manera en que cuido mis relaciones?</li><li>¿En qué momentos sentí que estaba presente de verdad para otra persona?</li><li>¿Qué gestos de cuidado recibí que me hicieron sentir bien?</li><li>¿Hay algún vínculo que necesite reforzar… o quizás dejar en pausa para cuidarme mejor?</li><li>¿Qué he aprendido sobre el equilibrio entre dar y recibir?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/semana4/RESUMEN.mp3',
        },
        {
          type: 'list',
          items: [
            'Las relaciones que nos cuidan no son casualidad: se construyen y se alimentan con gestos conscientes.',
            'Estar para otros no implica perderte: el autocuidado es la base del cuidado mutuo.',
            'El “fitness relacional” se entrena con actos de presencia, escucha y apoyo repetidos en el tiempo.',
            'La reciprocidad es el pegamento de las relaciones sanas.',
            'Elegir conscientemente dónde invertir energía fortalece tu red y tu bienestar emocional.',
          ],
        },
        {
          type: 'quote',
          text: '“Las relaciones que te nutren se eligen, se cuidan y se agradecen. Son el puente que une tu fuerza con la fuerza de los demás.”',
        },
      ],
    },
    {
      id: 'apoyo_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión final de la ruta',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/REFLEXIONRUTA.mp3',
          prompts: [
            'Has llegado al final de esta ruta. Durante estas semanas te has detenido a observar tu red de apoyo con más claridad, descubriendo qué vínculos te fortalecen y cuáles quizás te restan energía.',
            'No es un camino fácil, porque mirar de cerca nuestras relaciones también toca fibras sensibles. Aun así, cada paso que has dado te ha acercado a una vida más consciente, sostenida y enraizada en lo que de verdad importa.',
            'Hoy te invito a hacer una pausa, respirar hondo y mirar atrás con gratitud: ¿qué aprendizajes quieres llevar contigo y cómo vas a ponerlos en práctica? Esta es tu oportunidad para darle forma a tus descubrimientos y comprometerte con lo que deseas cuidar a partir de ahora.',
            'Pregúntate:',
            '¿Eras consciente de la importancia de tu red de apoyo?',
            '¿Qué has descubierto sobre las personas que realmente te sostienen y nutren tu vida?',
            '¿Qué cambios has notado en ti cuando priorizas vínculos que te dan calma, respeto y energía?',
            '¿De qué manera te relacionas ahora con esos apoyos que antes no reconocías o que dabas por sentado?',
            '¿Qué compromisos quieres asumir para cuidar mejor tu red y también para ser tú un apoyo nutritivo para quienes quieres?',
          ],
        },
        {
          type: 'title',
          text: 'RESUMEN CLAVE DE LA RUTA',
          audioUrl: 'https://workwellfut.com/audios/ruta11/descripciones/RESUMENRUTA.mp3'
        },
        {
          type: 'list',
          items: [
            'Las relaciones influyen directamente en nuestro bienestar emocional y físico: un buen apoyo calma, uno tóxico desgasta.',
            'No toda ayuda es nutritiva: el verdadero acompañamiento respeta, valida y fomenta autonomía.',
            'Aprendimos a distinguir entre dependencia, exigencia y acompañamiento genuino.',
            'Reconocer señales de un vínculo sano: coherencia, empatía, respeto, equilibrio entre dar y recibir.',
            'La neurociencia confirma que los vínculos seguros activan nuestro sistema de calma y resiliencia.',
            'Cuidar la red de apoyo implica tanto elegir bien lo que recibimos como ser un apoyo nutritivo para los demás.',
            'Mapear la red y priorizar vínculos nutritivos fortalece la capacidad de afrontar la vida con más seguridad y confianza.',
          ]
        },
        { type: 'quote', text: 'Una red de apoyo no se mide por la cantidad de personas, sino por la calidad de los vínculos que te sostienen y te hacen crecer.' }
      ]
    }
  ]
};

