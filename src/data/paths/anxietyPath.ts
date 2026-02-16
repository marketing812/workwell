
import type { Path } from './pathTypes';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

export const anxietyPath: Path = {
  id: 'regular-ansiedad-paso-a-paso',
  title: 'Regular la Ansiedad Paso a Paso',
  description: 'En esta ruta vas a aprender, paso a paso, a entender tu ansiedad sin luchar contra ella, a calmar tu cuerpo para calmar tu mente, a observar los pensamientos sin quedarte atrapado/a en ellos y a dar pequeños pasos hacia aquello que hoy evitas. Todo con herramientas prácticas avaladas por la ciencia, fáciles de entrenar en tu día a día.',
  dataAiHint: 'anxiety mindfulness calm',
  audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/introycierre/Ruta13introduccion.mp3`,
  modules: [
    {
      id: 'ansiedad_sem1',
      title: 'Semana 1: Entiende tu Ansiedad, no la Pelees',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: 'En esta primera semana vamos a sentar las bases de las relaciones que de verdad nutren: la empatía real y la honestidad emocional.\nNo se trata de ser perfecto o perfecta, ni de decirlo todo sin filtro, sino de aprender a estar presente sin disfraces y a no dejarte fuera de lo que sientes.\nVas a descubrir que la empatía no es imaginarte en el lugar del otro, sino intentar comprender su mundo sin juicios ni correcciones. Y que la autenticidad no es imponerte, sino expresarte con respeto y verdad.\nDurante esta semana empezarás a observar en qué relaciones puedes ser tú con libertad y en cuáles te pones una máscara para protegerte o agradar. Entrenarás a escucharte antes de responder y a comunicarte desde un lugar más conectado contigo.',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13semana1introduccion.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'La ansiedad: molesta, pero con sentido',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13semana1psicoeducpantalla1la%20ansiedad%20molesta.mp3`,
          content: [
            { type: 'paragraph', text: 'La ansiedad no es tu enemiga, aunque a veces lo parezca.' },
            { type: 'paragraph', text: 'Es esa compañera molesta e incómoda que aparece justo cuando menos la quieres: antes de una reunión importante, en la cama cuando intentas dormir, o de camino a un sitio que te importa. Te fastidia, y mucho. Nadie quiere vivir con el corazón acelerado, la mente disparada y esa sensación de no estar en control.'},
            { type: 'paragraph', text: 'Pero, si la miramos desde otra perspectiva, la ansiedad tiene un propósito: tu cuerpo se activa para protegerte, como si se encendiera una alarma interna. El problema aparece cuando esa alarma salta demasiado fuerte o demasiado a menudo, incluso sin peligro real. Y ahí es cuando pasa de ser útil a un obstáculo.' },
            { type: 'paragraph', text: 'En esta ruta no vamos a “eliminar la ansiedad”, sino a aprender a regularla. A bajarle el volumen para que deje de dirigir tu vida.' }
          ]
        },
        { 
            type: 'collapsible',
            title: 'Ansiedad adaptativa vs. ansiedad disfuncional',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13semana1pantalla2ansiedadadPtativa.mp3`,
            content: [
              { type: 'paragraph', text: 'No toda ansiedad es mala, aunque lo parezca.' },
              { type: 'paragraph', text: '<b>Ansiedad adaptativa</b>' },
              { type: 'list', items: ['Te mantiene alerta y enfocado/a.','Por ejemplo, esos nervios antes de un examen que te ayudan a estudiar con más energía.'] },
              { type: 'paragraph', text: '<b>Ansiedad disfuncional</b>' },
              { type: 'list', items: ['Se enciende sin motivo claro o de forma desproporcionada.','En lugar de ayudarte, te bloquea: no duermes, evitas situaciones, piensas sin parar en lo peor.','Es como una alarma que suena cada dos por tres, incluso sin fuego.'] },
              { type: 'paragraph', text: 'La clave no es luchar contra la ansiedad, sino distinguir cuándo te está ayudando y cuándo te está saboteando.\nPiensa en tu ansiedad como un detector de humo demasiado sensible: no distingue entre el vapor de la ducha y un incendio real. El problema no eres tú, es que tu sistema de alarma está calibrado demasiado alto.' }
            ]
        },
        {
          type: 'collapsible',
          title: 'Tu sistema nervioso en acción',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13sem1pant3tusistnervioso.mp3`,
          content: [
            { type: 'paragraph', text: 'La ansiedad vive en tu cuerpo, no solo en tu mente.'},
            { type: 'paragraph', text: 'Tu sistema nervioso autónomo funciona como los pedales de un coche:'},
            { type: 'list', items: ['La rama simpático pisa el acelerador (sube la frecuencia cardíaca, la respiración, la tensión muscular).','La rama parasimpático actúa como freno (calma, ayuda a la digestión y al descanso).']},
            { type: 'paragraph', text: 'Cuando la ansiedad aparece, es como si tu pedal del acelerador se quedara atascado, incluso en situaciones normales. Tu cuerpo se pone en “modo emergencia” para protegerte… pero en realidad no hace falta.'},
            { type: 'paragraph', text: 'Además, tu cuerpo libera adrenalina y cortisol, las hormonas del estrés. A corto plazo te ponen en alerta, pero cuando se repiten demasiadas veces, te dejan agotado/a.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'Ansiedad, trastorno de ansiedad y ataque de pánico',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13sem1pant4Nsiedadtrastorno.mp3`,
          content: [
            { type: 'paragraph', text: 'Si alguna vez te has preguntado: “¿Esto que me pasa es normal o es un trastorno?”, tranquilo/a: no eres el único. Aquí tienes una guía sencilla para ponerle nombre a lo que vives:' },
            { type: 'paragraph', text: '<b>Ansiedad normal o adaptativa</b>' },
            { type: 'list', items: ['Surge ante un reto real (ej. entrevista, examen).','Es pasajera y baja sola cuando pasa la situación.'] },
            { type: 'paragraph', text: '<b>Trastorno de ansiedad</b>' },
            { type: 'list', items: ['La activación es excesiva, frecuente o sin causa clara.','Afecta tu vida diaria: trabajo, descanso, relaciones.','Puede llevarte a evitar lugares o situaciones.','Necesita abordaje terapéutico para recuperar equilibrio.'] },
            { type: 'paragraph', text: '<b>Ataque de pánico</b>' },
            { type: 'list', items: ['Irrumpe de golpe, con síntomas intensos: taquicardia, falta de aire, mareo, sensación de “morirme” o “perder el control”.','Aunque asusta mucho, no es peligroso: el cuerpo no puede sostener esa activación y termina bajando.','Puede aparecer dentro de un trastorno de pánico o de forma aislada.'] },
            { type: 'paragraph', text: 'Ejemplo sencillo:' },
            { type: 'list', items: ['Ansiedad → nervios antes de una charla.','Trastorno de ansiedad → semanas sin dormir porque temes no dar la charla.','Ataque de pánico → de repente tu cuerpo explota en síntomas, aunque estés tranquilo/a en casa.'] },
            { type: 'paragraph', text: 'No es para etiquetarte, sino para que sepas reconocer lo que vives y cómo trabajarlo. Y recuerda: incluso en los casos más intensos, la ansiedad se puede mejorar.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'La ansiedad tiene un lenguaje',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13sem1pant5ansiedadlenguaje.mp3`,
          content: [
            { type: 'paragraph', text: 'La ansiedad se comunica contigo a través de síntomas. Algunos son más físicos (palpitaciones, sudor, tensión muscular) y otros más mentales (preocupaciones, pensamientos de “y si…”).'},
            { type: 'paragraph', text: 'Piensa en ella como un mensajero pesado: insiste en llamar a tu puerta, aunque no siempre traiga noticias importantes.'},
            { type: 'list', items: ['Si le cierras de golpe, insiste más.','Si le escuchas con calma, puedes decidir qué hacer con el mensaje.']},
            { type: 'paragraph', text: 'Este proceso suele convertirse en un círculo de la ansiedad:\n1.\tAparece un síntoma (ej. taquicardia).\n2.\tTu mente lo interpreta como peligro (“me va a dar algo”).\n3.\tEsa interpretación dispara más síntomas.\n4. \tY así se forma la bola de nieve.'},
            { type: 'paragraph', text: 'Lo que rompe el círculo no es evitar, sino aprender a interpretar de otra forma lo que ocurre.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'No luches contra la ansiedad',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13sem1pant6noluchescontraNsied.mp3`,
          content: [
            { type: 'paragraph', text: 'Cuando la ansiedad aparece, lo primero que solemos pensar es: “¡Quiero que se vaya ya!”. Pero aquí ocurre algo paradójico: cuanto más intentas forzarla a desaparecer, más se intensifica. Es como si tu cerebro interpretara: “Esto es tan peligroso que necesito luchar con todas mis fuerzas”.' },
            { type: 'paragraph', text: 'Y entonces, en lugar de calmarse, tu sistema nervioso se activa aún más.'},
            { type: 'paragraph', text: 'La ciencia —desde la psicología cognitivo-conductual hasta la neurociencia— nos muestra otra vía mucho más eficaz:'},
            { type: 'list', items: ['Observar sin juzgar → como si vieras pasar una nube en el cielo, que se desplaza sola sin que tengas que empujarla.','Darle un espacio controlado → dejar que esté ahí, pero sin que ocupe todo tu campo de visión.','Usar técnicas corporales y mentales → tu respiración, tu atención y tus recursos internos actúan como anclas que ayudan a que la ola de ansiedad suba… y después vuelva a bajar, como siempre lo hace.']},
            { type: 'paragraph', text: 'Ejemplo: imagina un globo que intentas meter bajo el agua. Cuanto más lo fuerzas hacia abajo, más salta hacia arriba. Pero si lo sueltas, el globo se queda flotando. Lo mismo pasa con la ansiedad: si dejas de pelearte con ella, pierde fuerza y tú recuperas la capacidad de decidir cómo sostenerla.'},
            { type: 'paragraph', text: 'Importante: muchas veces recurrimos a la evitación para lidiar con la ansiedad (no ir a un sitio, no hacer algo). Eso da alivio inmediato, pero refuerza el miedo: tu cerebro aprende que “menos mal que lo esquivé, porque era peligroso”. Con el tiempo, la evitación se convierte en gasolina para la ansiedad.'},
            { type: 'paragraph', text: 'No se trata de eliminar la ansiedad, sino de recuperar el mando. Tú puedes estar en el asiento del conductor, incluso cuando la ansiedad viaja de copiloto.'}
          ]
        },
        { type: 'title', text: 'Técnicas Específicas'},
        { 
            type: 'ansiedadTieneSentidoExercise',
            title: 'MI ANSIEDAD TIENE SENTIDO CUANDO…',
            objective: 'Aprender a diferenciar cuándo tu ansiedad tiene un sentido adaptativo y a identificar cuándo se vuelve excesiva, reconociendo cómo el miedo a la ansiedad alimenta el círculo.',
            duration: '8-10 min',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana1tecnica1.mp3`
        },
        {
            type: 'visualizacionGuiadaCuerpoAnsiedadExercise',
            title: 'VISUALIZACIÓN GUIADA DEL CUERPO EN ANSIEDAD',
            objective: 'Reconocer las sensaciones de la ansiedad sin luchar contra ellas, comprendiendo que aunque son incómodas, no son peligrosas.',
            duration: '10-12 min',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana1tecnica2.mp3`
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13reflexioncuaderno.mp3`,
          prompts: ['<ul><li>¿Qué he descubierto sobre mi manera de interpretar la ansiedad?</li><li>¿Qué sensaciones me resultan más difíciles de aceptar y qué pensamientos suelen acompañarlas?</li><li>¿Qué diferencia noto entre luchar contra la ansiedad y observarla con curiosidad?</li></ul>']
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana1/Ruta13resumenclave.mp3`},
        { type: 'list', items: ['La ansiedad es molesta pero no es tu enemiga: es una señal de alarma que a veces se desajusta.','Distinguir entre ansiedad adaptativa y disfuncional ayuda a no pelearte con ella.','Tu sistema nervioso funciona como pedales: acelerador (simpático) y freno (parasimpático).','No es lo mismo ansiedad, trastorno de ansiedad o ataque de pánico: conocer la diferencia te da claridad.','Los síntomas físicos y mentales de la ansiedad son mensajes, no peligros en sí mismos.','Luchar contra la ansiedad la intensifica; observarla y darle espacio la calma.','Evitar situaciones da alivio momentáneo, pero alimenta el círculo del miedo.']},
        { type: 'quote', text: 'La ansiedad no es un monstruo a vencer, sino una alarma que puedes aprender a escuchar y regular con calma.'}
      ]
    },
    {
      id: 'ansiedad_sem2',
      title: 'Semana 2: Calma el Cuerpo para Calmar la Mente',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        { 
            type: 'paragraphWithAudio', 
            text: 'Cuando la ansiedad llega, parece que no hay botón de pausa. El cuerpo se acelera y la mente se llena de pensamientos catastróficos. Esta semana vas a descubrir que sí existe una forma de frenar: aprenderás técnicas sencillas para interrumpir la escalada, bajar la activación y recuperar el control. Como un piloto que activa el freno de emergencia para estabilizar el avión, tú también puedes activar tus recursos internos para volver a sentir seguridad.', 
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2introducc.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: “Cuando el cuerpo corre, la mente corre”',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant1ganchoemoc.mp3`,
          content: [
            { type: 'paragraph', text: '¿Has notado que la ansiedad empieza en el cuerpo antes de que te des cuenta en la cabeza?'},
            { type: 'paragraph', text: 'De repente, el corazón se acelera, el estómago se encoge o la respiración se agita… y ahí, como por arte de magia, aparecen los pensamientos: “¿y si me pasa algo malo? ¿y si no lo controlo? ¿y si me da algo aquí mismo?”.'},
            { type: 'paragraph', text: 'Esto ocurre porque cuerpo y mente son como dos bailarines atados con la misma cuerda: cuando uno se acelera, arrastra al otro.'},
            { type: 'paragraph', text: 'La buena noticia es que este vínculo también funciona en positivo: si aprendes a calmar tu cuerpo, tu mente se relaja automáticamente.'},
            { type: 'paragraph', text: 'Esta semana vas a entrenar esa palanca: empezar por el cuerpo para que tu mente tenga un lugar donde descansar.'}
          ]
        },
        {
            type: 'collapsible',
            title: 'El cuerpo como regulador directo',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant2cuerporegulDor.mp3`,
            content: [
                { type: 'paragraph', text: 'Dentro de ti funciona un sistema automático que no eliges de forma consciente: el sistema nervioso autónomo.'},
                { type: 'paragraph', text: 'Como explicamos también en la semana 1, puedes imaginarlo como un coche con dos pedales:'},
                { type: 'list', items: ['El acelerador (la rama simpática): te activa, sube el pulso, la tensión muscular y la respiración.','El freno (la rama parasimpática): te calma, ayuda a la digestión y al descanso.']},
                { type: 'paragraph', text: 'Cuando la ansiedad aparece, lo que pasa es que el acelerador se queda pisado, incluso en situaciones normales. Tu cuerpo se pone en “modo emergencia” para protegerte… pero en realidad no hace falta.'},
                { type: 'paragraph', text: 'Lo que aprenderás aquí es a tocar el freno de forma intencional con técnicas sencillas de respiración, relajación y movimiento consciente.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Por qué empezar por el cuerpo antes que por la mente',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant3porqEmpezXcorpo.mp3`,
            content: [
                { type: 'paragraph', text: 'La ansiedad funciona como un círculo que se alimenta a sí mismo:'},
                { type: 'list', items: ['Sientes un síntoma (ej. taquicardia).','Lo interpretas como peligro (“me va a dar algo”).','Esa interpretación te asusta más y provoca más síntomas. Sin querer, hace que la ansiedad y el miedo suban más.']},
                { type: 'paragraph', text: 'Es como si tu cuerpo encendiera la alarma y tu mente cogiera el micrófono para amplificarla.'},
                { type: 'paragraph', text: 'Muchas veces intentamos romper este círculo solo con pensamientos positivos: “tranquilo, no pasa nada”. Pero cuando el cuerpo ya está disparado, a veces la mente no lo cree.'},
                { type: 'paragraph', text: 'Por eso, esta semana, empezamos por el cuerpo: al bajar la respiración, soltar los músculos o enfriar el cuerpo, el cerebro recibe una señal poderosa de calma que corta el círculo.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El freno vagal: tu sistema de calma natural',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant4frenoVagal.mp3`,
            content: [
                { type: 'paragraph', text: 'Hay un “cable maestro” que conecta tu cuerpo con tu cerebro: el nervio vago.'},
                { type: 'paragraph', text: 'Puedes imaginarlo como un freno interno que, cuando lo activas, manda el mensaje a tu cerebro de: “no hay peligro, puedes bajar la guardia”.'},
                { type: 'paragraph', text: '¿Cómo se activa? Con cosas muy sencillas:'},
                { type: 'list', items: ['Respirar lento y profundo.','Alargar la exhalación más que la inhalación.','Hacer pausas de calma en el cuerpo.']},
                { type: 'paragraph', text: 'Cuando lo entrenas, tu corazón se desacelera, la respiración se regula y la sensación de alarma baja.'},
                { type: 'paragraph', text: 'En neurociencia se ha visto que este “tono vagal alto” está asociado a más resiliencia emocional y mayor capacidad de mantener la calma en momentos difíciles. El tono vagal alto significa que tu nervio vago funciona bien y se activa con facilidad.'},
                { type: 'paragraph', text: 'Hoy en día sabemos que las personas con tono vagal alto, suelen recuperarse antes del estrés, tener un corazón más estable y sentirse más equilibradas emocionalmente.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El cerebro bajo calma y bajo ansiedad',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant5cerebroCalma.mp3`,
            content: [
                { type: 'paragraph', text: 'Tu cerebro tiene dos modos principales de funcionamiento, que se activan según percibas amenaza o seguridad:'},
                { type: 'list', items: ['Modo alarma: la amígdala (tu detector de humo interno) grita: “¡cuidado, cuidado!”. Tu cuerpo se prepara para huir o luchar y la parte racional de tu cerebro se apaga un poco.','Modo calma: la corteza prefrontal (tu parte racional, pensante y reflexiva) recupera el mando, analiza la situación y decide con claridad.']},
                { type: 'paragraph', text: 'En un pico de ansiedad, la amígdala es tan ruidosa que apenas escuchas a tu parte racional. Por eso piensas en bucle o sientes que te bloqueas. A esto se le llama secuestro emocional: la parte más instintiva y emocional de tu cerebro toma el mando y “apaga” temporalmente a la parte racional, como si la alarma interna se adueñara de todo el sistema. '},
                { type: 'paragraph', text: 'La buena noticia es que, al calmar el cuerpo, ese secuestro pierde fuerza y tu mente pensante puede recuperar el control.'},
                { type: 'paragraph', text: 'El resultado: menos caos, más claridad y más sensación de control real.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'La interocepción: escuchar sin miedo',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant6Interocepcion.mp3`,
            content: [
                { type: 'paragraph', text: 'La interocepción es la capacidad de sentir tu propio cuerpo por dentro: tu pulso, tu respiración, el nudo en el estómago, el calor en la cara…'},
                { type: 'paragraph', text: 'En la ansiedad, lo difícil no son esas sensaciones en sí, sino cómo las interpretamos:'},
                { type: 'list', items: ['“Me late fuerte el corazón → seguro es un infarto.”','“Me mareo → me voy a caer.”','“Me tiembla el cuerpo → voy a perder el control.”']},
                { type: 'paragraph', text: 'Pero en realidad, son respuestas normales de un cuerpo que está en alarma. No son peligrosas, aunque si son molestas.'},
                { type: 'paragraph', text: 'Practicar a observarlas sin juzgarlas te permite comprobar que esas sensaciones, aunque incómodas, siempre suben y bajan.'},
                { type: 'paragraph', text: 'Es como mirar cómo pasa una nube por el cielo: no necesitas empujarla, se moverá sola.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Entrenamiento y constancia: el cerebro también se entrena',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant7entrenamConstanc.mp3`,
            content: [
                { type: 'paragraph', text: 'Aquí entra en juego la neuroplasticidad, la capacidad del cerebro de aprender y cambiar con la práctica.'},
                { type: 'paragraph', text: 'Cada vez que respiras de forma calmada, relajas tus músculos o haces un ejercicio de anclaje, tu cerebro registra una nueva asociación: “cuando siento ansiedad, también puedo encontrar calma.”'},
                { type: 'paragraph', text: 'Si lo repites una y otra vez, esas conexiones se fortalecen. Con el tiempo, tu cuerpo empezará a responder con menos alarma de forma más automática.'},
                { type: 'paragraph', text: 'No se trata de hacerlo perfecto, sino de volver una y otra vez al entrenamiento, como quien ejercita un músculo. 5–10 minutos diarios son más potentes que una práctica larga de vez en cuando.'}
            ]
        },
        {
          type: 'collapsible',
          title: 'Cierre de la psicoeducación',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2pant8cierrePsicoeduc.mp3`,
          content: [
            { type: 'paragraph', text: 'En resumen:'},
            { type: 'list', items: ['La ansiedad se alimenta del cuerpo y de la mente, pero puedes interrumpirla empezando por el cuerpo.','Tu sistema tiene un freno natural (nervio vago) que puedes aprender a activar.','Cuando calmas el cuerpo, tu cerebro recupera claridad.','Las sensaciones no son peligrosas: observarlas sin miedo es clave para que su fuerza disminuya.','Con práctica constante, entrenas a tu sistema nervioso para volver al equilibrio cada vez más rápido.']},
            { type: 'paragraph', text: 'Ahora vas a aprender herramientas concretas para activar ese freno natural. Elige las que más te encajen y hazlas tuyas: son tu kit personal de calma frente a la ansiedad'}
          ]
        },
        { type: 'title', text: 'Técnicas Específicas de Relajación'},
        { 
            type: 'paragraphWithAudio', 
            text: 'Cuando la ansiedad aparece, el cuerpo se activa como si hubiera un peligro real: corazón acelerado, respiración rápida, músculos tensos… Estas técnicas tienen un objetivo claro: enseñarle a tu cuerpo que puede volver a la calma y, al hacerlo, ayudar también a tu mente a relajarse. Al practicarlas de forma regular, estarás entrenando a tu sistema nervioso para que responda con más equilibrio, de modo que la ansiedad deje de sentirse como una ola que te arrastra y se convierta en una ola que sabes surfear. Lo más importante no es probar todas, sino elegir 2 o 3 que encajen contigo y repetirlas con constancia. Te recomiendo practicarlas varias veces al día o en momentos de ansiedad elevada.', 
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/Ruta13semana2tecnica1.mp3`
        },
        {
          type: 'collapsible',
          title: 'Coherencia Cardiaca (respiración 5–5)',
          content: [
            { type: 'paragraph', text: 'Cómo funciona: Consiste en inhalar 5 segundos y exhalar otros 5, durante al menos 5 minutos. Ese ritmo hace que tu corazón y tu respiración trabajen “al unísono”, como una orquesta afinada. A nivel biológico, mejora la variabilidad de la frecuencia cardiaca (HRV), que es un buen marcador de equilibrio y resiliencia emocional.' },
            { type: 'paragraph', text: 'Efecto: Cuando practicas este ritmo, tu cuerpo entra en un estado de coherencia fisiológica: tu corazón late más estable, tu respiración se vuelve fluida y tu mente se siente más centrada. Es una de las técnicas con mayor respaldo científico para reducir ansiedad y aumentar calma sostenida.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Respiración diafragmática (abdominal)',
          content: [
            { type: 'paragraph', text: 'Cómo funciona: En lugar de respirar solo con la parte alta del pecho —que es lo que solemos hacer cuando estamos nerviosos—, aprendemos a usar toda nuestra capacidad pulmonar.'},
            { type: 'paragraph', text: 'Cuando el aire entra y llega hasta la parte baja de los pulmones, el diafragma (un músculo en forma de cúpula que separa el pecho del abdomen) desciende y empuja suavemente las vísceras hacia abajo. Por eso, al inhalar, parece que la barriga se expande un poco hacia fuera, como si inflaras un globo dentro del abdomen.' },
            { type: 'paragraph', text: 'Al exhalar, el diafragma sube de nuevo y el abdomen baja de forma natural.'},
            { type: 'paragraph', text: 'Metáfora sencilla: piensa que estás cambiando de “respirar rápido y superficial, como un perrito jadeando” a “respirar profundo y sereno, como un bebé dormido”.' },
            { type: 'paragraph', text: 'Efecto: Disminuye la sensación de ahogo, reduce las palpitaciones y relaja la musculatura. Además, aumenta la oxigenación del cuerpo y manda un mensaje claro al cerebro: “no hay peligro real, podemos bajar la alarma”.' }
          ]
        },
        { 
            type: 'collapsible', 
            title: 'Exhalación prolongada (relación 1:2)',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana2tecnica13exhalacionprolongada.mp3`,
            content: [
              { type: 'paragraph', text: 'Cómo funciona: La clave está en alargar más la exhalación que la inhalación (ejemplo: inhala 3 segundos, exhala 6). Este gesto activa el nervio vago, que funciona como el freno natural del cuerpo.'},
              { type: 'paragraph', text: 'Efecto: Baja la frecuencia cardíaca de forma rápida y reduce la sensación de urgencia o falta de aire. Ideal para momentos en los que la ansiedad se dispara y necesitas un recurso breve pero muy eficaz.'}
            ] 
        },
        { 
            type: 'collapsible', 
            title: 'Relajación muscular progresiva (Jacobson)',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana2tecnica14Jacobson.mp3`, 
            content: [
              { type: 'paragraph', text: 'Cómo funciona: Se basa en tensar y soltar diferentes grupos musculares (piernas, abdomen, cara, hombros…). Al contrastar la tensión con la relajación, el cuerpo aprende a identificar mejor cuándo está tenso y a soltarlo de forma más consciente.'},
              { type: 'paragraph', text: 'Efecto: Reduce la rigidez muscular acumulada por la ansiedad sostenida, mejora el descanso y genera una sensación general de “soltar peso”. También disminuye los síntomas físicos que mantienen el círculo ansioso.'}
            ] 
        },
        { 
            type: 'collapsible', 
            title: 'Body scan breve (escaneo corporal sin juicio)',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana2tecnica15bodyscan.mp3`, 
            content: [
              { type: 'paragraph', text: 'Cómo funciona: Consiste en recorrer mentalmente tu cuerpo, de pies a cabeza, observando lo que sientes en cada zona sin juzgarlo ni intentar cambiarlo. Es un ejercicio de atención plena (mindfulness) enfocado en la interocepción, es decir, en escuchar tu interior.'},
              { type: 'paragraph', text: 'Efecto: Te ayuda a relacionarte de manera más amable con tus sensaciones corporales, en vez de interpretarlas como peligrosas. Aumenta la tolerancia a síntomas como palpitaciones o mareo, y con la práctica la ansiedad pierde fuerza porque ya no la vives como un enemigo, sino como algo que sabes observar.'}
            ] 
        },
        {
          type: 'collapsible',
          title: 'Respiración 4–2–6 con gesto de autocuidado',
          content: [
            { type: 'paragraph', text: 'Cómo funciona: Inhalas 4 segundos, retienes 2 y exhalas 6, mientras colocas una mano en el pecho o abdomen. El gesto táctil refuerza la sensación de seguridad y calma, y el ritmo respiratorio activa el freno parasimpático.'},
            { type: 'paragraph', text: 'Efecto: Combina la regulación fisiológica con un efecto emocional de autocuidado. Es muy útil para bajar la intensidad de la ansiedad y sentir que recuperas el control sobre tu cuerpo en pocos minutos.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'Movimiento consciente / estiramientos lentos',
          content: [
            { type: 'paragraph', text: 'Cómo funciona: Realizas estiramientos suaves (cuello, hombros, espalda) al mismo tiempo que prestas atención a tu respiración. Esto libera tensión física y evita que el cuerpo quede en “modo rígido” propio de la ansiedad.'},
            { type: 'paragraph', text: 'Efecto: Produce una sensación de descarga y conexión con el cuerpo. También ayuda a salir del estado de alerta, ya que el movimiento lento es incompatible con la respuesta de lucha-huida.'}
          ]
        },
        {
            type: 'collapsible',
            title: 'Anclaje sensorial 5–4–3–2–1',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1_anclaje_sensorial_inmediato.m4a`,
            content: [
              { type: 'paragraph', text: 'Cómo funciona: Rediriges la atención a tus sentidos: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas. Así cortas el bucle de pensamientos ansiosos y llevas la mente al presente.'},
              { type: 'paragraph', text: 'Efecto: Te ayuda a romper la rumiación y los “¿y si…?”, aterrizando en lo que realmente está ocurriendo aquí y ahora. Es especialmente eficaz en crisis de ansiedad con pensamientos repetitivos.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Balanceo corporal o presión profunda',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R16balanceocorporal.mp3`,
            content: [
              { type: 'paragraph', text: 'Cómo funciona: Abrazarte fuerte, usar una manta con peso o balancearte suavemente estimula la propiocepción (la percepción del cuerpo en el espacio). Esto envía una señal de seguridad y contención al sistema nervioso.'},
              { type: 'paragraph', text: 'Efecto: Genera una sensación de calma, calor interno y seguridad, como un “abrazo regulador”. Muy útil en momentos de agitación o cuando la ansiedad viene acompañada de nerviosismo físico.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Contacto frío breve',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana2tecnica20contactofrio.mp3`,
            content: [
              { type: 'paragraph', text: 'Cómo aplicarlo:' },
              { type: 'list', items: ['Humedece una toalla o paño con agua fría.','Aplícalo entre 10 y 20 segundos en:\n  - La nuca\n  - Las muñecas\n  - La parte interna de los brazos o las mejillas','Respira mientras sientes el contacto del frío.'] },
              { type: 'paragraph', text: 'Si estás fuera de casa, puedes usar agua del grifo o un cubito envuelto en tela.'},
              { type: 'paragraph', text: 'Este pequeño “shock” activa una respuesta calmante en tu cuerpo y te ayuda a pausar el bucle de ansiedad.' }
            ]
        },
        {
          type: 'collapsible',
          title: 'Respiración 4–7–8 (avanzada, para calma y sueño)',
          content: [
            { type: 'paragraph', text: 'Cómo funciona: Inhalas 4 segundos, retienes 7 y exhalas 8. Esta retención larga, combinada con la exhalación prolongada, produce un efecto sedante.'},
            { type: 'paragraph', text: 'Efecto: Induce estados de calma profunda y favorece la conciliación del sueño. No es recomendable en plena hiperventilación, pero sí como práctica regular para entrenar la calma y preparar el cuerpo para dormir.'}
          ]
        },
        { type: 'paragraph', text: 'Nota rápida: El orden prioriza lo que modula con más consistencia el SNA y mantiene el efecto (coherencia, diafragmática, exhalación y RMP) frente a recursos útiles, pero más situacionales o breves (anclaje, frío, presión profunda, 4–7–8). Tu experiencia y preferencia personal también cuentan: si una técnica “te engancha”, su eficacia real sube porque la practicarás más.'},
        {
            type: 'therapeuticNotebookReflection',
            title: 'Registro de experiencia personal',
            prompts: ['¿Cómo te sentiste después de practicar alguna de estas técnicas? Escribe aquí tus palabras clave, sensaciones o una breve reflexión que quieras recordar:'],
        },
          
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2reflexion.mp3`, 
          prompts: [
            '<ul><li>¿Qué técnica me ha resultado más útil o fácil de practicar esta semana?</li><li>¿Qué cambios he notado en mi cuerpo y en mi mente después de entrenarla?</li><li>¿Qué situación concreta podría empezar a afrontar aplicando una de estas herramientas?</li></ul>'
          ]
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana2/R13sem2resumen.mp3`},
        { type: 'list', items: ['La ansiedad empieza en el cuerpo y se alimenta en la mente: si calmas uno, regulas al otro.','El nervio vago es tu freno natural; activarlo con la respiración o la calma corporal reduce la alarma interna.','Cuando calmas el cuerpo, tu cerebro recupera claridad.','Las sensaciones físicas (palpitaciones, mareo, nudo en el estómago) pueden ser molestas pero no son peligrosas: aprender a observarlas sin miedo reduce su impacto.','La práctica constante entrena tu sistema nervioso para responder con más equilibrio y recuperarse antes del estrés.','Las técnicas más eficaces (coherencia cardíaca, diafragmática, exhalación, RMP) ayudan a modular el sistema nervioso de forma sostenida; otras (anclaje, frío, balanceo) son recursos rápidos en picos de ansiedad.','Lo más importante no es probar todas, sino elegir 2 o 3 que encajen contigo y repetirlas con constancia.']},
        { type: 'quote', text: 'Tu cuerpo puede ser tu mejor aliado contra la ansiedad: cuando lo calmas, tu mente vuelve a encontrar claridad y equilibrio.'}
      ]
    },
    {
      id: 'ansiedad_sem3',
      title: 'Semana 3: Domina el Pensamiento Ansioso sin Evitarlo',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        { 
            type: 'paragraphWithAudio', 
            text: 'La ansiedad suele engañarnos con un truco: confunde lo posible con lo probable. “¿Y si…?” se convierte en un túnel sin salida. Esta semana aprenderás a dar un paso atrás, a mirar tus pensamientos sin creerlos al 100% y a abrir la puerta a alternativas más realistas. Se trata de entrenar tu mente para no quedar atrapada en el catastrofismo y encontrar nuevas formas de interpretar lo que pasa. Como un explorador curioso, vas a observar tu mundo interno con más distancia y menos juicio.', 
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/R13sen3introduccion.mp3`
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El invitado pesado de tu mente: los pensamientos anticipatorios',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/R13sem3pant1invitadopesado.mp3`,
          content: [
            { type: 'paragraph', text: 'Cuando la ansiedad aparece, tu mente suele adelantarse al futuro con preguntas como:' },
            { type: 'list', items: ['“¿Y si me da un ataque en medio del trabajo?”','“¿Y si pierdo el control delante de todos?”','“¿Y si me pasa algo malo?”'] },
            { type: 'paragraph', text: 'Estos se llaman pensamientos anticipatorios: no hablan de lo que ocurre ahora, sino de lo que podría pasar mañana o dentro de unos minutos. Son como un “adelanto de cine” donde tu cerebro solo te enseña las escenas de terror.'},
            { type: 'paragraph', text: 'La neurociencia ha demostrado que el cerebro humano está diseñado para anticipar, porque así aumenta las posibilidades de supervivencia (LeDoux, 2015). El problema es que, en la ansiedad, ese mecanismo se dispara y todo se percibe como amenaza.'}
          ]
        },
        {
            type: 'collapsible',
            title: 'El catastrofismo: cuando la mente imagina lo peor',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/R13sem3pant2catastrof.mp3`,
            content: [
                { type: 'paragraph', text: 'El segundo invitado es el pensamiento catastrofista. No basta con que tu mente imagine lo que puede pasar: además lo pinta con el peor final posible.'},
                { type: 'paragraph', text: 'Ejemplo:'},
                { type: 'list', items: ['Te duele el pecho → la mente dice “seguro es un infarto”.','Notas mareo → “me voy a desmayar en plena calle y nadie me ayudará”.']},
                { type: 'paragraph', text: 'Es como si tu cerebro tuviera un noticiero interno que siempre da la peor versión de los hechos.'},
                { type: 'paragraph', text: 'La psicología cognitivo-conductual (TCC) ha estudiado esto durante décadas y lo llama sesgo atencional hacia la amenaza: tu mente se queda atrapada en la posibilidad más negativa, ignorando todo lo demás.'}
            ]
        },
        {
          type: 'collapsible',
          title: 'El bucle mental: dar vueltas y vueltas sin llegar a ninguna parte',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt3BucleMental.mp3`,
          content: [
              { type: 'paragraph', text: 'Y luego están los bucles de pensamiento. Empiezan como una pequeña idea (“¿y si…?”), pero cuanto más giras sobre ella, más grande se hace.'},
              { type: 'paragraph', text: 'Es como una bola de nieve que rueda cuesta abajo: empieza pequeña, pero con cada vuelta arrastra más y más hasta que parece enorme e imparable. O como un disco rayado que repite la misma frase una y otra vez sin dejarte avanzar.'},
              { type: 'paragraph', text: 'La neurociencia del pensamiento rumiativo muestra que, en esos momentos, la red neuronal por defecto (Default Mode Network) se activa de forma excesiva, alimentando la repetición de pensamientos en lugar de la resolución de problemas.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'El secuestro emocional: cuando manda la amígdala',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt4SecuestroEmocional.mp3`,
          content: [
              { type: 'paragraph', text: 'En un pico de ansiedad, ocurre lo que Daniel Goleman (1995) llamó el “secuestro emocional”: la amígdala, ese detector de humo interno, se enciende con tanta fuerza que casi apaga tu corteza prefrontal (la parte racional del cerebro).'},
              { type: 'paragraph', text: 'Resultado: piensas en bucle, sientes que te bloqueas y cuesta recordar incluso lo más sencillo. Es como si la alarma de incendios estuviera tan alta que no escuchas ninguna otra voz.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'No se trata de luchar, sino de observar',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt5NoLuchar.mp3`,
          content: [
              { type: 'paragraph', text: 'Aquí está la clave: no se trata de controlar ni eliminar lo que piensas. Eso sería como intentar parar las olas del mar con las manos.'},
              { type: 'paragraph', text: 'Lo que sí puedes aprender es a observar sin engancharte. Imagina que tus pensamientos son coches pasando por una carretera: puedes elegir quedarte en la acera y mirarlos, en lugar de subirte a cada coche y dejar que te lleve.'},
              { type: 'paragraph', text: 'Esto es lo que en TCC se llama desfusión cognitiva (Hayes, 2011): dejar de creer que todo lo que pasa por tu mente es cierto o que tienes que reaccionar a ello.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'Entrenar la mente como un músculo',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt6EntrenarMente.mp3`,
          content: [
              { type: 'paragraph', text: 'Cada vez que practicas observar, cuestionar y soltar un pensamiento ansioso, estás entrenando tu cerebro como si hicieras ejercicio en un gimnasio.'},
              { type: 'paragraph', text: 'Al principio cuesta.'},
              { type: 'paragraph', text: 'Después de repetirlo, se vuelve más natural.'},
              { type: 'paragraph', text: 'Con el tiempo, tu “músculo mental” se fortalece y la ansiedad pierde poder sobre ti.'},
              { type: 'paragraph', text: 'La neurociencia lo llama neuroplasticidad: tus circuitos cerebrales cambian con la práctica, igual que los músculos cambian con el entrenamiento.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'Preparándote para la práctica',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt7Preparandote.mp3`,
          content: [
              { type: 'paragraph', text: 'Ahora que entiendes mejor cómo funcionan los pensamientos ansiosos (anticipatorios, catastrofistas, bucles) y cómo la amígdala puede secuestrar tu mente, pasamos a lo más importante: las técnicas que te ayudarán a no engancharte a esos pensamientos.'},
              { type: 'paragraph', text: 'Recuerda: no buscamos que dejen de aparecer, sino que aprendas a mirarlos de frente, sin miedo, hasta que dejen de arrastrarte.'}
          ]
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/Ruta13Sem3Pnt8Resumen.mp3`},
        { type: 'list', items: ['Los pensamientos ansiosos suelen aparecer en tres formas: anticipatorios, catastrofistas o en bucle.','Tu cerebro los fabrica para protegerte, pero muchas veces exagera.','No necesitas luchar con ellos, sino observarlos y dejarlos pasar.','Con práctica, tu mente aprende a soltar y recuperar la calma']},
        { type: 'title', text: 'Técnicas Específicas'},
        { 
          type: 'stopExercise', 
          title: 'EJERCICIO 1: STOP - Ponle un alto al piloto automático', 
          objective: 'Con esta técnica aprenderás un “botón de pausa mental” que interrumpe el bucle ansioso y te devuelve al presente en menos de un minuto.',
          duration: '2-3 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana3tecnica1.mp3`
        },
        { 
          type: 'questionYourIfsExercise', 
          title: 'EJERCICIO 2: Cuestiona tus “¿Y si…?” con la lupa de la realidad', 
          objective: 'Aprende a poner tus preguntas ansiosas bajo una lupa, en lugar de darlas por hechas. Así tu mente pasa de la catástrofe a un análisis más realista.',
          duration: '7-9 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana3tecnica2.mp3`
        },
        { 
          type: 'anxietyReframingExercise', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/R13sem3reflexion.mp3`,
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana3/R13sem3resumen.mp3`},
        { type: 'list', items: ['Los pensamientos ansiosos suelen aparecer en tres formas: anticipatorios, catastrofistas o en bucle.','Tu cerebro los fabrica para protegerte, pero muchas veces exagera.','No necesitas luchar con ellos, sino observarlos y dejarlos pasar.','La técnica STOP ayuda a frenar el piloto automático ansioso, regular el cuerpo con la respiración, observar con perspectiva y permitir avanzar.','El cuestionamiento socrático permite desafiar los “¿y si…?” explorando evidencias, alternativas y consecuencias reales.','Con práctica, la neurociencia demuestra que se refuerza la neuroplasticidad: tu cerebro aprende a frenar antes, reducir la intensidad de la ansiedad y elegir respuestas más sanas.']},
        { type: 'quote', text: 'No tienes que apagar cada pensamiento ansioso; basta con aprender a no dejar que te arrastre.', align: 'center'}
      ]
    },
    {
      id: 'ansiedad_sem4',
      title: 'Semana 4: Enfréntate sin Forzarte, Avanza con Cuidado',
      type: 'summary',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraphWithAudio', text: 'El gran reto de la ansiedad no es pensar menos, sino evitar menos. Cuanto más esquivamos lo que tememos, más fuerte se hace el miedo. Esta última semana vas a aprender a enfrentarte de manera progresiva y cuidada, paso a paso, sin forzarte. Será como subir una escalera: cada peldaño te acerca a la libertad, y no hace falta correr para llegar arriba. Lo importante es avanzar, aunque sea despacio, y comprobar con tus propios ojos que puedes sostener la ansiedad y seguir adelante.', audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4introduccion.mp3`},
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'La trampa de la evitación',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc1.mp3`,
          content: [
              { type: 'paragraph', text: 'Cuando algo nos genera ansiedad, la reacción más natural es evitarlo. Y claro, al principio parece una solución: si no me acerco a esa situación, el malestar baja. El problema es que ese alivio dura muy poco. La próxima vez que aparezca, la ansiedad volverá igual de intensa… o incluso más fuerte.'},
              { type: 'paragraph', text: 'La evitación es como echar gasolina al fuego: cuanto más evito, más confirmo a mi cerebro la idea de que “ese peligro es real”. Aunque en la práctica no lo sea.'},
              { type: 'paragraph', text: 'Ejemplo: si evito entrar en un ascensor porque me da ansiedad, cada vez que tomo las escaleras estoy diciéndole a mi cerebro que el ascensor es efectivamente peligroso y que subir por las escaleras es lo más seguro. Así, el miedo nunca tiene ocasión de reducirse. Mas adelante veremos qué ocurre cuando hacemos justo lo contrario: acercarnos poco a poco a lo que tememos.'}
          ]
        },
        {
            type: 'collapsible',
            title: 'La ansiedad se reduce enfrentándola',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc2.mp3`,
            content: [
              { type: 'paragraph', text: 'La neurociencia lo explica con claridad: cuando te expones gradualmente a lo que temes, tu cerebro aprende que la alarma estaba exagerando. Esa alarma está en la amígdala, una parte del cerebro encargada de detectar peligros. Al exponerme, mi cuerpo comprueba que la señal era desproporcionada, y el volumen de esa alarma baja. Este proceso se llama desensibilización.'},
              { type: 'paragraph', text: 'Es como descubrir que una sirena suena fuerte, aunque no haya fuego: si me quedo en el lugar y observo, con el tiempo mi cerebro deja de reaccionar como si todo ardiera. Dicho de forma simple: la única manera de que la ansiedad se reduzca de verdad es atravesándola, no esquivándola.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Exposición progresiva: avanzar sin forzarte',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc3.mp3`,
            content: [
              { type: 'paragraph', text: 'En TCC usamos la técnica de la exposición progresiva. No consiste en lanzarse a lo más difícil de golpe, sino en entrenar el sistema nervioso con pasos pequeños y repetidos. Es como subir una escalera: no saltamos hasta arriba en un solo movimiento, vamos peldaño a peldaño. Incluso podemos descansar en un escalón antes de seguir avanzando.'},
              { type: 'paragraph', text: 'Ejemplo: si hablar en público me produce ansiedad, el proceso puede empezar hablándome frente al espejo, luego grabándome en el móvil, después contándole algo a una persona de confianza, luego en un grupo pequeño… y así hasta llegar al auditorio. La clave no es la rapidez, sino la constancia: ir avanzando sin dejar de practicar.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El efecto de la repetición',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc4.mp3`,
            content: [
              { type: 'paragraph', text: 'Cada vez que te expones y eliges quedarte en la situación, tu cuerpo aprende un mensaje muy poderoso: “puedo estar aquí y no pasa nada terrible”. Ese es el proceso de habituación. Al principio, la ansiedad puede subir mucho, como una ola que parece demasiado grande. Pero si no huyes, la ola rompe y baja sola. Y la siguiente vez suele ser un poco más pequeña.'},
              { type: 'paragraph', text: 'Este aprendizaje es acumulativo: tu sistema nervioso va entendiendo, con pruebas reales, que ese contexto no es una amenaza. La confianza aparece poco a poco, con la repetición.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'La clave: avanzar con cuidado',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc5.mp3`,
            content: [
                { type: 'paragraph', text: 'No buscamos que seas valiente todo el día ni que fuerces más de lo necesario. Se trata de dar un paso en dirección contraria a la evitación, aunque la ansiedad siga presente. Piensa en esto como entrenar un músculo en el gimnasio: no necesitas levantar 50 kilos de golpe, basta con empezar con 2 o 3 y añadir poco a poco más peso. Cada serie que repites fortalece tu cuerpo, aunque al principio parezca poca cosa. En la ansiedad ocurre lo mismo: cada exposición, por pequeña que parezca, fortalece tu sistema interno de regulación emocional.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'La confianza se entrena',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4psicoeduc6.mp3`,
            content: [
                { type: 'paragraph', text: 'Cada exposición que realizas es como añadir una ficha a tu “banco de confianza”. Al principio parece que el bote se llena muy despacio, pero poco a poco la evidencia interna se acumula: “ya lo hice antes, puedo hacerlo otra vez”. Este proceso se llama autoeficacia. Albert Bandura, uno de los psicólogos más influyentes, lo resumía así: “La autoeficacia es la creencia en la propia capacidad de organizar y ejecutar las acciones necesarias para manejar situaciones futuras”.'},
                { type: 'paragraph', text: 'En otras palabras: no buscamos eliminar la ansiedad, sino aumentar la confianza en ti mismo o en ti misma. Y la confianza crece cada vez que eliges exponerte un poco más. Con el tiempo, esa sensación de “no puedo” se transforma en “sí puedo, aunque me cueste.”'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas'},
        { 
          type: 'exposureLadderExercise', 
          title: 'EJERCICIO 1: ESCALERA DE EXPOSICIÓN PERSONAL', 
          objective: 'Construye, peldaño a peldaño, un camino seguro hacia esas situaciones que hoy parecen demasiado grandes. Diseñarás tu propio plan progresivo para entrenar a tu cerebro y a tu cuerpo a confiar más en ti.',
          duration: '10-15 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana4tecnica1.mp3`
        },
        { 
          type: 'calmVisualizationExercise', 
          title: 'EJERCICIO 2: “ME VEO HACIÉNDOLO CON CALMA”', 
          objective: 'Usa tu imaginación como herramienta. Cuando visualizas que te enfrentas a una situación temida de forma calmada, entrenas a tu sistema nervioso para responder con menos alarma en la vida real.',
          duration: '8-10 min',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana4tecnica2.mp3`
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4reflexion.mp3`,
          prompts: [
            '<p>Ahora que has recorrido este proceso, es momento de detenerte y mirar hacia dentro:</p><ul><li>¿Qué descubrí sobre cómo funciona tu ansiedad y las señales que te da tu cuerpo?</li><li>¿Qué estrategias has comprobado que te ayudan más a calmarte?</li><li>¿Qué peldaños de tu escalera de exposición ya has subido y qué aprendizajes trajeron consigo?</li></ul>'
          ]
        },
        { 
          type: 'title', 
          text: 'RESUMEN CLAVE DE LA RUTA'
        },
        { 
            type: 'paragraphWithAudio',
            text: '',
            audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/R13sem4resumenclave.mp3`
        },
        { 
          type: 'list', 
          items: [
            'La evitación alivia la ansiedad a corto plazo, pero la alimenta a largo plazo.',
            'La neurociencia muestra que la ansiedad disminuye al exponerte de forma gradual: el cerebro aprende que no hay un peligro real.',
            'La exposición progresiva es como subir una escalera: un peldaño tras otro, con repeticiones, paciencia y descansos cuando lo necesites.',
            'La repetición genera habituación: tu cuerpo se acostumbra y la ansiedad pierde fuerza.',
            'No se trata de forzarte ni de ser valiente todo el tiempo, sino de dar pequeños pasos constantes en dirección contraria a la evitación.',
            'Técnica 1: Escalera de exposición personal → construir tu propia lista de pasos, de lo más fácil a lo más difícil, y avanzar cuando lo ya practicado genere menos ansiedad.',
            'Técnica 2: Visualización calmada → imaginarte enfrentando la situación con serenidad y éxito prepara tu mente y tu cuerpo para afrontarlo en la realidad.',
            'Cada paso, por pequeño que sea, es un entrenamiento que acumula evidencias internas: “puedo estar aquí, puedo avanzar, aunque la ansiedad me acompañe”.'
          ]
        },
        { 
          type: 'quote', 
          text: 'No tienes que eliminar la ansiedad para avanzar. Solo necesitas dar un paso pequeño, constante y consciente en dirección a lo que valoras. Cada vez que lo haces, tu fuerza crece y tu libertad también.'
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'REFLEXION FINAL PARA EL CUADERNO',
          prompts: [
            '<p>Ahora que has recorrido este proceso, es momento de detenerte y mirar hacia dentro:</p><p>Escribe tus reflexiones con honestidad y sin juzgarte. Lo importante no es la perfección, sino reconocer tus avances y comprometerte contigo mismo o contigo misma a seguir practicando, incluso en pasos pequeños.</p><ul><li>¿Qué descubriste sobre cómo funciona tu ansiedad y las señales que te da tu cuerpo?</li><li>¿Qué estrategias has comprobado que te ayudan más a calmarte o a recuperar el control?</li><li>¿En qué momentos notaste que la evitación aumentaba tu malestar y cuándo experimentaste que dar un pequeño paso hacia adelante te fortalecía?</li><li>¿Qué peldaños de tu escalera de exposición ya has subido y qué aprendizajes trajeron consigo?</li><li>Si pudieras enviarle un mensaje a tu “yo” del futuro, ¿qué recordatorio le dejarías sobre tu capacidad de afrontar la ansiedad?</li></ul>'
          ]
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL'
        },
        {
          type: 'list',
          items: [
            'La ansiedad es una alarma interna que se activa aunque no haya un peligro real.',
            'El cuerpo y la mente pueden entrenarse para interpretar las sensaciones sin catastrofizar.',
            'Técnicas como el registro de pensamientos ansiosos, el recorrido por el cuerpo y la respiración regulada ayudan a reducir la intensidad inmediata de los síntomas.',
            'La exposición progresiva es la clave para que la ansiedad baje de forma duradera: cuanto más evitamos, más crece; cuanto más nos enfrentamos poco a poco, más confianza ganamos.',
            'La repetición fortalece la autoeficacia: cada paso superado demuestra que eres capaz de sostener la ansiedad y avanzar.',
            'La visualización calmada es un recurso extra que prepara al cerebro y al sistema nervioso para afrontar mejor la situación real.',
            'El objetivo no es eliminar la ansiedad por completo, sino recuperar la confianza en tu capacidad para vivir con ella sin que te paralice.'
          ]
        },
        { type: 'quote', text: 'La ansiedad no desaparece huyendo de ella, sino aprendiendo a caminar con ella hasta que deja de asustar.' }
      ]
    },
    {
      id: 'ansiedad_cierre',
      title: 'Cierre de la Ruta: Integración y Próximos Pasos',
      type: 'summary',
      estimatedTime: '10-15 min',
      content: [
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión final de la ruta',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/Reflexionfinalruta13.mp3`,
          prompts: [
            '<p>Has recorrido un camino valiente: el de poner límites con respeto, firmeza y cuidado. Tal vez no haya sido fácil. Quizás has tenido que enfrentar viejas culpas, miedos o dudas. Pero también has recuperado algo valioso: tu voz. Ahora te invito a hacer una pausa y mirar hacia dentro. No para exigirte más, sino para reconocer todo lo que ya has practicado. Escribe con honestidad y sin exigencias:</p>',
            '<p>Preguntas para tu cuaderno emocional:</p>',
            '<ul><li>¿Qué me ha revelado esta ruta sobre mi forma de relacionarme?</li><li>¿Qué barreras me he atrevido a cruzar para ser más auténtico/a?</li><li>¿Qué quiero empezar a hacer diferente en mis relaciones?</li><li>¿Qué vínculo me gustaría cultivar desde un lugar más sano y más yo?</li><li>¿Qué me recordaré cuando sienta miedo de decepcionar por ser quien soy?</li></ul>'
          ]
        },
        {
          type: 'title',
          text: 'RESUMEN FINAL DE LA RUTA',
          audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/semana4/Resumenfinalruta13.mp3`
        },
        {
          type: 'list',
          items: [
            'La ansiedad es una alarma interna que se activa aunque no haya un peligro real.',
            'El cuerpo y la mente pueden entrenarse para interpretar las sensaciones sin catastrofizar.',
            'Técnicas como el registro de pensamientos ansiosos, el recorrido por el cuerpo y la respiración regulada ayudan a reducir la intensidad inmediata de los síntomas.',
            'La exposición progresiva es la clave para que la ansiedad baje de forma duradera: cuanto más evitamos, más crece; cuanto más nos enfrentamos poco a poco, más confianza ganamos.',
            'La repetición fortalece la autoeficacia: cada paso superado demuestra que eres capaz de sostener la ansiedad y avanzar.',
            'La visualización calmada es un recurso extra que prepara al cerebro y al sistema nervioso para afrontar mejor la situación real.',
            'El objetivo no es eliminar la ansiedad por completo, sino recuperar la confianza en tu capacidad para vivir con ella sin que te paralice.'
          ]
        },
        { type: 'quote', text: 'La ansiedad no desaparece huyendo de ella, sino aprendiendo a caminar con ella hasta que deja de asustar.' }
      ]
    }
  ]
};

    




  