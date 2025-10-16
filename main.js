// Конфигурация
const SERVER_URL = 'https://murzikbot.pythonanywhere.com';
let currentUserId = null;

// Проверяем статус сервера
async function checkServerStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/api/status`);
        return response.ok;
    } catch (error) {
        console.log('Server is not available, using local mode');
        return false;
    }
}

// === ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ ===
async function getUserConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_user/${userId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(`No server config for user ${userId}`);
    }
    return {};
}

async function saveUserConfig(userId, config) {
    try {
        await fetch(`${SERVER_URL}/api/save_user/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        });
    } catch (error) {
        console.log('Failed to save user config to server');
    }
}

// === ФУНКЦИИ ДЛЯ РАБОТЫ С ПРОФИЛЯМИ ===
async function getProfileConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_profile/${userId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(`No profile config for user ${userId}`);
    }
    return {};
}

async function saveProfileConfig(userId, config) {
    try {
        await fetch(`${SERVER_URL}/api/save_profile/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        });
    } catch (error) {
        console.log('Failed to save profile to server');
    }
}

// === ФУНКЦИИ ДЛЯ РАБОТЫ С НАСТРОЙКАМИ ===
async function getSettingsConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_settings/${userId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(`No settings for user ${userId}`);
    }
    return {};
}

async function saveSettingsConfig(userId, config) {
    try {
        await fetch(`${SERVER_URL}/api/save_settings/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        });
    } catch (error) {
        console.log('Failed to save settings to server');
    }
}

// Создаем вкладку Webgram Settings
function createSettingsTab() {
    const settingsContainer = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active.header-filled.scrolled-end > div.sidebar-content > div > div:nth-child(3) > div > div > div");
    
    if (!settingsContainer) return;
    if (document.querySelector('.webgram-settings-tab')) return;
    
    const settingsTabHTML = `
        <div class="row no-subtitle row-with-icon row-with-padding row-clickable hover-effect rp webgram-settings-tab">
            <div class="c-ripple"></div>
            <div class="row-title" dir="auto">
                <span class="i18n">Webgram Settings</span>
            </div>
            <span class="tgico row-icon"></span>
        </div>
    `;
    
    settingsContainer.insertAdjacentHTML('beforeend', settingsTabHTML);
    document.querySelector('.webgram-settings-tab').addEventListener('click', openSettingsPanel);
}

// Удаляем старые панели перед открытием новых
// Простой способ - всегда удаляем все что похоже на нашу панель
function cleanupOldPanels() {
    const oldPanel = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active.header-filled.scrolled-end > div.sidebar-header");
    if (oldPanel) {
        oldPanel.remove();
    }
    const oldPanell = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active.header-filled.scrolled-end > div.sidebar-content");
    if (oldPanell) {
        oldPanell.remove();
    }
}

