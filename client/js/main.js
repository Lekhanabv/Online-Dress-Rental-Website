const apiBase = 'http://localhost:5000/api';

const navLinks = document.querySelectorAll('.nav-links a');
const activePage = window.location.pathname.split('/').pop();
navLinks.forEach((link) => {
    if (link.getAttribute('href') === activePage) {
        link.classList.add('active-link');
    }
});

const getToken = () => localStorage.getItem('jwtToken');
const setToken = (token) => localStorage.setItem('jwtToken', token);

const decodeTokenRole = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.role;
    } catch (error) {
        return null;
    }
};

const request = async (path, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${apiBase}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    return response.json();
};

document.addEventListener('DOMContentLoaded', () => {
    const heroCards = document.querySelectorAll('.hero-card, .product-card, .category-card, .stat-card, .order-card');
    heroCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.08}s`;
    });
});

window.appApi = { getToken, setToken, request };


