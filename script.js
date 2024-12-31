// script.js

// ユーティリティ関数
function getLocalStorageItem(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error(`"${key}"の取得に失敗しました:`, error);
        return [];
    }
}

function setLocalStorageItem(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`"${key}"の保存に失敗しました:`, error);
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 初期データの設定（管理者ユーザーの追加）
(function initializeData() {
    const pets = getLocalStorageItem('pets');

    // 管理者ユーザーが存在しない場合は追加
    const adminExists = pets.some(pet => pet.name === 'りく' && pet.role === 'admin');
    if (!adminExists) {
        const hashedAdminPassword = CryptoJS.SHA256('aabgiauhtwht@932upijbvaoihep9ugh').toString();
        const adminUser = {
            id: Date.now(), // 一意のIDを追加
            name: 'りく',
            email: 'admin@example.com', // 管理者のメールアドレスを設定
            birthday: {
                year: 1990,
                month: 1,
                day: 1
            },
            password: hashedAdminPassword,
            photo: 'default-profile.png', // 管理者のプロフィール画像URLを設定
            visibility: 'public', // 管理者は通常公開
            role: 'admin', // ユーザーの役割（admin または user）
            lastLogin: null,
            loginDates: [],
            loginCountLastMonth: 0
        };
        pets.push(adminUser);
        setLocalStorageItem('pets', pets);

        // 活動ログの追加
        addActivityLog('管理者「りく」が初期ユーザーとして登録されました。');
    }
})();