// Открываем панель настроек
async function openSettingsPanel() {
    
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        currentUserId = parseInt(profileName.getAttribute('data-peer-id'));
    }
    
    if (!currentUserId) {
        showNotification('Cannot detect user ID');
        return;
    }
    
    // Загружаем настройки из разных endpoint'ов
    const [userConfig, profileConfig, settingsConfig] = await Promise.all([
        getUserConfig(currentUserId),
        getProfileConfig(currentUserId),
        getSettingsConfig(currentUserId)
    ]);
    
    // Объединяем конфиги
    const mergedConfig = { ...userConfig, ...profileConfig, ...settingsConfig };
    
    const settingsPanelHTML = `
        <div class="tabs-tab sidebar-slider-item scrolled-start scrollable-y-bordered webgram-settings-container active">
            <div class="sidebar-header">
                <button class="btn-icon sidebar-close-button">
                    <span class="tgico button-icon"></span>
                </button>
                <div class="sidebar-header__title">
                    <span class="i18n">Webgram Settings</span>
                </div>
            </div>
            <div class="sidebar-content">
                <div class="scrollable scrollable-y">
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">User ID: ${currentUserId}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Verification</div>
                                <label class="row no-subtitle row-with-toggle row-with-icon row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-row row-title-row">
                                        <div class="row-title" dir="auto">
                                            <span class="i18n">Verified Badge</span>
                                        </div>
                                        <div class="row-title row-title-right">
                                            <label class="checkbox-field checkbox-without-caption checkbox-field-toggle disable-hover">
                                                <input class="checkbox-field-input" type="checkbox" id="verified-toggle" ${mergedConfig.verified ? 'checked' : ''}>
                                                <div class="checkbox-toggle">
                                                    <div class="checkbox-toggle-circle"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    <span class="tgico row-icon"></span>
                                </label>
                                <label class="row no-subtitle row-with-toggle row-with-icon row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-row row-title-row">
                                        <div class="row-title" dir="auto">
                                            <span class="i18n">Premium Icon</span>
                                        </div>
                                        <div class="row-title row-title-right">
                                            <label class="checkbox-field checkbox-without-caption checkbox-field-toggle disable-hover">
                                                <input class="checkbox-field-input" type="checkbox" id="premium-toggle" ${mergedConfig.premium ? 'checked' : ''}>
                                                <div class="checkbox-toggle">
                                                    <div class="checkbox-toggle-circle"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    <span class="tgico row-icon"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Emoji Status</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Emoji Status ID</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="emoji-status-input" placeholder="Enter doc_id" value="${mergedConfig.emojiStatus || ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Gifts</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Gift IDs (comma separated)</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="gifts-input" placeholder="gift1,gift2,..." value="${mergedConfig.gifts ? mergedConfig.gifts.join(',') : ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <button class="btn btn-primary btn-color-primary" id="save-settings" style="width: 100%; margin-top: 20px;">
                                    <span class="i18n">Save Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const sidebarSlider = document.querySelector("#column-left > div.sidebar-slider.tabs-container");
    sidebarSlider.insertAdjacentHTML('beforeend', settingsPanelHTML);
    
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.querySelector('.webgram-settings-container .sidebar-close-button').addEventListener('click', () => {
        document.querySelector('.webgram-settings-container').remove();
    });
    cleanupOldPanels();
}

// Сохраняем настройки в разные endpoint'ы
async function saveSettings() {
    if (!currentUserId) return;
    
    const config = {
        verified: document.getElementById('verified-toggle').checked,
        premium: document.getElementById('premium-toggle').checked,
        emojiStatus: document.getElementById('emoji-status-input').value.trim() || null,
        gifts: document.getElementById('gifts-input').value.split(',').map(id => id.trim()).filter(id => id)
    };
    
    // Сохраняем в разные endpoint'ы
    await Promise.all([
        saveUserConfig(currentUserId, { verified: config.verified, premium: config.premium }),
        saveProfileConfig(currentUserId, { emojiStatus: config.emojiStatus }),
        saveSettingsConfig(currentUserId, { gifts: config.gifts })
    ]);
    
    applyUserConfig(currentUserId, config);
    document.querySelector('.webgram-settings-container').remove();
    showNotification('Settings saved successfully!');
}

// Применяем конфигурацию
function applyUserConfig(userId, config) {
    const selectors = [
        "#folders-container .peer-title",
        "#column-center .peer-title", 
        "#column-right .peer-title",
        "#column-left .peer-title",
        "#column-center .bubbles-inner .peer-title"
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element) return;
            const peerId = element.getAttribute('data-peer-id');
            if (!peerId || parseInt(peerId) !== userId) return;
            
            applyConfigToElement(element, config);
        });
    });
}

function applyConfigToElement(element, config) {
    if (!element.classList.contains('with-icons')) {
        element.classList.add('with-icons');
        element.setAttribute('data-with-icons', '1');
    }
    
    let nameText = element.textContent;
    const existingInner = element.querySelector('.peer-title-inner');
    if (existingInner) {
        nameText = existingInner.textContent;
    }
    
    element.innerHTML = `<span class="peer-title-inner" dir="auto">${nameText}</span>`;
    
    if (config.premium && !element.querySelector('.premium-icon')) {
        element.innerHTML += '<span class="tgico premium-icon"></span>';
    }
    
    if (config.verified && !element.querySelector('.verified-icon')) {
        element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
    }
    
    if (config.emojiStatus && !element.querySelector('.emoji-status')) {
        element.innerHTML += `<span class="emoji-status media-sticker-wrapper" data-doc-id="${config.emojiStatus}"><img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/61b6b169-e8f1-4928-988a-b3919d42760e"></span>`;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Инициализация
async function init() {
    console.log('Webgram Settings initializing...');
    createSettingsTab();
    
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        const userId = parseInt(profileName.getAttribute('data-peer-id'));
        if (userId) {
            const userConfig = await getUserConfig(userId);
            applyUserConfig(userId, userConfig);
        }
    }
}

setTimeout(init, 2000);
setInterval(createSettingsTab, 5000);
