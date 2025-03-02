// 타이머 관련 변수
let timeoutDuration = 45; // 초 단위
let timeLeft = timeoutDuration;
let countdownTimer;
let warningShown = false;
let warningElement;

// 페이지 로드 시 타이머 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기존 페이지 초기화 후 타이머 설정
    window.setTimeout(() => {
        initializeTimer();
        setupUserActivityTracking();
    }, 1000);
});

// 타이머 초기화 함수
function initializeTimer() {
    // 경고 메시지 요소 생성 및 스타일 설정
    createWarningElement();
}

// 경고 메시지 요소 생성
function createWarningElement() {
    warningElement = document.createElement('div');
    warningElement.id = 'timeout-warning';
    
    // 스타일 설정
    warningElement.style.position = 'fixed';
    warningElement.style.top = '50%';
    warningElement.style.left = '50%';
    warningElement.style.transform = 'translate(-50%, -50%)';
    warningElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    warningElement.style.color = 'white';
    warningElement.style.padding = '20px';
    warningElement.style.borderRadius = '10px';
    warningElement.style.textAlign = 'center';
    warningElement.style.fontSize = '18px';
    warningElement.style.fontWeight = 'bold';
    warningElement.style.zIndex = '9999';
    warningElement.style.display = 'none'; // 초기에는 숨김
    
    document.body.appendChild(warningElement);
    
    // 요소가 생성된 후 텍스트 설정
    updateWarningText();
    
    // 카운트다운 시작
    startCountdown();
}

// 경고 메시지 텍스트 업데이트
function updateWarningText() {
    const lang = localStorage.getItem('language') || 'ko';
    
    if (window.translations && window.translations[lang]) {
        const warningTitle = window.translations[lang]["warning_title"];
        const warningCountdown = window.translations[lang]["warning_countdown"];
        
        if (warningTitle && warningCountdown) {
            warningElement.innerHTML = `
                <p>${warningTitle}</p>
                <p><span id="warning-countdown">${timeLeft}</span> ${warningCountdown}</p>
            `;
            return;
        }
    }
    
    // 번역이 없을 경우 기본(한국어) 메시지 사용
    warningElement.innerHTML = `
        <p>⚠️ 주의: 세션이 곧 종료됩니다!</p>
        <p><span id="warning-countdown">${timeLeft}</span>초 후 메인화면으로 돌아갑니다.</p>
    `;
}

// 카운트다운 시작 함수
function startCountdown() {
    // 기존 타이머가 있다면 제거
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    timeLeft = timeoutDuration;
    warningShown = false;
    
    if (warningElement) {
        warningElement.style.display = 'none';
    }
    
    // 1초마다 카운트다운
    countdownTimer = setInterval(function() {
        timeLeft--;
        
        // 남은 시간이 5초 이하일 때 경고 표시
        if (timeLeft <= 5 && !warningShown) {
            showWarning();
            warningShown = true;
        }
        
        // 경고가 표시 중이라면 경고 카운트다운 업데이트
        if (warningShown) {
            updateWarningCountdown();
        }
        
        // 시간이 다 되면 리디렉션
        if (timeLeft <= 0) {
            redirectToHome();
        }
    }, 1000);
}

// 경고 메시지 표시 함수
function showWarning() {
    if (warningElement) {
        updateWarningText(); // 현재 언어에 맞게 메시지 업데이트
        warningElement.style.display = 'block';
        
        // 애니메이션 효과 (깜빡임)
        let blinkCount = 0;
        const blinkInterval = setInterval(function() {
            warningElement.style.backgroundColor = 
                warningElement.style.backgroundColor === 'rgba(255, 0, 0, 0.8)' ? 
                'rgba(255, 50, 50, 0.9)' : 'rgba(255, 0, 0, 0.8)';
            
            blinkCount++;
            if (blinkCount >= 6) { // 3번 깜빡임
                clearInterval(blinkInterval);
            }
        }, 500);
    }
}

// 경고 카운트다운 업데이트
function updateWarningCountdown() {
    const warningCountdown = document.getElementById('warning-countdown');
    if (warningCountdown) {
        warningCountdown.textContent = timeLeft;
    }
}

// 홈페이지로 리디렉션 및 장바구니 초기화
function redirectToHome() {
    // 현재 페이지 확인
    const currentPage = window.location.pathname;
    const isMenuPage = currentPage.includes('menu.html');
    const isBasketPage = currentPage.includes('basket.html');
    
    // 장바구니 초기화
    clearBasket();
    
    // 장바구니 초기화 완료 이벤트 발생 (다른 페이지에 알림)
    localStorage.setItem('basketCleared', Date.now().toString());
    
    // menu.html 또는 basket.html 페이지에서는 index.html로 리디렉션
    // 다른 페이지에서는 새로고침 없이 index.html로 이동
    if (isMenuPage || isBasketPage) {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// 장바구니 초기화 함수
function clearBasket() {
    // localStorage의 basket 관련 항목 제거
    localStorage.removeItem('basketItems');
    
    try {
        // basket.js의 clearBasket 함수가 있다면 호출
        if (typeof window.clearBasket === 'function') {
            window.clearBasket();
        }
    } catch (error) {
        console.log('Could not access basket.js clearBasket function');
    }
}

// 사용자 활동 감지 설정
function setupUserActivityTracking() {
    // 사용자 동작 이벤트 리스너
    const userEvents = [
        'mousemove', 'mousedown', 'keydown', 
        'touchstart', 'touchmove', 'scroll', 'click'
    ];
    
    userEvents.forEach(eventType => {
        document.addEventListener(eventType, resetTimer);
    });
}

// 타이머 재설정 함수
function resetTimer() {
    // 경고가 표시된 상태에서만 타이머 재설정
    if (warningShown) {
        startCountdown(); // 타이머 재시작
    }
}

// 타임아웃 시간 설정 함수 (외부에서 호출 가능)
function setTimeoutDuration(seconds) {
    if (seconds > 0) {
        timeoutDuration = seconds;
        // 이미 타이머가 실행 중이면 재시작
        if (countdownTimer) {
            startCountdown();
        }
    }
}

// 타임아웃 비활성화 함수 (외부에서 호출 가능)
function disableTimeout() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    
    if (warningElement) {
        warningElement.style.display = 'none';
    }
}

// 타임아웃 활성화 함수 (외부에서 호출 가능)
function enableTimeout() {
    // 이미 활성화되어 있지 않은 경우에만 초기화
    if (!countdownTimer) {
        initializeTimer();
    }
}

// localStorage 변경 이벤트 감지 (다른 페이지에서 장바구니가 초기화되었을 때 처리)
window.addEventListener('storage', function(e) {
    if (e.key === 'basketCleared') {
        // 현재 페이지가 menu.html 또는 basket.html인 경우 장바구니 UI 업데이트
        const currentPage = window.location.pathname;
        const isMenuPage = currentPage.includes('menu.html');
        const isBasketPage = currentPage.includes('basket.html');
        
        if (isMenuPage || isBasketPage) {
            // 장바구니 UI 업데이트
            clearBasket();
            
            // basket.html 페이지인 경우 새로고침
            if (isBasketPage) {
                window.location.reload();
            }
        }
    }
});