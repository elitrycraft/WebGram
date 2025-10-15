const usersConfig = {};
let settingsAdded = false; // Флаг чтобы не добавлять кнопку многократно

const selectors = [
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big.is-muted._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span.peer-title.with-icons",
    "#column-center > div.chats-container.tabs-container > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
    "#column-right > div > div > div.sidebar-content > div > div.profile-content > div.profile-avatars-container.is-single > div.profile-avatars-info > div.profile-name > span"
];

function addVerificationAndStatus() {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element) return;
            
            // Ищем peer-id в родительских элементах если в текущем нет
            let peerId = element.getAttribute('data-peer-id');
            let currentElement = element;
            
            while (!peerId && currentElement.parentElement) {
                currentElement = currentElement.parentElement;
                peerId = currentElement.getAttribute('data-peer-id');
                if (currentElement === document.body) break;
            }
            
            if (!peerId) return;
            
            const userId = parseInt(peerId);
            if (isNaN(userId)) return;
            
            const userConfig = usersConfig[userId];
            if (!userConfig) return;
            
            // Удаляем старые иконки перед добавлением новых
            const oldVerified = element.querySelector('.verified-icon');
            const oldEmoji = element.querySelector('.emoji-status');
            if (oldVerified) oldVerified.remove();
            if (oldEmoji) oldEmoji.remove();
            
            // Добавляем верификацию
            if (userConfig.verified) {
                const verifiedIcon = document.createElement('span');
                verifiedIcon.className = 'verified-icon';
                verifiedIcon.innerHTML = '<svg viewBox="0 0 26 26" width="16" height="16" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg>';
                element.appendChild(verifiedIcon);
            }
            
            // Добавляем emoji статус
            if (userConfig.emojiStatus) {
                const emojiStatus = document.createElement('span');
                emojiStatus.className = 'emoji-status media-sticker-wrapper';
                emojiStatus.setAttribute('data-doc-id', userConfig.emojiStatus);
                emojiStatus.innerHTML = '<img class="media-sticker" src="https://web.telegram.org/k/assets/img/verified-icon.png" style="width: 16px; height: 16px;">';
                element.appendChild(emojiStatus);
            }
        });
    });
}

function update_settings() {
    if (settingsAdded) return;
    if (!document.querySelector("#column-left > div.sidebar-slider.tabs-container > div > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button > div.btn-menu.bottom-right.active.was-open"))
    
    const element = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button > div.btn-menu.bottom-right.active.was-open");
    
    if (element && !document.querySelector("#column-left > div.sidebar-slider.tabs-container > div > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button > div.btn-menu.bottom-right.active.was-open")) {
        const menuElement = element.querySelector('.btn-menu.bottom-right.active.was-open') || element;
        element.className = 'btn-menu-item rp-overflow webgram-btn';
        element.innerHTML = '<span class="tgico btn-menu-item-icon"></span><span class="i18n btn-menu-item-text">WebGram</span>';
        
        menuElement.appendChild(webgramBtn);
        settingsAdded = true;
    }
}

function addVerification(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
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
        usersConfig[userId] = { verified: false, emojiStatus: null };
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

function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
}

// Запускаем с задержкой чтобы DOM успел загрузиться
setTimeout(() => {
    addVerificationAndStatus();
    update_settings();
}, 1000);

// Увеличиваем интервал чтобы не нагружать страницу
setInterval(addVerificationAndStatus, 5000);
setInterval(update_settings, 5000);
