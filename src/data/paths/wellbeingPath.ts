
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
export const wellbeingPath: Path = {
  id: 'volver-a-sentirse-bien',
  title: 'Volver a lo que me hace sentir bien',
  description: 'Reconecta con tus fuentes de bienestar, recupera rutinas que te sostienen y aprende a activar tu motivación incluso en los días más grises.',
  dataAiHint: 'wellbeing motivation energy',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Introruta12.mp3`,
  modules: [
    {
      id: 'bienestar_sem1',
      title: 'Semana 1: Reconecta con tus Fuentes de Bienestar',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'El ánimo bajo se alimenta de un círculo difícil: haces menos cosas que disfrutas → recibes menos placer → tu ánimo baja más. En esta primera semana aprenderás a romper ese ciclo recordando qué cosas, personas y lugares te recargan. Crearás tu propio mapa de gratificación emocional y empezarás a observar qué te da energía y qué te la quita en tu día a día. Así tendrás un punto de partida claro: saber a qué recurrir cuando tu batería se queda en rojo.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Introsesion1ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando tu batería se queda en rojo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio1sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: '¿Has tenido días en los que te sientes como un móvil con la batería al 5%? No importa cuánto descanses, parece que nada te recarga del todo. Estar bajo de ánimo es parecido: tu energía física, mental y emocional se apagan un poco. Lo que antes te motivaba ahora cuesta más, y hasta las cosas simples pueden parecer un esfuerzo enorme. Esta semana vamos a explorar cómo recargar esa batería sin depender de chispazos momentáneos, sino construyendo energía que dure.' }]
        },
        {
          type: 'collapsible',
          title: 'No todo malestar es igual: tristeza, ánimo bajo y depresión',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio2sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Imagina tres intensidades de “nubes” que pueden tapar tu cielo:' }, { type: 'list', items: ["Tristeza: nube pasajera, suele aparecer tras una pérdida o decepción. Se disipa con el tiempo o con apoyo.", "Estado de ánimo bajo: nubosidad persistente; no hay tormenta, pero el sol apenas asoma. Hay apatía, baja energía y menos disfrute.", "Depresión: tormenta prolongada e intensa; afecta a tu forma de pensar, sentir y actuar, e interfiere en tu vida diaria. Requiere intervención profesional."] }, { type: 'paragraph', text: 'En esta ruta trabajaremos el estado de ánimo bajo, esa fase intermedia que muchas veces pasa desapercibida… pero que, si la cuidamos, podemos revertir antes de que se intensifique.\n\nAhora que tienes claro de qué estamos hablando, vamos a ver de dónde suele venir este estado.' }]
        },
        {
          type: 'collapsible',
          title: 'De dónde viene el estado de ánimo bajo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio3sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'El ánimo no baja “porque sí”. Suele ser el resultado de varios hilos que se entrelazan:' }, { type: 'list', items: ["Eventos de vida y estrés: pérdidas, cambios importantes, problemas continuos.", "Manera de pensar: creencias aprendidas y patrones de pensamiento que amplifican lo negativo y minimizan lo positivo.", "Relaciones: entornos críticos, poco apoyo o vínculos que drenan tu energía.", "Factores biológicos: cambios en neurotransmisores como la serotonina o la dopamina, que afectan tu motivación y capacidad de disfrutar.", "Hábitos y estilo de vida: falta de sueño, poca actividad física, alimentación desequilibrada."] }, { type: 'paragraph', text: 'Además, el estado de ánimo bajo se alimenta de un doble vacío:\n- La sensación de poco dominio sobre tu vida: cuando sientes que no puedes influir en lo que pasa, tu motivación se apaga.\n- La falta de gratificaciones reales: cuando apenas hay momentos de disfrute o satisfacción, el cerebro recibe pocas señales de “esto vale la pena repetirlo”, y se instala la apatía.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué ocurre en tu cuerpo y tu mente',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio4sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: "Cuando el ánimo baja, no es solo cuestión de “pensar en positivo”." }, { type: 'list', items: ["Tu cerebro emocional (amígdala) envía señales de alerta constantes, activando tensión y cansancio.", "Tu cerebro pensante (corteza prefrontal) pierde un poco de claridad y energía para planificar o decidir.", "Tus músculos, tu respiración y tu postura cambian, enviando mensajes silenciosos de que “todo pesa más”."] }, { type: 'paragraph', text: 'Según la neurociencia afectiva, estos cambios forman un bucle: menos energía → menos acción → menos placer → más ánimo bajo.\nPara romperlo, necesitamos entender de dónde viene nuestra energía vital y cómo mantenerla.' }]
        },
        {
          type: 'collapsible',
          title: 'La energía vital: mucho más que no estar cansado/a',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio5sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Piensa en tu energía como en un fuego:' }, { type: 'list', items: ["Se alimenta de combustible físico (descanso, alimentación, movimiento).", "Necesita chispa emocional (momentos que te hagan sentir vivo/a).", "Y se mantiene con aire mental (propósitos, curiosidad, retos alcanzables)."] }, { type: 'paragraph', text: 'Sin alguno de estos elementos, la llama se reduce y el ánimo baja.\nIncluso acciones de solo 10 minutos —como salir a la luz natural o tener una conversación agradable— pueden avivar ese fuego.' }]
        },
        {
          type: 'collapsible',
          title: 'El espejismo de la gratificación inmediata',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio6sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando la batería está baja, buscamos enchufes rápidos: comer algo dulce, mirar redes, ver series sin parar…\nEsto es gratificación inmediata: placer rápido, pero que dura lo que un sorbo de café en un día de frío.\nEl bienestar sostenido, en cambio, es como encender una estufa que mantiene el calor mucho después: caminar, retomar un hobby, hablar con alguien que te importa.\nComo recuerda la Terapia Cognitivo-Conductual, las acciones que más levantan el ánimo suelen ser las que menos apetece hacer al principio.' }]
        },
        {
          type: 'collapsible',
          title: 'Tu cerebro también busca recompensas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio7sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Dentro de tu cabeza hay un sistema de recompensa que se activa no solo cuando consigues algo, sino también cuando lo anticipas.' }, { type: 'list', items: ["Dopamina: la chispa que te mueve a actuar.", "Núcleo accumbens: el radar de lo que puede hacerte sentir bien.", "Corteza prefrontal: la que decide si vas hacia lo que de verdad importa o hacia lo que solo alivia un rato."] }, { type: 'paragraph', text: 'Cuando eliges conscientemente actividades con sentido, entrenas a tu cerebro para pedir más de eso.\nY ese es el camino para reconectar con lo que antes te hacía bien.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué reconectar con lo que te hacía bien es clave',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio8sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'El estado de ánimo bajo te empuja a hacer menos → recibes menos placer → tu ánimo baja más.\nRomper ese círculo no siempre empieza con ganas; muchas veces empieza con acción consciente:' }, { type: 'list', items: ["Retomar algo que antes disfrutabas.", "Probar una versión más pequeña de una actividad que te gustaba.", "Buscar compañía que te aporte calma o risa."] }, { type: 'paragraph', text: '“No esperes a tener ganas para empezar; empieza, y las ganas llegarán después.” — Principio de activación conductual.' }]
        },
        {
          type: 'collapsible',
          title: 'Empezar por las actividades: un primer paso probado por la ciencia',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio9sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente suele decir: “No tengo fuerzas, primero necesito sentirme mejor para hacer cosas”.\nLa investigación en Terapia Cognitivo-Conductual muestra justo lo contrario: empezar a hacer cosas que te aportan placer o logro es uno de los primeros pasos más efectivos para mejorar el estado de ánimo, incluso en depresión.\nEs como encender una luz tenue en una habitación oscura: al principio no ilumina todo, pero te permite moverte, encontrar otros interruptores y, poco a poco, llenar la habitación de claridad.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'emotionalGratificationMapExercise', title: 'EJERCICIO 1: MAPA DE GRATIFICACIÓN EMOCIONAL', objective: 'Este ejercicio te ayudará a reconectar con tus fuentes de bienestar (actividades, personas o lugares) y a tener un mapa personal al que acudir cuando necesites recargar energía emocional.', duration: '7-10 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana1tecnica1.mp3` },
        { type: 'dailyEnergyCheckExercise', title: 'EJERCICIO 2: MINI-CHECK DE ENERGÍA DIARIA', objective: '¿Te has fijado en que hay días en los que terminas con más energía que otros, incluso haciendo cosas parecidas?    Esto ocurre porque, a lo largo de la jornada, hay actividades, personas y entornos que recargan tu batería y cuáles la gastan más rápido.   Este ejercicio te ayudará a identificar ambos tipos para que, poco a poco, puedas elegir más de lo que te suma y reducir lo que te drena. En pocas semanas, empezarás a ver patrones claros sobre qué cuidar y qué evitar.', duration: '3-5 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana1tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Reflexionssesion1ruta12.mp3`, prompts: ["<p>Esta semana hemos explorado de dónde viene nuestra energía y cómo podemos recargarla de forma más sostenible. Ahora es momento de parar, mirar atrás y anotar lo que descubriste en tu propio camino.</p><p><b>Preguntas para reflexionar y escribir:</b></p><ul><li>¿Qué he descubierto sobre mis niveles de energía y cómo suelo hacerme cargo de ellos?</li><li>¿Hubo algo que me sorprendiera al observar mi energía día a día?</li><li>¿Qué cosas identifiqué como “drenaje” y cómo puedo reducir su impacto?</li><li>Si tuviera que elegir una sola acción para mantener mi energía la próxima semana, ¿cuál sería?</li><li>¿Cómo puedo recordarme a mí mismo/a que no tengo que esperar a tener ganas para empezar a cuidarme?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Resumensesion1ruta12.mp3` },
        { type: 'list', items: ["El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales que podemos aprender a cuidar.", "Nuestra energía vital se sostiene en hábitos básicos, chispa emocional y dirección mental.", "Las gratificaciones rápidas (como redes, azúcar o maratones de series) alivian a corto plazo, pero no recargan a largo plazo.", "Reconectar con lo que antes nos hacía bien es una de las formas más potentes de romper el ciclo de ánimo bajo.", "Planificar y hacer actividades gratificantes, aunque no haya ganas al principio, es una estrategia validada por la ciencia para recuperar el ánimo."] },
        { type: 'quote', text: 'Cada paso que das para cuidar tu energía es una inversión en tu bienestar. No importa si es grande o pequeño: lo importante es que sigues encendiendo tu propia luz.' }
      ]
    },
    {
      id: 'bienestar_sem2',
      title: 'Semana 2: Recupera Rutinas que te Nutran',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'Cuando estamos bajos de ánimo, lo primero que suele romperse es lo más básico: dormir bien, comer con calma, mover el cuerpo. Esto aumenta el malestar y nos deja más vulnerables. Esta semana aprenderás a reinstalar pequeños rituales de cuidado —microhábitos físicos, emocionales y mentales— que actúan como anclas en tu día. No se trata de hacer todo perfecto, sino de tener gestos breves, amables y repetidos que te devuelvan estabilidad y energía.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Introsesion2ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando lo básico empieza a fallar',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio1sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: '¿Te ha pasado que, en momentos difíciles, lo primero que se desordena es lo que te sostiene?\nDormimos peor, comemos rápido, dejamos de movernos… y, sin darnos cuenta, el malestar crece.\nEsta semana vamos a volver a lo esencial: recuperar esas rutinas que te alimentan por dentro y por fuera, que estabilizan tus días y te devuelven energía. No hablamos de forzarte a hacer todo perfecto, sino de crear pequeños anclajes que te ayuden a sentirte más estable y con más fuerza para afrontar lo que venga.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutinas que son anclas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio2sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Las rutinas saludables no son simples tareas repetidas: son anclas emocionales que estabilizan tu día, regulan tu estado de ánimo y alimentan tu motivación. Desde la neurociencia del estrés sabemos que cuando cuidas lo básico —alimentación, descanso y movimiento— tu sistema nervioso interpreta que estás a salvo, lo que reduce la sobreactivación de la amígdala (la “alarma” emocional) y te ayuda a pensar con más claridad. Si además incluyes actividades que disfrutas y te hacen sentir logro —como caminar, bailar, cocinar algo rico o retomar un hobby—, activas circuitos de recompensa que liberan dopamina y serotonina, potenciando tu bienestar y tu motivación.' }]
        },
        {
          type: 'collapsible',
          title: 'El papel de las rutinas en tu equilibrio emocional',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio3sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Recuperar rutinas que te nutren no solo mejora tu energía física: fortalece tu estabilidad emocional. Las acciones que repites cada día actúan como un hilo conductor que te ayuda a mantener el rumbo incluso cuando hay turbulencias. Cuando estás en tus rutinas de cuidado: pones nombre a lo que sientes, aceptas sin juicio y eliges cómo responder. Esto te da más claridad y paz mental. Además, practicar habilidades como la asertividad, la solución de problemas o el mindfulness, según Jon Kabat-Zinn, reduce la reactividad automática y te ayuda a mantenerte centrado/a incluso en momentos difíciles.' }]
        },
        {
          type: 'collapsible',
          title: 'Cuando las rutinas se rompen',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio4sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'En momentos duros, solemos descuidar justo lo que más nos sostiene:' }, { type: 'list', items: ["Dormimos peor.", "Nos movemos menos.", "Comemos rápido o poco nutritivo."] }, { type: 'paragraph', text: 'Esto aumenta la vulnerabilidad física y emocional. En psicología lo llamamos un bucle de vulnerabilidad: cuanto peor te sientes, menos haces lo que te cuida, y cuanto menos te cuidas, peor te sientes.\n\nVolver a hábitos que nos cuidan no solo aporta estructura y previsibilidad: le devuelve a tu cuerpo y a tu mente la sensación de seguridad, y eso es la base para tomar mejores decisiones y recuperar energía.' }]
        },
        {
          type: 'collapsible',
          title: 'La fuerza de los pequeños pasos',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio5sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'La Terapia Cognitivo-Conductual y la psicología del hábito coinciden: no necesitas un cambio radical para notar mejoras.' }, { type: 'list', items: ["Moverte 10 minutos al día.", "Preparar un desayuno nutritivo.", "Reservar un rato para algo que disfrutas."] }, { type: 'paragraph', text: 'Estos gestos, aunque parezcan mínimos, generan una sensación de logro que alimenta tu motivación. En palabras de BJ Fogg, experto en hábitos, “el cambio se crea sintiéndote bien con lo que haces, no castigándote por lo que no haces”.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutina rígida vs. ritual de cuidado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio6sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'No todas las rutinas son iguales: algunas se vuelven rígidas y limitantes, mientras que otras actúan como un refugio flexible que te recarga.' },
            { type: 'list', items: ["Rutina rígida disfuncional → Inflexible, vivida como obligación, genera ansiedad ante cambios.  Ejemplo: “Tengo que correr 5 km todos los días o no vale la pena”.", "Ritual de cuidado → Intencional, flexible y enfocado en tu bienestar, adaptable a tus circunstancias.  Ejemplo: “Hoy no puedo correr, pero haré 15 minutos de estiramientos en casa”."] },
            { type: 'paragraph', text: 'Un ritual de cuidado no depende de que todo vaya bien para existir. Según la neurociencia del hábito, la flexibilidad y la asociación con emociones positivas aumentan la probabilidad de mantenerlo en el tiempo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Ideas para tus rituales de cuidado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio7sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'Aquí tienes inspiración para crear los tuyos:' },
            { type: 'list', items: ["Autorreforzarte: darte pequeños premios o autoelogios sinceros cuando cumples tu objetivo.", "Priorizar el placer diario: dar espacio a lo que te gusta sin sentir culpa.", "Actividades agradables y de dominio: que te den sensación de logro y satisfacción (cocinar algo nuevo, aprender una habilidad).", "Mindfulness y flexibilidad emocional: aceptar emociones y sensaciones sin juicio, dejando que pasen por sí solas."] },
            { type: 'paragraph', text: 'Recuerda que el objetivo no es “tachar tareas”, sino crear experiencias que nutran tu cuerpo, tu mente y tu ánimo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Tu misión esta semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio8sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'Identifica y recupera al menos una rutina que te nutra. Hazlo pequeño, realista y disfrutable.' },
            { type: 'paragraph', text: 'No se trata solo de “hacer cosas sanas”: se trata de reconectar con lo que de verdad te hace sentir bien y mantenerlo incluso en días difíciles.' },
            { type: 'paragraph', text: 'En las próximas técnicas aprenderás a elegirla, adaptarla y mantenerla como una aliada para tu bienestar, pase lo que pase.' }
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'dailyWellbeingPlanExercise', 
          title: 'EJERCICIO 1: MI PLAN DIARIO DE BIENESTAR: 3 MICROHÁBITOS CLAVE', 
          objective: 'Este ejercicio es tu “plan maestro de autocuidado”: vas a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles. Estos serán tus anclas: puntos fijos que mantendrán tu bienestar estable sin importar lo que pase fuera. Tiempo estimado: 6-8 minutos. Hazlo al inicio de la semana y repite siempre que sientas que has perdido tus rutinas.', 
          duration: '6-8 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana2tecnica1.mp3` 
        },
        { 
          type: 'morningRitualExercise', 
          title: 'EJERCICIO 2: MI RITUAL DE INICIO: UNA MAÑANA AMABLE E CONSCIENTE', 
          objective: 'En el ejercicio anterior trazaste tu plan maestro para cuidar de ti durante todo el día. Ahora vamos a encender ese plan desde el primer instante de la mañana, para que empiece a funcionar con tu primera respiración. Tus primeras acciones al despertar marcan el tono de todo lo que viene después. Si empiezas acelerado o en piloto automático, el día puede arrastrarte. Si empiezas con calma, intención y energía positiva, tendrás más control y claridad para todo lo demás. En este ejercicio vas a diseñar una rutina inicial breve —aunque sea de pocos minutos— que te permita aterrizar en tu día con presencia y equilibrio. Tiempo estimado: 8-10 minutos para diseñarla. Hazlo una vez y revisa cuando sientas que tu mañana necesita un ajuste.', 
          duration: '8-10 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana2tecnica2.mp3`
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Reflexionssesion2ruta12.mp3`, prompts: ["<p>En tu experiencia pasada, ¿qué papel crees que han jugado los hábitos en tu bienestar físico, emocional y mental?</p><ul><li>¿Cuando tus hábitos se debilitan o desaparecen, cómo sueles reaccionar y qué podrías hacer para asumir un papel más activo en recuperarlos?</li><li>¿Qué microhábitos o rituales has puesto en marcha y cómo te han hecho sentir?</li><li>¿Cómo cambia tu ánimo y tu energía cuando cuidas lo básico de tu cuerpo, tus emociones y tu mente?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Resumensesion2ruta12.mp3` },
        { type: 'list', items: ["Tus rutinas son anclas emocionales que estabilizan tu día y te ayudan a pensar con más claridad.", "Cuidar lo básico (descanso, alimentación, movimiento) reduce la activación del sistema de alarma y mejora tu regulación emocional.", "Los microhábitos pequeños y realistas tienen un efecto acumulativo enorme en tu bienestar y motivación.", "La diferencia entre rutina rígida y ritual de cuidado está en la flexibilidad y la conexión con tu bienestar.", "Un buen inicio de día (mañana amable) actúa como chispa que enciende tu energía y tu foco para el resto de la jornada."] },
        { type: 'quote', text: 'El autocuidado no es un premio que te das cuando has sido productivo; es el punto de partida para poder serlo.' }
      ]
    },
    {
      id: 'bienestar_sem3',
      title: 'Semana 3: Reactiva la Motivación Bloqueada',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [{ type: 'paragraphWithAudio', text: 'Uno de los síntomas más comunes del ánimo bajo es la falta de ganas. Sabes lo que deberías hacer, pero el impulso no llega. La clave está en no esperar a tener ganas para empezar: muchas veces, la motivación aparece después de la acción. Esta semana entrenarás cómo dar el primer paso incluso sin motivación, conectando cada acción con tus valores y con la vida que quieres construir.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Introsesion3ruta12.mp3` },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Gancho emocional: Cuando las ganas no aparecen', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio1sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: '¿Te ha pasado que sabes exactamente lo que deberías hacer… pero no encuentras el impulso para empezar?\nLas “ganas” y la motivación están muy conectadas: las ganas son como la chispa inicial y la motivación, el motor que mantiene la acción en marcha. La buena noticia es que, según la ciencia —desde la Terapia Cognitivo-Conductual (TCC) hasta la neurociencia afectiva— no siempre tenemos que esperar a que aparezcan las ganas: muchas veces la motivación llega después de ponernos en movimiento.\nPara saber cómo lograrlo, primero vamos a entender qué es realmente la motivación y de dónde surge.' }] },
        { type: 'collapsible', title: 'La motivación: algo más que ganas', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio2sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'En pocas palabras, la motivación es ese empujón interno que nos mueve a hacer cosas que nos acercan a lo que nos hace bien y nos alejan de lo que nos perjudica.' }, { type: 'list', items: ["Un deseo de cambiar cómo nos sentimos (relajarnos, tener más energía, ganar claridad mental).", "Una emoción que nos impulsa: incluso las decisiones más “lógicas” tienen un fondo emocional.", "La anticipación de una recompensa: imaginar lo bien que nos sentiremos después activa la dopamina en el cerebro, una sustancia que nos empuja a actuar."] }, { type: 'paragraph', text: 'En otras palabras: no solemos buscar la acción por sí misma, sino la sensación que creemos que nos dará. Y, aun así, hay momentos en los que este motor parece apagarse. Veamos por qué.' }] },
        { type: 'collapsible', title: 'Por qué a veces las ganas no llegan', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio3sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'En etapas de ánimo bajo o depresión, es común perder la motivación positiva: sabemos lo que hay que hacer, pero sentimos que no tenemos energía. Esto puede deberse a:' }, { type: 'list', items: ["Pensamientos que desaniman (“es inútil intentarlo”, “no soy capaz”).", "Cansancio físico o mental.", "No tener claro cuándo, cómo o dónde empezar.", "Perfeccionismo: esperar el momento o las condiciones perfectas para actuar.", "Falta de conexión emocional con la tarea.", "Estrés o entornos poco estimulantes que reducen la motivación."] }, { type: 'paragraph', text: 'Estos bloqueos pueden sentirse como un muro… pero, como todo muro, se puede saltar, rodear o derribar. El primer paso es saber que sí se puede actuar incluso sin ganas, y que existen estrategias para lograrlo.' }] },
        { type: 'collapsible', title: 'Acción sin ganas: cómo es posible', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio4sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Si esperamos a “tener ganas” para movernos, podemos quedarnos atrapados en la inacción. La clave está en aprender a actuar incluso cuando la motivación está baja, usando tres apoyos:' }, { type: 'list', items: ["Disciplina: seguir adelante por compromiso con nuestros objetivos, no por un impulso momentáneo.", "Planificación clara: decidir de antemano cuándo y dónde haremos algo reduce las dudas y evita que lo posterguemos.", "Facilidad: ponértelo tan fácil que sea casi imposible no empezar (en terapia lo llamamos “bajar la rampa”)."] }, { type: 'paragraph', text: 'Así, el primer paso requiere muy poca energía y es más probable que lo des. Pero tan importante como cómo te pones en marcha, es desde dónde lo haces.' }] },
        { type: 'collapsible', title: 'Del “tengo que” al “quiero elegir”', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio5sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'La forma en la que te hablas cambia cómo percibes una tarea:' }, { type: 'list', items: ["“Tengo que”: suena a obligación, activa resistencia y nos lleva a evitar o postergar. Además, si no cumplimos los “tengo que”, luego nos sentimos muy mal.", "“Quiero” o “elijo”: conecta con lo que valoras y despierta motivación propia."] }, { type: 'paragraph', text: 'Ejemplo: “Tengo que hacer ejercicio” → “Quiero moverme para sentirme con más energía y cuidar mi salud”.\n\nEste cambio no es solo de palabras: también modifica cómo el cerebro procesa la tarea, activando zonas relacionadas con el sentido y la recompensa.\nY para que este cambio no se quede en palabras bonitas, vamos a conectar cada acción con algo más profundo: su valor y su sentido.' }] },
        { type: 'collapsible', title: 'Las capas de la motivación', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio6sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'La motivación tiene varias capas, como una cebolla:' }, { type: 'list', items: ["Acción concreta: lo que harás hoy.", "Valor personal: por qué eso es importante para ti.", "Sentido mayor: cómo encaja con la vida que quieres construir."] }, { type: 'paragraph', text: 'Por ejemplo: “Hoy voy a salir a caminar (acción concreta) porque valoro mi bienestar físico (valor personal) y quiero tener energía para jugar con mis hijos (sentido mayor)”.\n\nCuantas más capas actives, más fuerte será tu impulso para empezar y mantenerte.\n\nIncluso así, iniciar puede costar. Aquí es donde las microacciones se convierten en tu mejor aliado.' }] },
        { type: 'collapsible', title: 'El círculo de la activación', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio7sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Hasta ahora hemos visto cómo dar sentido a lo que haces para que tenga más fuerza. Aun así, puede que iniciar siga costando. Aquí entra un principio clave: la acción puede venir antes que las ganas. La acción y la motivación se alimentan mutuamente:' }, { type: 'list', items: ["Si no haces nada: menos satisfacción o sensación de logro → menos ganas → más bloqueo.", "Si das un paso (aunque pequeño): más satisfacción o logro → más ganas → más acción."] }, { type: 'paragraph', text: 'Este es el núcleo de la “activación conductual” (una estrategia muy usada en psicología): romper el ciclo de la inacción con gestos pequeños que pongan la rueda en marcha.   Ejemplos: abrir un libro y leer una página, mandar un mensaje corto, salir a la puerta con las zapatillas puestas.   Ahora que sabes cómo funciona este ciclo, vamos a practicarlo con dos ejercicios que te ayudarán a generar las ganas en lugar de esperarlas.' }] },
        { type: 'collapsible', title: 'Lo que vamos a entrenar esta semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio8sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Esta semana trabajaremos con dos herramientas clave:' }, { type: 'list', items: ["Motivación en 3 capas: para que cada acción esté conectada con un valor y un sentido que realmente te importen.", "Visualización del día que quiero vivir: para que cada mañana puedas imaginar cómo quieres sentirte y actuar, y usar esa imagen como guía para tu día."] }, { type: 'paragraph', text: 'El objetivo no es esperar a que las ganas lleguen, sino aprender a provocarlas. El primer paso lo das tú… y las ganas te encuentran en el camino.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'motivationIn3LayersExercise', title: 'EJERCICIO 1: MOTIVACIÓN EN 3 CAPAS', objective: 'Con este ejercicio vas a descubrir las tres capas que dan fuerza a la motivación: lo que haces, por qué lo haces y para qué mayor lo haces. Al completarla, tendrás un recordatorio claro que te ayudará a empezar incluso en días de poca energía.', duration: '7 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana3tecnica1.mp3` },
        { type: 'visualizeDayExercise', title: 'EJERCICIO 2: Visualización: El Día que Elijo Vivir', objective: 'Con este ejercicio vas a diseñar mentalmente el día que quieres vivir, conectándolo con sensaciones y comportamientos que te acerquen a tu mejor versión. Al practicarlo, tu mente y tu cuerpo se preparan para vivir lo que has imaginado.', duration: '5-7 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana3tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Reflexionssesion3ruta12.mp3`, prompts: ["<p>Tómate un momento para integrar lo que has trabajado:</p><ul><li>¿Qué has descubierto sobre la motivación y las ganas esta semana?</li><li>¿Qué conclusiones sacas sobre tu manera habitual de hacerte cargo de tu motivación y qué mejorarías?</li><li>¿Qué ejercicio o técnica te resultó más útil para activar tus ganas cuando estabas bloqueado/a?</li><li>¿Cómo ha cambiado tu forma de ver la motivación tras trabajar con las tres capas (acción–valor–sentido)?</li><li>¿En qué situaciones de esta semana sentiste que la motivación aumentó después de ponerte en marcha?</li><li>¿Qué compromiso concreto puedes asumir para seguir practicando la activación conductual y no depender solo de las ganas?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Resumensesion3ruta12.mp3` },
        { type: 'list', items: ["La motivación no siempre precede a la acción; a menudo, la acción genera motivación.", "Cambiar el “tengo que” por “quiero” o “elijo” aumenta la motivación propia.", "Conectar cada acción con un valor personal y un sentido mayor le da fuerza y continuidad.", "La activación conductual rompe el ciclo de la inacción con gestos pequeños y fáciles.", "La visualización del día ideal prepara tu mente y tu cuerpo para actuar de forma coherente con tu intención."] },
        { type: 'quote', text: 'Las ganas pueden tardar en llegar, pero si das el primer paso, siempre sabrán encontrarte.' }
      ]
    },
    {
      id: 'bienestar_sem4',
      title: 'Semana 4: Crea tu Reserva Emocional Positiva',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'El ánimo bajo reduce los momentos agradables y aumenta la presencia de lo negativo. Para equilibrar la balanza, necesitas crear tu propia mochila de recursos positivos: recuerdos, hábitos, apoyos y actitudes que te sostengan en los días grises. Esta semana aprenderás a entrenar tu mente para capturar lo bueno, revivir recuerdos positivos y diseñar un botiquín emocional con recursos listos para usar cuando lo necesites.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Introsesion4ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: tu “mochila de reserva” para los días grises',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio1sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Imagina que cada gesto amable, cada momento de calma o cada risa que compartes, fuera como una moneda que guardas en una mochila invisible.\nEn los días soleados casi no notas que la llevas… pero cuando llega una tormenta emocional, esa reserva te sostiene y te ayuda a seguir.\nA esta mochila la llamamos reserva emocional positiva.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué es la reserva emocional positiva',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio2sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Es la capacidad de generar y mantener estados emocionales que nos fortalecen, junto con recursos internos y externos para afrontar momentos difíciles.\nNo se trata solo de “sentirse bien”, sino de cultivar activamente aquello que nos aporta calma, energía y sentido, para poder usarlo cuando más lo necesitamos.\nEsta reserva se alimenta de tres fuentes principales: ' }, { type: 'list', items: ["Hábitos: acciones diarias que favorecen el bienestar.", "Relaciones: vínculos que nos sostienen y nos nutren emocionalmente.", "Actitudes: la forma en que interpretamos y respondemos a lo que ocurre."] }]
        },
        {
          type: 'collapsible',
          title: 'Conexión con el ánimo bajo y la depresión',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio3sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo o hay depresión, no solo aumentan las emociones negativas: también disminuyen los momentos agradables y placenteros.\nEsto provoca un desequilibrio que alimenta el malestar y la llamada anhedonia: la dificultad para disfrutar o interesarse por lo que antes nos gustaba.\nImportante: al principio, cultivar emociones positivas no siempre se siente natural. Puede que parezca forzado o que no tengas ganas, y eso es completamente normal.\nCon práctica y repetición, los circuitos cerebrales de motivación y recompensa se reactivan.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué es clave en la recuperación',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio4sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente tiende a fijarse más en lo negativo y a olvidar lo que nos da calma o alegría. La reserva emocional positiva funciona como una mochila de recursos que puedes llenar con recuerdos, hábitos y apoyos. Esa mochila no elimina los problemas, pero te da más fuerza para sostenerlos.' }, { type: 'paragraph', text: 'Las emociones positivas no son un lujo: cumplen funciones esenciales para tu salud mental y tu bienestar.' }, { type: 'list', items: ["Amplían la mirada, ayudándote a ver soluciones y a pensar con más flexibilidad.", "Equilibran el peso de lo negativo, evitando que todo se vea más oscuro de lo que es.", "Sostienen tu resiliencia, dándote energía para seguir en días difíciles."] }, { type: 'paragraph', text: 'Al principio puede sentirse forzado “buscar lo positivo”, pero la práctica reactiva circuitos cerebrales de motivación y recompensa (dopamina, serotonina, calma de la amígdala). El camino no es esperar a sentirte bien para actuar, sino al revés: primero actúas (un pequeño gesto) y después aparece la emoción.' }, { type: 'paragraph', text: 'Para reflexionar: ¿qué hábitos, rutinas o pequeños gestos te ayudan a sentirte con más calma o energía? ¿Qué has comprendido sobre la relación entre acción y motivación y cómo puedes aplicarlo en los días con menos ganas? ¿Qué recuerdos, apoyos o recursos de tu “mochila positiva” son los más poderosos para levantar tu ánimo en momentos difíciles?' }, { type: 'paragraph', text: 'Estrategias sencillas que nutren tu reserva emocional:' }, { type: 'list', items: ["Recordar momentos agradables y revivirlos con detalle.", "Realizar microacciones sociales (mandar un mensaje, tomar un café).", "Usar música, humor y gestos como la sonrisa.", "Cuidar hábitos básicos: descanso, movimiento, alimentación y contacto con la naturaleza."] }]
        },
        {
          type: 'collapsible',
          title: 'Principios de activación conductual',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio5sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, esperar a “sentirse con energía” para actuar suele llevar a la inactividad, y esta inactividad alimenta más el malestar.\n\nPor eso, en psicología usamos el principio acción → emoción:\n\nPrimero actúas, incluso sin ganas.\n\nLuego, con la repetición, el estado de ánimo empieza a mejorar.\n\nClaves para aplicarlo: ' }, { type: 'list', items: ["Programar actividades agradables: pequeñas acciones que te den placer, calma o conexión, como tomar un café en un lugar con luz natural, escuchar tu canción favorita o acariciar a tu mascota.", "Incluir actividades de logro: tareas que, aunque no sean placenteras, te den una sensación de propósito o dominio, como completar una tarea pendiente, ordenar un espacio o aprender algo breve.", "Combinar ambas en tu día: el equilibrio entre placer y logro genera un círculo de motivación sostenida."] }, { type: 'paragraph', text: 'Ejemplo práctico: Si tu energía es muy baja, en lugar de “hacer ejercicio 30 min”, proponte “poner música y mover el cuerpo 3 min” o “caminar hasta la esquina y volver”. Lo pequeño y repetido es lo que activa el cambio.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué dice la neurociencia',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio6sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Las emociones positivas no solo “se sienten”, también producen cambios reales en el cerebro:' }, { type: 'list', items: ["Activan el sistema dopaminérgico: este circuito de motivación y recompensa nos impulsa a repetir conductas que nos hacen sentir bien. Con la práctica, aumenta la probabilidad de buscar y generar más de esos momentos.", "Calman la hiperactividad de la amígdala: en el ánimo bajo, la amígdala puede estar sobreactivada, amplificando el miedo, la preocupación y la visión negativa. Las emociones positivas actúan como un “freno” que reduce esta intensidad.", "Favorecen la neuroplasticidad: cada vez que entrenas una emoción positiva, refuerzas conexiones neuronales que facilitan que aparezca de nuevo. Es como crear un “camino” más transitado en tu cerebro, que luego se recorre de forma más automática.", "Efecto acumulativo: un momento positivo aislado puede levantar el ánimo de forma breve, pero repetirlo a diario construye una base más estable y resistente frente a futuros bajones."] }, { type: 'paragraph', text: 'Idea para llevarte: piensa en las emociones positivas como en regar una planta: no basta con un gran riego un día, necesita pequeñas dosis constantes para crecer y mantenerse fuerte.' }]
        },
        {
          type: 'collapsible',
          title: 'Estrategias para llenar tu reserva emocional',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio7sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Registro de momentos agradables: anota incluso los más pequeños.\n\nRecuerdos positivos: revive mentalmente experiencias agradables para activar las mismas emociones.\n\nMicroacciones sociales: saludar, enviar un mensaje, compartir algo breve.\n\nAnclajes sensoriales: olores, música o texturas que evoquen calma o alegría.\n\nHumor y juego: integrar pequeñas dosis de ligereza cada día.\n\nPaciencia: aceptar que los resultados se acumulan con el tiempo.' }]
        },
        {
          type: 'collapsible',
          title: 'Prevención de recaídas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio8sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Mantener tu reserva emocional llena no significa que no tendrás problemas, pero sí que tendrás más fuerza, flexibilidad y recursos para afrontarlos.\n\nInvertir en ella es una forma de cuidarte hoy y protegerte para el futuro.' }]
        },
        {
          type: 'collapsible',
          title: 'Mensaje motivador final',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio9sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'No necesitas esperar a “sentirte con ganas” para empezar. Aquí, la clave es la repetición: cada pequeño gesto suma.\n\nLas emociones positivas no son un lujo ni un rasgo fijo, son una habilidad que se entrena.\n\nHoy puedes empezar a llenarte de aquello que mañana te sostendrá.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'illuminatingMemoriesAlbumExercise', title: 'EJERCICIO 1: MI ÁLBUM DE RECUERDOS QUE ILUMINAN', objective: 'Este ejercicio te ayudará a entrenar tu mente para equilibrar el “sesgo negativo” natural del cerebro, capturando y conservando los momentos que te nutren para que puedas revivirlos en días difíciles.', duration: '10-12 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana4tecnica1.mp3` },
        { type: 'positiveEmotionalFirstAidKitExercise', title: 'EJERCICIO 2: MI BOTIQUÍN EMOCIONAL POSITIVO', objective: 'Este ejercicio te ayudará a diseñar un kit personal de recursos prácticos para regular tu ánimo y recuperar el equilibrio, basado en estrategias que la ciencia ha demostrado efectivas.', duration: '12-15 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana4tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Reflexionssesion4ruta12.mp3`, prompts: ["<p>Esta semana has explorado el poder de cultivar emociones positivas como una forma de cuidar tu bienestar a largo plazo.</p><ul><li>¿Qué descubriste esta semana sobre tu capacidad para reconocer y generar emociones positivas?</li><li>¿Qué quieres ajustar en tu día a día para que tu capacidad de generar emociones positivas funcione mejor?</li><li>¿Qué cosas, personas o experiencias forman parte de tu propia “mochila de reserva”?</li><li>¿Qué hábitos sencillos (ej. dormir bien, caminar, escuchar música) notas que te ayudan a mantenerte más sereno/a y equilibrado/a?</li><li>Cuando reviviste un recuerdo positivo o usaste uno de tus recursos, ¿qué cambió en tu estado de ánimo?</li><li>¿Qué tres pequeñas acciones concretas podrías repetir la próxima semana para seguir fortaleciendo tu reserva emocional?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Resumenruta12.mp3` },
        { type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente tiende a fijarse más en lo negativo y a olvidar lo que nos da calma o alegría. La reserva emocional positiva funciona como una mochila de recursos que puedes llenar con recuerdos, hábitos y apoyos. Esa mochila no elimina los problemas, pero te da más fuerza para sostenerlos.' },
        { type: 'paragraph', text: 'Las emociones positivas no son un lujo: cumplen funciones esenciales para tu salud mental y tu bienestar.' },
        { type: 'list', items: ["Amplían la mirada, ayudándote a ver soluciones y a pensar con más flexibilidad.", "Equilibran el peso de lo negativo, evitando que todo se vea más oscuro de lo que es.", "Sostienen tu resiliencia, dándote energía para seguir en días difíciles."] },
        { type: 'paragraph', text: 'Al principio puede sentirse forzado “buscar lo positivo”, pero la práctica reactiva circuitos cerebrales de motivación y recompensa (dopamina, serotonina, calma de la amígdala). El camino no es esperar a sentirte bien para actuar, sino al revés: primero actúas (un pequeño gesto) y después aparece la emoción.' },
        { type: 'paragraph', text: 'Para reflexionar: ¿qué hábitos, rutinas o pequeños gestos te ayudan a sentirte con más calma o energía? ¿Qué has comprendido sobre la relación entre acción y motivación y cómo puedes aplicarlo en los días con menos ganas? ¿Qué recuerdos, apoyos o recursos de tu “mochila positiva” son los más poderosos para levantar tu ánimo en momentos difíciles?' },
        { type: 'paragraph', text: 'Estrategias sencillas que nutren tu reserva emocional:' },
        { type: 'list', items: ["Recordar momentos agradables y revivirlos con detalle.", "Realizar microacciones sociales (mandar un mensaje, tomar un café).", "Usar música, humor y gestos como la sonrisa.", "Cuidar hábitos básicos: descanso, movimiento, alimentación y contacto con la naturaleza."] },
        { type: 'quote', text: 'En cada recuerdo luminoso, cada gesto amable y cada momento positivo que eliges cultivar es como poner una moneda brillante en tu mochila interior. No evitará las tormentas, pero hará que siempre tengas con qué resguardarte.' }
      ]
    },
    {
      id: 'bienestar_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [{ type: 'therapeuticNotebookReflection', title: 'REFLEXIÓN FINAL PARA EL CUADERNO', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Reflexionfinalruta12.mp3`, prompts: ["<p>A lo largo de estas cuatro semanas has recorrido un camino que no siempre es fácil: mirar de frente el ánimo bajo, comprenderlo y aprender a cuidarlo.</p><p>Has descubierto que no se trata de esperar a tener ganas para actuar, sino de dar pasos pequeños que, repetidos, construyen bienestar duradero. Paso a paso, fuiste recuperando lo que te hace sentir bien:</p><ul><li>Semana 1 te ayudó a reconectar con tus fuentes de energía y gratificación.</li><li>Semana 2 te mostró la fuerza de las rutinas y microhábitos como anclas que sostienen tu día.</li><li>Semana 3 te enseñó a provocar motivación cuando las ganas no aparecen, conectando cada acción con tu sentido personal.</li><li>Semana 4 te permitió crear una reserva emocional positiva: tu mochila interior para los días difíciles.</li></ul><p>Este recorrido no busca que vivas siempre en “modo positivo”, sino que tengas recursos reales y prácticos para equilibrar lo difícil con lo que te da calma, fuerza y esperanza.</p><p>Ahora, tomate unos minutos para reflexionar:</p><ul><li>¿Qué hábitos, rutinas o pequeños gestos descubrí que me ayudan a sentirme con más calma o energía?</li><li>¿Qué he comprendido sobre la relación entre acción y motivación? ¿Cómo puedo aplicarlo en los días en los que me falten las ganas?</li><li>¿Qué recuerdos, apoyos o recursos de mi “mochila positiva” siento que son los más poderosos para levantar mi ánimo en momentos difíciles?</li><li>¿Qué conclusiones saco sobre cómo me hago cargo de mi bienestar y qué quiero seguir cultivando a partir de ahora?</li></ul>"] }, { type: 'title', text: 'RESUMEN FINAL DE LA RUTA', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Resumenfinalruta12.mp3` }, { type: 'list', items: ['El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales, y que se puede regular con estrategias concretas.', 'Tu energía vital se sostiene en tres pilares: hábitos básicos, chispa emocional y dirección mental.', 'Las rutinas y microhábitos son anclas de cuidado: pequeños gestos diarios que estabilizan cuerpo, mente y emociones.', 'La motivación no siempre precede a la acción: muchas veces aparece después de dar el primer paso.', 'Conectar cada acción con un valor y un sentido mayor le da fuerza y continuidad.', 'Cultivar una reserva emocional positiva —recuerdos, apoyos, hábitos, gestos— es una inversión que protege tu bienestar y fortalece tu resiliencia.', 'Lo importante no es la perfección, sino la repetición amable: cada intento cuenta como un paso hacia tu equilibrio.'] }, { type: 'quote', text: 'Volver a lo que te hace sentir bien no es regresar al pasado, sino construir, paso a paso, un presente más habitable. Cada gesto, cada recuerdo y cada elección consciente son semillas de bienestar que seguirán creciendo dentro de ti.' }]
    }
  ]
};

