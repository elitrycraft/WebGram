// Конфигурация
const SERVER_URL = 'https://murzikbot.pythonanywhere.com'; // URL вашего Flask сервера
let currentUserId = null;

// Загружаем данные пользователя с сервера
async function loadUserConfig(userId) {
    try {
        const response = await fetch(`${SERVER_URL}/api/user/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading user config:', error);
        return {};
    }
}

// Сохраняем данные пользователя на сервер
async function saveUserConfig(userId, config) {
    try {
        await fetch(`${SERVER_URL}/api/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        });
    } catch (error) {
        console.error('Error saving user config:', error);
    }
}

// Создаем вкладку Webgram Settings
function createSettingsTab() {
    const settingsContainer = document.querySelector("#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active.header-filled.scrolled-end > div.sidebar-content > div > div:nth-child(3) > div > div > div");
    
    if (!settingsContainer) return;
    
    // Проверяем, нет ли уже нашей вкладки
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
    
    // Добавляем обработчик клика
    const settingsTab = document.querySelector('.webgram-settings-tab');
    settingsTab.addEventListener('click', openSettingsPanel);
}

// Открываем панель настроек
async function openSettingsPanel() {
    // Получаем ID текущего пользователя
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        currentUserId = parseInt(profileName.getAttribute('data-peer-id'));
    }
    
    // Загружаем настройки пользователя
    const userConfig = currentUserId ? await loadUserConfig(currentUserId) : {};
    
    // Создаем HTML для панели настроек
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
                            <hr>
                            <div class="sidebar-left-section-content">
                                <div class="sidebar-left-h2 sidebar-left-section-name i18n">Profile Verification</div>
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
                                        <input type="text" id="emoji-status-input" placeholder="Enter doc_id" value="${userConfig.emojiStatus || ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color);">
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
                                        <input type="text" id="gifts-input" placeholder="gift1,gift2,..." value="${userConfig.gifts ? userConfig.gifts.join(',') : ''}" style="border: none; background: transparent; text-align: right; color: var(--secondary-text-color);">
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
    
    // Добавляем панель в DOM
    const sidebarSlider = document.querySelector("#column-left > div.sidebar-slider.tabs-container");
    sidebarSlider.insertAdjacentHTML('beforeend', settingsPanelHTML);
    
    // Добавляем обработчики событий
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    // Обработчик закрытия
    const closeButton = document.querySelector('.webgram-settings-container .sidebar-close-button');
    closeButton.addEventListener('click', () => {
        document.querySelector('.webgram-settings-container').remove();
    });
}

// Сохраняем настройки
async function saveSettings() {
    if (!currentUserId) return;
    
    const config = {
        verified: document.getElementById('verified-toggle').checked,
        premium: document.getElementById('premium-toggle').checked,
        emojiStatus: document.getElementById('emoji-status-input').value || null,
        gifts: document.getElementById('gifts-input').value.split(',').filter(id => id.trim())
    };
    
    await saveUserConfig(currentUserId, config);
    applyUserConfig(currentUserId, config);
    
    // Закрываем панель
    document.querySelector('.webgram-settings-container').remove();
    
    // Показываем уведомление
    showNotification('Settings saved successfully!');
}

// Применяем конфигурацию пользователя
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
            
            // Добавляем класс with-icons если его нет
            if (!element.classList.contains('with-icons')) {
                element.classList.add('with-icons');
                element.setAttribute('data-with-icons', '1');
            }
            
            // Сохраняем текущее содержимое имени
            let nameText = element.textContent;
            const existingInner = element.querySelector('.peer-title-inner');
            if (existingInner) {
                nameText = existingInner.textContent;
            }
            
            // Очищаем и создаем новую структуру
            element.innerHTML = `<span class="peer-title-inner" dir="auto">${nameText}</span>`;
            
            // Добавляем premium иконку
            if (config.premium && !element.querySelector('.premium-icon')) {
                element.innerHTML += '<span class="tgico premium-icon"></span>';
            }
            
            // Добавляем verified иконку
            if (config.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
            }
            
            // Добавляем emoji статус
            if (config.emojiStatus && !element.querySelector('.emoji-status')) {
                element.innerHTML += `<span class="emoji-status media-sticker-wrapper" data-doc-id="${config.emojiStatus}"><img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/61b6b169-e8f1-4928-988a-b3919d42760e"></span>`;
            }
        });
    });
    
    // Создаем раздел подарков если нужно
    if (config.gifts && config.gifts.length > 0) {
        createGiftsSection(userId, config.gifts);
    }
}

// Создаем раздел подарков
function createGiftsSection(userId, gifts) {
    const profileContent = document.querySelector("#column-right > div > div > div.sidebar-content > div > div.profile-content");
    if (!profileContent) return;
    
    // Удаляем старый раздел подарков если есть
    const oldGiftsSection = document.querySelector("#column-right .search-super");
    if (oldGiftsSection) oldGiftsSection.remove();
    
    // Создаем новый раздел подарков
    const giftsHTML = `
        <div class="search-super is-full-viewport">
            <div class="search-super-tabs-scrollable menu-horizontal-scrollable sticky">
                <div>
                    <nav>
                        <div class="menu-horizontal-div-item rp">
                            <div class="c-ripple"></div>
                            <span class="menu-horizontal-div-item-span">
                                <span class="i18n search-super-pinned-gifts-wrap">Gifts
                                    <div class="search-super-pinned-gifts">
                                        <div data-doc-id="${gifts[0]}" class="media-sticker-wrapper">
                                            <img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/77ba17f4-af0d-4e8d-9834-59cad1aec979">
                                        </div>
                                    </div>
                                </span>
                                <i></i>
                            </span>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="search-super-tabs-container tabs-container">
                <div class="search-super-tab-container search-super-container-gifts tabs-tab active">
                    <div>
                        ${gifts.map(giftId => `
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
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    profileContent.insertAdjacentHTML('beforeend', giftsHTML);
}

// Показываем уведомление
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
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Основная функция инициализации
async function init() {
    // Создаем вкладку настроек
    createSettingsTab();
    
    // Получаем ID текущего пользователя и применяем настройки
    const profileName = document.querySelector("#column-left .profile-name .peer-title");
    if (profileName) {
        const userId = parseInt(profileName.getAttribute('data-peer-id'));
        if (userId) {
            const userConfig = await loadUserConfig(userId);
            applyUserConfig(userId, userConfig);
        }
    }
    
    // Применяем настройки для всех пользователей в чатах
    applyAllUsersConfig();
}

// Применяем настройки для всех пользователей
async function applyAllUsersConfig() {
    const selectors = [
        "#folders-container .peer-title",
        "#column-center .peer-title",
        "#column-right .peer-title", 
        "#column-left .peer-title",
        "#column-center .bubbles-inner .peer-title"
    ];
    
    const uniqueUserIds = new Set();
    
    // Собираем все ID пользователей на странице
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
    
    // Загружаем и применяем настройки для каждого пользователя
    for (const userId of uniqueUserIds) {
        const userConfig = await loadUserConfig(userId);
        if (Object.keys(userConfig).length > 0) {
            applyUserConfig(userId, userConfig);
        }
    }
}

// Запускаем скрипт
init();

// Периодически проверяем изменения
setInterval(() => {
    createSettingsTab();
    applyAllUsersConfig();
}, 3000);
