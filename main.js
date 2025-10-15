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
                <span>WebGram Settings</span>
            </div>
            <div class="profile-buttons">
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-manage-verified">
                    <div class="c-ripple"></div>
                    <div class="row-row row-title-row">
                        <div class="row-title" dir="auto">Manage Verified Users</div>
                        <div class="row-title row-title-right row-title-right-secondary webgram-verified-count">0</div>
                    </div>
                    <span class="tgico row-icon"></span>
                </div>
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-manage-emoji">
                    <div class="c-ripple"></div>
                    <div class="row-row row-title-row">
                        <div class="row-title" dir="auto">Manage Emoji Status</div>
                        <div class="row-title row-title-right row-title-right-secondary webgram-emoji-count">0</div>
                    </div>
                    <span class="tgico row-icon"></span>
                </div>
                <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-quick-add">
                    <div class="c-ripple"></div>
                    <div class="row-title" dir="auto">Quick Add by ID</div>
                    <span class="tgico row-icon"></span>
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
    console.log(`Added verification for user ${userId}`);
}

// Функция для удаления верификации
function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
    updateSettingsCounters();
    console.log(`Removed verification for user ${userId}`);
}

// Функция для добавления emoji статуса
function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
    updateSettingsCounters();
    console.log(`Set emoji status for user ${userId}: ${docId}`);
}

// Функция для удаления emoji статуса
function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
    updateSettingsCounters();
    console.log(`Removed emoji status for user ${userId}`);
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
    
    // Находим кнопку Settings
    const settingsItem = Array.from(menu.querySelectorAll('.btn-menu-item')).find(item => {
        const textEl = item.querySelector('.btn-menu-item-text');
        return textEl && (textEl.textContent.includes('Settings') || textEl.textContent.includes('Настройки'));
    });
    
    if (settingsItem) {
        // Добавляем перед Settings
        settingsItem.insertAdjacentHTML('beforebegin', '<hr>');
        settingsItem.insertAdjacentHTML('beforebegin', webgramButtonHTML);
        
        // Добавляем обработчик клика
        const newButton = menu.querySelector('.webgram-settings-button');
        newButton.addEventListener('click', openWebGramSettings);
        console.log('WebGram button added to menu');
    }
}

// Функция для открытия настроек WebGram
function openWebGramSettings() {
    console.log('Opening WebGram Settings...');
    
    // Закрываем текущее меню
    const menuButton = document.querySelector('#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.item-main.active > div.sidebar-header.main-search-sidebar-header.can-have-forum > div.sidebar-header__btn-container > button');
    if (menuButton) {
        menuButton.click();
    }
    
    // Ждем и открываем настройки через клик по кнопке Settings в левом нижнем углу
    setTimeout(() => {
        const settingsButtons = document.querySelectorAll('.btn-menu-item');
        const settingsButton = Array.from(settingsButtons).find(btn => {
            const textEl = btn.querySelector('.btn-menu-item-text');
            return textEl && (textEl.textContent.includes('Settings') || textEl.textContent.includes('Настройки'));
        });
        
        if (settingsButton) {
            settingsButton.click();
            console.log('Settings button clicked');
            
            // Ждем открытия настроек и добавляем наш раздел
            setTimeout(() => {
                addWebGramSettingsSection();
            }, 1000);
        } else {
            console.log('Settings button not found, trying alternative method...');
            // Альтернативный способ: пытаемся найти и открыть настройки напрямую
            openSettingsDirectly();
        }
    }, 300);
}

// Альтернативный способ открытия настроек
function openSettingsDirectly() {
    const settingsSliders = document.querySelectorAll('.sidebar-slider-item');
    const settingsSlider = Array.from(settingsSliders).find(slider => 
        slider.classList.contains('settings-container') || 
        slider.querySelector('.sidebar-left-section[data-name="settings"]')
    );
    
    if (settingsSlider) {
        settingsSlider.classList.add('active');
        console.log('Settings opened directly');
        
        setTimeout(() => {
            addWebGramSettingsSection();
        }, 500);
    }
}

