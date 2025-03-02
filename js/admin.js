// admin.js
console.log('admin.js 로드됨');
// socket 변수 선언은 한 번만 하고, io가 정의되었는지 확인
let socket;
if (typeof io !== 'undefined') {
    socket = io();
} else {
    console.error('Socket.io를 찾을 수 없습니다. 서버가 실행 중인지 확인하세요.');
}

const activeOrdersContainer = document.getElementById('active-orders');

// 연결 시 관리자로 등록
if (socket) {
// 관리자 페이지(admin.js)에 추가
socket.on('connect', () => {
    console.log('소켓 연결됨, 관리자로 등록');
    socket.emit('register', 'admin');
});

    // 모든 활성 장바구니 수신
    socket.on('all-baskets', (baskets) => {
        console.log('모든 장바구니 데이터 수신:', baskets);
        if (!baskets || baskets.length === 0) {
            console.log('수신된 장바구니 데이터가 없습니다.');
            return;
        }
        
        activeOrdersContainer.innerHTML = '';
        baskets.forEach(basketData => {
            console.log('장바구니 렌더링:', basketData);
            renderBasket(basketData);
        });
    });

// 장바구니 업데이트 알림 수신
socket.on('basket-updated', (basketData) => {
    console.log('장바구니 업데이트 수신:', basketData);
    
    // 이미 존재하는 장바구니라면 업데이트, 아니면 새로 생성
    const existingBasket = document.getElementById(`basket-${basketData.tableId}`);
    if (existingBasket) {
        console.log('기존 장바구니 업데이트:', basketData.tableId);
        existingBasket.innerHTML = generateBasketHTML(basketData);
    } else {
        console.log('새 장바구니 생성:', basketData.tableId);
        renderBasket(basketData);
    }
});

    // 주문 완료 알림 수신
    socket.on('order-completed', ({ tableId }) => {
        const basketElement = document.getElementById(`basket-${tableId}`);
        if (basketElement) {
            // 주문 완료 상태로 변경하거나 요소 제거
            basketElement.classList.add('completed');
            setTimeout(() => {
                basketElement.remove();
            }, 5000); // 5초 후 제거
        }
    });
}

// 장바구니 렌더링 함수
function renderBasket(basketData) {
    const basketElement = document.createElement('div');
    basketElement.id = `basket-${basketData.tableId}`;
    basketElement.className = 'basket-container';
    basketElement.innerHTML = generateBasketHTML(basketData);
    activeOrdersContainer.appendChild(basketElement);
}

// 장바구니 HTML 생성 함수
function generateBasketHTML(basketData) {
    const { tableId, basketItems, updatedAt } = basketData;
    
    let totalAmount = 0;
    let itemsHTML = '';
    
    basketItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        itemsHTML += `
            <div class="basket-item ${item.options && item.options.temperature === 'hot' ? 'hot-item' : 'ice-item'}">
                <div class="item-name">${item.translatedName || item.name} x ${item.quantity}</div>
                <div class="item-options">${item.optionText || ''}</div>
                <div class="item-price">₩ ${itemTotal.toLocaleString()}</div>
            </div>
        `;
    });
    
    return `
        <h3>테이블 ${tableId}</h3>
        <div class="updated-time">최근 업데이트: ${new Date(updatedAt).toLocaleTimeString()}</div>
        <div class="basket-items">
            ${itemsHTML}
        </div>
        <div class="total-price">총액: ₩ ${totalAmount.toLocaleString()}</div>
        <div class="action-buttons">
            <button class="process-btn" onclick="processOrder('${tableId}')">주문 처리</button>
            <button class="cancel-btn" onclick="cancelOrder('${tableId}')">주문 취소</button>
        </div>
    `;
}

// 주문 처리 함수
function processOrder(tableId) {
    if (socket && confirm(`테이블 ${tableId}의 주문을 처리하시겠습니까?`)) {
        socket.emit('process-order', tableId);
    }
}

// 주문 취소 함수
function cancelOrder(tableId) {
    if (socket && confirm(`테이블 ${tableId}의 주문을 취소하시겠습니까?`)) {
        socket.emit('cancel-order', tableId);
    }
}