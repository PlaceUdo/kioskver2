// popup.js - 팝업 관련 기능
import { currentMenuItem, currentQuantity, selectedOptions, currentCategory, translations, currentLanguage } from './main.js';
import { addToBasket } from './basket.js';

// 팝업 이벤트 리스너 설정
export function setupPopupListeners() {
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.querySelector('.close-popup');
    const decreaseQuantityButton = document.getElementById('decrease-quantity');
    const increaseQuantityButton = document.getElementById('increase-quantity');
    const addToCartButton = document.getElementById('add-to-cart');

    // 팝업 닫기 버튼
    closePopupButton.addEventListener('click', closePopup);

    // 수량 감소 버튼
    decreaseQuantityButton.addEventListener('click', decreaseQuantity);

    // 수량 증가 버튼
    increaseQuantityButton.addEventListener('click', increaseQuantity);

    // 장바구니 추가 버튼
    addToCartButton.addEventListener('click', addToCart);

    // 옵션 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
            const optionType = button.dataset.optionType;
            const optionValue = button.dataset.optionValue;

            // 같은 그룹의 모든 버튼에서 selected 클래스 제거
            document.querySelectorAll(`.option-button[data-option-type="${optionType}"]`)
                .forEach(btn => btn.classList.remove('selected'));

            // 클릭한 버튼에 selected 클래스 추가
            button.classList.add('selected');

            // 선택된 옵션 업데이트
            selectedOptions[optionType] = optionValue;

            // Ice/Hot 선택 시 얼음 옵션 업데이트
            if (optionType === 'temperature') {
                updateIceOptions();
            }
        });
    });

    // 팝업 외부 클릭 시 닫기
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}

// 팝업 열기 함수
export function openPopup(item, translatedName) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const popupDescription = document.getElementById('popup-description');
    const popupPrice = document.getElementById('popup-price');
    const quantitySpan = document.getElementById('quantity');

    // 현재 메뉴 아이템 설정
    window.currentMenuItem = item;
    window.currentMenuItem.translatedName = translatedName || item.name;
    window.currentQuantity = 1;

    // 옵션 초기화 - 항상 기본 옵션으로 설정
    resetOptionsToDefault(item);

    // 팝업 정보 업데이트
    popupTitle.textContent = translatedName || item.name;
    popupImage.src = item.image || 'placeholder.jpg';
    popupImage.alt = translatedName || item.name;
    popupDescription.textContent = item.description || '';
    popupPrice.textContent = `₩ ${item.price.toLocaleString()}`;
    quantitySpan.textContent = window.currentQuantity;

    // 메뉴 종류에 따라 옵션 표시/숨김 처리
    const isDessert = currentCategory === 'dessert';
    const isNonCoffee = currentCategory === 'non-coffee';

    // 1. 디저트의 경우 모든 옵션 숨김
    if (isDessert) {
        document.querySelectorAll('.option-group').forEach(group => {
            group.style.display = 'none';
        });
    } else {
        // 2. 각 옵션 그룹 표시 여부 결정
        document.querySelectorAll('.option-group').forEach(group => {
            const optionTitle = group.querySelector('.option-title').textContent.trim();
            
            // 커피가 아닐 경우 샷 옵션 숨김
            if (isNonCoffee && (optionTitle === translations[currentLanguage]["샷"] || optionTitle === '샷')) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });

        // 3. 온도 선택 옵션 처리
        handleTemperatureOptions(item);

        // 3.5 샷 옵션 처리
        handleShotOptions(item);

        // 4. 당도 옵션 처리
        handleSweetOptions(item);
    }

    // 팝업 표시
    popupOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 옵션을 기본값으로 초기화하는 함수
function resetOptionsToDefault(item) {
    // 기본 옵션 설정
    window.selectedOptions = {
        temperature: item.temperatureOptions ? item.temperatureOptions[0] : 'ice', // 첫 번째 가능한 온도 옵션
        shot: 'normal', // 기본 샷
        ice: 'normal', // 기본 얼음
        sweet: 'normal' // 기본 당도
    };

    // 모든 옵션 버튼에서 selected 클래스 제거 및 비활성화 상태 초기화
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
        button.disabled = false;
        button.classList.remove('disabled');
    });

    // 기본 온도 옵션 선택
    const tempOptionValue = window.selectedOptions.temperature;
    const tempButton = document.querySelector(`.option-button[data-option-type="temperature"][data-option-value="${tempOptionValue}"]`);
    if (tempButton) {
        tempButton.classList.add('selected');
    }

    // 기본 샷 옵션 선택
    document.querySelector('.option-button[data-option-type="shot"][data-option-value="normal"]').classList.add('selected');
    
    // 기본 얼음 옵션 선택
    document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
    
    // 기본 당도 옵션 선택
    document.querySelector('.option-button[data-option-type="sweet"][data-option-value="normal"]').classList.add('selected');

    // Hot 선택 시 얼음 옵션 비활성화
    if (window.selectedOptions.temperature === 'hot') {
        document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }
}

