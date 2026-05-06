const renderOrderCard = (order) => {
    return `
        <article class="order-card card fade-in">
            <div class="order-body">
                <h3>${order.dressTitle}</h3>
                <div class="order-details">
                    <span>${order.rental_date}</span>
                    <span>${order.duration_days} days</span>
                    <span>$${Number(order.totalAmount).toFixed(2)} total</span>
                </div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
        </article>
    `;
};

document.addEventListener('DOMContentLoaded', async () => {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    try {
        const orders = await window.appApi.request('/rentals');
        if (!orders || orders.error) {
            ordersList.innerHTML = `<p>${orders?.error || 'Unable to load your orders.'}</p>`;
            return;
        }
        if (!orders.length) {
            ordersList.innerHTML = '<p>You have no rentals yet. Start browsing for your next dress.</p>';
            return;
        }
        ordersList.innerHTML = orders.map(renderOrderCard).join('');
    } catch (error) {
        console.error(error);
        ordersList.innerHTML = '<p>Unable to load your orders. Please refresh or sign in again.</p>';
    }
});


