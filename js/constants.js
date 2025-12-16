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

// Weekly schedule templates based on week number (1-10)
const WEEKLY_SCHEDULES = {
    1: {
        'Lunes': [1],           // Pecho
        'Martes': [2],          // Pierna
        'Miércoles': [5],       // Espalda
        'Jueves': [3, 4],       // Hombro + Bíceps
        'Viernes': [6],         // Tríceps
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // ABS
    },
    2: {
        'Lunes': [6],           // Tríceps
        'Martes': [2],          // Pierna
        'Miércoles': [1],       // Pecho
        'Jueves': [5, 3],       // Espalda + Hombro
        'Viernes': [4],         // Bíceps
        'Sábado': [2],          // Pierna
        'Domingo': [8]          // Traps
    },
    3: {
        'Lunes': [4],           // Bíceps
        'Martes': [2],          // Pierna
        'Miércoles': [6],       // Tríceps
        'Jueves': [1, 5],       // Pecho + Espalda
        'Viernes': [3],         // Hombro
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // Abs
    },
    4: {
        'Lunes': [3],           // Hombro
        'Martes': [2],          // Pierna
        'Miércoles': [4],       // Bíceps
        'Jueves': [6, 1],       // Tríceps + Pecho
        'Viernes': [5],         // Espalda
        'Sábado': [2],          // Pierna
        'Domingo': [8]          // Traps
    },
    5: {
        'Lunes': [5],           // Espalda
        'Martes': [2],          // Pierna
        'Miércoles': [3],       // Hombro
        'Jueves': [4, 6],       // Bíceps + Tríceps
        'Viernes': [1],         // Pecho
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // Abs
    },
    6: {
        'Lunes': [1],           // Pecho
        'Martes': [2],          // Pierna
        'Miércoles': [5],       // Espalda
        'Jueves': [3, 4],       // Hombro + Bíceps
        'Viernes': [6],         // Tríceps
        'Sábado': [2],          // Pierna
        'Domingo': [8]          // Traps
    },
    7: {
        'Lunes': [6],           // Tríceps
        'Martes': [2],          // Pierna
        'Miércoles': [1],       // Pecho
        'Jueves': [5, 3],       // Espalda + Hombro
        'Viernes': [4],         // Bíceps
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // Abs
    },
    8: {
        'Lunes': [4],           // Bíceps
        'Martes': [2],          // Pierna
        'Miércoles': [6],       // Tríceps
        'Jueves': [1, 5],       // Pecho + Espalda
        'Viernes': [3],         // Hombro
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // Abs
    },
    9: {
        'Lunes': [3],           // Hombro
        'Martes': [2],          // Pierna
        'Miércoles': [4],       // Bíceps
        'Jueves': [6, 1],       // Tríceps + Pecho
        'Viernes': [5],         // Espalda
        'Sábado': [2],          // Pierna
        'Domingo': [7]          // Abs
    },
    10: {
        'Lunes': [5],           // Espalda
        'Martes': [2],          // Pierna
        'Miércoles': [3],       // Hombro
        'Jueves': [4, 6],       // Bíceps + Tríceps
        'Viernes': [1],         // Pecho
        'Sábado': [2],          // Pierna
        'Domingo': [8]          // Traps
    }
};
