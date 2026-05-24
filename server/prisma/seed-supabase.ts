import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const now = new Date().toISOString()
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString()

async function up(table: string, data: any[], conflict = 'id') {
  const { error } = await supabase.from(table).upsert(data, { onConflict: conflict })
  if (error) throw new Error(`[${table}] ${error.message} — ${error.details ?? error.hint ?? ''}`)
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting Supabase seed…\n')

  // ══════════════════════════════════════════════════════════════════════════
  // 1. TRAINERS
  // ══════════════════════════════════════════════════════════════════════════
  await up('Trainer', [
    {
      id: 'trainer-1', name: 'Carlos Mendoza',
      avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200',
      specialty: 'Fuerza & Hipertrofia',
      bio: 'Entrenador certificado con 10+ años de experiencia en entrenamiento de fuerza y transformación corporal.',
    },
    {
      id: 'trainer-2', name: 'Ana García',
      avatarUrl: 'https://images.unsplash.com/photo-1609899464726-209b2571fb4a?w=200',
      specialty: 'HIIT & Cardio',
      bio: 'Especialista en entrenamiento funcional y alta intensidad. Campeona nacional de atletismo.',
    },
    {
      id: 'trainer-3', name: 'Miguel Torres',
      avatarUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
      specialty: 'Movilidad & Funcional',
      bio: 'Fisioterapeuta y entrenador de movilidad. Ayudo a atletas a recuperarse y moverse mejor.',
    },
  ])
  console.log('✅  Trainers')

  // ══════════════════════════════════════════════════════════════════════════
  // 2. EXERCISE LIBRARY (24)
  // ══════════════════════════════════════════════════════════════════════════
  await up('ExerciseLibrary', [
    // ── Fuerza ──────────────────────────────────────────────────────────────
    {
      id: 'ex-1', name: 'Sentadilla con Barra', category: 'Fuerza',
      primaryMuscle: 'Cuádriceps', muscleGroups: ['quads','glutes','core'],
      difficulty: 'intermediate', equipment: ['Barra','Rack'],
      description: 'El ejercicio rey del tren inferior. Trabaja cuádriceps, glúteos y core simultáneamente.',
      steps: ['Coloca la barra sobre los trapecios, pies a la anchura de hombros.','Desciende manteniendo la espalda recta y el pecho hacia arriba.','Baja hasta que los muslos queden paralelos al suelo.','Empuja a través de los talones para volver a la posición inicial.','Mantén las rodillas alineadas con los pies en todo momento.'],
      tips: ['Mantén el pecho alto y la mirada al frente.','Respira hondo antes de bajar y exhala al subir.','Empieza con poco peso para dominar la técnica.'],
      imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800', updatedAt: now,
    },
    {
      id: 'ex-2', name: 'Press de Banca', category: 'Fuerza',
      primaryMuscle: 'Pectoral', muscleGroups: ['chest','triceps','shoulders'],
      difficulty: 'intermediate', equipment: ['Barra','Banco'],
      description: 'Ejercicio fundamental para el pecho, hombros y tríceps.',
      steps: ['Acuéstate en el banco con los pies planos en el suelo.','Agarra la barra con agarre ligeramente más ancho que los hombros.','Baja la barra controladamente hasta rozar el pecho.','Empuja hacia arriba de forma explosiva.','No bloquees los codos completamente al final.'],
      tips: ['Mantén los omóplatos retraídos durante todo el movimiento.','Los pies deben permanecer en el suelo.','Usa un spotter con cargas pesadas.'],
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', updatedAt: now,
    },
    {
      id: 'ex-3', name: 'Dominadas', category: 'Fuerza',
      primaryMuscle: 'Dorsal', muscleGroups: ['back','biceps','core'],
      difficulty: 'intermediate', equipment: ['Barra de dominadas'],
      description: 'El mejor ejercicio de peso corporal para desarrollar un dorsal ancho y fuerte.',
      steps: ['Cuelga de la barra con agarre prono a la anchura de hombros.','Inicia el movimiento retrayendo los omóplatos.','Tira de los codos hacia abajo llevando el pecho a la barra.','Sube hasta que la barbilla supere la barra.','Desciende de forma controlada.'],
      tips: ['No te balancees para generar impulso.','Concéntrate en tirar con el dorsal, no solo con los brazos.','Usa bandas de asistencia si no puedes hacer una rep completa.'],
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800', updatedAt: now,
    },
    {
      id: 'ex-4', name: 'Peso Muerto', category: 'Fuerza',
      primaryMuscle: 'Isquiotibiales', muscleGroups: ['hamstrings','glutes','back','core'],
      difficulty: 'advanced', equipment: ['Barra','Discos'],
      description: 'El levantamiento más completo. Trabaja prácticamente todos los músculos del cuerpo.',
      steps: ['Párate con los pies a la anchura de caderas, barra sobre el empeine.','Inclínate con las caderas hacia atrás, rodillas ligeramente flexionadas.','Agarra la barra con ambas manos, justo por fuera de las piernas.','Mantén la espalda recta y el pecho alto mientras subes.','Lleva las caderas hacia adelante al pasar las rodillas.'],
      tips: ['La barra debe rozar las piernas durante todo el movimiento.','Nunca redondees la espalda baja.','Haz la maniobra de Valsalva en los tramos difíciles.'],
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', updatedAt: now,
    },
    {
      id: 'ex-5', name: 'Press Militar', category: 'Fuerza',
      primaryMuscle: 'Deltoides', muscleGroups: ['shoulders','triceps','core'],
      difficulty: 'intermediate', equipment: ['Barra','Rack'],
      description: 'Press de hombro con barra que desarrolla deltoides y tríceps.',
      steps: ['Sostén la barra a la altura de los hombros con agarre en pronación.','Pies a la anchura de hombros, core activado.','Empuja la barra directamente hacia arriba.','Lleva la cabeza ligeramente hacia atrás para que la barra pase.','Baja la barra de forma controlada hasta los hombros.'],
      tips: ['No arquees la espalda baja para ganar impulso.','Activa el core como si fueras a recibir un golpe.','La barra debe moverse en línea vertical.'],
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', updatedAt: now,
    },
    {
      id: 'ex-6', name: 'Curl de Bíceps con Mancuernas', category: 'Fuerza',
      primaryMuscle: 'Bíceps', muscleGroups: ['biceps'],
      difficulty: 'beginner', equipment: ['Mancuernas'],
      description: 'Ejercicio de aislamiento clásico para desarrollar el volumen del bíceps.',
      steps: ['De pie, mancuernas a los lados con palmas hacia adentro.','Curla las mancuernas girando las palmas hacia arriba.','Sube hasta que los bíceps estén completamente contraídos.','Mantén la posición 1 segundo en la cima.','Baja lentamente en 3 segundos.'],
      tips: ['No uses el impulso del cuerpo para subir el peso.','Mantén los codos pegados al torso en todo momento.','Controla especialmente la bajada.'],
      imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800', updatedAt: now,
    },
    {
      id: 'ex-7', name: 'Extensión de Tríceps en Polea', category: 'Fuerza',
      primaryMuscle: 'Tríceps', muscleGroups: ['triceps'],
      difficulty: 'beginner', equipment: ['Polea','Cuerda'],
      description: 'Movimiento de aislamiento para desarrollar los tres cabezas del tríceps.',
      steps: ['Párate frente a la polea alta con la cuerda como accesorio.','Agarra la cuerda con ambas manos, codos pegados al torso.','Extiende los brazos hacia abajo separando los extremos de la cuerda.','Mantén la contracción máxima 1 segundo.','Regresa controladamente a la posición inicial.'],
      tips: ['Mantén los codos fijos — solo deben moverse los antebrazos.','Separa los extremos de la cuerda al llegar abajo para mayor contracción.','Usa un peso que permita sentir el músculo, no la articulación.'],
      imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800', updatedAt: now,
    },
    {
      id: 'ex-8', name: 'Hip Thrust', category: 'Fuerza',
      primaryMuscle: 'Glúteos', muscleGroups: ['glutes','hamstrings','core'],
      difficulty: 'intermediate', equipment: ['Banco','Barra','Discos'],
      description: 'El ejercicio más efectivo para activar y desarrollar los glúteos.',
      steps: ['Apoya la parte superior de la espalda en un banco, barra sobre las caderas.','Pies a la anchura de caderas, rodillas en 90° al subir.','Empuja las caderas hacia arriba contrayendo los glúteos al máximo.','Mantén la posición superior 2 segundos.','Baja las caderas sin tocar el suelo y repite.'],
      tips: ['Coloca una almohadilla entre la barra y las caderas.','Mira al frente, no al techo, para mantener la columna neutra.','Aprieta los glúteos al máximo en la posición superior.'],
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', updatedAt: now,
    },
    {
      id: 'ex-9', name: 'Remo con Barra', category: 'Fuerza',
      primaryMuscle: 'Dorsal', muscleGroups: ['back','biceps','core'],
      difficulty: 'intermediate', equipment: ['Barra','Discos'],
      description: 'Ejercicio compuesto para construir un dorsal y trapecio grueso.',
      steps: ['Párate con los pies a la anchura de hombros, barra colgando.','Inclínate hacia adelante unos 45°, espalda recta.','Tira de la barra hacia el abdomen manteniendo los codos cerca del cuerpo.','Aprieta los omóplatos en la posición superior.','Baja la barra de forma controlada.'],
      tips: ['No te incorpores para mover más peso — es trampa y lesión.','El pecho debe salir al tirar, no la cadera.','Piensa en meter los codos hacia los bolsillos traseros.'],
      imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', updatedAt: now,
    },
    {
      id: 'ex-10', name: 'Zancadas con Mancuernas', category: 'Fuerza',
      primaryMuscle: 'Cuádriceps', muscleGroups: ['quads','glutes','hamstrings'],
      difficulty: 'beginner', equipment: ['Mancuernas'],
      description: 'Ejercicio unilateral para piernas que mejora el equilibrio y la fuerza funcional.',
      steps: ['De pie con mancuernas a los lados.','Da un paso largo hacia adelante con una pierna.','Baja la rodilla trasera hacia el suelo sin tocarlo.','La rodilla delantera debe quedar en 90°.','Empuja con el pie delantero para volver y repite con la otra pierna.'],
      tips: ['Mantén el torso erguido durante toda la ejecución.','No dejes que la rodilla delantera pase la punta del pie.','Controla el descenso — no caigas.'],
      imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800', updatedAt: now,
    },
    // ── Core ────────────────────────────────────────────────────────────────
    {
      id: 'ex-11', name: 'Plancha Abdominal', category: 'Core',
      primaryMuscle: 'Core', muscleGroups: ['core','shoulders'],
      difficulty: 'beginner', equipment: ['Ninguno'],
      description: 'Ejercicio isométrico fundamental para fortalecer el core y mejorar la estabilidad.',
      steps: ['Apoya los antebrazos y las puntas de los pies en el suelo.','Eleva el cuerpo formando una línea recta de cabeza a talones.','Activa el abdomen como si fueras a recibir un golpe.','Mantén las caderas alineadas, ni arriba ni abajo.','Respira de forma controlada durante toda la serie.'],
      tips: ['No aguantes la respiración — respira constantemente.','Si te tiemblan mucho los brazos, baja la duración.','Mira al suelo para mantener el cuello neutro.'],
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', updatedAt: now,
    },
    {
      id: 'ex-12', name: 'Crunch con Bicicleta', category: 'Core',
      primaryMuscle: 'Oblicuos', muscleGroups: ['core'],
      difficulty: 'beginner', equipment: ['Ninguno'],
      description: 'Ejercicio dinámico que trabaja el recto abdominal y los oblicuos simultáneamente.',
      steps: ['Acuéstate boca arriba con manos detrás de la cabeza.','Eleva los hombros del suelo y lleva una rodilla al pecho.','Gira el torso para llevar el codo contrario hacia la rodilla elevada.','Extiende la pierna doblada mientras repites al otro lado.','Mantén un movimiento fluido y controlado.'],
      tips: ['No jales la cabeza con las manos.','El movimiento debe venir del torso, no del cuello.','Más lento es más difícil y más efectivo.'],
      imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800', updatedAt: now,
    },
    {
      id: 'ex-13', name: 'Dragon Flag', category: 'Core',
      primaryMuscle: 'Core', muscleGroups: ['core'],
      difficulty: 'advanced', equipment: ['Banco'],
      description: 'Ejercicio de core extremo popularizado por Bruce Lee. Requiere fuerza abdominal total.',
      steps: ['Acuéstate en un banco y sujeta el borde superior con ambas manos.','Eleva las piernas y la cadera hasta quedar vertical apoyado en los hombros.','Baja el cuerpo en línea recta controlando cada centímetro.','Para antes de tocar el banco con los glúteos.','Sube de nuevo contrayendo el core.'],
      tips: ['Empieza con la versión negativa solamente hasta ganar fuerza.','El cuerpo debe moverse como una sola unidad rígida.','Si doblas las rodillas, es trampa — mantenlas extendidas.'],
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', updatedAt: now,
    },
    {
      id: 'ex-14', name: 'Rueda Abdominal', category: 'Core',
      primaryMuscle: 'Core', muscleGroups: ['core','shoulders','back'],
      difficulty: 'advanced', equipment: ['Rueda abdominal'],
      description: 'Uno de los mejores ejercicios para desarrollar fuerza de core total.',
      steps: ['Arrodíllate con la rueda frente a ti.','Coloca las manos en la rueda y el core activado.','Rueda hacia adelante extendiendo el cuerpo.','Llega tan lejos como puedas sin caer.','Contrae el core para volver a la posición inicial.'],
      tips: ['Empieza rodando solo hasta la mitad del recorrido.','No dejes que la espalda baja se arquee — el core debe protegerla.','Exhala al volver para forzar más la contracción.'],
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', updatedAt: now,
    },
    // ── Cardio ──────────────────────────────────────────────────────────────
    {
      id: 'ex-15', name: 'Carrera Continua', category: 'Cardio',
      primaryMuscle: 'Cardiovascular', muscleGroups: ['quads','hamstrings','calves'],
      difficulty: 'beginner', equipment: ['Zapatillas de running'],
      description: 'El cardio más básico y efectivo para mejorar la resistencia aeróbica.',
      steps: ['Calienta 5 minutos caminando a paso rápido.','Corre a un ritmo donde puedas mantener una conversación.','Mantén la espalda erguida y los brazos relajados.','Apoya el pie de forma natural.','Termina con 5 minutos de enfriamiento y estiramientos.'],
      tips: ['Zona 2 (60-70% FC máx) es la ideal para el fondo.','Escucha a tu cuerpo y reduce el ritmo si sientes dolor.','Usa zapatillas adecuadas para tu pisada.'],
      imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', updatedAt: now,
    },
    {
      id: 'ex-16', name: 'Intervalos HIIT (20/10)', category: 'Cardio',
      primaryMuscle: 'Cardiovascular', muscleGroups: ['quads','core','glutes'],
      difficulty: 'intermediate', equipment: ['Ninguno'],
      description: 'Protocolo Tabata: 20 seg máximo esfuerzo, 10 seg descanso. 8 rondas = 4 minutos.',
      steps: ['Calienta 3-5 minutos a ritmo suave.','Sprint o ejercicio explosivo máximo 20 segundos.','Descansa completamente 10 segundos.','Repite 8 veces (4 minutos totales).','Enfría 3-5 minutos al terminar.'],
      tips: ['El esfuerzo en los 20 seg debe ser absoluto — insostenible.','Elige un ejercicio que puedas mantener a máxima intensidad.','No más de 3 sesiones HIIT por semana.'],
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', updatedAt: now,
    },
    {
      id: 'ex-17', name: 'Salto a la Comba', category: 'Cardio',
      primaryMuscle: 'Cardiovascular', muscleGroups: ['calves','core','shoulders'],
      difficulty: 'beginner', equipment: ['Comba'],
      description: 'Cardio de alto impacto que mejora coordinación, ritmo y resistencia cardiovascular.',
      steps: ['Sostén la comba con ambas manos a la altura de las caderas.','Gira la comba con las muñecas, no con los brazos.','Salta lo justo para que pase la comba (2-3 cm del suelo).','Mantén el core activo y los hombros relajados.','Empieza con series de 30 seg e incrementa gradualmente.'],
      tips: ['Aterriza siempre en la punta de los pies, nunca en los talones.','Ajusta la comba para que llegue a las axilas cuando la pisas.','Si tropiezas, para y sigue — no pierdas el ritmo.'],
      imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800', updatedAt: now,
    },
    // ── Pliometría ──────────────────────────────────────────────────────────
    {
      id: 'ex-18', name: 'Burpee', category: 'Pliometria',
      primaryMuscle: 'Cuerpo Completo', muscleGroups: ['chest','core','quads','shoulders'],
      difficulty: 'intermediate', equipment: ['Ninguno'],
      description: 'Ejercicio de cuerpo completo que combina fuerza y cardio en un solo movimiento.',
      steps: ['De pie, pies a la anchura de hombros.','Baja las manos al suelo y lanza los pies hacia atrás.','Realiza una flexión completa tocando el pecho al suelo.','Salta los pies hacia las manos.','Salta con los brazos arriba para completar la repetición.'],
      tips: ['Mantén el core activado para proteger la espalda.','Si eres principiante, quita el salto final.','Respira: exhala al saltar, inhala al descender.'],
      imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800', updatedAt: now,
    },
    {
      id: 'ex-19', name: 'Salto al Cajón (Box Jump)', category: 'Pliometria',
      primaryMuscle: 'Cuádriceps', muscleGroups: ['quads','glutes','calves'],
      difficulty: 'intermediate', equipment: ['Cajón pliométrico'],
      description: 'Ejercicio explosivo para desarrollar potencia en el tren inferior.',
      steps: ['Párate frente al cajón a 30 cm de distancia.','Flexiona ligeramente las rodillas en posición de salto.','Salta con ambos pies aterrizando suavemente en el cajón.','Quédate erguido en la cima 1 segundo.','Baja pisando (no saltando) para proteger las rodillas.'],
      tips: ['Aterriza con suavidad — los pies deben absorber el impacto.','Si dudas de la altura, usa un cajón más bajo.','Nunca saltes hacia atrás del cajón.'],
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', updatedAt: now,
    },
    {
      id: 'ex-20', name: 'Sentadilla Salto', category: 'Pliometria',
      primaryMuscle: 'Cuádriceps', muscleGroups: ['quads','glutes','calves','core'],
      difficulty: 'intermediate', equipment: ['Ninguno'],
      description: 'Versión explosiva de la sentadilla que desarrolla potencia y quema calorías.',
      steps: ['De pie, pies a la anchura de hombros.','Baja en sentadilla hasta los muslos paralelos.','Desde el punto más bajo, explota hacia arriba saltando.','Extiende completamente caderas, rodillas y tobillos.','Aterriza suavemente y entra directo a la siguiente rep.'],
      tips: ['Aterriza con las rodillas ligeramente flexionadas — nunca rígidas.','Los brazos ayudan: bájalos al bajar y súbelos al saltar.','Si sientes dolor en rodillas, reduce la profundidad.'],
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', updatedAt: now,
    },
    // ── Funcional ────────────────────────────────────────────────────────────
    {
      id: 'ex-21', name: 'Turkish Get-Up', category: 'Funcional',
      primaryMuscle: 'Hombro', muscleGroups: ['shoulders','core','glutes'],
      difficulty: 'advanced', equipment: ['Kettlebell'],
      description: 'Movimiento funcional complejo que desarrolla estabilidad, movilidad y fuerza total.',
      steps: ['Acuéstate con kettlebell en la mano derecha, brazo extendido al techo.','Dobla la rodilla derecha y empuja para rodar al lado izquierdo.','Apoya la mano izquierda en el suelo y siéntate.','Eleva las caderas y lleva la rodilla izquierda debajo del cuerpo.','Levántate desde la media rodilla y repite al revés para bajar.'],
      tips: ['Mantén los ojos en la kettlebell durante todo el movimiento.','Empieza sin peso para aprender el patrón.','El movimiento debe ser lento y controlado en cada fase.'],
      imageUrl: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800', updatedAt: now,
    },
    {
      id: 'ex-22', name: 'Clean & Press con Kettlebell', category: 'Funcional',
      primaryMuscle: 'Hombro', muscleGroups: ['shoulders','back','core','glutes'],
      difficulty: 'intermediate', equipment: ['Kettlebell'],
      description: 'Movimiento de potencia que une el tren inferior, core y upper body en un solo gesto.',
      steps: ['Kettlebell en el suelo entre los pies, ligeramente separados.','Hip hinge y agarra la KB con una mano.','Explosión de caderas llevando la KB al hombro (rack position).','Desde el rack, empuja la KB por encima de la cabeza.','Baja la KB de forma controlada y repite.'],
      tips: ['La potencia viene de las caderas, no de los brazos.','En el rack, la KB descansa en el antebrazo, no cuelga.','Domina el swing antes de intentar este movimiento.'],
      imageUrl: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800', updatedAt: now,
    },
    {
      id: 'ex-23', name: 'Flexión de Brazos', category: 'Funcional',
      primaryMuscle: 'Pectoral', muscleGroups: ['chest','triceps','core','shoulders'],
      difficulty: 'beginner', equipment: ['Ninguno'],
      description: 'El ejercicio de peso corporal más completo para el tren superior.',
      steps: ['Posición de tabla con manos ligeramente más anchas que los hombros.','Core activado, cuerpo en línea recta de cabeza a talones.','Baja el pecho hacia el suelo doblando los codos.','Toca el suelo con el pecho o llega muy cerca.','Empuja para extender los brazos y volver.'],
      tips: ['Los codos deben ir a 45° del cuerpo, no en ángulo recto.','Si no puedes hacer una completa, usa las rodillas de apoyo.','La velocidad óptima: 2 segundos bajando, 1 segundo subiendo.'],
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800', updatedAt: now,
    },
    {
      id: 'ex-24', name: 'Swing con Kettlebell', category: 'Funcional',
      primaryMuscle: 'Glúteos', muscleGroups: ['glutes','hamstrings','core','back'],
      difficulty: 'intermediate', equipment: ['Kettlebell'],
      description: 'El movimiento fundamental del entrenamiento con kettlebell para potencia y cardio.',
      steps: ['KB en el suelo frente a ti, a un palmo de distancia.','Agarra la KB con ambas manos, ligero hip hinge.','Impulsa la KB entre las piernas y explota con las caderas.','Deja que la KB suba hasta la altura de los hombros.','Deja que vuelva entre las piernas y repite el impulso.'],
      tips: ['Es un movimiento de cadera, no una sentadilla.','Los brazos solo guían — el poder viene de las caderas.','Aprieta los glúteos al máximo en la posición superior.'],
      imageUrl: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800', updatedAt: now,
    },
  ])
  console.log('✅  Exercises (24)')

  // ══════════════════════════════════════════════════════════════════════════
  // 3. WORKOUTS (12)
  // ══════════════════════════════════════════════════════════════════════════
  await up('Workout', [
    { id: 'wk-1',  title: 'Fuerza Total — Principiante', description: 'Rutina de cuerpo completo para construir fuerza base con los movimientos fundamentales.', durationMinutes: 45, difficulty: 'beginner',     category: 'Fuerza',     tier: 'basic',   muscleGroups: ['chest','back','quads','core'],                         equipment: ['barbell','dumbbells'],     completedBy: 412, trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', updatedAt: now },
    { id: 'wk-2',  title: 'Push Day — Pecho, Hombros y Tríceps', description: 'Día de empuje enfocado en desarrollar fuerza y volumen en el tren superior.', durationMinutes: 60, difficulty: 'intermediate', category: 'Fuerza',     tier: 'basic',   muscleGroups: ['chest','shoulders','triceps'],                         equipment: ['barbell','dumbbells'],     completedBy: 683, trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', updatedAt: now },
    { id: 'wk-3',  title: 'Pull Day — Espalda y Bíceps', description: 'Día de jalón para construir un dorsal ancho y bíceps fuertes.', durationMinutes: 60, difficulty: 'intermediate', category: 'Fuerza',     tier: 'basic',   muscleGroups: ['back','biceps'],                                       equipment: ['barbell','pull_up_bar','dumbbells'], completedBy: 541, trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', updatedAt: now },
    { id: 'wk-4',  title: 'Leg Day — Sentadillas y Glúteos', description: 'Entrenamiento de piernas completo con foco en cuádriceps y glúteos.', durationMinutes: 65, difficulty: 'intermediate', category: 'Fuerza',     tier: 'basic',   muscleGroups: ['quads','glutes','hamstrings'],                         equipment: ['barbell','dumbbells'],     completedBy: 395, trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800', updatedAt: now },
    { id: 'wk-5',  title: 'HIIT Quema Grasa', description: '30 minutos de alta intensidad para maximizar la quema calórica y mejorar el cardio.', durationMinutes: 30, difficulty: 'intermediate', category: 'Cardio',     tier: 'basic',   muscleGroups: ['core','quads','glutes'],                               equipment: ['none'],                    completedBy: 892, trainerId: 'trainer-2', imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', updatedAt: now },
    { id: 'wk-6',  title: 'Core de Acero', description: 'Sesión dedicada al fortalecimiento completo del núcleo.', durationMinutes: 25, difficulty: 'intermediate', category: 'Core',       tier: 'basic',   muscleGroups: ['core'],                                               equipment: ['none'],                    completedBy: 567, trainerId: 'trainer-2', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', updatedAt: now },
    { id: 'wk-7',  title: 'Potencia y Explosividad', description: 'Sesión de pliometría para desarrollar potencia atlética y velocidad.', durationMinutes: 40, difficulty: 'advanced',     category: 'Pliometría', tier: 'premium', muscleGroups: ['quads','glutes','core'],                               equipment: ['none'],                    completedBy: 218, trainerId: 'trainer-2', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', updatedAt: now },
    { id: 'wk-8',  title: 'Peso Muerto y Espalda — Avanzado', description: 'Sesión de alta intensidad centrada en los levantamientos pesados de espalda.', durationMinutes: 75, difficulty: 'advanced',     category: 'Fuerza',     tier: 'premium', muscleGroups: ['back','hamstrings','glutes'],                         equipment: ['barbell','pull_up_bar'],   completedBy: 156, trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', updatedAt: now },
    { id: 'wk-9',  title: 'Kettlebell Total Body', description: 'Entrenamiento funcional completo usando solo kettlebells.', durationMinutes: 45, difficulty: 'intermediate', category: 'Funcional',  tier: 'premium', muscleGroups: ['glutes','core','shoulders','back'],                   equipment: ['gym'],                     completedBy: 243, trainerId: 'trainer-3', imageUrl: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800', updatedAt: now },
    { id: 'wk-10', title: 'Full Body — Sin Equipo', description: 'Entrenamiento de cuerpo completo sin necesidad de ningún material.', durationMinutes: 35, difficulty: 'beginner',     category: 'Funcional',  tier: 'basic',   muscleGroups: ['chest','core','quads','glutes'],                       equipment: ['none'],                    completedBy: 1204, trainerId: 'trainer-2', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', updatedAt: now },
    { id: 'wk-11', title: 'Cardio Resistencia 60 min', description: 'Sesión larga de cardio en zona aeróbica para construir base cardiovascular.', durationMinutes: 60, difficulty: 'intermediate', category: 'Cardio',     tier: 'basic',   muscleGroups: ['quads','hamstrings','calves'],                         equipment: ['none'],                    completedBy: 328, trainerId: 'trainer-2', imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', updatedAt: now },
    { id: 'wk-12', title: 'VIP — Atlético Elite', description: 'Sesión de alto rendimiento que combina fuerza máxima, potencia y acondicionamiento metabólico.', durationMinutes: 90, difficulty: 'advanced',     category: 'Elite',      tier: 'vip',     muscleGroups: ['quads','back','core','glutes'],                        equipment: ['barbell','gym'],           completedBy: 87,  trainerId: 'trainer-1', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', updatedAt: now },
  ])

  // WorkoutExercises — upsert on unique (workoutId, orderIndex)
  await up('WorkoutExercise', [
    // wk-1
    { id: 'wke-wk-1-0',  workoutId: 'wk-1',  exerciseId: 'ex-23', sets: 3, reps: '8-10',           restSeconds: 90,  orderIndex: 0, notes: 'Controla el descenso' },
    { id: 'wke-wk-1-1',  workoutId: 'wk-1',  exerciseId: 'ex-10', sets: 3, reps: '10 c/pierna',    restSeconds: 60,  orderIndex: 1 },
    { id: 'wke-wk-1-2',  workoutId: 'wk-1',  exerciseId: 'ex-11', sets: 3, reps: '30 seg',         restSeconds: 45,  orderIndex: 2 },
    { id: 'wke-wk-1-3',  workoutId: 'wk-1',  exerciseId: 'ex-6',  sets: 3, reps: '12',             restSeconds: 60,  orderIndex: 3 },
    // wk-2
    { id: 'wke-wk-2-0',  workoutId: 'wk-2',  exerciseId: 'ex-2',  sets: 4, reps: '6-8',            restSeconds: 120, orderIndex: 0, notes: 'Movimiento principal — usa un peso desafiante' },
    { id: 'wke-wk-2-1',  workoutId: 'wk-2',  exerciseId: 'ex-5',  sets: 3, reps: '8-10',           restSeconds: 90,  orderIndex: 1 },
    { id: 'wke-wk-2-2',  workoutId: 'wk-2',  exerciseId: 'ex-23', sets: 3, reps: '12-15',          restSeconds: 60,  orderIndex: 2 },
    { id: 'wke-wk-2-3',  workoutId: 'wk-2',  exerciseId: 'ex-7',  sets: 3, reps: '15',             restSeconds: 45,  orderIndex: 3 },
    // wk-3
    { id: 'wke-wk-3-0',  workoutId: 'wk-3',  exerciseId: 'ex-3',  sets: 4, reps: '6-8',            restSeconds: 120, orderIndex: 0, notes: 'Si no puedes hacer 6, usa bandas de asistencia' },
    { id: 'wke-wk-3-1',  workoutId: 'wk-3',  exerciseId: 'ex-9',  sets: 4, reps: '8-10',           restSeconds: 90,  orderIndex: 1 },
    { id: 'wke-wk-3-2',  workoutId: 'wk-3',  exerciseId: 'ex-6',  sets: 3, reps: '12',             restSeconds: 60,  orderIndex: 2 },
    // wk-4
    { id: 'wke-wk-4-0',  workoutId: 'wk-4',  exerciseId: 'ex-1',  sets: 4, reps: '6-8',            restSeconds: 180, orderIndex: 0, notes: 'El movimiento rey — calienta bien antes' },
    { id: 'wke-wk-4-1',  workoutId: 'wk-4',  exerciseId: 'ex-8',  sets: 4, reps: '10-12',          restSeconds: 90,  orderIndex: 1 },
    { id: 'wke-wk-4-2',  workoutId: 'wk-4',  exerciseId: 'ex-10', sets: 3, reps: '12 c/pierna',    restSeconds: 60,  orderIndex: 2 },
    // wk-5
    { id: 'wke-wk-5-0',  workoutId: 'wk-5',  exerciseId: 'ex-18', sets: 4, reps: '10',             restSeconds: 30,  orderIndex: 0 },
    { id: 'wke-wk-5-1',  workoutId: 'wk-5',  exerciseId: 'ex-20', sets: 4, reps: '12',             restSeconds: 30,  orderIndex: 1 },
    { id: 'wke-wk-5-2',  workoutId: 'wk-5',  exerciseId: 'ex-16', sets: 8, reps: '20 seg',         restSeconds: 10,  orderIndex: 2, notes: 'Protocolo Tabata — máxima intensidad' },
    // wk-6
    { id: 'wke-wk-6-0',  workoutId: 'wk-6',  exerciseId: 'ex-11', sets: 3, reps: '45 seg',         restSeconds: 15,  orderIndex: 0 },
    { id: 'wke-wk-6-1',  workoutId: 'wk-6',  exerciseId: 'ex-12', sets: 3, reps: '20',             restSeconds: 30,  orderIndex: 1 },
    { id: 'wke-wk-6-2',  workoutId: 'wk-6',  exerciseId: 'ex-14', sets: 3, reps: '8-10',           restSeconds: 60,  orderIndex: 2, notes: 'Rueda abdominal — control total' },
    // wk-7
    { id: 'wke-wk-7-0',  workoutId: 'wk-7',  exerciseId: 'ex-19', sets: 5, reps: '5',              restSeconds: 90,  orderIndex: 0, notes: 'Calidad sobre cantidad — salto explosivo' },
    { id: 'wke-wk-7-1',  workoutId: 'wk-7',  exerciseId: 'ex-20', sets: 4, reps: '8',              restSeconds: 60,  orderIndex: 1 },
    { id: 'wke-wk-7-2',  workoutId: 'wk-7',  exerciseId: 'ex-18', sets: 3, reps: '10',             restSeconds: 45,  orderIndex: 2 },
    // wk-8
    { id: 'wke-wk-8-0',  workoutId: 'wk-8',  exerciseId: 'ex-4',  sets: 5, reps: '3-5',            restSeconds: 240, orderIndex: 0, notes: 'Levantamiento principal — calienta al 50%, 70%, 85% antes de las series de trabajo' },
    { id: 'wke-wk-8-1',  workoutId: 'wk-8',  exerciseId: 'ex-3',  sets: 4, reps: '5-6',            restSeconds: 120, orderIndex: 1 },
    { id: 'wke-wk-8-2',  workoutId: 'wk-8',  exerciseId: 'ex-9',  sets: 3, reps: '8',              restSeconds: 90,  orderIndex: 2 },
    // wk-9
    { id: 'wke-wk-9-0',  workoutId: 'wk-9',  exerciseId: 'ex-24', sets: 5, reps: '20',             restSeconds: 45,  orderIndex: 0 },
    { id: 'wke-wk-9-1',  workoutId: 'wk-9',  exerciseId: 'ex-22', sets: 4, reps: '6 c/lado',       restSeconds: 60,  orderIndex: 1 },
    { id: 'wke-wk-9-2',  workoutId: 'wk-9',  exerciseId: 'ex-21', sets: 3, reps: '3 c/lado',       restSeconds: 90,  orderIndex: 2, notes: 'Movimiento lento y controlado' },
    // wk-10
    { id: 'wke-wk-10-0', workoutId: 'wk-10', exerciseId: 'ex-23', sets: 3, reps: '10',             restSeconds: 60,  orderIndex: 0 },
    { id: 'wke-wk-10-1', workoutId: 'wk-10', exerciseId: 'ex-20', sets: 3, reps: '10',             restSeconds: 60,  orderIndex: 1 },
    { id: 'wke-wk-10-2', workoutId: 'wk-10', exerciseId: 'ex-12', sets: 3, reps: '20',             restSeconds: 45,  orderIndex: 2 },
    { id: 'wke-wk-10-3', workoutId: 'wk-10', exerciseId: 'ex-11', sets: 3, reps: '40 seg',         restSeconds: 20,  orderIndex: 3 },
    // wk-11
    { id: 'wke-wk-11-0', workoutId: 'wk-11', exerciseId: 'ex-15', sets: 1, reps: '60 min zona 2',  restSeconds: 0,   orderIndex: 0, notes: 'Mantén entre 60-70% de tu FC máxima todo el tiempo' },
    // wk-12
    { id: 'wke-wk-12-0', workoutId: 'wk-12', exerciseId: 'ex-1',  sets: 5, reps: '3',              restSeconds: 240, orderIndex: 0, notes: '85-90% de tu 1RM' },
    { id: 'wke-wk-12-1', workoutId: 'wk-12', exerciseId: 'ex-4',  sets: 4, reps: '3',              restSeconds: 240, orderIndex: 1, notes: '80-85% de tu 1RM' },
    { id: 'wke-wk-12-2', workoutId: 'wk-12', exerciseId: 'ex-3',  sets: 4, reps: '4-6',            restSeconds: 120, orderIndex: 2, notes: 'Con lastre si es posible' },
    { id: 'wke-wk-12-3', workoutId: 'wk-12', exerciseId: 'ex-19', sets: 5, reps: '5',              restSeconds: 90,  orderIndex: 3 },
    { id: 'wke-wk-12-4', workoutId: 'wk-12', exerciseId: 'ex-18', sets: 3, reps: '8',              restSeconds: 30,  orderIndex: 4, notes: 'Finisher metabólico' },
  ])
  console.log('✅  Workouts + WorkoutExercises')

  // ══════════════════════════════════════════════════════════════════════════
  // 4. TRAINING PLANS + WEEKS + DAYS
  // ══════════════════════════════════════════════════════════════════════════
  await up('TrainingPlan', [
    { id: 'plan-1', title: 'Fuerza Base — 4 Semanas',             description: 'Programa para principiantes que quieren construir fuerza real con los movimientos fundamentales. Ideal como primer programa estructurado.',                                             tier: 'basic',   durationWeeks: 4,  daysPerWeek: 3, goal: 'increase_strength', level: 'beginner',     trainerId: 'trainer-1', enrolledCount: 834,  imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', updatedAt: now },
    { id: 'plan-2', title: 'HIIT Fat Loss — 6 Semanas',           description: 'Programa de cardio y alta intensidad diseñado para quemar grasa y mejorar el acondicionamiento cardiovascular rápidamente.',                                                           tier: 'basic',   durationWeeks: 6,  daysPerWeek: 4, goal: 'lose_weight',       level: 'intermediate', trainerId: 'trainer-2', enrolledCount: 1243, imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', updatedAt: now },
    { id: 'plan-3', title: 'Push Pull Legs — 8 Semanas',          description: 'El programa clásico de hipertrofia dividido en 3 días. Ideal para ganar masa muscular de forma organizada y progresiva.',                                                              tier: 'premium', durationWeeks: 8,  daysPerWeek: 6, goal: 'build_muscle',      level: 'intermediate', trainerId: 'trainer-1', enrolledCount: 2187, imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', updatedAt: now },
    { id: 'plan-4', title: 'Athletic Performance — 12 Semanas VIP', description: 'Programa de alto rendimiento para atletas avanzados. Combina fuerza máxima, potencia explosiva y acondicionamiento metabólico.',                                                    tier: 'vip',     durationWeeks: 12, daysPerWeek: 5, goal: 'increase_strength', level: 'advanced',     trainerId: 'trainer-1', enrolledCount: 389,  imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', updatedAt: now },
  ])

  // ── Build weeks + days ────────────────────────────────────────────────────
  type DayTpl = { dayNumber: number; label: string; isRest: boolean; workoutId?: string }

  const plan1Templates: Record<number, DayTpl[]> = {
    1: [
      { dayNumber: 1, label: 'Full Body A', isRest: false, workoutId: 'wk-1' },
      { dayNumber: 2, label: 'Descanso', isRest: true },
      { dayNumber: 3, label: 'Full Body B', isRest: false, workoutId: 'wk-10' },
      { dayNumber: 4, label: 'Descanso', isRest: true },
      { dayNumber: 5, label: 'Full Body A', isRest: false, workoutId: 'wk-1' },
      { dayNumber: 6, label: 'Descanso', isRest: true },
      { dayNumber: 7, label: 'Descanso', isRest: true },
    ],
    2: [
      { dayNumber: 1, label: 'Full Body A', isRest: false, workoutId: 'wk-1' },
      { dayNumber: 2, label: 'Descanso', isRest: true },
      { dayNumber: 3, label: 'Full Body B', isRest: false, workoutId: 'wk-10' },
      { dayNumber: 4, label: 'Descanso', isRest: true },
      { dayNumber: 5, label: 'Full Body A', isRest: false, workoutId: 'wk-1' },
      { dayNumber: 6, label: 'Descanso', isRest: true },
      { dayNumber: 7, label: 'Descanso', isRest: true },
    ],
    3: [
      { dayNumber: 1, label: 'Push', isRest: false, workoutId: 'wk-2' },
      { dayNumber: 2, label: 'Descanso', isRest: true },
      { dayNumber: 3, label: 'Pull', isRest: false, workoutId: 'wk-3' },
      { dayNumber: 4, label: 'Descanso', isRest: true },
      { dayNumber: 5, label: 'Piernas', isRest: false, workoutId: 'wk-4' },
      { dayNumber: 6, label: 'Descanso', isRest: true },
      { dayNumber: 7, label: 'Descanso', isRest: true },
    ],
    4: [
      { dayNumber: 1, label: 'Push', isRest: false, workoutId: 'wk-2' },
      { dayNumber: 2, label: 'Descanso', isRest: true },
      { dayNumber: 3, label: 'Pull', isRest: false, workoutId: 'wk-3' },
      { dayNumber: 4, label: 'Descanso', isRest: true },
      { dayNumber: 5, label: 'Piernas', isRest: false, workoutId: 'wk-4' },
      { dayNumber: 6, label: 'Full Body', isRest: false, workoutId: 'wk-1' },
      { dayNumber: 7, label: 'Descanso', isRest: true },
    ],
  }

  const plan2Template: DayTpl[] = [
    { dayNumber: 1, label: 'HIIT', isRest: false, workoutId: 'wk-5' },
    { dayNumber: 2, label: 'Core', isRest: false, workoutId: 'wk-6' },
    { dayNumber: 3, label: 'Descanso activo', isRest: true },
    { dayNumber: 4, label: 'HIIT', isRest: false, workoutId: 'wk-5' },
    { dayNumber: 5, label: 'Full Body', isRest: false, workoutId: 'wk-10' },
    { dayNumber: 6, label: 'Cardio suave', isRest: false, workoutId: 'wk-11' },
    { dayNumber: 7, label: 'Descanso', isRest: true },
  ]

  const plan3Template: DayTpl[] = [
    { dayNumber: 1, label: 'Push', isRest: false, workoutId: 'wk-2' },
    { dayNumber: 2, label: 'Pull', isRest: false, workoutId: 'wk-3' },
    { dayNumber: 3, label: 'Piernas', isRest: false, workoutId: 'wk-4' },
    { dayNumber: 4, label: 'Descanso', isRest: true },
    { dayNumber: 5, label: 'Push', isRest: false, workoutId: 'wk-2' },
    { dayNumber: 6, label: 'Pull', isRest: false, workoutId: 'wk-3' },
    { dayNumber: 7, label: 'Piernas + Core', isRest: false, workoutId: 'wk-4' },
  ]

  const plan4Template: DayTpl[] = [
    { dayNumber: 1, label: 'Fuerza Lower', isRest: false, workoutId: 'wk-4' },
    { dayNumber: 2, label: 'Potencia Upper', isRest: false, workoutId: 'wk-8' },
    { dayNumber: 3, label: 'Movilidad / Descanso', isRest: true },
    { dayNumber: 4, label: 'Pliometría', isRest: false, workoutId: 'wk-7' },
    { dayNumber: 5, label: 'Elite Full Body', isRest: false, workoutId: 'wk-12' },
    { dayNumber: 6, label: 'Kettlebell Conditioning', isRest: false, workoutId: 'wk-9' },
    { dayNumber: 7, label: 'Descanso', isRest: true },
  ]

  const allWeeks: any[] = []
  const allDays:  any[] = []

  const addWeeks = (planId: string, count: number, getTpl: (w: number) => DayTpl[]) => {
    for (let w = 1; w <= count; w++) {
      const weekId = `pw-${planId}-${w}`
      allWeeks.push({ id: weekId, planId, weekNumber: w })
      for (const d of getTpl(w)) {
        allDays.push({ id: `pd-${planId}-${w}-${d.dayNumber}`, weekId, ...d })
      }
    }
  }

  addWeeks('plan-1', 4,  w => plan1Templates[w])
  addWeeks('plan-2', 6,  () => plan2Template)
  addWeeks('plan-3', 8,  () => plan3Template)
  addWeeks('plan-4', 12, () => plan4Template)

  await up('PlanWeek', allWeeks)
  await up('PlanDay',  allDays)
  console.log('✅  Training Plans + Weeks + Days')

  // ══════════════════════════════════════════════════════════════════════════
  // 5. MEAL PLANS + MEALS (6)
  // ══════════════════════════════════════════════════════════════════════════
  await up('MealPlan', [
    { id: 'mp-1', title: 'Plan Pérdida de Peso — 1.800 kcal',          description: 'Plan de alimentación en déficit calórico moderado con alto contenido proteico para preservar músculo mientras se pierde grasa.',                                      tier: 'basic',   calories: 1800, updatedAt: now },
    { id: 'mp-2', title: 'Plan Mantenimiento — 2.200 kcal',            description: 'Plan equilibrado para mantener el peso actual y el rendimiento deportivo con macros optimizados.',                                                                       tier: 'basic',   calories: 2200, updatedAt: now },
    { id: 'mp-3', title: 'Plan Volumen Muscular — 3.000 kcal',         description: 'Plan hipercalórico con alto contenido proteico y carbohidratos para maximizar la síntesis muscular y el rendimiento.',                                                   tier: 'premium', calories: 3000, updatedAt: now },
    { id: 'mp-4', title: 'Plan Vegano Atlético — 2.400 kcal',          description: 'Plan 100% vegetal con proteínas completas y carbohidratos de calidad para rendir al máximo sin productos animales.',                                                      tier: 'premium', calories: 2400, updatedAt: now },
    { id: 'mp-5', title: 'Plan Cetogénico — 1.900 kcal',               description: 'Plan bajo en carbohidratos y alto en grasas para inducir cetosis y optimizar la quema de grasa como combustible.',                                                       tier: 'premium', calories: 1900, updatedAt: now },
    { id: 'mp-6', title: 'Plan Rendimiento Atlético VIP — 3.500 kcal', description: 'Plan de nutrición de élite diseñado por nutricionistas deportivos para maximizar la recuperación, el rendimiento y la composición corporal.',                           tier: 'vip',     calories: 3500, updatedAt: now },
  ])

  await up('Meal', [
    // mp-1
    { id: 'meal-mp-1-0', mealPlanId: 'mp-1', name: 'Avena Proteica con Frutos Rojos',    mealType: 'breakfast', calories: 380, protein: 28, carbs: 52, fats: 8,  imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600', ingredients: ['80g avena','1 scoop proteína vainilla','150ml leche desnatada','100g frutos rojos','1 cucharada semillas chía'],                                    instructions: ['Cocina la avena con la leche 3-4 min.','Mezcla la proteína fuera del fuego.','Sirve con los frutos rojos y semillas de chía encima.'] },
    { id: 'meal-mp-1-1', mealPlanId: 'mp-1', name: 'Ensalada de Pollo a la Plancha',     mealType: 'lunch',     calories: 520, protein: 45, carbs: 38, fats: 14, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', ingredients: ['200g pechuga de pollo','150g mix de lechugas','1 tomate','½ pepino','30g queso feta','1 cucharada aceite de oliva','Limón y orégano'],           instructions: ['Marina el pollo con limón, sal y orégano 15 min.','Cocina a la plancha 6 min por lado.','Monta la ensalada y aliña con aceite de oliva.'] },
    { id: 'meal-mp-1-2', mealPlanId: 'mp-1', name: 'Yogur Griego con Nueces',            mealType: 'snack',     calories: 210, protein: 15, carbs: 12, fats: 11, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', ingredients: ['200g yogur griego 0%','20g nueces','1 cucharadita miel'],                                                                                         instructions: ['Mezcla el yogur con la miel.','Añade las nueces troceadas encima.'] },
    { id: 'meal-mp-1-3', mealPlanId: 'mp-1', name: 'Salmón al Horno con Verduras',       mealType: 'dinner',    calories: 490, protein: 42, carbs: 28, fats: 18, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', ingredients: ['180g filete de salmón','200g brócoli','1 boniato mediano','Aceite de oliva','Ajo y hierbas provenzales'],                                          instructions: ['Precalienta el horno a 200°C.','Sazona el salmón y las verduras con aceite, ajo y hierbas.','Hornea 18-22 minutos.'] },
    // mp-2
    { id: 'meal-mp-2-0', mealPlanId: 'mp-2', name: 'Tostadas de Aguacate y Huevos',      mealType: 'breakfast', calories: 480, protein: 24, carbs: 46, fats: 22, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600', ingredients: ['2 rebanadas pan integral','1 aguacate maduro','2 huevos','Tomate cherry','Sal, pimienta y pimentón'],                                              instructions: ['Tuesta el pan.','Machaca el aguacate y extiéndelo sobre las tostadas.','Fríe o escalfa los huevos. Sirve con tomate cherry.'] },
    { id: 'meal-mp-2-1', mealPlanId: 'mp-2', name: 'Pasta con Atún y Tomate',            mealType: 'lunch',     calories: 620, protein: 38, carbs: 78, fats: 12, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600', ingredients: ['100g pasta integral','2 latas atún en agua','200g tomate triturado','1 cebolla','2 dientes ajo','Albahaca fresca'],                               instructions: ['Cuece la pasta al dente.','Sofríe la cebolla y el ajo 5 min.','Añade el tomate y cocina 10 min. Incorpora el atún y sirve sobre la pasta.'] },
    { id: 'meal-mp-2-2', mealPlanId: 'mp-2', name: 'Batido de Recuperación',             mealType: 'snack',     calories: 320, protein: 30, carbs: 38, fats: 5,  imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600', ingredients: ['1 scoop proteína chocolate','1 plátano','250ml leche semidesnatada','1 cucharada mantequilla de cacahuete'],                                      instructions: ['Tritura todos los ingredientes en batidora hasta obtener textura cremosa.','Tomar inmediatamente tras el entrenamiento.'] },
    { id: 'meal-mp-2-3', mealPlanId: 'mp-2', name: 'Pollo al Curry con Arroz',           mealType: 'dinner',    calories: 580, protein: 44, carbs: 62, fats: 14, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600', ingredients: ['200g pechuga de pollo','80g arroz basmati','200ml leche de coco light','1 cebolla','Curry en polvo','Jengibre y ajo'],                             instructions: ['Cuece el arroz.','Sofríe la cebolla con ajo y jengibre.','Añade el pollo en cubos, dora y agrega el curry y la leche de coco. Cocina 15 min.'] },
    // mp-3
    { id: 'meal-mp-3-0', mealPlanId: 'mp-3', name: 'Pancakes de Avena Proteicos',        mealType: 'breakfast', calories: 620, protein: 45, carbs: 72, fats: 14, imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600', ingredients: ['100g avena','2 scoops proteína','3 huevos','150ml leche','1 plátano','Canela','Miel para servir'],                                                 instructions: ['Tritura avena hasta obtener harina.','Mezcla todos los ingredientes.','Cocina en sartén antiadherente 2 min por lado.','Sirve con miel.'] },
    { id: 'meal-mp-3-1', mealPlanId: 'mp-3', name: 'Bowl de Arroz con Carne y Guacamole',mealType: 'lunch',     calories: 820, protein: 55, carbs: 88, fats: 22, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', ingredients: ['120g arroz','250g carne picada magra','1 aguacate','150g judías negras','Pimiento rojo','Maíz','Limón y cilantro'],                              instructions: ['Cuece el arroz.','Saltea la carne con pimiento.','Monta el bowl con arroz, carne, judías, maíz y guacamole.'] },
    { id: 'meal-mp-3-2', mealPlanId: 'mp-3', name: 'Sándwich de Pavo y Aguacate',        mealType: 'snack',     calories: 420, protein: 32, carbs: 44, fats: 14, imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600', ingredients: ['2 rebanadas pan de centeno','120g pavo en lonchas','½ aguacate','Lechuga','Tomate','Mostaza dijon'],                                               instructions: ['Tuesta el pan ligeramente.','Extiende el aguacate aplastado.','Añade el pavo, lechuga y tomate. Aliña con mostaza.'] },
    { id: 'meal-mp-3-3', mealPlanId: 'mp-3', name: 'Filete de Ternera con Boniato',      mealType: 'dinner',    calories: 720, protein: 58, carbs: 52, fats: 24, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', ingredients: ['250g filete de ternera','250g boniato','200g espárragos','Aceite de oliva','Romero y ajo','Sal y pimienta'],                                    instructions: ['Hornea el boniato a 200°C 25 min.','Asa los espárragos a la plancha.','Cocina el filete a tu punto preferido.'] },
    // mp-4
    { id: 'meal-mp-4-0', mealPlanId: 'mp-4', name: 'Bowl de Açaí con Granola',           mealType: 'breakfast', calories: 480, protein: 18, carbs: 68, fats: 16, imageUrl: 'https://images.unsplash.com/photo-1490323914169-4f68b1f95c77?w=600', ingredients: ['200g pulpa açaí','40g granola sin azúcar','1 plátano','100g fresas','2 cucharadas semillas cáñamo','Miel de agave'],                            instructions: ['Deja descongelar la pulpa o tritura congelada.','Sirve en un bowl y añade toppings.'] },
    { id: 'meal-mp-4-1', mealPlanId: 'mp-4', name: 'Buddha Bowl de Tofu y Quinoa',       mealType: 'lunch',     calories: 680, protein: 35, carbs: 74, fats: 22, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', ingredients: ['150g tofu firme','80g quinoa','100g edamame','Remolacha','Zanahoria rallada','Tahini','Limón'],                                                instructions: ['Cuece la quinoa.','Hornea el tofu marinado 20 min a 200°C.','Monta el bowl y aliña con salsa de tahini y limón.'] },
    { id: 'meal-mp-4-2', mealPlanId: 'mp-4', name: 'Hummus con Crudités',                mealType: 'snack',     calories: 280, protein: 12, carbs: 26, fats: 14, imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600', ingredients: ['150g hummus casero','Zanahoria baby','Pepino','Pimiento rojo','Brócoli'],                                                                        instructions: ['Corta todas las verduras en bastones.','Sirve con hummus para dipear.'] },
    { id: 'meal-mp-4-3', mealPlanId: 'mp-4', name: 'Curry de Garbanzos y Coco',          mealType: 'dinner',    calories: 620, protein: 28, carbs: 72, fats: 22, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600', ingredients: ['400g garbanzos cocidos','400ml leche de coco','200g espinacas','Tomate triturado','Curry, comino, cúrcuma','80g arroz basmati'],              instructions: ['Sofríe las especias 1 min.','Añade tomate y leche de coco.','Incorpora garbanzos y espinacas. Cocina 15 min. Sirve con arroz.'] },
    // mp-5
    { id: 'meal-mp-5-0', mealPlanId: 'mp-5', name: 'Huevos Revueltos con Aguacate',      mealType: 'breakfast', calories: 520, protein: 32, carbs: 6,  fats: 42, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600', ingredients: ['3 huevos','1 aguacate','3 lonchas bacon','30g queso cheddar','Mantequilla','Sal y pimienta'],                                                  instructions: ['Cocina el bacon hasta dorar.','Revuelve los huevos con mantequilla a fuego bajo.','Sirve con aguacate en rodajas y queso rallado.'] },
    { id: 'meal-mp-5-1', mealPlanId: 'mp-5', name: 'Ensalada César con Pollo',           mealType: 'lunch',     calories: 580, protein: 44, carbs: 8,  fats: 40, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', ingredients: ['200g pollo a la plancha','100g lechuga romana','40g queso parmesano','3 cucharadas salsa césar','4 anchoas','Sin croutons'],                  instructions: ['Asa el pollo con sal y pimienta.','Mezcla la lechuga con la salsa césar.','Añade el pollo y el parmesano.'] },
    { id: 'meal-mp-5-2', mealPlanId: 'mp-5', name: 'Nueces y Queso',                     mealType: 'snack',     calories: 280, protein: 10, carbs: 4,  fats: 26, imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600', ingredients: ['30g nueces','30g queso gouda','5 aceitunas'],                                                                                                 instructions: ['Sirve juntos como snack rápido.'] },
    { id: 'meal-mp-5-3', mealPlanId: 'mp-5', name: 'Salmón con Espinacas al Ajillo',     mealType: 'dinner',    calories: 520, protein: 46, carbs: 6,  fats: 34, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', ingredients: ['200g salmón','300g espinacas frescas','4 dientes ajo','Aceite de oliva','Limón','Sal y pimienta'],                                               instructions: ['Saltea el ajo en aceite de oliva.','Añade las espinacas y cocina hasta marchitar.','Cocina el salmón a la plancha 4 min por lado. Sirve con limón.'] },
    // mp-6
    { id: 'meal-mp-6-0', mealPlanId: 'mp-6', name: 'Desayuno Pre-Entrenamiento Power',   mealType: 'breakfast', calories: 720, protein: 52, carbs: 88, fats: 16, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600', ingredients: ['120g avena','2 scoops proteína','4 claras de huevo','2 huevos enteros','1 plátano grande','30g mantequilla de almendras','Bayas'],             instructions: ['Cocina la avena con leche.','Mezcla la proteína al terminar.','Fríe los huevos. Sirve todo junto con plátano y bayas.'] },
    { id: 'meal-mp-6-1', mealPlanId: 'mp-6', name: 'Bowl Mediterráneo de Atún',          mealType: 'lunch',     calories: 880, protein: 65, carbs: 82, fats: 24, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', ingredients: ['3 latas atún al natural','100g arroz integral','1 aguacate','Tomate cherry','Pepino','Aceitunas negras','Aceite de oliva virgen extra','Orégano'],instructions: ['Cuece el arroz integral.','Monta el bowl con todos los ingredientes.','Aliña con aceite de oliva y orégano.'] },
    { id: 'meal-mp-6-2', mealPlanId: 'mp-6', name: 'Batido Post-Entrenamiento Élite',    mealType: 'snack',     calories: 480, protein: 48, carbs: 54, fats: 8,  imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600', ingredients: ['2 scoops proteína','1 plátano','50g copos de avena','250ml leche','5g creatina','10g glutamina'],                                             instructions: ['Tritura todos los ingredientes.','Tomar inmediatamente después del entrenamiento.'] },
    { id: 'meal-mp-6-3', mealPlanId: 'mp-6', name: 'Chuletón de Buey con Batata',        mealType: 'dinner',    calories: 920, protein: 72, carbs: 68, fats: 34, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', ingredients: ['300g chuletón de buey','300g batata','200g espárragos trigueros','100g ensalada variada','Aceite de oliva virgen extra','Sal marina y romero'], instructions: ['Hornea la batata 30 min a 200°C.','Asa el chuletón al punto deseado 4-6 min por lado.','Asa los espárragos a la plancha. Sirve todo junto.'] },
  ])
  console.log('✅  Meal Plans + Meals')

  // ══════════════════════════════════════════════════════════════════════════
  // 6. BADGES (11)
  // ══════════════════════════════════════════════════════════════════════════
  await up('Badge', [
    { id: 'badge-first_workout', name: 'first_workout', description: '¡Completaste tu primer entrenamiento!', icon: '🏋️', category: 'milestone',    requirement: 'Completa 1 entrenamiento',    threshold: 1   },
    { id: 'badge-workouts_10',   name: 'workouts_10',   description: 'Has completado 10 entrenamientos.',     icon: '🔟', category: 'milestone',    requirement: 'Completa 10 entrenamientos',  threshold: 10  },
    { id: 'badge-workouts_50',   name: 'workouts_50',   description: '50 entrenamientos en el banco.',         icon: '💪', category: 'milestone',    requirement: 'Completa 50 entrenamientos',  threshold: 50  },
    { id: 'badge-workouts_100',  name: 'workouts_100',  description: '100 entrenamientos completados.',        icon: '💯', category: 'milestone',    requirement: 'Completa 100 entrenamientos', threshold: 100 },
    { id: 'badge-streak_7',      name: 'streak_7',      description: '7 días consecutivos de entrenamiento.',  icon: '🔥', category: 'consistency', requirement: 'Racha de 7 días',             threshold: 7   },
    { id: 'badge-streak_30',     name: 'streak_30',     description: '¡Un mes completo sin fallar!',           icon: '⚡', category: 'consistency', requirement: 'Racha de 30 días',            threshold: 30  },
    { id: 'badge-streak_100',    name: 'streak_100',    description: '100 días imparables.',                   icon: '👑', category: 'consistency', requirement: 'Racha de 100 días',           threshold: 100 },
    { id: 'badge-level_5',       name: 'level_5',       description: 'Alcanzaste el nivel 5.',                 icon: '⭐', category: 'performance', requirement: 'Nivel 5',                     threshold: 5   },
    { id: 'badge-level_10',      name: 'level_10',      description: 'Nivel 10 — estás en otra liga.',         icon: '🌟', category: 'performance', requirement: 'Nivel 10',                    threshold: 10  },
    { id: 'badge-points_1000',   name: 'points_1000',   description: '1.000 puntos acumulados.',               icon: '🎯', category: 'performance', requirement: '1.000 puntos',                threshold: 1000},
    { id: 'badge-early_bird',    name: 'early_bird',    description: 'Miembro fundador de FitForge.',          icon: '🐦', category: 'special',     requirement: 'Miembro fundador',            threshold: 1   },
  ])
  console.log('✅  Badges (11)')

  // ══════════════════════════════════════════════════════════════════════════
  // 7. CHALLENGES (4)
  // ══════════════════════════════════════════════════════════════════════════
  await up('Challenge', [
    { id: 'challenge-1', title: 'Reto 30 Días de Fuerza',    description: 'Completa 20 entrenamientos en 30 días.', goalType: 'workouts_completed', goalValue: 20,  pointsReward: 500, tier: 'basic',   startDate: now, endDate: inDays(30), isActive: true },
    { id: 'challenge-2', title: 'Racha de 2 Semanas',         description: 'Entrena 14 días seguidos.',              goalType: 'streak_days',        goalValue: 14,  pointsReward: 300, tier: 'basic',   startDate: now, endDate: inDays(14), isActive: true },
    { id: 'challenge-3', title: 'Semana de Fuego',            description: 'Completa 5 entrenamientos esta semana.', goalType: 'workouts_completed', goalValue: 5,   pointsReward: 150, tier: 'basic',   startDate: now, endDate: inDays(7),  isActive: true },
    { id: 'challenge-4', title: 'Maratón de Minutos Premium', description: 'Acumula 600 minutos en 30 días.',         goalType: 'total_minutes',      goalValue: 600, pointsReward: 750, tier: 'premium', startDate: now, endDate: inDays(30), isActive: true },
  ])
  console.log('✅  Challenges (4)')

  // ══════════════════════════════════════════════════════════════════════════
  // 8. USERS + STATS
  // ══════════════════════════════════════════════════════════════════════════
  const adminHash = await bcrypt.hash('Admin123!', 12)
  const demoHash  = await bcrypt.hash('Demo123!',  12)

  await up('User', [
    { id: 'user-admin', email: 'admin@fitforge.com', passwordHash: adminHash, name: 'Admin FitForge', role: 'admin', subscriptionTier: 'vip',     onboardingCompleted: true, updatedAt: now },
    { id: 'user-demo',  email: 'demo@fitforge.com',  passwordHash: demoHash,  name: 'Demo User',       role: 'user',  subscriptionTier: 'premium', onboardingCompleted: true, updatedAt: now },
  ], 'email')

  // UserStats: userId IS the primary key (no separate id column)
  await up('UserStats', [
    { userId: 'user-admin', workoutsCompleted: 0,  totalMinutes: 0,   currentStreak: 0, longestStreak: 0,  points: 0,   level: 1, updatedAt: now },
    { userId: 'user-demo',  workoutsCompleted: 12, totalMinutes: 480, currentStreak: 4, longestStreak: 7,  points: 600, level: 2, updatedAt: now },
  ], 'userId')
  console.log('✅  Users + Stats (admin + demo)')

  console.log('\n🎉  Seed completado!')
  console.log('\n📋  Credenciales:')
  console.log('    Admin  → admin@fitforge.com  / Admin123!')
  console.log('    Demo   → demo@fitforge.com   / Demo123!')
  console.log('\n📊  Datos insertados:')
  console.log('    • 3 Trainers')
  console.log('    • 24 Ejercicios')
  console.log('    • 12 Workouts + 38 WorkoutExercises')
  console.log('    • 4 Planes + 30 Semanas + 210 Días')
  console.log('    • 6 Planes de nutrición + 24 Comidas')
  console.log('    • 11 Badges')
  console.log('    • 4 Challenges')
  console.log('    • 2 Users + Stats')
}

main()
  .catch(e => { console.error('\n❌  Seed failed:', e.message); process.exit(1) })
