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

// HTML для меню настроек WebGram
const webgramSettingsHTML = `
<div class="sidebar-left-section-container webgram-settings-container">
    <div class="sidebar-left-section">
        <hr>
        <div class="sidebar-left-section-content">
            <div class="sidebar-left-h2 sidebar-left-section-name">
                <span class="i18n">WebGram Settings</span>
            </div>
            <div class="profile-buttons">
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-verified-toggle">
                    <div class="c-ripple"></div>
                    <div class="row-row row-title-row">
                        <div class="row-title" dir="auto">Verified Users</div>
                        <div class="row-title row-title-right row-title-right-secondary webgram-verified-count">0</div>
                    </div>
                    <span class="tgico row-icon"></span>
                </div>
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-emoji-toggle">
                    <div class="c-ripple"></div>
                    <div class="row-row row-title-row">
                        <div class="row-title" dir="auto">Emoji Status</div>
                        <div class="row-title row-title-right row-title-right-secondary webgram-emoji-count">0</div>
                    </div>
                    <span class="tgico row-icon"></span>
                </div>
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-clear-all">
                    <div class="c-ripple"></div>
                    <div class="row-title" dir="auto">Clear All Settings</div>
                    <span class="tgico row-icon"></span>
                </div>
            </div>
        </div>
    </div>
</div>
`;

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
    updateSettingsCounters();
}

// Функция для удаления верификации
function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
    updateSettingsCounters();
}

// Функция для добавления emoji статуса
function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
    updateSettingsCounters();
}

// Функция для удаления emoji статуса
function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
    updateSettingsCounters();
}

// Функция для полной настройки пользователя
function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
    updateSettingsCounters();
}

// Функция для обновления счетчиков в настройках
function updateSettingsCounters() {
    const verifiedCount = Object.values(usersConfig).filter(user => user.verified).length;
    const emojiCount = Object.values(usersConfig).filter(user => user.emojiStatus).length;
    
    const verifiedCounter = document.querySelector('.webgram-verified-count');
    const emojiCounter = document.querySelector('.webgram-emoji-count');
    
    if (verifiedCounter) {
        verifiedCounter.textContent = verifiedCount;
    }
    
    if (emojiCounter) {
        emojiCounter.textContent = emojiCount;
    }
}

// Функция для добавления кнопки в меню
function addMenuButton() {
    const menu = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button > div.btn-menu.bottom-right.active.was-open");
    
    if (!menu) return;
    
    // Проверяем, есть ли уже кнопка WebGram Settings
    const existingButton = menu.querySelector('.webgram-settings-button');
    if (existingButton) return;
    
    // Создаем кнопку WebGram Settings
    const webgramButtonHTML = `
        <div class="btn-menu-item rp-overflow webgram-settings-button">
            <span class="tgico btn-menu-item-icon"></span>
            <span class="btn-menu-item-text">WebGram Settings</span>
        </div>
    `;
    
    // Находим разделитель перед Settings и добавляем перед ним
    const settingsItem = menu.querySelector('.btn-menu-item:has(.btn-menu-item-text:contains("Settings"))');
    if (settingsItem) {
        settingsItem.insertAdjacentHTML('beforebegin', webgramButtonHTML);
        
        // Добавляем обработчик клика
        const newButton = menu.querySelector('.webgram-settings-button');
        newButton.addEventListener('click', openWebGramSettings);
    }
}

// Функция для открытия настроек WebGram
function openWebGramSettings() {
    // Закрываем текущее меню
    const closeButton = document.querySelector('.sidebar-close-button');
    if (closeButton) {
        closeButton.click();
    }
    
    // Ждем немного и открываем настройки
    setTimeout(() => {
        const settingsButton = document.querySelector('.btn-menu-item:has(.btn-menu-item-text:contains("Settings"))');
        if (settingsButton) {
            settingsButton.click();
            
            // Ждем открытия настроек и добавляем наш раздел
            setTimeout(addWebGramSettingsSection, 500);
        }
    }, 100);
}

// Функция для добавления раздела настроек WebGram
function addWebGramSettingsSection() {
    const settingsContainer = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active");
    
    if (!settingsContainer) return;
    
    // Проверяем, есть ли уже наш раздел
    const existingSection = settingsContainer.querySelector('.webgram-settings-container');
    if (existingSection) return;
    
    // Находим контейнер для секций и добавляем наш раздел
    const sectionsContainer = settingsContainer.querySelector('.sidebar-content .scrollable > div:last-child');
    if (sectionsContainer) {
        sectionsContainer.insertAdjacentHTML('beforebegin', webgramSettingsHTML);
        
        // Добавляем обработчики событий
        addSettingsEventHandlers();
        updateSettingsCounters();
    }
}

// Функция для добавления обработчиков событий в настройках
function addSettingsEventHandlers() {
    // Обработчик для переключения верифицированных пользователей
    const verifiedToggle = document.querySelector('.webgram-verified-toggle');
    if (verifiedToggle) {
        verifiedToggle.addEventListener('click', () => {
            // Здесь можно добавить логику для управления верифицированными пользователями
            alert('Verified users management - coming soon!');
        });
    }
    
    // Обработчик для переключения emoji статусов
    const emojiToggle = document.querySelector('.webgram-emoji-toggle');
    if (emojiToggle) {
        emojiToggle.addEventListener('click', () => {
            // Здесь можно добавить логику для управления emoji статусами
            alert('Emoji status management - coming soon!');
        });
    }
    
    // Обработчик для очистки всех настроек
    const clearAll = document.querySelector('.webgram-clear-all');
    if (clearAll) {
        clearAll.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all WebGram settings?')) {
                Object.keys(usersConfig).forEach(userId => {
                    delete usersConfig[userId];
                });
                addVerificationAndStatus();
                updateSettingsCounters();
                alert('All WebGram settings have been cleared!');
            }
        });
    }
}

// Функция для проверки и добавления элементов интерфейса
function checkAndAddUIElements() {
    addMenuButton();
    addWebGramSettingsSection();
}

// Инициализация и запуск наблюдателя
function init() {
    addVerificationAndStatus();
    
    const observer = new MutationObserver(() => {
        addVerificationAndStatus();
        checkAndAddUIElements();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-peer-id']
    });
    
    // Также периодически проверяем наличие элементов
    setInterval(() => {
        addVerificationAndStatus();
        checkAndAddUIElements();
    }, 3000);
    
    // Начальная проверка
    checkAndAddUIElements();
}

// Автозапуск
init();
