// Admin page logic

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

let exercises = [];
let editingExerciseId = null;
let deleteExerciseId = null;

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
    await loadExercises();
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

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
