// main.js
import { menuData } from './menu-item.js';
import translations from './translations.js';
import { displayMenuItems, setupMenuListeners } from './menu.js';
import { setupPopupListeners } from './popup.js';
import { basketItems, clearBasket, completeOrder } from './basket.js';

// window 객체에 translations 등록 (timeout.js 등에서 사용)
window.translations = translations;

// 공유 데이터 (다른 모듈에서 참조 가능)
export let currentLanguage = localStorage.getItem('language') || 'ko';
export let currentCategory = 'coffee';

// 메인 초기화 함수
function initializeApp() {
    // 초기 메뉴 표시
    displayMenuItems(currentCategory);

    // 카테고리 이벤트 리스너 등록
    setupMenuListeners();

    // 버튼 이벤트 리스너 등록
    setupButtonListeners();

    // 팝업 이벤트 리스너 등록
    setupPopupListeners();
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

        // completeOrder 함수를 호출하여 주문 완료 처리
        if (completeOrder()) {
            // completeOrder 함수에서 서버 통신 후 처리하므로 여기서는 별도 처리 없음
        } else {
            // 서버 연결이 안 되었을 경우 로컬에서만 처리
            const message = translations[currentLanguage]["주문이 완료되었습니다!"] || "주문이 완료되었습니다!";
            alert(message);
            clearBasket();
        }
    });

    // 메인 화면 버튼 이벤트 리스너
    document.querySelector('.main-page-button').addEventListener('click', () => {
        const message = translations[currentLanguage]["메인 화면으로 이동하시겠습니까?"] || "메인 화면으로 이동하시겠습니까?";
        if (confirm(message)) {
            window.location.href = 'index.html';
        }
    });
}

// Socket.io 로드 감지 이벤트
window.addEventListener('load', () => {
    // Socket.io 스크립트 로드 확인
    if (document.querySelector('script[src="/socket.io/socket.io.js"]')) {
        console.log('Socket.io 스크립트가 이미 로드되었습니다.');
    } else {
        // 동적으로 socket.io 스크립트 로드
        const script = document.createElement('script');
        script.src = '/socket.io/socket.io.js';
        script.onload = () => {
            console.log('Socket.io 스크립트가 로드되었습니다.');
            // Socket.io 로드 완료 이벤트 발생
            window.dispatchEvent(new Event('socketLoaded'));
        };
        script.onerror = (error) => {
            console.error('Socket.io 로드 오류:', error);
        };
        document.head.appendChild(script);
    }
});

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', initializeApp);

// 공유 데이터 및 함수 export
export { translations, menuData };