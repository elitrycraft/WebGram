// Конфигурация пользователей
const usersConfig = {};

// Селекторы для разных мест отображения имени пользователя
const selectors = [
    ".peer-title[data-peer-id]",
    ".user-title .peer-title",
    ".profile-name .peer-title",
    ".dialog-title .peer-title"
];

// HTML для verified иконки
const verifiedIconHTML = '<span class="verified-icon" style="margin-left: 4px; display: inline-flex; align-items: center;"><svg viewBox="0 0 26 26" width="16" height="16" style="color: #0088cc;"><use href="#verified-icon-check"></use><use href="#verified-icon-background"></use></svg></span>';

// Функция для получения emoji статуса
function getEmojiStatusHTML(docId) {
    return `<span class="emoji-status media-sticker-wrapper" style="margin-left: 4px; display: inline-flex; align-items: center;" data-doc-id="${docId}">
        <img class="media-sticker" src="blob:https://web.telegram.org/c9e9a04a-184b-40a7-9e78-79fd4e719ed1" style="width: 16px; height: 16px;">
    </span>`;
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
            
            // Удаляем старые иконки
            const oldVerified = element.querySelector('.verified-icon');
            const oldEmoji = element.querySelector('.emoji-status');
            if (oldVerified) oldVerified.remove();
            if (oldEmoji) oldEmoji.remove();
            
            // Добавляем новые иконки
            if (userConfig.verified) {
                element.insertAdjacentHTML('beforeend', verifiedIconHTML);
            }
            
            if (userConfig.emojiStatus) {
                element.insertAdjacentHTML('beforeend', getEmojiStatusHTML(userConfig.emojiStatus));
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
    console.log(`✅ Added verification for user ${userId}`);
}

// Функция для удаления верификации
function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
    console.log(`❌ Removed verification for user ${userId}`);
}

// Функция для добавления emoji статуса
function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
    console.log(`🎨 Set emoji status for user ${userId}: ${docId}`);
}

// Функция для удаления emoji статуса
function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
    console.log(`🗑️ Removed emoji status for user ${userId}`);
}

// Функция для добавления кнопки в главное меню
function addWebGramToMenu() {
    const menu = document.querySelector('.btn-menu.bottom-right.active');
    if (!menu) return;
    
    // Проверяем, есть ли уже наша кнопка
    if (menu.querySelector('.webgram-menu-btn')) return;
    
    // Создаем кнопку WebGram
    const webgramBtnHTML = `
        <div class="btn-menu-item rp-overflow webgram-menu-btn">
            <span class="tgico btn-menu-item-icon"></span>
            <span class="btn-menu-item-text">WebGram Settings</span>
        </div>
    `;
    
    // Находим кнопку Settings и добавляем перед ней
    const settingsBtn = Array.from(menu.querySelectorAll('.btn-menu-item')).find(item => 
        item.querySelector('.btn-menu-item-text')?.textContent.includes('Settings')
    );
    
    if (settingsBtn) {
        settingsBtn.insertAdjacentHTML('beforebegin', '<hr>');
        settingsBtn.insertAdjacentHTML('beforebegin', webgramBtnHTML);
        
        // Добавляем обработчик
        const newBtn = menu.querySelector('.webgram-menu-btn');
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllMenus();
            setTimeout(showWebGramSettings, 100);
        });
    }
}

// Функция для закрытия всех меню
function closeAllMenus() {
    const menus = document.querySelectorAll('.btn-menu.active, .backdrop');
    menus.forEach(menu => {
        menu.classList.remove('active');
        if (menu.parentNode) menu.parentNode.remove();
    });
}

