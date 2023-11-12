const fs = require('fs');
const path = require('path');
require('dotenv').config();
// import md5 from 'md5';
import connection from './src/config/connectDB';

function formateT(params) {
    let result = params < 10 ? '0' + params : params;
    return result;
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

const checkNullObj = function (obj) {
    Object.values(obj).every((value) => {
        if (value === null || value === undefined) {
            return true;
        }
        return false;
    });
};

const findByUsername = async (username) => {
    const [user] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return user;
};

const findByToken = async (token) => {
    const [user] = await connection.execute(
        'SELECT * FROM users WHERE token = ?',
        [token]
    );
    return user;
};

const randomINT = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const timerJoin = (params = '') => {
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
};

const getListApi = async () => {
    const [listApi] = await connection.execute(
        'SELECT * FROM listapi WHERE status = 1'
    );
    return listApi;
};

const settingsPage = async () => {
    const [[settingsPage]] = await connection.execute(
        'SELECT * FROM settings_page'
    );
    return settingsPage;
};

const getSetting = async () => {
    const [[settings]] = await connection.execute('SELECT * FROM admin');
    return settings;
};

module.exports = {
    randomStr,
    findByUsername,
    findByToken,
    randomINT,
    timerJoin,
    checkNullObj,
    getListApi,
    getSetting,
    settingsPage,
};
