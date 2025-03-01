// 메뉴 데이터
export const menuData = {
    coffee: [
        {
            id: 'americano',
            name: '아메리카노',
            price: 6000,
            image: 'images/Americano.png',
            temperatureOptions: ['ice', 'hot'],
            sweetOptions: false,
            shotOptions: true // 샷 추가 가능
        },
        {
            id: 'caffe-latte',
            name: '카페라떼',
            price: 6500,
            image: 'images/CaffeLatte.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: false, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'vanilla-latte',
            name: '바닐라라떼',
            price: 7000,
            image: 'images/VanillaLatte.png',
            temperatureOptions: ['ice', 'hot'],// 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'caffe-mocha',
            name: '카페모카',
            price: 7000,
            image: 'images/CaffeMocha.png',
            temperatureOptions: ['ice', 'hot'],// 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'udo-peanut-latte',
            name: '우도땅콩크림라떼',
            price: 8500,
            image: 'images/UdoPeanutCreamLatte.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'black-sesame-latte',
            name: '흑임자크림라떼',
            price: 8500,
            image: 'images/BlackSesameCreamLatte.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'udo-peanut-ice-cream-latte',
            name: '우도땅콩 아이스크림라떼',
            price: 9000,
            image: 'images/UdoPeanutIceCreamLatte.png',
            temperatureOptions: ['ice'], // 아이스만 가능한 메뉴
            sweetOptions: false, // 당도 조절 불가능
            shotOptions: true // 샷 추가 가능

        },
        {
            id: 'udo-peanut-affogato',
            name: '우도땅콩 아포카토',
            price: 9000,
            image: 'images/UdoPeanutAffogato.png',
            temperatureOptions: ['ice'], // 아이스만 가능한 메뉴
            sweetOptions: false, // 당도 조절 불가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'espresso',
            name: '에스프레소',
            price: 5000,
            image: 'images/Espresso.png',
            temperatureOptions: ['hot'], // 핫만 가능한 메뉴
            sweetOptions: false, // 당도 조절 불가능
            shotOptions: false // 샷 추가 불가능

        }
    ],
    'non-coffee': [
        {
            id: 'chamomile',
            name: '캐모마일',
            price: 6000,
            image: 'images/ChamomileTea.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: false, // 당도 조절 불가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'green-tangerine-tea',
            name: '청귤차',
            price: 6000,
            image: 'images/GreenTangerineTea.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'hallabong-tea',
            name: '한라봉차',
            price: 6000,
            image: 'images/HallabongTea.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true // 당도 조절 가능
        },
        {
            id: 'chocolate-latte',
            name: '초코라떼',
            price: 7000,
            image: 'images/ChocolateLatte.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'green-tea-latte',
            name: '녹차라떼',
            price: 7000,
            image: 'images/GreenTeaLatte.png',
            temperatureOptions: ['ice', 'hot'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: true // 샷 추가 불가능

        },
        {
            id: 'green-tangerine-ade',
            name: '청귤에이드',
            price: 7000,
            image: 'images/GreenTangerineAde.png',
            temperatureOptions: ['ice'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'hallabong-ade',
            name: '한라봉에이드',
            price: 7000,
            image: 'images/HallabongAde.png',
            temperatureOptions: ['ice'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'blue-lemon-ade',
            name: '블루레몬에이드',
            price: 7000,
            image: 'images/BlueLemonAde.png',
            temperatureOptions: ['ice'], // 둘 다 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        },
        {
            id: 'strawberry-milk-tea',
            name: '딸기밀크티라떼',
            price: 8500,
            image: 'images/StrawberryMilkTeaLatte.png',
            temperatureOptions: ['ice'], // 아이스만 가능한 메뉴
            sweetOptions: true, // 당도 조절 가능
            shotOptions: false // 샷 추가 불가능

        }
    ],
    'dessert': [
        {
            id: 'udo-peanut-ice-cream',
            name: '우도땅콩 아이스크림',
            price: 5000,
            image: 'images/UdoPeanutIceCream.png'
        },
        {
            id: 'udo-peanut-ice-cream-croffle',
            name: '우도땅콩 아이스크림과 크로플',
            price: 10000,
            image: 'images/UdoPeanutIceCreamCroffle.png'
        },
        {
            id: '1664-blanc',
            name: '1664 블랑',
            price: 8000,
            image: 'images/1664Blanc.png'
        },
        {
            id: 'big-wave',
            name: '빅 웨이브',
            price: 9000,
            image: 'images/BigWave.png'
        },
        {
            id: 'corona',
            name: '코로나',
            price: 7000,
            image: 'images/corona.png'
        },
        {
            id: 'kelly',
            name: '켈리',
            price: 5000,
            image: 'images/kelly.png'
        }
    ]
};