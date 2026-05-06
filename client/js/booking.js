const bookingForm = document.getElementById('bookingForm');
const paymentForm = document.getElementById('paymentForm');
const selectedDressEl = document.getElementById('selectedDress');
const bookingPriceEl = document.getElementById('bookingPrice');
const bookingTotalEl = document.getElementById('bookingTotal');

const sampleDressMap = {
    1: { title: 'Velvet Evening Dress', price: 65 },
    2: { title: 'Floral Cocktail Dress', price: 45 },
    3: { title: 'Bridal Luxe', price: 120 },
    4: { title: 'Couture Mini Dress', price: 55 },
};

const getSelectedDressId = () => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('dressId')) || 1;
};

const updateBookingSummary = () => {
    const duration = Number(document.getElementById('duration')?.value || 1);
    const dress = sampleDressMap[getSelectedDressId()] || sampleDressMap[1];
    const total = duration * dress.price;
    if (bookingPriceEl) bookingPriceEl.textContent = `$${dress.price}`;
    if (bookingTotalEl) bookingTotalEl.textContent = `$${total}`;
};

if (selectedDressEl) {
    const dress = sampleDressMap[getSelectedDressId()] || sampleDressMap[1];
    selectedDressEl.textContent = `Selected dress: ${dress.title}`;
}

if (bookingForm) {
    updateBookingSummary();
    document.getElementById('duration')?.addEventListener('input', updateBookingSummary);
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!window.appApi?.request) {
            alert('Booking failed: client API helper is not initialized. Please refresh the page or use the served frontend.');
            return;
        }

        const date = document.getElementById('date').value;
        const duration = Number(document.getElementById('duration').value);
        const dressId = getSelectedDressId();
        const dress = sampleDressMap[dressId] || sampleDressMap[1];
        const total = duration * dress.price;
        const booking = { dressId, rentalDate: date, durationDays: duration };
        console.log('Book dress', booking);
        try {
            const data = await window.appApi.request('/rentals', 'POST', booking);
            if (data.rentalId) {
                const paymentInfo = { rentalId: data.rentalId, dressId, amount: total };
                localStorage.setItem('outfitvault_payment', JSON.stringify(paymentInfo));
                window.location.href = `payment.html?rentalId=${data.rentalId}&dressId=${dressId}&amount=${total}`;
                return;
            }
            alert(data.error || 'Booking failed');
        } catch (error) {
            console.error(error);
            alert('Booking failed.');
        }
    });
}

if (paymentForm) {
    const storedPayment = JSON.parse(localStorage.getItem('outfitvault_payment') || 'null');
    const params = new URLSearchParams(window.location.search);
    const rentalId = Number(params.get('rentalId')) || storedPayment?.rentalId || null;
    const dressId = Number(params.get('dressId')) || storedPayment?.dressId || 1;
    const amount = Number(params.get('amount')) || storedPayment?.amount || Number(document.getElementById('paymentAmount')?.textContent.replace('$', '') || 0);

    const dress = sampleDressMap[dressId] || sampleDressMap[1];
    const paymentDress = document.getElementById('paymentDress');
    const paymentAmountEl = document.getElementById('paymentAmount');
    if (paymentDress) paymentDress.textContent = dress.title;
    if (paymentAmountEl) paymentAmountEl.textContent = `$${amount}`;

    if (!rentalId) {
        alert('Unable to process payment because the booking information is missing. Please start over.');
        window.location.href = 'browse.html';
        return;
    }

    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        if (!cardName || !cardNumber) {
            alert('Please fill payment details.');
            return;
        }
        try {
            const data = await window.appApi.request('/payments', 'POST', { rentalId, amount, paymentMethod: 'card' });
            if (data.message) {
                localStorage.removeItem('outfitvault_payment');
                alert('Payment completed successfully');
                window.location.href = 'orders.html';
                return;
            }
            alert(data.error || 'Payment failed');
        } catch (error) {
            console.error(error);
            alert('Payment failed.');
        }
    });
}


