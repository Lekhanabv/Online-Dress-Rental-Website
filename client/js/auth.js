const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

window.appApi = window.appApi || {
    getToken: () => null,
    setToken: () => {},
    request: async () => {
        throw new Error('API helper not initialized');
    },
};

const decodeTokenRole = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.role;
    } catch (error) {
        return null;
    }
};

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const role = document.getElementById('loginRole').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (!window.appApi?.request) {
                alert('Login failed: client API helper is not initialized. Please refresh the page.');
                return;
            }
            const data = await window.appApi.request('/auth/login', 'POST', { email, password });
            if (data.token) {
                const actualRole = decodeTokenRole(data.token);
                if (role !== actualRole) {
                    alert(`Logged in as ${actualRole}. Please choose the correct account type.`);
                    return;
                }
                window.appApi.setToken(data.token);
                window.location.href = actualRole === 'vendor' ? 'vendor-dashboard.html' : 'browse.html';
                return;
            }
            alert(data.error || 'Login failed');
        } catch (error) {
            console.error(error);
            alert('Login failed. Please try again.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const role = document.getElementById('registerRole').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (!window.appApi?.request) {
                alert('Registration failed: client API helper is not initialized. Please refresh the page.');
                return;
            }
            const data = await window.appApi.request('/auth/register', 'POST', { name, email, password, role });
            if (data.token) {
                window.appApi.setToken(data.token);
                window.location.href = role === 'vendor' ? 'vendor-dashboard.html' : 'browse.html';
                return;
            }
            alert(data.error || 'Registration failed');
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    });
}


