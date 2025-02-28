// basket.js - 장바구니 관련 기능
import { basketItems, currentLanguage, translations } from './main.js';

// 장바구니에 아이템 추가 함수
export function addToBasket(item, quantity = 1, options = {}, translatedName) {
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

        // 옵션 번역
        if (options.temperature === 'ice') {
            optionText += translations[currentLanguage]["Ice"] || "Ice";
            optionText += ', ';
        } else {
            optionText += translations[currentLanguage]["Hot"] || "Hot";
            optionText += ', ';
        }

        if (options.shot === 'extra') {
            optionText += translations[currentLanguage]["샷 추가"] || "샷 추가";
            optionText += ', ';
        }

        if (options.temperature === 'ice' && options.ice === 'half') {
            optionText += translations[currentLanguage]["얼음 절반"] || "얼음 절반";
            optionText += ', ';
        }

        if (options.sweet === 'less') {
            optionText += translations[currentLanguage]["덜 달게"] || "덜 달게";
            optionText += ', ';
        }

        // 마지막 쉼표와 공백 제거
        if (optionText.length > 0) {
            optionText = optionText.slice(0, -2);
        }

        basketItems.push({
            id: item.id,
            name: item.name,
            translatedName: translatedName || item.name,
            price: item.price,
            quantity: quantity,
            options: options,
            optionText: optionText
        });
    }

    updateBasket();
}

// 장바구니 업데이트 함수
export function updateBasket() {
    const basketItemsElement = document.getElementById('basket-items');
    basketItemsElement.innerHTML = '';

    basketItems.forEach((item, index) => {
        const basketItem = document.createElement('div');
        basketItem.className = 'basket-item';
        
        // 온도에 따라 클래스 추가
        if (item.options.temperature === 'hot') {
            basketItem.classList.add('hot-item');
        } else if (item.options.temperature === 'ice') {
            basketItem.classList.add('ice-item');
        }

        let itemName = item.translatedName || item.name;
        if (item.optionText) {
            itemName += `<div class="item-options">(${item.optionText})</div>`;
        }

        basketItem.innerHTML = `
            <div class="basket-item-row">
                <div class="item-name">${itemName}</div>
                <div class="quantity-control">
                    <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                </div>
                <div class="item-price">₩ ${(item.price * item.quantity).toLocaleString()}</div>
                <button class="remove-item" data-index="${index}">X</button>
            </div>
        `;
        basketItemsElement.appendChild(basketItem);
    });

    setupBasketEventListeners();
    updateTotalPrice();
}

// 장바구니 이벤트 리스너 설정
function setupBasketEventListeners() {
    // 수량 감소 버튼 이벤트 리스너
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            if (basketItems[index].quantity > 1) {
                basketItems[index].quantity--;
                updateBasket();
            }
        });
    });

    // 수량 증가 버튼 이벤트 리스너
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            basketItems[index].quantity++;
            updateBasket();
        });
    });

    // 삭제 버튼 이벤트 리스너
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            basketItems.splice(index, 1);
            updateBasket();
        });
    });
}

// 총액 업데이트 함수
function updateTotalPrice() {
    // 총액 계산
    let total = 0;
    basketItems.forEach(item => {
        total += item.price * item.quantity;
    });

    // 총액 텍스트 번역
    const totalText = translations[currentLanguage]["총액: ₩"] || "총액: ₩";
    document.getElementById('total-price').textContent = `${totalText} ${total.toLocaleString()}`;
}

// 장바구니 초기화 함수
export function clearBasket() {
    // 장바구니 배열 비우기
    basketItems.length = 0;
    
    // UI 업데이트
    updateBasket();
}
