// basket.js - 장바구니 관련 기능
import { currentLanguage, translations } from './main.js';

// 장바구니 데이터는 전역으로 사용할 수 있게 export
export let basketItems = [];

// WebSocket 연결 변수
let socket;

// 소켓 초기화 함수
function initializeSocket() {
  if (typeof io !== 'undefined') {
    socket = io();
    
    // 테이블 ID 가져오기
    const tableId = getTableId();
    
// 고객 페이지(basket.js)의 initializeSocket 함수에 추가
socket.on('connect', () => {
    console.log('서버에 연결됨, 테이블 ID:', getTableId());
    socket.emit('register', 'customer');
    socket.emit('join-table', getTableId());
    
    // 이미 장바구니에 아이템이 있다면 서버에 동기화
    if (basketItems.length > 0) {
        updateBasketOnServer();
    }
});
    
    // 주문 확인 이벤트 수신
    socket.on('order-confirmation', () => {
      alert('주문이 완료되었습니다!');
      clearBasket();
    });
  } else {
    console.error('Socket.io가 로드되지 않았습니다.');
  }
}

// DOM이 로드된 후 소켓 초기화
document.addEventListener('DOMContentLoaded', () => {
  // Socket.io가 로드될 때까지 대기
  if (typeof io !== 'undefined') {
    initializeSocket();
  } else {
    // 소켓이 로드되면 초기화하는 이벤트 리스너 추가
    window.addEventListener('socketLoaded', initializeSocket);
  }
});

// 장바구니에 아이템 추가 함수
export function addToBasket(item, quantity = 1, options = {}, translatedName) {
    // 옵션을 문자열로 변환하여 고유한 키 생성
    const optionsKey = JSON.stringify(options);

    // 기본 가격 설정
    let itemPrice = item.price;
    
    // 샷 추가 옵션이 선택된 경우 가격 1000원 추가
    if (options.shot === 'extra') {
        itemPrice += 1000;
    }

    // 이미 장바구니에 같은 아이템과 옵션이 있는지 확인
    const existingItemIndex = basketItems.findIndex(basketItem =>
        basketItem.id === item.id && JSON.stringify(basketItem.options) === optionsKey
    );

    if (existingItemIndex !== -1) {
        // 이미 같은 아이템과 옵션이 있으면 수량만 증가
        basketItems[existingItemIndex].quantity += quantity;
    } else {
        // 새로운 아이템 추가를 위한 옵션 텍스트 배열 생성
        let optionTextArray = [];
        
        // 샷 옵션 처리
        if (options.shot === 'extra') {
            optionTextArray.push(`${translations[currentLanguage]["샷 추가"] || "샷 추가"} (+₩1,000)`);
        } else if (options.shot === 'light') {
            optionTextArray.push(translations[currentLanguage]["연하게"] || "연하게");
        }
        
        // 얼음 옵션 처리
        if (options.temperature === 'ice') {
            if (options.ice === 'half') {
                optionTextArray.push(translations[currentLanguage]["얼음 절반"] || "얼음 절반");
            } else if (options.ice === 'none') {
                optionTextArray.push(translations[currentLanguage]["얼음 없음"] || "얼음 없음");
            }
        }
        
        // 당도 옵션 처리
        if (options.sweet === 'less') {
            optionTextArray.push(translations[currentLanguage]["덜 달게"] || "덜 달게");
        } else if (options.sweet === 'none') {
            optionTextArray.push(translations[currentLanguage]["설탕 제거"] || "설탕 제거");
        }
        
        // 옵션 텍스트 조합
        let optionText = optionTextArray.join(', ');

        basketItems.push({
            id: item.id,
            name: item.name,
            translatedName: translatedName || item.name,
            price: itemPrice, // 수정된 가격
            basePrice: item.price, // 원래 가격도 저장
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
        
        basketItem.innerHTML = `
            <div class="basket-item-row">
                <div class="item-info-container">
                    <div class="item-name">${itemName}</div>
                    ${item.optionText ? `<div class="item-options">${item.optionText}</div>` : ''}
                </div>
                <div class="item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₩ ${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
            </div>
        `;
        
        basketItemsElement.appendChild(basketItem);
    });

    setupBasketEventListeners();
    updateTotalPrice();
    
    // 서버에 장바구니 상태 전송
    updateBasketOnServer();
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
    basketItems.length = 0;
    updateBasket();
}

// 테이블 ID 가져오기 함수
function getTableId() {
    // URL에서 테이블 ID 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('table');
    
    // 파라미터가 없으면 로컬 저장소 확인
    if (!id) {
        id = localStorage.getItem('tableId');
        
        // 로컬 저장소에도 없으면 임의 ID 생성 및 저장
        if (!id) {
            id = 'table-' + Math.floor(Math.random() * 1000);
            localStorage.setItem('tableId', id);
        }
    }
    
    return id;
}

// 서버에 장바구니 상태 전송
function updateBasketOnServer() {
    if (socket && socket.connected) {
        const data = {
            tableId: getTableId(),
            basketItems: basketItems,
            updatedAt: new Date()
        };
        console.log('서버에 장바구니 업데이트 전송:', data);
        socket.emit('update-basket', data);
    } else {
        console.warn('소켓이 연결되지 않았거나 초기화되지 않았습니다.');
    }
}

// 주문 완료 함수
export function completeOrder() {
    if (socket && socket.connected && basketItems.length > 0) {
        socket.emit('complete-order', getTableId());
        return true;
    }
    return false;
}