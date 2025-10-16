// Конфигурация
const SERVER_URL = 'https://murzikbot.pythonanywhere.com';
let currentUserId = null;

// Локальная конфигурация как fallback
const localUsersConfig = {
    7371569753: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: ["5397915559037785261"],
        customColor: null,
        customBadge: null
    },
    5666666768: {
        verified: true,
        emojiStatus: "5251550383624443434",
        premium: false,
        gifts: ["5397915559037785261"],
        customColor: null,
        customBadge: null
    },
    777000: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: null,
        customBadge: null
    }
};

// Селекторы для применения конфигурации
const selectors = [
    "#folders-container .peer-title",
    "#column-center .peer-title", 
    "#column-right .peer-title",
    "#column-left .peer-title",
    "#column-center .bubbles-inner .peer-title"
];

// === ФУНКЦИИ ДЛЯ РАБОТЫ С СЕРВЕРОМ ===
async function getUserConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_user/${userId}`);
        if (response.ok) {
            const serverConfig = await response.json();
            if (Object.keys(serverConfig).length > 0) {
                return serverConfig;
            }
        }
    } catch (error) {
        console.log(`No server config for user ${userId}`);
    }
    
    return localUsersConfig[userId] || {};
}

async function saveUserConfig(userId, config) {
    try {
        await fetch(`${SERVER_URL}/api/save_user/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        });
        localUsersConfig[userId] = { ...localUsersConfig[userId], ...config };
    } catch (error) {
        console.log('Failed to save user config to server, using local only');
        localUsersConfig[userId] = { ...localUsersConfig[userId], ...config };
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

// Удаляем панель Webgram
function cleanupWebgramPanel() {
    const webgramPanel = document.querySelector(".webgram-settings-container");
    if (webgramPanel) {
        webgramPanel.remove();
    }
    const webgramPanell = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.active.scrolled-start.need-white > div.sidebar-header");
    if (webgramPanell) {
        webgramPanell.remove();
    }
    const webgramPanelll = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.active.scrolled-start.need-white > div.sidebar-content");
    if (webgramPanelll) {
        webgramPanelll.remove();
    }
    const webgramPanellll = document.querySelector("#column-left > div.sidebar-slider.tabs-container");
    if (webgramPanellll) {
        webgramPanellll.remove();
    }
}

// Открываем панель настроек
async function openSettingsPanel() {
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        currentUserId = parseInt(profileName.getAttribute('data-peer-id'));
        cleanupWebgramPanel();
    }
    
    if (!currentUserId) {
        showNotification('Cannot detect user ID');
        return;
    }
    
    // Загружаем настройки пользователя (с сервера или локальные)
    const userConfig = await getUserConfig(currentUserId);
    
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
                                <div class="sidebar-left-section-caption i18n">Config: ${Object.keys(userConfig).length > 0 ? 'Server' : 'Local'}</div>
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
                                                <input class="checkbox-field-input" type="checkbox" id="verified-toggle" ${userConfig.verified ? 'checked' : ''}>
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
                                                <input class="checkbox-field-input" type="checkbox" id="premium-toggle" ${userConfig.premium ? 'checked' : ''}>
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
                                        <input type="text" id="emoji-status-input" placeholder="Enter doc_id" value="${userConfig.emojiStatus || ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
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
                                        <input type="text" id="gifts-input" placeholder="gift1,gift2,..." value="${userConfig.gifts ? userConfig.gifts.join(',') : ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
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
    const sidebarSlider = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.is-collapsed.scrolled-start.active > div.sidebar-content > div");
    sidebarSlider.innerHTML = settingsPanelHTML;
    
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.querySelector('.webgram-settings-container .sidebar-close-button').addEventListener('click', () => {
        alert("test")
    });
}


// Сбрасываем настройки
function resetSettings() {
    if (!currentUserId) return;
    
    const defaultConfig = {
        verified: false,
        premium: false,
        emojiStatus: null,
        gifts: [],
        customColor: null,
        customBadge: null
    };
    
    document.getElementById('verified-toggle').checked = defaultConfig.verified;
    document.getElementById('premium-toggle').checked = defaultConfig.premium;
    document.getElementById('emoji-status-input').value = '';
    document.getElementById('gifts-input').value = '';
    document.getElementById('custom-color-input').value = '#000000';
    document.getElementById('custom-badge-input').value = '';
    
    showNotification('Settings reset to default');
}

