const usersConfig = {
    7371569753: {
        verified: false,
        emojiStatus: null,
        premium: true,
        gifts: ["5397915559037785261"]
    },
    5666666768: {
        verified: true,
        emojiStatus: "5251550383624443434",
        premium: false,
        gifts: ["5397915559037785261"]
    },
    777000: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: []
    },
    7702440572: {
        verified: false,
        emojiStatus: null,
        premium: true,
        gifts: []
    },
    6975201668: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: ["5397915559037785261"]
    },
    591678038: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: []
    },
    5434504334: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: []
    }
};

const selectors = [
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span",
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big.is-muted._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span.peer-title.with-icons",
    "#column-center > div.chats-container.tabs-container > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
    "#column-right > div > div > div.sidebar-content > div > div.profile-content > div.profile-avatars-container > div.profile-avatars-info > div.profile-name > span",
    "#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active > div.sidebar-content > div > div.profile-content.is-me > div.profile-avatars-container > div.profile-avatars-info > div.profile-name > span",
    "#column-center .bubbles-inner .peer-title"
];

function addVerificationAndStatus() {
    // Обрабатываем основные селекторы
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element) return;
            const peerId = element.getAttribute('data-peer-id');
            if (!peerId) return;
            const userId = parseInt(peerId);
            const userConfig = usersConfig[userId];
            if (!userConfig) return;

            // Добавляем класс with-icons если его нет
            if (!element.classList.contains('with-icons')) {
                element.classList.add('with-icons');
                element.setAttribute('data-with-icons', '1');
            }

            // Сохраняем текущее содержимое имени
            let nameText = element.textContent;
            const existingInner = element.querySelector('.peer-title-inner');
            if (existingInner) {
                nameText = existingInner.textContent;
            }

            // Добавляем premium иконку
            if (userConfig.premium && !element.querySelector('.premium-icon')) {
                element.innerHTML += '<span class="tgico premium-icon"></span>';
            }

            // Добавляем verified иконку
            if (userConfig.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
            }
        });
    });

    // Обрабатываем сообщения в чате отдельно
    const messageSections = document.querySelectorAll("#column-center .bubbles-inner section");
    messageSections.forEach(section => {
        const messageElements = section.querySelectorAll('.peer-title');
        messageElements.forEach(element => {
            if (!element) return;
            const peerId = element.getAttribute('data-peer-id');
            if (!peerId) return;
            const userId = parseInt(peerId);
            const userConfig = usersConfig[userId];
            if (!userConfig) return;

            // Добавляем класс with-icons если его нет
            if (!element.classList.contains('with-icons')) {
                element.classList.add('with-icons');
                element.setAttribute('data-with-icons', '1');
            }

            // Сохраняем текущее содержимое имени
            let nameText = element.textContent;
            const existingInner = element.querySelector('.peer-title-inner');
            if (existingInner) {
                nameText = existingInner.textContent;
            }

            // Очищаем и создаем новую структуру
            element.innerHTML = `<span class="peer-title-inner" dir="auto">${nameText}</span>`;

            // Добавляем premium иконку
            if (userConfig.premium && !element.querySelector('.premium-icon')) {
                element.innerHTML += '<span class="tgico premium-icon"></span>';
            }

            // Добавляем verified иконку
            if (userConfig.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
            }
        });
    });

    // Создаем раздел подарков если его нет
    createGiftsSection();
}

function createGiftsSection() {
    // Проверяем открыт ли профиль пользователя
    const profileContent = document.querySelector("#column-right > div > div > div.sidebar-content > div > div.profile-content");
    if (!profileContent) return;

    // Получаем ID текущего пользователя из профиля
    const profileName = document.querySelector("#column-right .profile-name .peer-title");
    if (!profileName) return;
    
    const peerId = profileName.getAttribute('data-peer-id');
    if (!peerId) return;
    
    const userId = parseInt(peerId);
    const userConfig = usersConfig[userId];
    
    // Создаем раздел только если у пользователя есть подарки
    if (userConfig && userConfig.gifts && userConfig.gifts.length > 0) {
        // Проверяем есть ли уже раздел подарков
        let giftsSection = document.querySelector("#column-right .search-super");
        
        if (!giftsSection) {
            // Создаем HTML для раздела подарков
            const giftsHTML = `
                <div class="search-super is-full-viewport">
                    <div class="search-super-tabs-scrollable menu-horizontal-scrollable sticky">
                        <div>
                            <nav>
                                <div class="menu-horizontal-div-item rp">
                                    <div class="c-ripple"></div>
                                    <span class="menu-horizontal-div-item-span">
                                        <span class="i18n search-super-pinned-gifts-wrap">Gifts
                                            <div class="search-super-pinned-gifts">
                                                <div data-doc-id="${userConfig.gifts[0]}" class="media-sticker-wrapper">
                                                    <img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/77ba17f4-af0d-4e8d-9834-59cad1aec979">
                                                </div>
                                            </div>
                                        </span>
                                        <i></i>
                                    </span>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <div class="search-super-tabs-container tabs-container">
                        <div class="search-super-tab-container search-super-container-gifts tabs-tab active">
                            <div>
                                ${userConfig.gifts.map(giftId => `
                                    <div class="_tab_v214n_1">
                                        <div class="_grid_25wsi_6 _grid_v214n_6">
                                            <div class="_gridItem_25wsi_20 _viewProfile_25wsi_15" style="--overlay-color: #000000;">
                                                <div class="_itemSticker_25wsi_155 media-sticker-wrapper" data-doc-id="${giftId}">
                                                    <canvas class="rlottie" width="120" height="120"></canvas>
                                                </div>
                                                <div class="_itemFrom_25wsi_96">
                                                    <div class="_itemFromAnonymous_25wsi_104">
                                                        <img src="assets/img/anon_paid_reaction.png" alt="Anonymous">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Добавляем раздел подарков в профиль
            profileContent.insertAdjacentHTML('beforeend', giftsHTML);
            console.log('Раздел подарков создан для пользователя', userId);
        }
    }
}

function addVerification(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false, gifts: [] };
    }
    usersConfig[userId].verified = true;
    addVerificationAndStatus();
}

function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
}

function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false, gifts: [] };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
}

function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
}

function setPremium(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false, gifts: [] };
    }
    usersConfig[userId].premium = true;
    addVerificationAndStatus();
}

function removePremium(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].premium = false;
    }
    addVerificationAndStatus();
}

function addGift(userId, giftId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false, gifts: [] };
    }
    if (!usersConfig[userId].gifts.includes(giftId)) {
        usersConfig[userId].gifts.push(giftId);
    }
    addVerificationAndStatus();
}

function removeGift(userId, giftId) {
    if (usersConfig[userId] && usersConfig[userId].gifts) {
        usersConfig[userId].gifts = usersConfig[userId].gifts.filter(id => id !== giftId);
    }
    addVerificationAndStatus();
}

function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
}

// Запускаем сразу и часто проверяем
addVerificationAndStatus();
setInterval(addVerificationAndStatus, 1000);
