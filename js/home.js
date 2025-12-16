// Home page logic

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

let currentWeek = 1;
let allExercises = [];

// DOM Elements
const weeklyScheduleEl = document.getElementById('weeklySchedule');
const currentWeekEl = document.getElementById('currentWeek');
const loadingIndicatorEl = document.getElementById('loadingIndicator');
const errorMessageEl = document.getElementById('errorMessage');
const prevWeekBtn = document.getElementById('prevWeekBtn');
const nextWeekBtn = document.getElementById('nextWeekBtn');

/**
 * Initialize the page
 */
async function init() {
    showLoading();
    hideError();

    try {
        // Fetch current week and exercises
        await Promise.all([
            loadWeeklyCycle(),
            loadExercises()
        ]);

        // Render the schedule
        renderWeeklySchedule();
    } catch (error) {
        showError('Failed to load data. Please try again later.');
        console.error('Initialization error:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Load current weekly cycle
 */
async function loadWeeklyCycle() {
    try {
        const cycle = await getWeeklyCycle();
        currentWeek = cycle.weekNumber;
        updateWeekDisplay();
    } catch (error) {
        console.error('Error loading weekly cycle:', error);
        throw error;
    }
}

/**
 * Load all exercises
 */
async function loadExercises() {

    try {
        allExercises = await getExercises();
    } catch (error) {
        console.error('Error loading exercises:', error);
        throw error;
    }
}

/**
 * Update week display
 */
function updateWeekDisplay() {
    currentWeekEl.textContent = currentWeek;
}

/**
 * Render the weekly schedule
 */
function renderWeeklySchedule() {
    weeklyScheduleEl.innerHTML = '';

    // Get the schedule for the current week
    const weekSchedule = WEEKLY_SCHEDULES[currentWeek] || WEEKLY_SCHEDULES[1];

    DAYS_OF_WEEK.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        // Day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        dayCard.appendChild(dayHeader);

        // Get muscle groups for this day based on current week
        const muscleGroupIds = weekSchedule[day] || [];

        if (muscleGroupIds.length === 0) {
            const noExercises = document.createElement('p');
            noExercises.className = 'no-exercises';
            noExercises.textContent = 'Rest day';
            dayCard.appendChild(noExercises);
        } else {
            // Group exercises by muscle group
            muscleGroupIds.forEach(muscleId => {
                const muscleExercises = allExercises.filter(ex => ex.muscleId === muscleId);

                if (muscleExercises.length > 0) {
                    const muscleGroup = document.createElement('div');
                    muscleGroup.className = 'muscle-group';

                    // Muscle group title
                    const muscleTitle = document.createElement('div');
                    muscleTitle.className = 'muscle-group-title';
                    muscleTitle.textContent = MUSCLE_GROUPS[muscleId];
                    muscleGroup.appendChild(muscleTitle);

                    // Exercises
                    muscleExercises.forEach(exercise => {
                        const exerciseItem = createExerciseElement(exercise);
                        muscleGroup.appendChild(exerciseItem);
                    });

                    dayCard.appendChild(muscleGroup);
                } else {
                    const muscleGroup = document.createElement('div');
                    muscleGroup.className = 'muscle-group';

                    const muscleTitle = document.createElement('div');
                    muscleTitle.className = 'muscle-group-title';
                    muscleTitle.textContent = MUSCLE_GROUPS[muscleId];
                    muscleGroup.appendChild(muscleTitle);

                    const noExercises = document.createElement('p');
                    noExercises.className = 'no-exercises';
                    noExercises.textContent = 'No exercises added yet';
                    muscleGroup.appendChild(noExercises);

                    dayCard.appendChild(muscleGroup);
                }
            });
        }

        weeklyScheduleEl.appendChild(dayCard);
    });
}

/**
 * Create exercise element
 */
function createExerciseElement(exercise) {
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';

    const exerciseName = document.createElement('div');
    exerciseName.className = 'exercise-name';
    exerciseName.textContent = exercise.name;

    const exerciseDetails = document.createElement('div');
    exerciseDetails.className = 'exercise-details';
    exerciseDetails.innerHTML = `
        Weight: ${exercise.weight} kg | Max Reps: ${exercise.maxReps}
    `;

    exerciseItem.appendChild(exerciseName);
    exerciseItem.appendChild(exerciseDetails);

    return exerciseItem;
}

/**
 * Navigate to next week
 */
async function goToNextWeek() {
    prevWeekBtn.disabled = true;
    nextWeekBtn.disabled = true;

    try {
        await nextWeek();
        await loadWeeklyCycle();
        renderWeeklySchedule();
        showSuccess('Moved to next week');
    } catch (error) {
        showError('Failed to advance week. Please try again.');
        console.error('Next week error:', error);
    } finally {
        prevWeekBtn.disabled = false;
        nextWeekBtn.disabled = false;
    }
}

/**
 * Navigate to previous week
 */
async function goToPreviousWeek() {
    prevWeekBtn.disabled = true;
    nextWeekBtn.disabled = true;

    try {
        await previousWeek();
        await loadWeeklyCycle();
        renderWeeklySchedule();
        showSuccess('Moved to previous week');
    } catch (error) {
        showError('Failed to go back week. Please try again.');
        console.error('Previous week error:', error);
    } finally {
        prevWeekBtn.disabled = false;
        nextWeekBtn.disabled = false;
    }
}

/**
 * Show loading indicator
 */
function showLoading() {
    loadingIndicatorEl.classList.remove('hidden');
    weeklyScheduleEl.style.display = 'none';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    loadingIndicatorEl.classList.add('hidden');
    weeklyScheduleEl.style.display = 'grid';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    errorMessageEl.classList.add('hidden');
}

/**
 * Show success message
 */
function showSuccess(message) {
    // Create success message element
    const successMsg = document.createElement('div');
    successMsg.className = 'message message-success';
    successMsg.textContent = message;
    
    // Insert at top of main content
    const main = document.querySelector('main.container');
    main.insertBefore(successMsg, main.firstChild);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Event listeners
prevWeekBtn.addEventListener('click', goToPreviousWeek);
nextWeekBtn.addEventListener('click', goToNextWeek);

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
