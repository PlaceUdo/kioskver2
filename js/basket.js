// basket.js - 장바구니 관련 기능
import { currentLanguage, translations } from './main.js';

// 장바구니 데이터는 localStorage와 동기화
export let basketItems = [];

// 페이지 로드 시 localStorage에서 장바구니 불러오기
// 기존 loadBasketFromStorage 함수에 추가
function loadBasketFromStorage() {
    const storedBasketItems = localStorage.getItem('basketItems');
    if (storedBasketItems) {
        basketItems = JSON.parse(storedBasketItems);
        updateBasket();
    }
}

// 페이지 로드 시 이벤트 리스너 추가
window.addEventListener('storage', function(e) {
    if (e.key === 'basketItems') {
        loadBasketFromStorage();
        // 요구사항 1: basket.html 페이지인 경우 localStorage가 변경되면 새로고침
        if (window.location.pathname.includes('basket.html')) {
            window.location.reload();
        }
    }
});

// 한국어로 옵션 텍스트 변환 함수
function convertToKoreanOptions(optionText) {
    if (!optionText) return '';
    
    let result = optionText;
    
    // 샷 옵션 변환
    if (result.includes('Light Shot')) {
        result = result.replace('Light Shot', '연하게');
    }
    
    if (result.includes('Extra Shot')) {
        result = result.replace(/Extra Shot \(\+.*\)/, '샷 추가 (+₩1,000)');
    }
    
    // 얼음 옵션 변환
    if (result.includes('Half Ice')) {
        result = result.replace('Half Ice', '얼음 절반');
    }
    
    if (result.includes('No Ice')) {
        result = result.replace('No Ice', '얼음 없음');
    }
    
    // 당도 옵션 변환
    if (result.includes('Less Sweet')) {
        result = result.replace('Less Sweet', '덜 달게');
    }
    
    if (result.includes('No Sugar')) {
        result = result.replace('No Sugar', '설탕 제거');
    }
    
    return result;
}

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

    // 옵션 텍스트 생성 (현재 언어로)
    const currentOptionText = generateOptionText(options, false);
    // 한국어 옵션 텍스트도 함께 저장 (basket.html에서 사용)
    const koreanOptionText = generateOptionText(options, true);

    if (existingItemIndex !== -1) {
        // 이미 같은 아이템과 옵션이 있으면 수량만 증가
        basketItems[existingItemIndex].quantity += quantity;
    } else {
        // 새로운 아이템 추가
        basketItems.push({
            id: item.id,
            name: item.name,
            translatedName: translatedName || item.name,
            price: itemPrice,
            basePrice: item.price,
            quantity: quantity,
            options: options,
            optionText: currentOptionText,
            koreanOptionText: koreanOptionText // 한국어 옵션 텍스트 추가
        });
    }

    updateBasket();
}

// 옵션 텍스트 생성 헬퍼 함수
function generateOptionText(options, forceKorean = false) {
    const isKorean = forceKorean || (window.location.pathname.includes('basket.html'));
    let optionTextArray = [];
    
    // 샷 옵션 처리
    if (options.shot === 'extra') {
        if (isKorean) {
            optionTextArray.push(`샷 추가 (+₩1,000)`);
        } else {
            optionTextArray.push(`${translations[currentLanguage]["샷 추가"] || "샷 추가"} (+₩1,000)`);
        }
    } else if (options.shot === 'light') {
        if (isKorean) {
            optionTextArray.push(`연하게`);
        } else {
            optionTextArray.push(translations[currentLanguage]["연하게"] || "연하게");
        }
    }
    
    // 얼음 옵션 처리
    if (options.temperature === 'ice') {
        if (options.ice === 'half') {
            if (isKorean) {
                optionTextArray.push(`얼음 절반`);
            } else {
                optionTextArray.push(translations[currentLanguage]["얼음 절반"] || "얼음 절반");
            }
        } else if (options.ice === 'none') {
            if (isKorean) {
                optionTextArray.push(`얼음 없음`);
            } else {
                optionTextArray.push(translations[currentLanguage]["얼음 없음"] || "얼음 없음");
            }
        }
    }
    
    // 당도 옵션 처리
    if (options.sweet === 'less') {
        if (isKorean) {
            optionTextArray.push(`덜 달게`);
        } else {
            optionTextArray.push(translations[currentLanguage]["덜 달게"] || "덜 달게");
        }
    } else if (options.sweet === 'none') {
        if (isKorean) {
            optionTextArray.push(`설탕 제거`);
        } else {
            optionTextArray.push(translations[currentLanguage]["설탕 제거"] || "설탕 제거");
        }
    }
    
    return optionTextArray.join(', ');
}