```
- src/data/paths/responsibilityPath.ts:
```ts
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const responsibilityPath: Path = {
  id: 'ni-culpa-ni-queja',
  title: 'Ni Culpa Ni Queja: Responsabilidad Activa',
  description: 'Aprende a distinguir lo que depende de ti, a transformar la queja en acción y a elegir la responsabilidad activa sin caer en el autoabandono.',
  dataAiHint: 'responsibility guilt action',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Introruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Introsesion1ruta10.mp3`,
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El punto de partida: tres caminos ante un mismo problema',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio1sesion1ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio2sesion1ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio3sesion1ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio4sesion1ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio5sesion1ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio6sesion1ruta10.mp3`,
          content: [{ type: 'paragraph', text: '<p>Conocer la teoría está bien, pero necesitamos herramientas prácticas. Este método sencillo te ayudará a transformar una queja en un paso concreto: </p>  <ol><li>Describe la situación: solo hechos, sin juicios. </li><li> Detecta tu pensamiento: “Es injusto”, “Siempre pasa igual”. </li><li> Cuestiónalo: ¿Qué pruebas tengo a favor y en contra de este pensamiento? (Cuestionamiento socrático) </li><li> Atribuye con realismo: ¿Qué parte es mía y cuál no? (Atribución realista) </li><li> Si pasara lo que temo, ¿qué haría? (Descatastrofización) </li><li> Definir un paso pequeño y concreto. <br> Ejemplo: “Arruiné esa oportunidad” → Hoy: “Pido feedback, hago una mejora y la pruebo en la próxima ocasión.”  </li></ol> </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Auto-chequeo rápido: ¿Dónde estoy ahora?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio7sesion1ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Este ejercicio express te ayuda a ubicarte:\n\n- En culpa: me repito “es todo por mi culpa” y me castigo mentalmente.\n- En queja: me enfoco solo en lo que otros hacen mal o en lo injusta que es la situación.\n- En responsabilidad activa: identifico mi parte, pienso en soluciones y actúo.\n\nTruco rápido:\n\n“De todo esto, ¿qué 10–20% sí depende de mí?”\nEse porcentaje es tu punto de partida para la acción.' }],
        },
        {
          type: 'collapsible',
          title: 'Regularte para poder elegir mejor',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio8sesion1ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando la emoción es muy intensa, el cerebro activa el sistema de amenaza (amígdala) y limita tu capacidad de pensar con claridad. Antes de decidir, regula:\n\n- Ponle nombre a la emoción: “Esto es frustración” o “Esto es culpa.”\n- Acepta su presencia: sin luchar contra ella.\n- Acción opuesta: si te apetece aislarte, da un paso para conectar; si quieres gritar, prueba a hablar más lento y bajo.\n- Convierte la queja en petición: en vez de “Siempre me interrumpes”, di “Necesito 10 minutos para explicar mi idea sin interrupciones.”' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Audio9sesion1ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Aceptar lo que pasó no te ata, te libera: te da espacio para elegir el siguiente paso en vez de quedarte luchando contra lo inevitable. Esta semana entrenarás: Escritura compasiva y orientada al presente → “Eso pasó. ¿Y ahora qué?” Práctica guiada de autoaceptación → Soltar el juicio y dar un paso útil.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'complaintTransformationExercise',
          title: 'EJERCICIO 1: TABLA “ME QUEJO DE… / LO QUE SÍ PUEDO HACER ES…”',
          objective: 'Quiero ayudarte a transformar tus quejas en pasos concretos que dependan de ti. Porque cuando cambias el “esto está mal” por un “esto es lo que haré”, recuperas tu poder y dejas de quedarte atascado o atascada en la frustración.',
          duration: '10 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana1tecnica1.mp3`,
        },
        {
          type: 'guiltRadarExercise',
          title: 'EJERCICIO 2: MI RADAR DE CULPA',
          objective: 'Quiero ayudarte a detectar cuándo la culpa que sientes es una señal útil y cuándo es una carga que no te corresponde. Con este ejercicio vas a calibrar tu radar interno para diferenciar entre una culpa que te guía y una que solo te pesa.',
          duration: '5–7 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana1tecnica2.mp3`,
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Reflexionsesion1ruta10.mp3`,
          prompts: [
            '<ul><li>¿Qué descubrimiento de esta semana ha tenido más impacto en ti?</li><li>¿Qué cambió en tu forma de actuar cuando suavizaste la crítica interna?</li><li>¿Qué consecuencias podrías notar a largo plazo si sigues practicando esta autorresponsabilidad compasiva?</li><li>¿Qué cambió en ti cuando distinguiste entre conducta e identidad?</li><li>¿En qué momento reciente aplicaste una respuesta más compasiva contigo mismo/a?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion1/Resumensesion1ruta10.mp3` },
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Introsesion2ruta10.mp3`,
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El punto de partida: del “¿por qué pasó?” al “¿qué hago ahora?”',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio1sesion2ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'En las semanas anteriores, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora damos un paso más: vamos a mirar hacia adentro, hacia esa voz interna que te habla todo el día… aunque a veces no te des cuenta.   Todos tenemos un diálogo interno. A veces es un susurro amable que nos impulsa; otras, un juez implacable que no deja pasar ni un fallo.    En psicología cognitivo-conductual sabemos que este diálogo influye directamente en nuestra motivación, en cómo gestionamos los errores y en la capacidad para aprender y avanzar. La neurociencia confirma que las palabras que nos decimos activan redes cerebrales relacionadas con la amenaza o con la calma, según su tono y contenido.   No podemos evitar que la mente nos hable, pero sí podemos entrenarla para que lo haga de una manera que nos ayude a crecer, no a castigarnos.' }],
        },
        {
          type: 'collapsible',
          title: 'Aceptación activa ≠ resignación',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio2sesion2ruta10.mp3`,
          content: [
            { type: 'paragraph', text: 'En muchas personas, la palabra “aceptar” despierta resistencia porque la confunden con resignarse. Pero no son lo mismo.' },
            { type: 'list', items: ['Aceptar activamente es reconocer los hechos, tus emociones y pensamientos, sin resistencia ni juicio, para poder actuar con claridad.', 'Resignarse es decir “no hay nada que hacer” y quedarse inmóvil.'] },
            { type: 'paragraph', text: 'Idea clave: la aceptación activa abre caminos, la resignación los bloquea.  Ejemplo:' },
            { type: 'list', items: ['Resignación -> “Fallé en mi presentación, mejor no vuelvo a exponer.”', 'Aceptación activa → “Fallé, me duele, pero puedo aprender y prepararme mejor para la próxima.”'] },
            { type: 'paragraph', text: 'En términos de neurociencia, aceptar activa regiones del córtex prefrontal implicadas en la regulación emocional, mientras que la resignación deja la respuesta emocional más en manos de la amígdala, que reacciona con miedo o bloqueo.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'Separar pasado y presente: dos niveles distintos',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio3sesion2ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Aceptar implica reconocer lo ocurrido y dar al presente su propia oportunidad. El pasado nos aporta información, pero si lo dejamos dirigir el presente, actuaremos por miedo, culpa o costumbre, repitiendo patrones que ya no nos sirven. Ejemplo: “Hace un año no me seleccionaron para un proyecto” → Hoy, en lugar de callarme por miedo, puedo pedir feedback, ajustar mi propuesta y volver a intentarlo. En TCC trabajamos con esta separación porque ayuda a frenar la rumiación y a activar el modo solución en lugar del modo problema.' }],
        },
        {
          type: 'collapsible',
          title: 'Del automático a lo consciente (Modelo ABC)',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio4sesion2ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio5sesion2ruta10.mp3`,
          content: [{ type: 'paragraph', text: '<p>Aceptar lo que pasó es el primer paso; el siguiente es tomar decisiones útiles. </p>  <p>Técnica combinada:  <ol><li>¿Qué pruebas tengo a favor y en contra de este pensamiento? (Cuestionamiento socrático) </li><li> ¿Me ayuda este pensamiento a avanzar? </li><li> ¿Qué parte depende de mí y cuál no? (Atribución realista) </li><li> Si pasara lo que temo, ¿qué haría? (Descatastrofización) </li><li> Definir un paso pequeño y concreto. <br> Ejemplo: “Arruiné esa oportunidad” → Hoy: “Pido feedback, hago una mejora y la pruebo en la próxima ocasión.”  </li></ol> </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Experimentos conductuales y acción opuesta',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio6sesion2ruta10.mp3`,
          content: [
            {
              type: 'paragraph',
              text: '<p>Para cambiar creencias limitantes, hay que ponerlo a prueba. </p><p>Experimento conductual: acción pequeña para verificar si tu creencia es cierta. </p><p>Acción opuesta: hacer lo contrario a lo que la emoción te impulsa. </p><p>Ejemplo: <br>Creencia: “Si hablo, molesto.” <br>Experimento: pedir turno de palabra una vez y observar la reacción real. <br></p>Según la neurociencia, este tipo de exposición rompe asociaciones miedo–acción y refuerza redes neuronales más adaptativas. ',
            },
          ],
        },
        {
          type: 'collapsible',
          title: 'Soltar la culpa del pasado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio7sesion2ruta10.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio8sesion2ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'El mindfulness te ayuda a observar pensamientos como eventos mentales pasajeros. Ejemplo: en vez de “Arruiné todo”, decirte: “Estoy teniendo el pensamiento de que arruiné todo.” Esto crea distancia psicológica (defusión) y reduce la intensidad emocional. Solo 3–5 minutos diarios de respiración consciente y etiquetado emocional fortalecen esta habilidad.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Audio9sesion2ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Aceptar lo que pasó no te ata, te libera: te da espacio para elegir el siguiente paso en vez de quedarte luchando contra lo inevitable. Esta semana entrenarás: Escritura compasiva y orientada al presente → “Eso pasó. ¿Y ahora qué?” Práctica guiada de autoaceptación → Soltar el juicio y dar un paso útil.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'acceptanceWritingExercise',
          title: 'EJERCICIO 1: ESO PASÓ. ¿Y AHORA QUÉ?',
          objective: 'Usar la escritura para poner en orden lo que pasó, soltar el juicio y convertir el pasado en un punto de partida, no en una condena.',
          duration: '10–12 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana1tecnica1.mp3`,
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Reflexionsesion2ruta10.mp3`,
          prompts: [
            '<p>¿Cuál ha sido el descubrimiento más importante para ti y por qué?</p><ul><li>¿Qué situación de esta semana te permitió poner en práctica la aceptación activa?</li><li>¿Qué culpa del pasado has soltado o disminuido gracias a lo trabajado?</li><li>¿Qué has descubierto sobre ti al separar hechos de juicios y actuar desde el presente?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion2/Resumensesion2ruta10.mp3` },
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Introsesion3ruta10.mp3`,
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'De la culpa al impulso: el poder de tu voz interna',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio1sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'En las semanas anteriores, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora damos un paso más: vamos a mirar hacia adentro, hacia esa voz interna que te habla todo el día… aunque a veces no te des cuenta.   Todos tenemos un diálogo interno. A veces es un susurro amable que nos impulsa; otras, un juez implacable que no deja pasar ni un fallo.    En psicología cognitivo-conductual sabemos que este diálogo influye directamente en nuestra motivación, en cómo gestionamos los errores y en la capacidad para aprender y avanzar. La neurociencia confirma que las palabras que nos decimos activan redes cerebrales relacionadas con la amenaza o con la calma, según su tono y contenido.   No podemos evitar que la mente nos hable, pero sí podemos entrenarla para que lo haga de una manera que nos ayude a crecer, no a castigarnos.' }],
        },
        {
          type: 'collapsible',
          title: '¿Por qué a veces somos tan duros con nosotros mismos?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio2sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Esa voz crítica interna no aparece por casualidad. Suele formarse a partir de experiencias pasadas, mensajes que recibimos de figuras importantes o incluso expectativas sociales que hemos interiorizado.   En TCC llamamos a estos patrones pensamientos automáticos: surgen de forma rápida y sin filtro, muchas veces repitiendo creencias aprendidas sin cuestionarlas.   Ejemplo: si en el colegio te decían “podrías hacerlo mejor” cada vez que cometías un error, es posible que hoy tu mente te repita algo parecido cuando las cosas no salen como esperabas.   El problema no es detectar un error, sino cómo lo hacemos. Una crítica dura y global (“soy un desastre”) no deja espacio para mejorar; una observación específica y constructiva (“esta vez no salió como quería, voy a probar otra forma”) abre la puerta al cambio.' }],
        },
        {
          type: 'collapsible',
          title: 'La diferencia entre responsabilidad y autoexigencia destructiva',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio3sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Asumir responsabilidades es reconocer nuestra parte en una situación y decidir actuar para mejorar. La autoexigencia destructiva, en cambio, es exigirse sin tener en cuenta los propios límites, castigándose por no alcanzar estándares poco realistas.   La investigación en psicología motivacional muestra que la autocompasión —entendida como tratarnos con la misma comprensión que a un amigo— favorece el aprendizaje y la persistencia mucho más que la autocrítica severa. Kristin Neff, referente en este campo, lo resume así: “La autocompasión es el antídoto contra la autocrítica que paraliza”.   Piensa en esto:   Responsabilidad: “Me equivoqué en la presentación. Voy a repasar el material para la próxima vez.”   Autoexigencia destructiva: “Siempre lo hago mal. No sirvo para esto.”   La primera frase abre posibilidades; la segunda te encierra.' }],
        },
        {
          type: 'collapsible',
          title: 'El impacto real del diálogo interno en tu cerebro y tu cuerpo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio4sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'La neurociencia ha comprobado que las palabras que nos decimos activan distintas redes neuronales:   Un lenguaje interno amenazante estimula la amígdala, generando respuesta de estrés y aumentando cortisol.   Un lenguaje interno amable activa el córtex prefrontal, facilitando la autorregulación y la toma de decisiones.   Esto significa que no es solo un tema emocional: es físico. Hablarte mal no solo te desalienta, también reduce tu capacidad de pensar con claridad. En cambio, un tono interno responsable y compasivo no ignora los errores, pero los aborda desde la calma, favoreciendo soluciones más efectivas.' }],
        },
        {
          type: 'collapsible',
          title: 'De juez a guía: el cambio que necesitas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio5sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Imagina que tienes un entrenador personal que te acompaña cada día. Si te gritara y te humillara cada vez que fallas, ¿cuánto tardarías en perder motivación? Ahora imagina que ese entrenador te corrige, pero también reconoce tus avances y te anima a intentarlo de nuevo.   Ese entrenador eres tú. Y hoy vamos a entrenar tu voz interna para que pase de juez severo a guía firme y alentador. No se trata de evitar la responsabilidad ni de “endulzarlo todo”, sino de decir las cosas de forma que te ayuden a actuar.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente hacia las técnicas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Audio6sesion3ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'En esta semana aprenderás a identificar cuándo tu voz interna está frenando tu crecimiento y a transformarla en una aliada. Descubrirás que ser responsable no significa castigarte, y que puedes exigirte sin perder el respeto por ti mismo o por ti misma.   Ahora pasaremos a las técnicas, donde pondrás en práctica estrategias concretas para:   Definir cómo quieres hablarte cuando las cosas no salgan como esperabas.   Reformular críticas internas en guías constructivas que te impulsen.' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'compassionateResponsibilityContractExercise',
          title: 'EJERCICIO 1: MI CONTRATO DE AUTORRESPONSABILIDAD COMPASIVA',
          objective: 'Crear un compromiso interno que combine la autorresponsabilidad con la autocompasión, dándote un marco claro para responder a tus errores.',
          duration: '10–15 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana3tecnica1.mp3`,
        },
        {
          type: 'criticismToGuideExercise',
          title: 'EJERCICIO 2: TRANSFORMA TU CRÍTICA EN GUÍA',
          objective: 'Convertir tu voz crítica en una guía útil que te ayude a mejorar sin hundirte, manteniendo la exigencia sana pero eliminando el castigo.',
          duration: '8–10 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana3tecnica2.mp3`,
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Reflexionsesion3ruta10.mp3`,
          prompts: [
            '<p>¿Cuál ha sido el descubrimiento más importante para ti y por qué?</p><ul><li>¿Qué cambió en tu forma de actuar cuando suavizaste la crítica interna?</li><li>¿Qué consecuencias podrías notar a largo plazo si sigues practicando esta autorresponsabilidad compasiva?</li><li>¿Qué cambió en ti cuando distinguiste entre conducta e identidad?</li><li>¿En qué momento reciente aplicaste una respuesta más compasiva contigo mismo/a?</li></ul>',
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion3/Resumensesion3ruta10.mp3` },
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Introsesion4ruta10.mp3`,
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'De cargar con todo a elegir con intención',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Audio1sesion4ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'En las semanas anteriores, hemos visto cómo pasar de la culpa y la queja a la acción, cómo aceptar sin resignarse y cómo practicar la autorresponsabilidad compasiva.  Ahora vamos a integrar todo para dar un paso clave: hacernos cargo sin perdernos de vista.   Esto significa actuar desde la responsabilidad activa —lo que depende de ti— sin absorber culpas, tareas o problemas que no te pertenecen.   La clave está en elegir dónde pones tu energía, en lugar de repartirla de forma automática.   Ejemplo:   Cargar con todo: “Si no me ocupo de esto, nadie lo hará, así que lo hago, aunque esté agotado/a.”   Elegir con intención: “Esto sí lo puedo transformar, y esto otro no me corresponde. Decido dónde actuar y dónde soltar.”' }],
        },
        {
          type: 'collapsible',
          title: 'La sostenibilidad emocional de la responsabilidad',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Audio2sesion4ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'La responsabilidad mal entendida puede llevar al agotamiento, la frustración y el resentimiento. Para que sea sostenible, necesitamos un equilibrio entre implicarnos y cuidarnos.   La neurociencia muestra que el cerebro necesita alternar periodos de activación y descanso para mantener la motivación y la claridad mental (Peters et al., 2017). Cuando nos hacemos cargo de todo, el sistema nervioso entra en estrés crónico y eso afecta al juicio, a la memoria y a la regulación emocional.   Idea clave: Responsabilidad no es cargar con más, es actuar mejor.' }],
        },
        {
          type: 'collapsible',
          title: 'Esto no me corresponde / Esto sí lo puedo transformar',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Audio3sesion4ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'Un error común es pensar que ser responsables significa asumir cualquier problema cercano.   La realidad es que hay cosas que no dependen de nosotros y que, si intentamos controlarlas, solo generamos desgaste y frustración.   Separar lo que sí y lo que no te corresponde es un acto de autocuidado y de claridad mental.   Ejemplo:   No me corresponde: las decisiones ajenas, el clima, las emociones que otros no quieren trabajar.   Sí puedo transformar: mi forma de comunicarme, mis hábitos, mi manera de responder a lo que ocurre.' }],
        },
        {
          type: 'collapsible',
          title: 'El mapa de la influencia real',
          content: [{ type: 'paragraph', text: '<p>Imagina tu vida como tres círculos concéntricos: </p>1 - Zona de control directo – Lo que depende solo de ti (acciones, actitudes, elecciones). <br>2 - Zona de influencia – Lo que puedes impactar, pero no decidir por completo (relaciones, trabajo en equipo). <br>3 - Zona fuera de tu control – Lo que no puedes cambiar (pasado, clima, decisiones ajenas). <br><p>Concentrarte en la zona de control directo y parte de tu zona de influencia multiplica tu eficacia y protege tu energía. <br>Ejemplo: Si tu equipo no entrega a tiempo, no puedes controlar sus decisiones, pero sí puedes: </p>- Comunicar plazos claros.<br> - Pedir reuniones de seguimiento.<br> - Ajustar tu parte para prevenir retrasos. <br>' }],
        },
        {
          type: 'collapsible',
          title: 'Compromiso con una vida elegida, no impuesta',
          content: [{ type: 'paragraph', text: '<p>Hacerse cargo no es vivir a la defensiva, apagando fuegos. Es diseñar una vida en la que tus acciones reflejen lo que valoras. </p><p>Cuando actúas así, dejas de vivir para cumplir expectativas ajenas y empiezas a construir desde dentro. </p><p>Ejemplo: <br>- Vida impuesta: “Tengo que estar disponible siempre, o decepcionaré a los demás.”<br>- Vida elegida: “Estoy disponible en estos horarios, y fuera de ellos descanso y recargo energía para dar lo mejor de mí.” </p>' }],
        },
        {
          type: 'collapsible',
          title: 'Cuidarte también es tu responsabilidad',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Audio6sesion4ruta10.mp3`,
          content: [{ type: 'paragraph', text: 'La autorresponsabilidad también implica proteger tu energía física, mental y emocional.   En TCC y psicología positiva, el autocuidado no es un lujo: es la base para responder con claridad y sostener tus compromisos a largo plazo.   Cuando te pierdes de vista, la responsabilidad se vuelve una carga que agota y bloquea; cuando te cuidas, se convierte en una elección que impulsa y da estabilidad.   Ejemplos:   Asumir un reto durmiendo poco → más estrés y menos rendimiento.   Priorizar descanso y pausas → más energía, enfoque y mejores decisiones.   Cuidarte es asegurar que podrás seguir eligiendo y actuando mañana.   Recuerda: si te pierdes de vista, tu responsabilidad se convierte en una carga que te rompe, no en una elección que te impulsa.' }],
        },
        {
          type: 'collapsible',
          title: 'Cierre y puente a la práctica',
          content: [{ type: 'paragraph', text: 'Esta semana vas a trabajar dos ejercicios clave para reforzar esta habilidad:<br>Rueda de mi zona de influencia – para visualizar y delimitar lo que sí y lo que no te corresponde. <br>Mi declaración de compromiso personal – para definir en tres frases cómo quieres vivir desde la responsabilidad activa y cuidarte en el proceso. <br>La responsabilidad que eliges es más ligera que la culpa que arrastras. \\nAhora vamos a entrenarla. ' }],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'influenceWheelExercise',
          title: 'EJERCICIO 1: RUEDA DE MI ZONA DE INFLUENCIA',
          objective: 'Diferenciar lo que depende de ti de lo que no, para que inviertas tu tiempo y fuerza en lo que realmente puedes transformar. Así reduces frustración y recuperas foco.',
          duration: '10–15 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana4tecnica1.mp3`,
        },
        {
          type: 'personalCommitmentDeclarationExercise',
          title: 'EJERCICIO 2: MI DECLARACIÓN DE COMPROMISO PERSONAL',
          objective: 'Definir en tres frases clave cómo quieres vivir desde la responsabilidad activa, con equilibrio y autocuidado. Serán tu ancla emocional y tu guía diaria.',
          duration: '5–10 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana4tecnica2.mp3`,
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/NUEVAReflexionsesion4ruta10.mp3`,
          prompts: [
            '<p>Esta semana has explorado qué significa hacerte cargo de tu vida sin convertir la responsabilidad en una carga que te desgasta. </p><p>Has aprendido a distinguir entre lo que está dentro de tu círculo de influencia y lo que no, y a comprometerte con decisiones que respeten tus límites y tu energía. </p><p>Piensa ahora en cómo este enfoque puede transformar tu manera de actuar y de cuidarte. </p><p><b>Preguntas para reflexionar:</b></p><ul><li>¿Qué descubrimiento de esta semana ha sido más revelador para ti sobre la forma en que asumes la responsabilidad?</li><li>¿En qué situaciones recientes has podido decir “esto no me corresponde” y sentirte en paz con ello?</li><li>¿Cómo ha cambiado tu forma de hablarte a ti mismo o a ti misma después de realizar las técnicas propuestas?</li><li>¿Qué compromisos nuevos quieres mantener a partir de ahora para cuidar de ti mientras te haces cargo de lo que sí depende de ti?</li></ul>'
          ],
        },
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Resumensesion4ruta10.mp3` },
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
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Reflexionfinalruta10.mp3`,
          prompts: [
            '<p>A lo largo de estas semanas, has explorado cómo dejar de vivir desde la culpa o la queja, y cómo pasar a la responsabilidad activa. Has aprendido a diferenciar lo que puedes cambiar de lo que no, a cuestionar pensamientos que te frenaban, a transformar la autocrítica en guía y a cuidar tu energía mientras te haces cargo de tu vida.</p><p>Piensa ahora:</p><ul><li>¿Qué cambio has notado en tu forma de responder ante un error o una situación injusta?</li><li>¿Cuál ha sido tu mayor descubrimiento sobre ti mismo o ti misma en relación con la responsabilidad?</li><li>¿Qué compromiso concreto quieres llevarte de aquí para tu vida diaria?</li></ul>',
          ],
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/sesion4/Resumenfinalruta10.mp3`,
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

