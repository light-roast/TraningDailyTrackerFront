// Admin page logic
// Constants are loaded from constants.js

let exercises = [];
let editingExerciseId = null;
let deleteExerciseId = null;

// Weekly Schedules management
let weeklySchedules = [];
let editingScheduleWeekNumber = null;
let deleteScheduleWeekNumber = null;

// DOM Elements
const exerciseForm = document.getElementById('exerciseForm');
const exerciseIdInput = document.getElementById('exerciseId');
const exerciseNameInput = document.getElementById('exerciseName');
const exerciseWeightInput = document.getElementById('exerciseWeight');
const exerciseMaxRepsInput = document.getElementById('exerciseMaxReps');
const exerciseMuscleInput = document.getElementById('exerciseMuscle');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnLoading = document.getElementById('submitBtnLoading');
const cancelBtn = document.getElementById('cancelBtn');
const exercisesTableBody = document.getElementById('exercisesTableBody');
const loadingIndicatorEl = document.getElementById('loadingIndicator');
const tableContainer = document.getElementById('tableContainer');
const successMessageEl = document.getElementById('successMessage');
const errorMessageEl = document.getElementById('errorMessage');
const deleteModal = document.getElementById('deleteModal');
const deleteBtnText = document.getElementById('deleteBtnText');
const deleteBtnLoading = document.getElementById('deleteBtnLoading');

// Weekly Schedule DOM Elements
const weeklyScheduleForm = document.getElementById('weeklyScheduleForm');
const scheduleIdInput = document.getElementById('scheduleId');
const scheduleWeekNumberInput = document.getElementById('scheduleWeekNumber');
const scheduleFormTitle = document.getElementById('scheduleFormTitle');
const submitScheduleBtn = document.getElementById('submitScheduleBtn');
const submitScheduleBtnText = document.getElementById('submitScheduleBtnText');
const submitScheduleBtnLoading = document.getElementById('submitScheduleBtnLoading');
const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');
const schedulesTableBody = document.getElementById('schedulesTableBody');
const scheduleLoadingIndicatorEl = document.getElementById('scheduleLoadingIndicator');
const scheduleTableContainer = document.getElementById('scheduleTableContainer');
const deleteScheduleModal = document.getElementById('deleteScheduleModal');
const deleteScheduleBtnText = document.getElementById('deleteScheduleBtnText');
const deleteScheduleBtnLoading = document.getElementById('deleteScheduleBtnLoading');
const scheduleInputsEl = document.getElementById('scheduleInputs');

/**
 * Check authentication on page load
 */
function checkAuth() {
    requireAuth();
}

/**
 * Initialize the page
 */
async function init() {
    checkAuth();
    initializeScheduleInputs();
    await Promise.all([
        loadExercises(),
        loadWeeklySchedules()
    ]);
}

/**
 * Load all exercises
 */
async function loadExercises() {
    showTableLoading();
    hideMessages();

    try {
        exercises = await getExercises();
        renderExercisesTable();
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError('Failed to load exercises. Please try again.');
        }
        console.error('Load exercises error:', error);
    } finally {
        hideTableLoading();
    }
}

/**
 * Render exercises table
 */
function renderExercisesTable() {
    exercisesTableBody.innerHTML = '';

    if (exercises.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                No exercises found. Add your first exercise above.
            </td>
        `;
        exercisesTableBody.appendChild(row);
        return;
    }

    exercises.forEach(exercise => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exercise.id}</td>
            <td>${exercise.name}</td>
            <td>${exercise.weight}</td>
            <td>${exercise.maxReps}</td>
            <td>${MUSCLE_GROUPS[exercise.muscleId]}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editExercise(${exercise.id})" class="btn btn-primary btn-small">
                        Edit
                    </button>
                    <button onclick="openDeleteModal(${exercise.id})" class="btn btn-danger btn-small">
                        Delete
                    </button>
                </div>
            </td>
        `;
        exercisesTableBody.appendChild(row);
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const formData = {
        name: exerciseNameInput.value.trim(),
        weight: parseFloat(exerciseWeightInput.value),
        maxReps: parseInt(exerciseMaxRepsInput.value),
        muscleId: parseInt(exerciseMuscleInput.value)
    };

    // Validate
    if (!formData.name || !formData.weight || !formData.maxReps || !formData.muscleId) {
        showError('Please fill in all required fields');
        return;
    }

    setFormLoading(true);
    hideMessages();

    try {
        if (editingExerciseId) {
            // Update existing exercise - include id in the data
            const updateData = {
                id: editingExerciseId,
                ...formData
            };
            await updateExercise(editingExerciseId, updateData);
            showSuccess('Exercise updated successfully!');
        } else {
            // Create new exercise
            await createExercise(formData);
            showSuccess('Exercise created successfully!');
        }

        // Reset form and reload data
        resetForm();
        await loadExercises();
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError(editingExerciseId ? 'Failed to update exercise' : 'Failed to create exercise');
        }
        console.error('Form submit error:', error);
    } finally {
        setFormLoading(false);
    }
}

