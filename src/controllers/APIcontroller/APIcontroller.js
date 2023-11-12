import md5 from 'md5';
import doRequest from './doRequest';
import helpers from '../../../helpers';
import connection from '../../config/connectDB';
require('dotenv').config();
const URL_API = process.env.URL_API;
const OPERATORCODE = process.env.OPERATORCODE;
const SECRET_KEY = process.env.SECRET_KEY_API;

const getGameList = async (operatorcode, providercode, secret_key) => {
    let signature = md5(operatorcode + providercode + secret_key);
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        providercode: providercode,
        Lang: 'vi-VN',
        reformatJson: 'yes',
        signature: signature,
    };
    let result = await doRequest('getGameList.aspx', params);
    result.gamelist = JSON.parse(result.gamelist);
    return result;
};

const createPlayer = async (operatorcode, secret_key, username) => {
    let signature = md5(operatorcode + username + secret_key);
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        username: username,
        signature: signature,
    };
    let result = await doRequest('createMember.aspx', params);
    return result;
};

const Tranfers = async (
    operatorcode,
    providercode,
    username,
    password,
    ref,
    type,
    amount,
    secret_key
) => {
    const { balance_bacarat } = await helpers.getSetting();
    if (amount > balance_bacarat && type == 0)
        return { status: false, msg: 'Chuyển tiền thất bại!' };
    let referenceid = helpers.randomStr(16);
    let signature = md5(
        amount +
            operatorcode +
            password +
            providercode +
            referenceid +
            type +
            username +
            secret_key
    );
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        providercode: providercode,
        username: username,
        password: password,
        referenceid: referenceid,
        type: type,
        amount: amount,
        signature: signature,
    };
    let data = await doRequest('makeTransfer.aspx', params);
    if (data.errCode == '0') {
        await connection.execute(
            'INSERT INTO transfer_logs SET username = ?, money = ?, type = ?, status = ?, Desciptions = ?, providercode = ?, ref = ?, today = ?',
            [
                username,
                amount,
                type,
                data.errCode,
                data.errMsg,
                providercode,
                ref,
                helpers.timerJoin(),
            ]
        );
        //tru tien
        if (type == 0) {
            await connection.execute(
                'UPDATE users SET money = money - ? WHERE phone = ?',
                [amount, username]
            );
            await connection.execute(
                'UPDATE admin SET balance_bacarat = balance_bacarat - ? WHERE id = ?',
                [amount, 1]
            );
            return { status: true, msg: 'Chuyển tiền thành công!' };
        } else {
            await connection.execute(
                'UPDATE users SET money = money + ? WHERE phone = ?',
                [amount, username]
            );
            await connection.execute(
                'UPDATE admin SET balance_bacarat = balance_bacarat + ? WHERE id = ?',
                [amount, 1]
            );

            return { status: true, msg: 'Chuyển tiền thành công!' };
        }
    } else {
        await connection.execute(
            'INSERT INTO transfer_logs SET username = ?, money = ?, type = ?, status = ?, Desciptions = ?, providercode = ?, ref = ?, today = ?',
            [
                username,
                amount,
                type,
                data.errCode,
                data.errMsg,
                providercode,
                ref,
                helpers.timerJoin(),
            ]
        );
        return { status: false, msg: 'Chuyển tiền thất bại!' };
    }

    //return result;
};
const getBalance = async (
    operatorcode,
    providercode,
    secret_key,
    username,
    password
) => {
    let signature = md5(
        operatorcode + password + providercode + username + secret_key
    );
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        providercode: providercode,
        username: username,
        password: password,
        signature: signature,
    };
    let result = await doRequest('getBalance.aspx', params);
    return result;
};
const LaunchGame = async (
    operatorcode,
    providercode,
    username,
    password,
    type,
    lang,
    html5,
    gameid,
    secret_key
) => {
    let signature = md5(
        operatorcode + password + providercode + type + username + secret_key
    );
    signature = signature.toUpperCase();
    if (type == 'LC') {
        var params = {
            operatorcode: operatorcode,
            providercode: providercode,
            username: username,
            password: password,
            type: type,
            gameid: gameid,
            lang: lang,
            html5: html5,
            signature: signature,
        };
    } else {
        var params = {
            operatorcode: operatorcode,
            providercode: providercode,
            username: username,
            password: password,
            type: type,
            lang: lang,
            html5: html5,
            signature: signature,
        };
    }

    let result = await doRequest('launchGames.aspx', params);
    return result;
};
const LaunchDGame = async (operatorcode, providercode, type) => {
    let params = {
        operatorcode: operatorcode,
        providercode: providercode,
        type: type,
        //gameid: gameid,
        lang: 'vi-VN',
        html5: 1,
    };
    let result = await doRequest('launchDGames.ashx', params);
    return result;
};
const updatePassPlayer = async (username, password, opassword) => {
    let signature = md5(
        opassword +
            operatorcode +
            password +
            providercode +
            username +
            secret_key
    );
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        providercode: providercode,
        username: username,
        password: password,
        opassword: opassword,
        signature: signature,
    };
    let result = await doRequest('changePassword.aspx', params);
    return result;
};

const getHistory = async (operatorcode, versionkey, secret_key) => {
    let signature = md5(operatorcode + secret_key);
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        versionkey: versionkey,
        signature: signature,
    };
    let result = await doRequest('fetchbykey.aspx', params);

    return result;
};
const checkAgentCredit = async () => {
    let signature = md5(OPERATORCODE + SECRET_KEY);
    signature = signature.toUpperCase();
    let params = {
        operatorcode: OPERATORCODE,
        signature: signature,
    };
    let result = await doRequest('checkAgentCredit.aspx', params);

    return result.data;
};

const updatePlayerPassword = async (username, opw, npw) => {
    const [listProviderCode] = await connection.execute(
        'SELECT * FROM listapi'
    );
    for (let item of listProviderCode) {
        let signature = md5(
            opw + OPERATORCODE + npw + item.providercode + username + SECRET_KEY
        );
        signature = signature.toUpperCase();
        let params = {
            operatorcode: OPERATORCODE,
            providercode: item.providercode,
            username: username,
            password: npw,
            opassword: opw,
            signature: signature,
        };
        let result = await doRequest('changePassword.aspx', params);
        return result.data;
    }
};
module.exports = {
    getGameList,
    getBalance,
    LaunchGame,
    LaunchDGame,
    Tranfers,
    updatePassPlayer,
    createPlayer,
    getHistory,
    checkAgentCredit,
    updatePlayerPassword,
};