```
- src/lib/translations.ts:
```ts

// For V1, directly use Spanish. This structure allows easy replacement with a full i18n solution.
// All text literals should be sourced from here.

export const t = {
  appName: "EMOTIVA",
  // General
  welcome: "¡Hola!",
  loading: "Cargando...",
  submit: "Enviar",
  save: "Guardar",
  errorOccurred: "Ocurrió un error. Por favor, inténtalo de nuevo.",
  // Auth
  login: "Inicia Sesión",
  register: "Registrarse",
  logout: "Cerrar Sesión",
  email: "Correo Electrónico",
  password: "Contraseña",
  showPassword: "Mostrar contraseña",
  hidePassword: "Ocultar contraseña",
  name: "Nombre",
  ageRange: "Rango de Edad",
  ageRangePlaceholder: "Selecciona tu rango de edad",
  gender: "Género (opcional)",
  genderPlaceholder: "Selecciona tu género",
  initialEmotionalState: "Estado emocional inicial (1-5)",
  forgotPassword: "¿Olvidaste tu contraseña?",
  noAccount: "¿No tienes cuenta?",
  alreadyHaveAccount: "¿Ya tienes cuenta? Inicia Sesión",
  agreeToTerms: "Acepto la política de privacidad y aviso legal.",
  registrationSuccessTitle: "¡Registro Exitoso!",
  registrationSuccessMessage: "Serás redirigido en breve.", // Original message, can be deprecated if not used.
  registrationSuccessLoginPrompt: "¡Registro completado! Ahora puedes iniciar sesión.", // New message
  loginSuccessMessage: "Inicio de sesión exitoso.", // Added for direct comparison
  loginFailed: "Error al iniciar sesión. Verifica tus credenciales.",
  registrationFailed: "Error al registrar. Inténtalo de nuevo.",
  // Sidebar Navigation
  navDashboard: "Panel",
  navAssessment: "Evaluación",
  navInteractiveAssessment: "Evaluación Guiada",
  navPaths: "Rutas",
  navChatbot: "Mentor IA",
  navKnowledgeAssistant: "Asistente",
  navResources: "Recursos",
  navSettings: "Configuración",
  navMyAssessments: "Mis Evaluaciones",
  navTherapeuticNotebook: "Cuaderno Terapéutico",
  navMyEmotions: "Mis Emociones",
  navAssessmentReview: "Ver Preguntas",
  // Welcome Page / Dashboard (Old, parts might be reused or removed)
  welcomeToWorkWell: "Te damos la bienvenida a EMOTIVA, un espacio para reconectar contigo. Este viaje es personal.",
  startYourJourney: "Comienza tu viaje hacia el bienestar",
  takeInitialAssessment: "Realizar Evaluación Inicial",
  continueYourPath: "Continúa tu Ruta",
  // Assessment
  assessmentTitle: "Evaluación Psicológica Inicial",
  assessmentIntro: "Conocer cómo estás hoy es el primer paso para cuidarte. Tómate unos minutos, este espacio es solo para ti.",
  startAssessment: "Comenzar Evaluación",
  dimensionProgress: "Dimensión {current} de {total}",
  itemProgress: "Ítem {currentItem} de {totalItems} (Sección {currentDim}/{totalDims})",
  nextItem: "Siguiente",
  previousItem: "Ítem Anterior",
  nextDimension: "Siguiente Dimensión",
  previousDimension: "Dimensión Anterior",
  finishAssessment: "Finalizar Evaluación",
  assessmentResultsTitle: "Resultados de tu Evaluación",
  emotionalProfile: "Perfil Emocional (Puntuación)",
  priorityAreas: "Tus Áreas Prioritarias",
  summaryAndRecommendations: "Resumen General y Recomendaciones",
  startPathFor: "Comenzar ruta para {area}",
  dimensionCompletedTitle: "Sección Completada",
  dimensionCompletedMessage: "¡Muy bien! Has completado la sección {dimensionNumber} de {totalDimensions}.",
  continueButton: "Continuar",
  saveForLaterButton: "Guardar y Continuar Luego",
  radarChartDescription: "Visualización de tu perfil en las diferentes dimensiones.",
  priorityAreasDescription: "Dimensiones clave para tu desarrollo actual.",
  detailedAnalysisTitle: "Análisis Detallado por Dimensión",
  scoreLevelLow: "Bajo",
  scoreLevelMedium: "Medio",
  scoreLevelHigh: "Alto",
  scoreLevelVeryHigh: "Muy Alto",
  generatedAssessmentSaveUrlLabel: "URL de Guardado de Evaluación (Depuración)",
  assessmentCompletedModalTitle: "Evaluación Completada",
  assessmentProcessingModalMessage: "Estamos preparando tu perfil emocional…",
  assessmentResultsReadyTitle: "¡Resultados Listos!",
  assessmentResultsReadyMessage: "Tu perfil emocional personalizado ya está disponible.",
  assessmentSavedSuccessTitle: "Evaluación Guardada",
  assessmentSavedSuccessMessage: "Tus resultados de evaluación han sido guardados en el servidor.",
  assessmentSavedErrorTitle: "Error al Guardar Evaluación",
  assessmentSavedErrorMessageApi: "El servidor respondió con un error: {message}",
  assessmentSavedErrorNetworkTitle: "Error de Comunicación",
  assessmentSavedErrorNetworkMessage: "No se pudo guardar la evaluación en el servidor (HTTP {status}). Detalles: {details}",
  assessmentSavedErrorGeneric: "Ocurrió un error desconocido al intentar guardar tu evaluación.",
  assessmentSavedErrorTimeout: "Tiempo de espera agotado al guardar la evaluación.",
  assessmentSavedErrorFetchFailed: "Fallo en la comunicación con el servicio de guardado. Esto podría deberse a un problema de red o una restricción CORS del servidor. Revisa la consola del navegador para más detalles.",
  assessmentSaveSkippedTitle: "Guardado Omitido",
  assessmentSaveSkippedMessage: "No se pudo identificar al usuario para guardar la evaluación. Podrás ver tus resultados, pero no se sincronizarán.",
  // My Assessments Page
  myAssessmentsTitle: "Mis Evaluaciones",
  myAssessmentsDescription: "Aquí puedes ver el historial de tus evaluaciones completadas.",
  viewAssessmentResultsButton: "Ver Resultados",
  assessmentDateLabel: "Evaluación del {date}",
  noAssessmentsFound: "Aún no has completado ninguna evaluación.",


  // Assessment Intro Page
  assessmentIntroPageTitle: "Bienvenido/a a tu primer paso",
  assessmentIntroPageTagline: "Este cuestionario no es solo una evaluación. Es un momento contigo. Una invitación a mirar hacia dentro con honestidad, curiosidad y sin juicio.",
  assessmentIntroPageMainText1: "Vas a encontrar frases que hablan de ti: cómo sueles sentirte, pensar, actuar… y cómo estás viviendo tu presente emocional.\nAlgunas te resultarán fáciles. Otras te harán parar y reflexionar. Y eso está bien.\nCada respuesta es un paso más hacia tu bienestar.",
  assessmentIntroPagePurposeTitle: "¿Para qué sirve?",
  assessmentIntroPagePurpose1: "Conocerte mejor.",
  assessmentIntroPagePurpose2: "Detectar tus necesidades actuales.",
  assessmentIntroPagePurpose3: "Activar rutas de desarrollo personal adaptadas a ti.",
  assessmentIntroPageWhatToKnowTitle: "¿Qué necesitas saber?",
  assessmentIntroPageWhatToKnowDurationLabel: "Duración:",
  assessmentIntroPageWhatToKnowDurationText: "5–7 minutos.",
  assessmentIntroPageWhatToKnowContentLabel: "Contenido:",
  assessmentIntroPageWhatToKnowContentText: "Aspectos clave de tu personalidad, estado emocional y forma de afrontar retos.",
  assessmentIntroPageWhatToKnowFormatLabel: "Formato:",
  assessmentIntroPageWhatToKnowFormatText: "Escala tipo Likert del 1 al 5 (según tu grado de acuerdo o identificación con cada afirmación).",
  assessmentIntroPageWhatToKnowResultsLabel: "Resultados:",
  assessmentIntroPageWhatToKnowResultsText: "Perfil emocional interpretado + recomendaciones personalizadas.",
  assessmentIntroPageWhatToKnowPrivacyLabel: "Privacidad:",
  assessmentIntroPageWhatToKnowPrivacyText: "Tus respuestas son confidenciales y no se comparten.",
  assessmentIntroPageImportantLabel: "Importante:",
  assessmentIntroPageImportantText: "Esta evaluación no es un diagnóstico formal ni sustituye un proceso terapéutico clínico.",
  assessmentIntroPageFinalWords: "Tómate tu tiempo. Respira. Responde con sinceridad.\nEste camino empieza en ti. Y no estarás solo/a.",
  assessmentIntroPageStartButton: "Comenzar Evaluación",

  // Assessment Results Intro Page
  assessmentResultsIntroTitle: "Gracias por este momento contigo",
  assessmentResultsIntroMainText1: "Tus respuestas han trazado un mapa emocional único: un reflejo sincero de cómo estás, cómo sientes y cómo afrontas la vida.",
  assessmentResultsIntroMainText2: "En la siguiente pantalla, descubrirás tu perfil personal-emocional interpretado:",
  assessmentResultsIntroListItem1: "Un resumen visual claro.",
  assessmentResultsIntroListItem2: "Una lectura profesional de tus fortalezas y ámbitos en desarrollo.",
  assessmentResultsIntroListItem3: "Sugerencias prácticas para cuidarte desde dentro.",
  assessmentResultsIntroMainText3: "Este perfil no te etiqueta ni te limita. Es una guía flexible para avanzar con más consciencia, claridad y dirección.",
  assessmentResultsIntroMainText4: "Además, hemos activado para ti rutas personalizadas basadas en tu estilo emocional.",
  assessmentResultsIntroViewProfileButton: "Ver mi perfil emocional",

  // Paths
  pathsTitle: "Rutas de Desarrollo",
  selectPathPrompt: "Elige una ruta para trabajar en tu bienestar.",
  module: "Módulo",
  startModule: "Comenzar Módulo",
  markAsCompleted: "Marcar como completado",
  markAsNotCompleted: "Marcar como No Completado",
  completed: "Completado",
  startReading: "Iniciar Lectura",
  moduleCompletedTitle: "¡Módulo Completado!",
  moduleCompletedMessage: "Has completado el módulo '{moduleTitle}'.",
  pathCompletedTitle: "¡Ruta Completada!",
  pathCompletedMessage: "¡Enhorabuena! Has completado todos los módulos de la ruta '{pathTitle}'. ¡Sigue así explorando tu bienestar!",
  continueLearning: "Seguir Aprendiendo",
  modulesLeftTooltip: "{count} módulos restantes en '{pathTitle}'",
  allPaths: "Volver a todas las Rutas",
  myPathsSummaryTitle: "Mi Resumen de Rutas",
  myPathsSummaryDescription: "Aquí puedes ver tu progreso en todas las rutas de desarrollo.",
  viewMyPathsSummaryButton: "Ver mi resumen de rutas",
  completedModules: "{completed} de {total} módulos",
  continuePath: "Continuar Ruta",
  startPath: "Comenzar Ruta",
  pathNotStarted: "Aún no has comenzado esta ruta.",
  // Chatbot
  chatbotTitle: "Mentor Emocional IA",
  chatbotWelcome: "Hola, estoy aquí para escucharte y acompañarte. ¿En qué quieres trabajar hoy?",
  chatbotInputPlaceholder: "Escribe tu mensaje aquí...",
  // Resources
  resourcesTitle: "Biblioteca de Recursos",
  resourcesIntro: "Aquí encontrarás herramientas que nutren tu bienestar emocional. Explora a tu ritmo.",
  resourceTypeArticle: "Artículo",
  resourceTypeAudio: "Audio",
  resourceTypeExercise: "Ejercicio",
  // Settings
  settingsTitle: "Configuración de Cuenta",
  personalInformation: "Información Personal",
  objectives: "Objetivos Personales",
  notificationPreferences: "Preferencias de Notificación",
  privacyAndSecurity: "Privacidad y Seguridad",
  language: "Idioma",
  saveChanges: "Guardar Cambios",
  devUtilitiesTitle: "Utilidades de Desarrollo",
  clearEmotionalEntriesButton: "Borrar Registros Emocionales",
  clearEmotionalEntriesSuccessTitle: "Registros Borrados",
  clearEmotionalEntriesSuccessMessage: "Todos los registros emocionales han sido eliminados.",
  activateEmotionalDashboardButton: "Activar Dashboard Emocional",
  deactivateEmotionalDashboardButton: "Desactivar Dashboard Emocional",
  emotionalDashboardActivated: "Dashboard Emocional activado.",
  emotionalDashboardDeactivated: "Dashboard Emocional desactivado.",
  settingsSkipIntroScreensTitle: "Omitir Pantallas Introductorias",
  settingsSkipIntroScreensDescription: "Accede directamente al contenido principal de secciones como la evaluación o los resultados, omitiendo las pantallas informativas previas.",
  
  // Change Password
  changePasswordTitle: "Cambiar Contraseña",
  changePasswordButtonLabel: "Cambiar Contraseña",
  newPasswordLabel: "Nueva Contraseña",
  confirmNewPasswordLabel: "Confirmar Nueva Contraseña",
  passwordsDoNotMatchError: "Las contraseñas no coinciden.",
  passwordChangedSuccessTitle: "Contraseña Cambiada",
  passwordChangedSuccessMessage: "Tu contraseña ha sido actualizada exitosamente. Serás redirigido para iniciar sesión.",
  passwordChangeErrorTitle: "Error al Cambiar Contraseña",
  passwordTooShortError: "La nueva contraseña debe tener al menos 6 caracteres.",
  passwordChangeGenericError: "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
  userEmailMissingError: "No se pudo obtener el email del usuario para el cambio de contraseña.",
  validationError: "Error de validación.",
  securitySettings: "Seguridad de la Cuenta",

  // Delete Account
  deleteAccountSectionTitle: "Borrar mi usuario", 
  deleteAccountButtonLabel: "Dar de baja mi cuenta",
  deleteAccountPageTitle: "Confirmar Baja de Cuenta",
  deleteAccountWarningTitle: "¡Atención! Estás a punto de eliminar tu cuenta.",
  deleteAccountWarningMessage: "Esta acción es irreversible. Todos tus datos, incluyendo tu perfil, progreso en rutas, registros emocionales y cualquier otra información asociada a tu cuenta, serán eliminados permanentemente del sistema. No podrás recuperarlos una vez que confirmes la baja.",
  deleteAccountConfirmationPrompt: "¿Estás seguro/a de que deseas proceder con la baja definitiva de tu cuenta?",
  confirmDeleteAccountButton: "Sí, eliminar mi cuenta permanentemente",
  cancelDeleteAccountButton: "Cancelar, mantener mi cuenta",
  deleteAccountSuccessTitle: "Cuenta Eliminada",
  deleteAccountSuccessMessage: "Tu cuenta ha sido eliminada exitosamente. Serás redirigido.",
  deleteAccountErrorTitle: "Error al Eliminar Cuenta",
  deleteAccountErrorMessage: "No se pudo eliminar tu cuenta en este momento. Por favor, inténtalo de nuevo más tarde o contacta con soporte.",
  // Age Ranges
  age_under_18: "Menor de 18",
  age_18_24: "18-24",
  age_25_34: "25-34",
  age_35_44: "35-44",
  age_45_54: "45-54",
  age_55_64: "55-64",
  age_65_plus: "65 o más",
  // Genders
  gender_male: "Masculino",
  gender_female: "Femenino",
  gender_non_binary: "No binario",
  gender_other: "Otro",
  gender_prefer_not_to_say: "Prefiero no decirlo",
  // Theme
  theme: "Tema",
  themeSettingsTitle: "Apariencia",
  themeLight: "Claro",
  themeDark: "Oscuro",
  themeSystem: "Sistema",
  selectThemePrompt: "Elige cómo quieres que se vea la aplicación.",

  // Dashboard Emocional
  dashboardGreeting: "Así va tu camino",
  quickSummary: "Resumen Rápido",
  currentWellbeing: "Tu Bienestar Hoy",
  wellbeingPlaceholder: "Estable",
  wellbeingDescription: "Basado en tu último registro emocional.",
  progressSinceLast: "Ruta en Curso",
  progressPlaceholder: "Ninguna",
  progressDescription: "Inicia una ruta desde la sección de Rutas",
  inFocus: "Área Prioritaria",
  inFocusPlaceholder: "Autoconocimiento",
  inFocusDescription: "Tu principal área de enfoque según tu última evaluación.",
  nextStep: "Registros esta Semana",
  nextStepPlaceholder: "0 registros",
  nextStepDescription: "¡Sigue así para conocerte mejor!",
  emotionalRegistry: "Registro Emocional",
  registerEmotion: "Autorregistro",
  myEmotionalProfile: "Mi Perfil Emocional",
  myEmotionalProfileDescription: "Una vista multidimensional de tu estado.",
  myEvolution: "Mi Evolución del Ánimo",
  myEvolutionDescription: "Sigue tus cambios a lo largo del tiempo.",
  viewDetails: "Ver detalles",
  emotionalDashboardDisabledMessage: "El registro emocional y las visualizaciones avanzadas están desactivadas.",

  // Emotional Entry Form
  registerEmotionDialogTitle: "Nuevo Registro Emocional",
  registerEmotionDialogDescription: "Describe cómo te sientes. Este espacio es para ti.",
  situationLabel: "¿Qué situación relevante viviste hoy o recientemente?",
  situationPlaceholder: "Ej: Tuve una reunión importante, recibí una noticia, tuve una conversación difícil...",
  thoughtLabel: "¿Qué pensaste en ese momento?",
  thoughtPlaceholder: "Ej: 'No soy capaz', 'Todo va a salir mal', 'Esto es injusto'...",
  emotionLabel: "¿Qué emoción principal sentiste?",
  emotionPlaceholder: "Selecciona una emoción",
  saveEntryButton: "Guardar Registro",
  emotionalEntrySavedTitle: "Registro Guardado",
  emotionalEntrySavedMessage: "Tu entrada emocional ha sido guardada con éxito.",
  fillAllFields: "Por favor, completa todos los campos requeridos.",
  
  // Expanded Emotions
  emotionJoy: "Alegría",
  emotionSadness: "Tristeza",
  emotionFear: "Miedo",
  emotionAnger: "Ira",
  emotionDisgust: "Asco",
  emotionSurprise: "Sorpresa",
  emotionStress: "Estrés",
  emotionAnxiety: "Ansiedad",
  emotionOverwhelm: "Agobio",
  emotionTension: "Tensión",
  emotionAlarm: "Alarma",
  emotionEmotionalTiredness: "Cansancio emocional",
  emotionDiscouragement: "Desaliento",
  emotionEmptiness: "Vacío",
  emotionHope: "Ilusión",
  emotionEnthusiasm: "Entusiasmo",
  emotionHopefulness: "Esperanza",
  emotionFrustration: "Frustración",
  emotionLove: "Amor",
  emotionTrust: "Confianza",
  emotionRejection: "Rechazo",
  emotionLoneliness: "Soledad",
  emotionJealousy: "Celos",
  emotionEnvy: "Envidia",
  emotionShame: "Vergüenza",
  emotionGuilt: "Culpa",
  emotionInsecurity: "Inseguridad",
  emotionPride: "Orgullo",
  emotionConfusion: "Confusión",
  emotionAmbivalence: "Ambivalencia",

  // Recent Emotional Entries
  recentEmotionalEntriesTitle: "Mis Registros Emocionales Recientes",
  noRecentEntries: "Aún no tienes registros emocionales. ¡Anímate a crear el primero!",
  entryRegisteredOn: "Registrado el {date}:",
  viewAllEntriesButton: "Ver todos los registros",

  // Mood Evolution Chart
  notEnoughDataForChart: "Registra al menos dos emociones para ver tu evolución.",
  moodScoreLabel: "Puntuación de Ánimo",

  // Full Emotional History Page
  fullEmotionalHistoryTitle: "Historial Emocional Completo",
  backToDashboard: "Volver al Panel",
  myEvolutionFullHistoryDescription: "Evolución completa de tu estado de ánimo a lo largo del tiempo.",
  allEmotionalEntriesTitle: "Todos los Registros Emocionales",
  allEmotionalEntriesDescription: "Aquí puedes ver todas tus entradas emocionales ordenadas por fecha.",
  noEntriesYet: "Aún no tienes registros emocionales.",

  // Therapeutic Notebook Page
  therapeuticNotebookTitle: "Cuaderno Terapéutico",
  therapeuticNotebookDescription: "Un espacio privado para tus reflexiones y ejercicios.",
  noNotebookEntries: "Aún no tienes entradas en tu cuaderno. Completa los ejercicios de reflexión en las rutas para empezar.",

  // Welcome Page
  welcomePageTitle: "Bienvenido/a: Este espacio es para ti",
  welcomePageMainText1: "Hay momentos en los que algo dentro de nosotros pide atención.\\nTal vez te sientes apagado/a, desbordado/a, desconectado/a… o simplemente sabes que podrías estar mejor, con más claridad, energía o sentido.",
  welcomePageMainText2: "Esta app nace para acompañarte en ese camino.\\nAquí no hay etiquetas, diagnósticos ni exigencias. Solo un espacio íntimo, diseñado con base científica y con mucho respeto, para ayudarte a entender cómo estás, qué necesitas y por dónde puedes empezar a cuidarte de verdad.\\nA través de una evaluación breve y sencilla, descubrirás tu perfil personal y emocional actual. No para juzgarte, sino para ofrecerte un mapa que te oriente. A partir de ahí, activaremos rutas personalizadas con prácticas breves, validadas y pensadas para mejorar tu bienestar día a día.",
  welcomePageLegalDisclaimer: "Aviso legal: Esta app no sustituye un proceso terapéutico clínico. Es una herramienta profesional de acompañamiento emocional y crecimiento personal.",
  welcomePageMotivationalQuote: "Estás a un clic de comenzar a escucharte de verdad.\\nY eso, aunque no lo parezca, ya es un acto de valentía.",
  welcomePageStartAssessmentButton: "Iniciar mi evaluación personalizada",
  welcomePageSkipToDashboardButton: "Ir al Panel Principal",

  // Daily Check-in Page
  dailyCheckInPageTitle: "Pregunta del Día",
  dailyCheckInPageDescription: "Una pequeña pausa para conectar contigo.",
};

