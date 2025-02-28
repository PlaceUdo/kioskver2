import { menuData } from './menu-item.js';
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menu-grid');
    const language = localStorage.getItem('language') || 'ko';
    const currentTranslations = translations[language];

    function createMenuGrid(category) {
        menuGrid.innerHTML = ''; // Clear existing items
        const categoryItems = menuData[category];

        categoryItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.className = 'menu-item';
            menuItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <div class="item-name">${currentTranslations[item.name] || item.name}</div>
                    <div class="item-price">₩ ${item.price.toLocaleString()}</div>
                </div>
            `;
            menuItemDiv.addEventListener('click', () => openPopup(item, currentTranslations[item.name]));
            menuGrid.appendChild(menuItemDiv);
        });
    }

    // Set initial category
    const categoryItems = document.querySelectorAll('.category-items li');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            categoryItems.forEach(el => el.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            // Create menu grid for selected category
            createMenuGrid(item.dataset.category);
        });
    });

    // Initialize with first category
    createMenuGrid('coffee');
});