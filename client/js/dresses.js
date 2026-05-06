const placeholderImage = 'assets/images/placeholder.svg';

const sampleDresses = [
    {
        id: 1,
        title: 'Velvet Evening Dress',
        price: 65,
        category: 'Evening',
        image: 'https://www.mydressline.com/cdn/shop/files/Nicoletta-NC1086BLACK_1_1800x1800.jpg?v=1708722148',
        description: 'A luxurious velvet dress designed for gala evenings and elegant events.',
    },
    {
        id: 2,
        title: 'Floral Cocktail Dress',
        price: 45,
        category: 'Cocktail',
        image: 'https://sassafras.in/cdn/shop/files/SFDRSS12303-1_86cc63d4-a87c-4032-9c18-82f4d866b32c_1800x.jpg?v=1757493634',
        description: 'Bright and modern, perfect for parties and date nights.',
    },
    {
        id: 3,
        title: 'Wedding Outfit',
        price: 120,
        category: 'Wedding',
        image: 'https://cdn0.weddingwire.in/article/7578/original/1280/jpg/128757-tarun-tahiliani.jpeg',
        description: 'Classic and modern styles designed for the perfect groom look.',
    },
    {
        id: 4,
        title: 'Couture Mini Dress',
        price: 55,
        category: 'Party',
        image: 'https://www.luxecouture.co.uk/cdn/shop/files/ROSA_1.jpg?v=1746177022&width=2688',
        description: 'A bold statement dress with a flattering tailored shape.',
    },
];

const renderDressCard = (dress) => {
    return `
        <article class="product-card card fade-in">
            <img src="${dress.image}" alt="${dress.title}" onerror="this.onerror=null;this.src='${placeholderImage}'" />
            <div class="product-body">
                <h3>${dress.title}</h3>
                <p class="product-info">${dress.category} • $${dress.price} / day</p>
                <a href="details.html?id=${dress.id}" class="btn">View Details</a>
            </div>
        </article>
    `;
};

const loadBrowse = async () => {
    const dressList = document.getElementById('dressList');
    const searchQuery = document.getElementById('searchQuery');
    const categorySelect = document.getElementById('categorySelect');
    const priceRange = document.getElementById('priceRange');
    const applyFilters = document.getElementById('applyFilters');

    if (!dressList) return;

    const render = () => {
        const query = searchQuery?.value.toLowerCase() || '';
        const category = categorySelect?.value || 'all';
        const maxPrice = Number(priceRange?.value || 1000);

        const filtered = sampleDresses.filter((dress) => {
            const matchesQuery = dress.title.toLowerCase().includes(query) || dress.description.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || dress.category === category;
            const matchesPrice = dress.price <= maxPrice;
            return matchesQuery && matchesCategory && matchesPrice;
        });

        dressList.innerHTML = filtered.map(renderDressCard).join('') || '<p>No dresses match your filters.</p>';
    };

    applyFilters?.addEventListener('click', render);
    render();
};

const loadDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id')) || 1;
    const dress = sampleDresses.find((item) => item.id === id) || sampleDresses[0];

    const title = document.getElementById('dressTitle');
    const description = document.getElementById('dressDescription');
    const price = document.getElementById('dressPrice');
    const category = document.getElementById('dressCategory');
    const features = document.getElementById('dressFeatures');
    const image = document.getElementById('dressImage');
    const rentButton = document.getElementById('rentButton');

    if (title) title.textContent = dress.title;
    if (description) description.textContent = dress.description;
    if (price) price.textContent = `$${dress.price}`;
    if (category) category.textContent = dress.category;
    if (image) image.src = dress.image;
    if (rentButton) rentButton.href = `booking.html?dressId=${dress.id}`;

    if (features) {
        features.innerHTML = `
            <li>Luxury fabric finish</li>
            <li>Expert tailoring</li>
            <li>Free doorstep delivery</li>
            <li>Available for same-week rental</li>
        `;
    }
};

const initDressPages = () => {
    if (document.getElementById('dressList')) loadBrowse();
    if (document.getElementById('dressDetails')) loadDetails();
};

document.addEventListener('DOMContentLoaded', initDressPages);