export type Translations = typeof t;

// A simple hook to access translations for V1. Can be replaced with a full i18n library.
export function useTranslations(): Translations {
  return t;
}

```
- src/lib/utils.ts:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```
- src/next.config.js:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      }
    ],
  },
  productionBrowserSourceMaps: false, // Deshabilita source maps en producción
};

module.exports = nextConfig;

```
- src/package.json:
```json
{}

```
- src/types/daily-question.ts:
```ts

export interface DailyQuestion {
  id: string; // This will map from 'codigo'
  text: string; // This will map from 'pregunta'
}

```
- src/types/mood-check-in.ts:
```ts

export interface MoodCheckIn {
  id: string;
  mood: string; // 'muy-mal', 'mal', etc.
  score: number;
  timestamp: Date; // Now always a Date object for consistency
}

```
- src/types/page-props.ts:
```ts
// This file is intentionally left blank.
// Defining global page prop types can conflict with Next.js's internal type generation.
// It's safer to define props locally within each page component file.

```
- tailwind.config.ts:
```ts
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

```
- tsconfig.json:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/components/*": [
        "./src/components/*"
      ]
    },
    "target": "ES2018",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "workspaceOLD",
    ".next"
  ]
}

```
- workspaceOLD/apphosting.yaml:
```yaml
# This file is deprecated.

```
- workspaceOLD/package.json:
```json
{}

```
- workspaceOLD/src/ai/actions/chatbot.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/flows/emotional-chatbot.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/genkit.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/rag/embed.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/rag/retrieve.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/scripts/index-storage.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/scripts/test-retrieve.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/ai/scripts/trace-retrieve.ts:
```ts
// This file is deprecated.

```
- workspaceOLD/src/lib/firebase-admin.ts:
```ts
// This file is deprecated.

```Perfecto, he recibido la nueva descripción para el ejercicio 2 de la semana 2 en la Ruta 12. Procederé a reconstruir el componente `MorningRitualExercise.tsx` para que se ajuste a este nuevo flujo de 6 pasos.

