import connection from '../config/connectDB';
import md5 from 'md5';
import helpers from '../../helpers';
import ApiController from '../controllers/APIcontroller/APIcontroller';

require('dotenv').config();
const OPERATORCODE = process.env.OPERATORCODE;
const SECRET_KEY = process.env.SECRET_KEY_API;

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function formateT(params) {
    let result = params < 10 ? '0' + params : params;
    return result;
}

function timerJoin(params = '') {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = formateT(date.getHours());
    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());
    return years + '-' + months + '-' + days;
}

function timerJoinPreDay(params = '') {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate() - 1);
    return years + '-' + months + '-' + days;
}

function timerJoin2(params = '') {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = formateT(date.getHours());
    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());
    return (
        years +
        '-' +
        months +
        '-' +
        days +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
    );
}

function randomStr(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
const findOneToken = async (token) => {
    const [user] = await connection.execute(
        'SELECT * FROM users WHERE token = ?',
        [token]
    );
    return user;
};

const createPlayer = async (token) => {
    const [UserInfo] = await findOneToken(token);
    await ApiController.createPlayer(OPERATORCODE, SECRET_KEY, UserInfo.phone);
    return;
};

const findOne = async ({ username }) => {
    const [user] = await connection.execute(
        'SELECT `id` FROM users WHERE username = ?',
        [username]
    );
    return user;
};

const findInvite = async (invite) => {
    const [user] = await connection.execute(
        'SELECT `id` FROM users WHERE ref = ?',
        [invite]
    );
    return user;
};

const checkAcount = async ({ username, password }) => {
    let [user] = await connection.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username.toLowerCase(), md5(password)]
    );
    let token = md5(username + password + Date.now());
    if (user.length > 0) {
        await connection.execute(
            'UPDATE users SET token = ? WHERE username = ?',
            [token, username]
        );
    }
    return { token, user };
};

const save = async ({ username, password }) => {
    let token = md5(username + password + Date.now());
    await connection.execute('UPDATE users SET token = ? WHERE phone = ?', [
        token,
        username,
    ]);
    await createPlayer(token);
    return { token };
};

const addRecharge = async ({ money, namebank, stk, chutk, noidung }, token) => {
    if (!money || !namebank || !stk || !chutk)
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    const [user] = await findOneToken(token);
    let username = user.username;

    // Nếu chưa liên kết ngân hàng thì nạp cái úp sọt luôn
    // console.log(user);
    // if (!user.bank_number) {
    //     await connection.execute('UPDATE users SET isAddBanking = 0 WHERE username = ?', [username]);
    // }

    let id_txn = noidung;
    let now = Date.now();

    let create_at = timerJoin2();

    let [recharge] = await connection.execute(
        'SELECT * FROM recharge WHERE username = ? AND status = 0',
        [username]
    );

    if (recharge.length > 0) {
        return { status: false, msg: 'Hãy hoàn thành lệnh nạp cũ trước!' };
    }

    await connection.execute(
        'INSERT INTO recharge SET username = ?, id_txn = ?, amount = ?, namebank = ?, stk = ?, chutk = ?, status = ?, time = ?, ref = ?, create_at = ?',
        [
            username,
            id_txn,
            money,
            namebank,
            stk,
            chutk,
            0,
            new Date().getTime(),
            user.invite,
            create_at,
        ]
    );

    let data = { id_txn, money, namebank, stk, chutk, username };
    return { status: true, data: data };
};

const getRecharge = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [recharge] = await connection.execute(
        'SELECT id, id_txn, amount, namebank, stk, chutk, status, descriptions, type, create_at FROM recharge WHERE username = ? ORDER BY id DESC LIMIT 100',
        [username]
    );

    return { status: true, data: recharge };
};

