// 메뉴 데이터 정의
const menuData = {
    coffee: [
        { id: 1, name: '아메리카노', price: 6000, image: 'images/Americano.png' },
        { id: 2, name: '카페라떼', price: 6500, image: 'images/CaffeLatte.png' },
        { id: 3, name: '바닐라라떼', price: 7000, image: 'images/VanillaLatte.png' },
        { id: 4, name: '카페모카', price: 7000, image: 'images/CaffeMocha.png' },
        { id: 5, name: '우도땅콩크림라떼', price: 8500, image: 'images/UdoPeanutCreamLatte.png' },
        { id: 6, name: '흑임자크림라떼', price: 8500, image: 'images/BlackSesameCreamLatte.png' },
        { id: 7, name: '우도땅콩 아이스크림라떼', price: 9000, image: 'images/UdoPeanutIceCreamLatte.png' },
        { id: 8, name: '우도땅콩 아포카토', price: 9000, image: 'images/UdoPeanutAffogato.png' },
        { id: 9, name: '에스프레소', price: 5000, image: 'images/Espresso.png' }
    ],
    'non-coffee': [
        { id: 10, name: '캐모마일', price: 6000, image: 'images/ChamomileTea.png' },
        { id: 11, name: '청귤차', price: 6000, image: 'images/GreenTangerineTea.png' },
        { id: 12, name: '한라봉차', price: 6000, image: 'images/HallabongTea.png' },
        { id: 13, name: '초코라떼', price: 7000, image: 'images/ChocolateLatte.png' },
        { id: 14, name: '녹차라떼', price: 7000, image: 'images/GreenTeaLatte.png' },
        { id: 15, name: '청귤에이드', price: 7000, image: 'images/GreenTangerineAde.png' },
        { id: 16, name: '한라봉에이드', price: 7000, image: 'images/HallabongAde.png' },
        { id: 17, name: '블루레몬에이드', price: 7000, image: 'images/BlueLemonAde.png' },
        { id: 18, name: '딸기밀크티라떼', price: 8500, image: 'images/StrawberryMilkTeaLatte.png' }

    ],
    dessert: [
        { id: 19, name: '우도땅콩아이스크림', price: 5000, image: 'images/UdoPeanutIceCream.png' },
        { id: 20, name: '우도땅콩아이스크림과 크로플', price: 10000, image: 'images/UdoPeanutIceCreamCroffle.png' },
        { id: 21, name: '1664 블랑', price: 8000, image: 'images/1664Blanc.png' },
        { id: 22, name: '빅 웨이브', price: 9000, image: 'images/BigWave.png' },
        { id: 23, name: '코로나', price: 7000, image: 'images/Corona.png' },
        { id: 24, name: '켈리', price: 5000, image: 'images/Kelly.png' }
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
