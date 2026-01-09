
import type { Path } from '../pathsData';

export const wellbeingPath: Path = {
  id: 'volver-a-sentirse-bien',
  title: 'Volver a lo que me hace sentir bien',
  description: 'Reconecta con tus fuentes de bienestar, recupera rutinas que te sostienen y aprende a activar tu motivación incluso en los días más grises.',
  dataAiHint: 'wellbeing motivation energy',
  audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Introruta12.mp3',
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
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Introsesion1ruta12.mp3'
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando tu batería se queda en rojo',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio1sesion1ruta12.mp3',
          content: [{ type: 'paragraph', text: '¿Has tenido días en los que te sientes como un móvil con la batería al 5%? No importa cuánto descanses, parece que nada te recarga del todo. Estar bajo de ánimo es parecido: tu energía física, mental y emocional se apagan un poco. Lo que antes te motivaba ahora cuesta más, y hasta las cosas simples pueden parecer un esfuerzo enorme. Esta semana vamos a explorar cómo recargar esa batería sin depender de chispazos momentáneos, sino construyendo energía que dure.' }]
        },
        {
            type: 'collapsible',
            title: 'No todo malestar es igual: tristeza, ánimo bajo y depresión',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio2sesion1ruta12.mp3',
            content: [{ type: 'paragraph', text: 'Imagina tres intensidades de “nubes” que pueden tapar tu cielo: Tristeza: nube pasajera, suele aparecer tras una pérdida o decepción. Se disipa con el tiempo o con apoyo. Estado de ánimo bajo: nubosidad persistente; no hay tormenta, pero el sol apenas asoma. Hay apatía, baja energía y menos disfrute. Depresión: tormenta prolongada e intensa; afecta a tu forma de pensar, sentir y actuar, e interfiere en tu vida diaria. Requiere intervención profesional. En esta ruta trabajaremos el estado de ánimo bajo, esa fase intermedia que muchas veces pasa desapercibida… pero que, si la cuidamos, podemos revertir antes de que se intensifique. Ahora que tienes claro de qué estamos hablando, vamos a ver de dónde suele venir este estado.' }]
        },
        {
            type: 'collapsible',
            title: 'De dónde viene el estado de ánimo bajo',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio3sesion1ruta12.mp3',
            content: [
              { type: 'paragraph', text: 'El ánimo no baja “porque sí”. Suele ser el resultado de varios hilos que se entrelazan:\n• Eventos de vida y estrés: pérdidas, cambios importantes, problemas continuos.\n• Manera de pensar: creencias aprendidas y patrones de pensamiento que amplifican lo negativo y minimizan lo positivo.\n• Relaciones: entornos críticos, poco apoyo o vínculos que drenan tu energía.\n• Factores biológicos: cambios en neurotransmisores como la serotonina o la dopamina, que afectan tu motivación y capacidad de disfrutar.\n• Hábitos y estilo de vida: falta de sueño, poca actividad física, alimentación desequilibrada.\nAdemás, el estado de ánimo bajo se alimenta de un doble vacío:\n• La sensación de poco dominio sobre tu vida: cuando sientes que no puedes influir en lo que pasa, tu motivación se apaga.\n• La falta de gratificaciones reales: cuando apenas hay momentos de disfrute o satisfacción, el cerebro recibe pocas señales de “esto vale la pena repetirlo”, y se instala la apatía.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'Qué ocurre en tu cuerpo y tu mente',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio4sesion1ruta12.mp3',
            content: [
              { type: 'paragraph', text: 'Cuando el ánimo baja, no es solo cuestión de “pensar positivo”.\n• Tu cerebro emocional (amígdala) envía señales de alerta constantes, activando tensión y cansancio.\n• Tu cerebro pensante (corteza prefrontal) pierde un poco de claridad y energía para planificar o decidir.\n• Tus músculos, tu respiración y tu postura cambian, enviando mensajes silenciosos de que “todo pesa más”.\nSegún la neurociencia afectiva, estos cambios forman un bucle: menos energía → menos acción → menos placer → más ánimo bajo.\nPara romperlo, necesitamos entender de dónde viene nuestra energía vital y cómo mantenerla.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'La energía vital: mucho más que no estar cansado/a',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio5sesion1ruta12.mp3',
            content: [
                { type: 'paragraph', text: 'Piensa en tu energía como en un fuego:\n• Se alimenta de combustible físico (descanso, alimentación, movimiento).\n• Necesita chispa emocional (momentos que te hagan sentir vivo/a).\n• Y se mantiene con aire mental (propósitos, curiosidad, retos alcanzables).\nSin alguno de estos elementos, la llama se reduce y el ánimo baja.\nIncluso acciones de solo 10 minutos —como salir a la luz natural o tener una conversación agradable— pueden avivar ese fuego.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El espejismo de la gratificación inmediata',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio6sesion1ruta12.mp3',
            content: [
                { type: 'paragraph', text: 'Cuando la batería está baja, buscamos enchufes rápidos: comer algo dulce, mirar redes, ver series sin parar…\nEsto es gratificación inmediata: placer rápido, pero que dura lo que un sorbo de café en un día de frío.\nEl bienestar sostenido, en cambio, es como encender una estufa que mantiene el calor mucho después: caminar, retomar un hobby, hablar con alguien que te importa.\nComo recuerda la Terapia Cognitivo-Conductual, las acciones que más levantan el ánimo suelen ser las que menos apetece hacer al principio.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Tu cerebro también busca recompensas',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio7sesion1ruta12.mp3',
            content: [
                { type: 'paragraph', text: 'Dentro de tu cabeza hay un sistema de recompensa que se activa no solo cuando consigues algo, sino también cuando lo anticipas.\n• Dopamina: la chispa que te mueve a actuar.\n• Núcleo accumbens: el radar de lo que puede hacerte sentir bien.\n• Corteza prefrontal: la que decide si vas hacia lo que de verdad importa o hacia lo que solo alivia un rato.\nCuando eliges conscientemente actividades con sentido, entrenas a tu cerebro para pedir más de eso.\nY ese es el camino para reconectar con lo que antes te hacía bien.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Por qué reconectar con lo que te hacía bien es clave',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio8sesion1ruta12.mp3',
            content: [
                { type: 'paragraph', text: 'El estado de ánimo bajo te empuja a hacer menos → recibes menos placer → el ánimo baja más.\nRomper ese círculo no siempre empieza con ganas; muchas veces empieza con acción consciente:\n• Retomar algo que antes disfrutabas.\n• Probar una versión más pequeña de una actividad que te gustaba.\n• Buscar compañía que te aporte calma o risa.\n“No esperes a tener ganas para empezar; empieza, y las ganas llegarán después.” — Principio de activación conductual.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Empezar por las actividades: un primer paso probado por la ciencia',
            audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Audio9sesion1ruta12.mp3',
            content: [
                { type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente suele decir: “No tengo fuerzas, primero necesito sentirme mejor para hacer cosas”.\nLa investigación en Terapia Cognitivo-Conductual muestra justo lo contrario: empezar a hacer cosas que te aportan placer o logro es uno de los primeros pasos más efectivos para mejorar el estado de ánimo, incluso en depresión.\nEs como encender una luz tenue en una habitación oscura: al principio no ilumina todo, pero te permite moverte, encontrar otros interruptores y, poco a poco, llenar la habitación de claridad.'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas'},
        {
          type: 'emotionalGratificationMapExercise',
          title: 'EJERCICIO 1: MAPA DE GRATIFICACIÓN EMOCIONAL',
          objective: 'Este ejercicio te ayudará a reconectar con esas fuentes de bienestar: actividades, personas o lugares que, en algún momento de tu vida, te han hecho sentir bien. Al recordarlos y registrarlos, tendrás un mapa personal al que acudir cuando necesites recargar energía emocional.',
          duration: '7-10 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana1tecnica1.mp3'
        },
        {
          type: 'dailyEnergyCheckExercise',
          title: 'EJERCICIO 2: MINI-CHECK DE ENERGÍA DIARIA',
          objective: 'Este ejercicio te ayudará a identificar qué actividades, personas y entornos recargan tu batería y cuáles la gastan más rápido, para que puedas elegir más de lo que te suma y reducir lo que te drena.',
          duration: '3-5 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana1tecnica2.mp3'
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Reflexionsesion1ruta12.mp3', prompts: ["¿Qué he descubierto sobre mis niveles de energía y cómo suelo hacerme cargo de ellos?","¿Hubo algo que me sorprendiera al observar mi energía día a día?","¿Qué cosas identifiqué como “drenaje” y cómo puedo reducir su impacto?","Si tuviera que elegir una sola acción para mantener mi energía la próxima semana, ¿cuál sería?","¿Cómo puedo recordarme a mí mismo/a que no tengo que esperar a tener ganas para empezar a cuidarme?"]},
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion1/Resumensesion1ruta12.mp3'},
        { type: 'list', items: ["El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales que podemos aprender a cuidar.","Nuestra energía vital se sostiene en hábitos básicos, chispa emocional y dirección mental.","Las gratificaciones rápidas (como redes, azúcar o maratones de series) alivian a corto plazo, pero no recargan a largo plazo.","Reconectar con lo que antes nos hacía bien es una de las formas más potentes de romper el ciclo de ánimo bajo.","Planificar y hacer actividades gratificantes, aunque no haya ganas al principio, es una estrategia validada por la ciencia para recuperar el ánimo."]},
        { type: 'quote', text: '“Cada paso que das para cuidar tu energía es una inversión en tu bienestar. No importa si es grande o pequeño: lo importante es que sigues encendiendo tu propia luz.”' }
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
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Introsesion2ruta12.mp3'
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando lo básico empieza a fallar',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio1sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: '¿Te ha pasado que, en momentos difíciles, lo primero que se desordena es lo que te sostiene?  Dormimos peor, comemos rápido, dejamos de movernos… y, sin darnos cuenta, el malestar crece.   Esta semana vamos a volver a lo esencial: recuperar esas rutinas que te alimentan por dentro y por fuera, que estabilizan tus días y te devuelven energía. No hablamos de forzarte a hacer todo perfecto, sino de crear pequeños anclajes que te ayuden a sentirte más estable y con más fuerza para afrontar lo que venga.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutinas que son anclas',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio2sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Las rutinas saludables no son simples tareas repetidas: son anclas emocionales que estabilizan tu día, regulan tu estado de ánimo y alimentan tu motivación. Desde la neurociencia del estrés sabemos que cuando cuidas lo básico —alimentación, descanso y movimiento— tu sistema nervioso interpreta que estás a salvo, lo que reduce la sobreactivación de la amígdala (la “alarma” emocional) y te ayuda a pensar con más claridad. Si además incluyes actividades que disfrutas y te hacen sentir logro —como caminar, bailar, cocinar algo rico o retomar un hobby—, activas circuitos de recompensa que liberan dopamina y serotonina, potenciando tu bienestar y tu motivación.' }]
        },
        {
          type: 'collapsible',
          title: 'El papel de las rutinas en tu equilibrio emocional',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio3sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Recuperar rutinas que te nutren no solo mejora tu energía física: fortalece tu estabilidad emocional. Las acciones que repites cada día actúan como un hilo conductor que te ayuda a mantener el rumbo incluso cuando hay turbulencias. Cuando estás en tus rutinas de cuidado: pones nombre a lo que sientes, aceptas sin juicio y eliges cómo responder. Esto te da más claridad y paz mental. Además, practicar habilidades como la asertividad, la solución de problemas o el mindfulness, según Jon Kabat-Zinn, reduce la reactividad automática y te ayuda a mantenerte centrado/a incluso en momentos difíciles.' }]
        },
        {
          type: 'collapsible',
          title: 'Cuando las rutinas se rompen',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio4sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'En momentos duros, solemos descuidar justo lo que más nos sostiene:   Dormimos peor.   Nos movemos menos.   Comemos rápido o poco nutritivo.   Esto aumenta la vulnerabilidad física y emocional. En psicología lo llamamos un bucle de vulnerabilidad: cuanto peor te sientes, menos haces lo que te cuida, y cuanto menos te cuidas, peor te sientes.   Volver a hábitos que nos cuidan no solo aporta estructura y previsibilidad: le devuelve a tu cuerpo y a tu mente la sensación de seguridad, y eso es la base para tomar mejores decisiones y recuperar energía.' }]
        },
        {
          type: 'collapsible',
          title: 'La fuerza de los pequeños pasos',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio5sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'La Terapia Cognitivo-Conductual y la psicología del hábito coinciden: no necesitas un cambio radical para notar mejoras.  Los pequeños pasos tienen un efecto acumulativo enorme:   Moverte 10 minutos al día.   Preparar un desayuno nutritivo.   Reservar un rato para algo que disfrutas.   Estos gestos, aunque parezcan mínimos, generan una sensación de logro que alimenta tu motivación. En palabras de BJ Fogg, experto en hábitos, “el cambio se crea sintiéndote bien con lo que haces, no castigándote por lo que no haces”.' }]
        },
        {
          type: 'collapsible',
          title: 'Rutina rígida vs. ritual de cuidado',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio6sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'No todas las rutinas son iguales: algunas se vuelven rígidas y limitantes, mientras que otras actúan como un refugio flexible que te recarga.   • Rutina rígida disfuncional → Inflexible, vivida como obligación, genera ansiedad ante cambios.  Ejemplo: “Tengo que correr 5 km todos los días o no vale la pena”.   • Ritual de cuidado → Intencional, flexible y enfocado en tu bienestar, adaptable a tus circunstancias.  Ejemplo: “Hoy no puedo correr, pero haré 15 minutos de estiramientos en casa”.   Un ritual de cuidado no depende de que todo vaya bien para existir. Según la neurociencia del hábito, la flexibilidad y la asociación con emociones positivas aumentan la probabilidad de mantenerlo en el tiempo.' }]
        },
        {
          type: 'collapsible',
          title: 'Ideas para tus rituales de cuidado',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio7sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Aquí tienes inspiración para crear los tuyos:   Autorreforzarte: darte pequeños premios o autoelogios sinceros cuando cumples tu objetivo.   Priorizar el placer diario: dar espacio a lo que te gusta sin sentir culpa.   Actividades agradables y de dominio: que te den sensación de logro y satisfacción (cocinar algo nuevo, aprender una habilidad).   Mindfulness y flexibilidad emocional: aceptar emociones y sensaciones sin juicio, dejando que pasen por sí solas.   Recuerda que el objetivo no es “tachar tareas”, sino crear experiencias que nutran tu cuerpo, tu mente y tu ánimo.' }]
        },
        {
          type: 'collapsible',
          title: 'Tu misión esta semana',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Audio8sesion2ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Identifica y recupera al menos una rutina que te nutra. Hazlo pequeño, realista y disfrutable.  No se trata solo de “hacer cosas sanas”: se trata de reconectar con lo que de verdad te hace sentir bien y mantenerlo incluso en días difíciles.   En las próximas técnicas aprenderás a elegirla, adaptarla y mantenerla como una aliada para tu bienestar, pase lo que pase.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'dailyWellbeingPlanExercise',
          title: 'EJERCICIO 1: MI PLAN DIARIO DE BIENESTAR: 3 MICROHÁBITOS CLAVE',
          objective: 'Este ejercicio te ayudará a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles, para que actúen como anclas que sostengan tu bienestar.',
          duration: '6-8 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana2tecnica1.mp3'
        },
        {
          type: 'morningRitualExercise',
          title: 'EJERCICIO 2: MI RITUAL DE INICIO: UNA MAÑANA AMABLE Y CONSCIENTE',
          objective: 'Tus primeras acciones al despertar marcan el tono de todo lo que viene después. En este ejercicio vas a diseñar una rutina inicial breve que te permita aterrizar en tu día con presencia y equilibrio.',
          duration: '8-10 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana2tecnica2.mp3'
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Reflexionsesion2ruta12.mp3', prompts: ["En tu experiencia pasada, ¿qué papel crees que han jugado los hábitos en tu bienestar físico, emocional y mental?","Cuando tus hábitos se debilitan o desaparecen, ¿cómo sueles reaccionar y qué podrías hacer para asumir un papel más activo en recuperarlos?","¿Qué microhábitos o rituales has puesto en marcha y cómo te han hecho sentir?","¿Cómo cambia tu ánimo y tu energía cuando cuidas lo básico de tu cuerpo, tus emociones y tu mente?"] },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion2/Resumensesion2ruta12.mp3' },
        { type: 'list', items: ["Tus rutinas son anclas emocionales que estabilizan tu día y te ayudan a pensar con más claridad.","Cuidar lo básico (descanso, alimentación, movimiento) reduce la activación del sistema de alarma y mejora tu regulación emocional.","Los microhábitos pequeños y realistas tienen un efecto acumulativo enorme en tu bienestar y motivación.","La diferencia entre rutina rígida y ritual de cuidado está en la flexibilidad y la conexión con tu bienestar.","Un buen inicio de día (mañana amable) actúa como chispa que enciende tu energía y tu foco para el resto de la jornada."]},
        { type: 'quote', text: '“El cuidado de ti no depende de grandes gestos, sino de los pequeños actos que repites con intención, incluso en los días más difíciles.”' }
      ]
    },
    {
      id: 'bienestar_sem3',
      title: 'Semana 3: Reactiva la Motivación Bloqueada',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'Uno de los síntomas más comunes del ánimo bajo es la falta de ganas. Sabes lo que deberías hacer, pero el impulso no llega. La clave está en no esperar a tener ganas para empezar: muchas veces, la motivación aparece después de la acción. Esta semana entrenarás cómo dar el primer paso incluso sin motivación, conectando cada acción con tus valores y con la vida que quieres construir.',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Introsesion3ruta12.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: Cuando las ganas no aparecen',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio1sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: '¿Te ha pasado que sabes exactamente lo que deberías hacer… pero no encuentras el impulso para empezar?   Las “ganas” y la motivación están muy conectadas: las ganas son como la chispa inicial y la motivación, el motor que mantiene la acción en marcha. La buena noticia es que, según la ciencia —desde la Terapia Cognitivo-Conductual (TCC) hasta la neurociencia afectiva— no siempre tenemos que esperar a que aparezcan las ganas: muchas veces la motivación llega después de ponernos en movimiento.   Para saber cómo lograrlo, primero vamos a entender qué es realmente la motivación y de dónde surge.' }]
        },
        {
          type: 'collapsible',
          title: 'La motivación: algo más que ganas',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio2sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'En pocas palabras, la motivación es ese empujón interno que nos mueve a hacer cosas que nos acercan a lo que nos hace bien y nos alejan de lo que nos perjudica.   Puede nacer de:   Un deseo de cambiar cómo nos sentimos (relajarnos, tener más energía, ganar claridad mental).   Una emoción que nos impulsa: incluso las decisiones más “lógicas” tienen un fondo emocional.   La anticipación de una recompensa: imaginar lo bien que nos sentiremos después activa la dopamina en el cerebro, una sustancia que nos empuja a actuar.   En otras palabras: no solemos buscar la acción por sí misma, sino la sensación que creemos que nos dará. Y, aun así, hay momentos en los que este motor parece apagarse. Veamos por qué.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué a veces las ganas no llegan',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio3sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'En etapas de ánimo bajo o depresión, es común perder la motivación positiva: sabemos lo que hay que hacer, pero sentimos que no tenemos energía.   Esto puede deberse a:   Pensamientos que desaniman (“es inútil intentarlo”, “no soy capaz”).   Cansancio físico o mental.   No tener claro cuándo, cómo o dónde empezar.   Perfeccionismo: esperar el momento o las condiciones perfectas para actuar.   Falta de conexión emocional con la tarea.   Estrés o entornos poco estimulantes que reducen la motivación.   Estos bloqueos pueden sentirse como un muro… pero, como todo muro, se puede saltar, rodear o derribar.   El primer paso es saber que sí se puede actuar incluso sin ganas, y que existen estrategias para lograrlo.' }]
        },
        {
          type: 'collapsible',
          title: 'Acción sin ganas: cómo es posible',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio4sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Si esperamos a “tener ganas” para movernos, podemos quedarnos atrapados en la inacción.   La clave está en aprender a actuar incluso cuando la motivación está baja, usando tres apoyos:   Disciplina: seguir adelante por compromiso con nuestros objetivos, no por un impulso momentáneo.   Planificación clara: decidir de antemano cuándo y dónde haremos algo reduce las dudas y evita que lo posterguemos.   Facilidad: ponértelo tan fácil que sea casi imposible no empezar (en terapia lo llamamos “bajar la rampa”).   Así, el primer paso requiere muy poca energía y es más probable que lo des.   Pero tan importante como cómo te pones en marcha, es desde dónde lo haces.' }]
        },
        {
          type: 'collapsible',
          title: 'Del “tengo que” al “quiero elegir”',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio5sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'La forma en la que te hablas cambia cómo percibes una tarea:   “Tengo que”: suena a obligación, activa resistencia y nos lleva a evitar o postergar. Además, si no cumplimos los “tengo que”, luego nos sentimos muy mal.   “Quiero” o “elijo”: conecta con lo que valoras y despierta motivación propia.   Ejemplo: “Tengo que hacer ejercicio” → “Quiero moverme para sentirme con más energía y cuidar mi salud”.   Este cambio no es solo de palabras: también modifica cómo el cerebro procesa la tarea, activando zonas relacionadas con el sentido y la recompensa.   Y para que este cambio no se quede en palabras bonitas, vamos a conectar cada acción con algo más profundo: su valor y su sentido.' }]
        },
        {
          type: 'collapsible',
          title: 'Las capas de la motivación',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio6sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'La motivación tiene varias capas, como una cebolla:   Acción concreta: lo que harás hoy.   Valor personal: por qué eso es importante para ti.   Sentido mayor: cómo encaja con la vida que quieres construir.  Por ejemplo: “Hoy voy a salir a caminar (acción concreta) porque valoro mi bienestar físico (valor personal) y quiero tener energía para jugar con mis hijos (sentido mayor)”.   Cuantas más capas actives, más fuerte será tu impulso para empezar y mantenerte.  Incluso así, iniciar puede costar. Aquí es donde las microacciones se convierten en tu mejor aliado.' }]
        },
        {
          type: 'collapsible',
          title: 'El círculo de la activación',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio7sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Hasta ahora hemos visto cómo dar sentido a lo que haces para que tenga más fuerza. Aun así, puede que iniciar siga costando.   Aquí entra un principio clave: la acción puede venir antes que las ganas.  La acción y la motivación se alimentan mutuamente:   Si no haces nada: menos satisfacción o sensación de logro → menos ganas → más bloqueo.   Si das un paso (aunque pequeño): más satisfacción o logro → más ganas → más acción.   Este es el núcleo de la “activación conductual” (una estrategia muy usada en psicología): romper el ciclo de la inacción con gestos pequeños que pongan la rueda en marcha.   Ejemplos: abrir un libro y leer una página, mandar un mensaje corto, salir a la puerta con las zapatillas puestas.   Ahora que sabes cómo funciona este ciclo, vamos a practicarlo con dos ejercicios que te ayudarán a generar las ganas en lugar de esperarlas.' }]
        },
        {
          type: 'collapsible',
          title: 'Lo que vamos a entrenar esta semana',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Audio8sesion3ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Esta semana trabajaremos con dos herramientas clave:   Motivación en 3 capas: para que cada acción esté conectada con un valor y un sentido que realmente te importen.   Visualización del día que quiero vivir: para que cada mañana puedas imaginar cómo quieres sentirte y actuar, y usar esa imagen como guía para tu día.   El objetivo no es esperar a que las ganas lleguen, sino aprender a provocarlas. El primer paso lo das tú… y las ganas te encuentran en el camino.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'motivationIn3LayersExercise',
          title: 'EJERCICIO 1: MOTIVACIÓN EN 3 CAPAS',
          objective: 'Con este ejercicio vas a descubrir las tres capas que dan fuerza a la motivación: lo que haces, por qué lo haces y para qué mayor lo haces. Al completarla, tendrás un recordatorio claro que te ayudará a empezar incluso en días de poca energía.',
          duration: '7 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana3tecnica1.mp3',
        },
        {
          type: 'visualizeDayExercise',
          title: 'EJERCICIO 2: VISUALIZACIÓN DEL DÍA QUE QUIERO VIVIR',
          objective: 'Con este ejercicio vas a diseñar mentalmente el día que quieres vivir, conectándolo con sensaciones y comportamientos que te acerquen a tu mejor versión. Al practicarlo, tu mente y tu cuerpo se preparan para vivir lo que has imaginado.',
          duration: '5-7 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana3tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Reflexionsesion3ruta12.mp3',
          prompts: ["¿Qué has descubierto sobre la motivación y las ganas esta semana?","¿Qué ejercicio o técnica te resultó más útil para activar tus ganas cuando estabas bloqueado/a?","¿Cómo ha cambiado tu forma de ver la motivación tras trabajar con las tres capas (acción–valor–sentido)?"]
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion3/Resumensesion3ruta12.mp3',
        },
        { type: 'list', items: ["La motivación no siempre precede a la acción; a menudo, la acción genera motivación.","Cambiar el “tengo que” por “quiero” o “elijo” aumenta la motivación propia.","Conectar cada acción con un valor personal y un sentido mayor le da profundidad y dirección.","La activación conductual rompe el ciclo de la inacción con gestos pequeños y fáciles.","La visualización del día ideal prepara tu mente y tu cuerpo para actuar de forma coherente con tu intención."]},
        { type: 'quote', text: '“Las ganas pueden tardar en llegar, pero si das el primer paso, siempre sabrán encontrarte.”' }
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
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Introsesion4ruta12.mp3',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: tu “mochila de reserva” para los días grises',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio1sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Imagina que cada gesto amable, cada momento de calma o cada risa que compartes, fuera como una moneda que guardas en una mochila invisible. \n\nEn los días soleados casi no notas que la llevas… pero cuando llega una tormenta emocional, esa reserva te sostiene y te ayuda a seguir. \n\nA esta mochila la llamamos reserva emocional positiva.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué es la reserva emocional positiva',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio2sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Es la capacidad de generar y mantener estados emocionales que nos fortalecen, junto con recursos internos y externos para afrontar momentos difíciles. \n\nNo se trata solo de “sentirse bien”, sino de cultivar activamente aquello que nos aporta calma, energía y sentido, para poder usarlo cuando más lo necesitamos. \n\nEsta reserva se alimenta de tres fuentes principales: \n\nHábitos: acciones diarias que favorecen el bienestar. \nRelaciones: vínculos que nos sostienen y nos nutren emocionalmente. \nActitudes: la forma en que interpretamos y respondemos a lo que ocurre.' }]
        },
        {
          type: 'collapsible',
          title: 'Conexión con el ánimo bajo y la depresión',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio3sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo o hay depresión, no solo aumentan las emociones negativas: también disminuyen los momentos agradables y placenteros. \n\nEsto provoca un desequilibrio que alimenta el malestar y la llamada anhedonia: la dificultad para disfrutar o interesarse por lo que antes nos gustaba. \n\nImportante: al principio, cultivar emociones positivas no siempre se siente natural. Puede que parezca forzado o que no tengas ganas, y eso es completamente normal. \n\nCon práctica y repetición, los circuitos cerebrales de motivación y recompensa se reactivan.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué es clave en la recuperación',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio4sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Las emociones positivas no son solo “sensaciones agradables” que acompañan los buenos momentos; cumplen un papel activo y medible en la recuperación del ánimo bajo. \n\nCuando están presentes de forma regular: \n\nAmplían la perspectiva: te permiten ver más ángulos de la misma situación, no quedarte solo en la parte dolorosa o negativa. Esto facilita la creatividad, el pensamiento flexible y la capacidad de encontrar soluciones que antes no veías. \n\nEjemplo: en un día difícil, recordar que alguien te apoyó en el pasado puede abrir la idea de pedir ayuda ahora. \n\nEquilibran la balanza emocional: ayudan a contrarrestar la carga de las emociones negativas y reducen el riesgo de quedarte atrapado o atrapada en bucles de preocupación, culpa o miedo. No se trata de eliminar lo difícil, sino de equilibrarlo para que no ocupe todo el espacio mental. \n\nSostienen en el tiempo: fortalecen tu resiliencia, es decir, tu capacidad de adaptarte y recuperarte después de un golpe emocional. También mejoran la tolerancia al malestar: aprendes a convivir con las emociones desagradables sin que te bloqueen. \n\nRecuerda: no es un optimismo ingenuo que niega lo difícil, sino un optimismo realista que reconoce lo que sí funciona y lo que aún es posible.' }]
        },
        {
          type: 'collapsible',
          title: 'Principios de activación conductual',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio5sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Cuando el ánimo está bajo, esperar a “sentirse con energía” para actuar suele llevar a la inactividad, y esta inactividad alimenta más el malestar. \n\nPor eso, en psicología usamos el principio acción → emoción: \n\nPrimero actúas, incluso sin ganas. \n\nLuego, con la repetición, el estado de ánimo empieza a mejorar. \n\nClaves para aplicarlo: \n\nProgramar actividades agradables: pequeñas acciones que te den placer, calma o conexión, como tomar un café en un lugar con luz natural, escuchar tu canción favorita o acariciar a tu mascota. \n\nIncluir actividades de logro: tareas que, aunque no sean placenteras, te den una sensación de propósito o dominio, como completar una tarea pendiente, ordenar un espacio o aprender algo breve. \n\nCombinar ambas en tu día: el equilibrio entre placer y logro genera un círculo de motivación sostenida. \n\nEjemplo práctico: Si tu energía es muy baja, en lugar de “hacer ejercicio 30 min”, proponte “poner música y mover el cuerpo 3 min” o “caminar hasta la esquina y volver”. Lo pequeño y repetido es lo que activa el cambio.' }]
        },
        {
          type: 'collapsible',
          title: 'Qué dice la neurociencia',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio6sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Las emociones positivas no solo “se sienten”, también producen cambios reales en el cerebro: \n\nActivan el sistema dopaminérgico: este circuito de motivación y recompensa nos impulsa a repetir conductas que nos hacen sentir bien. Con la práctica, aumenta la probabilidad de buscar y generar más de esos momentos. \n\nCalman la hiperactividad de la amígdala: en el ánimo bajo, la amígdala puede estar sobreactivada, amplificando el miedo, la preocupación y la visión negativa. Las emociones positivas actúan como un “freno” que reduce esta intensidad. \n\nFavorecen la neuroplasticidad: cada vez que entrenas una emoción positiva, refuerzas conexiones neuronales que facilitan que aparezca de nuevo. Es como crear un “camino” más transitado en tu cerebro, que luego se recorre de forma más automática. \n\nEfecto acumulativo: un momento positivo aislado puede levantar el ánimo de forma breve, pero repetirlo a diario construye una base más estable y resistente frente a futuros bajones. \n\nIdea para llevarte: piensa en las emociones positivas como en regar una planta: no basta con un gran riego un día, necesita pequeñas dosis constantes para crecer y mantenerse fuerte.' }]
        },
        {
          type: 'collapsible',
          title: 'Estrategias para llenar tu reserva emocional',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio7sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Registro de momentos agradables: anota incluso los más pequeños. \n\nRecuerdos positivos: revive mentalmente experiencias agradables para activar las mismas emociones. \n\nMicroacciones sociales: saludar, enviar un mensaje, compartir algo breve. \n\nAnclajes sensoriales: olores, música o texturas que evoquen calma o alegría. \n\nHumor y juego: integrar pequeñas dosis de ligereza cada día. \n\nPaciencia: aceptar que los resultados se acumulan con el tiempo.' }]
        },
        {
          type: 'collapsible',
          title: 'Prevención de recaídas',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio8sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'Mantener tu reserva emocional llena no significa que no tendrás problemas, pero sí que tendrás más fuerza, flexibilidad y recursos para afrontarlos.  \n\nInvertir en ella es una forma de cuidarte hoy y protegerte para el futuro.' }]
        },
        {
          type: 'collapsible',
          title: 'Mensaje motivador final',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Audio9sesion4ruta12.mp3',
          content: [{ type: 'paragraph', text: 'No necesitas esperar a “sentirte con ganas” para empezar. Aquí, la clave es la repetición: cada pequeño gesto suma. \n\nLas emociones positivas no son un lujo ni un rasgo fijo, son una habilidad que se entrena. \n\nHoy puedes empezar a llenarte de aquello que mañana te sostendrá.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'illuminatingMemoriesAlbumExercise',
          title: 'EJERCICIO 1: MI ÁLBUM DE RECUERDOS QUE ILUMINAN',
          objective: 'Este ejercicio te ayudará a entrenar tu mente para equilibrar el “sesgo negativo” natural del cerebro, capturando y conservando los momentos que te nutren para que puedas revivirlos en días difíciles.',
          duration: '10-12 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana4tecnica1.mp3',
        },
        {
          type: 'positiveEmotionalFirstAidKitExercise',
          title: 'EJERCICIO 2: MI BOTIQUÍN EMOCIONAL POSITIVO',
          objective: 'Este ejercicio te ayudará a diseñar un kit personal de recursos prácticos para regular tu ánimo y recuperar el equilibrio, basado en estrategias que la ciencia ha demostrado efectivas.',
          duration: '12-15 min',
          audioUrl: 'https://workwellfut.com/audios/ruta12/tecnicas/Ruta12semana4tecnica2.mp3',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Reflexionsesion4ruta12.mp3',
          prompts: ["¿Qué hábitos, rutinas o pequeños gestos descubrí que me ayudan a sentirme con más calma o energía?","¿Qué he comprendido sobre la relación entre acción y motivación? ¿Cómo puedo aplicarlo en los días en los que me falten las ganas?","¿Qué recursos de mi “mochila positiva” siento que son los más poderosos para levantar mi ánimo en momentos difíciles?"]
        },
        { type: 'title', text: 'Resumen Clave'},
        {
          type: 'paragraphWithAudio',
          text: '',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Resumenruta12.mp3',
        },
        { type: 'list', items: ["El ánimo bajo se puede regular con estrategias concretas y sostenibles.","Tu energía vital se sostiene en hábitos básicos, chispa emocional y dirección mental.","La motivación no siempre precede a la acción; a menudo, la acción genera motivación.","Conectar cada acción con un valor y un sentido mayor le da fuerza y continuidad.","Cultivar una reserva emocional positiva protege tu bienestar y fortalece tu resiliencia."]},
        { type: 'quote', text: '“Cada recuerdo luminoso, cada gesto amable y cada momento positivo que eliges cultivar es como poner una moneda brillante en tu mochila interior. No evitará las tormentas, pero hará que siempre tengas con qué resguardarte”' }
      ]
    },
    {
      id: 'bienestar_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'REFLEXIÓN FINAL PARA EL CUADERNO',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Reflexionfinalruta12.mp3',
          prompts: [
            'A lo largo de estas cuatro semanas has recorrido un camino que no siempre es fácil: mirar de frente el ánimo bajo, comprenderlo y aprender a cuidarlo.',
            'Has descubierto que no se trata de esperar a tener ganas para actuar, sino de dar pasos pequeños que, repetidos, construyen bienestar duradero. Paso a paso, fuiste recuperando lo que te hace sentir bien:',
            'Semana 1 te ayudó a reconectar con tus fuentes de energía y gratificación.',
            'Semana 2 te mostró la fuerza de las rutinas y microhábitos como anclas que sostienen tu día.',
            'Semana 3 te enseñó a provocar motivación cuando las ganas no aparecen, conectando cada acción con tu sentido personal.',
            'Semana 4 te permitió crear una reserva emocional positiva: tu mochila interior para los días difíciles.',
            'Este recorrido no busca que vivas siempre en “modo positivo”, sino que tengas recursos reales y prácticos para equilibrar lo difícil con lo que te da calma, fuerza y esperanza.',
            'Ahora, tomate unos minutos para reflexionar:',
            '¿Qué hábitos, rutinas o pequeños gestos descubrí que me ayudan a sentirme con más calma o energía? […]',
            '¿Qué he comprendido sobre la relación entre acción y motivación? ¿Cómo puedo aplicarlo en los días en los que me falten las ganas? […]',
            '¿Qué recuerdos, apoyos o recursos de mi “mochila positiva” siento que son los más poderosos para levantar mi ánimo en momentos difíciles? […]',
            '¿Qué conclusiones saco sobre cómo me hago cargo de mi bienestar y qué quiero seguir cultivando a partir de ahora? […]',
          ],
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: 'https://workwellfut.com/audios/ruta12/descripciones/sesion4/Resumenfinalruta12.mp3'
        },
        {
          type: 'list',
          items: [
            'El ánimo bajo no es debilidad: es un estado que surge de factores físicos, emocionales y mentales, y que se puede regular con estrategias concretas.',
            'Tu energía vital se sostiene en tres pilares: hábitos básicos, chispa emocional y dirección mental.',
            'Las rutinas y microhábitos son anclas de cuidado: pequeños gestos diarios que estabilizan cuerpo, mente y emociones.',
            'La motivación no siempre precede a la acción: muchas veces aparece después de dar el primer paso.',
            'Conectar cada acción con un valor y un sentido mayor hace que tenga más fuerza y continuidad.',
            'Cultivar una reserva emocional positiva —recuerdos, apoyos, hábitos, gestos— es una inversión que protege tu bienestar y fortalece tu resiliencia.',
            'Lo importante no es la perfección, sino la repetición amable: cada intento cuenta como un paso hacia tu equilibrio.',
          ],
        },
        {
          type: 'quote',
          text: '“Volver a lo que te hace sentir bien no es regresar al pasado, sino construir, paso a paso, un presente más habitable. Cada gesto, cada recuerdo y cada elección consciente son semillas de bienestar que seguirán creciendo dentro de ti.”',
        },
      ],
    },
  ],
};