// Функция для добавления раздела настроек WebGram
function addWebGramSettingsSection() {
    let settingsContainer = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active");
    
    // Если не нашли по точному селектору, ищем любой активный контейнер настроек
    if (!settingsContainer) {
        settingsContainer = document.querySelector('.settings-container.active, .profile-container.active');
    }
    
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
    
    // Ищем контейнер для добавления нашего раздела
    const premiumSection = settingsContainer.querySelector('.sidebar-left-section-container:has(.row-icon-premium-color)');
    const generalSection = settingsContainer.querySelector('.sidebar-left-section-container:has(.row-icon:contains(""))');
    const lastSection = settingsContainer.querySelector('.sidebar-left-section-container:last-child');
    
    let insertBeforeElement = premiumSection || generalSection || lastSection;
    
    if (insertBeforeElement) {
        insertBeforeElement.insertAdjacentHTML('beforebegin', webgramSettingsHTML);
        console.log('WebGram settings section added successfully');
        
        // Добавляем обработчики событий
        addSettingsEventHandlers();
        updateSettingsCounters();
    } else {
        console.log('Could not find suitable location for WebGram settings');
    }
}

// Функция для добавления обработчиков событий в настройках
function addSettingsEventHandlers() {
    // Управление верифицированными пользователями
    const verifiedManage = document.querySelector('.webgram-manage-verified');
    if (verifiedManage) {
        verifiedManage.addEventListener('click', () => {
            showVerifiedUsersModal();
        });
    }
    
    // Управление emoji статусами
    const emojiManage = document.querySelector('.webgram-manage-emoji');
    if (emojiManage) {
        emojiManage.addEventListener('click', () => {
            showEmojiStatusModal();
        });
    }
    
    // Быстрое добавление по ID
    const quickAdd = document.querySelector('.webgram-quick-add');
    if (quickAdd) {
        quickAdd.addEventListener('click', () => {
            showQuickAddModal();
        });
    }
    
    // Очистка всех настроек
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
        .map(([userId]) => userId);
    
    let modalContent = `
        <h3>Verified Users (${verifiedUsers.length})</h3>
        <div style="max-height: 300px; overflow-y: auto; margin: 10px 0;">
    `;
    
    if (verifiedUsers.length === 0) {
        modalContent += '<p>No verified users yet.</p>';
    } else {
        modalContent += '<ul style="list-style: none; padding: 0;">';
        verifiedUsers.forEach(userId => {
            modalContent += `
                <li style="padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: between; align-items: center;">
                    <span>User ID: ${userId}</span>
                    <button onclick="removeVerification(${userId}); this.closest('li').remove(); updateModalCounters();" style="margin-left: 10px; background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Remove</button>
                </li>
            `;
        });
        modalContent += '</ul>';
    }
    
    modalContent += `</div>
        <div style="margin-top: 15px;">
            <h4>Add Verified User</h4>
            <input type="number" id="newVerifiedUserId" placeholder="Enter User ID" style="padding: 8px; width: 200px; margin-right: 10px;">
            <button onclick="addNewVerifiedUser()" style="padding: 8px 16px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">Add</button>
        </div>
    `;
    
    showModal(modalContent, 'verified-modal');
}

// Функция для показа модального окна emoji статусов
function showEmojiStatusModal() {
    const emojiUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.emojiStatus)
        .map(([userId, config]) => ({ userId, emojiStatus: config.emojiStatus }));
    
    let modalContent = `
        <h3>Emoji Status Users (${emojiUsers.length})</h3>
        <div style="max-height: 300px; overflow-y: auto; margin: 10px 0;">
    `;
    
    if (emojiUsers.length === 0) {
        modalContent += '<p>No emoji statuses set yet.</p>';
    } else {
        modalContent += '<ul style="list-style: none; padding: 0;">';
        emojiUsers.forEach(({ userId, emojiStatus }) => {
            modalContent += `
                <li style="padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: between; align-items: center;">
                    <div>
                        <div>User ID: ${userId}</div>
                        <div style="font-size: 12px; color: #666;">Doc ID: ${emojiStatus}</div>
                    </div>
                    <button onclick="removeEmojiStatus(${userId}); this.closest('li').remove(); updateModalCounters();" style="margin-left: 10px; background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Remove</button>
                </li>
            `;
        });
        modalContent += '</ul>';
    }
    
    modalContent += `</div>
        <div style="margin-top: 15px;">
            <h4>Add Emoji Status</h4>
            <div style="margin-bottom: 10px;">
                <input type="number" id="newEmojiUserId" placeholder="User ID" style="padding: 8px; width: 120px; margin-right: 10px;">
                <input type="text" id="newEmojiDocId" placeholder="Document ID" style="padding: 8px; width: 150px; margin-right: 10px;">
                <button onclick="addNewEmojiStatus()" style="padding: 8px 16px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">Add</button>
            </div>
            <div style="font-size: 12px; color: #666;">
                <strong>Popular Document IDs:</strong><br>
                • 1234567890 - Star<br>
                • 9876543210 - Heart<br>
                • 5555555555 - Fire
            </div>
        </div>
    `;
    
    showModal(modalContent, 'emoji-modal');
}