Aquí tienes los cambios aplicados:

<changes>
  <description>He actualizado el ejercicio "Mi Ritual de Inicio" de la Ruta 12 para seguir un nuevo flujo de 6 pasos. He modificado el componente `MorningRitualExercise.tsx` para incluir los nuevos pasos de selección de hábitos, configuración de duración y recordatorios, una tabla de resumen, y la pantalla final de refuerzo. También he actualizado el texto del objetivo en el archivo `wellbeingPath.ts` para que coincida con la nueva descripción.</description>
  <change>
    <file>src/data/paths/wellbeingPath.ts</file>
    <content><![CDATA[
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
export const wellbeingPath: Path = {
  id: 'volver-a-sentirse-bien',
  title: 'Volver a lo que me hace sentir bien',
  description: 'Reconecta con tus fuentes de bienestar, recupera rutinas que te sostienen y aprende a activar tu motivación incluso en los días más grises.',
  dataAiHint: 'wellbeing motivation energy',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Introruta12.mp3`,
  modules: [
    {
      id: 'bienestar_sem1',
      title: 'Semana 1: Reconecta con tus Fuentes de Bienestar',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'El ánimo bajo se alimenta de un círculo difícil: haces menos cosas que disfrutas → recibes menos placer → tu ánimo baja más. En esta primera semana aprenderás a romper ese ciclo recordando qué cosas, personas y lugares te recargan. Crearás tu propio mapa de gratificación emocional y empezarás a observar qué te da energía y qué te la quita en tu día a día. Así tendrás un punto de partida claro: saber a qué recurrir cuando tu batería se queda en rojo.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Introsesion1ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando tu batería se queda en rojo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio1sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: '¿Has tenido días en los que te sientes como un móvil con la batería al 5%? No importa cuánto descanses, parece que nada te recarga del todo. Estar bajo de ánimo es parecido: tu energía física, mental y emocional se apagan un poco. Lo que antes te motivaba ahora cuesta más, y hasta las cosas simples pueden parecer un esfuerzo enorme. Esta semana vamos a explorar cómo recargar esa batería sin depender de chispazos momentáneos, sino construyendo energía que dure.' }]
        },
        {
          type: 'collapsible',
          title: 'No todo malestar es igual: tristeza, ánimo bajo y depresión',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio2sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Imagina tres intensidades de “nubes” que pueden tapar tu cielo:' }, { type: 'list', items: ["Tristeza: nube pasajera, suele aparecer tras una pérdida o decepción. Se disipa con el tiempo o con apoyo.", "Estado de ánimo bajo: nubosidad persistente; no hay tormenta, pero el sol apenas asoma. Hay apatía, baja energía y menos disfrute.", "Depresión: tormenta prolongada e intensa; afecta a tu forma de pensar, sentir y actuar, e interfiere en tu vida diaria. Requiere intervención profesional."] }, { type: 'paragraph', text: 'En esta ruta trabajaremos el estado de ánimo bajo, esa fase intermedia que muchas veces pasa desapercibida… pero que, si la cuidamos, podemos revertir antes de que se intensifique.\n\nAhora que tienes claro de qué estamos hablando, vamos a ver de dónde suele venir este estado.' }]
        },
        {
          type: 'collapsible',
          title: 'De dónde viene el estado de ánimo bajo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio3sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'El ánimo no baja “porque sí”. Suele ser el resultado de varios hilos que se entrelazan:' }, { type: 'list', items: ["Eventos de vida y estrés: pérdidas, cambios importantes, problemas continuos.", "Manera de pensar: creencias aprendidas y patrones de pensamiento que amplifican lo negativo y minimizan lo positivo.", "Relaciones: entornos críticos, poco apoyo o vínculos que drenan tu energía.", "Factores biológicos: cambios en neurotransmisores como la serotonina o la dopamina, que afectan tu motivación y capacidad de disfrutar.", "Hábitos y estilo de vida: falta de sueño, poca actividad física, alimentación desequilibrada."] }, { type: 'paragraph', text: 'Además, el estado de ánimo bajo se alimenta de un doble vacío:\n- La sensación de poco dominio sobre tu vida: cuando sientes que no puedes influir en lo que pasa, tu motivación se apaga.\n- La falta de gratificaciones reales: cuando apenas hay momentos de disfrute o satisfacción, el cerebro recibe pocas señales de “esto vale la pena repetirlo”, y se instala la apatía.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué ocurre en tu cuerpo y tu mente',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio4sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: "Cuando el ánimo baja, no es solo cuestión de “pensar en positivo”." }, { type: 'list', items: ["Tu cerebro emocional (amígdala) envía señales de alerta constantes, activando tensión y cansancio.", "Tu cerebro pensante (corteza prefrontal) pierde un poco de claridad y energía para planificar o decidir.", "Tus músculos, tu respiración y tu postura cambian, enviando mensajes silenciosos de que “todo pesa más”."] }, { type: 'paragraph', text: 'Según la neurociencia afectiva, estos cambios forman un bucle: menos energía → menos acción → menos placer → más ánimo bajo.\nPara romperlo, necesitamos entender de dónde viene nuestra energía vital y cómo mantenerla.' }]
        },
        {
          type: 'collapsible',
          title: 'La energía vital: mucho más que no estar cansado/a',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio5sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Piensa en tu energía como en un fuego:' }, { type: 'list', items: ["Se alimenta de combustible físico (descanso, alimentación, movimiento).", "Necesita chispa emocional (momentos que te hagan sentir vivo/a).", "Y se mantiene con aire mental (propósitos, curiosidad, retos alcanzables)."] }, { type: 'paragraph', text: 'Sin alguno de estos elementos, la llama se reduce y el ánimo baja.\nIncluso acciones de solo 10 minutos —como salir a la luz natural o tener una conversación agradable— pueden avivar ese fuego.' }]
        },
        {
          type: 'collapsible',
          title: 'El espejismo de la gratificación inmediata',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio6sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando la batería está baja, buscamos enchufes rápidos: comer algo dulce, mirar redes, ver series sin parar…\nEsto es gratificación inmediata: placer rápido, pero que dura lo que un sorbo de café en un día de frío.\nEl bienestar sostenido, en cambio, es como encender una estufa que mantiene el calor mucho después: caminar, retomar un hobby, hablar con alguien que te importa.\nComo recuerda la Terapia Cognitivo-Conductual, las acciones que más levantan el ánimo suelen ser las que menos apetece hacer al principio.' }]
        },
        {
          type: 'collapsible',
          title: 'Tu cerebro también busca recompensas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio7sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Dentro de tu cabeza hay un sistema de recompensa que se activa no solo cuando consigues algo, sino también cuando lo anticipas.' }, { type: 'list', items: ["Dopamina: la chispa que te mueve a actuar.", "Núcleo accumbens: el radar de lo que puede hacerte sentir bien.", "Corteza prefrontal: la que decide si vas hacia lo que de verdad importa o hacia lo que solo alivia un rato."] }, { type: 'paragraph', text: 'Cuando eliges conscientemente actividades con sentido, entrenas a tu cerebro para pedir más de eso.\nY ese es el camino para reconectar con lo que antes te hacía bien.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué reconectar con lo que te hacía bien es clave',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio8sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'El estado de ánimo bajo te empuja a hacer menos → recibes menos placer → tu ánimo baja más.\nRomper ese círculo no siempre empieza con ganas; muchas veces empieza con acción consciente:' }, { type: 'list', items: ["Retomar algo que antes disfrutabas.", "Probar una versión más pequeña de una actividad que te gustaba.", "Buscar compañía que te aporte calma o risa."] }, { type: 'paragraph', text: '“No esperes a tener ganas para empezar; empieza, y las ganas llegarán después.” — Principio de activación conductual.' }]
        },
        {
          type: 'collapsible',
          title: 'Empezar por las actividades: un primer paso probado por la ciencia',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Audio9sesion1ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente suele decir: “No tengo fuerzas, primero necesito sentirme mejor para hacer cosas”.\nLa investigación en Terapia Cognitivo-Conductual muestra justo lo contrario: empezar a hacer cosas que te aportan placer o logro es uno de los primeros pasos más efectivos para mejorar el estado de ánimo, incluso en depresión.\nEs como encender una luz tenue en una habitación oscura: al principio no ilumina todo, pero te permite moverte, encontrar otros interruptores y, poco a poco, llenar la habitación de claridad.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'emotionalGratificationMapExercise', title: 'EJERCICIO 1: MAPA DE GRATIFICACIÓN EMOCIONAL', objective: 'Este ejercicio te ayudará a reconectar con tus fuentes de bienestar (actividades, personas o lugares) y a tener un mapa personal al que acudir cuando necesites recargar energía emocional.', duration: '7-10 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana1tecnica1.mp3` },
        { type: 'dailyEnergyCheckExercise', title: 'EJERCICIO 2: MINI-CHECK DE ENERGÍA DIARIA', objective: '¿Te has fijado en que hay días en los que terminas con más energía que otros, incluso haciendo cosas parecidas?    Esto ocurre porque, a lo largo de la jornada, hay actividades, personas y entornos que recargan tu batería y cuáles la gastan más rápido.   Este ejercicio te ayudará a identificar ambos tipos para que, poco a poco, puedas elegir más de lo que te suma y reducir lo que te drena. En pocas semanas, empezarás a ver patrones claros sobre qué cuidar y qué evitar.', duration: '3-5 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana1tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Reflexionssesion1ruta12.mp3`, prompts: ["<p>Esta semana hemos explorado de dónde viene nuestra energía y cómo podemos recargarla de forma más sostenible. Ahora es momento de parar, mirar atrás y anotar lo que descubriste en tu propio camino.</p><p><b>Preguntas para reflexionar y escribir:</b></p><ul><li>¿Qué he descubierto sobre mis niveles de energía y cómo suelo hacerme cargo de ellos?</li><li>¿Hubo algo que me sorprendiera al observar mi energía día a día?</li><li>¿Qué cosas identifiqué como “drenaje” y cómo puedo reducir su impacto?</li><li>Si tuviera que elegir una sola acción para mantener mi energía la próxima semana, ¿cuál sería?</li><li>¿Cómo puedo recordarme a mí mismo/a que no tengo que esperar a tener ganas para empezar a cuidarme?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion1/Resumensesion1ruta12.mp3` },
        { type: 'list', items: ["El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales que podemos aprender a cuidar.", "Nuestra energía vital se sostiene en hábitos básicos, chispa emocional y dirección mental.", "Las gratificaciones rápidas (como redes, azúcar o maratones de series) alivian a corto plazo, pero no recargan a largo plazo.", "Reconectar con lo que antes nos hacía bien es una de las formas más potentes de romper el ciclo de ánimo bajo.", "Planificar y hacer actividades gratificantes, aunque no haya ganas al principio, es una estrategia validada por la ciencia para recuperar el ánimo."] },
        { type: 'quote', text: 'Cada paso que das para cuidar tu energía es una inversión en tu bienestar. No importa si es grande o pequeño: lo importante es que sigues encendiendo tu propia luz.' }
      ]
    },
    {
      id: 'bienestar_sem2',
      title: 'Semana 2: Recupera Rutinas que te Nutran',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'Cuando estamos bajos de ánimo, lo primero que suele romperse es lo más básico: dormir bien, comer con calma, mover el cuerpo. Esto aumenta el malestar y nos deja más vulnerables. Esta semana aprenderás a reinstalar pequeños rituales de cuidado —microhábitos físicos, emocionales y mentales— que actúan como anclas en tu día. No se trata de hacer todo perfecto, sino de tener gestos breves, amables y repetidos que te devuelvan estabilidad y energía.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Introsesion2ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando lo básico empieza a fallar',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio1sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: '¿Te ha pasado que, en momentos difíciles, lo primero que se desordena es lo que te sostiene?\nDormimos peor, comemos rápido, dejamos de movernos… y, sin darnos cuenta, el malestar crece.\nEsta semana vamos a volver a lo esencial: recuperar esas rutinas que te alimentan por dentro y por fuera, que estabilizan tus días y te devuelven energía. No hablamos de forzarte a hacer todo perfecto, sino de crear pequeños anclajes que te ayuden a sentirte más estable y con más fuerza para afrontar lo que venga.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutinas que son anclas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio2sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Las rutinas saludables no son simples tareas repetidas: son anclas emocionales que estabilizan tu día, regulan tu estado de ánimo y alimentan tu motivación. Desde la neurociencia del estrés sabemos que cuando cuidas lo básico —alimentación, descanso y movimiento— tu sistema nervioso interpreta que estás a salvo, lo que reduce la sobreactivación de la amígdala (la “alarma” emocional) y te ayuda a pensar con más claridad. Si además incluyes actividades que disfrutas y te hacen sentir logro —como caminar, bailar, cocinar algo rico o retomar un hobby—, activas circuitos de recompensa que liberan dopamina y serotonina, potenciando tu bienestar y tu motivación.' }]
        },
        {
          type: 'collapsible',
          title: 'El papel de las rutinas en tu equilibrio emocional',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio3sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Recuperar rutinas que te nutren no solo mejora tu energía física: fortalece tu estabilidad emocional. Las acciones que repites cada día actúan como un hilo conductor que te ayuda a mantener el rumbo incluso cuando hay turbulencias. Cuando estás en tus rutinas de cuidado: pones nombre a lo que sientes, aceptas sin juicio y eliges cómo responder. Esto te da más claridad y paz mental. Además, practicar habilidades como la asertividad, la solución de problemas o el mindfulness, según Jon Kabat-Zinn, reduce la reactividad automática y te ayuda a mantenerte centrado/a incluso en momentos difíciles.' }]
        },
        {
          type: 'collapsible',
          title: 'Cuando las rutinas se rompen',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio4sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'En momentos duros, solemos descuidar justo lo que más nos sostiene:' }, { type: 'list', items: ["Dormimos peor.", "Nos movemos menos.", "Comemos rápido o poco nutritivo."] }, { type: 'paragraph', text: 'Esto aumenta la vulnerabilidad física y emocional. En psicología lo llamamos un bucle de vulnerabilidad: cuanto peor te sientes, menos haces lo que te cuida, y cuanto menos te cuidas, peor te sientes.\n\nVolver a hábitos que nos cuidan no solo aporta estructura y previsibilidad: le devuelve a tu cuerpo y a tu mente la sensación de seguridad, y eso es la base para tomar mejores decisiones y recuperar energía.' }]
        },
        {
          type: 'collapsible',
          title: 'La fuerza de los pequeños pasos',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio5sesion2ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'La Terapia Cognitivo-Conductual y la psicología del hábito coinciden: no necesitas un cambio radical para notar mejoras.' }, { type: 'list', items: ["Moverte 10 minutos al día.", "Preparar un desayuno nutritivo.", "Reservar un rato para algo que disfrutas."] }, { type: 'paragraph', text: 'Estos gestos, aunque parezcan mínimos, generan una sensación de logro que alimenta tu motivación. En palabras de BJ Fogg, experto en hábitos, “el cambio se crea sintiéndote bien con lo que haces, no castigándote por lo que no haces”.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutina rígida vs. ritual de cuidado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio6sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'No todas las rutinas son iguales: algunas se vuelven rígidas y limitantes, mientras que otras actúan como un refugio flexible que te recarga.' },
            { type: 'list', items: ["Rutina rígida disfuncional → Inflexible, vivida como obligación, genera ansiedad ante cambios.  Ejemplo: “Tengo que correr 5 km todos los días o no vale la pena”.", "Ritual de cuidado → Intencional, flexible y enfocado en tu bienestar, adaptable a tus circunstancias.  Ejemplo: “Hoy no puedo correr, pero haré 15 minutos de estiramientos en casa”."] },
            { type: 'paragraph', text: 'Un ritual de cuidado no depende de que todo vaya bien para existir. Según la neurociencia del hábito, la flexibilidad y la asociación con emociones positivas aumentan la probabilidad de mantenerlo en el tiempo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Ideas para tus rituales de cuidado',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio7sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'Aquí tienes inspiración para crear los tuyos:' },
            { type: 'list', items: ["Autorreforzarte: darte pequeños premios o autoelogios sinceros cuando cumples tu objetivo.", "Priorizar el placer diario: dar espacio a lo que te gusta sin sentir culpa.", "Actividades agradables y de dominio: que te den sensación de logro y satisfacción (cocinar algo nuevo, aprender una habilidad).", "Mindfulness y flexibilidad emocional: aceptar emociones y sensaciones sin juicio, dejando que pasen por sí solas."] },
            { type: 'paragraph', text: 'Recuerda que el objetivo no es “tachar tareas”, sino crear experiencias que nutran tu cuerpo, tu mente y tu ánimo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Tu misión esta semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Audio8sesion2ruta12.mp3`,
          content: [
            { type: 'paragraph', text: 'Identifica y recupera al menos una rutina que te nutra. Hazlo pequeño, realista y disfrutable.' },
            { type: 'paragraph', text: 'No se trata solo de “hacer cosas sanas”: se trata de reconectar con lo que de verdad te hace sentir bien y mantenerlo incluso en días difíciles.' },
            { type: 'paragraph', text: 'En las próximas técnicas aprenderás a elegirla, adaptarla y mantenerla como una aliada para tu bienestar, pase lo que pase.' }
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'dailyWellbeingPlanExercise', 
          title: 'EJERCICIO 1: MI PLAN DIARIO DE BIENESTAR: 3 MICROHÁBITOS CLAVE', 
          objective: 'Hay días en los que sentimos que el tiempo se nos escapa y que nuestras rutinas se desordenan. \n\nLa buena noticia es que no necesitas cambios drásticos para recuperar la sensación de control: basta con anclar tu día a tres gestos pequeños, pero estratégicos, que sostengan tu cuerpo, tus emociones y tu mente. \n\nEste ejercicio es tu “plan maestro de autocuidado”: vas a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles. \n\nEstos serán tus anclas: puntos fijos que mantendrán tu bienestar estable sin importar lo que pase fuera. \n\nTiempo estimado: 6-8 minutos. Hazlo al inicio de la semana y repite siempre que sientas que has perdido tus rutinas.', 
          duration: '6-8 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana2tecnica1.mp3` 
        },
        { 
          type: 'morningRitualExercise', 
          title: 'EJERCICIO 2: MI RITUAL DE INICIO: UNA MAÑANA AMABLE E CONSCIENTE', 
          objective: 'En el ejercicio anterior trazaste tu plan maestro para cuidar de ti durante todo el día. Ahora vamos a encender ese plan desde el primer instante de la mañana, para que empiece a funcionar con tu primera respiración. Tus primeras acciones al despertar marcan el tono de todo lo que viene después. Si empiezas acelerado o en piloto automático, el día puede arrastrarte. Si empiezas con calma, intención y energía positiva, tendrás más control y claridad para todo lo demás. En este ejercicio vas a diseñar una rutina inicial breve —aunque sea de pocos minutos— que te permita aterrizar en tu día con presencia y equilibrio. Tiempo estimado: 8-10 minutos para diseñarla. Hazlo una vez y revisa cuando sientas que tu mañana necesita un ajuste.', 
          duration: '8-10 min', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana2tecnica2.mp3`
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Reflexionssesion2ruta12.mp3`, prompts: ["<p>En tu experiencia pasada, ¿qué papel crees que han jugado los hábitos en tu bienestar físico, emocional y mental?</p><ul><li>¿Cuando tus hábitos se debilitan o desaparecen, cómo sueles reaccionar y qué podrías hacer para asumir un papel más activo en recuperarlos?</li><li>¿Qué microhábitos o rituales has puesto en marcha y cómo te han hecho sentir?</li><li>¿Cómo cambia tu ánimo y tu energía cuando cuidas lo básico de tu cuerpo, tus emociones y tu mente?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion2/Resumensesion2ruta12.mp3` },
        { type: 'list', items: ["Tus rutinas son anclas emocionales que estabilizan tu día y te ayudan a pensar con más claridad.", "Cuidar lo básico (descanso, alimentación, movimiento) reduce la activación del sistema de alarma y mejora tu regulación emocional.", "Los microhábitos pequeños y realistas tienen un efecto acumulativo enorme en tu bienestar y motivación.", "La diferencia entre rutina rígida y ritual de cuidado está en la flexibilidad y la conexión con tu bienestar.", "Un buen inicio de día (mañana amable) actúa como chispa que enciende tu energía y tu foco para el resto de la jornada."] },
        { type: 'quote', text: 'El autocuidado no es un premio que te das cuando has sido productivo; es el punto de partida para poder serlo.' }
      ]
    },
    {
      id: 'bienestar_sem3',
      title: 'Semana 3: Reactiva la Motivación Bloqueada',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [{ type: 'paragraphWithAudio', text: 'Uno de los síntomas más comunes del ánimo bajo es la falta de ganas. Sabes lo que deberías hacer, pero el impulso no llega. La clave está en no esperar a tener ganas para empezar: muchas veces, la motivación aparece después de la acción. Esta semana entrenarás cómo dar el primer paso incluso sin motivación, conectando cada acción con tus valores y con la vida que quieres construir.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Introsesion3ruta12.mp3` },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Gancho emocional: Cuando las ganas no aparecen', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio1sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: '¿Te ha pasado que sabes exactamente lo que deberías hacer… pero no encuentras el impulso para empezar?\nLas “ganas” y la motivación están muy conectadas: las ganas son como la chispa inicial y la motivación, el motor que mantiene la acción en marcha. La buena noticia es que, según la ciencia —desde la Terapia Cognitivo-Conductual (TCC) hasta la neurociencia afectiva— no siempre tenemos que esperar a que aparezcan las ganas: muchas veces la motivación llega después de ponernos en movimiento.\nPara saber cómo lograrlo, primero vamos a entender qué es realmente la motivación y de dónde surge.' }] },
        { type: 'collapsible', title: 'La motivación: algo más que ganas', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio2sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'En pocas palabras, la motivación es ese empujón interno que nos mueve a hacer cosas que nos acercan a lo que nos hace bien y nos alejan de lo que nos perjudica.' }, { type: 'list', items: ["Un deseo de cambiar cómo nos sentimos (relajarnos, tener más energía, ganar claridad mental).", "Una emoción que nos impulsa: incluso las decisiones más “lógicas” tienen un fondo emocional.", "La anticipación de una recompensa: imaginar lo bien que nos sentiremos después activa la dopamina en el cerebro, una sustancia que nos empuja a actuar."] }, { type: 'paragraph', text: 'En otras palabras: no solemos buscar la acción por sí misma, sino la sensación que creemos que nos dará. Y, aun así, hay momentos en los que este motor parece apagarse. Veamos por qué.' }] },
        { type: 'collapsible', title: 'Por qué a veces las ganas no llegan', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio3sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'En etapas de ánimo bajo o depresión, es común perder la motivación positiva: sabemos lo que hay que hacer, pero sentimos que no tenemos energía. Esto puede deberse a:' }, { type: 'list', items: ["Pensamientos que desaniman (“es inútil intentarlo”, “no soy capaz”).", "Cansancio físico o mental.", "No tener claro cuándo, cómo o dónde empezar.", "Perfeccionismo: esperar el momento o las condiciones perfectas para actuar.", "Falta de conexión emocional con la tarea.", "Estrés o entornos poco estimulantes que reducen la motivación."] }, { type: 'paragraph', text: 'Estos bloqueos pueden sentirse como un muro… pero, como todo muro, se puede saltar, rodear o derribar. El primer paso es saber que sí se puede actuar incluso sin ganas, y que existen estrategias para lograrlo.' }] },
        { type: 'collapsible', title: 'Acción sin ganas: cómo es posible', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio4sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Si esperamos a “tener ganas” para movernos, podemos quedarnos atrapados en la inacción. La clave está en aprender a actuar incluso cuando la motivación está baja, usando tres apoyos:' }, { type: 'list', items: ["Disciplina: seguir adelante por compromiso con nuestros objetivos, no por un impulso momentáneo.", "Planificación clara: decidir de antemano cuándo y dónde haremos algo reduce las dudas y evita que lo posterguemos.", "Facilidad: ponértelo tan fácil que sea casi imposible no empezar (en terapia lo llamamos “bajar la rampa”)."] }, { type: 'paragraph', text: 'Así, el primer paso requiere muy poca energía y es más probable que lo des. Pero tan importante como cómo te pones en marcha, es desde dónde lo haces.' }] },
        { type: 'collapsible', title: 'Del “tengo que” al “quiero elegir”', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio5sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'La forma en la que te hablas cambia cómo percibes una tarea:' }, { type: 'list', items: ["“Tengo que”: suena a obligación, activa resistencia y nos lleva a evitar o postergar. Además, si no cumplimos los “tengo que”, luego nos sentimos muy mal.", "“Quiero” o “elijo”: conecta con lo que valoras y despierta motivación propia."] }, { type: 'paragraph', text: 'Ejemplo: “Tengo que hacer ejercicio” → “Quiero moverme para sentirme con más energía y cuidar mi salud”.\n\nEste cambio no es solo de palabras: también modifica cómo el cerebro procesa la tarea, activando zonas relacionadas con el sentido y la recompensa.\nY para que este cambio no se quede en palabras bonitas, vamos a conectar cada acción con algo más profundo: su valor y su sentido.' }] },
        { type: 'collapsible', title: 'Las capas de la motivación', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio6sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'La motivación tiene varias capas, como una cebolla:' }, { type: 'list', items: ["Acción concreta: lo que harás hoy.", "Valor personal: por qué eso es importante para ti.", "Sentido mayor: cómo encaja con la vida que quieres construir."] }, { type: 'paragraph', text: 'Por ejemplo: “Hoy voy a salir a caminar (acción concreta) porque valoro mi bienestar físico (valor personal) y quiero tener energía para jugar con mis hijos (sentido mayor)”.\n\nCuantas más capas actives, más fuerte será tu impulso para empezar y mantenerte.\n\nIncluso así, iniciar puede costar. Aquí es donde las microacciones se convierten en tu mejor aliado.' }] },
        { type: 'collapsible', title: 'El círculo de la activación', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio7sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Hasta ahora hemos visto cómo dar sentido a lo que haces para que tenga más fuerza. Aun así, puede que iniciar siga costando. Aquí entra un principio clave: la acción puede venir antes que las ganas. La acción y la motivación se alimentan mutuamente:' }, { type: 'list', items: ["Si no haces nada: menos satisfacción o sensación de logro → menos ganas → más bloqueo.", "Si das un paso (aunque pequeño): más satisfacción o logro → más ganas → más acción."] }, { type: 'paragraph', text: 'Este es el núcleo de la “activación conductual” (una estrategia muy usada en psicología): romper el ciclo de la inacción con gestos pequeños que pongan la rueda en marcha.   Ejemplos: abrir un libro y leer una página, mandar un mensaje corto, salir a la puerta con las zapatillas puestas.   Ahora que sabes cómo funciona este ciclo, vamos a practicarlo con dos ejercicios que te ayudarán a generar las ganas en lugar de esperarlas.' }] },
        { type: 'collapsible', title: 'Lo que vamos a entrenar esta semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Audio8sesion3ruta12.mp3`, content: [{ type: 'paragraph', text: 'Esta semana trabajaremos con dos herramientas clave:' }, { type: 'list', items: ["Motivación en 3 capas: para que cada acción esté conectada con un valor y un sentido que realmente te importen.", "Visualización del día que quiero vivir: para que cada mañana puedas imaginar cómo quieres sentirte y actuar, y usar esa imagen como guía para tu día."] }, { type: 'paragraph', text: 'El objetivo no es esperar a que las ganas lleguen, sino aprender a provocarlas. El primer paso lo das tú… y las ganas te encuentran en el camino.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'motivationIn3LayersExercise', title: 'EJERCICIO 1: MOTIVACIÓN EN 3 CAPAS', objective: 'Con este ejercicio vas a descubrir las tres capas que dan fuerza a la motivación: lo que haces, por qué lo haces y para qué mayor lo haces. Al completarla, tendrás un recordatorio claro que te ayudará a empezar incluso en días de poca energía.', duration: '7 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana3tecnica1.mp3` },
        { type: 'visualizeDayExercise', title: 'EJERCICIO 2: Visualización: El Día que Elijo Vivir', objective: 'Con este ejercicio vas a diseñar mentalmente el día que quieres vivir, conectándolo con sensaciones y comportamientos que te acerquen a tu mejor versión. Al practicarlo, tu mente y tu cuerpo se preparan para vivir lo que has imaginado.', duration: '5-7 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana3tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Reflexionssesion3ruta12.mp3`, prompts: ["<p>Tómate un momento para integrar lo que has trabajado:</p><ul><li>¿Qué has descubierto sobre la motivación y las ganas esta semana?</li><li>¿Qué conclusiones sacas sobre tu manera habitual de hacerte cargo de tu motivación y qué mejorarías?</li><li>¿Qué ejercicio o técnica te resultó más útil para activar tus ganas cuando estabas bloqueado/a?</li><li>¿Cómo ha cambiado tu forma de ver la motivación tras trabajar con las tres capas (acción–valor–sentido)?</li><li>¿En qué situaciones de esta semana sentiste que la motivación aumentó después de ponerte en marcha?</li><li>¿Qué compromiso concreto puedes asumir para seguir practicando la activación conductual y no depender solo de las ganas?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion3/Resumensesion3ruta12.mp3` },
        { type: 'list', items: ["La motivación no siempre precede a la acción; a menudo, la acción genera motivación.", "Cambiar el “tengo que” por “quiero” o “elijo” aumenta la motivación propia.", "Conectar cada acción con un valor personal y un sentido mayor le da fuerza y continuidad.", "La activación conductual rompe el ciclo de la inacción con gestos pequeños y fáciles.", "La visualización del día ideal prepara tu mente y tu cuerpo para actuar de forma coherente con tu intención."] },
        { type: 'quote', text: 'Las ganas pueden tardar en llegar, pero si das el primer paso, siempre sabrán encontrarte.' }
      ]
    },
    {
      id: 'bienestar_sem4',
      title: 'Semana 4: Crea tu Reserva Emocional Positiva',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'El ánimo bajo reduce los momentos agradables y aumenta la presencia de lo negativo. Para equilibrar la balanza, necesitas crear tu propia mochila de recursos positivos: recuerdos, hábitos, apoyos y actitudes que te sostengan en los días grises. Esta semana aprenderás a entrenar tu mente para capturar lo bueno, revivir recuerdos positivos y diseñar un botiquín emocional con recursos listos para usar cuando lo necesites.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Introsesion4ruta12.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: tu “mochila de reserva” para los días grises',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio1sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Imagina que cada gesto amable, cada momento de calma o cada risa que compartes, fuera como una moneda que guardas en una mochila invisible.\nEn los días soleados casi no notas que la llevas… pero cuando llega una tormenta emocional, esa reserva te sostiene y te ayuda a seguir.\nA esta mochila la llamamos reserva emocional positiva.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué es la reserva emocional positiva',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio2sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Es la capacidad de generar y mantener estados emocionales que nos fortalecen, junto con recursos internos y externos para afrontar momentos difíciles.\nNo se trata solo de “sentirse bien”, sino de cultivar activamente aquello que nos aporta calma, energía y sentido, para poder usarlo cuando más lo necesites.\nEsta reserva se alimenta de tres fuentes principales: ' }, { type: 'list', items: ["Hábitos: acciones diarias que favorecen el bienestar.", "Relaciones: vínculos que nos sostienen y nos nutren emocionalmente.", "Actitudes: la forma en que interpretamos y respondemos a lo que ocurre."] }]
        },
        {
          type: 'collapsible',
          title: 'Conexión con el ánimo bajo y la depresión',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio3sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo o hay depresión, no solo aumentan las emociones negativas: también disminuyen los momentos agradables y placenteros.\nEsto provoca un desequilibrio que alimenta el malestar y la llamada anhedonia: la dificultad para disfrutar o interesarse por lo que antes nos gustaba.\nImportante: al principio, cultivar emociones positivas no siempre se siente natural. Puede que parezca forzado o que no tengas ganas, y eso es completamente normal.\nCon práctica y repetición, los circuitos cerebrales de motivación y recompensa se reactivan.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué es clave en la recuperación',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio4sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente tiende a fijarse más en lo negativo y a olvidar lo que nos da calma o alegría. La reserva emocional positiva funciona como una mochila de recursos que puedes llenar con recuerdos, hábitos y apoyos. Esa mochila no elimina los problemas, pero te da más fuerza para sostenerlos.' }, { type: 'paragraph', text: 'Las emociones positivas no son un lujo: cumplen funciones esenciales para tu salud mental y tu bienestar.' }, { type: 'list', items: ["Amplían la mirada, ayudándote a ver soluciones y a pensar con más flexibilidad.", "Equilibran el peso de lo negativo, evitando que todo se vea más oscuro de lo que es.", "Sostienen tu resiliencia, dándote energía para seguir en días difíciles."] }, { type: 'paragraph', text: 'Al principio puede sentirse forzado “buscar lo positivo”, pero la práctica reactiva circuitos cerebrales de motivación y recompensa (dopamina, serotonina, calma de la amígdala). El camino no es esperar a sentirte bien para actuar, sino al revés: primero actúas (un pequeño gesto) y después aparece la emoción.' }, { type: 'paragraph', text: 'Para reflexionar: ¿qué hábitos, rutinas o pequeños gestos te ayudan a sentirte con más calma o energía? ¿Qué has comprendido sobre la relación entre acción y motivación y cómo puedes aplicarlo en los días con menos ganas? ¿Qué recuerdos, apoyos o recursos de tu “mochila positiva” son los más poderosos para levantar tu ánimo en momentos difíciles?' }, { type: 'paragraph', text: 'Estrategias sencillas que nutren tu reserva emocional:' }, { type: 'list', items: ["Recordar momentos agradables y revivirlos con detalle.", "Realizar microacciones sociales (mandar un mensaje, tomar un café).", "Usar música, humor y gestos como la sonrisa.", "Cuidar hábitos básicos: descanso, movimiento, alimentación y contacto con la naturaleza."] }]
        },
        {
          type: 'collapsible',
          title: 'Principios de activación conductual',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio5sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, esperar a “sentirse con energía” para actuar suele llevar a la inactividad, y esta inactividad alimenta más el malestar.\n\nPor eso, en psicología usamos el principio acción → emoción:\n\nPrimero actúas, incluso sin ganas.\n\nLuego, con la repetición, el estado de ánimo empieza a mejorar.\n\nClaves para aplicarlo: ' }, { type: 'list', items: ["Programar actividades agradables: pequeñas acciones que te den placer, calma o conexión, como tomar un café en un lugar con luz natural, escuchar tu canción favorita o acariciar a tu mascota.", "Incluir actividades de logro: tareas que, aunque no sean placenteras, te den una sensación de propósito o dominio, como completar una tarea pendiente, ordenar un espacio o aprender algo breve.", "Combinar ambas en tu día: el equilibrio entre placer y logro genera un círculo de motivación sostenida."] }, { type: 'paragraph', text: 'Ejemplo práctico: Si tu energía es muy baja, en lugar de “hacer ejercicio 30 min”, proponte “poner música y mover el cuerpo 3 min” o “caminar hasta la esquina y volver”. Lo pequeño y repetido es lo que activa el cambio.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué dice la neurociencia',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio6sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Las emociones positivas no solo “se sienten”, también producen cambios reales en el cerebro:' }, { type: 'list', items: ["Activan el sistema dopaminérgico: este circuito de motivación y recompensa nos impulsa a repetir conductas que nos hacen sentir bien. Con la práctica, aumenta la probabilidad de buscar y generar más de esos momentos.", "Calman la hiperactividad de la amígdala: en el ánimo bajo, la amígdala puede estar sobreactivada, amplificando el miedo, la preocupación y la visión negativa. Las emociones positivas actúan como un “freno” que reduce esta intensidad.", "Favorecen la neuroplasticidad: cada vez que entrenas una emoción positiva, refuerzas conexiones neuronales que facilitan que aparezca de nuevo. Es como crear un “camino” más transitado en tu cerebro, que luego se recorre de forma más automática.", "Efecto acumulativo: un momento positivo aislado puede levantar el ánimo de forma breve, pero repetirlo a diario construye una base más estable y resistente frente a futuros bajones."] }, { type: 'paragraph', text: 'Idea para llevarte: piensa en las emociones positivas como en regar una planta: no basta con un gran riego un día, necesita pequeñas dosis constantes para crecer y mantenerse fuerte.' }]
        },
        {
          type: 'collapsible',
          title: 'Estrategias para llenar tu reserva emocional',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio7sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Registro de momentos agradables: anota incluso los más pequeños.\n\nRecuerdos positivos: revive mentalmente experiencias agradables para activar las mismas emociones.\n\nMicroacciones sociales: saludar, enviar un mensaje, compartir algo breve.\n\nAnclajes sensoriales: olores, música o texturas que evoquen calma o alegría.\n\nHumor y juego: integrar pequeñas dosis de ligereza cada día.\n\nPaciencia: aceptar que los resultados se acumulan con el tiempo.' }]
        },
        {
          type: 'collapsible',
          title: 'Prevención de recaídas',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio8sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'Mantener tu reserva emocional llena no significa que no tendrás problemas, pero sí que tendrás más fuerza, flexibilidad y recursos para afrontarlos.\n\nInvertir en ella es una forma de cuidarte hoy y protegerte para el futuro.' }]
        },
        {
          type: 'collapsible',
          title: 'Mensaje motivador final',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Audio9sesion4ruta12.mp3`,
          content: [{ type: 'paragraph', text: 'No necesitas esperar a “sentirte con ganas” para empezar. Aquí, la clave es la repetición: cada pequeño gesto suma.\n\nLas emociones positivas no son un lujo ni un rasgo fijo, son una habilidad que se entrena.\n\nHoy puedes empezar a llenarte de aquello que mañana te sostendrá.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'illuminatingMemoriesAlbumExercise', title: 'EJERCICIO 1: MI ÁLBUM DE RECUERDOS QUE ILUMINAN', objective: 'Este ejercicio te ayudará a entrenar tu mente para equilibrar el “sesgo negativo” natural del cerebro, capturando y conservando los momentos que te nutren para que puedas revivirlos en días difíciles.', duration: '10-12 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana4tecnica1.mp3` },
        { type: 'positiveEmotionalFirstAidKitExercise', title: 'EJERCICIO 2: MI BOTIQUÍN EMOCIONAL POSITIVO', objective: 'Este ejercicio te ayudará a diseñar un kit personal de recursos prácticos para regular tu ánimo y recuperar el equilibrio, basado en estrategias que la ciencia ha demostrado efectivas.', duration: '12-15 min', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana4tecnica2.mp3` },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Reflexionssesion4ruta12.mp3`, prompts: ["<p>Esta semana has explorado el poder de cultivar emociones positivas como una forma de cuidar tu bienestar a largo plazo.</p><ul><li>¿Qué descubriste esta semana sobre tu capacidad para reconocer y generar emociones positivas?</li><li>¿Qué quieres ajustar en tu día a día para que tu capacidad de generar emociones positivas funcione mejor?</li><li>¿Qué cosas, personas o experiencias forman parte de tu propia “mochila de reserva”?</li><li>¿Qué hábitos sencillos (ej. dormir bien, caminar, escuchar música) notas que te ayudan a mantenerte más sereno/a y equilibrado/a?</li><li>Cuando reviviste un recuerdo positivo o usaste uno de tus recursos, ¿qué cambió en tu estado de ánimo?</li><li>¿Qué tres pequeñas acciones concretas podrías repetir la próxima semana para seguir fortaleciendo tu reserva emocional?</li></ul>"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Resumenruta12.mp3` },
        { type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente tiende a fijarse más en lo negativo y a olvidar lo que nos da calma o alegría. La reserva emocional positiva funciona como una mochila de recursos que puedes llenar con recuerdos, hábitos y apoyos. Esa mochila no elimina los problemas, pero te da más fuerza para sostenerlos.' },
        { type: 'paragraph', text: 'Las emociones positivas no son un lujo: cumplen funciones esenciales para tu salud mental y tu bienestar.' },
        { type: 'list', items: ["Amplían la mirada, ayudándote a ver soluciones y a pensar con más flexibilidad.", "Equilibran el peso de lo negativo, evitando que todo se vea más oscuro de lo que es.", "Sostienen tu resiliencia, dándote energía para seguir en días difíciles."] },
        { type: 'paragraph', text: 'Al principio puede sentirse forzado “buscar lo positivo”, pero la práctica reactiva circuitos cerebrales de motivación y recompensa (dopamina, serotonina, calma de la amígdala). El camino no es esperar a sentirte bien para actuar, sino al revés: primero actúas (un pequeño gesto) y después aparece la emoción.' },
        { type: 'paragraph', text: 'Para reflexionar: ¿qué hábitos, rutinas o pequeños gestos te ayudan a sentirte con más calma o energía? ¿Qué has comprendido sobre la relación entre acción y motivación y cómo puedes aplicarlo en los días con menos ganas? ¿Qué recuerdos, apoyos o recursos de tu “mochila positiva” son los más poderosos para levantar tu ánimo en momentos difíciles?' },
        { type: 'paragraph', text: 'Estrategias sencillas que nutren tu reserva emocional:' },
        { type: 'list', items: ["Recordar momentos agradables y revivirlos con detalle.", "Realizar microacciones sociales (mandar un mensaje, tomar un café).", "Usar música, humor y gestos como la sonrisa.", "Cuidar hábitos básicos: descanso, movimiento, alimentación y contacto con la naturaleza."] },
        { type: 'quote', text: 'En cada recuerdo luminoso, cada gesto amable y cada momento positivo que eliges cultivar es como poner una moneda brillante en tu mochila interior. No evitará las tormentas, pero hará que siempre tengas con qué resguardarte.' }
      ]
    },
    {
      id: 'bienestar_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [{ type: 'therapeuticNotebookReflection', title: 'REFLEXIÓN FINAL PARA EL CUADERNO', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Reflexionfinalruta12.mp3`, prompts: ["<p>A lo largo de estas cuatro semanas has recorrido un camino que no siempre es fácil: mirar de frente el ánimo bajo, comprenderlo y aprender a cuidarlo.</p><p>Has descubierto que no se trata de esperar a tener ganas para actuar, sino de dar pasos pequeños que, repetidos, construyen bienestar duradero. Paso a paso, fuiste recuperando lo que te hace sentir bien:</p><ul><li>Semana 1 te ayudó a reconectar con tus fuentes de energía y gratificación.</li><li>Semana 2 te mostró la fuerza de las rutinas y microhábitos como anclas que sostienen tu día.</li><li>Semana 3 te enseñó a provocar motivación cuando las ganas no aparecen, conectando cada acción con tu sentido personal.</li><li>Semana 4 te permitió crear una reserva emocional positiva: tu mochila interior para los días difíciles.</li></ul><p>Este recorrido no busca que vivas siempre en “modo positivo”, sino que tengas recursos reales y prácticos para equilibrar lo difícil con lo que te da calma, fuerza y esperanza.</p><p>Ahora, tomate unos minutos para reflexionar:</p><ul><li>¿Qué hábitos, rutinas o pequeños gestos descubrí que me ayudan a sentirme con más calma o energía?</li><li>¿Qué he comprendido sobre la relación entre acción y motivación? ¿Cómo puedo aplicarlo en los días en los que me falten las ganas?</li><li>¿Qué recuerdos, apoyos o recursos de mi “mochila positiva” siento que son los más poderosos para levantar mi ánimo en momentos difíciles?</li><li>¿Qué conclusiones saco sobre cómo me hago cargo de mi bienestar y qué quiero seguir cultivando a partir de ahora?</li></ul>"] }, { type: 'title', text: 'RESUMEN FINAL DE LA RUTA', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/descripciones/sesion4/Resumenfinalruta12.mp3` }, { type: 'list', items: ['El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales, y que se puede regular con estrategias concretas.', 'Tu energía vital se sostiene en tres pilares: hábitos básicos, chispa emocional y dirección mental.', 'Las rutinas y microhábitos son anclas de cuidado: pequeños gestos diarios que estabilizan cuerpo, mente y emociones.', 'La motivación no siempre precede a la acción: muchas veces aparece después de dar el primer paso.', 'Conectar cada acción con un valor y un sentido mayor le da fuerza y continuidad.', 'Cultivar una reserva emocional positiva —recuerdos, apoyos, hábitos, gestos— es una inversión que protege tu bienestar y fortalece tu resiliencia.', 'Lo importante no es la perfección, sino la repetición amable: cada intento cuenta como un paso hacia tu equilibrio.'] }, { type: 'quote', text: 'Volver a lo que te hace sentir bien no es regresar al pasado, sino construir, paso a paso, un presente más habitable. Cada gesto, cada recuerdo y cada elección consciente son semillas de bienestar que seguirán creciendo dentro de ti.' }]
    }
  ]
};
