// static/script.js (대체 이미지 수정)

document.addEventListener('DOMContentLoaded', () => {
    
    const saunaContainer = document.getElementById('sauna-container');
    const searchInput = document.getElementById('search-input');
    const langEnButton = document.getElementById('lang-en');
    const langJaButton = document.getElementById('lang-ja');
    const langKoButton = document.getElementById('lang-ko');

    let allSaunas = [];

    // [추가됨] 랜덤 대체 이미지를 위한 이미지 URL 목록
    const fallbackImages = [
        'https://thumbnews.nateimg.co.kr/view610///news.nateimg.co.kr/orgImg/at/2025/07/11/20250711001747208_1752224347_2.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_DOBmrLk0nfaLyvq-OC-nBxWtISid9EN5ycwIFIaZkcXaeovozxlBitD1hFtebCAFrMs&usqp=CAU',
        'https://i.namu.wiki/i/1Ys8WVkTy2Qckyk6Ow31xuyZwA__BvETvarbIVt7H5KvqTamO9kqTfSx9VyjfN_OtBjcZCWOmC0LAyaUtiB40A.webp',
        'https://i.namu.wiki/i/v9lc4Q3ynexdoCjiZvhDEUmBo2rcsirmVOt4JBC89uxnbi4a7PbznGxkqaYgED7e0HbNmflpSnu7xv7bbAKQWA.webp',
        'https://i.namu.wiki/i/ssZkF4depYWudkufVjU7F0QxhCjJJxQIPn3OODLDXcxRII_h50lI0JJiAWsz-9XyfySNDK5Hc8MFATDZh4RHNQ.webp',
        'https://tourteller.com/blog/wp-content/uploads/2020/07/Korean-spa-1.jpg',
        'https://www.korea.net/upload/fileShare/2023/08/usr_1690865489359.jpg',
        'https://img.khan.co.kr/news/2020/01/05/l_2020010301000328500021691.jpg'
    ];

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const displaySaunas = (saunas) => {
        let currentLang = document.querySelector('.btn-group .active')?.dataset.lang || 'ko';
        let cardsHtml = '';
        if (!saunas || saunas.length === 0) {
            cardsHtml = '<p class="text-center text-secondary">결과를 찾을 수 없습니다. 다른 검색어로 시도해 보세요.</p>';
        } else {
            saunas.forEach(sauna => {
                const name = sauna[`name_${currentLang}`] || sauna['name_ko'];
                const address = sauna[`address_${currentLang}`] || sauna['address_ko'];
                const imageUrl = sauna.image_url || 'https://placehold.co/600x400/EFEFEF/777777?text=No+Image';

                // [수정됨] onerror 발생 시, fallbackImages 배열에서 랜덤으로 이미지를 선택하도록 변경
                const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

                cardsHtml += `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${imageUrl}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='${randomFallback}';">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text text-muted flex-grow-1">${address}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        saunaContainer.innerHTML = cardsHtml;
    };

    const applyFilters = () => {
        const nameQuery = searchInput.value.toLowerCase();
        let filteredData = allSaunas;
        if (nameQuery) {
            filteredData = allSaunas.filter(sauna => 
                (sauna.name_ko && sauna.name_ko.toLowerCase().includes(nameQuery)) ||
                (sauna.name_en && sauna.name_en.toLowerCase().includes(nameQuery)) ||
                (sauna.name_ja && sauna.name_ja.toLowerCase().includes(nameQuery))
            );
        }
        displaySaunas(filteredData);
    };
    
    const initialize = async () => {
        try {
            // static 폴더의 JSON 파일을 직접 fetch 합니다.
            const response = await fetch('static/my_data.json');
            if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
            
            allSaunas = await response.json();
            displaySaunas(allSaunas);

        } catch (error) {
            console.error("초기화 중 오류 발생:", error);
            saunaContainer.innerHTML = `<p class="text-center text-danger">데이터를 불러오는 중 오류가 발생했습니다. static 폴더에 my_data.json 파일이 있는지 확인해주세요.</p>`;
        }
    };

    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    document.querySelectorAll('.btn-group .btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelector('.btn-group .active')?.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.dataset.lang = e.currentTarget.id.replace('lang-', '');
            applyFilters();
        });
    });
    
    langKoButton.classList.add('active');
    langKoButton.dataset.lang = 'ko';
    
    initialize();
});
