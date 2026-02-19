
import type { Path } from '@/data/paths/pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const stressManagementPath: Path = {
  id: 'gestion-estres',
  title: 'Gestionar el Estrés con Conciencia',
  description: 'El estrés no es tu enemigo, es una señal que merece ser escuchada. En esta ruta aprenderás a reconocer cómo se activa en ti, regularlo con técnicas efectivas y responder con más calma y conciencia.',
  dataAiHint: 'stress management mindfulness',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/INTRODUCCIONRUTA.mp3`,
  modules: [
    {
      id: 'estres_sem1',
      title: 'Semana 1: Comprende el Estrés y Cómo te Afecta',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { 
            type: 'paragraphWithAudio', 
            text: 'Esta semana vas a descubrir qué es realmente el estrés, por qué no es tu enemigo y cómo se manifiesta en ti. El objetivo es que empieces a escucharlo sin miedo y comprendas que es una señal valiosa: algo en tu vida necesita atención, cuidado o un cambio.',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/INTROSEMANA1.mp3`
        },
        { 
            type: 'title', 
            text: 'Psicoeducación'
        },
        {
          type: 'collapsible',
          title: '¿Qué es el estrés?',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Queeselestresyporquenoestuenemigo.mp3`,
          content: [
            { type: 'paragraph', text: '¿Alguna vez has sentido que no llegas a todo, que te desbordas, que tu cuerpo va por un lado y tu cabeza por otro?\nEso que sientes tiene nombre: estrés. Y aunque solemos verlo como el enemigo, en realidad es un sistema que intenta ayudarte. Es una respuesta natural del cuerpo y la mente cuando percibimos que lo que se nos pide es más de lo que creemos poder dar.' },
            { type: 'paragraph', text: 'El estrés aparece cuando sentimos que las demandas del entorno —una tarea urgente, una discusión, un cambio inesperado— superan nuestros recursos. No es simplemente estar nervioso o tener prisa: es un conjunto de reacciones físicas, emocionales y mentales que se activan para intentar protegernos.\nAntiguamente, esta respuesta tenía mucho sentido. Si aparecía un depredador, el cuerpo se preparaba para luchar o huir: el corazón se aceleraba, los músculos se tensaban, el cerebro entraba en alerta. Hoy en día, nuestros “depredadores” son emails urgentes, facturas, críticas o nuestra propia autoexigencia. Y el cuerpo, que no distingue entre un tigre y una reunión complicada, reacciona igual.\nDesde la neurociencia sabemos que cuando estamos estresados, se activa un sistema de emergencia en el cerebro. Se liberan hormonas como la adrenalina y el cortisol, que nos preparan para actuar rápido. Esto puede ayudarnos en momentos puntuales, pero si se mantiene en el tiempo, empieza a desgastarnos: fatiga, insomnio, irritabilidad, dificultad para concentrarnos… Suena familiar, ¿verdad?' }
          ]
        },
        {
            type: 'collapsible',
            title: 'No todas las personas viven el estrés igual',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Comovivestuelestres.mp3`,
            content: [
              { type: 'paragraph', text: 'Lo que para una persona puede ser un reto motivador, para otra puede ser una amenaza angustiante. Esto depende de nuestras experiencias, nuestra forma de pensar y nuestra manera de ver el mundo. Si llevas unas “gafas” mentales teñidas por la autoexigencia, la anticipación del fracaso o el miedo a decepcionar, es más fácil que sientas muchas situaciones como amenazantes.\nPor eso es tan importante empezar por entender cómo funciona el estrés en ti.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'Tipos de estrés',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Tiposdeestres.mp3`,
            content: [
                { type: 'list', items: [
                    'Estrés agudo: aparece de forma puntual, como antes de un examen o tras una discusión. Puede ser útil si te moviliza.',
                    'Estrés crónico: se mantiene en el tiempo y agota tus recursos, como cuando lidias con una carga laboral constante o preocupaciones familiares continuas.',
                    'Eustrés: es el “estrés bueno”, el que te activa y motiva, como antes de una entrevista importante.',
                    'Distrés: es el que te desborda, te bloquea o te enferma.',
                ]},
                { type: 'paragraph', text: 'No todo el estrés es negativo. Lo que marca la diferencia es la duración, la intensidad y la sensación de control que tienes sobre lo que ocurre.'}
            ],
        },
        {
            type: 'collapsible',
            title: '¿Por qué sentimos estrés?',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Porquesentimosestres.mp3`,
            content: [
              { type: 'paragraph', text: 'El estrés no depende solo de lo que pasa fuera, sino de cómo lo interpretas y con qué recursos cuentas para enfrentarlo.\nAlgunos factores que influyen:' },
              { type: 'list', items: [
                  'Tu estilo de pensamiento: Si sueles exigirte mucho, anticipar lo peor o pensar que todo depende de ti, es más fácil que actives la respuesta de estrés.',
                  'Tu historia personal: Si creciste con mucha inseguridad, crítica o miedo, es posible que tu sistema nervioso sea más sensible.',
                  'Tu tolerancia a la incertidumbre: Las personas que necesitan tenerlo todo bajo control suelen sufrir más ante lo imprevisible.',
                  'Tus recursos y límites: Si sueles decir que sí a todo, cargas con más de lo que puedes sostener o te olvidas de ti para cuidar a los demás, es normal que tu cuerpo acabe agotado.'
              ]}
            ]
        },
        {
            type: 'collapsible',
            title: '¿Qué pasa si no lo gestionamos?',
            audioUrl:
            `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Quepasasinologestionamos.mp3`,
            content: [
              { type: 'paragraph', text: 'El estrés mantenido afecta a todos los niveles:' },
              { type: 'list', items: [
                'Físico: dolores musculares, problemas digestivos, alteraciones hormonales, insomnio.',
                'Emocional: ansiedad, tristeza, irritabilidad, desconexión emocional.',
                'Mental: dificultad para concentrarte, rumiaciones constantes, visión negativa de ti o del futuro.',
                'Relacional y conductual: conflictos, aislamiento, impulsividad, pérdida de hábitos saludables.',
              ]}
            ]
        },
        {
            type: 'collapsible',
            title: 'Tus “mínimos no negociables”',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Tusminimosnonegociables.mp3`,
            content: [
              { type: 'paragraph', text: 'Cuando el estrés aparece, lo primero que solemos dejar de lado son las cosas que más nos sostienen: dormir bien, comer con calma, mover el cuerpo, hablar con alguien que nos escucha.\nEstas pequeñas acciones no son lujos, son necesidades básicas. Las llamamos “mínimos no negociables” porque son el suelo emocional sobre el que puedes caminar cada día. Si los abandonas, el estrés encuentra terreno fértil para crecer.\nDormir entre 7 y 8 horas, moverte al menos 15 minutos al día, comer con conciencia, tener pausas reales de desconexión y mantener vínculos afectivos de calidad… son tu mejor red de protección.' },
            ],
        },
        {
            type: 'collapsible',
            title: '¿Cómo saber si el estrés te está sobrepasando?',
            audioUrl:
            `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Comosabersielestresteestasobrepasando.mp3`,
            content: [
              { type: 'paragraph', text: 'A veces el cuerpo lo sabe antes que tú:' },
              { type: 'list', items: [
                '¿Te cuesta dormir o te despiertas cansado/a?',
                '¿Tienes tensión constante en el cuello, la espalda o la mandíbula?',
                '¿Te irritas con facilidad o sientes que “todo te da igual”?',
                '¿Comes, trabajas o ves pantallas de forma compulsiva para desconectarte?'
              ]},
              { type: 'paragraph', text: 'La buena noticia es que el primer paso no es hacer nada, sino darte cuenta. Observar. Ponerle nombre. Escucharte sin juicio. Eso ya empieza a transformarte.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'El estrés como brújula',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/Elestrescomobrujulaycierredelapsicoeducacion.mp3`,
            content: [
              { type: 'paragraph', text: 'El estrés no es una señal de que estés rota o roto. Es una brújula que te está mostrando que algo en tu vida necesita atención, cambio o cuidado.\nIgnorarlo o luchar contra él solo lo hace más fuerte. Aprender a escucharlo con curiosidad y compasión es el verdadero camino hacia la calma.\nVer el estrés con conciencia no significa eliminarlo, sino recuperar el poder sobre tu vida. Y ese poder empieza aquí, ahora, con tu decisión de mirar hacia dentro con valentía.' }
            ]
        },
        { type: 'quote', text: 'Tu cuerpo no está en tu contra. Te está hablando. La clave está en aprender a escucharlo con compasión.' },
        { type: 'title', text: 'Técnicas Específicas'},
        {
          type: 'stressMapExercise',
          title: 'Ejercicio 1: Mapa del Estrés Personal',
          objective: 'Piensa en una situación reciente que te haya generado estrés. Luego, completa paso a paso este registro guiado. Te acompañaré con preguntas breves para que puedas ir registrando lo que viviste: ',
          duration: '5 a 10 minutos',
        },
        {
          type: 'triggerExercise',
          title: 'Ejercicio 2: Identifica tu disparador',
          objective: 'Aprender a diferenciar si lo que te está generando estrés viene del entorno (externo) o de ti mismo/a (interno), para empezar a responder con conciencia en lugar de reaccionar en modo automático.',
          duration: '5 a 8 minutos',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/r1_desc/Tecnica-2-identifica-tu-disparador.mp3`
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/REFLEXION.mp3`,
          prompts: [
            '<p>Tómate unos minutos para responder en tu cuaderno o en el espacio que te ofrecemos dentro de la app. No hay respuestas correctas: solo pistas valiosas que te ayudan a conocerte mejor. </p><p><br></p><p>¿Qué me ayuda a volver a mi centro cuando me siento desbordado/a? </p>',
          ],
        },
          { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana1/RESUMENYCIERRE.mp3`},
        {
            type: 'list',
            items: [
                'El estrés es una respuesta natural del cuerpo, no un enemigo.',
                'Cada persona vive el estrés de forma distinta, según sus pensamientos, historia y entorno.',
                'Existen diferentes tipos de estrés: agudo, crónico, positivo (eustrés) y negativo (distrés).',
                'El estrés prolongado puede afectar tu cuerpo, tus emociones, tu mente y tus relaciones.',
                'Tus hábitos básicos (dormir, comer, moverte, conectar) son esenciales para regularte.',
                'Observar qué te estresa y cómo reaccionas te ayuda a responder con mayor claridad.',
                'Aprender a distinguir entre lo externo y lo interno te devuelve el poder sobre ti.',
            ]
        }
      ]
    },
    // ... rest of the file
    {
      id: 'estres_sem2',
      title: 'Semana 2: Activa tu Regulación Fisiológica',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
            {
                type: 'paragraphWithAudio',
                text: '¿Sabías que tu cuerpo también forma parte del proceso de autorregulación emocional? Bienvenida o bienvenido a la segunda sesión de esta ruta: “Activa tu regulación fisiológica”.   Esta semana vas a descubrir cómo tu cuerpo participa en la gestión del estrés. El objetivo es que empieces a conocer tu sistema nervioso, entiendas por qué se activa en ciertos momentos y aprendas a enviarle señales de seguridad. Vas a entrenar técnicas que te ayuden a decirle a tu cuerpo: “ya estás a salvo”.   Mientras escuchas este audio, piensa en algún momento reciente en que tu cuerpo te haya ayudado a calmarte sin proponértelo.   En el siguiente audio te explicaré por qué esto no es casualidad.',
                audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/INTROSEMANA2.mp3`,
            },
            { type: 'title', text: 'Psicoeducación' },
            {
                type: 'collapsible',
                title: 'No es solo una cuestión de pensar en positivo: El sistema nervioso autónomo',
                audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/Tucuerpotambienregulatusemociones.mp3`,
                content: [
                    { type: 'paragraph', text: '¿Te ha pasado alguna vez que estás nervioso/a, con la cabeza llena de cosas, y de pronto respiras más lento o te estiras… y sientes que algo empieza a aflojarse por dentro?\nEso no es casualidad: es tu cuerpo haciendo su parte para ayudarte a recuperar la calma.\nY es que no solo la mente participa en la gestión del estrés. Tu cuerpo tiene un papel clave. Muchas veces, aunque tú quieras estar tranquilo/a, tu cuerpo reacciona como si estuvieras en medio de una emergencia.'},
                    { 
                        type: 'collapsible',
                        title: 'Rama simpática: tu sistema de alarma',
                        audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/Ramasimpatica.mp3`,
                        content: [{ type: 'paragraph', text: 'Esta es la parte que se enciende cuando algo se percibe como una amenaza. Y no hace falta que sea un peligro real. El cuerpo no distingue entre un león y un correo urgente: si tu sistema cree que algo puede salir mal, activa la alarma igual.\nEn ese momento, tu corazón se acelerada, respiras más rápido, tus músculos se tensan… Es tu cuerpo preparándose para “luchar o huir”. A corto plazo, esta reacción puede ayudarte a resolver un problema. Pero si se mantiene encendida mucho tiempo, te agota, te desconecta y puede dejar encendida la ansiedad.' }]
                    },
                    { 
                        type: 'collapsible',
                        title: 'Rama parasimpática: tu sistema de descanso y seguridad',
                        audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/Ramaparasimpatica.mp3`,
                        content: [{ type: 'paragraph', text: 'Esta es la parte que le dice al cuerpo: “Ya estás a salvo, puedes bajar la guardia”.\nCuando se activa:\n- Tu respiración se vuelve más lenta.\n- Tus músculos se relajan.\n- Se reduce la tensión.\n- Tu cuerpo recupera energía.\n- Se activa un estado de bienestar profundo.\nY lo más importante: tu mente también se aclara. Puedes pensar con más calma, decidir mejor y sentirte más conectado/a contigo.' }]
                    },
                ]
            },
            {
                type: 'collapsible',
                title: 'Tu detector interno de seguridad',
                audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/TudetectorinternodeseguridadylaTeoriaPolivagal.mp3`,
                content: [
                    { type: 'paragraph', text: 'Tu cuerpo tiene un sistema que está constantemente vigilando si estás en un entorno seguro o si hay algún riesgo. Se llama neurocepción, y funciona sin que tú te des cuenta.\nEste sistema se activa por cosas muy sutiles, como:\n- Una mirada que percibes como crítica.\n- Un tono de voz tenso.\n- Un ambiente impredecible.\n- Un recuerdo que se activa sin querer.\nY cuando detecta algo que “no cuadra”, activa el modo defensa: ansiedad, tensión, malestar.' },
                    { type: 'paragraph', text: 'Aquí entra en juego la Teoría Polivagal, desarrollada por el neurocientífico Stephen Porges. Esta teoría nos dice que no hay solo “estrés” o “calma”. El cuerpo tiene tres estados principales, como una escalera:\n1. Conexión y calma: puedes pensar con claridad, estar presente, sentirte a gusto.\n2. Lucha o huida: tu cuerpo se activa para defenderse.\n3. Colapso o desconexión: si el peligro se siente abrumador, el cuerpo se apaga. Aparece la sensación de bloqueo, vacío, desconexión o “no estar aquí”.\nMuchos síntomas de ansiedad, tristeza o confusión no son fallos tuyos: son respuestas de un cuerpo que intenta protegerte, a su manera.' },
                ]
            },
            {
                type: 'collapsible',
                title: '¿Qué genera seguridad?',
                audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/Quegeneraseguridad.mp3`,
                content: [
                    { type: 'paragraph', text: 'La seguridad no es solo un pensamiento. Es un estado que se siente en el cuerpo. Cuando te sientes en confianza:\n- Tu respiración se regula sola.\n- Tu expresión facial se relaja.\n- Tu cuerpo se afloja.\n- Tu mente se siente más presente.\nY eso puede pasar por estar con alguien que te escucha, envolverte en una manta suave o simplemente sentir que respiras sin tensión. Son pequeños gestos que le dicen a tu cuerpo: “Estás bien, puedes soltar”.' }
                ]
            },
            { 
              type: 'title', 
              text: 'Técnicas Específicas', 
              audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/extras/R1semana2tecnicasespecificas.mp3`
            },
            {
                type: 'collapsible',
                title: '¿Por qué estas técnicas funcionan?',
                content: [
                    { type: 'paragraph', text: 'Cuando estás en modo alerta —corazón acelerado, cuerpo tenso, mente agitada— tu sistema nervioso intenta protegerte. Pero si esa activación se mantiene, tu bienestar se resiente.\nEstas técnicas activan el sistema parasimpático, que envía una señal clara al cuerpo: “ya no estás en peligro”.\nPracticar con regularidad te ayuda a recuperar el equilibrio con más facilidad.\nEstudios científicos muestran que 8 semanas de práctica de respiración o mindfulness pueden producir cambios reales en el cerebro, como la reducción del volumen de la amígdala (el centro del miedo en el cerebro).\nEs decir: estás entrenando tu cuerpo y tu mente para vivir con más calma.' },
                ]
            },
            {
                type: 'collapsible',
                title: '¿Qué cambia cuando las practicas?',
                content: [
                  { type: 'paragraph', text: 'En tu cuerpo:'},
                  { type: 'list', items: ['Respiración más profunda y regular','Regulación del CO₂ (menos mareos o ahogo)','Reducción de tensión muscular','Sensaciones de alivio, calor o calma']},
                  { type: 'paragraph', text: 'En tu mente:'},
                  { type: 'list', items: ['Recuperas el control y vuelves al presente','Se interrumpe el bucle de pensamientos ansiosos','Refuerzas el autocuidado y la conexión contigo']},
                  { type: 'paragraph', text: 'Estas herramientas usan el cuerpo como puerta de entrada al bienestar. Respiración, movimiento, atención plena o contacto sensorial... Todas comparten un mismo propósito: ayudarte a regularte y conectar contigo desde un lugar seguro.'}
                ]
            },
            {
                type: 'collapsible',
                title: '¿Cuándo puedes usarlas?',
                content: [
                  { type: 'paragraph', text: 'Puedes usar estas técnicas:'},
                  { type: 'list', items: ['En el momento: si sientes ansiedad o bloqueo', 'Antes de una situación desafiante', 'Como rutina diaria para entrenar tu equilibrio']},
                  { type: 'paragraph', text: 'Practicar no solo te calma en el momento. Te transforma a largo plazo.\nLa calma también se entrena.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'Selección de técnicas',
                content: [
                    { type: 'collapsible', title: 'Técnica 1: Respiración 4–2–6 con gesto de autocuidado', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1_respiracion_4-2-6.mp3`, content: [{ type: 'paragraph', text: 'Ideal antes de dormir o al comenzar el día. Inhala por la nariz durante 4 segundos. Mantén el aire 2 segundos. Exhala lentamente por la boca durante 6 segundos. Mientras respiras, coloca una mano sobre el pecho o el abdomen, como gesto de cuidado hacia ti. Practica esta respiración durante 1 o 2 minutos, varias veces al día o en momentos de tensión.' }] },
                    { type: 'collapsible', title: 'Técnica 2: Anclaje sensorial inmediato (Técnica 5-4-3-2-1)', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/R1_anclaje_sensorial_inmediato.m4a`, content: [{ type: 'paragraph', text: 'Úsala cuando tu mente se inunde de pensamientos anticipatorios.' }] },
                    { type: 'collapsible', title: 'Técnica 3: Escaneo corporal sin juicio (body scan)', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R_body_scan_breve.mp3`, content: [{ type: 'paragraph', text: 'Útil para relajarte al final del día o facilitar el descanso.' }] },
                    { type: 'collapsible', title: 'Técnica 4: Relajación muscular progresiva (Jacobson)', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1-parte-1-respiracion-muscular-progresiva.mp3`, content: [{ type: 'paragraph', text: 'Si sientes ansiedad física o mucha tensión corporal.' }] },
                    {
                        type: 'collapsible',
                        title: 'Técnica 5: Técnicas de presión profunda y balanceo corporal',
                        audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R16balanceocorporal.mp3`,
                        content: [{ type: 'paragraph', text: 'Especialmente útiles en momentos de desregulación intensa.' }]
                    },
                     {
                      type: 'collapsible',
                      title: 'Técnica 6: Contacto frío breve (reset inmediato)',
                      audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana2tecnica20contactofrio.mp3`,
                      content: [{ type: 'paragraph', text: 'Cómo aplicarlo:\n1.\tHumedece una toalla o paño con agua fría.\n2.\tAplícalo entre 10 y 20 segundos en:\n\to\tLa nuca\n\to\tLas muñecas\n\to\tLa parte interna de los brazos o las mejillas\n3.\tRespira mientras sientes el contacto del frío.\nSi estás fuera de casa, puedes usar agua del grifo o un cubito envuelto en tela.\nEste pequeño “shock” activa una respuesta calmante en tu cuerpo y te ayuda a pausar el bucle de ansiedad.' }]
                    },
                ]
            },
             {
                type: 'therapeuticNotebookReflection',
                title: 'Registro de experiencia personal',
                prompts: ['¿Cómo te sentiste después de practicar alguna de estas técnicas? Escribe aquí tus palabras clave, sensaciones o una breve reflexión que quieras recordar:'],
            },
          
            { 
              type: 'therapeuticNotebookReflection', 
              title: 'Reflexión Final de la Semana', 
              audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/REFLEXION.mp3`, 
              prompts: [
                '<p>Tómate unos minutos para responder en tu cuaderno o en el espacio que te ofrecemos dentro de la app. No hay respuestas correctas: solo pistas valiosas que te ayudan a conocerte mejor. </p><p><br></p><p>¿Qué me ayuda a volver a mi centro cuando me siento desbordado/a? </p>',
              ]
            },
            { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta1/semana2/RESUMENYCIERRE.mp3`},
            { type: 'list', items: ['Tu cuerpo también forma parte de tu sistema de regulación emocional.', 'El sistema nervioso reacciona con alarma incluso ante estímulos cotidianos.', 'Puedes activar el sistema de calma mediante técnicas sencillas y efectivas.', 'La respiración, el movimiento suave o el contacto físico envían señales de seguridad al cerebro.', 'Cuanto más entrenas estas técnicas, más fácil te resulta acceder a la calma cuando la necesitas.'] },
            { type: 'quote', text: 'Respirar con conciencia es el gesto más pequeño y poderoso que puedes hacer por ti.'}
        ]
    },
    // ... rest of the file
  ],
};

    
