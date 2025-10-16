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
    ".peer-title",
    ".chat-title",
    ".dialog-title",
    ".user-title",
    ".title-text"
];

// === ФУНКЦИИ ДЛЯ РАБОТЫ С СЕРВЕРОМ ===
async function getUserConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_user/${userId}`);
        if (response.ok) {
            const serverConfig = await response.json();
            if (serverConfig && Object.keys(serverConfig).length > 0) {
                // Объединяем с локальной конфигурацией (серверные настройки имеют приоритет)
                return { ...localUsersConfig[userId], ...serverConfig };
            }
        }
    } catch (error) {
        console.log(`No server config for user ${userId}, using local`);
    }
    
    return localUsersConfig[userId] || {
        verified: false,
        emojiStatus: null,
        premium: false,
        gifts: [],
        customColor: null,
        customBadge: null
    };
}

async function saveUserConfig(userId, config) {
    try {
        const response = await fetch(`${SERVER_URL}/api/save_user/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        });
        
        if (response.ok) {
            localUsersConfig[userId] = config;
            console.log('Settings saved to server');
        }
    } catch (error) {
        console.log('Failed to save user config to server, using local only');
        localUsersConfig[userId] = config;
    }
}

// Создаем вкладку Webgram Settings
function createSettingsTab() {
    // Ищем контейнер настроек Telegram
    const settingsContainer = document.querySelector('.settings-container, .sidebar-content, [data-type="settings"]');
    
    if (!settingsContainer) {
        console.log('Settings container not found, retrying...');
        setTimeout(createSettingsTab, 1000);
        return;
    }
    
    // Проверяем, не добавлена ли уже вкладка
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
    
    // Вставляем в начало для лучшей видимости
    settingsContainer.insertAdjacentHTML('afterbegin', settingsTabHTML);
    
    // Добавляем обработчик
    const settingsTab = document.querySelector('.webgram-settings-tab');
    if (settingsTab) {
        settingsTab.addEventListener('click', openSettingsPanel);
        console.log('Webgram settings tab created');
    }
}

// Удаляем панель Webgram
function cleanupWebgramPanel() {
    const webgramPanel = document.querySelector(".webgram-settings-container");
    if (webgramPanel) {
        webgramPanel.remove();
    }
}

