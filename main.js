// Конфигурация пользователей
const usersConfig = {};

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

// Функция для создания кнопки WebGram в интерфейсе
function createWebGramButton() {
    // Проверяем, есть ли уже наша кнопка
    if (document.querySelector('.webgram-floating-btn')) {
        return;
    }
    
    // Создаем плавающую кнопку
    const webgramBtn = document.createElement('div');
    webgramBtn.className = 'webgram-floating-btn';
    webgramBtn.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #0088cc, #00a884);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 136, 204, 0.4);
            z-index: 9998;
            transition: all 0.3s ease;
            border: 3px solid white;
        ">
            <span style="
                color: white;
                font-size: 24px;
                font-weight: bold;
            ">WG</span>
        </div>
    `;
    
    webgramBtn.addEventListener('click', showWebGramPanel);
    document.body.appendChild(webgramBtn);
    
    console.log('🎯 WebGram button created');
}

// Функция для показа панели WebGram
function showWebGramPanel() {
    // Удаляем существующую панель если есть
    const existingPanel = document.querySelector('.webgram-panel');
    if (existingPanel) {
        document.body.removeChild(existingPanel);
        return;
    }
    
    const verifiedCount = Object.values(usersConfig).filter(user => user.verified).length;
    const emojiCount = Object.values(usersConfig).filter(user => user.emojiStatus).length;
    
    const panelHTML = `
        <div class="webgram-panel" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            width: 400px;
            max-width: 90vw;
            max-height: 80vh;
            overflow: hidden;
            font-family: system-ui, -apple-system, sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, #0088cc, #00a884);
                color: white;
                padding: 20px;
                text-align: center;
            ">
                <h2 style="margin: 0; font-size: 24px;">⚙️ WebGram Settings</h2>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                    <div>
                        <div style="font-size: 12px;">Verified</div>
                        <div style="font-size: 20px; font-weight: bold;">${verifiedCount}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px;">Emoji Status</div>
                        <div style="font-size: 20px; font-weight: bold;">${emojiCount}</div>
                    </div>
                </div>
            </div>
            
            <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
                <!-- Quick Actions -->
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">🚀 Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="showQuickAddModal()" style="
                            padding: 12px;
                            background: #0088cc;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">➕ Quick Add</button>
                        <button onclick="clearAllSettings()" style="
                            padding: 12px;
                            background: #ff4444;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">🗑️ Clear All</button>
                    </div>
                </div>
                
                <!-- Verified Users -->
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">✅ Verified Users</h3>
                    <div id="verified-users-list" style="
                        max-height: 120px;
                        overflow-y: auto;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 10px;
                    ">
                        ${getVerifiedUsersList()}
                    </div>
                    <button onclick="showVerifiedModal()" style="
                        width: 100%;
                        padding: 10px;
                        margin-top: 10px;
                        background: #00a884;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Manage Verified</button>
                </div>
                
                <!-- Emoji Status -->
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">🎨 Emoji Status</h3>
                    <div id="emoji-users-list" style="
                        max-height: 120px;
                        overflow-y: auto;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 10px;
                    ">
                        ${getEmojiUsersList()}
                    </div>
                    <button onclick="showEmojiModal()" style="
                        width: 100%;
                        padding: 10px;
                        margin-top: 10px;
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Manage Emoji</button>
                </div>
                
                <!-- Add by ID -->
                <div>
                    <h3 style="margin: 0 0 15px 0; color: #333;">🔢 Add by User ID</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="number" id="webgram-user-id" placeholder="User ID" style="
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            grid-column: 1 / -1;
                        ">
                        <button onclick="quickAddVerification()" style="
                            padding: 10px;
                            background: #0088cc;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Add ✅</button>
                        <button onclick="quickAddRandomEmoji()" style="
                            padding: 10px;
                            background: #ff6b6b;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Add 🎨</button>
                    </div>
                </div>
            </div>
            
            <div style="
                padding: 15px;
                background: #f8f9fa;
                text-align: center;
                border-top: 1px solid #eee;
            ">
                <button onclick="closeWebGramPanel()" style="
                    padding: 10px 20px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
        <div class="webgram-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        " onclick="closeWebGramPanel()"></div>
    `;
    
    const panel = document.createElement('div');
    panel.innerHTML = panelHTML;
    document.body.appendChild(panel);
}

// Функции для списков пользователей
function getVerifiedUsersList() {
    const verifiedUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.verified)
        .map(([userId]) => userId);
    
    if (verifiedUsers.length === 0) {
        return '<div style="text-align: center; color: #666; padding: 20px;">No verified users</div>';
    }
    
    return verifiedUsers.slice(0, 3).map(userId => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
            <span>${userId}</span>
            <button onclick="removeVerification(${userId}); updateWebGramPanel();" style="
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 12px;
                cursor: pointer;
            ">Remove</button>
        </div>
    `).join('') + (verifiedUsers.length > 3 ? 
        `<div style="text-align: center; color: #666; padding: 5px;">...and ${verifiedUsers.length - 3} more</div>` : ''
    );
}

