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

// Функция для добавления кнопки в главное меню
function addMenuButton() {
    const menu = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.item-main.active > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button > div.btn-menu.bottom-right.active.was-open");
    
    if (!menu) return;
    
    // Проверяем, есть ли уже кнопка WebGram Settings
    const existingButton = menu.querySelector('.webgram-settings-button');
    if (existingButton) return;
    
    // Создаем кнопку WebGram Settings
    const webgramButtonHTML = `
        <div class="btn-menu-item rp-overflow webgram-settings-button">
            <span class="tgico btn-menu-item-icon"></span>
            <span class="btn-menu-item-text">WebGram Settings</span>
        </div>
    `;
    
    // Находим разделитель перед Settings и добавляем перед ним
    const settingsItem = Array.from(menu.querySelectorAll('.btn-menu-item')).find(item => 
        item.querySelector('.btn-menu-item-text') && 
        item.querySelector('.btn-menu-item-text').textContent.includes('Settings')
    );
    
    if (settingsItem) {
        // Добавляем перед Settings
        settingsItem.insertAdjacentHTML('beforebegin', webgramButtonHTML);
        
        // Добавляем разделитель
        settingsItem.insertAdjacentHTML('beforebegin', '<hr>');
        
        // Добавляем обработчик клика
        const newButton = menu.querySelector('.webgram-settings-button');
        newButton.addEventListener('click', openWebGramSettings);
    } else {
        // Если не нашли Settings, добавляем в конец перед More
        const moreItem = menu.querySelector('.submenu-trigger');
        if (moreItem) {
            moreItem.insertAdjacentHTML('beforebegin', '<hr>');
            moreItem.insertAdjacentHTML('beforebegin', webgramButtonHTML);
            
            const newButton = menu.querySelector('.webgram-settings-button');
            newButton.addEventListener('click', openWebGramSettings);
        }
    }
}

