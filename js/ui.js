// ui.js - UI 관련 기능
import { translations, currentLanguage, basketItems } from './main.js';
import { clearBasket, updateBasket } from './basket.js';

// 버튼 이벤트 리스너 설정
export function setupButtonListeners() {
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

// 알림 메시지 표시 함수
export function showNotification(message, type = 'info', duration = 3000) {
    // 이미 존재하는 알림 요소 있으면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 새 알림 요소 생성
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 스타일 설정
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // 알림 유형에 따라 스타일 변경
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#F44336';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#FF9800';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
    }
    
    // 알림 추가
    document.body.appendChild(notification);
    
    // 지정된 시간 후 알림 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
}

// 로딩 스피너 표시/숨김 함수
export function showLoading(show = true) {
    // 이미 존재하는 로딩 요소 확인
    let loadingOverlay = document.querySelector('.loading-overlay');
    
    if (show) {
        // 로딩 요소가 없으면 생성
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            
            // 스타일 설정
            loadingOverlay.style.position = 'fixed';
            loadingOverlay.style.top = '0';
            loadingOverlay.style.left = '0';
            loadingOverlay.style.width = '100%';
            loadingOverlay.style.height = '100%';
            loadingOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.justifyContent = 'center';
            loadingOverlay.style.alignItems = 'center';
            loadingOverlay.style.zIndex = '2000';
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            
            // 스피너 스타일
            spinner.style.width = '50px';
            spinner.style.height = '50px';
            spinner.style.border = '5px solid #f3f3f3';
            spinner.style.borderTop = '5px solid #3498db';
            spinner.style.borderRadius = '50%';
            spinner.style.animation = 'spin 1s linear infinite';
            
            // 애니메이션 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            loadingOverlay.appendChild(spinner);
            document.body.appendChild(loadingOverlay);
        } else {
            // 이미 있으면 표시
            loadingOverlay.style.display = 'flex';
        }
    } else if (loadingOverlay) {
        // 로딩 숨김
        loadingOverlay.style.display = 'none';
    }
}

// 모달 창 표시 함수
export function showModal(title, content, okCallback = null, cancelCallback = null) {
    // 이미 존재하는 모달 요소 있으면 제거
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // 모달 오버레이 생성
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // 스타일 설정
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '1500';

    // 모달 콘텐츠 생성
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // 스타일 설정
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '8px';
    modal.style.padding = '20px';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '500px';
    modal.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

    // 모달 내용 추가
    modal.innerHTML = `
        <div class="modal-header" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <h3 style="margin: 0; font-size: 18px;">${title}</h3>
        </div>
        <div class="modal-body" style="margin-bottom: 20px;">
            ${content}
        </div>
        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
            ${cancelCallback ? '<button class="cancel-button" style="padding: 8px 15px; background-color: #f1f1f1; border: none; border-radius: 4px; cursor: pointer;">취소</button>' : ''}
            <button class="ok-button" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">확인</button>
        </div>
    `;

    // 버튼 이벤트 리스너 추가
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // 이벤트 리스너 추가
    const okButton = modal.querySelector('.ok-button');
    okButton.addEventListener('click', () => {
        if (okCallback) okCallback();
        modalOverlay.remove();
    });

    if (cancelCallback) {
        const cancelButton = modal.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            cancelCallback();
            modalOverlay.remove();
        });
    }

    // 모달 밖 클릭 시 닫기
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            if (cancelCallback) cancelCallback();
            modalOverlay.remove();
        }
    });

    return modalOverlay;
}
