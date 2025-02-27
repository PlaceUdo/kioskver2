// menu-item.js에서 필요한 함수와 데이터 가져오기
import { menuData } from './menu-item.js';

// 장바구니 데이터
let basketItems = [];

// 현재 선택된 카테고리
let currentCategory = 'coffee';

// 현재 팝업에 표시된 메뉴 아이템과 수량
let currentMenuItem = null;
let currentQuantity = 1;
let selectedOptions = {
    temperature: 'hot',
    shot: 'normal',
    ice: 'normal',
    sweet: 'normal'
};

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
    
    // 팝업 이벤트 리스너 등록
    setupPopupListeners();
}

// 메뉴 아이템 표시 함수
function displayMenuItems(category) {
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
    menuItem.className = 'menu-item';
    menuItem.dataset.id = item.id;
    
    // 이미지 추가
    const img = document.createElement('img');
    img.src = item.image || 'placeholder.jpg'; // 이미지가 없을 경우 기본 이미지
    img.alt = item.name;
    menuItem.appendChild(img);
    
    // 메뉴 이름과 가격 추가
    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';
    itemInfo.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div class="item-price">₩ ${item.price.toLocaleString()}</div>
    `;
    menuItem.appendChild(itemInfo);
    
    // 메뉴 아이템 클릭 이벤트
    menuItem.addEventListener('click', () => {
        openPopup(item);
    });
    
    return menuItem;
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

// 팝업 이벤트 리스너 설정
function setupPopupListeners() {
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.querySelector('.close-popup');
    const decreaseQuantityButton = document.getElementById('decrease-quantity');
    const increaseQuantityButton = document.getElementById('increase-quantity');
    const addToCartButton = document.getElementById('add-to-cart');
    
    // 팝업 닫기 버튼
    closePopupButton.addEventListener('click', closePopup);
    
    // 수량 감소 버튼
    decreaseQuantityButton.addEventListener('click', decreaseQuantity);
    
    // 수량 증가 버튼
    increaseQuantityButton.addEventListener('click', increaseQuantity);
    
    // 장바구니 추가 버튼
    addToCartButton.addEventListener('click', addToCart);
    
    // 옵션 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
            const optionType = button.dataset.optionType;
            const optionValue = button.dataset.optionValue;
            
            // 같은 그룹의 모든 버튼에서 selected 클래스 제거
            document.querySelectorAll(`.option-button[data-option-type="${optionType}"]`)
                .forEach(btn => btn.classList.remove('selected'));
            
            // 클릭한 버튼에 selected 클래스 추가
            button.classList.add('selected');
            
            // 선택된 옵션 업데이트
            selectedOptions[optionType] = optionValue;
            
            // Ice 선택 시 얼음 옵션 활성화, Hot 선택 시 비활성화
            if (optionType === 'temperature') {
                const iceOptions = document.querySelectorAll('.option-button[data-option-type="ice"]');
                if (optionValue === 'hot') {
                    iceOptions.forEach(btn => {
                        btn.disabled = true;
                        btn.classList.add('disabled');
                    });
                    // Hot일 때는 얼음 옵션 기본으로 설정
                    document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
                    selectedOptions.ice = 'normal';
                } else {
                    iceOptions.forEach(btn => {
                        btn.disabled = false;
                        btn.classList.remove('disabled');
                    });
                }
            }
        });
    });
    
    // 팝업 외부 클릭 시 닫기
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}

// 장바구니에 아이템 추가 함수
function addToBasket(item, quantity = 1, options = {}) {
    // 옵션을 문자열로 변환하여 고유한 키 생성
    const optionsKey = JSON.stringify(options);
    
    // 이미 장바구니에 같은 아이템과 옵션이 있는지 확인
    const existingItemIndex = basketItems.findIndex(basketItem => 
        basketItem.id === item.id && JSON.stringify(basketItem.options) === optionsKey
    );
    
    if (existingItemIndex !== -1) {
        // 이미 같은 아이템과 옵션이 있으면 수량만 증가
        basketItems[existingItemIndex].quantity += quantity;
    } else {
        // 새로운 아이템 추가
        let optionText = '';
        
        if (options.temperature === 'ice') {
            optionText += 'Ice, ';
        } else {
            optionText += 'Hot, ';
        }
        
        if (options.shot === 'extra') {
            optionText += '샷추가, ';
        }
        
        if (options.temperature === 'ice' && options.ice === 'half') {
            optionText += '얼음 절반, ';
        }
        
        if (options.sweet === 'less') {
            optionText += '덜 달게, ';
        }
        
        // 마지막 쉼표와 공백 제거
        if (optionText.length > 0) {
            optionText = optionText.slice(0, -2);
        }
        
        basketItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            options: options,
            optionText: optionText
        });
    }
    
    updateBasket();
}

// 장바구니 업데이트 함수
function updateBasket() {
    const basketItemsElement = document.getElementById('basket-items');
    basketItemsElement.innerHTML = '';
    
    basketItems.forEach((item, index) => {
        const basketItem = document.createElement('div');
        basketItem.className = 'basket-item';
        
        let itemName = item.name;
        if (item.optionText) {
            itemName += `<div class="item-options">(${item.optionText})</div>`;
        }
        
        basketItem.innerHTML = `
            <div class="item-name">${itemName} x ${item.quantity}</div>
            <div class="item-price">${(item.price * item.quantity).toLocaleString()}원</div>
            <button class="remove-item" data-index="${index}">X</button>
        `;
        basketItemsElement.appendChild(basketItem);
    });
    
    // 장바구니에서 아이템 제거 이벤트 추가
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            basketItems.splice(index, 1);
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

// 팝업 열기 함수
function openPopup(item) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const popupDescription = document.getElementById('popup-description');
    const popupPrice = document.getElementById('popup-price');
    const quantitySpan = document.getElementById('quantity');
    
    // 현재 메뉴 아이템 설정
    currentMenuItem = item;
    currentQuantity = 1;
    
    // 옵션 초기화
    resetOptions();
    
    // 팝업 정보 업데이트
    popupTitle.textContent = item.name;
    popupImage.src = item.image || 'placeholder.jpg';
    popupImage.alt = item.name;
    popupDescription.textContent = item.description || '메뉴 설명이 없습니다.';
    popupPrice.textContent = `₩ ${item.price.toLocaleString()}`;
    quantitySpan.textContent = currentQuantity;
    
    // 메뉴 종류에 따라 옵션 표시/숨김 처리
    const isNonCoffee = currentCategory === 'non-coffee';
    const isDessert = currentCategory === 'dessert';
    
    const optionGroups = document.querySelectorAll('.option-group');
    optionGroups.forEach(group => {
        const optionType = group.querySelector('.option-button').dataset.optionType;
        
        // 디저트는 모든 옵션 숨김
        if (isDessert) {
            group.style.display = 'none';
        } 
        // 논커피는 샷 옵션 숨김
        else if (isNonCoffee && optionType === 'shot') {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
    
    // 팝업 표시
    popupOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 옵션 초기화 함수
function resetOptions() {
    selectedOptions = {
        temperature: 'hot',
        shot: 'normal',
        ice: 'normal',
        sweet: 'normal'
    };
    
    // 모든 옵션 버튼에서 selected 클래스 제거
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
        button.disabled = false;
        button.classList.remove('disabled');
    });
    
    // 기본 옵션 버튼에 selected 클래스 추가
    document.querySelectorAll('.option-button[data-option-value="hot"], .option-button[data-option-value="normal"]').forEach(button => {
        button.classList.add('selected');
    });
    
    // Hot 선택 시 얼음 옵션 비활성화
    document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
    });
}

// 팝업 닫기 함수
function closePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    
    popupOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 다시 활성화
    currentMenuItem = null;
}

// 수량 감소 함수
function decreaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    
    if (currentQuantity > 1) {
        currentQuantity--;
        quantitySpan.textContent = currentQuantity;
    }
}

// 수량 증가 함수
function increaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
}

// 장바구니에 추가 함수 (팝업에서 호출)
function addToCart() {
    if (currentMenuItem) {
        // 현재 선택된 옵션으로 장바구니에 추가
        addToBasket(currentMenuItem, currentQuantity, { ...selectedOptions });
        closePopup();
    }
}