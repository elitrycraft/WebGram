const usersConfig = {
    6975201668: {
        verified: true,
        emojiStatus: null,
        premium: false
    },
    591678038: {
        verified: true,
        emojiStatus: null,
        premium: false
    },
};

const selectors = [
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big.is-muted._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span.peer-title.with-icons",
    "#column-center > div.chats-container.tabs-container > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
    "#column-right > div > div > div.sidebar-content > div > div.profile-content > div.profile-avatars-container > div.profile-avatars-info > div.profile-name > span",
    "#column-left > div.sidebar-slider.tabs-container > div.tabs-tab.sidebar-slider-item.scrolled-start.scrolled-end.scrollable-y-bordered.settings-container.profile-container.is-collapsed.active > div.sidebar-content > div > div.profile-content.is-me > div.profile-avatars-container > div.profile-avatars-info > div.profile-name > span"
];

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
            if (userConfig.premium && !element.querySelector('.premium-icon')) {
                element.innerHTML += '<span class="tgico premium-icon"></span>';
            }

            // Добавляем emoji статус
            if (userConfig.emojiStatus && !element.querySelector('.emoji-status')) {
                element.innerHTML += `<span class="emoji-status media-sticker-wrapper" data-doc-id="${userConfig.emojiStatus}"><img class="media-sticker" decoding="async" src="blob:https://web.telegram.org/61b6b169-e8f1-4928-988a-b3919d42760e"></span>`;
            }

            // Добавляем verified иконку
            if (userConfig.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
            }
        });
    });
}

function addVerification(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false };
    }
    usersConfig[userId].verified = true;
    addVerificationAndStatus();
}

function removeVerification(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].verified = false;
    }
    addVerificationAndStatus();
}

function setEmojiStatus(userId, docId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false };
    }
    usersConfig[userId].emojiStatus = docId;
    addVerificationAndStatus();
}

function removeEmojiStatus(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].emojiStatus = null;
    }
    addVerificationAndStatus();
}

function setPremium(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null, premium: false };
    }
    usersConfig[userId].premium = true;
    addVerificationAndStatus();
}

function removePremium(userId) {
    if (usersConfig[userId]) {
        usersConfig[userId].premium = false;
    }
    addVerificationAndStatus();
}

function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
}

addVerificationAndStatus();
setInterval(addVerificationAndStatus, 2000);
