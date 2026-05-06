const decodeTokenRole = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.role;
    } catch {
        return null;
    }
};

const getVendorToken = () => window.appApi?.getToken() || null;

const ensureVendorAccess = () => {
    const token = getVendorToken();
    if (!token || decodeTokenRole(token) !== 'vendor') {
        window.location.href = 'login.html?role=vendor';
        return false;
    }
    return true;
};

const renderVendorDress = (dress) => {
    return `<div class="vendor-dress-card card fade-in">
        <h4>${dress.title}</h4>
        <p>${dress.category || 'Uncategorized'} • $${Number(dress.price).toFixed(2)} / day</p>
        <p>${dress.description || 'No description available.'}</p>
    </div>`;
};

const renderVendorOrder = (order) => {
    return `<article class="order-card card fade-in">
        <div class="order-body">
            <h3>${order.title}</h3>
            <div class="order-details">
                <span>${order.customerName}</span>
                <span>${order.rental_date}</span>
            </div>
            <span class="status-badge status-${order.status}">${order.status}</span>
        </div>
    </article>`;
};

const renderDashboard = async () => {
    if (!ensureVendorAccess()) return;
    const dressCountEl = document.querySelector('.stats-grid article:nth-child(1) h2');
    const orderCountEl = document.querySelector('.stats-grid article:nth-child(2) h2');
    const ratingEl = document.querySelector('.stats-grid article:nth-child(3) h2');

    try {
        const dresses = await window.appApi.request('/vendors/dresses');
        const orders = await window.appApi.request('/vendors/orders');
        if (dresses.error || orders.error) {
            return;
        }
        if (dressCountEl) dressCountEl.textContent = dresses.length;
        if (orderCountEl) orderCountEl.textContent = orders.length;
        if (ratingEl) ratingEl.textContent = '4.9';
    } catch (error) {
        console.error(error);
    }
};

const renderManageDresses = async () => {
    if (!ensureVendorAccess()) return;
    const dressManager = document.getElementById('dressManager');
    const addDressBtn = document.getElementById('addDressBtn');
    if (!dressManager || !addDressBtn) return;

    const loadDresses = async () => {
        try {
            const dresses = await window.appApi.request('/vendors/dresses');
            if (dresses.error) {
                dressManager.innerHTML = `<p>${dresses.error}</p>`;
                return;
            }
            if (!dresses.length) {
                dressManager.innerHTML = '<p>No dresses yet. Add your first item.</p>';
                return;
            }
            dressManager.innerHTML = dresses.map(renderVendorDress).join('');
        } catch (error) {
            console.error(error);
            dressManager.innerHTML = '<p>Unable to load dresses.</p>';
        }
    };

    const showAddForm = () => {
        dressManager.innerHTML = `
            <form id="newDressForm" class="form-grid" style="max-width: 520px; margin-top: 16px;">
                <div class="form-group">
                    <label for="dressTitle">Dress title</label>
                    <input id="dressTitle" type="text" required />
                </div>
                <div class="form-group">
                    <label for="dressCategory">Category</label>
                    <input id="dressCategory" type="text" placeholder="Evening, Cocktail, Bridal" />
                </div>
                <div class="form-group">
                    <label for="dressPrice">Price per day</label>
                    <input id="dressPrice" type="number" min="1" required />
                </div>
                <div class="form-group">
                    <label for="dressImage">Image URL</label>
                    <input id="dressImage" type="url" placeholder="https://example.com/image.jpg" />
                </div>
                <div class="form-group">
                    <label for="dressDescription">Description</label>
                    <textarea id="dressDescription" rows="3"></textarea>
                </div>
                <button type="submit" class="btn">Save Dress</button>
                <button type="button" id="cancelDressBtn" class="btn-secondary">Cancel</button>
            </form>
        `;

        const newDressForm = document.getElementById('newDressForm');
        const cancelDressBtn = document.getElementById('cancelDressBtn');

        cancelDressBtn?.addEventListener('click', loadDresses);
        newDressForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const title = document.getElementById('dressTitle').value;
            const category = document.getElementById('dressCategory').value;
            const price = Number(document.getElementById('dressPrice').value);
            const image = document.getElementById('dressImage').value;
            const description = document.getElementById('dressDescription').value;

            try {
                const result = await window.appApi.request('/vendors/dresses', 'POST', { title, category, price, image, description });
                if (result.dressId) {
                    await loadDresses();
                    return;
                }
                alert(result.error || 'Failed to add dress');
            } catch (error) {
                console.error(error);
                alert('Failed to add dress');
            }
        });
    };

    addDressBtn.addEventListener('click', showAddForm);
    await loadDresses();
};

const renderVendorOrders = async () => {
    if (!ensureVendorAccess()) return;
    const vendorOrdersList = document.getElementById('vendorOrdersList');
    if (!vendorOrdersList) return;

    try {
        const orders = await window.appApi.request('/vendors/orders');
        if (orders.error) {
            vendorOrdersList.innerHTML = `<p>${orders.error}</p>`;
            return;
        }
        if (!orders.length) {
            vendorOrdersList.innerHTML = '<p>No vendor orders found yet.</p>';
            return;
        }
        vendorOrdersList.innerHTML = orders.map(renderVendorOrder).join('');
    } catch (error) {
        console.error(error);
        vendorOrdersList.innerHTML = '<p>Unable to load vendor orders.</p>';
    }
};

const initVendorPages = () => {
    const page = window.location.pathname.split('/').pop();
    if (!ensureVendorAccess()) return;

    if (page === 'vendor-dashboard.html') {
        renderDashboard();
    }
    if (page === 'manage-dresses.html') {
        renderManageDresses();
    }
    if (page === 'vendor-orders.html') {
        renderVendorOrders();
    }
};

document.addEventListener('DOMContentLoaded', initVendorPages);