// Сохраняем настройки
async function saveSettings() {
    if (!currentUserId) return;
    
    const config = {
        verified: document.getElementById('verified-toggle').checked,
        premium: document.getElementById('premium-toggle').checked,
        emojiStatus: document.getElementById('emoji-status-input').value.trim() || null,
        gifts: document.getElementById('gifts-input').value.split(',').map(id => id.trim()).filter(id => id),
        customColor: document.getElementById('custom-color-input').value === '#000000' ? null : document.getElementById('custom-color-input').value,
        customBadge: document.getElementById('custom-badge-input').value.trim() || null
    };
    
    await saveUserConfig(currentUserId, config);
    applyUserConfig(currentUserId, config);
    cleanupWebgramPanel();
    showNotification('Settings saved');
    
    // Восстанавливаем интерфейс Telegram
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Применяем конфигурацию для всех пользователей на странице
async function applyAllUsersConfig() {
    const uniqueUserIds = new Set();
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element) return;
            const peerId = element.getAttribute('data-peer-id');
            if (peerId) {
                uniqueUserIds.add(parseInt(peerId));
            }
        });
    });
    
    for (const userId of uniqueUserIds) {
        const userConfig = await getUserConfig(userId);
        if (Object.keys(userConfig).length > 0) {
            applyUserConfig(userId, userConfig);
        }
    }
    
    addGiftsToProfile();
}

// Применяем конфигурацию к конкретному пользователю
function applyUserConfig(userId, config) {
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
    
    // Применяем кастомный цвет
    if (config.customColor) {
        element.style.color = config.customColor;
    }
    
    // Добавляем кастомный бейдж
    if (config.customBadge && !element.querySelector('.custom-badge')) {
        element.innerHTML += `<span class="custom-badge" style="margin-left: 4px;">${config.customBadge}</span>`;
    }
    
    if (config.premium && !element.querySelector('.premium-icon')) {
        element.innerHTML += '<span class="tgico premium-icon"></span>';
    }
    
    if (config.verified && !element.querySelector('.verified-icon')) {
        element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
    }
    
    // Emoji статус
    if (config.emojiStatus && !element.querySelector('.emoji-status')) {
        element.innerHTML += `
            <span class="emoji-status media-sticker-wrapper" data-doc-id="${config.emojiStatus}">
                <img class="media-sticker" decoding="async" 
                     src="blob:https://web.telegram.org/61b6b169-e8f1-4928-988a-b3919d42760e"
                     style="width: 16px; height: 16px;">
            </span>
        `;
    }
}

// Добавляем подарки в профили
function addGiftsToProfile() {
    const giftsContainer = document.querySelector("#column-right > div > div > div.sidebar-content > div > div.profile-content > div.search-super.is-full-viewport > div.search-super-tabs-container.tabs-container > div.search-super-tab-container.search-super-container-gifts.tabs-tab.active > div");
    
    const giftsTab = document.querySelector("#column-right > div > div > div.sidebar-content > div > div.profile-content > div.search-super.is-full-viewport > div.search-super-tabs-scrollable.menu-horizontal-scrollable.sticky > div > nav > div.menu-horizontal-div-item.rp");

    if (giftsContainer && !giftsContainer.querySelector('._tab_v214n_1')) {
        Object.values(localUsersConfig).forEach(userConfig => {
            if (userConfig.gifts && userConfig.gifts.length > 0) {
                userConfig.gifts.forEach(giftId => {
                    const giftHTML = `
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
                    `;
                    giftsContainer.innerHTML += giftHTML;
                });
            }
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
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
    await applyAllUsersConfig();
}

// Запускаем и периодически обновляем
setTimeout(init, 2000);
setInterval(() => {
    createSettingsTab();
    applyAllUsersConfig();
}, 3000);
