import { menuData } from './menu-item.js';
// script.js 파일 상단에 추가
import translations from './translations.js';
// translations를 window 객체에 등록
window.translations = translations;
import { basketItems, addToBasket } from './basket.js';

// 현재 언어와 카테고리 export
export let currentLanguage = localStorage.getItem('language') || 'ko';
export let currentCategory = 'coffee';
export { translations };

// 현재 팝업에 표시된 메뉴 아이템과 수량
let currentMenuItem = null;
let currentQuantity = 1;
let selectedOptions = {
    temperature: 'ice',
    shot: 'normal',
    ice: 'normal',
    sweet: 'normal'
};

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 앱 초기화 함수
function initializeApp() {
    // 언어 로드
    translatePage();

    // 초기 메뉴 표시
    displayMenuItems(currentCategory);

    // 카테고리 이벤트 리스너 등록
    setupCategoryListeners();

    // 버튼 이벤트 리스너 등록
    setupButtonListeners();

    // 팝업 이벤트 리스너 등록
    setupPopupListeners();
}

// 페이지 번역 함수
function translatePage() {
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

// 메뉴 아이템 표시 함수
function displayMenuItems(category) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; // 기존 메뉴 아이템 삭제

    menuData[category].forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// 메뉴 아이템 생성 함수
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.dataset.id = item.id;

    // 이미지 추가
    const img = document.createElement('img');
    img.src = item.image || 'placeholder.jpg'; // 이미지가 없을 경우 기본 이미지
    img.alt = item.name;
    menuItem.appendChild(img);

    // 메뉴 이름과 가격 번역
    let translatedName = item.name;
    if (translations[currentLanguage] && translations[currentLanguage][item.name]) {
        translatedName = translations[currentLanguage][item.name];
    }

    // 메뉴 이름과 가격 추가
    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';
    itemInfo.innerHTML = `
        <div class="item-name">${translatedName}</div>
        <div class="item-price">₩ ${item.price.toLocaleString()}</div>
    `;
    menuItem.appendChild(itemInfo);

    // 메뉴 아이템 클릭 이벤트
    menuItem.addEventListener('click', () => {
        openPopup(item, translatedName);
    });

    return menuItem;
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
        basketItems = [];
        updateBasket();
    });

    // 메인 화면 버튼 이벤트 리스너
    document.querySelector('.main-page-button').addEventListener('click', () => {
        const message = translations[currentLanguage]["메인 화면으로 이동하시겠습니까?"] || "메인 화면으로 이동하시겠습니까?";
        if (confirm(message)) {
            window.location.href = 'index.html';
        }
    });
}

// 팝업 이벤트 리스너 설정
function setupPopupListeners() {
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

// 팝업 열기 함수 수정 - 항상 기본 옵션으로 시작하도록 변경
function openPopup(item, translatedName) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const popupDescription = document.getElementById('popup-description');
    const popupPrice = document.getElementById('popup-price');
    const quantitySpan = document.getElementById('quantity');

    // 현재 메뉴 아이템 설정
    currentMenuItem = item;
    currentMenuItem.translatedName = translatedName || item.name;
    currentQuantity = 1;

    // 옵션 초기화 - 항상 기본 옵션으로 설정
    resetOptionsToDefault(item);

    // 팝업 정보 업데이트
    popupTitle.textContent = translatedName || item.name;
    popupImage.src = item.image || 'placeholder.jpg';
    popupImage.alt = translatedName || item.name;
    popupDescription.textContent = item.description || '';
    popupPrice.textContent = `₩ ${item.price.toLocaleString()}`;
    quantitySpan.textContent = currentQuantity;

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
            if (isNonCoffee && optionTitle === translations[currentLanguage]["샷"] || optionTitle === '샷') {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });

// 3. 온도 선택 옵션 처리
handleTemperatureOptions(item);

// 3.5 샷 옵션 처리 (추가)
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
    selectedOptions = {
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
    const tempOptionValue = selectedOptions.temperature;
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
    if (selectedOptions.temperature === 'hot') {
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
                    selectedOptions.temperature = tempOption;
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
            selectedOptions.sweet = 'normal';
        } else {
            // 당도 조절이 불가능한 메뉴인 경우 옵션 그룹 숨김
            sweetGroup.style.display = 'none';
        }
    }
}

// 얼음 옵션 업데이트 함수
function updateIceOptions() {
    const iceGroup = document.querySelector('.option-group:has(.option-button[data-option-type="ice"])');
    
    if (iceGroup) {
        if (selectedOptions.temperature === 'hot') {
            // Hot 선택 시 얼음 옵션 비활성화
            document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
                button.disabled = true;
                button.classList.add('disabled');
            });
            // Hot일 때는 얼음 옵션 기본으로 설정
            document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
            selectedOptions.ice = 'normal';
        } else {
            // Ice 선택 시 얼음 옵션 활성화
            document.querySelectorAll('.option-button[data-option-type="ice"]').forEach(button => {
                button.disabled = false;
                button.classList.remove('disabled');
            });
            // Ice일 때는 얼음 기본 옵션 선택
            document.querySelector('.option-button[data-option-type="ice"][data-option-value="normal"]').classList.add('selected');
            selectedOptions.ice = 'normal';
        }
    }
}

// 팝업 닫기 함수
function closePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 다시 활성화
    currentMenuItem = null;
}

// 수량 감소 함수
function decreaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    if (currentQuantity > 1) {
        currentQuantity--;
        quantitySpan.textContent = currentQuantity;
    }
}

// 수량 증가 함수
function increaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
}

// 장바구니에 추가 함수 (팝업에서 호출)
function addToCart() {
    if (currentMenuItem) {
        // 현재 선택된 옵션으로 장바구니에 추가
        addToBasket(currentMenuItem, currentQuantity, {
            ...selectedOptions
        }, currentMenuItem.translatedName);
        closePopup();
    }
}
// 샷 옵션 처리 함수 추가
function handleShotOptions(item) {
    const shotGroup = document.querySelector('.option-group:has(.option-button[data-option-type="shot"])');
    
    if (shotGroup) {
        if (item.shotOptions === true) {
            // 샷 추가가 가능한 메뉴인 경우 옵션 그룹 표시
            shotGroup.style.display = 'block';
            
            // 샷 기본값 설정
            document.querySelector('.option-button[data-option-type="shot"][data-option-value="normal"]').classList.add('selected');
            selectedOptions.shot = 'normal';
        } else {
            // 샷 추가가 불가능한 메뉴인 경우 옵션 그룹 숨김
            shotGroup.style.display = 'none';
        }
    }
}