const changePassword = async ({ passwordOld, newPassword }, token) => {
    if (!passwordOld || !newPassword)
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    const [user] = await findOneToken(token);
    let { username, password } = user;
    if (md5(passwordOld) != password)
        return { status: false, msg: 'Mật khẩu cũ không khớp!' };
    await connection.execute(
        'UPDATE users SET password = ?, password_note = ?, password_api = ? WHERE username = ?',
        [md5(newPassword), newPassword, newPassword, username]
    );
    const result = await ApiController.updatePlayerPassword(
        user.username,
        passwordOld,
        newPassword
    );
    return { status: true, msg: 'Đổi mật khẩu thành công' };
};

const changePasswordTransaction = async (
    { password_user, newPassword, type },
    token
) => {
    // password_user ở đây là mật khẩu rút tiền cũ
    if (!newPassword) return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    const [user] = await findOneToken(token);
    let { username, password_v2 } = user;

    if (type === false) {
        await connection.execute(
            'UPDATE users SET password_v2 = ?, password_v2_note = ? WHERE username = ?',
            [md5(newPassword), newPassword, username]
        );

        return {
            status: true,
            msg: 'Cập nhật mật khẩu rút tiền mới thành công!',
        };
    } else if (md5(password_user) != password_v2) {
        return { status: false, msg: 'Mật khẩu rút tiền cũ không đúng!' };
    } else {
        await connection.execute(
            'UPDATE users SET password_v2 = ?, password_v2_note = ? WHERE username = ?',
            [md5(newPassword), newPassword, username]
        );
        return { status: true, msg: 'Đổi mật khẩu rút tiền thành công!' };
    }
};

const addBanking = async ({ nameuser, stk, nameBank }, token) => {
    try {
        if (!nameuser || !stk || !nameBank)
            return { status: false, msg: 'Nhập đầy đủ thông tin!' };
        const [user] = await findOneToken(token);
        //console.log(typeof user.bank_name);

        // Không cho thêm ngân hàng khi isAddBanking = 0
        // if (!user.isAddBanking) {
        //     return { status: false, msg: 'Vui lòng liên hệ chăm sóc khách hàng để thêm ngân hàng!' };
        // }

        if (
            user.bank_name !== null ||
            user.bank_number !== null ||
            user.bank_user !== null
        )
            return {
                status: false,
                msg: 'Bạn đã cập nhật tài khoản trước đó!',
            };
        await connection.execute(
            'UPDATE users SET bank_name = ?, bank_number = ?, bank_user = ? WHERE token = ?',
            [nameBank, stk, nameuser, token]
        );
        return {
            status: true,
            msg: 'Cập nhật tài khoản ngân hàng thành công!',
        };
    } catch (err) {
        console.log(err);
    }
};

const checkBanking = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [recharge] = await connection.execute(
        `SELECT users.money, users.money_2, users_bank.* FROM users INNER JOIN users_bank ON users.username = users_bank.username WHERE users.username = ? `,
        [username]
    );
    let [pending] = await connection.execute(
        'SELECT SUM(mission.receive) as pending FROM mission INNER JOIN mission_done ON mission.id_mission = mission_done.id_mission WHERE mission_done.username = ? AND mission_done.status = ?',
        [username, 0]
    ); // Số dư bị đóng băng
    return { recharge, pending: pending[0].pending || '0' };
};