function getEmojiUsersList() {
    const emojiUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.emojiStatus)
        .map(([userId, config]) => ({ userId, emojiStatus: config.emojiStatus }));
    
    if (emojiUsers.length === 0) {
        return '<div style="text-align: center; color: #666; padding: 20px;">No emoji status</div>';
    }
    
    return emojiUsers.slice(0, 3).map(({ userId, emojiStatus }) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
            <div>
                <div>${userId}</div>
                <div style="font-size: 10px; color: #666;">${emojiStatus}</div>
            </div>
            <button onclick="removeEmojiStatus(${userId}); updateWebGramPanel();" style="
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 12px;
                cursor: pointer;
            ">Remove</button>
        </div>
    `).join('') + (emojiUsers.length > 3 ? 
        `<div style="text-align: center; color: #666; padding: 5px;">...and ${emojiUsers.length - 3} more</div>` : ''
    );
}

// Функция обновления панели
function updateWebGramPanel() {
    const panel = document.querySelector('.webgram-panel');
    if (panel) {
        closeWebGramPanel();
        setTimeout(showWebGramPanel, 100);
    }
}

// Функция закрытия панели
function closeWebGramPanel() {
    const panel = document.querySelector('.webgram-panel');
    const overlay = document.querySelector('.webgram-overlay');
    
    if (panel) document.body.removeChild(panel);
    if (overlay) document.body.removeChild(overlay);
}

// Модальные окна
function showQuickAddModal() {
    const modalHTML = `
        <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0;">🚀 Quick Add</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">User ID:</label>
                <input type="number" id="modal-user-id" placeholder="Enter User ID" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 10px;
                ">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="modalAddVerification()" style="
                    padding: 12px;
                    background: #0088cc;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Add ✅ Only</button>
                
                <button onclick="modalAddEmoji()" style="
                    padding: 12px;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Add 🎨 Only</button>
                
                <button onclick="modalAddBoth()" style="
                    padding: 12px;
                    background: #00a884;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    grid-column: 1 / -1;
                ">Add ✅ + 🎨</button>
            </div>
            
            <button onclick="closeModal()" style="
                width: 100%;
                padding: 10px;
                margin-top: 15px;
                background: #666;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">Cancel</button>
        </div>
    `;
    
    showCustomModal(modalHTML);
}

function showVerifiedModal() {
    const verifiedUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.verified)
        .map(([userId]) => userId);
    
    let modalHTML = `
        <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0;">✅ Verified Users (${verifiedUsers.length})</h3>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">
    `;
    
    if (verifiedUsers.length === 0) {
        modalHTML += '<div style="text-align: center; color: #666; padding: 40px;">No verified users</div>';
    } else {
        modalHTML += verifiedUsers.map(userId => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <span>User ID: ${userId}</span>
                <button onclick="removeVerification(${userId}); closeModal(); showVerifiedModal();" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                ">Remove</button>
            </div>
        `).join('');
    }
    
    modalHTML += `
            </div>
            <button onclick="closeModal()" style="
                width: 100%;
                padding: 10px;
                background: #666;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    showCustomModal(modalHTML);
}

function showEmojiModal() {
    const emojiUsers = Object.entries(usersConfig)
        .filter(([_, config]) => config.emojiStatus)
        .map(([userId, config]) => ({ userId, emojiStatus: config.emojiStatus }));
    
    let modalHTML = `
        <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0;">🎨 Emoji Status (${emojiUsers.length})</h3>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">
    `;
    
    if (emojiUsers.length === 0) {
        modalHTML += '<div style="text-align: center; color: #666; padding: 40px;">No emoji status</div>';
    } else {
        modalHTML += emojiUsers.map(({ userId, emojiStatus }) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                    <div>User ID: ${userId}</div>
                    <div style="font-size: 12px; color: #666;">Doc: ${emojiStatus}</div>
                </div>
                <button onclick="removeEmojiStatus(${userId}); closeModal(); showEmojiModal();" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                ">Remove</button>
            </div>
        `).join('');
    }
    
    modalHTML += `
            </div>
            <button onclick="closeModal()" style="
                width: 100%;
                padding: 10px;
                background: #666;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    showCustomModal(modalHTML);
}

// Вспомогательные функции для модальных окон
function showCustomModal(content) {
    closeModal();
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10002;
        min-width: 300px;
        max-width: 90vw;
    `;
    modal.innerHTML = content;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10001;
    `;
    overlay.onclick = closeModal;
    
    modal.overlay = overlay;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function closeModal() {
    const modals = document.querySelectorAll('div');
    modals.forEach(modal => {
        if (modal.style.zIndex === '10002') {
            document.body.removeChild(modal);
        }
    });
    const overlays = document.querySelectorAll('div');
    overlays.forEach(overlay => {
        if (overlay.style.zIndex === '10001') {
            document.body.removeChild(overlay);
        }
    });
}

// Глобальные функции для кнопок
window.quickAddVerification = function() {
    const input = document.getElementById('webgram-user-id');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        input.value = '';
        updateWebGramPanel();
    } else {
        alert('Please enter a valid User ID');
    }
};

window.quickAddRandomEmoji = function() {
    const input = document.getElementById('webgram-user-id');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        const emojis = ['star_123', 'heart_456', 'fire_789', 'rocket_999', 'crown_111'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setEmojiStatus(userId, randomEmoji);
        input.value = '';
        updateWebGramPanel();
    } else {
        alert('Please enter a valid User ID');
    }
};

window.modalAddVerification = function() {
    const input = document.getElementById('modal-user-id');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        closeModal();
        updateWebGramPanel();
    } else {
        alert('Please enter a valid User ID');
    }
};

window.modalAddEmoji = function() {
    const input = document.getElementById('modal-user-id');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        const emojis = ['star_123', 'heart_456', 'fire_789', 'rocket_999', 'crown_111'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setEmojiStatus(userId, randomEmoji);
        closeModal();
        updateWebGramPanel();
    } else {
        alert('Please enter a valid User ID');
    }
};

window.modalAddBoth = function() {
    const input = document.getElementById('modal-user-id');
    const userId = parseInt(input.value);
    if (userId && !isNaN(userId)) {
        addVerification(userId);
        const emojis = ['star_123', 'heart_456', 'fire_789', 'rocket_999', 'crown_111'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setEmojiStatus(userId, randomEmoji);
        closeModal();
        updateWebGramPanel();
    } else {
        alert('Please enter a valid User ID');
    }
};

window.clearAllSettings = function() {
    if (confirm('Are you sure you want to clear ALL WebGram settings? This cannot be undone.')) {
        Object.keys(usersConfig).forEach(userId => {
            delete usersConfig[userId];
        });
        addVerificationAndStatus();
        updateWebGramPanel();
        alert('All settings cleared!');
    }
};

// Инициализация
function init() {
    addVerificationAndStatus();
    createWebGramButton();
    
    const observer = new MutationObserver(() => {
        addVerificationAndStatus();
        createWebGramButton();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
    
    console.log('🎯 WebGram initialized');
}

// Автозапуск
init();
addVerification(7899534962);

// Добавляем тестовые данные
setTimeout(() => {
    addVerification(123456789);
    setEmojiStatus(123456789, 'star_123');
    addVerification(987654321);
    setEmojiStatus(987654321, 'heart_456');
}, 1000);
