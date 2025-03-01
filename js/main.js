import { menuData } from './menu-item.js';
import { translations } from './translations.js';

let currentLanguage = localStorage.getItem('language') || 'ko';
let currentCategory = 'coffee';
let basketItems = [];

document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menu-grid');
    const currentTranslations = translations[currentLanguage];

    function createMenuGrid(category) {
        menuGrid.innerHTML = '';
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
            menuItemDiv.addEventListener('click', () => console.log('Menu item clicked', item));
            menuGrid.appendChild(menuItemDiv);
        });
    }

    const categoryItems = document.querySelectorAll('.category-items li');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            createMenuGrid(item.dataset.category);
        });
    });

    // 초기 카테고리 로드
    createMenuGrid('coffee');
});

export { currentLanguage, currentCategory, basketItems, translations, menuData };
