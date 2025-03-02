// main.js 상단 import 부분 수정
import { menuData } from './menu-item.js';
import translations from './translations.js';
import { displayMenuItems, setupMenuListeners } from './menu.js'; // setupMenuListeners 추가
import { setupPopupListeners } from './popup.js';
import { translatePage } from './translation.js';
import { basketItems, clearBasket, updateBasket } from './basket.js';

// window 객체에 translations 등록 (timeout.js 등에서 사용)
window.translations = translations;

// 공유 데이터 (다른 모듈에서 참조 가능)
export let currentLanguage = localStorage.getItem('language') || 'ko';
export let currentCategory = 'coffee';

// 메인 초기화 함수
function initializeApp() {
    // 언어 로드
    translatePage();

    // 초기 메뉴 표시
    displayMenuItems(currentCategory);

    // 카테고리 이벤트 리스너 등록 - 이 부분을 수정
    setupMenuListeners(); // 기존의 setupCategoryListeners() 대신 사용

    // 버튼 이벤트 리스너 등록
    setupButtonListeners();

    // 팝업 이벤트 리스너 등록
    setupPopupListeners();
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
            const message = translations[currentLanguage]["장바구니가 비어있습니다."] || "장바구니가 비어있습니다.";
            alert(message);
            return;
        }

        const message = translations[currentLanguage]["주문이 완료되었습니다!"] || "주문이 완료되었습니다!";
        alert(message);
        clearBasket();
    });

    // 메인 화면 버튼 이벤트 리스너
    document.querySelector('.main-page-button').addEventListener('click', () => {
        const message = translations[currentLanguage]["메인 화면으로 이동하시겠습니까?"] || "메인 화면으로 이동하시겠습니까?";
        if (confirm(message)) {
            window.location.href = 'index.html';
        }
    });
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', initializeApp);

// 공유 데이터 및 함수 export
export { translations, menuData };