// ページロード時の処理
window.onload = function() {
    // 各セクションの取得
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const resetPasswordSection = document.getElementById('reset-password-section');
    const menuSection = document.getElementById('menu-section');
    const createDiarySection = document.getElementById('create-diary-section');
    const viewDiarySection = document.getElementById('view-diary-section');
    const viewProfileSection = document.getElementById('view-profile-section');
    const albumSection = document.getElementById('album-section');
    const publicDiarySection = document.getElementById('public-diary-section');
    const adminPanelSection = document.getElementById('admin-panel-section');

    // プロフィール画像表示用
    const menuProfileImage = document.getElementById('menu-profile-image');
    const menuProfileName = document.getElementById('menu-profile-name');
    const createDiaryProfileImage = document.getElementById('create-diary-profile-image');
    const createDiaryProfileName = document.getElementById('create-diary-profile-name');
    const viewDiaryProfileImage = document.getElementById('view-diary-profile-image');
    const viewDiaryProfileName = document.getElementById('view-diary-profile-name');

    const diaryList = document.getElementById('diary-list');
    const publicDiaryList = document.getElementById('public-diary-list');
    const profileName = document.getElementById('profile-name');

    // 管理者パネルの要素
    const userTableBody = document.querySelector('#user-table tbody');
    const adminRegisterForm = document.getElementById('admin-register-form');
    const activityLogList = document.getElementById('activity-log');
    const adminBackToMenuButton = document.getElementById('admin-back-to-menu');

    // 管理者パネルのタブ要素
    const adminTabs = document.querySelectorAll('.tab-button');
    const adminTabContents = document.querySelectorAll('.tab-content');

    // 切り替えボタン
    const showRegisterButton = document.getElementById('show-register');
    const showLoginButton = document.getElementById('show-login');
    const forgotPasswordButton = document.getElementById('forgot-password');
    const backToLoginButton = document.getElementById('back-to-login');
    const createDiaryButton = document.getElementById('create-diary');
    const viewDiaryButton = document.getElementById('view-diary');
    const viewProfileButton = document.getElementById('view-profile');
    const createAlbumButton = document.getElementById('create-album'); // 新規追加
    const adminPanelButton = document.getElementById('admin-panel'); // 管理者パネルボタン
    const backToMenuButton = document.getElementById('back-to-menu');
    const backToMenuFromViewButton = document.getElementById('back-to-menu-from-view');
    const backToMenuFromProfileButton = document.getElementById('back-to-menu-from-profile');
    const backToMenuFromAlbumButton = document.getElementById('back-to-menu-from-album'); // 新規追加
    const logoutButton = document.getElementById('logout-button');

    // プロフィール編集フォーム
    const editProfileForm = document.getElementById('edit-profile-form');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editPasswordInput = document.getElementById('edit-password');
    const editYearInput = document.getElementById('edit-year'); // 新規追加
    const editMonthInput = document.getElementById('edit-month'); // 新規追加
    const editDayInput = document.getElementById('edit-day'); // 新規追加
    const editYearDisplay = document.getElementById('edit-year-display'); // 新規追加

    // パスワードリセットフォーム
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetEmailInput = document.getElementById('reset-email');
    const newPasswordInput = document.getElementById('new-password');

    // プロフィール画像変更フォーム
    const changePhotoForm = document.getElementById('change-photo-form');
    const newPhotoInput = document.getElementById('new-photo');

    // 管理者パネルのバックボタン
    adminBackToMenuButton.addEventListener('click', () => {
        adminPanelSection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    // 管理者パネルのタブ切り替え
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 全てのタブボタンからactiveクラスを削除
            adminTabs.forEach(t => t.classList.remove('active'));
            // クリックされたタブにactiveクラスを追加
            tab.classList.add('active');

            // 全てのタブコンテンツを非表示
            adminTabContents.forEach(content => content.classList.remove('active'));

            // 対応するタブコンテンツを表示
            const target = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
            } else {
                console.error(`対応するタブコンテンツが見つかりません: ${target}`);
            }
        });
    });

    // イベントリスナー
    showRegisterButton.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLoginButton.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    forgotPasswordButton.addEventListener('click', () => {
        loginSection.style.display = 'none';
        resetPasswordSection.style.display = 'block';
    });

    backToLoginButton.addEventListener('click', () => {
        resetPasswordSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    createDiaryButton.addEventListener('click', () => {
        menuSection.style.display = 'none';
        createDiarySection.style.display = 'block';
        displayUserProfile(menuProfileImage, menuProfileName);
        displayUserProfile(createDiaryProfileImage, createDiaryProfileName);
    });

    viewDiaryButton.addEventListener('click', () => {
        // 成長日記の閲覧はログインユーザーのみ
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (!currentUser) {
            alert('ログインが必要です！');
            return;
        }
        menuSection.style.display = 'none';
        viewDiarySection.style.display = 'block';
        displayUserProfile(viewDiaryProfileImage, viewDiaryProfileName);
        displayUserDiaries(currentUser.name);
    });

    viewProfileButton.addEventListener('click', () => {
        menuSection.style.display = 'none';
        viewProfileSection.style.display = 'block';
        loadProfileForEditing();
    });

    createAlbumButton.addEventListener('click', () => { // 新規追加
        menuSection.style.display = 'none';
        albumSection.style.display = 'block';
    });

    adminPanelButton.addEventListener('click', () => { // 管理者パネルボタン
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (currentUser && currentUser.role === 'admin') {
            menuSection.style.display = 'none';
            adminPanelSection.style.display = 'block';
            loadAdminPanel();
        } else {
            alert('管理者権限がありません！');
        }
    });

    backToMenuButton.addEventListener('click', () => {
        createDiarySection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    backToMenuFromViewButton.addEventListener('click', () => {
        viewDiarySection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    backToMenuFromProfileButton.addEventListener('click', () => {
        viewProfileSection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    backToMenuFromAlbumButton.addEventListener('click', () => { // 新規追加
        albumSection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    logoutButton.addEventListener('click', () => {
        setLocalStorageItem('currentUser', []);
        alert('ログアウトしました！');
        location.reload(); // ページをリロードしてログイン画面に戻る
    });

    // ログイン処理
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const loginName = document.getElementById('login-name').value.trim();
        const loginPassword = document.getElementById('login-password').value;
        const pets = getLocalStorageItem('pets');

        // パスワードのハッシュ化
        const hashedLoginPassword = CryptoJS.SHA256(loginPassword).toString();

        const pet = pets.find(p => p.name === loginName && p.password === hashedLoginPassword);
        if (pet) {
            alert(`ようこそ、${pet.name}！`);
            profileName.textContent = pet.name;
            // プロフィール画像をメニューに表示
            menuProfileImage.src = pet.photo || 'default-profile.png'; // デフォルト画像を設定
            menuProfileName.textContent = pet.name;
            // プロフィール画像を作成日記と閲覧日記に表示
            createDiaryProfileImage.src = pet.photo || 'default-profile.png';
            createDiaryProfileName.textContent = pet.name;
            viewDiaryProfileImage.src = pet.photo || 'default-profile.png';
            viewDiaryProfileName.textContent = pet.name;

            // 最終ログイン日時の更新
            pet.lastLogin = new Date().toLocaleString();

            // 1か月間のログイン回数の更新
            const now = new Date();
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            if (!pet.loginDates) {
                pet.loginDates = [];
            }
            // 現在の日付を追加
            pet.loginDates.push(now.toISOString());
            // 1か月前以降のログイン回数をカウント
            pet.loginCountLastMonth = pet.loginDates.filter(date => new Date(date) >= oneMonthAgo).length;

            // 活動ログの追加
            addActivityLog(`ユーザー「${pet.name}」がログインしました。`);

            setLocalStorageItem('pets', pets);
            setLocalStorageItem('currentUser', [pet]); // 現在のユーザーを保存
            loginSection.style.display = 'none';
            menuSection.style.display = 'block';
            displayPublicDiaries();

            // 管理者パネルボタンの表示制御
            if (pet.role === 'admin') {
                adminPanelButton.style.display = 'block';
            } else {
                adminPanelButton.style.display = 'none';
            }
        } else {
            alert('名前またはパスワードが間違っています！');
        }
    });

    // 登録フォーム送信処理
    const registerForm = document.getElementById('pet-profile-form');
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const petName = document.getElementById('pet-name').value.trim();
        const petEmail = document.getElementById('pet-email').value.trim();
        const petPassword = document.getElementById('pet-password').value;
        const petYear = document.getElementById('pet-year').value;
        const petMonth = document.getElementById('pet-month').value;
        const petDay = document.getElementById('pet-day').value;
        const petPhoto = document.getElementById('pet-photo').files[0];

        // 入力のバリデーション
        if (!validateEmail(petEmail)) {
            alert('有効なメールアドレスを入力してください。');
            return;
        }

        if (!validatePassword(petPassword)) {
            alert('パスワードは8文字以上で、少なくとも1つの数字と特殊文字を含めてください。');
            return;
        }

        // 名前とメールアドレスの重複チェック
        const pets = getLocalStorageItem('pets');
        const nameExists = pets.some(p => p.name === petName);
        const emailExists = pets.some(p => p.email === petEmail);
        if (nameExists) {
            alert('この名前は既に使用されています。他の名前を選んでください。');
            return;
        }
        if (emailExists) {
            alert('このメールアドレスは既に登録されています。');
            return;
        }

        // パスワードのハッシュ化
        const hashedPassword = CryptoJS.SHA256(petPassword).toString();

        const reader = new FileReader();
        reader.onload = function(e) {
            const petData = {
                id: Date.now(), // 一意のIDを追加
                name: petName,
                email: petEmail,
                birthday: {
                    year: petYear,
                    month: petMonth,
                    day: petDay
                },
                password: hashedPassword,
                photo: e.target.result, // 画像データを保存
                visibility: 'private', // デフォルトを非公開に設定
                role: 'user', // 一般ユーザー
                lastLogin: null,
                loginDates: [],
                loginCountLastMonth: 0
            };

            pets.push(petData);
            setLocalStorageItem('pets', pets);

            // 活動ログの追加
            addActivityLog(`ユーザー「${petName}」が新規登録しました。`);

            alert('ペット情報が保存されました！');
            registerForm.reset();

            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        };

        if (petPhoto) {
            reader.readAsDataURL(petPhoto);
        } else {
            alert('プロフィール画像を選択してください！');
        }
    });

    // パスワードリセット処理
    resetPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const resetEmail = resetEmailInput.value.trim();
        const newPassword = newPasswordInput.value;

        if (!resetEmail || !newPassword) {
            alert('メールアドレスと新しいパスワードを入力してください。');
            return;
        }

        if (!validatePassword(newPassword)) {
            alert('パスワードは8文字以上で、少なくとも1つの数字と特殊文字を含めてください。');
            return;
        }

        const pets = getLocalStorageItem('pets');
        const petIndex = pets.findIndex(p => p.email === resetEmail);

        if (petIndex === -1) {
            alert('登録されたメールアドレスが見つかりません。');
            return;
        }

        // パスワードのハッシュ化
        const hashedNewPassword = CryptoJS.SHA256(newPassword).toString();

        pets[petIndex].password = hashedNewPassword;

        // 活動ログの追加
        addActivityLog(`ユーザー「${pets[petIndex].name}」のパスワードがリセットされました。`);

        setLocalStorageItem('pets', pets);

        alert('パスワードがリセットされました！');
        resetPasswordForm.reset();
        resetPasswordSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // 成長日記の保存と閲覧
    const diaryForm = document.getElementById('diary-form');
    diaryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const currentUser = getLocalStorageItem('currentUser')[0];
        if (!currentUser) {
            alert('ログインが必要です！');
            return;
        }

        const title = document.getElementById('diary-title').value.trim();
        const content = document.getElementById('diary-content').value.trim();
        const files = document.getElementById('diary-photo').files;
        const timestamp = new Date().toLocaleString();

        if (!title || !content) {
            alert('タイトルと内容を入力してください。');
            return;
        }

        const diary = {
            id: Date.now(), // 一意のIDを追加
            title,
            content,
            timestamp,
            files: [],
            visibility: 'public', // デフォルトで公開設定
            owner: currentUser.name // 所有者情報を追加
        };

        if (files.length > 0) {
            let filesLoaded = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    diary.files.push(e.target.result);
                    filesLoaded++;
                    if (filesLoaded === files.length) {
                        saveDiary(diary);
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            saveDiary(diary);
        }
    });

    // 日記の保存関数
    function saveDiary(diary) {
        const diaries = getLocalStorageItem('diaries');
        diaries.push(diary);
        setLocalStorageItem('diaries', diaries);
        alert('日記が保存されました！');
        diaryForm.reset();
        createDiarySection.style.display = 'none';
        menuSection.style.display = 'block';
        displayUserDiaries(diary.owner); // 保存後に自分の日記を表示
        displayPublicDiaries();

        // 活動ログの追加
        addActivityLog(`ユーザー「${diary.owner}」が新しい日記「${diary.title}」を作成しました。`);
    }

    // 成長日記の表示（ユーザー専用）
    function displayUserDiaries(userName) {
        diaryList.innerHTML = '';
        let diaries = getLocalStorageItem('diaries');
        diaries = diaries.filter(diary => diary.owner === userName).reverse(); // 自分の日記のみ

        if (diaries.length === 0) {
            diaryList.innerHTML = '<p>日記がありません。</p>';
            return;
        }

        diaries.forEach((diary) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h3>${escapeHTML(diary.title)}</h3>
                <p>${escapeHTML(diary.content)}</p>
                <p>投稿時間: ${diary.timestamp}</p>
                ${diary.files.map(file => {
                    if (file.endsWith('.mp4') || file.endsWith('.webm')) {
                        return `<video controls src="${file}"></video>`;
                    } else {
                        return `<img src="${file}" alt="写真">`;
                    }
                }).join('')}
                <button onclick="deleteDiary('${diary.owner}', ${diary.id})">削除</button>
            `;
            diaryList.appendChild(listItem);
        });
    }

    // 成長日記の削除機能
    window.deleteDiary = function(owner, diaryId) { // グローバルスコープに設定
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (owner !== currentUser.name) {
            alert('他のユーザーの日記は削除できません！');
            return;
        }

        if (!confirm('本当にこの日記を削除しますか？')) {
            return;
        }

        let diaries = getLocalStorageItem('diaries');
        const diaryIndex = diaries.findIndex(diary => diary.id === diaryId && diary.owner === owner);
        if (diaryIndex === -1) {
            alert('日記が見つかりません。');
            return;
        }

        const deletedDiary = diaries.splice(diaryIndex, 1)[0];
        setLocalStorageItem('diaries', diaries);
        displayUserDiaries(owner);
        displayPublicDiaries();
        alert('日記が削除されました！');

        // 活動ログの追加
        addActivityLog(`ユーザー「${owner}」が日記「${deletedDiary.title}」を削除しました。`);
    };

    // 公開日記の表示
    function displayPublicDiaries() {
        publicDiaryList.innerHTML = '';
        let diaries = getLocalStorageItem('diaries');
        let pets = getLocalStorageItem('pets');

        // 現在のユーザーを取得
        const currentUser = getLocalStorageItem('currentUser')[0];

        // 公開設定が "public" のユーザーのみの日記を取得
        const publicDiaries = diaries.filter(diary => {
            const ownerProfile = pets.find(pet => pet.name === diary.owner);
            // 自分の投稿は除外
            if (currentUser && diary.owner === currentUser.name) {
                return false;
            }
            return ownerProfile && ownerProfile.visibility === 'public' && diary.visibility === 'public';
        }).reverse(); // 新しい順

        if (publicDiaries.length === 0) {
            publicDiaryList.innerHTML = '<p>公開日記がありません。</p>';
            return;
        }

        publicDiaries.forEach(diary => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h3>${escapeHTML(diary.title)}</h3>
                <p>${escapeHTML(diary.content)}</p>
                <p>投稿時間: ${diary.timestamp}</p>
                ${diary.files.map(file => {
                    if (file.endsWith('.mp4') || file.endsWith('.webm')) {
                        return `<video controls src="${file}"></video>`;
                    } else {
                        return `<img src="${file}" alt="写真">`;
                    }
                }).join('')}
                <p>投稿者: ${escapeHTML(diary.owner)}</p>
            `;
            publicDiaryList.appendChild(listItem);
        });
    }

    // マイプロフィールのロード
    function loadProfileForEditing() {
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (!currentUser) {
            alert('ログインが必要です！');
            viewProfileSection.style.display = 'none';
            menuSection.style.display = 'block';
            return;
        }

        editNameInput.value = currentUser.name;
        editEmailInput.value = currentUser.email;
        editYearInput.value = currentUser.birthday.year;
        editMonthInput.value = currentUser.birthday.month;
        editDayInput.value = currentUser.birthday.day;
        editYearDisplay.textContent = currentUser.birthday.year;
        document.getElementById('edit-visibility').value = currentUser.visibility;

        profileName.textContent = currentUser.name;
    }

    // プロフィール編集フォーム送信処理
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newName = editNameInput.value.trim();
        const newEmail = editEmailInput.value.trim();
        const newPassword = editPasswordInput.value;
        const newYear = editYearInput.value; // スライド式の生まれ年
        const newMonth = editMonthInput.value; // 月
        const newDay = editDayInput.value; // 日
        const newVisibility = document.getElementById('edit-visibility').value;

        const currentUser = getLocalStorageItem('currentUser')[0];
        if (!currentUser) {
            alert('ログインが必要です！');
            return;
        }

        const pets = getLocalStorageItem('pets');
        const petIndex = pets.findIndex(p => p.email === currentUser.email); // メールアドレスで検索

        if (petIndex === -1) {
            alert('ユーザー情報が見つかりません！');
            return;
        }

        // 名前とメールアドレスの重複チェック
        if (newName !== currentUser.name) {
            const nameExists = pets.some(p => p.name === newName);
            if (nameExists) {
                alert('この名前は既に使用されています。他の名前を選んでください。');
                return;
            }
        }

        if (newEmail !== currentUser.email) {
            const emailExists = pets.some(p => p.email === newEmail);
            if (emailExists) {
                alert('このメールアドレスは既に登録されています。');
                return;
            }
        }

        const updatedFields = {
            name: newName,
            email: newEmail,
            birthday: {
                year: newYear,
                month: newMonth,
                day: newDay
            },
            visibility: newVisibility
        };

        if (newPassword) {
            if (!validatePassword(newPassword)) {
                alert('パスワードは8文字以上で、少なくとも1つの数字と特殊文字を含めてください。');
                return;
            }
            const hashedNewPassword = CryptoJS.SHA256(newPassword).toString();
            updatedFields.password = hashedNewPassword;
        }

        // 名前とメールアドレスの更新
        pets[petIndex] = { ...pets[petIndex], ...updatedFields };
        setLocalStorageItem('pets', pets);
        setLocalStorageItem('currentUser', [pets[petIndex]]);

        // プロフィール画像をメニューに表示
        menuProfileImage.src = pets[petIndex].photo || 'default-profile.png';
        menuProfileName.textContent = pets[petIndex].name;
        createDiaryProfileImage.src = pets[petIndex].photo || 'default-profile.png';
        createDiaryProfileName.textContent = pets[petIndex].name;
        viewDiaryProfileImage.src = pets[petIndex].photo || 'default-profile.png';
        viewDiaryProfileName.textContent = pets[petIndex].name;

        // 活動ログの追加
        addActivityLog(`ユーザー「${newName}」がプロフィールを更新しました。`);

        alert('プロフィールが更新されました！');
        editProfileForm.reset();
        viewProfileSection.style.display = 'none';
        menuSection.style.display = 'block';
    });

    // プロフィール画像変更フォーム送信処理
    changePhotoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const currentUser = getLocalStorageItem('currentUser')[0];
        if (!currentUser) {
            alert('ログインが必要です！');
            return;
        }

        const newPhoto = newPhotoInput.files[0];
        if (!newPhoto) {
            alert('新しいプロフィール画像を選択してください！');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const pets = getLocalStorageItem('pets');
            const petIndex = pets.findIndex(p => p.email === currentUser.email);

            if (petIndex === -1) {
                alert('ユーザー情報が見つかりません！');
                return;
            }

            pets[petIndex].photo = e.target.result;
            setLocalStorageItem('pets', pets);

            // 更新されたユーザー情報を currentUser に反映
            setLocalStorageItem('currentUser', [pets[petIndex]]);

            // プロフィール画像をメニューに表示
            menuProfileImage.src = pets[petIndex].photo || 'default-profile.png';
            menuProfileName.textContent = pets[petIndex].name;
            createDiaryProfileImage.src = pets[petIndex].photo || 'default-profile.png';
            createDiaryProfileName.textContent = pets[petIndex].name;
            viewDiaryProfileImage.src = pets[petIndex].photo || 'default-profile.png';
            viewDiaryProfileName.textContent = pets[petIndex].name;

            // 活動ログの追加
            addActivityLog(`ユーザー「${pets[petIndex].name}」がプロフィール画像を変更しました。`);

            alert('プロフィール画像が変更されました！');
            changePhotoForm.reset();
        };

        reader.readAsDataURL(newPhoto);
    });

    // 管理者パネルのロード
    function loadAdminPanel() {
        displayUserList();
        displayActivityLog();
    }

    // ユーザー一覧の表示
    function displayUserList() {
        const pets = getLocalStorageItem('pets');
        userTableBody.innerHTML = ''; // 既存の行をクリア

        pets.forEach((pet, index) => {
            // 管理者ユーザーは表示しない
            if (pet.role === 'admin') return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHTML(pet.name)}</td>
                <td>${escapeHTML(pet.email)}</td>
                <td>${pet.lastLogin ? escapeHTML(pet.lastLogin) : '未ログイン'}</td>
                <td>${pet.loginCountLastMonth}</td>
                <td><button onclick="deleteUser('${escapeHTML(pet.email)}')" type="button">削除</button></td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // ユーザーの削除機能
    window.deleteUser = function(email) { // グローバルスコープに設定
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (currentUser.email === email) {
            alert('現在ログインしているユーザーは削除できません。');
            return;
        }

        if (!confirm('本当にこのユーザーを削除しますか？')) {
            return;
        }

        let pets = getLocalStorageItem('pets');
        const petIndex = pets.findIndex(p => p.email === email);
        if (petIndex === -1) {
            alert('ユーザーが見つかりません。');
            return;
        }

        const deletedUser = pets.splice(petIndex, 1)[0];
        setLocalStorageItem('pets', pets);

        // 活動ログの追加
        addActivityLog(`管理者がユーザー「${deletedUser.name}」を削除しました。`);

        alert(`ユーザー「${deletedUser.name}」を削除しました。`);
        displayUserList();
        displayActivityLog();
    };

    // 管理者によるユーザー登録処理
    adminRegisterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const adminRegisterName = document.getElementById('admin-register-name').value.trim();
        const adminRegisterEmail = document.getElementById('admin-register-email').value.trim();
        const adminRegisterPassword = document.getElementById('admin-register-password').value;

        // 名前とメールアドレスの重複チェック
        const pets = getLocalStorageItem('pets');
        const nameExists = pets.some(p => p.name === adminRegisterName);
        const emailExists = pets.some(p => p.email === adminRegisterEmail);
        if (nameExists) {
            alert('この名前は既に使用されています。他の名前を選んでください。');
            return;
        }
        if (emailExists) {
            alert('このメールアドレスは既に登録されています。');
            return;
        }

        // パスワードのバリデーション
        if (!validatePassword(adminRegisterPassword)) {
            alert('パスワードは8文字以上で、少なくとも1つの数字と特殊文字を含めてください。');
            return;
        }

        // パスワードのハッシュ化
        const hashedPassword = CryptoJS.SHA256(adminRegisterPassword).toString();

        const newUser = {
            id: Date.now(), // 一意のIDを追加
            name: adminRegisterName,
            email: adminRegisterEmail,
            birthday: {
                year: '',
                month: '',
                day: ''
            },
            password: hashedPassword,
            photo: 'default-profile.png', // デフォルトの画像を設定
            visibility: 'private', // デフォルトを非公開に設定
            role: 'user', // 一般ユーザー
            lastLogin: null,
            loginDates: [],
            loginCountLastMonth: 0
        };

        pets.push(newUser);
        setLocalStorageItem('pets', pets);

        // 活動ログの追加
        addActivityLog(`管理者が新規ユーザー「${newUser.name}」を登録しました。`);

        alert(`ユーザー「${newUser.name}」が登録されました。`);
        adminRegisterForm.reset();
        displayUserList();
        displayActivityLog();
    });

    // アクティビティログの表示
    function displayActivityLog() {
        const activityLogs = getLocalStorageItem('activityLogs');
        activityLogList.innerHTML = ''; // 既存のログをクリア

        activityLogs.slice().reverse().forEach(log => {
            const listItem = document.createElement('li');
            listItem.textContent = log;
            activityLogList.appendChild(listItem);
        });
    }

    // 全ユーザー削除機能（管理者専用）
    const resetAllUsersButton = document.getElementById('reset-all-users');

    if (resetAllUsersButton) {
        resetAllUsersButton.addEventListener('click', () => {
            console.log('全ユーザー削除ボタンがクリックされました。'); // デバッグ用ログ
            const userConfirmed = confirm('本当に全ての一般ユーザーを削除しますか？管理者ユーザーは削除されません。');
            console.log('ユーザーの確認結果:', userConfirmed); // デバッグ用ログ

            if (!userConfirmed) {
                console.log('ユーザーが削除をキャンセルしました。'); // デバッグ用ログ
                return;
            }

            let pets = getLocalStorageItem('pets');
            const initialLength = pets.length;
            pets = pets.filter(pet => pet.role === 'admin'); // 管理者ユーザーのみ残す
            const deletedCount = initialLength - pets.length;

            setLocalStorageItem('pets', pets);

            // 活動ログの追加
            addActivityLog(`管理者が全ての一般ユーザーを削除しました。（削除数: ${deletedCount}）`);

            alert(`全ての一般ユーザーを削除しました。（削除数: ${deletedCount}）`);
            displayUserList();
            displayActivityLog();
        });
    } else {
        console.error('「reset-all-users」ボタンが見つかりません。IDが正しいか確認してください。');
    }

    // データリセット機能（新規追加）
    const resetDataButton = document.getElementById('reset-data');

    if (resetDataButton) {
        resetDataButton.addEventListener('click', () => {
            console.log('データリセットボタンがクリックされました。'); // デバッグ用ログ
            const userConfirmed = confirm('本当に全てのデータをリセットし、管理者ユーザーのみを再登録しますか？実行すると全てのユーザーデータが削除されます。');
            console.log('ユーザーの確認結果:', userConfirmed); // デバッグ用ログ

            if (!userConfirmed) {
                console.log('データリセットがキャンセルされました。'); // デバッグ用ログ
                return;
            }

            // localStorageをクリア
            localStorage.clear();
            console.log('localStorageをクリアしました。'); // デバッグ用ログ

            // 管理者ユーザーを再登録
            const hashedAdminPassword = CryptoJS.SHA256('aabgiauhtwht@932upijbvaoihep9ugh').toString();
            const adminUser = {
                id: Date.now(),
                name: 'りく',
                email: 'admin@example.com', // 管理者のメールアドレスを設定
                birthday: {
                    year: 1990,
                    month: 1,
                    day: 1
                },
                password: hashedAdminPassword,
                photo: 'default-profile.png', // 管理者のプロフィール画像URLを設定
                visibility: 'public', // 管理者は通常公開
                role: 'admin', // ユーザーの役割（admin または user）
                lastLogin: null,
                loginDates: [],
                loginCountLastMonth: 0
            };

            setLocalStorageItem('pets', [adminUser]);

            // 活動ログの追加
            addActivityLog('全データがリセットされ、管理者「りく」が再登録されました。');

            alert('全データがリセットされました。管理者ユーザーとして再登録されました。');
            displayUserList();
            displayActivityLog();
        });
    } else {
        console.error('「reset-data」ボタンが見つかりません。IDが正しいか確認してください。');
    }

    // 活動ログの追加
    function addActivityLog(message) {
        const activityLogs = getLocalStorageItem('activityLogs');
        const timestamp = new Date().toLocaleString();
        activityLogs.push(`[${timestamp}] ${message}`);
        setLocalStorageItem('activityLogs', activityLogs);

        // 管理者パネルが表示されている場合はリアルタイムで更新
        if (adminPanelSection.style.display === 'block') {
            displayActivityLog();
        }
    }

    // ユーザープロフィールの表示
    function displayUserProfile(imageElement, nameElement) {
        const currentUser = getLocalStorageItem('currentUser')[0];
        if (currentUser) {
            imageElement.src = currentUser.photo || 'default-profile.png'; // デフォルト画像を設定
            nameElement.textContent = currentUser.name;
        }
    }

    // ユーザーデータの更新関数
    function petsUpdate(updateFunction) {
        let pets = getLocalStorageItem('pets');
        pets = updateFunction(pets);
        setLocalStorageItem('pets', pets);
    }

    // 管理者パネルのロード関数
    function loadAdminPanel() {
        displayUserList();
        displayActivityLog();
    }

    // バリデーション関数の追加
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // 例: 8文字以上、少なくとも1つの数字と特殊文字
        const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        return re.test(password);
    }
};
