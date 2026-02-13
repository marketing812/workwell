
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const uncertaintyPath: Path = {
  id: 'tolerar-incertidumbre',
  title: 'Tolerar la Incertidumbre con Confianza',
  description: 'Aprende a convivir con lo incierto sin perder el equilibrio, transformando el control en confianza y la ansiedad en calma consciente.',
  dataAiHint: 'uncertainty trust mindfulness',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Introruta2.mp3`,
  modules: [
    {
      id: 'incertidumbre_sem1',
      title: 'Semana 1: Entiende qué es la Incertidumbre y cómo la vivo',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { 
            type: 'paragraphWithAudio', 
            text: '¿Te ha pasado que cuanto menos sabes sobre algo, más te preocupas? Esta semana te acompaño a comprender qué es la incertidumbre, por qué tu cuerpo y tu mente reaccionan con incomodidad cuando no tienes el control, y cómo puedes empezar a relacionarte con lo incierto desde un lugar más flexible y sereno.\nNo se trata de eliminar la incertidumbre, sino de aprender a sostenerla sin que dirija tu vida.',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/entiendequeeslaincertidumbreycomolavivo.mp3`
        },
        { 
            type: 'title', 
            text: 'Psicoeducación'
        },
        {
          type: 'collapsible',
          title: '¿Qué es la incertidumbre?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/queeslaincertidumbre.mp3`,
          content: [
            { type: 'paragraph', text: 'La incertidumbre es la ausencia de certezas. Es no saber qué va a pasar. Y aunque todos la experimentamos, no siempre sabemos sostenerla sin malestar. A veces hay un riesgo real, pero muchas otras veces lo que sentimos es ambigüedad, imprevisibilidad o simplemente falta de información clara.\nNuestro cerebro —diseñado para anticiparse y protegernos— interpreta esa falta de claridad como una posible amenaza. Y ahí empieza el malestar.' }
          ]
        },
        {
            type: 'collapsible',
            title: '¿Por qué nos cuesta tanto la incertidumbre?',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio3Ruta2Sesion1.mp3`,
            content: [
              { type: 'paragraph', text: 'Porque nuestro sistema emocional busca seguridad. Preferimos incluso una mala noticia conocida antes que quedarnos en el “no sé”.\nEstudios en neurociencia han demostrado que la incertidumbre activa el sistema de amenaza cerebral (en especial, la amígdala) de forma parecida a como lo haría un peligro real.\nCuando esto ocurre, muchas personas sienten:'},
              { type: 'list', items: ["Necesidad de controlarlo todo.","Pensamientos de anticipación (“¿Y si…?”).","Evitación de decisiones o situaciones inciertas."] }
            ]
        },
        {
          type: 'collapsible',
          title: 'La intolerancia a la incertidumbre',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio4Ruta2Sesion1.mp3`,
          content: [
            { type: 'paragraph', text: 'No es solo incomodidad. Es la creencia de que lo incierto es peligroso, insoportable o inmanejable.\nEsto suele dar lugar a un estilo de pensamiento rígido, perfeccionista y catastrofista, donde todo debe estar planificado y bajo control.\nEjemplos comunes:'},
            { type: 'list', items: ['“Necesito saber exactamente cómo va a salir esto.”','“Si no tengo respuestas claras, no puedo avanzar.”','“Prefiero no intentarlo antes que equivocarme.”']},
            { type: 'paragraph', text: 'Este patrón puede estar vinculado a experiencias pasadas de inseguridad, exigencia o trauma. Y aunque parezca protector, suele generar más ansiedad.' }
          ]
        },
        {
          type: 'collapsible',
          title: '¿Cómo reacciona tu cuerpo?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio5Ruta2Sesion1.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando enfrentas una situación incierta, tu cuerpo reacciona: el corazón se acelerada, se tensan los músculos, la mente se agita.\nEsto es adaptativo: tu cerebro intenta protegerte anticipando lo peor. Pero si esa respuesta se vuelve constante, vives en modo alerta, con un “radar” emocional encendido todo el tiempo.' }]
        },
        {
          type: 'collapsible',
          title: 'La alternativa: flexibilidad mental',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio6Ruta2Sesion1.mp3`,
          content: [
            { type: 'paragraph', text: 'No puedes eliminar la incertidumbre. Pero sí puedes fortalecer tu capacidad para adaptarte a ella sin quedarte paralizado/a.\nA esto lo llamamos flexibilidad cognitiva: pensar de forma más abierta, matizada y adaptativa.\nLa flexibilidad:'},
            { type: 'list', items: ['Se puede entrenar (no es un rasgo fijo).','Implica reinterpretar lo que pasa, sin necesidad de tenerlo todo claro.','Es la base de una regulación emocional más sólida.']}
          ]
        },
        { type: 'collapsible', title: 'En resumen…', content: [{ type: 'list', items: ['La incertidumbre es parte de la vida, pero muchas veces la vivimos como amenaza.','Nuestro cuerpo y mente tienden a sobreprotegernos cuando sentimos que no tenemos el control.','La intolerancia a la incertidumbre se manifiesta en necesidad de control, rigidez y evitación.','No puedes controlar todo, pero puedes aprender a moverte con flexibilidad.','Diferenciar entre lo que depende de ti y lo que no, alivia la ansiedad y te devuelve poder.']}] },
        { type: 'quote', text: 'No podemos eliminar la incertidumbre, pero sí podemos aprender a vivir con ella desde un lugar más flexible y sereno.' },
        { type: 'title', text: 'Técnicas Específicas'},
        { type: 'uncertaintyMapExercise', title: 'Ejercicio 1: Mi Mapa de la Incertidumbre', objective: 'Reconoce en qué áreas te afecta más la incertidumbre y cómo reaccionas. Al observarlo, podrás tomar decisiones más conscientes y recuperar calma.', duration: '5 a 8 minutos', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/tecnicas/Ruta2sesion1tecnica1.mp3`},
        { type: 'controlTrafficLightExercise', title: 'Ejercicio 2: El Semáforo del Control', objective: 'Diferencia entre lo que depende de ti, lo que puedes influir y lo que está fuera de tu control para enfocar tu energía en lo que sí puedes transformar.', duration: '6 a 9 minutos', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/tecnicas/Ruta2Semana1Tecnica2.mp3`},
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio9Ruta2Sesion1.mp3`, prompts: ['<ul><li>¿Qué intenté controlar esta semana que no estaba en mis manos?</li><li>¿Cómo me sentí al soltarlo?</li><li>¿Qué ideas me llevo sobre mi forma de vivir lo incierto?</li></ul>']},
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta2/descripciones/Audio10Ruta2Sesion1.mp3` },
        { type: 'list', items: ['La incertidumbre es parte de la vida, pero muchas veces la vivimos como amenaza.','Nuestro cuerpo y mente tienden a sobreprotegernos cuando sentimos que no tenemos el control.','La intolerancia a la incertidumbre se manifiesta en necesidad de control, rigidez y evitación.','No puedes controlar todo, pero puedes aprender a moverte con flexibilidad.','Diferenciar entre lo que depende de ti y lo que no, alivia la ansiedad y te devuelve poder.']},
        { type: 'quote', text: 'No necesitas tenerlo todo claro para avanzar. Solo confiar en tu capacidad para adaptarte, un paso cada vez.'}
      ]
    },
    {
      id: 'incertidumbre_sem2',
      title: 'Semana 2: Regular la Ansiedad ante lo Incierto',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [{"type":"paragraphWithAudio","text":"¿Te ha pasado que, cuando estás esperando algo importante o no sabes qué va a ocurrir, tu mente empieza a imaginar mil escenarios negativos?   En esta segunda semana vamos a trabajar precisamente en eso: en comprender por qué ocurre y cómo dejar de anticipar lo peor. No se trata de controlar cada detalle de tu vida, sino de descubrir que puedes vivir con más calma incluso cuando no tienes todas las respuestas.   Vas a entender cómo funciona la anticipación ansiosa y por qué tu cuerpo reacciona con alarma ante lo incierto, aunque no haya un peligro real.  Aprenderás a entrenar tu mente para frenar los pensamientos catastrofistas y a reconectar con el presente usando técnicas de exposición, regulación y atención plena.   También comenzarás a distinguir entre lo que tu mente imagina y lo que realmente está ocurriendo. Porque esta semana no se trata de eliminar la ansiedad, sino de reducir su poder sobre ti y ganar confianza paso a paso.","audioUrl":"https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2Sesion2.mp3"},{"type":"title","text":"Psicoeducación"},{"type":"collapsible","title":"¿Por qué imaginamos lo peor?","audioUrl":"https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1psicoeducpantalla1la%20ansiedad%20molesta.mp3","content":[{"type":"paragraph","text":"A veces, tu cuerpo reacciona con ansiedad sin que haya pasado nada realmente peligroso. Solo hace falta un pensamiento como “¿Y si me equivoco?” o “¿Y si esto sale mal?” para que tu mente entre en bucle y tu cuerpo se ponga en alerta.   Esto es lo que llamamos anticipación ansiosa: una forma de preocupación centrada en lo que podría pasar. Aunque sea solo imaginación, activa emociones, sensaciones y comportamientos como si el peligro fuera real."}]},{"type":"collapsible","title":"¿Cómo funciona la anticipación?","audioUrl":"https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1pantalla2ansiedadadPtativa.mp3","content":[{"type":"paragraph","text":"Desde la TCC y la neurociencia afectiva, sabemos que:   La preocupación es una cadena de pensamientos negativos sobre algo que normalmente no ha ocurrido, difíciles de controlar y que buscan prepararte para lo peor. Además, la preocupación te proporciona una falsa sensacion de control.   Pero en realidad, lo que consiguen estos pensamientos es activar el sistema de amenaza del cuerpo.   Esto puede generar síntomas como palpitaciones, tensión, insomnio o dificultad para concentrarse, incluso sin que la situación temida haya ocurrido."}]},{"type":"collapsible","title":"¿Te suenan estas ideas?","audioUrl":"https://workwellfut.com/audios/ruta13/semana1/Ruta13sem1pant3tusistnervioso.mp3","content":[{"type":"paragraph","text":"“¿Y si digo algo ridículo en la reunión?” “¿Y si enfermo justo antes del viaje?” “¿Y si se decepcionan conmigo?”   Estas frases no son inofensivas: cuando se repiten con frecuencia, entrenan a tu cuerpo para vivir en modo defensa constante."}]},{"type":"collapsible","title":"Tu sistema de amenaza: entre el miedo y la percepción","audioUrl":"https://workwellfut.com/audios/ruta2/descripciones/Audio3Ruta2Sesion2.mp3","content":[{"type":"paragraph","text":"Nuestro sistema nervioso tiene una función adaptativa: protegernos ante lo que percibimos como peligroso. Pero el problema es que no distingue bien entre peligro real —algo que está sucediendo— y mental —algo que podría pasar—.\n\nCuando anticipas algo negativo, tu cuerpo entra en modo defensa:\n\nSe activa una zona del cerebro llamada amígdala, que funciona como una alarma interna.\n\nEsta activación acelera el corazón, tensa los músculos y prepara al cuerpo para reaccionar rápido.\n\nAl mismo tiempo, se apaga o bloquea parcialmente la zona del cerebro que te ayuda a pensar con claridad (la corteza prefrontal), porque el cuerpo prioriza la supervivencia, no la reflexión.\n\nEs decir: tu cuerpo reacciona al “¿y si…?” como si ya estuviera ocurriendo. Te sientes inquieto/a, alerta, con dificultad para concentrarte o calmarte. Todo esto nace de un pensamiento como, por ejemplo: “¿Y si no puedo con esto?”"}]},{"type":"collapsible","title":"¿Qué activa mi sistema de amenaza?","audioUrl":"https://workwellfut.com/audios/ruta2/descripciones/semana2/queactivamisistemadeamenaza.mp3","content":[{"type":"paragraph","text":"Cuando te sientes ansioso o en alerta sin un peligro real delante, es porque tu mente o tu sistema nervioso han interpretado algo como una posible amenaza. Esto puede ocurrir por varios motivos:"},{"type":"collapsible","title":"Errores de pensamiento (Desplegable)","content":[{"type":"paragraph","text":"A veces, sin darte cuenta, caes en formas de pensar que distorsionan la realidad y aumentan el miedo. Por ejemplo:\n\nSobredimensionar el riesgo: Imaginas que algo es más peligroso de lo que realmente es. Ej.: “Si me equivoco, será un desastre”.\n\nImaginar consecuencias extremas: Das por hecho que el peor escenario va a suceder. Ej.: “Seguro que me rechazan y no podré con esto”.\n\nSentirte incapaz: Crees que no tienes recursos para afrontarlo. Ej.: “No voy a poder gestionarlo si algo sale mal”."}]},{"type":"collapsible","title":"Creencias aprendidas (Desplegable)","content":[{"type":"paragraph","text":"Detrás de esos pensamientos, a veces hay creencias más profundas que aprendiste con el tiempo (de tu entorno, de la infancia o de experiencias difíciles). Estas creencias te hacen interpretar muchas situaciones como peligrosas, aunque no lo sean realmente.\n\nAlgunas creencias comunes son:\n\n“No debo fallar nunca” → convierte cualquier error en un drama.\n\n“El mundo es peligroso” → te hace vivir en estado de alerta.\n\n“No puedo equivocarme” → te paraliza ante lo incierto."}]},{"type":"collapsible","title":"Neurocepción inconsciente (Desplegable)","content":[{"type":"paragraph","text":"Este es un concepto de la neurociencia muy importante: tu sistema nervioso evalúa todo lo que ocurre a tu alrededor sin que tú lo decidas de forma consciente. Percibe detalles como:\n\nEl tono de voz de alguien\n\nUna mirada o gesto\n\nUn recuerdo doloroso\n\nO simplemente un cambio en tu entorno\n\nY si interpreta alguna de esas señales como insegura, activa la alarma automáticamente. No es culpa tuya, es un sistema diseñado para protegerte. Pero muchas veces actúa por error."}]}]},{"type":"collapsible","title":"Herramientas para regular el sistema de amenaza","audioUrl":"https://workwellfut.com/audios/ruta2/descripciones/semana2/herramientaspararegular.mp3","content":[{"type":"collapsible","title":"Exposición progresiva (Desplegable)","content":[{"type":"paragraph","text":"Significa acercarte poco a poco a lo que hoy temes o evitas. No de golpe ni forzándote, sino con pasos realistas y gradu