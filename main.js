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
        customColor: "#ff6b6b",
        customBadge: "🌟"
    },
    5666666768: {
        verified: true,
        emojiStatus: "5251550383624443434",
        premium: false,
        gifts: ["5397915559037785261"],
        customColor: "#4ecdc4",
        customBadge: "⚡"
    },
    777000: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: "#45b7d1",
        customBadge: "🔵"
    },
    7702440572: {
        verified: false,
        emojiStatus: null,
        premium: true,
        gifts: [],
        customColor: "#96ceb4",
        customBadge: "💎"
    },
    6975201668: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: "#feca57",
        customBadge: "🚀"
    },
    591678038: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: "#ff9ff3",
        customBadge: "❤️"
    },
    5434504334: {
        verified: true,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: "#54a0ff",
        customBadge: "👑"
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

// Удаляем старые панели
function cleanupOldPanels() {
    const oldPanel = document.querySelector(".webgram-settings-container");
    if (oldPanel) {
        oldPanel.remove();
    }
}

// Открываем панель настроек
async function openSettingsPanel() {
    cleanupOldPanels();
    
    // Ждем немного чтобы Telegram закрыл свои панели
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        currentUserId = parseInt(profileName.getAttribute('data-peer-id'));
    }
    
    if (!currentUserId) {
        showNotification('Cannot detect user ID');
        return;
    }
    
    const userConfig = await getUserConfig(currentUserId);
    
    const settingsPanelHTML = `
        <div class="tabs-tab sidebar-slider-item scrolled-start scrollable-y-bordered webgram-settings-container active">
            <div class="sidebar-header">
                <button class="btn-icon sidebar-close-button">
                    <span class="tgico button-icon"></span>
                </button>
                <div class="sidebar-header__title">
                    <span class="i18n">Webgram Premium</span>
                </div>
            </div>
            <div class="sidebar-content">
                <div class="scrollable scrollable-y">
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">👤 User ID: ${currentUserId}</div>
                                <div class="sidebar-left-section-caption i18n">${Object.keys(userConfig).length > 0 ? '🟢 Server Config' : '🟡 Local Config'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">🎨 Customization</div>
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
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">😊 Emoji Status</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Status ID</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="emoji-status-input" placeholder="doc_id" value="${userConfig.emojiStatus || ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
                                    </div>
                                </div>
                                <div class="sidebar-left-section-caption i18n">Use real sticker document IDs</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">🎁 Gifts & Rewards</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Gift IDs</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="gifts-input" placeholder="id1,id2,..." value="${userConfig.gifts ? userConfig.gifts.join(',') : ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 150px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">🌈 Advanced</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Custom Color</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="color" id="custom-color-input" value="${userConfig.customColor || '#4CAF50'}" style="border: none; background: transparent; width: 40px; height: 20px;">
                                    </div>
                                </div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Custom Badge</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="custom-badge-input" placeholder="🌟" value="${userConfig.customBadge || ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color); width: 80px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <hr>
                            <div class="sidebar-left-section-content">
                                <button class="btn btn-primary btn-color-primary" id="save-settings" style="width: 100%; margin-top: 20px; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); border: none;">
                                    <span class="i18n" style="font-weight: bold;">💾 Save All Settings</span>
                                </button>
                                <button class="btn btn-secondary" id="reset-settings" style="width: 100%; margin-top: 10px;">
                                    <span class="i18n">🔄 Reset to Default</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-section-caption i18n" style="text-align: center; color: #888;">
                                    ✨ Webgram Premium v2.0 ✨
                                </div>
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
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
    document.querySelector('.webgram-settings-container .sidebar-close-button').addEventListener('click', () => {
        document.querySelector('.webgram-settings-container').remove();
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
        customColor: "#4CAF50",
        customBadge: ""
    };
    
    document.getElementById('verified-toggle').checked = defaultConfig.verified;
    document.getElementById('premium-toggle').checked = defaultConfig.premium;
    document.getElementById('emoji-status-input').value = '';
    document.getElementById('gifts-input').value = '';
    document.getElementById('custom-color-input').value = defaultConfig.customColor;
    document.getElementById('custom-badge-input').value = '';
    
    showNotification('Settings reset to default!');
}

// Сохраняем настройки
async function saveSettings() {
    if (!currentUserId) return;
    
    const config = {
        verified: document.getElementById('verified-toggle').checked,
        premium: document.getElementById('premium-toggle').checked,
        emojiStatus: document.getElementById('emoji-status-input').value.trim() || null,
        gifts: document.getElementById('gifts-input').value.split(',').map(id => id.trim()).filter(id => id),
        customColor: document.getElementById('custom-color-input').value,
        customBadge: document.getElementById('custom-badge-input').value.trim()
    };
    
    await saveUserConfig(currentUserId, config);
    applyUserConfig(currentUserId, config);
    document.querySelector('.webgram-settings-container').remove();
    showNotification('✨ Settings saved successfully!');
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
    
    element.innerHTML = `<span class="peer-title-inner" dir="auto">${nameText}</span>`;
    
    // Добавляем кастомный бейдж
    if (config.customBadge && !element.querySelector('.custom-badge')) {
        element.innerHTML += `<span class="custom-badge" style="margin-left: 4px; font-size: 14px;">${config.customBadge}</span>`;
    }
    
    if (config.premium && !element.querySelector('.premium-icon')) {
        element.innerHTML += '<span class="tgico premium-icon"></span>';
    }
    
    if (config.verified && !element.querySelector('.verified-icon')) {
        element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
    }
    
    // Исправляем emoji статус - используем правильный формат
    if (config.emojiStatus && !element.querySelector('.emoji-status')) {
        // Создаем правильную структуру как в Telegram
        element.innerHTML += `
            <span class="emoji-status media-sticker-wrapper" data-doc-id="${config.emojiStatus}">
                <img class="media-sticker" decoding="async" 
                     src="https://api.telegram.org/file/bot<token>/stickers/${config.emojiStatus}.webp"
                     onerror="this.style.display='none'"
                     style="width: 16px; height: 16px; vertical-align: middle;">
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

    if (giftsTab && !giftsTab.querySelector('.search-super-pinned-gifts')) {
        Object.values(localUsersConfig).forEach(userConfig => {
            if (userConfig.gifts && userConfig.gifts.length > 0) {
                userConfig.gifts.forEach(giftId => {
                    const giftTabHTML = `
                        <div class="search-super-pinned-gifts">
                            <div data-doc-id="${giftId}" class="media-sticker-wrapper">
                                <img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/77ba17f4-af0d-4e8d-9834-59cad1aec979">
                            </div>
                        </div>
                    `;
                    const spanElement = giftsTab.querySelector('.menu-horizontal-div-item-span');
                    if (spanElement) {
                        spanElement.innerHTML += giftTabHTML;
                    }
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
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        z-index: 10000;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Инициализация
async function init() {
    console.log('🎨 Webgram Premium v2.0 initializing...');
    createSettingsTab();
    await applyAllUsersConfig();
}

// Запускаем и периодически обновляем
setTimeout(init, 2000);
setInterval(() => {
    createSettingsTab();
    applyAllUsersConfig();
}, 1000);