const withdraw = async ({ money, password }, token) => {
    if (!money || !password)
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };

    const [user] = await findOneToken(token);
    money = Number(money);
    let username = user.username;
    let money_user = user.money; // SỐ tiền của user
    let password_user = user.password_v2; // SỐ tiền của user
    let money_bet = user.money_bet; // Số tiền khách cần cược
    //let today = timerJoin2();

    // Không cho nó rút khi isAddBank = 0
    // if (!user.isAddBanking) {
    //     return { status: false, msg: 'Vui lòng liên hệ chăm sóc khách hàng để rút tiền!' };
    // }

    if (
        user.bank_name == null ||
        user.bank_number == null ||
        user.bank_user == null
    )
        return { status: false, msg: 'Bạn chưa liên kết tài khoản ngân hàng!' };

    let [settings] = await connection.execute('SELECT * FROM settings');

    let min_withdraw = settings[0].min_withdraw; // Min rút

    let total = Number(money);
    if (password_user != md5(password))
        return { status: false, msg: 'Sai mật khẩu rút tiền!' }; // Sai mật khẩu rút tiền
    if (Number(total) < min_withdraw)
        return {
            status: false,
            msg: 'Số tiền rút tối thiểu là ' + min_withdraw,
        }; // Min rút tối thiểu là
    if (Number(money_user) - Number(total) < 0)
        return { status: false, msg: 'Số dư không đủ!' }; // SỐ dư không đủ
    if (money_bet > 0) return { status: false, msg: 'Chưa đủ vòng cược!' }; // Kiểm tra khách cược rồi mới cho rút

    let id_txn = randomStr(8);
    let create_at = timerJoin2();

    await connection.execute(
        'INSERT INTO withdraw SET id_txn = ?, username = ?, name_bank = ?, name_u_bank = ?, stk = ?, amount = ?, ref = ?, status = ?, time = ?, create_at = ?',
        [
            id_txn,
            username,
            user.bank_name,
            user.bank_user,
            user.bank_number,
            money,
            user.invite,
            0,
            Date.now(),
            create_at,
        ]
    );

    await connection.execute(
        'UPDATE users SET money = money - ? WHERE username = ?',
        [total, username]
    );
    return {
        status: true,
        money: money_user - total,
        username,
        moneyWithdraw: money,
    };
};

const financial = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [financial] = await connection.execute(
        'SELECT * FROM financial_details WHERE username = ? ORDER BY id DESC LIMIT 100',
        [username]
    );
    return financial;
};

const historyrut = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [financial] = await connection.execute(
        'SELECT * FROM withdraw WHERE username = ? ORDER BY id DESC LIMIT 100',
        [username]
    );
    return financial;
};

const upgrade = async ({ level }, token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let money = user.money;
    let [levels] = await connection.execute(
        'SELECT * FROM level WHERE id_level = ?',
        [level]
    );
    if (levels.length <= 0) return { type: 'error' };

    let { price } = levels[0];
    if (money - price < 0) return { type: 2 };

    await connection.execute(
        'INSERT INTO financial_details SET username = ?, type = ?, amount = ?, status = ?, time = ?',
        [username, 'upgrade', price, 'out', Date.now()]
    );

    await connection.execute(
        'UPDATE users SET money = money - ?, roses_user = ? WHERE username = ?',
        [price, level, username]
    );
    return { type: 1 };
};

const listBanner = async () => {
    const [banner] = await connection.execute(
        'SELECT * FROM banner WHERE status = 1 ORDER BY id DESC'
    );
    return banner;
};

const listSupport = async () => {
    const [support] = await connection.execute(
        'SELECT `zalo`, `telegram` FROM settings'
    );
    let { telegram, zalo } = support[0];
    return { telegram, zalo };
};

const levelList = async (token) => {
    const [user] = await findOneToken(token);
    const [levelList] = await connection.execute('SELECT * FROM level', [
        user.username,
    ]);
    return { levelList, user };
};
const getBankingByUser = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [users_bank] = await connection.execute(
        'SELECT * FROM users_bank WHERE username = ?',
        [username]
    );
    if (users_bank.length > 0) return users_bank;
    else return false;
};

const addAddress = async ({ address }, token) => {
    await connection.execute('UPDATE users SET address = ? WHERE token = ?', [
        address,
        token,
    ]);
    return { type: 1 };
};

const moneyEarn = async (token) => {
    const [user] = await findOneToken(token);
    const today = timerJoin();
    const preDay = timerJoinPreDay();
    let [moneyEarnToday] = await connection.execute(
        'SELECT SUM(m.receive) FROM mission_done AS md LEFT JOIN mission AS m ON md.id_mission = m.id_mission WHERE username = ? AND create_at = ?',
        [user.username, today]
    );

    moneyEarnToday = Number(moneyEarnToday[0]['SUM(m.receive)']);

    let [moneyEarnPreDay] = await connection.execute(
        'SELECT SUM(m.receive) FROM mission_done AS md LEFT JOIN mission AS m ON md.id_mission = m.id_mission WHERE username = ? AND create_at = ?',
        [user.username, preDay]
    );

    moneyEarnPreDay = Number(moneyEarnPreDay[0]['SUM(m.receive)']);
    return { moneyEarnToday, moneyEarnPreDay };
};

