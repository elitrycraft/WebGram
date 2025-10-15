// Конфигурация пользователей
const usersConfig = {
};

// Селекторы для разных мест отображения имени пользователя
const selectors = [
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big.is-muted._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span.peer-title.with-icons",
    "#column-center > div.chats-container.tabs-container > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
    "#column-right > div > div > div.sidebar-content > div > div.profile-content > div.profile-avatars-container.is-single > div.profile-avatars-info > div.profile-name > span"
];

// HTML для verified иконки
const verifiedIconHTML = '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';

// Функция для получения emoji статуса
function getEmojiStatusHTML(docId) {
    return `<span class="emoji-status media-sticker-wrapper" data-doc-id="${docId}"><img class="media-sticker" src="blob:https://web.telegram.org/c9e9a04a-184b-40a7-9e78-79fd4e719ed1"></span>`;
}

// Основная функция добавления элементов
function addVerificationAndStatus() {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            if (!element) return;
            
            const peerId = element.getAttribute('data-peer-id');
            if (!peerId) return;
            
            const userId = parseInt(peerId);
            const userConfig = usersConfig[userId];
            
            if (!userConfig) return;
            
            if (userConfig.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += verifiedIconHTML;
            }
            
            if (userConfig.emojiStatus && !element.querySelector('.emoji-status')) {
                element.innerHTML += getEmojiStatusHTML(userConfig.emojiStatus);
            }
        });
    });
}

// Функция для добавления верификации пользователю
function addVerification(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
    }
    usersConfig[userId].verified = true;
    addVerificationAndStatus();
}

// Функция для удаления верификации
function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
}

// Функция для добавления emoji статуса
function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
}

// Функция для удаления emoji статуса
function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
}

// Функция для полной настройки пользователя
function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
}

// Инициализация и запуск наблюдателя
function init() {
    addVerificationAndStatus();
    
    const observer = new MutationObserver(() => {
        addVerificationAndStatus();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-peer-id']
    });
    
    setInterval(() => {
        addVerificationAndStatus();
    }, 3000);
}

// Автозапуск
init();
setEmojiStatus(7899534962, 5251550383624443434)
