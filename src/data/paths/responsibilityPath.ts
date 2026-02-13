
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const responsibilityPath: Path = {
  id: 'ni-culpa-ni-queja',
  title: 'Ni Culpa Ni Queja: Responsabilidad Activa',
  description: 'Aprende a distinguir lo que depende de ti, a transformar la queja en acción y a elegir la responsabilidad activa sin caer en el autoabandono.',
  dataAiHint: 'responsibility guilt action',
  audioUrl: '/audios/ruta10/sesion1/Introruta10.mp3',
  modules: [
    {
      id: 'resp_sem1',
      title: 'Semana 1: Diferencia entre Culpa, Queja y Responsabilidad',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te has pillado quejándote una y otra vez de lo mismo, o castigándote mentalmente por algo que hiciste hace tiempo?\nEsta semana aprenderás a diferenciar la culpa que te impulsa a reparar de la que solo te paraliza, a entender qué papel juega la queja en tu vida y a descubrir que la responsabilidad activa es el camino para recuperar tu poder de acción.',
          audioUrl: '/audios/ruta10/sesion1/Introsesion1ruta10.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El punto de partida: tres caminos ante un mismo problema',
          audioUrl: '/audios/ruta10/sesion1/Audio1sesion1ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Todos y todas, cuando nos enfrentamos a un problema, solemos reaccionar de forma casi automática. Es como si tuviéramos tres carreteras delante y, sin pensar mucho, eligiéramos una de ellas.\n\nEn psicología, observamos que esas “carreteras” suelen ser:\n\n- Culpa: me enfoco en que todo es mi culpa y me quedo atrapado o atrapada en el autocastigo.\n- Queja: señalo todo lo que está mal fuera de mí, pero no paso a la acción.\n- Responsabilidad activa: identifico qué parte depende de mí y actúo en consecuencia.\n\nLas dos primeras parecen distintas, pero tienen algo en común: nos dejan atascados. La tercera, en cambio, nos impulsa a avanzar… siempre que sepamos cómo aplicarla.\n\nEsta semana vamos a entrenar ese tercer camino. No se trata de cargar con todo, sino de asumir tu parte con claridad, soltar lo que no es tuyo y dar pasos reales.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'La culpa: cuando ayuda y cuando nos hunde',
          audioUrl: '/audios/ruta10/sesion1/Audio2sesion1ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Imagina que la culpa es como una alarma. Suena cuando percibes que has hecho algo mal o que no has hecho lo suficiente.\n\nSi está bien calibrada, es útil: te motiva a reparar el daño, pedir perdón o aprender algo nuevo.\n\nSi está desajustada, suena constantemente, incluso por cosas que no dependen de ti. Ahí deja de ayudarte y empieza a hundirte.\n\nEn psicología distinguimos dos formas de culpa:\n\n- Culpa útil: centrada en la acción reparadora. Ejemplo: “Me equivoqué en el informe, lo corregiré y avisaré.”\n- Culpa improductiva: centrada en el ataque personal. Ejemplo: “Soy un desastre, siempre fallo.”\n\nEs importante diferenciarla de la vergüenza:\n\n- Culpa = “He hecho algo mal” (foco en la conducta).\n- Vergüenza = “Soy malo/a” (foco en la identidad).\n\nCuando distingues hecho de identidad y pones nombre a la emoción, tu cerebro activa regiones de autorregulación (Lieberman, 2007), lo que reduce la intensidad emocional y mejora tu claridad mental.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'La queja: alivio rápido, bloqueo largo',
          audioUrl: '/audios/ruta10/sesion1/Audio3sesion1ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Quejarse es como abrir una válvula de escape: alivia durante unos minutos, pero si no va acompañada de acción, nada cambia.\n\nMuchas quejas se alimentan de distorsiones cognitivas como:\n\n- Sobregeneralización: “Siempre me pasa lo mismo.”\n- Pensamiento dicotómico: “Nunca me tienen en cuenta.”\n- Deberías rígidos: “Esto no debería ser así.”\n\nEl problema es que la queja nos coloca en un papel pasivo: esperamos que otros cambien o que la situación se arregle sola.\n\nEsto no significa que esté prohibido quejarse —a veces es un desahogo necesario—, pero es importante aprender a no instalarnos ahí. En esta ruta, entrenaremos a transformar quejas en pasos concretos que nos devuelvan el control.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'La responsabilidad activa: el punto medio que funciona',
          audioUrl: '/audios/ruta10/sesion1/Audio4sesion1ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'La responsabilidad activa es la carretera central, la que combina realismo con acción.\n\nConsiste en reconocer tu parte, distinguir lo que está bajo tu control y actuar de manera proporcional. Ni perfeccionismo inalcanzable, ni resignación pasiva.\n\nLa pregunta clave aquí es:\n\n“¿Qué parte de esta situación sí está bajo mi influencia y qué puedo hacer hoy con ella?”\n\nTrabajar así fortalece tu autoeficacia (Bandura, 1977), es decir, la confianza en que tus acciones pueden producir cambios reales.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Las dos trampas que roban energía: hiperexigencia e hiperresponsabilidad',
          audioUrl: '/audios/ruta10/sesion1/Audio5sesion1ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: 'Incluso practicando la responsabilidad activa, hay dos desvíos frecuentes:\n\n- Hiperexigencia: imponer reglas internas imposibles (“Debo hacerlo perfecto siempre”), miedo extremo al error y comparación constante con los demás.\n- Hiperresponsabilidad: asumir como propia la culpa por todo, incluso por lo que sienten, piensan o hacen otras personas.\n\nAunque a veces parecen virtudes, en exceso agotan y llevan al bloqueo. El antídoto es simple en teoría, pero poderoso en la práctica:\n\n“¿Qué parte de esto sí depende de mí y qué parte no?”\n\nSoltar lo que no te corresponde es tan importante como hacerte cargo de lo que sí.',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Pasar de la queja a la acción: un método en 6 pasos',
          audioUrl: '/audios/ruta10/sesion1/Audio6sesion1ruta10.mp3',
          content: [{ type: 'paragraph', text: '<p>Conocer la teoría está bien, pero necesitamos herramientas prácticas. Este método sencillo te ayudará a transformar una queja en un paso concreto: </p>  <ol><li>Describe la situación: solo hechos, sin juicios. </li><li> Detecta tu pensamiento: “Es injusto”, “Siempre pasa igual”. </li><li> Cuestiónalo: ¿Qué pruebas tengo a favor y en contra de este pensamiento? (Cuestionamiento socrático) </li><li> Atribuye con realismo: ¿Qué parte es mía y cuál no? (Atribución realista) </li><li> Si pasara lo que temo, ¿qué haría? (Descatastrofización) </li><li> Definir un paso pequeño y concreto. <br> Ejemplo: “Arruiné esa oportunidad” → Hoy: “Pido feedback, hago una mejora y la pruebo en la próxima ocasión.”  </li></ol> </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Auto-chequeo rápido: ¿Dónde estoy ahora?',
          audioUrl: '/audios/ruta10/sesion1/Audio7sesion1ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Este ejercicio express te ayuda a ubicarte:\n\n- En culpa: me repito “es todo por mi culpa” y me castigo mentalmente.\n- En queja: me enfoco solo en lo que otros hacen mal o en lo injusta que es la situación.\n- En responsabilidad activa: identifico mi parte, pienso en soluciones y actúo.\n\nTruco rápido:\n\n“De todo esto, ¿qué 10–20% sí depende de mí?”\nEse porcentaje es tu punto de partida para la acción.' }],
        },
        {
          type: 'collapsible',
          title: 'Regularte para poder elegir mejor',
          audioUrl: '/audios/ruta10/sesion1/Audio8sesion1ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Cuando la emoción es muy intensa, el cerebro activa el sistema de amenaza (amígdala) y limita tu capacidad de pensar con claridad. Antes de decidir, regula:\n\n- Ponle nombre a la emoción: “Esto es frustración” o “Esto es culpa.”\n- Acepta su presencia: sin luchar contra ella.\n- Acción opuesta: si te apetece aislarte, da un paso para conectar; si quieres gritar, prueba a hablar más lento y bajo.\n- Convierte la queja en petición: en vez de “Siempre me interrumpes”, di “Necesito 10 minutos para explicar mi idea sin interrupciones.”' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          audioUrl: '/audios/ruta10/sesion1/Audio9sesion1ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Ahora ya tienes un mapa:\n\n- Sabes diferenciar culpa, queja y responsabilidad.\n- Reconoces las trampas de la hiperexigencia y la hiperresponsabilidad.\n- Cuentas con un método para pasar de la queja a la acción.\n\nEn las técnicas de esta semana, vamos a entrenar estos pasos de forma guiada, para que la teoría se convierta en hábitos reales y sostenibles.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'complaintTransformationExercise',
          title: 'EJERCICIO 1: TABLA “ME QUEJO DE… / LO QUE SÍ PUEDO HACER ES…”',
          objective: 'Quiero ayudarte a transformar tus quejas en pasos concretos que dependan de ti. Porque cuando cambias el “esto está mal” por un “esto es lo que haré”, recuperas tu poder y dejas de quedarte atascado o atascada en la frustración.',
          duration: '10 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana1tecnica1.mp3',
        },
        {
          type: 'guiltRadarExercise',
          title: 'EJERCICIO 2: MI RADAR DE CULPA',
          objective: 'Quiero ayudarte a detectar cuándo la culpa que sientes es una señal útil y cuándo es una carga que no te corresponde. Con este ejercicio vas a calibrar tu radar interno para diferenciar entre una culpa que te guía y una que solo te pesa.',
          duration: '5–7 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana1tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: '/audios/ruta10/sesion1/Reflexionsesion1ruta10.mp3',
          prompts: [
            '<ul><li>¿Qué descubrimiento ha tenido más impacto en ti y por qué?</li><li>¿En qué situación lograste pasar de la queja o la culpa a la acción?</li><li>¿Qué culpa identificaste como “no mía” y pudiste soltar?</li><li>¿Qué has descubierto sobre ti mismo/a al diferenciar culpa, queja y responsabilidad?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: '/audios/ruta10/sesion1/Resumensesion1ruta10.mp3' },
        {
          type: 'list',
          items: [
            'La culpa útil impulsa a reparar; la improductiva te paraliza.',
            'La queja sin acción desgasta y no resuelve.',
            'La responsabilidad activa se enfoca en lo que sí depende de ti.',
            'La hiperexigencia y la hiperresponsabilidad son trampas que desgastan.',
            'El cambio empieza preguntándote: “¿Qué parte de esto sí depende de mí?”',
          ],
        },
        { type: 'quote', text: 'Asumir tu parte no es cargar con todo. Es empezar a caminar con claridad.' },
      ],
    },
    {
      id: 'resp_sem2',
      title: 'Semana 2: Aceptar lo que Fue, Elegir lo que Sigue',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Notas que a veces, por más que pienses y repienses algo, no llegas a ninguna solución?\nEsta semana vas a practicar cómo cortar el circuito de la culpa improductiva, cómo cuestionar pensamientos rígidos y cómo abrir espacio para respuestas más constructivas.\nLa clave estará en pasar de rumiar a actuar con claridad y autocompasión.',
          audioUrl: '/audios/ruta10/sesion2/Introsesion2ruta10.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El punto de partida: del “¿por qué pasó?” al “¿qué hago ahora?”',
          audioUrl: '/audios/ruta10/sesion2/Audio1sesion2ruta10.mp3',
          content: [{ type: 'paragraph', text: 'En la semana anterior, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora damos un paso más: vamos a mirar hacia adentro, hacia esa voz interna que te habla todo el día… aunque a veces no te des cuenta.   Todos tenemos un diálogo interno. A veces es un susurro amable que nos impulsa; otras, un juez implacable que no deja pasar ni un fallo.    En psicología cognitivo-conductual sabemos que este diálogo influye directamente en nuestra motivación, en cómo gestionamos los errores y en la capacidad para aprender y avanzar. La neurociencia confirma que las palabras que nos decimos activan redes cerebrales relacionadas con la amenaza o con la calma, según su tono y contenido.   No podemos evitar que la mente nos hable, pero sí podemos entrenarla para que lo haga de una manera que nos ayude a crecer, no a castigarnos.' }],
        },
        {
          type: 'collapsible',
          title: 'Aceptación activa ≠ resignación',
          audioUrl: '/audios/ruta10/sesion2/Audio2sesion2ruta10.mp3',
          content: [
            { type: 'paragraph', text: 'En muchas personas, la palabra “aceptar” despierta resistencia porque la confunden con <b>resignarse</b>. Pero no son lo mismo.' },
            { type: 'list', items: ['Aceptar activamente es reconocer los hechos, tus emociones y pensamientos, sin resistencia ni juicio, para poder actuar con claridad.', 'Resignarse es decir “no hay nada que hacer” y quedarse inmóvil.'] },
            { type: 'paragraph', text: 'Idea clave: la aceptación activa abre caminos, la resignación los bloquea.  Ejemplo:' },
            { type: 'list', items: ['Resignación -> “Fallé en mi presentación, mejor no vuelvo a exponer.”', 'Aceptación activa → “Fallé, me duele, pero puedo aprender y prepararme mejor para la próxima.”'] },
            { type: 'paragraph', text: 'En términos de neurociencia, aceptar activa regiones del córtex prefrontal implicadas en la regulación emocional, mientras que la resignación deja la respuesta emocional más en manos de la amígdala, que reacciona con miedo o bloqueo.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'Separar pasado y presente: dos niveles distintos',
          audioUrl: '/audios/ruta10/sesion2/Audio3sesion2ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Aceptar implica reconocer lo ocurrido y dar al presente su propia oportunidad. El pasado nos aporta información, pero si lo dejamos dirigir el presente, actuaremos por miedo, culpa o costumbre, repitiendo patrones que ya no nos sirven. Ejemplo: “Hace un año no me seleccionaron para un proyecto” → Hoy, en lugar de callarme por miedo, puedo pedir feedback, ajustar mi propuesta y volver a intentarlo. En TCC trabajamos con esta separación porque ayuda a frenar la rumiación y a activar el modo solución en lugar del modo problema.' }],
        },
        {
          type: 'collapsible',
          title: 'Del automático a lo consciente (Modelo ABC)',
          audioUrl: '/audios/ruta10/sesion2/Audio4sesion2ruta10.mp3',
          content: [
            { type: 'paragraph', text: 'Muchos de nuestros bloqueos se mantienen porque respondemos en “piloto automático”, sin distinguir entre hechos y opiniones.' },
            { type: 'paragraph', text: 'Modelo ABC (SITUACIÓN – PIENSO – SIENTO – ACTÚO):' },
            { type: 'list', items: ['SITUACIÓN: lo que pasó, sin interpretaciones.', 'PIENSO: la interpretación que haces.', 'SIENTO: la emoción que surge.', 'ACTÚO: lo que haces a partir de ahí.'] },
            { type: 'paragraph', text: 'Ejemplo:' },
            { type: 'list', items: ['SITUACIÓN: “No respondieron mi correo en 24 horas.”', 'PIENSO: “Les molesté / no me valoran.”', 'SIENTO: ansiedad, culpa.', 'ACTÚO: dejo de escribirles.'] },
            { type: 'paragraph', text: 'Este modelo, validado en TCC, ayuda a activar el córtex prefrontal para evaluar opciones, en vez de reaccionar solo desde el sistema de amenaza.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'De rumiar a decidir: cuestionamiento + solución de problemas',
          audioUrl: '/audios/ruta10/sesion2/Audio5sesion2ruta10.mp3',
          content: [{ type: 'paragraph', text: '<p>Aceptar lo que pasó es el primer paso; el siguiente es tomar decisiones útiles. </p>  <p>Técnica combinada:  <ol><li>¿Qué pruebas tengo a favor y en contra de este pensamiento? (Cuestionamiento socrático) </li><li> ¿Me ayuda este pensamiento a avanzar? </li><li> ¿Qué parte depende de mí y cuál no? (Atribución realista) </li><li> Si pasara lo que temo, ¿qué haría? (Descatastrofización) </li><li> Definir un paso pequeño y concreto. <br> Ejemplo: “Arruiné esa oportunidad” → Hoy: “Pido feedback, hago una mejora y la pruebo en la próxima ocasión.”  </li></ol> </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Experimentos conductuales y acción opuesta',
          audioUrl: '/audios/ruta10/sesion2/Audio6sesion2ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: '<p>Para cambiar creencias limitantes, no basta con pensarlo: <b>hay que ponerlo a prueba. </b></p><p><b>Experimento conductual</b>: acción pequeña para verificar si tu creencia es cierta. </p><b>Acción opuesta</b>: hacer lo contrario a lo que la emoción te impulsa. </p><p>Ejemplo: <br>Creencia: “Si hablo, molesto.” <br>Experimento: pedir turno de palabra una vez y observar la reacción real. <br></p>Según la neurociencia, este tipo de exposición rompe asociaciones miedo–acción y refuerza redes neuronales más adaptativas. ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Soltar la culpa del pasado',
          audioUrl: '/audios/ruta10/sesion2/Audio7sesion2ruta10.mp3',
          content: [
            {
              type: 'paragraph',
              text: '<p>Pasos para transformar culpa improductiva en aprendizaje: </p><ol><li>Aceptar el hecho: ocurrió. </li><li>Separar conducta de identidad: no eres tu error. </li><li>Reparar si es posible. </li><li>Aprender: definir qué harás diferente. </li><li>Soltar lo que no depende de ti. </li></ol><p>Ejemplo: “Hablé con brusquedad” → Me disculpo, busco mejorar y dejo de repetirme que “soy una mala persona.” </p>',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Mindfulness y defusión cognitiva',
          audioUrl: '/audios/ruta10/sesion2/Audio8sesion2ruta10.mp3',
          content: [{ type: 'paragraph', text: 'El mindfulness te ayuda a observar pensamientos como eventos mentales pasajeros. Ejemplo: en vez de “Arruiné todo”, decirte: “Estoy teniendo el pensamiento de que arruiné todo.” Esto crea distancia psicológica (defusión) y reduce la intensidad emocional. Solo 3–5 minutos diarios de respiración consciente y etiquetado emocional fortalecen esta habilidad.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          audioUrl: '/audios/ruta10/sesion2/Audio9sesion2ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Aceptar lo que fue no te ata, te libera: te da espacio para elegir el siguiente paso en vez de quedarte luchando contra lo inevitable. Esta semana entrenarás: Escritura compasiva y orientada al presente → “Eso pasó. ¿Y ahora qué?” Práctica guiada de autoaceptación → Soltar el juicio y dar un paso útil.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'acceptanceWritingExercise',
          title: 'EJERCICIO 1: ESO PASÓ. ¿Y AHORA QUÉ?',
          objective: 'Usar la escritura para poner en orden lo que pasó, soltar el juicio y convertir el pasado en un punto de partida, no en una condena.',
          duration: '10–12 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana2tecnica1.mp3',
        },
        {
          type: 'selfAcceptanceAudioExercise',
          title: 'EJERCICIO 2: PRÁCTICA DE AUTOACEPTACIÓN GUIADA',
          objective: 'Entrenar la autoaceptación para reconocer lo que pasó sin castigo, tratándote con la misma amabilidad que tendrías con alguien querido.',
          duration: '7–10 min',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: '/audios/ruta10/sesion2/Reflexionsesion2ruta10.mp3',
          prompts: ['<ul><li>¿Qué culpa del pasado has soltado o disminuido?</li><li>¿Qué has descubierto sobre ti al separar hechos de juicios?</li><li>¿Qué situación de esta semana te permitió poner en práctica la aceptación activa?</li></ul>'],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: '/audios/ruta10/sesion2/Resumensesion2ruta10.mp3' },
        {
          type: 'list',
          items: ['Aceptar no es resignarse: la aceptación activa abre posibilidades; la resignación las bloquea.', 'Separar pasado y presente te da libertad para decidir.', 'Los hechos y los juicios no son lo mismo: detectarlos cambia tu forma de actuar.', 'Soltar la culpa implica reparar cuando se puede, aprender y dejar ir lo que no depende de ti.', 'Mindfulness y defusión bajan la intensidad emocional.'],
        },
        { type: 'quote', text: 'Lo que pasó no define lo que harás ahora. Eso lo eliges tú.' },
      ],
    },
    {
      id: 'resp_sem3',
      title: 'Semana 3: Cultiva una Voz Interna que Impulsa',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Tu voz interna suele sonar más como un juez que como un entrenador?\\nEsta semana aprenderás a escuchar lo que tu crítica interna intenta lograr y a traducirlo en un lenguaje responsable y empático. Descubrirás que la autorresponsabilidad compasiva no se trata de exigirte más, sino de motivarte mejor.',
          audioUrl: '/audios/ruta10/sesion3/Introsesion3ruta10.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'De la culpa al impulso: el poder de tu voz interna',
          audioUrl: '/audios/ruta10/sesion3/Audio1sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'En las semanas anteriores, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora damos un paso más: vamos a mirar hacia adentro, hacia esa voz interna que te habla todo el día… aunque a veces no te des cuenta.   Todos tenemos un diálogo interno. A veces es un susurro amable que nos impulsa; otras, un juez implacable que no deja pasar ni un fallo.    En psicología cognitivo-conductual sabemos que este diálogo influye directamente en nuestra motivación, en cómo gestionamos los errores y en la capacidad para aprender y avanzar. La neurociencia confirma que las palabras que nos decimos activan redes cerebrales relacionadas con la amenaza o con la calma, según su tono y contenido.   No podemos evitar que la mente nos hable, pero sí podemos entrenarla para que lo haga de una manera que nos ayude a crecer, no a castigarnos.' }],
        },
        {
          type: 'collapsible',
          title: '¿Por qué a veces somos tan duros con nosotros mismos?',
          audioUrl: '/audios/ruta10/sesion3/Audio2sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Esa voz crítica interna no aparece por casualidad. Suele formarse a partir de experiencias pasadas, mensajes que recibimos de figuras importantes o incluso expectativas sociales que hemos interiorizado.   En TCC llamamos a estos patrones pensamientos automáticos: surgen de forma rápida y sin filtro, muchas veces repitiendo creencias aprendidas sin cuestionarlas.   Ejemplo: si en el colegio te decían “podrías hacerlo mejor” cada vez que cometías un error, es posible que hoy tu mente te repita algo parecido cuando las cosas no salen como esperabas.   El problema no es detectar un error, sino cómo lo hacemos. Una crítica dura y global (“soy un desastre”) no deja espacio para mejorar; una observación específica y constructiva (“esta vez no salió como quería, voy a probar otra forma”) abre la puerta al cambio.' }],
        },
        {
          type: 'collapsible',
          title: 'La diferencia entre responsabilidad y autoexigencia destructiva',
          audioUrl: '/audios/ruta10/sesion3/Audio3sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Asumir responsabilidades es reconocer nuestra parte en una situación y decidir actuar para mejorar. La autoexigencia destructiva, en cambio, es exigirse sin tener en cuenta los propios límites, castigándose por no alcanzar estándares poco realistas.   La investigación en psicología motivacional muestra que la autocompasión —entendida como tratarnos con la misma comprensión que a un amigo— favorece el aprendizaje y la persistencia mucho más que la autocrítica severa. Kristin Neff, referente en este campo, lo resume así: “La autocompasión es el antídoto contra la autocrítica que paraliza”.   Piensa en esto:   Responsabilidad: “Me equivoqué en la presentación. Voy a repasar el material para la próxima vez.”   Autoexigencia destructiva: “Siempre lo hago mal. No sirvo para esto.”   La primera frase abre posibilidades; la segunda te encierra.' }],
        },
        {
          type: 'collapsible',
          title: 'El impacto real del diálogo interno en tu cerebro y tu cuerpo',
          audioUrl: '/audios/ruta10/sesion3/Audio4sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'La neurociencia ha comprobado que las palabras que nos decimos activan distintas redes neuronales:   Un lenguaje interno amenazante estimula la amígdala, generando respuesta de estrés y aumentando cortisol.   Un lenguaje interno amable activa el córtex prefrontal, facilitando la autorregulación y la toma de decisiones.   Esto significa que no es solo un tema emocional: es físico. Hablarte mal no solo te desalienta, también reduce tu capacidad de pensar con claridad. En cambio, un tono interno responsable y compasivo no ignora los errores, pero los aborda desde la calma, favoreciendo soluciones más efectivas.' }],
        },
        {
          type: 'collapsible',
          title: 'De juez a guía: el cambio que necesitas',
          audioUrl: '/audios/ruta10/sesion3/Audio5sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Imagina que tienes un entrenador personal que te acompaña cada día. Si te gritara y te humillara cada vez que fallas, ¿cuánto tardarías en perder motivación? Ahora imagina que ese entrenador te corrige, pero también reconoce tus avances y te anima a intentarlo de nuevo.   Ese entrenador eres tú. Y hoy vamos a entrenar tu voz interna para que pase de juez severo a guía firme y alentador. No se trata de evitar la responsabilidad ni de “endulzarlo todo”, sino de decir las cosas de forma que te ayuden a actuar.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente hacia las técnicas',
          audioUrl: '/audios/ruta10/sesion3/Audio6sesion3ruta10.mp3',
          content: [{ type: 'paragraph', text: 'En esta semana aprenderás a identificar cuándo tu voz interna está frenando tu crecimiento y a transformarla en una aliada. Descubrirás que ser responsable no significa castigarte, y que puedes exigirte sin perder el respeto por ti mismo o por ti misma.   Ahora pasaremos a las técnicas, donde pondrás en práctica estrategias concretas para:   Definir cómo quieres hablarte cuando las cosas no salgan como esperabas.   Reformular críticas internas en guías constructivas que te impulsen.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'compassionateResponsibilityContractExercise',
          title: 'EJERCICIO 1: MI CONTRATO DE AUTORRESPONSABILIDAD COMPASIVA',
          objective: 'Crear un compromiso interno que combine la autorresponsabilidad con la autocompasión, dándote un marco claro para responder a tus errores.',
          duration: '10–15 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana3tecnica1.mp3',
        },
        {
          type: 'criticismToGuideExercise',
          title: 'EJERCICIO 2: TRANSFORMA TU CRÍTICA EN GUÍA',
          objective: 'Convertir tu voz crítica en una guía útil que te ayude a mejorar sin hundirte, manteniendo la exigencia sana pero eliminando el castigo.',
          duration: '8–10 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana3tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: '/audios/ruta10/sesion3/Reflexionsesion3ruta10.mp3',
          prompts: ['<ul><li>¿Qué descubrimiento ha tenido más impacto en ti?</li><li>¿Cómo cambió tu forma de actuar al suavizar la crítica interna?</li><li>¿En qué momento reciente aplicaste una respuesta más compasiva contigo?</li></ul>'],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: '/audios/ruta10/sesion3/Resumensesion3ruta10.mp3' },
        {
          type: 'list',
          items: ['Aceptar no es resignarse: la aceptación activa abre posibilidades; la resignación las bloquea.', 'Separar pasado y presente te da libertad para decidir.', 'Los hechos y los juicios no son lo mismo: detectarlos cambia tu forma de actuar.', 'Soltar la culpa implica reparar cuando se puede, aprender y dejar ir lo que no depende de ti.', 'Mindfulness y defusión bajan la intensidad emocional.', 'La autocrítica puede ayudarte si la transformas en guía responsable y empática.', 'Identificar la intención oculta de tu crítica interna fortalece la autorresponsabilidad compasiva y tu resiliencia.'],
        },
        { type: 'quote', text: 'Hablarme con respeto no me debilita, me prepara para avanzar con fuerza y claridad.' },
      ],
    },
    {
      id: 'resp_sem4',
      title: 'Semana 4: Hazte Cargo sin Perderte de Vista',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Sientes que a veces asumes demasiado y terminas agotado o agotada?\\nEsta semana vas a aprender a comprometerte con lo que sí depende de ti, sin cargar con lo que no. Trabajarás en proteger tu energía, definir tu zona de influencia y mantener tu responsabilidad como una elección que te impulsa, no como una carga que te rompe.',
          audioUrl: '/audios/ruta10/sesion4/Introsesion4ruta10.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'De cargar con todo a elegir con intención',
          audioUrl: '/audios/ruta10/sesion4/Audio1sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: 'En las semanas anteriores, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora vamos a integrar todo para dar un paso clave: hacernos cargo sin perdernos de vista.   Esto significa actuar desde la responsabilidad activa —lo que depende de ti— sin absorber culpas, tareas o problemas que no te pertenecen.   La clave está en elegir dónde pones tu energía, en lugar de repartirla de forma automática.   Ejemplo:   Cargar con todo: “Si no me ocupo de esto, nadie lo hará, así que lo hago, aunque esté agotado/a.”   Elegir con intención: “Esto sí lo puedo transformar, y esto otro no me corresponde. Decido dónde actuar y dónde soltar.”' }],
        },
        {
          type: 'collapsible',
          title: 'La sostenibilidad emocional de la responsabilidad',
          audioUrl: '/audios/ruta10/sesion4/Audio2sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: 'La responsabilidad mal entendida puede llevar al agotamiento, la frustración y el resentimiento. Para que sea sostenible, necesitamos un equilibrio entre implicarnos y cuidarnos.   La neurociencia muestra que el cerebro necesita alternar periodos de activación y descanso para mantener la motivación y la claridad mental (Peters et al., 2017). Cuando nos hacemos cargo de todo, el sistema nervioso entra en estrés crónico y eso afecta al juicio, a la memoria y a la regulación emocional.   Idea clave: Responsabilidad no es cargar con más, es actuar mejor.' }],
        },
        {
          type: 'collapsible',
          title: 'Esto no me corresponde / Esto sí lo puedo transformar',
          audioUrl: '/audios/ruta10/sesion4/Audio3sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Un error común es pensar que ser responsables significa asumir cualquier problema cercano.   La realidad es que hay cosas que no dependen de nosotros y que, si intentamos controlarlas, solo generamos desgaste y frustración.   Separar lo que sí y lo que no te corresponde es un acto de autocuidado y de claridad mental.   Ejemplo:   No me corresponde: las decisiones ajenas, el clima, las emociones que otros no quieren trabajar.   Sí puedo transformar: mi forma de comunicarme, mis hábitos, mi manera de responder a lo que ocurre.' }],
        },
        {
          type: 'collapsible',
          title: 'El mapa de la influencia real',
          audioUrl: '/audios/ruta10/sesion4/Audio4sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: '<p>Imagina tu vida como tres círculos concéntricos: </p>1 - <b>Zona de control directo</b> – Lo que depende solo de ti (acciones, actitudes, elecciones). <br>2 - <b>Zona de influencia</b> – Lo que puedes impactar, pero no decidir por completo (relaciones, trabajo en equipo). <br>3 - <b>Zona fuera de tu control</b> – Lo que no puedes cambiar (pasado, clima, decisiones ajenas). <br><p>Concentrarte en la <b>zona de control directo</b> y parte de tu <b>zona de influencia</b> multiplica tu eficacia y protege tu energía. <br>Ejemplo: Si tu equipo no entrega a tiempo, no puedes controlar sus decisiones, pero sí <b>puedes</b>: </p>- Comunicar plazos claros.<br> - Pedir reuniones de seguimiento.<br> - Ajustar tu parte para prevenir retrasos. <br>' }],
        },
        {
          type: 'collapsible',
          title: 'Compromiso con una vida elegida, no impuesta',
          audioUrl: '/audios/ruta10/sesion4/Audio5sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: '<p>Hacerse cargo no es vivir a la defensiva, apagando fuegos. Es <b>diseñar una vida en la que tus acciones reflejen lo que valoras</b>. </p><p>Cuando actúas así, dejas de vivir para cumplir expectativas ajenas y empiezas a construir desde dentro. </p><p>Ejemplo: <br>- Vida impuesta: “Tengo que estar disponible siempre, o decepcionaré a los demás.”<br>- Vida elegida: “Estoy disponible en estos horarios, y fuera de ellos descanso y recargo energía para dar lo mejor de mí.” </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Cuidarte también es tu responsabilidad',
          audioUrl: '/audios/ruta10/sesion4/Audio6sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: 'La autorresponsabilidad también implica proteger tu energía física, mental y emocional.   En TCC y psicología positiva, el autocuidado no es un lujo: es la base para responder con claridad y sostener tus compromisos a largo plazo.   Cuando te pierdes de vista, la responsabilidad se vuelve una carga que agota y bloquea; cuando te cuidas, se convierte en una elección que impulsa y da estabilidad.   Ejemplos:   Asumir un reto durmiendo poco → más estrés y menos rendimiento.   Priorizar descanso y pausas → más energía, enfoque y mejores decisiones.   Cuidarte es asegurar que podrás seguir eligiendo y actuando mañana.   Recuerda: si te pierdes de vista, tu responsabilidad se convierte en una carga que te rompe, no en una elección que te impulsa.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          audioUrl: '/audios/ruta10/sesion4/Audio7sesion4ruta10.mp3',
          content: [{ type: 'paragraph', text: 'Esta semana vas a trabajar dos ejercicios clave para reforzar esta habilidad:<br><b>Rueda de mi zona de influencia</b> – para visualizar y delimitar lo que sí y lo que no te corresponde. <br><b>Mi declaración de compromiso personal</b> – para definir en tres frases cómo quieres vivir desde la responsabilidad activa y cuidarte en el proceso. <br>La responsabilidad que eliges es más ligera que la culpa que arrastras. \\nAhora vamos a entrenarla. ' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'influenceWheelExercise',
          title: 'EJERCICIO 1: RUEDA DE MI ZONA DE INFLUENCIA',
          objective: 'Diferenciar lo que depende de ti de lo que no, para que inviertas tu tiempo y fuerza en lo que realmente puedes transformar. Así reduces frustración y recuperas foco.',
          duration: '10–15 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana4tecnica1.mp3',
        },
        {
          type: 'personalCommitmentDeclarationExercise',
          title: 'EJERCICIO 2: MI DECLARACIÓN DE COMPROMISO PERSONAL',
          objective: 'Definir en tres frases clave cómo quieres vivir desde la responsabilidad activa, con equilibrio y autocuidado. Serán tu ancla emocional y tu guía diaria.',
          duration: '5–10 min',
          audioUrl: '/audios/ruta10/tecnicas/Ruta10semana4tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: '/audios/ruta10/sesion4/NUEVAReflexionsesion4ruta10.mp3',
          prompts: ['<p>Esta semana has explorado qué significa hacerte cargo de tu vida sin convertir la responsabilidad en una carga que te desgasta. </p><p>Has aprendido a distinguir entre lo que está dentro de tu círculo de influencia y lo que no, y a comprometerte con decisiones que respeten tus límites y tu energía. </p><p>Piensa ahora en cómo este enfoque puede transformar tu manera de actuar y de cuidarte. </p> <p><b>Preguntas para reflexionar:</b></p><ul><li>¿Qué descubrimiento de esta semana ha sido más revelador para ti sobre la forma en que asumes la responsabilidad?</li><li>¿En qué situaciones recientes has podido decir “esto no me corresponde” y sentirte en paz con ello?</li><li>¿Cómo ha cambiado tu forma de hablarte a ti mismo o a ti misma después de realizar las técnicas propuestas?</li><li>¿Qué compromisos nuevos quieres mantener a partir de ahora para cuidar de ti mientras te haces cargo de lo que sí depende de ti?</li></ul>'],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: '/audios/ruta10/sesion4/Resumensesion4ruta10.mp3' },
        {
          type: 'list',
          items: [
            'Hacerse cargo no significa cargar con todo, sino elegir dónde actuar de forma consciente.',
            'Distinguir entre lo que depende de ti y lo que no protege tu energía y te permite actuar con claridad.',
            'La autorresponsabilidad sostenible se apoya en límites claros, autocuidado y decisiones intencionadas.',
            'La Rueda de mi zona de influencia te ayuda a visualizar qué merece tu energía y qué puedes soltar.',
            'Tu Declaración de compromiso personal consolida tu decisión de actuar desde la responsabilidad activa y cuidarte en el proceso.',
          ],
        },
        { type: 'quote', text: 'La responsabilidad que eliges es más ligera que la culpa que arrastras.' },
      ],
    },
    {
      id: 'resp_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión final de la Ruta',
          audioUrl: '/audios/ruta10/sesion4/Reflexionfinalruta10.mp3',
          prompts: [
            '<p>A lo largo de estas semanas, has explorado cómo dejar de vivir desde la culpa o la queja, y cómo pasar a la responsabilidad activa. Has aprendido a diferenciar lo que puedes cambiar de lo que no, a cuestionar pensamientos que te frenaban, a transformar la autocrítica en guía y a cuidar tu energía mientras te haces cargo de tu vida.</p><p>Piensa ahora:</p><ul><li>¿Qué cambio has notado en tu forma de responder ante un error o una situación injusta?</li><li>¿Cuál ha sido tu mayor descubrimiento sobre ti mismo o ti misma en relación con la responsabilidad?</li><li>¿Qué compromiso concreto quieres llevarte de aquí para tu vida diaria?</li></ul>',
          ],
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: '/audios/ruta10/sesion4/Resumenfinalruta10.mp3',
        },
        {
          type: 'list',
          items: [
            'La culpa útil impulsa a reparar; la improductiva te paraliza.',
            'La queja sin acción desgasta y no resuelve.',
            'La responsabilidad activa te conecta con tu poder de influencia.',
            'El cuestionamiento socrático y la acción opuesta rompen la rumiación.',
            'Transformar la autocrítica en guía fortalece la confianza y la resiliencia.',
            'Cuidar tu energía es parte de la responsabilidad contigo.',
            'Definir tu zona de influencia te ayuda a no cargar con lo que no te corresponde.',
          ],
        },
        { type: 'quote', text: 'Cuando eliges responder con responsabilidad activa, dejas de ser espectador o espectadora de tu vida y te conviertes en su protagonista.' },
      ],
    },
  ],
};