// 장바구니 업데이트 함수
export function updateBasket() {
    const basketItemsElement = document.getElementById('basket-items');
    
    // basketItems가 없을 경우 빈 배열로 초기화
    if (!basketItemsElement) return;
    
    basketItemsElement.innerHTML = '';
    
    // basket.html 페이지인지 확인
    const isBasketPage = window.location.pathname.includes('basket.html');

    basketItems.forEach((item, index) => {
        const basketItem = document.createElement('div');
        basketItem.className = 'basket-item';
        
        // 온도에 따라 클래스 추가
        if (item.options.temperature === 'hot') {
            basketItem.classList.add('hot-item');
        } else if (item.options.temperature === 'ice') {
            basketItem.classList.add('ice-item');
        }

        // 요구사항 2: basket.html에서만 한국어 이름과 옵션 사용, menu.html에서는 현재 언어로 표시
        let itemName, displayOptionText;
        
        if (isBasketPage) {
            // basket.html에서는 한국어 이름과 옵션 사용
            itemName = item.name;
            // 저장된 한국어 옵션이 있으면 사용, 없으면 변환
            displayOptionText = item.koreanOptionText || convertToKoreanOptions(item.optionText);
        } else {
            // 다른 페이지에서는 번역된 이름과 현재 언어의 옵션 사용
            itemName = item.translatedName || item.name;
            displayOptionText = item.optionText;
        }
        
        basketItem.innerHTML = `
            <div class="basket-item-row">
                <div class="item-info-container">
                    <div class="item-name">${itemName}</div>
                    ${displayOptionText ? `<div class="item-options">${displayOptionText}</div>` : ''}
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
    
    // localStorage에 장바구니 정보 저장
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
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

    // 요구사항 3: basket.html에서는 항상 한국어로 표시, 다른 페이지에서는 현재 언어로 표시
    const isBasketPage = window.location.pathname.includes('basket.html');
    const totalText = isBasketPage ? "총액:" : (translations[currentLanguage]["총액:"] || "총액:");
    
    const totalPriceElement = document.getElementById('total-price');
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalText} ${total.toLocaleString()}`;
    }
}

// 장바구니 초기화 함수
export function clearBasket() {
    // 장바구니 배열 비우기
    basketItems.length = 0;
    
    // localStorage 초기화
    localStorage.removeItem('basketItems');
    
    // UI 업데이트
    updateBasket();
}

// 페이지 로드 시 localStorage에서 장바구니 불러오기
document.addEventListener('DOMContentLoaded', loadBasketFromStorage);

// 메인 화면으로 돌아가기 버튼 이벤트 (선택적)
const mainPageButton = document.querySelector('.main-page-button');
if (mainPageButton) {
    mainPageButton.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });
}

// 주문 완료 버튼 이벤트 (선택적)
const orderCompleteButton = document.querySelector('.order-complete-button');
if (orderCompleteButton) {
    orderCompleteButton.addEventListener('click', () => {
        // 주문 완료 로직
        clearBasket(); // 장바구니 초기화
        alert('주문이 완료되었습니다!');
        window.location.href = 'index.html';
    });
}
