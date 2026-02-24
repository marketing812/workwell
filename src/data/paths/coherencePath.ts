import type { Path } from  '@/data/paths/pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const coherencePath: Path = {
  id: 'vivir-con-coherencia',
  title: 'Vivir con Coherencia Personal',
  description: 'Aprende a alinear tus pensamientos, emociones y acciones con lo que realmente valoras, sin perder flexibilidad ni adaptabilidad.',
  dataAiHint: 'coherence integrity values',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/INTRODUCCIONRUTA.mp3`,
  modules: [
    {
      id: 'coherencia_sem1',
      title: 'Semana 1: ¿Qué significa ser Coherente para Mí?',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te ha pasado alguna vez que dices que sí cuando por dentro gritas un no?\\n¿O que te encuentras actuando como se espera de ti, aunque eso te aleje de lo que de verdad sientes o piensas?\\nEsta semana vamos a comenzar un camino importante: reconectar contigo y aprender a vivir con coherencia personal. No desde la exigencia, sino desde el cuidado. No desde el juicio, sino desde la honestidad. No se trata de hacerlo perfecto, sino de escucharte mejor.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/INTRODUCCIONSEMANA1.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Qué es la coherencia personal?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/Queeslacoherenciapersonal.mp3`,
          content: [
            { type: 'paragraph', text: 'La coherencia personal ocurre cuando lo que piensas, sientes y haces están en la misma dirección.\\nEs cuando tus acciones reflejan tus valores, tus emociones no son silenciadas, y tus pensamientos no se contradicen con lo que haces cada día.\\nPero atención: no se trata de estar siempre en equilibrio ni de acertar todo el tiempo. Ser coherente es un acto de atención diaria.\\nEs preguntarte: “¿Esto que estoy haciendo me representa? ¿Estoy en paz con esta decisión?”' },
            { type: 'paragraph', text: 'Ejemplo realista: Imagina que valoras profundamente el descanso, pero aceptas reuniones fuera de tu horario por no quedar mal. Aunque lo hagas con la mejor intención, eso genera un pequeño conflicto interno. Al final del día, puedes sentirte agotado/a, irritado/a o confundido/a sin saber muy bien por qué.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Autenticidad, integridad y perfección: diferencias clave',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/Autenticidadintegridadyperfeccion.mp3`,
          content: [
            { type: 'paragraph', text: 'Muchas veces se confunden estos conceptos, pero es fundamental diferenciarlos para que puedas avanzar sin enredos ni autoexigencias.' },
            { type: 'list', items: ['Autenticidad: Mostrarte tal y como eres, sin disfraces emocionales. Es permitirte decir: “Esto es lo que siento”, aunque no sea cómodo.','Integridad: Actuar desde tus principios, incluso cuando nadie te ve. Es elegir lo que te parece justo o correcto, aunque no sea lo más fácil.','Perfección: Es la trampa que nos hace creer que para ser coherentes tenemos que hacerlo todo bien. Y no. La coherencia real se construye con errores, ajustes y valentía.']},
            { type: 'paragraph', text: 'Ejemplo: Si ayudas a alguien a pesar de que no tienes energía, porque “deberías” hacerlo, quizá estés actuando desde el perfeccionismo, no desde tu integridad. Ser coherente aquí sería permitirte decir: “Hoy no puedo, pero te acompaño de otra forma”.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'La incoherencia no es un fallo: es una señal',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/Laincoherencianoesunfalloesunasenal.mp3`,
          content: [{ type: 'paragraph', text: 'La incoherencia interna no te convierte en una mala persona. Tampoco significa que seas débil o inconstante. Significa que hay un choque entre partes de ti que necesitan diálogo.\\nA veces actuamos en contra de nuestros valores o emociones por miedo, por necesidad de agradar, por hábito o por falta de claridad.\\nEn lugar de castigarte por eso, puedes empezar a verlo como una señal de que algo dentro necesita ser escuchado. Es como un semáforo en ámbar que te avisa: “Detente un momento, algo no está encajando.”\\nY ese es un gran paso hacia la coherencia.' }]
        },
        {
          type: 'collapsible',
          title: 'Coherencia y salud emocional',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/Coherenciaysaludemocional.mp3`,
          content: [
            { type: 'paragraph', text: 'Vivir en coherencia no solo nos alinea internamente: también nos fortalece emocionalmente.\\nCuando tomas decisiones que están en sintonía con lo que sientes y valoras:' },
            { type: 'list', items: ['Se reduce la ansiedad y la culpa.','Te sientes más dueño o dueña de tu vida.','Ganas claridad y autoconfianza.','Mejoras tu energía física y mental.']},
            { type: 'paragraph', text: 'Ser coherente contigo no siempre es cómodo… pero casi siempre es sanador.\\nY lo mejor es que es una habilidad que se entrena, paso a paso, como lo estás haciendo tú ahora.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Una práctica, no un ideal',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/Unapracticanounideal.mp3`,
          content: [{ type: 'paragraph', text: 'La coherencia no es un estado perfecto al que se llega y ya. Es una práctica diaria. Una conversación contigo misma o contigo mismo que se renueva a cada paso.\\nNo se trata de acertar siempre. Se trata de darte cuenta cuando algo no encaja… y tener la valentía de hacer pequeños ajustes con amabilidad.\\nHoy puede que estés más conectada/o con lo que necesitas. Mañana puede que te confundas. Y pasado vuelvas a ti. Ese es el ritmo real de vivir en coherencia.\\nAquí no buscamos exigencias. Buscamos autenticidad, práctica consciente y respeto por ti.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'coherenceCompassExercise',
          title: 'EJERCICIO 1: MI BRÚJULA DE COHERENCIA',
          objective: 'Descubre en qué partes de tu vida estás alineado o alineada contigo, y en cuáles sientes que hay una desconexión.',
          duration: '10-15 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana1tecnica1.mp3`
        },
        {
          type: 'smallDecisionsLogExercise',
          title: 'EJERCICIO 2: REGISTRO DE DECISIONES PEQUEÑAS',
          objective: 'Observa cómo eliges en tu día a día, si actúas desde lo que realmente quieres o desde lo que crees que “debes” hacer.',
          duration: '5-10 min diarios',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana1tecnica2.mp3`
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/REFLEXION.mp3`, prompts: ['<ul><li>¿Qué he aprendido sobre mí esta semana…','Qué pasa en mi vida cuando no actúo en coherencia…','Ventajas que noto cuando alineo lo que pienso, siento y hago…','Un compromiso personal que me llevo…</li></ul>']},
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana1/RESUMEN.mp3` },
        { type: 'list', items: ['La coherencia personal ocurre cuando lo que piensas, sientes y haces apuntan en la misma dirección.','No es perfección, es práctica diaria y ajustes constantes.','La incoherencia no es un fallo: es una señal de que algo dentro necesita atención.','Entrenar la coherencia reduce la culpa, fortalece la confianza y mejora la energía emocional.','Se construye con decisiones cotidianas, no solo con grandes cambios.']},
        { type: 'quote', text: '“Cada vez que escuchas tu voz interna y la honras, das un paso hacia la vida que quieres vivir.”' }
      ]
    },
    {
      id: 'coherencia_sem2',
      title: 'Semana 2: Detecta tus Puntos de Desconexión',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [{ type: 'paragraphWithAudio', text: 'Tomar decisiones que te representen no es siempre lo más fácil… pero sí lo más auténtico. Esta semana aprenderás a identificar los valores que quieres sostener y a usarlos como brújula para decidir, incluso cuando haya dudas o presiones externas. Porque cuando sabes qué es importante para ti, es más fácil decir ‘sí’ o ‘no’ sin sentirte en deuda contigo mismo o contigo misma.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/INTRODUCCIONSEMANA2.mp3` },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Qué es realmente la incoherencia interna', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/Queesrealmentelaincoherenciainterna.mp3`, content: [{ type: 'paragraph', text: 'La incoherencia no significa que “seas una mala persona” o que “no tengas remedio”. Significa que, en ese momento, lo que piensas, sientes y haces no van de la mano.\\nA veces, es como si dentro de ti hubiera varias voces hablando al mismo tiempo… y cada una quisiera ir en una dirección distinta.\\nEsto ocurre por muchas razones: creencias que nunca revisaste, miedos antiguos, costumbres que se han vuelto automáticas… Reconocerlo no es debilidad, es un acto de valentía y lucidez.' }] },
        { type: 'collapsible', title: 'Las tres fuerzas que más nos alejan de nuestra coherencia', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/Lastresfuerzasquemasnosalejandenuestracoherencia.mp3`, content: [{ type: 'paragraph', text: '1. Miedo\\n- Distorsiona tu visión: imagina que quieres expresar algo en el trabajo, pero piensas “¿y si me miran raro?”. Ese pensamiento activa una alarma que exagera el riesgo.\\n- Te lleva a evitar: para no sentir incomodidad, eliges callar… y luego te quedas con la sensación de que no fuiste fiel a ti mismo/a.\\n- A veces te hace depender de la aprobación ajena porque temes perder vínculos o estatus.\\n\\n2. Necesidad de aprobación\\n- Si tu valor personal depende de la opinión de los demás, empiezas a actuar para encajar, aunque eso signifique decir “sí” cuando quieres decir “no”.\\n- Terminas proyectando una imagen “agradable” pero alejada de lo que realmente eres.\\n- Esto debilita tu confianza interna: con el tiempo, dudas de tu propio criterio.\\n\\n3. Automatismos\\n- Son como el “piloto automático” del cerebro: reacciones rápidas que aprendiste hace años y que repites sin pensar.\\n- Funcionan bien para tareas simples, pero en decisiones importantes pueden dejarte atrapado/a en rutinas que no te representan.\\n- Por ejemplo: responder con “todo bien” aunque por dentro estés agotado/a y necesites apoyo.' }] },
        {
          type: 'collapsible',
          title: 'Señales de que algo está desalineado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/Senalesdequealgoestadesalineado.mp3`,
          content: [
            { type: 'paragraph', text: 'Ahora que ya conoces las fuerzas que generan incoherencia, vamos a ver cómo se manifiesta en tu día a día. Estas señales son como luces de advertencia en un coche: no son el problema, pero indican que conviene parar y revisar.' },
            { type: 'list', items: ['Fatiga moral: ese cansancio que no es físico, sino emocional, por actuar contra lo que valoras. Por ejemplo, decir que sí a un proyecto que no quieres, solo para no decepcionar.','Incomodidad emocional persistente: una especie de “ruido de fondo” interno que aparece después de ciertas decisiones, aunque en el momento parecieran correctas.','Autojustificación excesiva: dar mil razones para convencerte de que “no estuvo tan mal” lo que hiciste, aunque en el fondo sabes que no es lo que querías.','Sensación de estancamiento: la impresión de vivir en un bucle, repitiendo las mismas decisiones y errores sin avanzar.']},
            { type: 'paragraph', text: 'Si reconoces alguna de estas señales, no te alarmes. No indican que “estés roto/a”, sino que hay un desajuste entre tu brújula interna y tu dirección actual. Y la buena noticia es que puedes recalibrarla.' }
          ]
        },
        { type: 'collapsible', title: 'Lo que hay detrás del conflicto', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/Loquehaydetrasdelconflicto.mp3`, content: [{ type: 'paragraph', text: 'La incoherencia no aparece de la nada: se alimenta de raíces profundas que, muchas veces, ni siquiera identificamos.' }, { type: 'list', items: ['Creencias rígidas y pensamiento dicotómico: ver el mundo en blanco o negro (“o es perfecto o no vale nada”). Esto hace que cualquier error parezca una catástrofe y te lleve a actuar para “evitar fallar” más que para ser fiel a ti mismo/a.','Esquemas aprendidos en entornos invalidantes: si de pequeño/a te hicieron sentir que tus emociones no importaban (“no llores”, “no exageres”), quizá hoy te cueste reconocer y priorizar lo que sientes.','Falta de claridad en tus metas y valores: sin un mapa interno, es fácil dejarse llevar por lo urgente o por lo que otros esperan, aunque no te acerque a lo que realmente quieres.'] }, { type: 'paragraph', text: 'Ejemplo: Es como navegar sin rumbo fijo: cualquier viento te arrastra, incluso si te aleja de la orilla que quieres alcanzar.\\nY aquí llega el punto clave: detectar estas raíces no es para culparte, sino para entender por qué actúas como actúas y poder decidir con más libertad.' }] },
        { type: 'collapsible', title: 'Por qué detectar la incoherencia es clave', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/Porquedetectarlaincoherenciaesclave.mp3`, content: [{ type: 'paragraph', text: 'Piensa en la incoherencia como en un GPS que te avisa cuando te has salido de la ruta:\\n- Si lo escuchas, puedes recalcular y volver al camino que quieres.\\n- Si lo ignoras, acabarás en un lugar que no eliges.\\nDetectar la incoherencia te permite:\\n- Reorientarte sin castigarte: el objetivo no es “ser perfecto/a”, sino ser más consciente.\\n- Recuperar tu capacidad de elegir: en vez de reaccionar por costumbre o por miedo, decides con intención.\\n- Fortalecer tu integridad y bienestar emocional: cada vez que alineas lo que piensas, sientes y haces, refuerzas tu autoconfianza.\\nEsta semana vamos a trabajar precisamente en eso: poner nombre a tus puntos de desconexión para que puedas, poco a poco, volver a alinear tu brújula interna.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'internalTensionsMapExercise', title: 'EJERCICIO 1: MAPA DE TENSIONES INTERNAS', objective: 'Detecta cuándo lo que piensas, sientes y haces no están en sintonía, para entender qué lo provoca y decidir qué quieres cambiar o mantener.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana2tecnica1.mp3`, duration: '15 min' },
        { type: 'ethicalMirrorExercise', title: 'EJERCICIO 2: EL ESPEJO ÉTICO', objective: 'Con este ejercicio quiero ayudarte a aclarar si lo que estás a punto de decidir está alineado con lo que eres y lo que valoras.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana2tecnica2.mp3`, 'duration': '10-12 min' },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/REFLEXION.mp3`, 
          prompts: [
            '<p>Te invito a detenerte un momento para mirar dentro de ti.  Piensa en las personas que te rodean, en las conversaciones que has tenido estos días, y sobre todo… en cómo te has sentido al practicar una escucha más presente.  </p>',
            '<ul><li>¿Qué he aprendido esta semana sobre mi forma de reaccionar ante la incertidumbre o el miedo?</li><li>¿Qué diferencia noté al explorar mis opciones desde el valor o la confianza?</li><li>¿Qué me ha ayudado a decidir con más claridad y menos ruido mental?</li><li>¿Qué decisión, aunque pequeña, tomé desde un lugar de coherencia conmigo misma o conmigo mismo?</li><li>¿Qué quiero recordarme la próxima vez que tenga que elegir en medio del miedo?</li></ul>'
          ] 
        },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana2/RESUMEN.mp3` },
        { type: 'list', items: ['Detectar tus puntos de desconexión interna te da información valiosa sobre tus necesidades y límites.','Pensamiento, emoción y acción funcionan como un equipo: si uno se descuida, todo el equilibrio se resiente.','La coherencia no significa rigidez: a veces elegir lo contrario a lo que sientes es válido, si responde a un valor importante para ti.','Observarte sin juicio abre espacio para el cambio y la autoaceptación.'] },
        { type: 'quote', text: 'La coherencia no es perfección, es respeto hacia lo que eres. Cada vez que piensas, sientes y actúas en la misma dirección, fortaleces tu brújula interna.' }
      ]
    },
    {
      id: 'coherencia_sem3',
      title: 'Semana 3: Actúa con Integridad sin Perder la Flexibilidad',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [{ type: 'paragraphWithAudio', text: 'Ser coherente no significa ser inflexible. Esta semana aprenderás a sostener tus principios sin caer en el perfeccionismo moral, a definir qué es negociable y qué no, y a tomar decisiones difíciles con claridad y responsabilidad. Porque tu coherencia crece cuando sabes adaptarte sin traicionarte. ', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/INTRODUCCIONSEMANA3.mp3` },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Coherencia ≠ Rigidez', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/CoherenciaRigidez.mp3`, content: [{ type: 'paragraph', text: 'A veces pensamos que “ser coherente” es no desviarse nunca del camino, aunque eso suponga pasar por encima de nuestras propias necesidades o de la realidad del momento. Eso no es coherencia, es rigidez, y la rigidez nos quiebra.\\nLa verdadera coherencia es flexible: sostiene tus principios pero te permite moverte con inteligencia.\\nEjemplo: Si valoras el respeto, puedes expresar una queja de forma firme y respetuosa, o decidir esperar a un momento más adecuado para hablar. Ambas opciones mantienen tu valor, pero se adaptan al contexto.' }] },
        { type: 'collapsible', title: 'Tus valores como brújula interna', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/Tusvalorescomobrujulainterna.mp3`, content: [{ type: 'paragraph', text: 'Imagina que estás en medio de una niebla espesa y no sabes hacia dónde ir. Tus valores son esa brújula que siempre apunta hacia tu “norte personal”.\\nCuando tienes claros tus valores, es más fácil decidir sin sentir que te traicionas. Pero si están difusos, es fácil perderte: acabas tomando decisiones para agradar, evitar conflictos o por miedo a equivocarte.\\nEn la Terapia de Aceptación y Compromiso, Steven Hayes y Kelly Wilson explican que los valores son como una brújula: no llegas a un destino final, pero te orientan en cada paso.\\nPor ejemplo, si uno de tus valores es la honestidad, quizás decidas ser honesto o honesta en una conversación difícil, aunque el camino más fácil fuera callar. Esa brújula interna no evita la incomodidad, pero sí te da un norte claro.' }] },
        { type: 'collapsible', title: 'El arte de adaptarse sin perderte', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/Elartedeadaptarsesinperderte.mp3`, content: [{ type: 'paragraph', text: 'La flexibilidad no es sinónimo de rendición. Es como un árbol firme: sus raíces están profundas en la tierra (tus valores), pero sus ramas se mueven con el viento (las circunstancias).\\nAdaptarte significa buscar la forma más saludable de mantener tu esencia, aunque no sea la que imaginabas.\\nEjemplo: Si valoras la salud y durante un viaje no tienes tus rutinas, en vez de frustrarte, puedes buscar la mejor opción disponible —caminar más, hidratarte, descansar bien— y volver a tu plan al regresar.' }] },
        { type: 'collapsible', title: 'Decisiones difíciles con paz interior', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/Decisionesdificilesconpazinterior.mp3`, content: [{ type: 'paragraph', text: 'Tomar decisiones alineadas con tus valores no siempre es fácil ni cómodo. Puede implicar que otras personas no estén de acuerdo, o que te enfrentes a consecuencias a corto plazo.\\nLa diferencia está en que, cuando actúas desde tu integridad, duermes tranquilo o tranquila. Puedes mirar atrás y sentir orgullo, porque tu decisión te representó de verdad.\\nEse es el objetivo de esta semana: que puedas tomar decisiones que te dejen en paz contigo, incluso cuando no son las más fáciles.' }] },
        { type: 'collapsible', title: 'Lo que vamos a trabajar esta semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/Loquevamosatrabajar.mp3`, content: [{ type: 'paragraph', text: 'En las técnicas de esta semana aprenderás:\\nA tomar decisiones importantes con tres filtros: tus valores, tus emociones y el impacto a largo plazo.\\nA definir tu lista de no negociables personales, esos principios que son tu línea roja incluso bajo presión.\\nCon esta claridad, podrás sostener lo que te importa sin caer en la rigidez, y adaptarte con confianza cuando sea necesario.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'integrityDecisionsExercise',
          title: 'EJERCICIO 1: DECISIONES CON INTEGRIDAD',
          objective: 'Hoy vamos a ayudarte a tomar decisiones importantes con la tranquilidad de saber que te representan de verdad. No se trata de encontrar la decisión perfecta, sino la que te deje en paz contigo, incluso si no es la más fácil. Vamos a poner tres filtros —tus valores, tus emociones y el impacto a largo plazo— para que tu elección sea clara y honesta. Te recomiendo practicarlo cada vez que tengas una decisión importante o que te genere dudas, incluso si no es urgente. Hazlo 2-3 veces por semana en momentos clave.',
          duration: '15-20 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana3tecnica1.mp3`,
        },
        { 
          type: 'nonNegotiablesExercise', 
          title: 'EJERCICIO 2: LISTA DE NO NEGOCIABLES PERSONALES', 
          objective: 'Tus no negociables son como un cinturón de seguridad emocional: te protegen de tomar decisiones que te dejen vacío o vacía por dentro. Hoy vamos a descubrir cuáles son esos 3 principios que, pase lo que pase, quieres sostener.',
          duration: '10-15 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana3tecnica2.mp3` 
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/REFLEXION.mp3`, 
          prompts: [
            '<p>Te invito a detenerte un momento para mirar dentro de ti. Piensa en las personas que te rodean, en las conversaciones que has tenido estos días, y sobre todo… en cómo te has sentido al practicar una escucha más presente.  </p>',
            '<ul><li>¿Qué he aprendido esta semana sobre mi forma de reaccionar ante la incertidumbre o el miedo?</li><li>¿Qué diferencia noté al explorar mis opciones desde el valor o la confianza?</li><li>¿Qué me ha ayudado a decidir con más claridad y menos ruido mental?</li><li>¿Qué decisión, aunque pequeña, tomé desde un lugar de coherencia conmigo misma o conmigo mismo?</li><li>¿Qué quiero recordarme la próxima vez que tenga que elegir en medio del miedo?</li></ul>'
          ] 
        },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana3/RESUMEN.mp3` },
        { type: 'list', items: ['La integridad no es rigidez: puedes mantener tus valores y adaptarte sin traicionarte.','Tener claros tus no negociables internos te ayuda a decidir con menos dudas y más calma.','La flexibilidad consciente es una fortaleza, no una señal de debilidad.','Decidir desde tus valores y emociones alineadas genera paz y autoconfianza.','Ajustar no es rendirse: es adaptar el camino sin perder el rumbo.'] },
        { type: 'quote', text: '“No siempre será fácil, pero cada vez que eliges lo que te representa, te fortaleces por dentro. La coherencia es tu ancla y la flexibilidad, tu vela.”' }]
    },
    {
      id: 'coherencia_sem4',
      title: 'Semana 4: Sostén tu Coherencia en la Vida Cotidiana',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraphWithAudio', text: 'El verdadero reto no es descubrir lo que valoras, sino vivirlo día a día. Esta semana aprenderás a detectar si tu entorno te impulsa o te sabotea, y a crear un compromiso personal que te recuerde quién eres y qué quieres sostener, incluso en momentos de presión o incertidumbre. Porque la coherencia se fortalece en lo pequeño… y eso la hace grande.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/INTRODUCCIONSEMANA4.mp3` },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Introducción: Cuando el mundo no va en tu misma dirección', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Cuandoelmundonovaentumismadireccion.mp3`, content: [{ type: 'paragraph', text: 'A veces, tu entorno parece un aliado: te apoya, te impulsa y te recuerda por qué haces lo que haces.\\nPero otras veces… no. Puedes encontrarte con personas que minimizan tus valores, con rutinas que te alejan de lo que quieres o con presiones que te empujan a ceder.\\nEsta semana vamos a trabajar cómo mantener tu dirección interna incluso en contextos exigentes, ambiguos o incoherentes… sin caer en la rigidez y sin perder tu paz.' }] },
        {
          type: 'collapsible',
          title: 'El papel del entorno',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Elpapeldelentorno.mp3`,
          content: [
            { type: 'paragraph', text: 'La neurociencia nos recuerda que nuestro cerebro es altamente social: las normas, hábitos y actitudes de quienes nos rodean pueden influir más de lo que creemos en nuestras decisiones diarias.\nEn TCC hablamos del “entorno facilitador” y del “entorno saboteador”:\nFacilitador → Personas y contextos que apoyan, refuerzan y celebran tus elecciones coherentes.\nSaboteador → Circunstancias, relaciones o hábitos que hacen que actuar en coherencia sea más difícil.\nEjemplo:\nFacilitador → Un compañero de trabajo que respeta tus descansos y horarios.\nSaboteador → Un entorno laboral donde se espera que respondas mensajes a cualquier hora.' }
          ],
        },
        { type: 'collapsible', title: 'La coherencia no es lineal', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Lacoherencianoeslineal.mp3`, content: [{ type: 'paragraph', text: 'Mantener la coherencia no significa que nunca te equivoques o cedas. En realidad, la coherencia se practica con humildad, revisión y propósito.\\nPiensa en ella como un músculo: cuanto más lo entrenas, más fuerte se hace… pero si un día fallas, no pasa nada: lo importante es volver a entrenar.\\nEjemplo: puedes tener una semana muy alineada con tus valores y otra en la que, por cansancio o presión, tomas decisiones que no lo están tanto. Lo que cuenta es aprender de esas situaciones y reajustar.' }] },
        { type: 'collapsible', title: 'Flexibilidad consciente vs. incoherencia', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Flexibilidadconscientevsincoherencia.mp3`, content: [{ type: 'paragraph', text: 'Aquí está la clave: adaptarte no es traicionarte… siempre que lo hagas desde una elección consciente.\\nFlexibilidad consciente → Decido ajustar mi comportamiento porque sé que no compromete lo esencial para mí.\\nIncoherencia → Actúo de forma contraria a lo que creo o siento, sin ser fiel a mis valores, por miedo, presión o costumbre.\\nEjemplo: Si tu valor es la salud y decides saltarte un entrenamiento para cuidar a un amigo enfermo, eso es flexibilidad consciente. Pero si lo haces porque temes que se enfade si no vas a un plan, ahí estás entrando en incoherencia.' }] },
        { type: 'collapsible', title: 'Revisión práctica', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Revisionpractica.mp3`, content: [{ type: 'paragraph', text: 'Antes de actuar en un entorno que pueda ponerte a prueba, pregúntate:\n¿Esto que voy a hacer está en línea con mis valores esenciales?\nSi adapto mi decisión, ¿sigo sintiéndome fiel a mí mismo/a?\n¿Este cambio responde a un acto de cuidado o a un miedo?\nEste pequeño “semáforo interno” te ayudará a sostener tu coherencia día a día.' }] },
        { type: 'collapsible', title: 'Lo que vamos a trabajar esta semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/Loquevamosatrabajar.mp3`, content: [{ type: 'paragraph', text: 'En esta última semana de la ruta:\nAnalizarás tus entornos clave y cómo influyen en tu coherencia.\nDetectarás ajustes necesarios para que tu entorno te apoye más.\nRedactarás tu propio Manifiesto personal de coherencia: un texto breve que será tu brújula para tomar decisiones alineadas contigo.\nPorque la coherencia no se predica: se vive… y empieza por cómo te tratas a ti mismo/a cuando te sales del camino.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'environmentEvaluationExercise', 
          title: 'EJERCICIO 1: EVALUACIÓN DE ENTORNOS CLAVE', 
          objective: 'Hoy quiero que mires tu vida como si tuvieras un mapa delante. Vamos a localizar qué caminos te acercan a tu coherencia… y cuáles te alejan. Porque cuando sabes qué entornos te apoyan y cuáles te drenan, tienes más poder para elegir dónde y con quién invertir tu energía.',
          duration: '8-10 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana4tecnica1.mp3` 
        },
        { 
          type: 'personalManifestoExercise', 
          title: 'EJERCICIO 2: VOLVER AL CAMINO CON COMPASIÓN',
          objective: 'Este ejercicio te ayudará a mirar con amabilidad los momentos en los que no actuaste en coherencia. No se trata de castigarte ni de “tachar” lo que hiciste, sino de entender qué pasó, aprender de ello y elegir un pequeño ajuste para retomar tu camino. La coherencia se sostiene con práctica, paciencia y autocompasión.',
          duration: '8–12 minutos. Te recomiendo hacerlo cada vez que sientas que te alejaste de tus valores o que reaccionaste de una forma que no te representa.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/tecnicas/Ruta9semana4tecnica2.mp3` 
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/REFLEXION.mp3`,
          prompts: [
            '<p>Esta semana has explorado qué significa hacerte cargo de tu vida sin convertir la responsabilidad en una carga que te desgasta. </p><p>Has aprendido a distinguir entre lo que está dentro de tu círculo de influencia y lo que no, y a comprometerte con decisiones que respeten tus límites y tu energía. </p><p>Piensa ahora en cómo este enfoque puede transformar tu manera de actuar y de cuidarte. </p> <p>Preguntas para reflexionar:</p><ul><li>¿Qué descubrimiento de esta semana ha sido más revelador para ti sobre la forma en que asumes la responsabilidad?</li><li>¿En qué situaciones recientes has podido decir “esto no me corresponde” y sentirte en paz con ello?</li><li>¿Cómo ha cambiado tu forma de hablarte a ti mismo o a ti misma después de realizar las técnicas propuestas?</li><li>¿Qué compromisos nuevos quieres mantener a partir de ahora para cuidar de ti mientras te haces cargo de lo que sí depende de ti?</li></ul>'
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/semana4/RESUMEN.mp3` },
        {
          type: 'list',
          items: [
            'La coherencia se fortalece cuando la practicas en tu vida real, no solo en teoría.',
            'El entorno puede ser un aliado o un obstáculo: observarlo te ayuda a decidir cómo interactuar con él.',
            'No se trata de rigidez: la coherencia incluye adaptarse sin traicionarte.',
            'Pequeños actos diarios coherentes generan confianza interna y consistencia.',
            'Revisar y ajustar tu rumbo es una muestra de madurez, no de debilidad.',
          ],
        },
        {
          type: 'quote',
          text: 'Cada vez que eliges actuar en coherencia, aunque nadie más lo vea, siembras respeto por ti mismo/a.',
        },
      ],
    },
    {
      id: 'coherencia_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'REFLEXIÓN FINAL DE LA RUTA',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/REFLEXIONRUTA7.mp3`,
          prompts: [
            '<p>Has recorrido un camino valiente: el de poner límites con respeto, firmeza y cuidado. Tal vez no haya sido fácil. Quizás has tenido que enfrentar viejas culpas, miedos o dudas. Pero también has recuperado algo valioso: tu voz. Ahora te invito a hacer una pausa y mirar hacia dentro. No para exigirte más, sino para reconocer todo lo que ya has practicado. Escribe con honestidad y sin exigencias:</p>',
            '<p>Preguntas para tu cuaderno emocional:</p>',
            '<ul><li>¿Qué me ha revelado esta ruta sobre mi forma de relacionarme?</li><li>¿Qué barreras me he atrevido a cruzar para ser más auténtico/a?</li><li>¿Qué quiero empezar a hacer diferente en mis relaciones?</li><li>¿Qué vínculo me gustaría cultivar desde un lugar más sano y más yo?</li><li>¿Qué me recordaré cuando sienta miedo de decepcionar por ser quien soy?</li></ul>'
          ]
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta9/descripciones/RESUMENFINALRUTA.mp3`
        },
        {
          type: 'list',
          items: [
            'La coherencia personal es la armonía entre lo que piensas, sientes y haces. ',
            'No es rigidez: implica flexibilidad consciente sin perder el eje de tus valores. ',
            'Conocer y priorizar tus valores te da un norte en decisiones pequeñas y grandes. ',
            'El entorno influye: identificar qué lo facilita o dificulta te da margen de acción. ',
            'La coherencia se construye con actos cotidianos, no con grandes discursos. ',
            'Revisar y ajustar tu rumbo es una muestra de madurez, no de debilidad.',
            '  Respetarte en tus decisiones alimenta tu autoestima y tu sentido de dignidad ',
          ],
        },
        {
          type: 'quote',
          text: 'Vivir con coherencia no es un destino, es un camino que recorres cada día… y ese camino empieza siempre en ti.',
        },
      ],
    },
  ],
};
