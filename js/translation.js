// translation.js - 다국어 처리 기능
import { currentLanguage, translations } from './main.js';

// 페이지 번역 함수
export function translatePage() {
    // 카테고리 번역
    document.querySelectorAll('.category-items li').forEach(element => {
        const category = element.textContent.trim();
        if (translations[currentLanguage] && translations[currentLanguage][category]) {
            element.textContent = translations[currentLanguage][category];
        }
    });

    // 장바구니 제목 번역
    const basketTitle = document.querySelector('.basket-title');
    if (basketTitle && translations[currentLanguage] && translations[currentLanguage]["Basket"]) {
        basketTitle.textContent = translations[currentLanguage]["Basket"];
    }

    // 총액 번역
    const totalPrice = document.getElementById('total-price');
    if (totalPrice) {
        const amount = totalPrice.textContent.split(':')[1].trim();
        if (translations[currentLanguage] && translations[currentLanguage]["총액: ₩"]) {
            totalPrice.textContent = `${translations[currentLanguage]["총액: ₩"]} ${amount}`;
        }
    }

    // 버튼 번역
    document.querySelector('.main-page-button').textContent =
        translations[currentLanguage]["메인 화면으로"] || "메인 화면으로";
    document.querySelector('.order-complete-button').textContent =
        translations[currentLanguage]["주문 완료"] || "주문 완료";

    // 팝업 관련 번역
    document.getElementById('popup-title').textContent =
        translations[currentLanguage]["메뉴 상세"] || "메뉴 상세";
    document.getElementById('add-to-cart').textContent =
        translations[currentLanguage]["장바구니에 추가"] || "장바구니에 추가";

    // 옵션 제목 번역
    document.querySelectorAll('.option-title').forEach(element => {
        const optionTitle = element.textContent.trim();
        if (translations[currentLanguage] && translations[currentLanguage][optionTitle]) {
            element.textContent = translations[currentLanguage][optionTitle];
        }
    });

    // 옵션 버튼 번역
    document.querySelectorAll('.option-button').forEach(button => {
        const optionValue = button.textContent.trim();
        if (translations[currentLanguage] && translations[currentLanguage][optionValue]) {
            button.textContent = translations[currentLanguage][optionValue];
        }
    });
}

// 특정 텍스트 번역 함수
export function translateText(text, defaultText = '') {
    if (translations[currentLanguage] && translations[currentLanguage][text]) {
        return translations[currentLanguage][text];
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