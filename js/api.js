// API Base URL
const API_BASE_URL = 'http://localhost:5269/api';

// Get authentication token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Authentication API
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/Account/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        // Response is a plain string token, not JSON
        const token = await response.text();
        return token;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Exercise APIs
async function getExercises() {
    try {
        const response = await fetch(`${API_BASE_URL}/Exercise`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exercises');
        }

        return await response.json();
    } catch (error) {
        console.error('Get exercises error:', error);
        throw error;
    }
}

async function getExercise(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Exercise/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Get exercise error:', error);
        throw error;
    }
}

async function getExercisesByMuscle(muscleId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Exercise/muscle/${muscleId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exercises by muscle');
        }

        return await response.json();
    } catch (error) {
        console.error('Get exercises by muscle error:', error);
        throw error;
    }
}

async function createExercise(exercise) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/Exercise`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exercise)
        });

        if (response.status === 401) {
            throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
            throw new Error('Failed to create exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Create exercise error:', error);
        throw error;
    }
}

async function updateExercise(id, exercise) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/Exercise/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exercise)
        });

        if (response.status === 401) {
            throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
            throw new Error('Failed to update exercise');
        }

        // Handle both JSON response and 204 No Content
        if (response.status === 204) {
            return true;
        }

        return await response.json();
    } catch (error) {
        console.error('Update exercise error:', error);
        throw error;
    }
}

async function deleteExercise(id) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/Exercise/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
            throw new Error('Failed to delete exercise');
        }

        return true;
    } catch (error) {
        console.error('Delete exercise error:', error);
        throw error;
    }
}

// Weekly Cycle APIs
async function getWeeklyCycle() {
    try {
        const response = await fetch(`${API_BASE_URL}/WeeklyCycle`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weekly cycle');
        }

        return await response.json();
    } catch (error) {
        console.error('Get weekly cycle error:', error);
        throw error;
    }
}

async function nextWeek() {
    try {
        const response = await fetch(`${API_BASE_URL}/WeeklyCycle/next`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to advance week');
        }

        // Returns 204 No Content
        return true;
    } catch (error) {
        console.error('Next week error:', error);
        throw error;
    }
}

async function previousWeek() {
    try {
        const response = await fetch(`${API_BASE_URL}/WeeklyCycle/back`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to go back week');
        }

        // Returns 204 No Content
        return true;
    } catch (error) {
        console.error('Previous week error:', error);
        throw error;
    }
}
