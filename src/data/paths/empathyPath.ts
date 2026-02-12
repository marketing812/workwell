
import type { Path } from './pathTypes';

export const empathyPath: Path = {
  id: 'relaciones-autenticas',
  title: 'Relaciones Auténticas con Empatía',
  description: 'Aprende a expresarte con claridad, a cuidar tus vínculos sin perderte a ti y a construir relaciones más nutritivas, equilibradas y verdaderas.',
  dataAiHint: 'empathy authentic relationships',
  audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/INTRODUCCIONRUTA.mp3',
  modules: [
    {
      id: 'empatia_sem1',
      title: 'Semana 1: ¿Quién Soy en mis Vínculos?',
      type: 'introduction',
      estimatedTime: '25-30 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te ha pasado que dices que "sí" aunque querías decir "no"?\n¿O que sales de una conversación con una sensación de incomodidad por no haber expresado algo importante?\nEsta semana vamos a explorar el verdadero significado de los límites: no como un muro que separa, sino como un puente que te conecta contigo y con los demás desde el respeto. Aprenderás por qué nos cuesta tanto ponerlos, qué emociones aparecen y cuáles son tus patrones más comunes cuando no logras expresarte.\nVerás que poner un límite no es rechazar a nadie: es incluirte también a ti en la relación.\nCada vez que te eliges con respeto, estás entrenando tu autoestima.',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/INTRODUCCIONSEMANA1.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Qué hace que una relación sea de verdad nutritiva?',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Quehacequeunarelacionseadeverdadnutritiva.mp3',
          content: [
            { type: 'paragraph', text: 'Las relaciones que realmente nos nutren no se construyen desde la perfección ni desde la obligación. Se construyen cuando podemos estar presentes de forma genuina, sin disfraces, y cuando nos sentimos vistos, escuchados y respetados en lo que realmente sentimos.\nPero para que eso sea posible, hay algo que debe estar en el centro: la empatía verdadera y la honestidad emocional.\nSin ellas, no hay espacio seguro para mostrarnos tal como somos.' }
          ]
        },
        {
          type: 'collapsible',
          title: '¿Qué es realmente la empatía?',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Queesrealmentelaempatia.mp3',
          content: [
            { type: 'paragraph', text: 'Mucha gente cree que empatizar es preguntarse:\n“¿Si esto me pasara a mí, cómo me sentiría?”\nPero eso no es empatía real.\nEso es imaginarte a ti en el lugar del otro, y al hacerlo, sin darte cuenta, filtras la vivencia del otro a través de tu historia, tus emociones, tus creencias.\nLa empatía verdadera es diferente:' },
            { type: 'list', items: ['“Voy a intentar comprender cómo se siente el otro... desde su mundo, no desde el mío.”', '“No necesito estar de acuerdo. Solo quiero estar presente, sin juicio ni correcciones.”']}
          ]
        },
        {
          type: 'collapsible',
          title: 'Lo que la empatía NO es',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Loquelaempatianoes.mp3',
          content: [
            { type: 'paragraph', text: 'La empatía no juzga, no analiza, no interrumpe.\nY, desde luego, no minimiza con frases como:'},
            { type: 'list', items: ['“Bueno, no es para tanto…”','“Tienes que ser más fuerte.”','“Eso no debería afectarte así.”'] },
            { type: 'paragraph', text: 'Estas frases, aunque bienintencionadas, generan invalidación emocional. Y cuando invalidamos al otro, lo que suele pasar es que se cierra, se esconde o se siente solo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Empatía y autenticidad van juntas',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Empatiayautenticidadvanjuntas.mp3',
          content: [
            { type: 'paragraph', text: 'Nadie puede mostrarse como es si siente que va a ser corregido, juzgado o ignorado.\nY tú tampoco puedes ser auténtico o auténtica si vives desde el miedo a decepcionar, incomodar o “no estar a la altura”.\nPor eso, la empatía y la autenticidad no se pueden separar:'},
            { type: 'list', items: ['La empatía crea el espacio seguro.','La autenticidad lo habita.']}
          ]
        },
        { type: 'collapsible', title: 'La honestidad emocional se entrena', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Lahonestidademocionalseentrena.mp3', content: [{ type: 'paragraph', text: 'Ser auténtico no es “decirlo todo sin filtro”.\nEs aprender a expresar lo esencial con respeto y claridad.\nLa honestidad emocional no es una etiqueta moral, es una habilidad.\nEs reconocer lo que sientes, validarlo internamente y comunicarlo sin herirte ni herir.\nTienes derecho a sentir lo que sientes, a decirlo o a guardar silencio si eso te cuida mejor.\nY antes de pedir validación fuera... necesitas practicar auto-validación emocional.' }] },
        {
          type: 'collapsible',
          title: '¿Te reconoces tras una máscara?',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Tereconocestrasunamascara.mp3',
          content: [
            { type: 'paragraph', text: 'A veces, por miedo a no ser aceptados, nos mostramos como creemos que deberíamos ser:'},
            { type: 'list', items: ['Más alegres de lo que estamos.','Más fuertes, comprensivos, funcionales...','O directamente nos callamos.']},
            { type: 'paragraph', text: 'Estas máscaras pueden protegerte, sí, pero también te desconectan de ti y de los demás.\nLa autenticidad se pierde cuando tu presencia no está presente.' }
          ]
        },
        { type: 'collapsible', title: 'Esta semana entrenas…', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/Estasemanaentrenas.mp3', content: [{ type: 'list', items: ['Detectar qué relaciones te alejan de tu autenticidad.', 'Escuchar cómo te sientes antes de actuar o responder.', 'Expresarte con más verdad y con más respeto, hacia ti y hacia el otro.'] }, { type: 'paragraph', text: 'Porque ser auténtico o auténtica no es imponer tu verdad…\nEs no dejarte fuera de lo que estás viviendo.' }] },
        {
          type: 'collapsible',
          title: 'Una nueva forma de estar en tus vínculos',
          content: [
            { type: 'paragraph', text: 'Recuerda:'},
            { type: 'list', items: ['La empatía real no es ponerte en los zapatos del otro...','Es caminar a su lado, sin hacer que le queden como a ti.']},
            { type: 'paragraph', text: 'Y la autenticidad florece cuando hay espacio para sentir sin disfraz.\nEse espacio también puedes creártelo tú.'}
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'authenticityThermometerExercise', title: 'EJERCICIO 1 – MI TERMÓMETRO DE AUTENTICIDAD', objective: '¿Alguna vez has sentido que en ciertas relaciones estás actuando, en lugar de ser tú? Este ejercicio te ayuda a observar con honestidad y sin juicio cómo te muestras en tus vínculos cotidianos. Vas a descubrir en qué relaciones puedes ser tú con libertad… y en cuáles tiendes a ponerte una máscara para protegerte o agradar. No se trata de cambiar todo de golpe, sino de empezar a reconocer tu verdad y recuperar tu presencia en cada vínculo.', duration: '15-20 min', audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion1tecnica1.mp3' },
        { type: 'empatheticDialogueExercise', title: 'Ejercicio 2: DIÁLOGO INTERNO EMPÁTICO', objective: 'Este ejercicio es una pausa consciente para escucharte desde la empatía y conectar contigo antes de responder a los demás. Te ayudará a darte lo que necesitas internamente, en lugar de actuar por impulso o por miedo. Porque a veces, lo más importante no es lo que dices… sino desde dónde lo dices.', duration: '10-15 min', audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion1tecnica2.mp3' },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/REFLEXION.mp3', prompts: ['<ul><li>¿Qué he descubierto sobre mí al observar cómo me muestro en mis relaciones?</li><li>¿Cómo me afecta a nivel emocional y físico cuando no me permito ser auténtico/a?</li><li>¿Qué me ocurre cuando no escucho lo que necesito y me esfuerzo por encajar o agradar?</li><li>¿Cómo se resienten mis relaciones cuando no soy empático/a con los demás? ¿Y conmigo?</li><li>¿Qué beneficios emocionales empiezo a notar cuando me expreso con más verdad, incluso en pequeños gestos?</li><li>¿Qué aprendizaje me llevo de esta semana para cuidar mis vínculos sin dejarme fuera de ellos?</li></ul>']},
        { type: 'title', text: 'Resumen Clave', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana1/RESUMENYCIERRE.mp3' },
        { type: 'list', items: ['Las relaciones auténticas se construyen desde la presencia genuina, no desde la obligación o la perfección.','La empatía verdadera no es ponerte en los zapatos del otro, sino acompañar desde su realidad sin juicio.','Las frases bienintencionadas que minimizan el malestar generan invalidación emocional.','La autenticidad florece cuando hay espacio seguro creado por la empatía.','Ser honesto/a emocionalmente no es decirlo todo sin filtro, sino aprender a expresar lo esencial con respeto.','Las máscaras relacionales protegen, pero también desconectan de uno/a mismo/a y de los demás.','Esta semana entrenas a detectar tus máscaras, escuchar tus emociones y expresarte desde tu verdad.','La autenticidad empieza cuando te validas internamente y eliges no dejarte fuera de ellos.'] }, { type: 'quote', text: 'Cada vez que eliges mostrarte tal como eres, abres la puerta a vínculos más reales, más libres… y más tuyos.' }]
    },
    {
      id: 'empatia_sem2',
      title: 'Semana 2: Escucha y Comprende con el Corazón',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [{ type: 'paragraphWithAudio', text: '¿Te ha pasado alguna vez que alguien te escuchaba, pero sentías que no estaba realmente contigo?\nQuizás te miraba, pero su mente estaba en otro sitio, o te respondía tan rápido que parecía tener la solución antes de que acabaras de hablar.\nEsta semana vamos a entrenar una forma de escucha profunda y sin juicio, en la que puedas acompañar emocionalmente a otra persona sin interrumpir, sin aconsejar y sin hablar de ti. Aprenderás a reflejar lo que el otro siente, creando un espacio de validación auténtica.', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana2/INTRODUCCIONSEMANA2.mp3' }, { type: 'title', text: 'Psicoeducación' }, { type: 'collapsible', title: '¿Escuchas para responder o para comprender?', 'audioUrl':'https://workwellfut.com/audios/ruta5/descripciones/semana2/Escuchaspararesponderoparacomprender.mp3', content: [{ type: 'paragraph', text: 'A menudo, oímos sin escuchar profundamente. Escuchamos para corregir, para dar consejos, para aliviar el malestar… pero muy pocas veces escuchamos para comprender de verdad. La escucha empática es una presencia distinta: no exige, no interrumpe, no intenta arreglar. Solo está.' }] }, { type: 'collapsible', title: '¿Qué bloquea nuestra escucha empática?', 'audioUrl':'https://workwellfut.com/audios/ruta5/descripciones/semana2/Quebloqueanuestraescuchaempatica.mp3', content: [{ type: 'paragraph', text: 'Incluso cuando queremos ayudar, hay reacciones automáticas que interrumpen la conexión emocional:' }, { type: 'list', items: ['Intentar calmar demasiado rápido (“No te pongas así”).', 'Ofrecer soluciones sin validar (“Lo que tienes que hacer es…”).', 'Minimizar o comparar (“A mí me pasó algo peor y aquí estoy”).', 'Estar físicamente presente pero emocionalmente ausente (mirar el móvil).', 'Anticipar y no dejar terminar (“Ya sé lo que vas a decir”).'] }, { type: 'paragraph', text: 'Estas actitudes, aunque habituales, hacen que el otro se sienta solo o incomprendido.' }] }, { type: 'collapsible', title: 'Validar no es justificar. Es comprender.', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana2/Validarnoesjustificarescomprender.mp3', content: [{ type: 'paragraph', text: 'Validar emocionalmente no significa que estés de acuerdo con todo. Significa decir (con palabras o sin ellas): “Entiendo que lo que sientes tiene sentido desde tu vivencia”. En vez de “No deberías sentirte así”, puedes decir “Puedo ver que esto te está afectando mucho”. Validar es sostener la emoción del otro sin juzgarla ni querer cambiarla.' }] }, { type: 'collapsible', title: '¿Por qué nos cuesta tanto escuchar así?', audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana2/Porquenoscuestatantoescucharasi.mp3', content: [{ type: 'paragraph', text: 'Porque no nos lo enseñaron. Aprendimos a resolver, a tranquilizar, a corregir… pero no a quedarnos presentes mientras el otro siente algo incómodo. Escuchar de verdad implica estar ahí, aunque no sepamos qué decir. Y para poder hacerlo con el otro, necesitas practicarlo primero contigo.' }] }, { type: 'title', text: 'Técnicas Específicas' }, { 'type':'empathicMirrorExercise', 'title':'EJERCICIO 1: EL ESPEJO EMPÁTICO', 'objective':'En este ejercicio vas a entrenar una forma de escucha profunda y sin juicio, en la que puedas acompañar emocionalmente a otra persona sin interrumpir, sin aconsejar y sin hablar de ti. \nAprenderás a reflejar lo que el otro siente, creando un espacio de validación auténtica, aunque no digas muchas palabras. \n\nEsta habilidad transforma tus relaciones. Y también te ayuda a dejar de cargar con lo que no te corresponde, porque comprender no es absorber: es estar con el otro, sin perderte tú. \n\nTe recomiendo practicarlo varias veces esta semana, en diferentes conversaciones.', 'duration':'10-12 minutos', 'audioUrl':'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion2tecnica1.mp3' }, { 'type':'validationIn3StepsExercise', 'title':'EJERCICIO 2: VALIDACIÓN EN 3 PASOS', 'objective':'Este ejercicio te muestra una forma sencilla y poderosa de estar presente con el otro sin intentar arreglar nada. Aprenderás a validar emocionalmente en tres pasos muy concretos, para que la otra persona sienta que su experiencia tiene sentido y que no está sola.', 'duration':'10 min', 'audioUrl':'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion2tecnica2.mp3' }, { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana2/REFLEXION.mp3', 
          prompts: [
            '<p>Te invito a detenerte un momento para mirar dentro de ti.  Piensa en las personas que te rodean, en las conversaciones que has tenido estos días, y sobre todo… en cómo te has sentido al practicar una escucha más presente.  </p>',
            '<ul><li>¿Cuándo fue la última vez que alguien me escuchó de verdad, sin juicio ni prisa?</li><li>¿Qué hizo esa persona para que yo me sintiera tan visto/a y comprendido/a?</li><li>¿Qué impacto emocional tiene en mis vínculos cuando interrumpo, comparo o minimizo lo que el otro siente?</li><li>¿Qué me gustaría empezar a ofrecer más en mis relaciones: más silencio, más validación, más presencia...?</li><li>¿Qué me llevo esta semana como recordatorio para ser mejor compañía, para los demás y para mí?</li></ul>'
          ] 
        }, { type: 'title', text: 'Resumen Clave', 'audioUrl':'https://workwellfut.com/audios/ruta5/descripciones/semana2/RESUMEN.mp3' }, { 'type':'list', 'items':['Escuchar de verdad no es lo mismo que oír: requiere presencia, pausa y conexión emocional.','La mayoría de las veces, respondemos para corregir o tranquilizar, no para comprender.','Frases como “No es para tanto” o “Mira el lado bueno” pueden invalidar profundamente al otro.','Validar no significa justificar. Es decir: “Lo que sientes tiene sentido desde tu vivencia.”','La empatía empieza en el silencio y se cultiva en la atención y la práctica.'] }, { 'type':'quote', 'text':'Escuchar de verdad es una forma profunda de amar sin condiciones. A veces, basta con quedarte al lado del otro… sin apagar lo que siente.' }]
    },
    {
      id: 'empatia_sem3',
      title: 'Semana 3: Sé Empático sin Perderte a Ti',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te ha pasado que alguien que quieres está mal… y sientes la necesidad de hacer algo, aunque estés agotado o confundida? \n¿O que, después de acompañar a alguien, te quedas sin energía, vacía o incluso resentida? \n\nEso tiene nombre, y no es solo “ser sensible” ni “tener un gran corazón”. \nSe llama fusión emocional. Y es muy diferente de la verdadera empatía. ',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Tepasaestocuandoalguienloestapasandomal.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Qué es realmente la empatía?',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Queesrealmentelaempatia.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'La empatía real es una habilidad emocional compleja, que se entrena. \n\nImplica tres cosas: \n\nPrimero, percibir la emoción del otro sin juicio. \n\nDespués, comprenderla desde su historia, no desde la tuya. \n\nY, por último, acompañar con presencia, sin intentar corregir ni resolver. ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Fusión emocional: cuando te pierdes por cuidar',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Fusionemocionalcuandotepierdesporcuidar.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'La fusión emocional ocurre cuando el dolor del otro te inunda por completo. \n\nDejas de escuchar tus propias emociones y actúas desde la culpa, la urgencia o el miedo. ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Resonancia, empatía y fusión: no es lo mismo',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Resonanciaempatiayfusionnoeslomismo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Resonancia afectiva: es una reacción emocional automática e instintiva ante lo que siente otra persona. El cuerpo responde sin reflexión ni distancia. \n\nEmpatía: es la capacidad consciente y regulada de comprender y acompañar la emoción del otro, sin perderse en ella. \n\nFusión emocional: es la pérdida de límites emocionales donde se carga con lo que no te corresponde, confundiendo cuidar con hacerse responsable del malestar ajeno. ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Por qué nos fundimos emocionalmente',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Porquenosfundimosemocionalmente.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Nos fundimos porque muchas veces aprendimos a hacerlo así.  \nDe pequeños, nos premiaron por “ser buenos”, “no molestar”, o “hacer feliz a los demás”.  Y sin darnos cuenta, asociamos el amor con el sacrificio.  ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'La empatía sana sí existe',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Laempatiasanasiexiste.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'La empatía sana es acompañar sin absorber. Es sostener con una presencia clara, firme y compasiva.  \n\nNo necesitas tener todas las respuestas. No necesitas apagar tu luz para que el otro brille.  \n\nLa empatía real respeta al otro… y también te respeta a ti.  ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Herramientas que vas a entrenar esta semana',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Herramientasquevasaentrenarestasemana.mp3',
          content: [
            { type: 'list', items: ['Asertividad emocional: poner palabras claras a lo que necesitas, sin agredir ni desaparecer.','Autoconciencia: detectar cómo te sientes antes de actuar. Preguntarte “¿Estoy disponible de verdad?”.','Mindfulness emocional: respirar antes de absorber, darte tiempo antes de responder.','Reestructuración cognitiva: cambiar pensamientos como “Tengo que aguantarlo todo” por “Puedo cuidar sin cargar”.','Compasión equilibrada: recordar que tú también mereces contención.'] }
          ],
        },
        {
          type: 'collapsible',
          title: 'Una metáfora para recordarlo',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/Unametaforapararecordarlo.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Imagina que tu energía emocional es como una llama encendida.  \nSi te expones al viento todo el tiempo, se apaga.  \nSi la encierras, se asfixia.  \n\nPero si la proteges con ternura, puede seguir ardiendo y también alumbrar a los demás.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'empathicShieldVisualizationExercise',
          title: 'EJERCICIO 1: VISUALIZACIÓN GUIADA: EL ESCUDO EMPÁTICO',
          objective:
            '¿Te sientes a veces agotado/a después de acompañar a alguien? ¿Te cuesta distinguir entre estar presente… y quedarte vacía/o por dentro? \n\nEste ejercicio está hecho para ti. \nVamos a entrenar una forma de cuidar sin romperte: una visualización breve, pero poderosa, que te ayudará a crear tu escudo emocional interno. \nNo es una barrera. Es un filtro que te protege mientras sigues siendo tú. \nPara que puedas escuchar… sin absorber. Acompañar… sin fundirte. Y cuidar… sin desaparecer. \n\nTe recomiendo repetir esta visualización 2 o 3 veces por semana, especialmente antes de conversaciones emocionalmente exigentes o relaciones que te remueven.',
          duration: '6-8 min',
          audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion3tecnica1.mp3',
        },
        {
          type: 'emotionalInvolvementTrafficLightExercise',
          title: 'Ejercicio 2: Semáforo de implicación emocional',
          objective: 'Este ejercicio te ayudará a ponerle nombre y color a lo que sientes en tus relaciones. Vas a observar cómo te afecta cada vínculo y decidir conscientemente cómo quieres implicarte para proteger tu energía.',
          duration: '15-20 min',
          audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion3tecnica2.mp3',
        },
        {
          type: 'activateShieldExercise',
          title: 'Micropráctica diaria opcional: Activa tu escudo antes de entrar',
          objective: 'Para ayudarte a no perderte en el malestar del otro. Es tu momento para recordar que también tú importas en cada interacción. Esta práctica breve te ancla antes de cuidar.',
          duration: '1-2 min',
          audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion3tecnica3.mp3'
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/REFLEXION.mp3',
          prompts: [
            '<p>Esta pausa es para integrar todo lo que has vivido esta semana </p>',
            '<ul><li>¿En qué momentos te has sentido fundido/a emocionalmente sin darte cuenta?</li><li>¿Qué cambios has notado al observar tus relaciones desde el semáforo emocional?</li><li>¿Qué frases o ideas de esta semana te gustaría recordar cuando vuelvas a estar con alguien que te necesita?</li><li>¿Qué pequeño paso puedes dar esta semana para cuidar tu llama sin apagarla por estar al lado de otra persona?</li></ul>',
          ],
        },
        {
          type: 'title',
          text: 'Resumen Clave',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana3/RESUMEN.mp3',
        },
        {
          type: 'list',
          items: [
            'La fusión emocional no es empatía: es perderte mientras intentas cuidar.',
            'La empatía real es estar presente sin desaparecer, comprender sin absorber.',
            'Cuidar desde la culpa o el miedo agota y genera autoabandono.',
            'Puedes entender al otro sin compartir su opinión ni justificar su dolor.',
            'Técnicas como el escudo empático o el semáforo emocional te ayudan a proteger tu energía sin dejar de vincularte.',
          ],
        },
        { type: 'quote', text: 'Puedes estar con el otro sin dejar de estar contigo. La empatía que no te borra… es la que más alumbra.' },
      ],
    },
    {
      id: 'empatia_sem4',
      title: 'Semana 4: Crea Vínculos con Sentido y Cuidado Mutuo',
      type: 'summary',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te ha pasado que al empezar a poner límites… algunas personas se alejan y otras se acercan más?\nEsta semana vas a revisar con calma qué vínculos realmente te nutren y cómo puedes construir relaciones más auténticas, honestas y seguras. No se trata de tener muchas personas cerca, sino de cultivar la calidad emocional de tus lazos. Aprenderás que decir “no” a lo que te daña es también una forma profunda de decirte “sí” a ti.',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/INTRODUCCIONSEMANA4.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'No necesitas muchas personas. Necesitas relaciones que te sostengan de verdad.',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO1.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'A veces creemos que estar rodeados de muchas personas es señal de bienestar. Que cuantos más vínculos, más seguridad, más apoyo, más amor.\nPero con el tiempo —y sobre todo cuando pasamos por momentos difíciles— nos damos cuenta de algo muy diferente:\nLo que de verdad alivia, sostiene y transforma no es la cantidad, sino la calidad del vínculo.\n\nUna sola relación donde puedas respirar, decir cómo te sientes sin miedo, ser tú sin tener que defenderte o explicar todo…\n…vale más que diez relaciones donde tienes que estar vigilando qué partes de ti mostrar y cuáles esconder.\n\nLas relaciones que nutren no son aquellas donde todo fluye sin conflicto.\nSon aquellas donde puedes existir tal como eres.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Las relaciones honestas a veces duelen… pero sanan',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO2.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Cuando aprendemos a poner límites o a decir lo que realmente sentimos, no todo se vuelve más fácil al instante.\nDe hecho, al principio puede doler.\nPuedes sentirte incómoda/o, culpable o insegura/o.\nY eso es completamente normal. Porque estás empezando a mostrarte sin máscaras en relaciones donde antes te adaptabas para no molestar.\n\nPero ese paso es necesario.\nPorque una relación honesta no es perfecta:\nes aquella donde puede haber incomodidad, desacuerdo o frustración…\n…y aun así el vínculo se sostiene con respeto mutuo.\n\nPoner límites claros también es una forma de cuidar lo que construyes con el otro.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'No necesitas esconder lo que sientes para que la relación funcione',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO3.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'En relaciones realmente nutritivas no hace falta que te muestres fuerte todo el tiempo.\nTampoco necesitas fingir que todo está bien, o callarte cuando algo te duele.\nPorque la confianza no se fortalece con silencios, sino con autenticidad.\n\nHablar claro, desde tu vivencia, es un acto de conexión.\nY aquí es importante recordar una diferencia fundamental:\nno es lo mismo criticar que comunicar.\n\nNo es igual decir:\n“Eres muy egoísta, nunca piensas en mí”\n…que decir:\n“Cuando tomas decisiones sin contar conmigo, siento que mi opinión no se tiene en cuenta. Y eso me duele.”\n\nUna comunicación honesta no dramatiza ni ataca.\nNombra lo que ocurre desde lo vivido, desde el cuerpo, desde el vínculo que se quiere cuidar.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'La seguridad relacional no aparece sola: se construye paso a paso',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO4.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Es fácil pensar que los vínculos seguros nacen de forma natural, como si la afinidad, el tiempo o la buena voluntad bastaran.\nPero la realidad es otra:\nlas relaciones sanas se construyen con conciencia, palabra y coherencia.\n\nEso implica cuidar cómo te expresas, cómo escuchas, cómo corriges y cómo agradeces.\nImplica dejar de asumir que el otro sabe lo que te pasa, y empezar a nombrarlo con respeto.\nImplica no solo señalar lo que falta, sino también reconocer lo que sí hay.\n\nA veces, un “gracias por estar” o un “me hizo bien que me escucharas” fortalece más un vínculo que horas de discusión.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Lo que hace que una relación merezca la pena no es que todo sea fácil, sino que tú te sientas libre en ella',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO5.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Puede que tengas muchas personas a tu alrededor, pero si no puedes ser tú en esas relaciones… ¿de qué sirven?\nUna relación que te respeta, que te cuida, que no necesita que finjas…\n…esa relación vale más que muchas que te exigen esfuerzo constante para mantenerte en pie.\n\nY no es que todo tenga que ser perfecto.\nLo importante es que puedas sentirte libre para estar como estés:\nconfusa/o, alegre, cansada/o, vulnerable.\nPorque si necesitas ocultarte para mantener un vínculo, ese vínculo ya te está pidiendo demasiado.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Cuando sabes que tus vínculos son sólidos, poner límites no da tanto miedo',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO6.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Una pista importante:\ncuanto más sólida y segura es una relación, menos culpa sientes al poner límites.\nPorque sabes que ese vínculo no depende de que digas siempre “sí”, ni de que estés disponible todo el tiempo.\nDepende de la confianza que se han ido dando… incluso cuando las decisiones no son cómodas.\n\nEn una relación segura, tu “no” no destruye. Fortalece.\n\nY cuanto más practiques poner límites con respeto, más cerca estarás de crear relaciones que te incluyan, no que te exijan borrarte.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Autocompasión después de elegir cuidarte',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/AUDIO7.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'A veces, después de poner un límite o decir lo que sientes, aparece un malestar que no esperabas:\ndudas, tristeza, miedo a haber hecho daño, ganas de volver atrás.\nEs normal. Porque estás saliendo de patrones donde cuidar al otro era más fácil que cuidarte a ti.\n\nPero justo ahí es donde necesitas practicar algo esencial:\nautocompasión.\n\nDecirte internamente:\n\n“No necesito ser perfecta/o para ser querida/o.”\n“Poner un límite no significa dejar de amar.”\n“Este malestar es parte del cambio, no una señal de error.”\n\nApóyate en las relaciones donde puedes respirar.\nDonde no necesitas justificarte.\nDonde ser tú no es una amenaza, sino una bienvenida.',
            },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'significantRelationshipsInventoryExercise',
          title: 'EJERCICIO 1: INVENTARIO DE RELACIONES SIGNIFICATIVAS',
          objective: '¿Alguna vez te has sentido rodeado o rodeada de gente, pero emocionalmente sola o solo? No todas las relaciones nos sostienen. Algunas nos llenan. Otras nos drenan. Y muchas veces, no nos detenemos a mirar con honestidad qué vínculos sí nos nutren de verdad. Este ejercicio es una invitación a hacer un inventario emocional de tu red de apoyo: reconocer quiénes son, cómo te ayudan y qué puedes hacer tú para cuidar esos vínculos.',
          duration: '15-20 min',
          audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion4tecnica1.mp3',
        },
        {
          type: 'relationalCommitmentExercise',
          title: 'EJERCICIO 2: MI COMPROMISO RELACIONAL',
          objective: '¿Te ha pasado que sabes lo que no quieres en una relación, pero no tienes tan claro lo que sí deseas construir? A veces nos enfocamos en protegernos… pero olvidamos definir cómo queremos estar presentes. Este ejercicio es una brújula emocional: Una oportunidad para que tú elijas conscientemente con quién deseas vincularte y desde qué valores. Vas a crear tu propio compromiso relacional, para recordarte cómo cuidar tu bienestar también en los vínculos.',
          duration: '15-20 min',
          audioUrl: 'https://workwellfut.com/audios/ruta5/tecnicas/Ruta5sesion4tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/REFLEXION.mp3',
          prompts: [
            '<p>Esta semana hemos puesto el foco en algo que a veces damos por sentado: las relaciones que nos sostienen. Cuidar un vínculo no es un acto aislado, es una decisión repetida que requiere atención, autenticidad y reciprocidad. Ahora es momento de parar un instante y mirar lo que descubriste sobre tu forma de construir, cuidar y nutrir tu red de apoyo.</p><ul><li>¿Qué descubrí esta semana sobre la manera en que cuido mis relaciones?</li><li>¿En qué momentos sentí que estaba presente de verdad para otra persona?</li><li>¿Qué gestos de cuidado recibí que me hicieron sentir bien?</li><li>¿Hay algún vínculo que necesite reforzar… o quizás dejar en pausa para cuidarme mejor?</li><li>¿Qué he aprendido sobre el equilibrio entre dar y recibir?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/semana4/RESUMEN.mp3',
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
          text: 'Las relaciones que te nutren se eligen, se cuidan y se agradecen. Son el puente que une tu fuerza con la fuerza de los demás.',
        },
      ],
    },
    {
      id: 'empatia_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'REFLEXIÓN FINAL DE LA RUTA',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/REFLEXIONRUTA.mp3',
          prompts: [
            '<p>Has recorrido un camino valiente: el de poner límites con respeto, firmeza y cuidado. Tal vez no haya sido fácil. Quizás has tenido que enfrentar viejas culpas, miedos o dudas. Pero también has recuperado algo valioso: tu voz. Ahora te invito a hacer una pausa y mirar hacia dentro. No para exigirte más, sino para reconocer todo lo que ya has practicado. Escribe con honestidad y sin exigencias:</p>',
            '<p>Preguntas para tu cuaderno emocional:</p>',
            '<ul><li>¿Qué me ha revelado esta ruta sobre mi forma de relacionarme?</li><li>¿Qué barreras me he atrevido a cruzar para ser más auténtico/a?</li><li>¿Qué quiero empezar a hacer diferente en mis relaciones?</li><li>¿Qué vínculo me gustaría cultivar desde un lugar más sano y más yo?</li><li>¿Qué me recordaré cuando sienta miedo de decepcionar por ser quien soy?</li></ul>'
          ]
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: 'https://workwellfut.com/audios/ruta5/descripciones/RESUMENRUTA.mp3'
        },
        {
          type: 'list',
          items: [
            'La autenticidad es la base de cualquier relación que nutre de verdad.',
            'La empatía se entrena: no es adivinar, es escuchar y validar sin juzgar.',
            'Poner límites con firmeza y cuidado no rompe los vínculos, los fortalece.',
            'Es sano sostener la incomodidad emocional tras decir “no”.',
            'Los vínculos más valiosos se construyen con presencia, escucha y coherencia.',
            'Puedes elegir con quién construir… y también cómo eliges estar tú en esa relación.'
          ]
        },
        {
          type: 'quote',
          text: 'Poner un límite no me aleja. Me acerca a lo que soy. Y cada vez que lo hago con respeto, me convierto en un lugar seguro para mí mismo/a y para los demás.'
        }
      ]
    }
  ]
};

    


    

    

  

    