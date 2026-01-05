// Shared constants across the application

// Muscle group mapping
const MUSCLE_GROUPS = {
    1: 'Pecho',
    2: 'Pierna',
    3: 'Hombro',
    4: 'Bíceps',
    5: 'Espalda',
    6: 'Tríceps',
    7: 'Abs',
    8: 'Traps'
};

// Days of the week
const DAYS_OF_WEEK = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
];

// Weekly schedule templates are now loaded from the API
// See api.js -> getAllWeeklySchedules() for fetching schedules dynamically
// The hardcoded WEEKLY_SCHEDULES object has been removed and replaced with API calls
