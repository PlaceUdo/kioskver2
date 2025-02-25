// menu-item.js에서 필요한 함수와 데이터 가져오기
import { menuData, createMenuItem } from './menu-item.js';

// 장바구니 데이터
let basketItems = [];

// 현재 선택된 카테고리
let currentCategory = 'coffee';

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 앱 초기화 함수
function initializeApp() {
    // 초기 메뉴 표시
    displayMenuItems(currentCategory);
    
    // 카테고리 이벤트 리스너 등록
    setupCategoryListeners();
    
    // 버튼 이벤트 리스너 등록
    setupButtonListeners();
}

// 메뉴 아이템 표시 함수
function displayMenuItems(category) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; // 기존 메뉴 아이템 삭제

    menuData[category].forEach(item => {
        const menuItem = createMenuItem(item, addToBasket);
        menuGrid.appendChild(menuItem);
    });
}

// 카테고리 이벤트 리스너 설정
function setupCategoryListeners() {
    document.querySelectorAll('.category-items li').forEach(li => {
        li.addEventListener('click', () => {
            // 활성 카테고리 스타일 변경
            document.querySelector('.category-items li.active')?.classList.remove('active');
            li.classList.add('active');
            
            // 선택된 카테고리 메뉴 표시
            currentCategory = li.dataset.category;
            displayMenuItems(currentCategory);
        });
    });
}

// 버튼 이벤트 리스너 설정
function setupButtonListeners() {
    // 주문 완료 버튼 이벤트 리스너
    document.querySelector('.order-complete-button').addEventListener('click', () => {
        if (basketItems.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        
        alert('주문이 완료되었습니다!');
        basketItems = [];
        updateBasket();
    });

    // 메인 화면 버튼 이벤트 리스너
    document.querySelector('.main-page-button').addEventListener('click', () => {
        if (confirm('메인 화면으로 이동하시겠습니까?')) {
            window.location.href = 'index.html';
        }
    });
}

// 장바구니에 추가 함수
function addToBasket(item) {
    // 이미 장바구니에 있는지 확인
    const existingItem = basketItems.find(basketItem => basketItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        basketItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateBasket();
}

// 장바구니 업데이트 함수
function updateBasket() {
    const basketItemsElement = document.getElementById('basket-items');
    basketItemsElement.innerHTML = '';
    
    basketItems.forEach(item => {
        const basketItem = document.createElement('div');
        basketItem.className = 'basket-item';
        basketItem.innerHTML = `
            <div class="item-name">${item.name} x ${item.quantity}</div>
            <div class="item-price">${(item.price * item.quantity).toLocaleString()}원</div>
            <button class="remove-item" data-id="${item.id}">X</button>
        `;
        basketItemsElement.appendChild(basketItem);
    });
    
    // 장바구니에서 아이템 제거 이벤트 추가
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            basketItems = basketItems.filter(item => item.id !== id);
            updateBasket();
        });
    });
    
    // 총액 계산
    let total = 0;
    basketItems.forEach(item => {
        total += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = `총액: ₩ ${total.toLocaleString()}`;
}