// Функция для открытия настроек WebGram
function openWebGramSettings() {
    console.log('Opening WebGram Settings...');
    
    // Закрываем текущее меню (кликаем по любому элементу чтобы закрыть меню)
    const menuButton = document.querySelector('#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.item-main.active > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button');
    if (menuButton) {
        menuButton.click();
    }
    
    // Ждем немного и открываем настройки
    setTimeout(() => {
        const settingsButton = document.querySelector('.btn-menu-item:has(.btn-menu-item-text:contains("Settings"))');
        if (settingsButton) {
            settingsButton.click();
            
            // Ждем открытия настроек и добавляем наш раздел
            setTimeout(() => {
                addWebGramSettingsSection();
                // Прокручиваем к нашему разделу
                const webgramSection = document.querySelector('.webgram-settings-container');
                if (webgramSection) {
                    webgramSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 800);
        } else {
            console.log('Settings button not found');
        }
    }, 200);
}

// Функция для добавления раздела настроек WebGram
function addWebGramSettingsSection() {
    const settingsContainer = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active");
    
    if (!settingsContainer) {
        console.log('Settings container not found');
        return;
    }
    
    // Проверяем, есть ли уже наш раздел
    const existingSection = settingsContainer.querySelector('.webgram-settings-container');
    if (existingSection) {
        console.log('WebGram settings section already exists');
        return;
    }
    
    // Находим контейнер для секций
    const sectionsContainer = settingsContainer.querySelector('.sidebar-content .scrollable > div:last-child');
    const premiumSection = settingsContainer.querySelector('.sidebar-left-section-container:has(.row-icon-premium-color)');
    
    if (sectionsContainer) {
        // Добавляем перед последней секцией (обычно это Premium секция)
        sectionsContainer.insertAdjacentHTML('beforebegin', webgramSettingsHTML);
        console.log('WebGram settings section added successfully');
        
        // Добавляем обработчики событий
        addSettingsEventHandlers();
        updateSettingsCounters();
    } else if (premiumSection) {
        // Добавляем перед Premium секцией
        premiumSection.insertAdjacentHTML('beforebegin', webgramSettingsHTML);
        console.log('WebGram settings section added before premium section');
        
        // Добавляем обработчики событий
        addSettingsEventHandlers();
        updateSettingsCounters();
    } else {
        console.log('Could not find suitable location for WebGram settings');
    }
}

// Функция для добавления обработчиков событий в настройках
function addSettingsEventHandlers() {
    // Обработчик для переключения верифицированных пользователей
    const verifiedToggle = document.querySelector('.webgram-verified-toggle');
    if (verifiedToggle) {
        verifiedToggle.addEventListener('click', () => {
            // Открываем модальное окно для управления верифицированными пользователями
            showVerifiedUsersModal();
        });
    }
    
    // Обработчик для переключения emoji статусов
    const emojiToggle = document.querySelector('.webgram-emoji-toggle');
    if (emojiToggle) {
        emojiToggle.addEventListener('click', () => {
            // Открываем модальное окно для управления emoji статусами
            showEmojiStatusModal();
        });
    }
    
    // Обработчик для очистки всех настроек
    const clearAll = document.querySelector('.webgram-clear-all');
    if (clearAll) {
        clearAll.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all WebGram settings? This will remove all verified users and emoji statuses.')) {
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

// Функция для показа модального окна верифицированных пользователей
function showVerifiedUsersModal() {
    const verifiedUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.verified)
        .map(([userId, config]) => ({ userId, config }));
    
    let modalContent = '<h3>Verified Users</h3>';
    
    if (verifiedUsers.length === 0) {
        modalContent += '<p>No verified users yet.</p>';
    } else {
        modalContent += '<ul>';
        verifiedUsers.forEach(({ userId }) => {
            modalContent += `<li>User ID: ${userId} <button onclick="removeVerification(${userId}); this.closest('li').remove();">Remove</button></li>`;
        });
        modalContent += '</ul>';
    }
    
    modalContent += `
        <div style="margin-top: 15px;">
            <input type="number" id="newVerifiedUserId" placeholder="Enter User ID">
            <button onclick="addNewVerifiedUser()">Add Verified User</button>
        </div>
    `;
    
    showModal(modalContent);
}

// Функция для показа модального окна emoji статусов
function showEmojiStatusModal() {
    const emojiUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.emojiStatus)
        .map(([userId, config]) => ({ userId, emojiStatus: config.emojiStatus }));
    
    let modalContent = '<h3>Emoji Status Users</h3>';
    
    if (emojiUsers.length === 0) {
        modalContent += '<p>No emoji statuses set yet.</p>';
    } else {
        modalContent += '<ul>';
        emojiUsers.forEach(({ userId, emojiStatus }) => {
            modalContent += `<li>User ID: ${userId} - Doc ID: ${emojiStatus} <button onclick="removeEmojiStatus(${userId}); this.closest('li').remove();">Remove</button></li>`;
        });
        modalContent += '</ul>';
    }
    
    modalContent += `
        <div style="margin-top: 15px;">
            <input type="number" id="newEmojiUserId" placeholder="User ID">
            <input type="text" id="newEmojiDocId" placeholder="Document ID">
            <button onclick="addNewEmojiStatus()">Add Emoji Status</button>
        </div>
    `;
    
    showModal(modalContent);
}

// Вспомогательная функция для показа модального окна
function showModal(content) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modal.innerHTML = content + '<br><button onclick="this.closest(\'div\').remove()" style="margin-top: 10px;">Close</button>';
    
    // Добавляем затемнение фона
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

// Функции для глобального доступа (для использования в модальных окнах)
window.addNewVerifiedUser = function() {
    const input = document.getElementById('newVerifiedUserId');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        input.value = '';
        showVerifiedUsersModal(); // Обновляем модальное окно
    }
};

window.addNewEmojiStatus = function() {
    const userIdInput = document.getElementById('newEmojiUserId');
    const docIdInput = document.getElementById('newEmojiDocId');
    const userId = parseInt(userIdInput.value);
    const docId = docIdInput.value;
    
    if (userId && !isNaN(userId) && docId) {
        setEmojiStatus(userId, docId);
        userIdInput.value = '';
        docIdInput.value = '';
        showEmojiStatusModal(); // Обновляем модальное окно
    }
};

// Функция для проверки и добавления элементов интерфейса
function checkAndAddUIElements() {
    addMenuButton();
    
    // Проверяем, открыты ли настройки, и если да - добавляем наш раздел
    const settingsActive = document.querySelector('#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active');
    if (settingsActive) {
        addWebGramSettingsSection();
    }
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
addVerification(7899534962);