const getBalance = async (token) => {
    const [UserInfo] = await findOneToken(token);
    let listapi = await helpers.getListApi();
    var data;
    if (listapi.length > 0) {
        await Promise.all(
            listapi.map(async (item) => {
                let getBalance = await ApiController.getBalance(
                    item.operatorcode,
                    item.providercode,
                    item.secret_key,
                    UserInfo.phone,
                    UserInfo.password_api
                );
                getBalance.providercode = item.providercode;
                getBalance.name = item.name;
                return getBalance;
            })
        ).then((result) => {
            data = result;
        });
        return { status: true, data: data, money: UserInfo.money };

        // console.log(result);
    } else {
        return { status: false, msg: 'Không có nhà cung cấp nào' };
    }
};

const tranfer = async ({ amount, type, token, providercode }) => {
    if (!amount || !type || !providercode) {
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    }
    let [UserInfo] = await findOneToken(token);
    //console.log(UserInfo);
    if (type == '0' && UserInfo.money < amount) {
        return { status: false, msg: 'Bạn không đủ tiền!' };
    }
    let result = await ApiController.Tranfers(
        OPERATORCODE,
        providercode,
        UserInfo.phone,
        UserInfo.password_api,
        UserInfo.invite,
        type,
        amount,
        SECRET_KEY
    );
    return { result };
};

const getTranfer = async (token) => {
    const [user] = await findOneToken(token);
    let username = user.username;
    let [tranfer] = await connection.execute(
        'SELECT * FROM transfer_logs WHERE username = ?',
        [username]
    );
    return { status: true, data: tranfer };
};

// html5 = "0" là máy tính
const LaunchGame = async ({
    type,
    lang = 'vi-VN',
    html5,
    token,
    providercode,
    gameid = null,
}) => {
    if (!type || !lang || !html5 || !providercode)
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    let [UserInfo] = await findOneToken(token);
    if (UserInfo.khoacuoc === 1) {
        return { status: false, msg: 'Tài khoản của bạn bị khoá cược!' };
    }
    let result = await ApiController.LaunchGame(
        OPERATORCODE,
        providercode,
        UserInfo.phone,
        UserInfo.password_api,
        type,
        lang,
        html5,
        gameid,
        SECRET_KEY
    );
    return { status: true, result: result };
};

const LaunchDGame = async ({ type, providercode }) => {
    if (!type || !providercode)
        return { status: false, msg: 'Nhập đầy đủ thông tin!' };
    let result = await ApiController.LaunchDGame(
        OPERATORCODE,
        providercode,
        type
    );
    return { status: true, result: result };
};

const checkGameList = async () => {
    let result = await ApiController.getGameList(
        OPERATORCODE,
        'IB',
        SECRET_KEY
    );

    return { status: true, result: result };

    // console.log(result);
};

const getGameList = async () => {
    var data = {};
    const [type] = await connection.execute('SELECT type FROM game_settings');

    let listtype = JSON.parse(type[0].type);

    const [[providercode]] = await connection.execute(
        'SELECT DISTINCT providercode FROM game_settings'
    );
    const providercodeArr = JSON.parse(providercode.providercode);
    // status = 1
    await Promise.all(
        listtype.map(async (item) => {
            const [listgame] = await connection.execute(
                'SELECT * FROM game_list WHERE type = ?',
                [item]
            );
            if (listgame.length > 0) {
                data[item] = listgame;
                return data;
            }
        })
    );

    //console.log(data);
    return { status: true, result: data, providercode: providercodeArr };

    // console.log(result);
};