/**
 * Edit exercise
 */
function editExercise(id) {
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) return;

    editingExerciseId = id;
    exerciseIdInput.value = id;
    exerciseNameInput.value = exercise.name;
    exerciseWeightInput.value = exercise.weight;
    exerciseMaxRepsInput.value = exercise.maxReps;
    exerciseMuscleInput.value = exercise.muscleId;

    formTitle.textContent = 'Edit Exercise';
    submitBtnText.textContent = 'Update Exercise';
    cancelBtn.classList.remove('hidden');

    // Scroll to form
    exerciseForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal(id) {
    deleteExerciseId = id;
    deleteModal.classList.remove('hidden');
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
    deleteExerciseId = null;
    deleteModal.classList.add('hidden');
}

/**
 * Confirm delete
 */
async function confirmDelete() {
    if (!deleteExerciseId) return;

    setDeleteLoading(true);

    try {
        await deleteExercise(deleteExerciseId);
        showSuccess('Exercise deleted successfully!');
        closeDeleteModal();
        await loadExercises();
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError('Failed to delete exercise');
        }
        console.error('Delete error:', error);
    } finally {
        setDeleteLoading(false);
    }
}

/**
 * Reset form to add mode
 */
function resetForm() {
    editingExerciseId = null;
    exerciseForm.reset();
    exerciseIdInput.value = '';
    formTitle.textContent = 'Add New Exercise';
    submitBtnText.textContent = 'Add Exercise';
    cancelBtn.classList.add('hidden');
}

/**
 * Set form loading state
 */
function setFormLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtnText.classList.add('hidden');
        submitBtnLoading.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitBtnText.classList.remove('hidden');
        submitBtnLoading.classList.add('hidden');
    }
}

/**
 * Set delete loading state
 */
function setDeleteLoading(isLoading) {
    const deleteBtn = deleteModal.querySelector('.btn-danger');
    if (isLoading) {
        deleteBtn.disabled = true;
        deleteBtnText.classList.add('hidden');
        deleteBtnLoading.classList.remove('hidden');
    } else {
        deleteBtn.disabled = false;
        deleteBtnText.classList.remove('hidden');
        deleteBtnLoading.classList.add('hidden');
    }
}

/**
 * Show table loading
 */
function showTableLoading() {
    loadingIndicatorEl.classList.remove('hidden');
    tableContainer.style.display = 'none';
}

/**
 * Hide table loading
 */
function hideTableLoading() {
    loadingIndicatorEl.classList.add('hidden');
    tableContainer.style.display = 'block';
}

/**
 * Show success message
 */
function showSuccess(message) {
    successMessageEl.textContent = message;
    successMessageEl.classList.remove('hidden');
    setTimeout(() => {
        successMessageEl.classList.add('hidden');
    }, 5000);
}

/**
 * Show error message
 */
function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.classList.remove('hidden');
    setTimeout(() => {
        errorMessageEl.classList.add('hidden');
    }, 5000);
}

/**
 * Hide all messages
 */
function hideMessages() {
    successMessageEl.classList.add('hidden');
    errorMessageEl.classList.add('hidden');
}

// Event listeners
exerciseForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);

// Weekly Schedule Event listeners
weeklyScheduleForm.addEventListener('submit', handleScheduleFormSubmit);
cancelScheduleBtn.addEventListener('click', resetScheduleForm);

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