// Открываем панель настроек
async function openSettingsPanel() {
    cleanupWebgramPanel();
    
    // Получаем ID пользователя из разных возможных мест
    const profileName = document.querySelector('.profile-name .peer-title, .user-title, .chat-title');
    if (profileName) {
        currentUserId = parseInt(profileName.getAttribute('data-peer-id') || profileName.getAttribute('data-user-id'));
    }
    
    // Альтернативный способ получения ID
    if (!currentUserId) {
        const profileElement = document.querySelector('[data-peer-id], [data-user-id]');
        if (profileElement) {
            currentUserId = parseInt(profileElement.getAttribute('data-peer-id') || profileElement.getAttribute('data-user-id'));
        }
    }
    
    if (!currentUserId) {
        showNotification('Cannot detect user ID. Please open your profile first.');
        return;
    }
    
    console.log('Detected user ID:', currentUserId);
    
    const userConfig = await getUserConfig(currentUserId);
    
    // Создаем панель настроек
    const settingsPanelHTML = `
        <div class="tabs-tab sidebar-slider-item scrollable-y-bordered webgram-settings-container active" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; background: var(--background-color);">
            <div class="sidebar-header">
                <button class="btn-icon sidebar-close-button" id="webgram-close-button">
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
                                <div class="sidebar-left-section-caption i18n">${userConfig.verified ? 'Server configuration' : 'Local configuration'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Profile Badges</div>
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
                                            <span class="i18n">Premium Badge</span>
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
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Emoji Status</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Status Document ID</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="emoji-status-input" placeholder="Enter document ID" value="${userConfig.emojiStatus || ''}" style="border: 1px solid var(--border-color); background: var(--input-background-color); text-align: left; color: var(--text-color); width: 200px; padding: 8px; border-radius: 4px;">
                                    </div>
                                </div>
                            </div>
                            <div class="sidebar-left-section-content sidebar-left-section-caption i18n">Enter the document ID of the emoji status sticker</div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Name Appearance</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Custom Name Color</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="color" id="custom-color-input" value="${userConfig.customColor || '#000000'}" style="border: none; background: transparent; width: 40px; height: 40px; border-radius: 4px; cursor: pointer;">
                                    </div>
                                </div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Custom Badge</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="custom-badge-input" placeholder="✨" value="${userConfig.customBadge || ''}" style="border: 1px solid var(--border-color); background: var(--input-background-color); text-align: left; color: var(--text-color); width: 200px; padding: 8px; border-radius: 4px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Gifts</div>
                                <div class="row no-subtitle row-with-padding row-clickable hover-effect rp">
                                    <div class="c-ripple"></div>
                                    <div class="row-title" dir="auto">
                                        <span class="i18n">Gift Document IDs</span>
                                    </div>
                                    <div class="row-title row-title-right row-title-right-secondary">
                                        <input type="text" id="gifts-input" placeholder="ID1, ID2, ..." value="${userConfig.gifts ? userConfig.gifts.join(', ') : ''}" style="border: 1px solid var(--border-color); background: var(--input-background-color); text-align: left; color: var(--text-color); width: 200px; padding: 8px; border-radius: 4px;">
                                    </div>
                                </div>
                            </div>
                            <div class="sidebar-left-section-content sidebar-left-section-caption i18n">Comma-separated list of gift document IDs</div>
                        </div>
                    </div>
                    
                    <div class="sidebar-left-section-container">
                        <div class="sidebar-left-section">
                            <div class="sidebar-left-section-content">
                                <button class="btn btn-primary btn-color-primary" id="save-settings" style="width: 100%; margin-top: 20px; padding: 12px;">
                                    <span class="i18n">💾 Save Changes</span>
                                </button>
                                <button class="btn btn-secondary" id="reset-settings" style="width: 100%; margin-top: 10px; padding: 12px;">
                                    <span class="i18n">🔄 Reset to Default</span>
                                </button>
                                <button class="btn btn-text" id="close-settings" style="width: 100%; margin-top: 10px; padding: 12px;">
                                    <span class="i18n">❌ Close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', settingsPanelHTML);
    
    // Обработчики событий
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
    document.getElementById('close-settings').addEventListener('click', cleanupWebgramPanel);
    document.getElementById('webgram-close-button').addEventListener('click', cleanupWebgramPanel);
    
    console.log('Webgram settings panel opened');
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
    
    console.log('Saving settings:', config);
    
    await saveUserConfig(currentUserId, config);
    applyUserConfig(currentUserId, config);
    cleanupWebgramPanel();
    showNotification('✅ Settings saved successfully!');
}

// Применяем конфигурацию для всех пользователей на странице
async function applyAllUsersConfig() {
    const uniqueUserIds = new Set();
    
    // Собираем все возможные ID пользователей
    const elements = document.querySelectorAll('[data-peer-id], [data-user-id], .peer-title, .chat-title');
    elements.forEach(element => {
        const peerId = element.getAttribute('data-peer-id') || element.getAttribute('data-user-id');
        if (peerId) {
            uniqueUserIds.add(parseInt(peerId));
        }
        
        // Также проверяем текст элемента на наличие ID
        const text = element.textContent || '';
        const idMatch = text.match(/\d{8,}/);
        if (idMatch) {
            uniqueUserIds.add(parseInt(idMatch[0]));
        }
    });
    
    console.log('Found user IDs:', Array.from(uniqueUserIds));
    
    for (const userId of uniqueUserIds) {
        const userConfig = await getUserConfig(userId);
        if (userConfig && Object.keys(userConfig).length > 0) {
            applyUserConfig(userId, userConfig);
        }
    }
}

// Применяем конфигурацию к конкретному пользователю
function applyUserConfig(userId, config) {
    console.log(`Applying config for user ${userId}:`, config);
    
    // Ищем все элементы, которые могут содержать имя пользователя
    const possibleSelectors = [
        `[data-peer-id="${userId}"]`,
        `[data-user-id="${userId}"]`,
        `.peer-title`,
        `.chat-title`,
        `.dialog-title`,
        `.user-title`,
        `.title-text`
    ];
    
    possibleSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element) return;
            
            // Проверяем, что это действительно нужный пользователь
            const elementPeerId = element.getAttribute('data-peer-id');
            const elementUserId = element.getAttribute('data-user-id');
            
            if (elementPeerId && parseInt(elementPeerId) === userId) {
                applyConfigToElement(element, config);
            } else if (elementUserId && parseInt(elementUserId) === userId) {
                applyConfigToElement(element, config);
            } else if (!elementPeerId && !elementUserId) {
                // Если нет явного ID, проверяем по содержимому
                const text = element.textContent || '';
                if (text.includes(userId.toString())) {
                    applyConfigToElement(element, config);
                }
            }
        });
    });
}

function applyConfigToElement(element, config) {
    // Сохраняем оригинальный текст
    let originalText = element.textContent;
    const innerElement = element.querySelector('.peer-title-inner, .chat-title-text');
    if (innerElement) {
        originalText = innerElement.textContent;
    }
    
    // Очищаем элемент
    element.innerHTML = '';
    
    // Создаем контейнер для текста
    const textSpan = document.createElement('span');
    textSpan.className = 'peer-title-inner';
    textSpan.textContent = originalText;
    
    // Применяем кастомный цвет
    if (config.customColor) {
        textSpan.style.color = config.customColor;
    }
    
    element.appendChild(textSpan);
    
    // Добавляем кастомный бейдж
    if (config.customBadge) {
        const customBadge = document.createElement('span');
        customBadge.className = 'custom-badge';
        customBadge.textContent = config.customBadge;
        customBadge.style.marginLeft = '4px';
        customBadge.style.color = config.customColor || 'var(--primary-color)';
        element.appendChild(customBadge);
    }
    
    // Добавляем премиум бейдж
    if (config.premium) {
        const premiumBadge = document.createElement('span');
        premiumBadge.className = 'premium-badge';
        premiumBadge.innerHTML = '⭐';
        premiumBadge.style.marginLeft = '4px';
        premiumBadge.style.color = '#FFD700';
        element.appendChild(premiumBadge);
    }
    
    // Добавляем верификацию
    if (config.verified) {
        const verifiedBadge = document.createElement('span');
        verifiedBadge.className = 'verified-badge';
        verifiedBadge.innerHTML = '✓';
        verifiedBadge.style.marginLeft = '4px';
        verifiedBadge.style.color = '#00A2FF';
        verifiedBadge.style.fontWeight = 'bold';
        verifiedBadge.style.backgroundColor = 'white';
        verifiedBadge.style.borderRadius = '50%';
        verifiedBadge.style.padding = '1px 4px';
        verifiedBadge.style.fontSize = '12px';
        element.appendChild(verifiedBadge);
    }
    
    // Добавляем emoji статус
    if (config.emojiStatus) {
        const emojiStatus = document.createElement('span');
        emojiStatus.className = 'emoji-status';
        emojiStatus.innerHTML = '😊'; // Заглушка для emoji
        emojiStatus.style.marginLeft = '4px';
        element.appendChild(emojiStatus);
    }
    
    console.log('Applied config to element:', element);
}

function showNotification(message) {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.webgram-notification');
    oldNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'webgram-notification';
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
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Инициализация
async function init() {
    console.log('🚀 Webgram Settings initializing...');
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
        return;
    }
    
    try {
        createSettingsTab();
        await applyAllUsersConfig();
        console.log('✅ Webgram Settings initialized successfully');
    } catch (error) {
        console.error('❌ Webgram initialization error:', error);
    }
}

// Запускаем и периодически обновляем
setTimeout(init, 2000);
setInterval(() => {
    if (!document.querySelector('.webgram-settings-tab')) {
        createSettingsTab();
    }
    applyAllUsersConfig();
}, 5000);