const getListBank = async () => {
    let [result] = await connection.execute('SELECT * FROM list_bank');
    return { status: true, data: result };
};

const getSetting = async () => {
    const [result] = await connection.execute('SELECT * FROM settings_page');
    return { status: true, data: result };
};

const getLogo = async () => {
    let [result] = await connection.execute(
        'SELECT logo_image, logo_mobile, logo_form_mobile, favicon, popup_home_page FROM settings_page'
    );
    return { status: true, data: result };
};

const getBanner = async () => {
    let [result] = await connection.execute(
        'SELECT * FROM banner WHERE status = 0'
    );
    return { status: true, data: result };
};

const getBannerPC = async () => {
    let [result] = await connection.execute(
        'SELECT * FROM banner WHERE status = 1'
    );
    return { status: true, data: result };
};

const getPromotion = async () => {
    let [result] = await connection.execute('SELECT * FROM khuyenmai');
    return { status: true, data: result };
};

const getBetHistory = async (token, type) => {
    const [user] = await findOneToken(token);
    let username = user.username;

    if (type === 'Toàn bộ') {
        let [betHistory] = await connection.execute(
            'SELECT * FROM bet_history WHERE member = ? ORDER BY id DESC LIMIT 100',
            [username]
        );
        return { status: true, data: betHistory };
    } else {
        let [betHistory] = await connection.execute(
            'SELECT * FROM bet_history WHERE member = ? AND site = ? ORDER BY id DESC LIMIT 100',
            [username, type]
        );
        return { status: true, data: betHistory };
    }
};

const getlucky = async () => {
    const [listgift] = await connection.execute('SELECT * FROM lucky_spin');
    return { status: true, data: listgift };
};
const luckyhistory = async (token) => {
    const [user] = await findOneToken(token);
    const [listgift] = await connection.execute(
        'SELECT * FROM lucky_spin_logs WHERE username = ?',
        [user.name]
    );
    return { status: true, data: listgift };
};
const luckyspin = async (token) => {
    //quay
    const [user] = await findOneToken(token);
    if (user.spin_number == 0) {
        return { status: false, msg: 'Bạn đã hết lượt quay' };
    }
    const [listgift] = await connection.execute(
        'SELECT * FROM lucky_spin WHERE status = 1'
    );
    if (listgift.length > 0) {
        let random_gift = listgift[random(0, listgift.length - 1)];
        let rand = random(1, 5);
        if (rand == 3) {
            await connection.execute(
                'UPDATE users SET money = money + ? WHERE username = ?',
                [random_gift.money, user.username]
            );
            await connection.execute(
                'INSER INTO lucky_spin_logs SET username = ?, present = ?, money = ?, create_at = ?, status = 1',
                [
                    user.username,
                    random_gift.present,
                    random_gift.money,
                    timerJoin2(),
                ]
            );
            return { status: true, msg: 'Nhận Thành công', gift: random_gift };
        } else {
            await connection.execute(
                'INSER INTO lucky_spin_logs SET username = ?, present = ?, money = 0, create_at = ?, status = 1',
                [user.username, 'Chúc bạn may mắn lần sau', timerJoin2()]
            );
            return { status: false, msg: 'Chúc bạn may mắn lần sau' };
        }
    }
};

module.exports = {
    findOne,
    save,
    findOneToken,
    checkAcount,
    addRecharge,
    getRecharge,
    changePassword,
    changePasswordTransaction,
    addBanking,
    checkBanking,
    withdraw,
    financial,
    historyrut,
    upgrade,
    listBanner,
    findInvite,
    listSupport,
    levelList,
    getBankingByUser,
    addAddress,
    moneyEarn,
    getBalance,
    getTranfer,
    tranfer,
    LaunchGame,
    LaunchDGame,
    getGameList,
    getListBank,
    getSetting,
    getLogo,
    getBanner,
    getPromotion,
    getBannerPC,
    getBetHistory,
    getlucky,
    luckyhistory,
    luckyspin,
    createPlayer,
};
