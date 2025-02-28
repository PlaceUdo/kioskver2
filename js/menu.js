// menu.js - 메뉴 관련 기능
console.log('메뉴 데이터:', menuData);
import { currentLanguage, currentCategory, translations, menuData } from './main.js';
import { openPopup } from './popup.js';

// 메뉴 아이템 표시 함수
export function displayMenuItems(category) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; // 기존 메뉴 아이템 삭제

    menuData[category].forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// 메뉴 아이템 생성 함수
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item.html';
    menuItem.dataset.id = item.id;

    // 이미지 추가
    const img = document.createElement('img');
    img.src = item.image || 'placeholder.jpg'; // 이미지가 없을 경우 기본 이미지
    img.alt = item.name;
    menuItem.appendChild(img);

    // 메뉴 이름과 가격 번역
    let translatedName = item.name;
    if (translations[currentLanguage] && translations[currentLanguage][item.name]) {
        translatedName = translations[currentLanguage][item.name];
    }

    // 메뉴 이름과 가격 추가
    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';
    itemInfo.innerHTML = `
        <div class="item-name">${translatedName}</div>
        <div class="item-price">₩ ${item.price.toLocaleString()}</div>
    `;
    menuItem.appendChild(itemInfo);

    // 메뉴 아이템 클릭 이벤트
    menuItem.addEventListener('click', () => {
        openPopup(item, translatedName);
    });

    return menuItem;
}

// 카테고리 이벤트 리스너 설정
export function setupCategoryListeners() {
    document.querySelectorAll('.category-items li').forEach(li => {
        li.addEventListener('click', () => {
            // 활성 카테고리 스타일 변경
            document.querySelector('.category-items li.active')?.classList.remove('active');
            li.classList.add('active');

            // 선택된 카테고리 메뉴 표시
            window.currentCategory = li.dataset.category;
            displayMenuItems(window.currentCategory);
        });
    });
}
