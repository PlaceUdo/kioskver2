// translation.js - 다국어 처리 기능
import { currentLanguage, translations } from './main.js';

// 페이지 번역 함수
export function translatePage() {
    // 현재 페이지가 basket.html인지 확인
    const isBasketPage = window.location.pathname.includes('basket.html');
    
    // basket.html에서는 항상 한국어로 표시
    const lang = isBasketPage ? 'ko' : currentLanguage;
    
    // 카테고리 번역
    document.querySelectorAll('.category-items li').forEach(element => {
        const category = element.textContent.trim();
        if (translations[lang] && translations[lang][category]) {
            element.textContent = translations[lang][category];
        }
    });

    // 장바구니 제목 번역
    const basketTitle = document.querySelector('.basket-title');
    if (basketTitle) {
        if (isBasketPage) {
            // basket.html에서는 항상 한국어로 "장바구니" 표시
            basketTitle.textContent = "장바구니";
        } else if (translations[lang] && translations[lang]["Basket"]) {
            basketTitle.textContent = translations[lang]["Basket"];
        }
    }

    // 총액 번역
    const totalPrice = document.getElementById('total-price');
    if (totalPrice) {
        const priceText = totalPrice.textContent;
        let amount = '';
        
        // 금액 부분 추출
        if (priceText.includes(':')) {
            amount = priceText.split(':')[1].trim();
        } else if (priceText.includes('₩')) {
            amount = priceText.split('₩')[1].trim();
        }
        
        if (isBasketPage) {
            // basket.html에서는 항상 한국어로 "총액:" 표시
            totalPrice.textContent = `총액: ₩ ${amount}`;
        } else if (translations[lang] && translations[lang]["총액: "]) {
            totalPrice.textContent = `${translations[lang]["총액: "]}  ${amount}`;
        }
    }

    // 버튼 번역
    const mainPageButton = document.querySelector('.main-page-button');
    if (mainPageButton) {
        if (isBasketPage) {
            mainPageButton.textContent = "메인 화면으로";
        } else {
            mainPageButton.textContent = translations[lang]["메인 화면으로"] || "메인 화면으로";
        }
    }
    
    const orderCompleteButton = document.querySelector('.order-complete-button');
    if (orderCompleteButton) {
        if (isBasketPage) {
            orderCompleteButton.textContent = "주문 완료";
        } else {
            orderCompleteButton.textContent = translations[lang]["주문 완료"] || "주문 완료";
        }
    }

    // 팝업 관련 번역
    const popupTitle = document.getElementById('popup-title');
    if (popupTitle) {
        popupTitle.textContent = translations[lang]["메뉴 상세"] || "메뉴 상세";
    }
    
    const addToCart = document.getElementById('add-to-cart');
    if (addToCart) {
        addToCart.textContent = translations[lang]["장바구니에 추가"] || "장바구니에 추가";
    }

    // 옵션 제목 번역
    document.querySelectorAll('.option-title').forEach(element => {
        const optionTitle = element.textContent.trim();
        if (translations[lang] && translations[lang][optionTitle]) {
            element.textContent = translations[lang][optionTitle];
        }
    });

    // 옵션 버튼 번역
    document.querySelectorAll('.option-button').forEach(button => {
        const optionValue = button.textContent.trim();
        if (translations[lang] && translations[lang][optionValue]) {
            button.textContent = translations[lang][optionValue];
        }
    });
}

// 특정 텍스트 번역 함수
export function translateText(text, defaultText = '') {
    // 현재 페이지가 basket.html인지 확인
    const isBasketPage = window.location.pathname.includes('basket.html');
    
    // basket.html에서는 한국어 번역 사용
    const lang = isBasketPage ? 'ko' : currentLanguage;
    
    if (translations[lang] && translations[lang][text]) {
        return translations[lang][text];
    }
    return defaultText || text;
}

// 언어 변경 함수
export function changeLanguage(lang) {
    if (translations[lang]) {
        localStorage.setItem('language', lang);
        window.location.reload(); // 페이지 새로고침하여 번역 적용
    }
}