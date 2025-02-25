// 메뉴 데이터 정의
const menuData = {
    coffee: [
        { id: 1, name: '아메리카노', price: 6000, image: 'images/Americano.png' },
        { id: 2, name: '카페라떼', price: 5000, image: 'images/CaffeLatte.png' },
        { id: 3, name: '바닐라라떼', price: 5500, image: 'images/VanillaLatte.png' },
        { id: 4, name: '카페모카', price: 5500, image: 'images/CaffeMocha.png' },
        { id: 5, name: '우도땅콩크림라떼', price: 6000, image: 'images/UdoPeanutCreamLatte.png' },
        { id: 6, name: '흑임자크림라떼', price: 6000, image: 'images/BlackSesameCreamLatte.png' },
        { id: 7, name: '우도땅콩아이스크림라떼', price: 6500, image: 'images/UdoPeanutIceCreamLatte.png' },
        { id: 8, name: '우도땅콩 아포카토', price: 6500, image: 'images/UdoPeanutAffogato.png' },
        { id: 9, name: '에스프레소', price: 4000, image: 'images/Espresso.png' }
    ],
    'non-coffee': [
        { id: 10, name: '녹차', price: 4500, image: 'images/GreenTea.png' },
        { id: 11, name: '얼그레이', price: 4500, image: 'images/EarlGrey.png' },
        { id: 12, name: '제주감귤차', price: 5000, image: 'images/JejuTangerineTea.png' }
    ],
    dessert: [
        { id: 13, name: '크로플', price: 5500, image: 'images/Croffle.png' },
        { id: 14, name: '우도땅콩 케이크', price: 6500, image: 'images/UdoPeanutCake.png' },
        { id: 15, name: '생맥주', price: 7000, image: 'images/DraftBeer.png' }
    ]
};

// 메뉴 아이템 생성 함수
function createMenuItem(item, addToBasketCallback) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.dataset.id = item.id;
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    
    menuItem.appendChild(img);
    
// 메뉴 이름과 가격 추가
const itemInfo = document.createElement('div');
itemInfo.className = 'item-info';
itemInfo.innerHTML = `
    <div class="item-name">${item.name}</div>
    <div class="item-price">₩ ${item.price.toLocaleString()}</div>
`;
    
    menuItem.appendChild(itemInfo);
    
    // 클릭 이벤트 추가 - 장바구니에 추가
    menuItem.addEventListener('click', () => {
        addToBasketCallback(item);
    });
    
    return menuItem;
}

// 외부에서 사용할 함수들 내보내기
export { menuData, createMenuItem };