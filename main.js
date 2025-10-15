const usersConfig = {
    5666666768: {
        verified: true,
        emojiStatus: "5251550383624443434"
    },
    777000: {
        verified: true,
        emojiStatus: null
    }
};

const selectors = [
    "#folders-container > div.scrollable.scrollable-y.tabs-tab.chatlist-parts.folders-scrollable.scrolled-start.scrollable-y-bordered.active > div.chatlist-top > ul > a.row.no-wrap.row-with-padding.row-clickable.hover-effect.rp.chatlist-chat.chatlist-chat-bigger.row-big.is-muted._Item_5idej_1.active > div.row-row.row-title-row.dialog-title > div.row-title.no-wrap.user-title > span.peer-title.with-icons",
    "#column-center > div.chats-container.tabs-container > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
    "#column-right > div > div > div.sidebar-content > div > div.profile-content > div.profile-avatars-container.is-single > div.profile-avatars-info > div.profile-name > span"
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
            if (userConfig.verified && !element.querySelector('.verified-icon')) {
                element.innerHTML += '<span class="verified-icon"><svg viewBox="0 0 26 26" width="26" height="26" class="verified-icon-svg"><use href="#verified-icon-check" class="verified-icon-check"></use><use href="#verified-icon-background" class="verified-icon-background"></use></svg></span>';
            }
            if (userConfig.emojiStatus && !element.querySelector('.emoji-status')) {
                element.innerHTML += `<span class="emoji-status media-sticker-wrapper" data-doc-id="${userConfig.emojiStatus}"><img class="media-sticker" src="blob:https://web.telegram.org/c9e9a04a-184b-40a7-9e78-79fd4e719ed1"></span>`;
            }
        });
    });
}

function addVerification(userId) {
    if (!usersConfig[userId]) {
        usersConfig[userId] = { verified: false, emojiStatus: null };
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
        usersConfig[userId] = { verified: false, emojiStatus: null };
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

function configureUser(userId, config) {
    usersConfig[userId] = { ...usersConfig[userId], ...config };
    addVerificationAndStatus();
}

addVerificationAndStatus();
setInterval(addVerificationAndStatus, 2000);