// Функция для быстрого добавления по ID
function showQuickAddModal() {
    let modalContent = `
        <h3>Quick Add by ID</h3>
        <div style="margin: 15px 0;">
            <h4>Add Verification</h4>
            <input type="number" id="quickVerifiedId" placeholder="User ID for verification" style="padding: 8px; width: 200px; margin-right: 10px;">
            <button onclick="quickAddVerification()" style="padding: 8px 16px; background: #00a884; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Verification</button>
        </div>
        <div style="margin: 15px 0;">
            <h4>Add Emoji Status</h4>
            <div>
                <input type="number" id="quickEmojiUserId" placeholder="User ID" style="padding: 8px; width: 120px; margin-right: 10px;">
                <input type="text" id="quickEmojiDocId" placeholder="Document ID" style="padding: 8px; width: 150px; margin-right: 10px;">
                <button onclick="quickAddEmojiStatus()" style="padding: 8px 16px; background: #00a884; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Emoji Status</button>
            </div>
        </div>
        <div style="margin: 15px 0;">
            <h4>Add Both</h4>
            <div>
                <input type="number" id="quickBothUserId" placeholder="User ID" style="padding: 8px; width: 120px; margin-right: 10px;">
                <input type="text" id="quickBothDocId" placeholder="Document ID" style="padding: 8px; width: 150px; margin-right: 10px;">
                <button onclick="quickAddBoth()" style="padding: 8px 16px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Both</button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'quick-add-modal');
}

// Вспомогательная функция для показа модального окна
function showModal(content, modalId = 'webgram-modal') {
    // Удаляем существующее модальное окно если есть
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        document.body.removeChild(existingModal);
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        font-family: system-ui, -apple-system, sans-serif;
    `;
    
    modal.innerHTML = content + '<br><button onclick="this.closest(\'div\').remove()" style="margin-top: 15px; padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
    
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
    overlay.id = 'webgram-modal-overlay';
    
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

// Глобальные функции для модальных окон
window.addNewVerifiedUser = function() {
    const input = document.getElementById('newVerifiedUserId');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        input.value = '';
        showVerifiedUsersModal();
    } else {
        alert('Please enter a valid User ID');
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
        showEmojiStatusModal();
    } else {
        alert('Please enter valid User ID and Document ID');
    }
};

window.quickAddVerification = function() {
    const input = document.getElementById('quickVerifiedId');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        input.value = '';
        alert(`Verification added for user ${userId}`);
    } else {
        alert('Please enter a valid User ID');
    }
};

window.quickAddEmojiStatus = function() {
    const userIdInput = document.getElementById('quickEmojiUserId');
    const docIdInput = document.getElementById('quickEmojiDocId');
    const userId = parseInt(userIdInput.value);
    const docId = docIdInput.value;
    
    if (userId && !isNaN(userId) && docId) {
        setEmojiStatus(userId, docId);
        userIdInput.value = '';
        docIdInput.value = '';
        alert(`Emoji status added for user ${userId}`);
    } else {
        alert('Please enter valid User ID and Document ID');
    }
};

window.quickAddBoth = function() {
    const userIdInput = document.getElementById('quickBothUserId');
    const docIdInput = document.getElementById('quickBothDocId');
    const userId = parseInt(userIdInput.value);
    const docId = docIdInput.value;
    
    if (userId && !isNaN(userId) && docId) {
        configureUser(userId, { verified: true, emojiStatus: docId });
        userIdInput.value = '';
        docIdInput.value = '';
        alert(`Both verification and emoji status added for user ${userId}`);
    } else {
        alert('Please enter valid User ID and Document ID');
    }
};

window.updateModalCounters = function() {
    updateSettingsCounters();
};

// Функция для проверки и добавления элементов интерфейса
function checkAndAddUIElements() {
    addMenuButton();
    
    // Проверяем, открыты ли настройки
    const settingsActive = document.querySelector('.settings-container.active, .profile-container.active');
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
    
    // Периодическая проверка
    setInterval(() => {
        addVerificationAndStatus();
        checkAndAddUIElements();
    }, 2000);
    
    // Начальная проверка
    checkAndAddUIElements();
}

// Автозапуск
init();
addVerification(7899534962);

// Добавляем несколько примеров для тестирования
setTimeout(() => {
    addVerification(1234567890);
    setEmojiStatus(1234567890, 'star_doc_123');
    setEmojiStatus(9876543210, 'heart_doc_456');
}, 1000);
