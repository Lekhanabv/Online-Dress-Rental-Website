const adminPanels = [
    { label: 'Total rentals', value: '842' },
    { label: 'Monthly revenue', value: '$42,100' },
    { label: 'Active vendors', value: '315' },
];

document.addEventListener('DOMContentLoaded', () => {
    const adminControls = document.getElementById('adminControls');
    if (!adminControls) return;
    adminControls.innerHTML = adminPanels.map((item) => `
        <article class="stat-card card fade-in">
            <div class="panel-body">
                <h2>${item.value}</h2>
                <p>${item.label}</p>
            </div>
        </article>
    `).join('');
});