// 온도 옵션 처리 함수
function handleTemperatureOptions(item) {
    const temperatureButtons = document.querySelectorAll('.option-button[data-option-type="temperature"]');
    
    if (item.temperatureOptions) {
        // 온도 옵션 그룹 표시
        const tempGroup = document.querySelector('.option-group:has(.option-button[data-option-type="temperature"])');
        if (tempGroup) tempGroup.style.display = 'block';
        
        // 메뉴에 온도 옵션이 지정되어 있는 경우
        temperatureButtons.forEach(button => {
            const tempOption = button.dataset.optionValue;
            
            if (item.temperatureOptions.includes(tempOption)) {
                // 사용 가능한 옵션인 경우 표시
                button.style.display = 'inline-block';
                // 첫 번째 허용 옵션을 기본값으로 설정
                if (tempOption === item.temperatureOptions[0]) {
                    button.classList.add('selected');
                    window.selectedOptions.temperature = tempOption;
                }
            } else {
                // 사용 불가능한 옵션인 경우 숨김
                button.style.display = 'none';
            }
        });
    } else {
        // 온도 옵션 그룹 숨김
        const tempGroup = document.querySelector('.option-group:has(.option-button[data-option-type="temperature"])');
        if (tempGroup) tempGroup.style.display = 'none';
    }
    
    // 온도 선택에 따라 얼음 옵션 업데이트
    updateIceOptions();
}

// 당도 옵션 처리 함수
function handleSweetOptions(item) {
    const sweetGroup = document.querySelector('.option-group:has(.option-button[data-option-type="sweet"])');
    
    if (sweetGroup) {
        if (item.sweetOptions === true) {
            // 당도 조절이 가능한 메뉴인 경우 옵션 그룹 표시
            sweetGroup.style.display = 'block';
            
            // 당도 기본값 설정
            document.querySelector('.option-button[data-option-type="sweet"][data-option-value="normal"]').classList.add('selected');
            window.selectedOptions.sweet = 'normal';
        } else {
            // 당도 조절이 불가능한 메뉴인 경우 옵션 그룹 숨김
            sweetGroup.style.display = 'none';
        }
    }
}

// 샷 옵션 처리 함수
function handleShotOptions(item) {
    const shotGroup = document.querySelector('.option-group:has(.option-button[data-option-type="shot"])');
    
    if (shotGroup) {
        if (item.shotOptions === true) {
            // 샷 추가가 가능한 메뉴인 경우 옵션 그룹 표시
            shotGroup.style.display = 'block';
            
            // 샷 기본값 설정
            document.querySelector('.option-button[data-option-type="shot"][data-option-value="normal"]').classList.add('selected');
            window.selectedOptions.shot = 'normal';
        } else {
            // 샷 추가가 불가능한 메뉴인 경우 옵션 그룹 숨김
            shotGroup.style.display = 'none';
        }
    }
}

// 얼음 옵션 업데이트 함수
function updateIceOptions() {
    const iceGroup = document.querySelector('.option-group:has(.option-button[data-option-type="ice"])');
    
    if (iceGroup) {
        if (window.selectedOptions.temperature === 'hot') {
            // Hot 선택 시 얼음 옵션 비활성화
            document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
                button.disabled = true;
                button.classList.add('disabled');
            });
            // Hot일 때는 얼음 옵션 기본으로 설정
            document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
            window.selectedOptions.ice = 'normal';
        } else {
            // Ice 선택 시 얼음 옵션 활성화
            document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
                button.disabled = false;
                button.classList.remove('disabled');
            });
            // Ice일 때는 얼음 기본 옵션 선택
            document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
            window.selectedOptions.ice = 'normal';
        }
    }
}

// 팝업 닫기 함수
export function closePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 다시 활성화
    window.currentMenuItem = null;
}

// 수량 감소 함수
export function decreaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    if (window.currentQuantity > 1) {
        window.currentQuantity--;
        quantitySpan.textContent = window.currentQuantity;
    }
}

// 수량 증가 함수
export function increaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    window.currentQuantity++;
    quantitySpan.textContent = window.currentQuantity;
}

// 장바구니에 추가 함수 (팝업에서 호출)
export function addToCart() {
    if (window.currentMenuItem) {
        // 현재 선택된 옵션으로 장바구니에 추가
        addToBasket(window.currentMenuItem, window.currentQuantity, {
            ...window.selectedOptions
        }, window.currentMenuItem.translatedName);
        closePopup();
    }
}
