
import type { Path } from '../pathsData';

export const anxietyPath: Path = {
  id: 'regular-ansiedad-paso-a-paso',
  title: 'Regular la Ansiedad Paso a Paso',
  description: 'Aprende a entender tu ansiedad sin luchar contra ella, a calmar tu cuerpo para calmar tu mente y a dar pequeños pasos hacia aquello que hoy evitas.',
  dataAiHint: 'anxiety mindfulness calm',
  modules: [
    {
      id: 'ansiedad_sem1',
      title: 'Semana 1: Entiende tu Ansiedad, no la Pelees',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraphWithAudio',
          text: '¿Te has dado cuenta de que muchas veces lo que más asusta no es la situación en sí, sino las sensaciones que aparecen en tu cuerpo? Esa taquicardia, ese nudo en el estómago, esa mente que corre sin parar.\nEsta primera semana aprenderás a mirar la ansiedad de frente, a entender cómo funciona y a descubrir que no es un enemigo, sino una señal que puedes aprender a interpretar.\nPiensa en ella como una alarma: no siempre indica fuego real, a veces solo está demasiado sensible.',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1introduccion.mp3'
        },
        { type: 'title', text: 'Psicoeducación' },
        { 
            type: 'collapsible',
            title: 'La ansiedad: molesta, pero con sentido',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1psicoeducpantalla1la%20ansiedad%20molesta.mp3',
            content: [
                { type: 'paragraph', text: 'La ansiedad no es tu enemiga, aunque a veces lo parezca.\nEs esa compañera molesta e incómoda que aparece justo cuando menos la quieres: antes de una reunión importante, en la cama cuando intentas dormir, o de camino a un sitio que te importa. Te fastidia, y mucho. Nadie quiere vivir con el corazón acelerado, la mente disparada y esa sensación de no estar en control.\nPero, si la miramos desde otra perspectiva, la ansiedad tiene un propósito: tu cuerpo se activa para protegerte, como si se encendiera una alarma interna. El problema aparece cuando esa alarma salta demasiado fuerte o demasiado a menudo, incluso sin peligro real. Y ahí es cuando pasa de ser útil a ser un obstáculo.\nEn esta ruta no vamos a “eliminar la ansiedad”, sino a aprender a regularla. A bajarle el volumen para que deje de dirigir tu vida.' }
            ]
        },
        { 
            type: 'collapsible',
            title: 'Ansiedad adaptativa vs. ansiedad disfuncional',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1pantalla2ansiedadadPtativa.mp3',
            content: [
                { type: 'paragraph', text: 'No toda ansiedad es mala, aunque lo parezca.\n🔹 Ansiedad adaptativa\n•\tTe mantiene alerta y enfocado/a.\n•\tPor ejemplo, esos nervios antes de un examen que te ayudan a estudiar con más energía.\n🔹 Ansiedad disfuncional\n•\tSe enciende sin motivo claro o de forma desproporcionada.\n•\tEn lugar de ayudarte, te bloquea: no duermes, evitas situaciones, piensas sin parar en lo peor.\n•\tEs como una alarma que suena cada dos por tres, incluso sin fuego.\nLa clave no es luchar contra la ansiedad, sino distinguir cuándo te está ayudando y cuándo te está saboteando.\nPiensa en tu ansiedad como un detector de humo demasiado sensible: no distingue entre el vapor de la ducha y un incendio real. El problema no eres tú, es que tu sistema de alarma está calibrado demasiado alto.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'Tu sistema nervioso en acción',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13semana1pant3tusistnervioso.mp3',
            content: [{ type: 'paragraph', text: 'La ansiedad vive en tu cuerpo, no solo en tu mente.\nTu sistema nervioso autónomo funciona como los pedales de un coche:\n•\tLa rama simpático pisa el acelerador 🚗💨 (sube la frecuencia cardíaca, la respiración, la tensión muscular).\n•\tLa rama parasimpático actúa como freno 🚦 (calma, ayuda a la digestión y al descanso).\nCuando la ansiedad aparece, es como si tu pedal del acelerador se quedara atascado, incluso en situaciones normales. Por eso sientes palpitaciones, respiración corta, mareo o tensión. No es que estés “loco/a”: es que tu cuerpo está reaccionando como si hubiera un peligro real.\nAdemás, tu cuerpo libera adrenalina y cortisol, las hormonas del estrés. A corto plazo te ponen en alerta, pero cuando se repiten demasiadas veces, te dejan agotado/a.' }]
        },
        {
            type: 'collapsible',
            title: 'Ansiedad, trastorno de ansiedad y ataque de pánico',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13sem1pant4Nsiedadtrastorno.mp3',
            content: [{ type: 'paragraph', text: 'Si alguna vez te has preguntado: “¿Esto que me pasa es normal o es un trastorno?”, tranquilo/a: no eres el único. Aquí tienes una guía sencilla para ponerle nombre a lo que vives:\n🔹 Ansiedad normal o adaptativa\n•\tSurge ante un reto real (ej. entrevista, examen).\n•\tEs pasajera y baja sola cuando pasa la situación.\n🔹 Trastorno de ansiedad\n•\tLa activación es excesiva, frecuente o sin causa clara.\n•\tAfecta tu vida diaria: trabajo, descanso, relaciones.\n•\tPuede llevarte a evitar lugares o situaciones.\n•\tNecesita abordaje terapéutico para recuperar equilibrio.\n🔹 Ataque de pánico\n•\tIrrumpe de golpe, con síntomas intensos: taquicardia, falta de aire, mareo, sensación de “morirme” o “perder el control”.\n•\tAunque asusta mucho, no es peligroso: el cuerpo no puede sostener esa activación y termina bajando.\n•\tPuede aparecer dentro de un trastorno de pánico o de forma aislada.\nEjemplo sencillo:\n•\tAnsiedad → nervios antes de una charla.\n•\tTrastorno de ansiedad → semanas sin dormir porque temes no dar la charla.\n•\tAtaque de pánico → de repente tu cuerpo explota en síntomas, aunque estés tranquilo/a en casa.\nNo es para etiquetarte, sino para que sepas reconocer lo que vives y cómo trabajarlo. Y recuerda: incluso en los casos más intensos, la ansiedad se puede mejorar.'}]
        },
        {
            type: 'collapsible',
            title: 'La ansiedad tiene un lenguaje',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13sem1pant5ansiedadlenguaje.mp3',
            content: [{ type: 'paragraph', text: 'La ansiedad se comunica contigo a través de síntomas. Algunos son más físicos (palpitaciones, sudor, tensión muscular) y otros más mentales (preocupaciones, pensamientos de “y si…”).\nPiensa en ella como un mensajero pesado: insiste en llamar a tu puerta, aunque no siempre traiga noticias importantes.\n•\tSi le cierras de golpe, insiste más.\n•\tSi le escuchas con calma, puedes decidir qué hacer con el mensaje.\nEste proceso suele convertirse en un círculo de la ansiedad:\n1.\tAparece un síntoma (ej. taquicardia).\n2.\tTu mente lo interpreta como peligro (“me va a dar algo”).\n3.\tEsa interpretación dispara más síntomas.\n4. \tY así se forma la bola de nieve.\nLo que rompe el círculo no es evitar, sino aprender a interpretar de otra forma lo que ocurre.' }]
        },
        {
            type: 'collapsible',
            title: 'No luches contra la ansiedad',
            audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13sem1pant6noluchescontraNsied.mp3',
            content: [{ type: 'paragraph', text: 'Cuando la ansiedad aparece, lo primero que solemos pensar es: “¡Quiero que se vaya ya!”. Pero aquí ocurre algo paradójico: cuanto más intentas forzarla a desaparecer, más se intensifica. Es como si tu cerebro interpretara: “Esto es tan peligroso que necesito luchar con todas mis fuerzas”.\nY entonces, en lugar de calmarse, tu sistema nervioso se activa aún más.\nLa ciencia —desde la psicología cognitivo-conductual hasta la neurociencia— nos muestra otra vía mucho más eficaz:\n•\tObservar sin juzgar → como si vieras pasar una nube en el cielo, que se desplaza sola sin que tengas que empujarla.\n•\tDarle un espacio controlado → dejar que esté ahí, pero sin que ocupe todo tu campo de visión.\n•\tUsar técnicas corporales y mentales → tu respiración, tu atención y tus recursos internos actúan como anclas que ayudan a que la ola de ansiedad suba… y después vuelva a bajar, como siempre lo hace.\nEjemplo: imagina un globo que intentas meter bajo el agua. Cuanto más lo fuerzas hacia abajo, más salta hacia arriba. Pero si lo sueltas, el globo se queda flotando. Lo mismo pasa con la ansiedad: si dejas de pelearte con ella, pierde fuerza y tú recuperas la capacidad de decidir cómo sostenerla.\nImportante: muchas veces recurrimos a la evitación para lidiar con la ansiedad (no ir a un sitio, no hacer algo). Eso da alivio inmediato, pero refuerza el miedo: tu cerebro aprende que “menos mal que lo esquivé, porque era peligroso”. Con el tiempo, la evitación se convierte en gasolina para la ansiedad.\nNo se trata de eliminar la ansiedad, sino de recuperar el mando. Tú puedes estar en el asiento del conductor, incluso cuando la ansiedad viaja de copiloto.'}]
        },
        { type: 'title', text: 'Técnicas Específicas'},
        { 
            type: 'ansiedadTieneSentidoExercise',
            title: 'MI ANSIEDAD TIENE SENTIDO CUANDO…',
            objective: 'Aprender a diferenciar cuándo tu ansiedad tiene un sentido adaptativo y a identificar cuándo se vuelve excesiva, reconociendo cómo el miedo a la ansiedad alimenta el círculo.',
            duration: '8-10 min',
            audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana1tecnica1.mp3'
        },
        {
            type: 'visualizacionGuiadaCuerpoAnsiedadExercise',
            title: 'VISUALIZACIÓN GUIADA DEL CUERPO EN ANSIEDAD',
            objective: 'Reconocer las sensaciones de la ansiedad sin luchar contra ellas, comprendiendo que aunque son incómodas, no son peligrosas.',
            duration: '10-12 min',
            audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana1tecnica2.mp3'
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13reflexioncuaderno.mp3',
          prompts: ['¿Qué he descubierto sobre mi manera de interpretar la ansiedad?','¿Qué sensaciones me resultan más difíciles de aceptar y qué pensamientos suelen acompañarlas?','¿Qué diferencia noto entre luchar contra la ansiedad y observarla con curiosidad?']
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta13/semana1/Ruta13resumenclave.mp3'},
        { type: 'list', items: ['La ansiedad es molesta pero no es tu enemiga: es una señal de alarma que a veces se desajusta.','Distinguir entre ansiedad adaptativa y disfuncional ayuda a no pelearte con ella.','Tu sistema nervioso funciona como pedales: acelerador (simpático) y freno (parasimpático).','No es lo mismo ansiedad, trastorno de ansiedad o ataque de pánico: conocer la diferencia te da claridad.','Los síntomas físicos y mentales de la ansiedad son mensajes, no peligros en sí mismos.','Luchar contra la ansiedad la intensifica; observarla y darle espacio la calma.','Evitar situaciones da alivio momentáneo, pero alimenta el círculo del miedo.']},
        { type: 'quote', text: 'La ansiedad no es un monstruo a vencer, sino una alarma que puedes aprender a escuchar y regular con calma.' }
      ]
    },
    {
      id: 'ansiedad_sem2',
      title: 'Semana 2: Calma el Cuerpo para Calmar la Mente',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraphWithAudio', text: 'Cuando la ansiedad llega, parece que no hay botón de pausa. El cuerpo se acelera y la mente se llena de pensamientos catastróficos. Esta semana vas a descubrir que sí existe una forma de frenar: aprenderás técnicas sencillas para interrumpir la escalada, bajar la activación y recuperar el control. Como un piloto que activa el freno de emergencia para estabilizar el avión, tú también puedes activar tus recursos internos para volver a sentir seguridad.', audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2introducc.mp3'},
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Gancho emocional: “Cuando el cuerpo corre, la mente corre”',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant1ganchoemoc.mp3',
          content: [{ type: 'paragraph', text: '¿Has notado que la ansiedad empieza en el cuerpo antes de que te des cuenta en la cabeza?\n\nDe repente, el corazón se acelera, el estómago se encoge o la respiración se agita… y ahí, como por arte de magia, aparecen los pensamientos: “¿y si me pasa algo malo? ¿y si no lo controlo? ¿y si me da algo aquí mismo?”.\n\nEsto ocurre porque cuerpo y mente son como dos bailarines atados con la misma cuerda: cuando uno se acelera, arrastra al otro.\n\nLa buena noticia es que este vínculo también funciona en positivo: si aprendes a calmar tu cuerpo, tu mente se relaja automáticamente.\n\nEsta semana vas a entrenar esa palanca: empezar por el cuerpo para que tu mente tenga un lugar donde descansar.' }]
        },
        {
          type: 'collapsible',
          title: 'El cuerpo como regulador directo',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant2cuerporegulDor.mp3',
          content: [{ type: 'paragraph', text: 'Dentro de ti funciona un sistema automático que no eliges de forma consciente: el sistema nervioso autónomo.\n\nComo explicamos también en la semana 1, puedes imaginarlo como un coche con dos pedales:\n\nEl acelerador (la rama simpática): te activa, sube el pulso, la tensión muscular y la respiración.\n\nEl freno (la rama parasimpática): te calma, baja la activación y devuelve al cuerpo el equilibrio.\n\nCuando la ansiedad aparece, lo que pasa es que el acelerador se queda pisado, aunque no haya tráfico ni peligro real. Tu cuerpo se pone en “modo emergencia” para protegerte… pero en realidad no hace falta.\n\nLo que aprenderás aquí es a tocar el freno de forma intencional con técnicas sencillas de respiración, relajación y movimiento consciente.' }]
        },
        {
          type: 'collapsible',
          title: 'Por qué empezar por el cuerpo antes que por la mente',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant3porqEmpezXcorpo.mp3',
          content: [{ type: 'paragraph', text: 'La ansiedad funciona como un círculo que se alimenta a sí mismo:\n\nSientes un síntoma (ej. taquicardia).\n\nLo interpretas como peligro (“me va a dar algo”).\n\nEsa interpretación te asusta más y provoca más síntomas. Sin querer, hace que la ansiedad y el miedo suban más.\n\nEs como si tu cuerpo encendiera la alarma y tu mente cogiera el micrófono para amplificarla.\n\nMuchas veces intentamos romper este círculo solo con pensamientos positivos: “tranquilo, no pasa nada”. Pero cuando el cuerpo ya está disparado, a veces la mente no lo cree.\n\nPor eso, esta semana, empezamos por el cuerpo: al bajar la respiración, soltar los músculos o enfriar el cuerpo, el cerebro recibe una señal poderosa de calma que corta el círculo.' }]
        },
        {
          type: 'collapsible',
          title: 'El freno vagal: tu sistema de calma natural',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant4frenoVagal.mp3',
          content: [{ type: 'paragraph', text: 'Hay un “cable maestro” que conecta tu cuerpo con tu cerebro: el nervio vago.\n\nPuedes imaginarlo como un freno interno que, cuando lo activas, manda el mensaje a tu cerebro de: “no hay peligro, puedes bajar la guardia”.\n\n¿Cómo se activa? Con cosas muy sencillas:\n\nRespirar lento y profundo.\n\nAlargar la exhalación más que la inhalación.\n\nHacer pausas de calma en el cuerpo.\n\nCuando lo entrenas, tu corazón se desacelera, la respiración se regula y la sensación de alarma baja.\n\nEn neurociencia se ha visto que este “tono vagal alto” está asociado a más resiliencia emocional y mayor capacidad de mantener la calma en momentos difíciles. El tono vagal alto significa que tu nervio vago funciona bien y se activa con facilidad.\n\nHoy en día sabemos que las personas con tono vagal alto, suelen recuperarse antes del estrés, tener un corazón más estable y sentirse más equilibradas emocionalmente.' }]
        },
        {
          type: 'collapsible',
          title: 'El cerebro bajo calma y bajo ansiedad',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant5cerebroCalma.mp3',
          content: [{ type: 'paragraph', text: 'Tu cerebro tiene dos modos principales de funcionamiento, que se activan según percibas amenaza o seguridad:\n\nModo alarma: la amígdala (tu detector de humo interno) grita: “¡cuidado, cuidado!”. Tu cuerpo se prepara para huir o luchar y la parte racional de tu cerebro se apaga un poco.\n\nModo calma: la corteza prefrontal (tu parte racional, pensante y reflexiva) recupera el mando, analiza la situación y decide con claridad.\n\nEn un pico de ansiedad, la amígdala es tan ruidosa que apenas escuchas a tu parte racional. Por eso piensas en bucle o sientes que te bloqueas. A esto se le llama secuestro emocional: la parte más instintiva y emocional de tu cerebro toma el mando y “apaga” temporalmente a la parte racional, como si la alarma interna se adueñara de todo el sistema. \n\nLa buena noticia es que, al calmar el cuerpo, ese secuestro pierde fuerza y tu mente pensante puede recuperar el control.\n\nEl resultado: menos caos, más claridad y más sensación de control real.' }]
        },
        {
          type: 'collapsible',
          title: 'La interocepción: escuchar sin miedo',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant6Interocepcion.mp3',
          content: [{ type: 'paragraph', text: 'La interocepción es la capacidad de sentir tu propio cuerpo por dentro: tu pulso, tu respiración, el nudo en el estómago, el calor en la cara…\n\nEn la ansiedad, lo difícil no son esas sensaciones en sí, sino cómo las interpretamos:\n\n“Me late fuerte el corazón → seguro es un infarto.”\n\n“Me mareo → me voy a caer.”\n\n“Me tiembla el cuerpo → voy a perder el control.”\n\nPero en realidad, son respuestas normales de un cuerpo que está en alarma. No son peligrosas, aunque si son molestas.\n\nPracticar a observarlas sin juzgarlas te permite comprobar que esas sensaciones, aunque incómodas, siempre suben y bajan.\n\nEs como mirar cómo pasa una nube por el cielo: no necesitas empujarla, se moverá sola.' }]
        },
        {
          type: 'collapsible',
          title: 'Entrenamiento y constancia: el cerebro también se entrena',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant7entrenamConstanc.mp3',
          content: [{ type: 'paragraph', text: 'Aquí entra en juego la neuroplasticidad, la capacidad del cerebro de aprender y cambiar con la práctica.\n\nCada vez que respiras de forma calmada, relajas tus músculos o haces un ejercicio de anclaje, tu cerebro registra una nueva asociación: “cuando siento ansiedad, también puedo encontrar calma.”\n\nSi lo repites una y otra vez, esas conexiones se fortalecen. Con el tiempo, tu cuerpo empezará a responder con menos alarma de forma más automática.\n\nNo se trata de hacerlo perfecto, sino de volver una y otra vez al entrenamiento, como quien ejercita un músculo. 5–10 minutos diarios son más potentes que una práctica larga de vez en cuando.' }]
        },
        {
          type: 'collapsible',
          title: 'Cierre de la psicoeducación',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2pant8cierrePsicoeduc.mp3',
          content: [{ type: 'paragraph', text: 'En resumen:\n\nLa ansiedad se alimenta del cuerpo y de la mente, pero puedes interrumpirla empezando por el cuerpo.\n\nTu sistema tiene un freno natural (nervio vago) que puedes aprender a activar.\n\nCuando calmas el cuerpo, tu cerebro recupera claridad.\n\nLas sensaciones no son peligrosas: observarlas sin miedo es clave para que pierdan fuerza.\n\nCon práctica constante, entrenas a tu sistema nervioso para volver al equilibrio cada vez más rápido.\n\nAhora vas a aprender herramientas concretas para activar ese freno natural. Elige las que más te encajen y hazlas tuyas: son tu kit personal de calma frente a la ansiedad' }]
        },
        { type: 'title', text: 'Técnicas Específicas de Relajación'},
        { type: 'paragraphWithAudio', text: 'A continuación, te presentamos una serie de técnicas físicas de regulación emocional, validadas por la ciencia, que puedes practicar a diario. Elige las que más te ayuden y repítelas con constancia.', audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana2tecnica1.mp3' },
        { 
            type: 'collapsible', 
            title: 'Exhalación Prolongada (1:2)',
            audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana2tecnica13exhalacionprolongada.mp3',
            content: [{ type: 'paragraph', text: 'Alarga más la exhalación que la inhalación (ej: inhala 3, exhala 6). Este gesto activa el nervio vago y baja la frecuencia cardíaca de forma rápida.' }] },
        { 
            type: 'collapsible', 
            title: 'Relajación Muscular Progresiva (Jacobson)',
            audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana2tecnica14Jacobson.mp3', 
            content: [{ type: 'paragraph', text: 'Tensa y suelta diferentes grupos musculares (piernas, abdomen, cara...). Ayuda a liberar la tensión física acumulada y a reconocer cuándo estás tenso/a.' }] 
        },
        { type: 'collapsible', title: 'Body Scan Breve (Escaneo Corporal)', audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana2tecnica15bodyscan.mp3', content: [{ type: 'paragraph', text: 'Recorre mentalmente tu cuerpo de pies a cabeza, observando lo que sientes sin juzgar. Aumenta la tolerancia a los síntomas de ansiedad.' }] },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2reflexion.mp3', prompts: ['¿Qué técnica me ha resultado más útil o fácil de practicar esta semana?','¿Qué cambios he notado en mi cuerpo y en mi mente después de entrenarla?','¿Qué situación concreta podría empezar a afrontar aplicando una de estas herramientas?']},
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta13/semana2/R13sem2resumen.mp3'},
        { type: 'list', items: ['La ansiedad empieza en el cuerpo y se alimenta en la mente: si calmas uno, regulas al otro.','El nervio vago es tu freno natural; activarlo con la respiración o la calma corporal reduce la alarma interna.','En ansiedad intensa, la amígdala “secuestra” la razón; al relajar el cuerpo, devuelves el control a tu parte racional.','Las sensaciones físicas (palpitaciones, mareo, nudo en el estómago) pueden ser molestas pero no son peligrosas: aprender a observarlas sin miedo reduce su impacto.','La práctica constante entrena tu sistema nervioso para responder con más equilibrio y recuperarse antes del estrés.','Las técnicas más eficaces (coherencia cardíaca, diafragmática, exhalación, RMP) ayudan a modular el sistema nervioso de forma sostenida; otras (anclaje, frío, balanceo) son recursos rápidos en picos de ansiedad.','Lo más importante no es probar todas, sino elegir 2 o 3 que encajen contigo y repetirlas con constancia.']},
        { type: 'quote', text: 'Tu cuerpo puede ser tu mejor aliado contra la ansiedad: cuando lo calmas, tu mente vuelve a encontrar claridad y equilibrio.'}
      ]
    },
    {
      id: 'ansiedad_sem3',
      title: 'Semana 3: Domina el Pensamiento Ansioso sin Evitarlo',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraphWithAudio', text: 'La ansiedad suele engañarnos con un truco: confunde lo posible con lo probable. “¿Y si…?” se convierte en un túnel sin salida. Esta semana aprenderás a dar un paso atrás, a mirar tus pensamientos sin creerlos al 100% y a abrir la puerta a alternativas más realistas. Se trata de entrenar tu mente para no quedar atrapada en el catastrofismo y encontrar nuevas formas de interpretar lo que pasa.', audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/R13sen3introduccion.mp3'},
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'El invitado pesado de tu mente: los pensamientos anticipatorios',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/R13sem3pant1invitadopesado.mp3',
          content: [{ type: 'paragraph', text: 'Cuando la ansiedad aparece, tu mente suele adelantarse al futuro con preguntas como:\n\n“¿Y si me da un ataque en medio del trabajo?”\n“¿Y si pierdo el control delante de todos?”\n“¿Y si me pasa algo malo?”\n\nEstos se llaman pensamientos anticipatorios: no hablan de lo que ocurre ahora, sino de lo que podría pasar mañana o dentro de unos minutos. Son como un “adelanto de cine” donde tu cerebro solo te enseña las escenas de terror.\n\nLa neurociencia ha demostrado que el cerebro humano está diseñado para anticipar, porque así aumenta las posibilidades de supervivencia (LeDoux, 2015). El problema es que, en la ansiedad, ese mecanismo se dispara y todo se percibe como amenaza.' }]
        },
        {
          type: 'collapsible',
          title: 'El catastrofismo: cuando la mente imagina lo peor',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/R13sem3pant2catastrof.mp3',
          content: [{ type: 'paragraph', text: 'El segundo invitado es el pensamiento catastrofista. No basta con que tu mente imagine lo que puede pasar: además lo pinta con el peor final posible.\n\nEjemplo:\n\nTe duele el pecho → la mente dice “seguro es un infarto”.\nNotas mareo → “me voy a desmayar en plena calle y nadie me ayudará”.\n\nEs como si tu cerebro tuviera un noticiero interno que siempre da la peor versión de los hechos.\n\nLa psicología cognitivo-conductual (TCC) ha estudiado esto durante décadas y lo llama sesgo atencional hacia la amenaza: tu mente se queda atrapada en la posibilidad más negativa, ignorando todo lo demás.' }]
        },
        {
          type: 'collapsible',
          title: 'El bucle mental: dar vueltas y vueltas sin llegar a ninguna parte',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt3BucleMental.mp3',
          content: [{ type: 'paragraph', text: 'Y luego están los bucles de pensamiento. Empiezan como una pequeña idea (“¿y si…?”), pero cuanto más giras sobre ella, más grande se hace.\n\nEs como una bola de nieve que rueda cuesta abajo: empieza pequeña, pero con cada vuelta arrastra más y más hasta que parece enorme e imparable. O como un disco rayado que repite la misma frase una y otra vez sin dejarte avanzar.\n\nLa neurociencia del pensamiento rumiativo muestra que, en esos momentos, la red neuronal por defecto (Default Mode Network) se activa de forma excesiva, alimentando la repetición de pensamientos en lugar de la resolución de problemas.' }]
        },
        {
          type: 'collapsible',
          title: 'El secuestro emocional: cuando manda la amígdala',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt4SecuestroEmocional.mp3',
          content: [{ type: 'paragraph', text: 'En un pico de ansiedad, ocurre lo que Daniel Goleman (1995) llamó el “secuestro emocional”: la amígdala, ese detector de humo interno, se enciende con tanta fuerza que casi apaga tu corteza prefrontal (la parte racional del cerebro).\n\nResultado: piensas en bucle, sientes que te bloqueas y cuesta recordar incluso lo más sencillo. Es como si la alarma de incendios estuviera tan alta que no escuchas ninguna otra voz.' }]
        },
        {
          type: 'collapsible',
          title: 'No se trata de luchar, sino de observar',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt5NoLuchar.mp3',
          content: [{ type: 'paragraph', text: 'Aquí está la clave: no se trata de controlar ni eliminar lo que piensas. Eso sería como intentar parar las olas del mar con las manos.\n\nLo que sí puedes aprender es a observar sin engancharte. Imagina que tus pensamientos son coches pasando por una carretera: puedes elegir quedarte en la acera y mirarlos, en lugar de subirte a cada coche y dejar que te lleve.\n\nEsto es lo que en TCC se llama desfusión cognitiva (Hayes, 2011): dejar de creer que todo lo que pasa por tu mente es cierto o que tienes que reaccionar a ello.' }]
        },
        {
          type: 'collapsible',
          title: 'Entrenar la mente como un músculo',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt6EntrenarMente.mp3',
          content: [{ type: 'paragraph', text: 'Cada vez que practicas observar, cuestionar y soltar un pensamiento ansioso, estás entrenando tu cerebro como si hicieras ejercicio en un gimnasio.\n\nAl principio cuesta.\n\nDespués de repetirlo, se vuelve más natural.\n\nCon el tiempo, tu “músculo mental” se fortalece y la ansiedad pierde poder sobre ti.\n\nLa neurociencia lo llama neuroplasticidad: tus circuitos cerebrales cambian con la práctica, igual que los músculos cambian con el entrenamiento.' }]
        },
        {
          type: 'collapsible',
          title: 'Preparándote para la práctica',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt7Preparandote.mp3',
          content: [{ type: 'paragraph', text: 'Ahora que entiendes mejor cómo funcionan los pensamientos ansiosos (anticipatorios, catastrofistas, bucles) y cómo la amígdala puede secuestrar tu mente, pasamos a lo más importante: las técnicas que te ayudarán a no engancharte a esos pensamientos.\n\nRecuerda: no buscamos que dejen de aparecer, sino que aprendas a mirarlos de frente, sin miedo, hasta que dejen de arrastrarte.' }]
        },
        {
          type: 'collapsible',
          title: 'Resumen clave:',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/Ruta13Sem3Pnt8Resumen.mp3',
          content: [{ type: 'list', items: ['Los pensamientos ansiosos suelen anticipar, exagerar y repetir.','Tu cerebro los fabrica para protegerte, pero muchas veces exagera.','No necesitas luchar con ellos, sino observarlos y dejarlos pasar.','Con práctica, tu mente aprende a soltar y recuperar la calma'] }]
        },
        { type: 'title', text: 'Técnicas Específicas'},
        { 
          type: 'stopExercise', 
          title: 'EJERCICIO 1: STOP - Ponle un alto al piloto automático', 
          objective: 'Con esta técnica aprenderás un “botón de pausa mental” que interrumpe el bucle ansioso y te devuelve al presente en menos de un minuto.',
          duration: '2-3 min',
          audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana3tecnica1.mp3'
        },
        { 
          type: 'questionYourIfsExercise', 
          title: 'EJERCICIO 2: Cuestiona tus “¿Y si…?” con la lupa de la realidad', 
          objective: 'Aprende a poner tus preguntas ansiosas bajo una lupa, en lugar de darlas por hechas. Así tu mente pasa de la catástrofe a un análisis más realista.',
          duration: '7-9 min',
          audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana3tecnica2.mp3'
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Semana', 
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/R13sem3reflexion.mp3',
          prompts: ['¿Qué he descubierto sobre la manera en que mi mente anticipa y exagera escenarios?','¿Qué me pasa cuando confundo posibilidad con probabilidad?','¿Qué compromiso quiero llevarme para el futuro cuando aparezca la ansiedad?']
        },
        { type: 'title', text: 'Resumen Clave'},
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta13/semana3/R13sem3resumen.mp3'},
        { type: 'list', items: ['Los pensamientos ansiosos suelen aparecer en tres formas: anticipatorios, catastrofistas o en bucle.','La ansiedad tiende a confundir posibilidad con probabilidad, exagerando riesgos poco realistas.','En un pico fuerte puede producirse el secuestro emocional: la amígdala toma el control y bloquea la parte racional.','La clave no está en eliminar pensamientos, sino en dejar de fusionarnos con ellos: observarlos como hipótesis, no como verdades.','La técnica STOP ayuda a frenar el piloto automático ansioso, regular el cuerpo con la respiración, observar con perspectiva y permitir avanzar.','El cuestionamiento socrático permite desafiar los “¿y si…?” explorando evidencias, alternativas y consecuencias reales.','Con práctica, la neurociencia demuestra que se refuerza la neuroplasticidad: tu cerebro aprende a frenar antes, reducir la intensidad de la ansiedad y elegir respuestas más sanas.']},
        { type: 'quote', text: 'No tienes que apagar cada pensamiento ansioso; basta con aprender a no dejar que te arrastre.' }
      ]
    },
    {
      id: 'ansiedad_sem4',
      title: 'Semana 4: Enfréntate sin Forzarte, Avanza con Cuidado',
      type: 'summary',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraphWithAudio', text: 'El gran reto de la ansiedad no es pensar menos, sino evitar menos. Cuanto más esquivamos lo que tememos, más fuerte se hace el miedo. Esta última semana vas a aprender a enfrentarte de manera progresiva y cuidada, paso a paso, sin forzarte. Será como subir una escalera: cada peldaño te acerca a la libertad, y no hace falta correr para llegar arriba. Lo importante es avanzar, aunque sea despacio, y comprobar con tus propios ojos que puedes sostener la ansiedad y seguir adelante.', audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4introduccion.mp3'},
        { type: 'title', text: 'Psicoeducación' },
        { 
          type: 'collapsible',
          title: 'La trampa de la evitación',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc1.mp3',
          content: [{ type: 'paragraph', text: 'Cuando algo nos genera ansiedad, la reacción más natural es evitarlo. Y claro, al principio parece una solución: si no me acerco a esa situación, el malestar baja. El problema es que ese alivio dura muy poco. La próxima vez que aparezca, la ansiedad volverá igual de intensa… o incluso más fuerte. La evitación es como echar gasolina al fuego: cuanto más evito, más confirmo a mi cerebro la idea de que “ese peligro es real”. Aunque en la práctica no lo sea. Ejemplo: si evito entrar en un ascensor porque me da ansiedad, cada vez que tomo las escaleras estoy diciéndole a mi cerebro que el ascensor es efectivamente peligroso y que subir por las escaleras es lo más seguro. Así, el miedo nunca tiene ocasión de reducirse. Mas adelante veremos qué ocurre cuando hacemos justo lo contrario: acercarnos poco a poco a lo que tememos.' }]
        },
        { 
          type: 'collapsible',
          title: 'La ansiedad se reduce enfrentándola',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc2.mp3',
          content: [{ type: 'paragraph', text: 'La neurociencia lo explica con claridad: cuando te expones gradualmente a lo que temes, tu cerebro aprende que la alarma estaba exagerando. Esa alarma está en la amígdala, una parte del cerebro encargada de detectar peligros. Al exponerme, mi cuerpo comprueba que la señal era desproporcionada, y el volumen de esa alarma baja. Este proceso se llama desensibilización. Es como descubrir que una sirena suena fuerte, aunque no haya fuego: si me quedo en el lugar y observo, con el tiempo mi cerebro deja de reaccionar como si todo ardiera. Dicho de forma simple: la única manera de que la ansiedad se reduzca de verdad es atravesándola, no esquivándola.' }]
        },
        { 
          type: 'collapsible',
          title: 'Exposición progresiva: avanzar sin forzarte',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc3.mp3',
          content: [{ type: 'paragraph', text: 'En TCC usamos la técnica de la exposición progresiva. No consiste en lanzarse a lo más difícil de golpe, sino en entrenar el sistema nervioso con pasos pequeños y repetidos. Es como subir una escalera: no saltamos hasta arriba en un solo movimiento, vamos peldaño a peldaño. Incluso podemos descansar en un escalón antes de seguir avanzando. Ejemplo: si hablar en público me produce ansiedad, el proceso puede empezar hablándome frente al espejo, luego grabándome en el móvil, después contándole algo a una persona de confianza, luego en un grupo pequeño… y así hasta llegar al auditorio. La clave no es la rapidez, sino la constancia: ir avanzando sin dejar de practicar.' }]
        },
        { 
          type: 'collapsible',
          title: 'El efecto de la repetición',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc4.mp3',
          content: [{ type: 'paragraph', text: 'Cada vez que te expones y eliges quedarte en la situación, tu cuerpo aprende un mensaje muy poderoso: “puedo estar aquí y no pasa nada terrible”. Ese es el proceso de habituación. Al principio, la ansiedad puede subir mucho, como una ola que parece demasiado grande. Pero si no huyes, la ola rompe y baja sola. Y la siguiente vez suele ser un poco más pequeña. Este aprendizaje es acumulativo: tu sistema nervioso va entendiendo, con pruebas reales, que ese contexto no es una amenaza. La confianza aparece poco a poco, con la repetición.' }]
        },
        { 
          type: 'collapsible',
          title: 'La clave: avanzar con cuidado',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc5.mp3',
          content: [{ type: 'paragraph', text: 'No buscamos que seas valiente todo el día ni que fuerces más de lo necesario. Se trata de dar un paso en dirección contraria a la evitación, aunque la ansiedad siga presente. Piensa en esto como entrenar un músculo en el gimnasio: no necesitas levantar 50 kilos de golpe, basta con empezar con 2 o 3 y añadir poco a poco más peso. Cada serie que repites fortalece tu cuerpo, aunque al principio parezca poca cosa. En la ansiedad ocurre lo mismo: cada exposición, por pequeña que parezca, fortalece tu sistema interno de regulación emocional. En la siguiente pantalla veremos cómo este proceso va alimentando tu seguridad interna.' }]
        },
        { 
          type: 'collapsible',
          title: 'La confianza se entrena',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4psicoeduc6.mp3',
          content: [{ type: 'paragraph', text: 'Cada exposición que realizas es como añadir una ficha a tu “banco de confianza”. Al principio parece que el bote se llena muy despacio, pero poco a poco la evidencia interna se acumula: “ya lo hice antes, puedo hacerlo otra vez”. Este proceso se llama autoeficacia. Albert Bandura, uno de los psicólogos más influyentes, lo resumía así: “La autoeficacia es la creencia en la propia capacidad de organizar y ejecutar las acciones necesarias para manejar situaciones futuras”. En otras palabras: no buscamos eliminar la ansiedad, sino aumentar la confianza en ti mismo o en ti misma. Y la confianza crece cada vez que eliges exponerte un poco más. Con el tiempo, esa sensación de “no puedo” se transforma en “sí puedo, aunque me cueste”.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'exposureLadderExercise', 
          title: 'EJERCICIO 1: ESCALERA DE EXPOSICIÓN PERSONAL', 
          objective: 'Construye, peldaño a peldaño, un camino seguro hacia esas situaciones que hoy parecen demasiado grandes. Diseñarás tu propio plan progresivo para entrenar a tu cerebro y a tu cuerpo a confiar más en ti.',
          duration: '10-15 min',
          audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana4tecnica1.mp3'
        },
        { 
          type: 'calmVisualizationExercise',
          title: 'EJERCICIO 2: “ME VEO HACIÉNDOLO CON CALMA”',
          objective: 'Usa tu imaginación como herramienta. Cuando visualizas que te enfrentas a una situación temida de forma calmada, entrenas a tu sistema nervioso para responder con menos alarma en la vida real.',
          duration: '8-10 min',
          audioUrl: 'https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana4tecnica2.mp3',
        },
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'Reflexión Final de la Ruta',
          audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4reflexion.mp3',
          prompts: ['¿Qué descubriste sobre cómo funciona tu ansiedad y las señales que te da tu cuerpo?','¿Qué estrategias has comprobado que te ayudan más a calmarte?','¿Qué peldaños de tu escalera de exposición ya has subido y qué aprendizajes trajeron consigo?']
        },
        { type: 'title', text: 'RESUMEN CLAVE'},
        { type: 'paragraphWithAudio', text: '', audioUrl: 'https://workwellfut.com/audios/ruta13/semana4/R13sem4resumenclave.mp3'},
        { type: 'list', items: ['La evitación alivia la ansiedad a corto plazo, pero la alimenta a largo plazo.','La neurociencia muestra que la ansiedad disminuye al exponerte de forma gradual: el cerebro aprende que no hay un peligro real.','La exposición progresiva es como subir una escalera: un peldaño tras otro, con repeticiones, paciencia y descansos cuando lo necesites.','La repetición genera habituación: tu cuerpo se acostumbra y la ansiedad pierde fuerza.','No se trata de forzarte ni de ser valiente todo el tiempo, sino de dar pequeños pasos constantes en dirección contraria a la evitación.','Técnica 1: Escalera de exposición personal → construir tu propia lista de pasos, de lo más fácil a lo más difícil, y avanzar cuando lo ya practicado genere menos ansiedad.','Técnica 2: Visualización calmada → imaginarte enfrentando la situación con serenidad y éxito prepara tu mente y tu cuerpo para afrontarlo en la realidad.','Cada paso, por pequeño que sea, es un entrenamiento que acumula evidencias internas: “puedo estar aquí, puedo avanzar, aunque la ansiedad me acompañe”.', ]},
        { type: 'quote', text: '“No tienes que eliminar la ansiedad para avanzar. Solo necesitas dar un paso pequeño, constante y consciente en dirección a lo que valoras. Cada vez que lo haces, tu fuerza crece y tu libertad también.”'},
        { 
          type: 'therapeuticNotebookReflection', 
          title: 'REFLEXION FINAL PARA EL CUADERNO',
          prompts: [
            'Ahora que has recorrido este proceso, es momento de detenerte y mirar hacia dentro:',
            '¿Qué descubriste sobre cómo funciona tu ansiedad y las señales que te da tu cuerpo? […]',    
            '¿Qué estrategias has comprobado que te ayudan más a calmarte o a recuperar el control? […]',
            '¿En qué momentos notaste que la evitación aumentaba tu malestar y cuándo experimentaste que dar un pequeño paso hacia adelante te fortalecía? […]',
            '¿Qué peldaños de tu escalera de exposición ya has subido y qué aprendizajes trajeron consigo? […]',
            'Si pudieras enviarle un mensaje a tu “yo” del futuro, ¿qué recordatorio le dejarías sobre tu capacidad de afrontar la ansiedad? […]',
            'Escribe tus reflexiones con honestidad y sin juzgarte. Lo importante no es la perfección, sino reconocer tus avances y comprometerte contigo mismo o contigo misma a seguir practicando, incluso en pasos pequeños.'
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
            'El objetivo no es eliminar la ansiedad por completo, sino recuperar la confianza en tu capacidad para vivir con ella sin que te paralice',
          ]
        },
        { type: 'quote', text: '“La ansiedad no desaparece huyendo de ella, sino aprendiendo a caminar con ella hasta que deja de asustar.”' }
      ]
    }]
}>

with the text content:

    "“La ansiedad no desaparece huyendo de ella, sino aprendiendo a caminar con ella hasta que deja de asustar.”"

Relevant files:

    - src/components/paths/PathDetailClient.tsx
    - src/components/paths/PathDetailClient.tsx

And change it as follows:
  
vamos a cambiarlo por: El objetivo no es eliminar la ansiedad por completo, sino recuperar la confianza en tu capacidad para vivir con ella sin que te paralice.