// Функция для показа настроек WebGram
function showWebGramSettings() {
    // Закрываем существующие настройки если есть
    closeWebGramSettings();
    
    const verifiedCount = Object.values(usersConfig).filter(u => u.verified).length;
    const emojiCount = Object.values(usersConfig).filter(u => u.emojiStatus).length;
    
    // Создаем контейнер настроек в стиле Telegram
    const settingsHTML = `
        <div class="sidebar-slider-item settings-container profile-container active webgram-settings" style="transform: translateX(0%);">
            <div class="sidebar-header">
                <button class="btn-icon sidebar-close-button" onclick="closeWebGramSettings()">
                    <span class="tgico button-icon"></span>
                </button>
                <div class="sidebar-header__title">
                    <span>WebGram Settings</span>
                </div>
                <button class="btn-icon rp" onclick="refreshWebGram()">
                    <div class="c-ripple"></div>
                    <span class="tgico button-icon"></span>
                </button>
            </div>
            
            <div class="sidebar-content">
                <div class="scrollable scrollable-y no-parallax">
                    <!-- Статистика -->
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section no-delimiter">
                            <div class="sidebar-left-section-content">
                                <div class="profile-buttons">
                                    <div class="row no-subtitle row-with-icon row-with-padding">
                                        <div class="row-row row-title-row">
                                            <div class="row-title">Verified Users</div>
                                            <div class="row-title row-title-right row-title-right-secondary">${verifiedCount}</div>
                                        </div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                    <div class="row no-subtitle row-with-icon row-with-padding">
                                        <div class="row-row row-title-row">
                                            <div class="row-title">Emoji Status</div>
                                            <div class="row-title row-title-right row-title-right-secondary">${emojiCount}</div>
                                        </div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Быстрое добавление -->
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name">
                                    <span>Quick Add</span>
                                </div>
                                <div class="profile-buttons">
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="showAddModal('verified')">
                                        <div class="c-ripple"></div>
                                        <div class="row-title">Add Verified User</div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="showAddModal('emoji')">
                                        <div class="c-ripple"></div>
                                        <div class="row-title">Add Emoji Status</div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="showAddModal('both')">
                                        <div class="c-ripple"></div>
                                        <div class="row-title">Add Both</div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Управление -->
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name">
                                    <span>Management</span>
                                </div>
                                <div class="profile-buttons">
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="showUsersList('verified')">
                                        <div class="c-ripple"></div>
                                        <div class="row-row row-title-row">
                                            <div class="row-title">Manage Verified Users</div>
                                            <div class="row-title row-title-right row-title-right-secondary">${verifiedCount}</div>
                                        </div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="showUsersList('emoji')">
                                        <div class="c-ripple"></div>
                                        <div class="row-row row-title-row">
                                            <div class="row-title">Manage Emoji Status</div>
                                            <div class="row-title row-title-right row-title-right-secondary">${emojiCount}</div>
                                        </div>
                                        <span class="tgico row-icon"></span>
                                    </div>
                                    <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp" onclick="clearAllSettings()">
                                        <div class="c-ripple"></div>
                                        <div class="row-title" style="color: #ff4444;">Clear All Settings</div>
                                        <span class="tgico row-icon" style="color: #ff4444;"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Инструкция -->
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name">
                                    <span>How to Use</span>
                                </div>
                                <div style="padding: 0 16px 16px; color: #666; font-size: 14px; line-height: 1.4;">
                                    <p>1. To add verification/emoji, you need User ID</p>
                                    <p>2. User ID can be found in peer-title data attributes</p>
                                    <p>3. Emoji status uses document IDs from Telegram</p>
                                    <p>4. Changes apply immediately to all visible names</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const settingsContainer = document.createElement('div');
    settingsContainer.innerHTML = settingsHTML;
    
    // Добавляем в основной контейнер
    const mainContainer = document.querySelector('#column-left .sidebar-slider.tabs-container');
    if (mainContainer) {
        mainContainer.appendChild(settingsContainer);
    }
}

// Функция закрытия настроек WebGram
function closeWebGramSettings() {
    const settings = document.querySelector('.webgram-settings');
    if (settings) {
        settings.remove();
    }
}

// Функция обновления настроек
function refreshWebGram() {
    closeWebGramSettings();
    setTimeout(showWebGramSettings, 100);
}

// Модальное окно для добавления
function showAddModal(type) {
    const title = type === 'verified' ? 'Add Verified User' : 
                 type === 'emoji' ? 'Add Emoji Status' : 'Add Both';
    
    const modalHTML = `
        <div class="backdrop active" style="z-index: 10000;">
            <div class="modal active" style="width: 320px;">
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <button class="btn-icon btn-circle btn-corner z-depth-1 modal-close-button" onclick="closeModal()">
                        <span class="tgico button-icon"></span>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="input-group">
                        <input type="number" id="modal-user-id" class="input-field" placeholder="User ID" style="margin-bottom: 12px;">
                        ${type !== 'verified' ? `
                        <input type="text" id="modal-doc-id" class="input-field" placeholder="Document ID" value="emoji_${Date.now()}">
                        <div style="font-size: 12px; color: #666; margin-top: 8px;">
                            Use any text as Document ID
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn-primary" onclick="modalAdd('${type}')">Add</button>
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Закрываем существующие модалки
    closeModal();
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

// Функция добавления из модалки
function modalAdd(type) {
    const userIdInput = document.getElementById('modal-user-id');
    const docIdInput = document.getElementById('modal-doc-id');
    
    const userId = parseInt(userIdInput.value);
    
    if (!userId || isNaN(userId)) {
        alert('Please enter valid User ID');
        return;
    }
    
    if (type === 'verified') {
        addVerification(userId);
    } else if (type === 'emoji') {
        const docId = docIdInput?.value || `emoji_${Date.now()}`;
        setEmojiStatus(userId, docId);
    } else if (type === 'both') {
        const docId = docIdInput?.value || `emoji_${Date.now()}`;
        addVerification(userId);
        setEmojiStatus(userId, docId);
    }
    
    closeModal();
    refreshWebGram();
}

// Показать список пользователей
function showUsersList(type) {
    const users = Object.entries(usersConfig)
        .filter(([_, config]) => type === 'verified' ? config.verified : config.emojiStatus)
        .map(([userId, config]) => ({ userId, config }));
    
    const title = type === 'verified' ? 'Verified Users' : 'Emoji Status Users';
    
    let modalHTML = `
        <div class="backdrop active" style="z-index: 10000;">
            <div class="modal active" style="width: 400px; max-height: 500px;">
                <div class="modal-header">
                    <div class="modal-title">${title} (${users.length})</div>
                    <button class="btn-icon btn-circle btn-corner z-depth-1 modal-close-button" onclick="closeModal()">
                        <span class="tgico button-icon"></span>
                    </button>
                </div>
                <div class="modal-content" style="max-height: 350px; overflow-y: auto;">
    `;
    
    if (users.length === 0) {
        modalHTML += `
            <div style="text-align: center; padding: 40px; color: #666;">
                No ${type === 'verified' ? 'verified users' : 'emoji status users'}
            </div>
        `;
    } else {
        users.forEach(({ userId, config }) => {
            modalHTML += `
                <div class="row no-subtitle row-with-padding" style="border-bottom: 1px solid #eee;">
                    <div class="row-row row-title-row">
                        <div class="row-title">User ID: ${userId}</div>
                        ${type === 'emoji' ? `<div class="row-subtitle">Doc: ${config.emojiStatus}</div>` : ''}
                    </div>
                    <button class="btn-secondary btn-small" onclick="removeUserSetting(${userId}, '${type}')" style="margin-top: 8px;">
                        Remove
                    </button>
                </div>
            `;
        });
    }
    
    modalHTML += `
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    closeModal();
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

// Удалить настройку пользователя
function removeUserSetting(userId, type) {
    if (type === 'verified') {
        removeVerification(userId);
    } else {
        removeEmojiStatus(userId);
    }
    closeModal();
    setTimeout(() => showUsersList(type), 100);
}

// Очистить все настройки
function clearAllSettings() {
    if (confirm('Are you sure you want to clear ALL WebGram settings? This cannot be undone.')) {
        Object.keys(usersConfig).forEach(userId => {
            delete usersConfig[userId];
        });
        addVerificationAndStatus();
        refreshWebGram();
    }
}

// Закрыть модальное окно
function closeModal() {
    const backdrops = document.querySelectorAll('.backdrop.active');
    backdrops.forEach(backdrop => {
        backdrop.remove();
    });
}

// Наблюдатель за изменениями DOM
function init() {
    addVerificationAndStatus();
    
    const observer = new MutationObserver(() => {
        addVerificationAndStatus();
        
        // Добавляем кнопку в меню когда оно появляется
        if (document.querySelector('.btn-menu.bottom-right.active')) {
            addWebGramToMenu();
        }
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
    }, 1000);
    
    console.log('🎯 WebGram initialized');
}

// Глобальные функции
window.closeWebGramSettings = closeWebGramSettings;
window.refreshWebGram = refreshWebGram;
window.showAddModal = showAddModal;
window.modalAdd = modalAdd;
window.showUsersList = showUsersList;
window.removeUserSetting = removeUserSetting;
window.clearAllSettings = clearAllSettings;
window.closeModal = closeModal;

// Автозапуск
init();

// Добавляем тестовые данные
setTimeout(() => {
    addVerification(7899534962);
    addVerification(123456789);
    setEmojiStatus(123456789, 'star_emoji_123');
    addVerification(987654321);
    setEmojiStatus(987654321, 'heart_emoji_456');
}, 1000);