deleteScheduleModal.addEventListener('click', (e) => {
    if (e.target === deleteScheduleModal) {
        closeDeleteScheduleModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// ========== WEEKLY SCHEDULE MANAGEMENT FUNCTIONS ==========

/**
 * Initialize schedule day inputs
 */
function initializeScheduleInputs() {
    scheduleInputsEl.innerHTML = '';
    
    DAYS_OF_WEEK.forEach(day => {
        const dayGroup = document.createElement('div');
        dayGroup.className = 'form-group';
        dayGroup.style.marginBottom = '1rem';
        
        const label = document.createElement('label');
        label.textContent = day;
        label.style.fontWeight = '500';
        label.style.marginBottom = '0.5rem';
        label.style.display = 'block';
        
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.flexWrap = 'wrap';
        checkboxContainer.style.gap = '1rem';
        
        Object.entries(MUSCLE_GROUPS).forEach(([id, name]) => {
            const checkboxWrapper = document.createElement('label');
            checkboxWrapper.style.display = 'flex';
            checkboxWrapper.style.alignItems = 'center';
            checkboxWrapper.style.cursor = 'pointer';
            checkboxWrapper.style.userSelect = 'none';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = id;
            checkbox.setAttribute('data-day', day);
            checkbox.style.marginRight = '0.5rem';
            
            const labelText = document.createElement('span');
            labelText.textContent = name;
            
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(labelText);
            checkboxContainer.appendChild(checkboxWrapper);
        });
        
        dayGroup.appendChild(label);
        dayGroup.appendChild(checkboxContainer);
        scheduleInputsEl.appendChild(dayGroup);
    });
}

/**
 * Load all weekly schedules
 */
async function loadWeeklySchedules() {
    showScheduleTableLoading();
    hideMessages();

    try {
        weeklySchedules = await getAllWeeklySchedules();
        renderSchedulesTable();
        
        // Set initial week number for new schedule
        const maxWeek = weeklySchedules.length > 0 
            ? Math.max(...weeklySchedules.map(s => s.weekNumber))
            : 0;
        const nextWeek = maxWeek + 1;
        scheduleWeekNumberInput.value = nextWeek;
        document.getElementById('displayWeekNumber').textContent = nextWeek;
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError('Failed to load weekly schedules. Please try again.');
        }
        console.error('Load schedules error:', error);
    } finally {
        hideScheduleTableLoading();
    }
}

/**
 * Render schedules table
 */
function renderSchedulesTable() {
    schedulesTableBody.innerHTML = '';

    if (weeklySchedules.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                No weekly schedules found. Add your first schedule above.
            </td>
        `;
        schedulesTableBody.appendChild(row);
        return;
    }

    // Sort by week number
    const sortedSchedules = [...weeklySchedules].sort((a, b) => a.weekNumber - b.weekNumber);

    sortedSchedules.forEach(schedule => {
        const row = document.createElement('tr');
        
        // Create summary of schedule
        const summary = Object.entries(schedule.schedule)
            .map(([day, muscleIds]) => {
                const muscles = muscleIds.map(id => MUSCLE_GROUPS[id]).join(', ');
                return `${day}: ${muscles || 'Rest'}`;
            })
            .join(' | ');
        
        row.innerHTML = `
            <td><strong>Week ${schedule.weekNumber}</strong></td>
            <td style="font-size: 0.9rem;">${summary}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editSchedule(${schedule.weekNumber})" class="btn btn-primary btn-small">
                        Edit
                    </button>
                    <button onclick="openDeleteScheduleModal(${schedule.weekNumber})" class="btn btn-danger btn-small">
                        Delete
                    </button>
                </div>
            </td>
        `;
        schedulesTableBody.appendChild(row);
    });
}

/**
 * Handle schedule form submission
 */
async function handleScheduleFormSubmit(e) {
    e.preventDefault();

    const weekNumber = parseInt(scheduleWeekNumberInput.value);
    
    if (!weekNumber || weekNumber < 1) {
        showError('Invalid week number');
        return;
    }

    // Build schedule object from checkboxes
    const schedule = {};
    DAYS_OF_WEEK.forEach(day => {
        const checkboxes = scheduleInputsEl.querySelectorAll(`input[type="checkbox"][data-day="${day}"]:checked`);
        schedule[day] = Array.from(checkboxes).map(cb => parseInt(cb.value));
    });

    const scheduleData = {
        weekNumber: weekNumber,
        schedule: schedule
    };

    setScheduleFormLoading(true);
    hideMessages();

    try {
        if (editingScheduleWeekNumber) {
            await updateWeeklySchedule(editingScheduleWeekNumber, scheduleData);
            showSuccess('Weekly schedule updated successfully!');
        } else {
            await createWeeklySchedule(scheduleData);
            showSuccess('Weekly schedule created successfully!');
        }

        resetScheduleForm();
        await loadWeeklySchedules();
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError(editingScheduleWeekNumber ? 'Failed to update schedule' : 'Failed to create schedule');
        }
        console.error('Schedule form submit error:', error);
    } finally {
        setScheduleFormLoading(false);
    }
}

/**
 * Edit schedule
 */
function editSchedule(weekNumber) {
    const schedule = weeklySchedules.find(s => s.weekNumber === weekNumber);
    if (!schedule) return;

    editingScheduleWeekNumber = weekNumber;
    scheduleWeekNumberInput.value = weekNumber;
    document.getElementById('displayWeekNumber').textContent = weekNumber;

    // Clear all checkboxes first
    const allCheckboxes = scheduleInputsEl.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(cb => cb.checked = false);

    // Set checkboxes based on schedule data
    Object.entries(schedule.schedule).forEach(([day, muscleIds]) => {
        muscleIds.forEach(muscleId => {
            const checkbox = scheduleInputsEl.querySelector(`input[type="checkbox"][data-day="${day}"][value="${muscleId}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    });

    scheduleFormTitle.textContent = 'Edit Weekly Schedule';
    submitScheduleBtnText.textContent = 'Update Schedule';
    cancelScheduleBtn.classList.remove('hidden');

    // Scroll to form
    weeklyScheduleForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Open delete schedule confirmation modal
 */
function openDeleteScheduleModal(weekNumber) {
    deleteScheduleWeekNumber = weekNumber;
    deleteScheduleModal.classList.remove('hidden');
}

/**
 * Close delete schedule confirmation modal
 */
function closeDeleteScheduleModal() {
    deleteScheduleWeekNumber = null;
    deleteScheduleModal.classList.add('hidden');
}

/**
 * Confirm delete schedule
 */
async function confirmDeleteSchedule() {
    if (!deleteScheduleWeekNumber) return;

    setDeleteScheduleLoading(true);

    try {
        await deleteWeeklySchedule(deleteScheduleWeekNumber);
        showSuccess('Weekly schedule deleted successfully!');
        closeDeleteScheduleModal();
        await loadWeeklySchedules();
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            showError('Session expired. Please login again.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showError('Failed to delete schedule');
        }
        console.error('Delete schedule error:', error);
    } finally {
        setDeleteScheduleLoading(false);
    }
}

/**
 * Reset schedule form to add mode
 */
function resetScheduleForm() {
    editingScheduleWeekNumber = null;
    weeklyScheduleForm.reset();
    
    // Calculate next week number
    const maxWeek = weeklySchedules.length > 0 
        ? Math.max(...weeklySchedules.map(s => s.weekNumber))
        : 0;
    const nextWeek = maxWeek + 1;
    
    scheduleWeekNumberInput.value = nextWeek;
    document.getElementById('displayWeekNumber').textContent = nextWeek;
    
    // Clear all checkboxes
    const allCheckboxes = scheduleInputsEl.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(cb => cb.checked = false);
    
    scheduleFormTitle.textContent = 'Add New Weekly Schedule';
    submitScheduleBtnText.textContent = 'Add Schedule';
    cancelScheduleBtn.classList.add('hidden');
}

/**
 * Set schedule form loading state
 */
function setScheduleFormLoading(isLoading) {
    if (isLoading) {
        submitScheduleBtn.disabled = true;
        submitScheduleBtnText.classList.add('hidden');
        submitScheduleBtnLoading.classList.remove('hidden');
    } else {
        submitScheduleBtn.disabled = false;
        submitScheduleBtnText.classList.remove('hidden');
        submitScheduleBtnLoading.classList.add('hidden');
    }
}

/**
 * Set delete schedule loading state
 */
function setDeleteScheduleLoading(isLoading) {
    const deleteBtn = deleteScheduleModal.querySelector('.btn-danger');
    if (isLoading) {
        deleteBtn.disabled = true;
        deleteScheduleBtnText.classList.add('hidden');
        deleteScheduleBtnLoading.classList.remove('hidden');
    } else {
        deleteBtn.disabled = false;
        deleteScheduleBtnText.classList.remove('hidden');
        deleteScheduleBtnLoading.classList.add('hidden');
    }
}

/**
 * Show schedule table loading
 */
function showScheduleTableLoading() {
    scheduleLoadingIndicatorEl.classList.remove('hidden');
    scheduleTableContainer.style.display = 'none';
}

/**
 * Hide schedule table loading
 */
function hideScheduleTableLoading() {
    scheduleLoadingIndicatorEl.classList.add('hidden');
    scheduleTableContainer.style.display = 'block';
}

