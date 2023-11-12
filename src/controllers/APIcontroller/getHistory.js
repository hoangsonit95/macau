import cron from 'node-cron';
import helpers from '../../../helpers';
import connection from '../../config/connectDB';
import axios from 'axios';
import md5 from 'md5';
require('dotenv').config();
const URL_FETCH = process.env.URL_FETCH;
const OPERATORCODE = process.env.OPERATORCODE;
const SECRET_KEY = process.env.SECRET_KEY_API;

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

    let second = formateT(date.getSeconds());
    let minutes = formateT(date.getMinutes());
    let hours = formateT(date.getHours());
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    return years + '-' + months + '-' + days;
}

function timerJoin2(params = '') {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }

    let second = formateT(date.getSeconds());
    let minutes = formateT(date.getMinutes());
    let hours = formateT(date.getHours());
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
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
        second
    );
}

const doRequest = async (url, params) => {
    var _params = '?';
    if (params !== null) {
        var count = 0;
        var paramsLength = Object.keys(params).length;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                _params += key + '=' + params[key];
                if (count++ < paramsLength - 1) {
                    _params += '&';
                }
            }
        }
        let result = await axios.get(URL_FETCH + url + _params);
        if (!!result.data) {
            return result.data;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

const doRequestPOST = async (url, params) => {
    var _params = '?';
    if (params !== null) {
        var count = 0;
        var paramsLength = Object.keys(params).length;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                _params += key + '=' + params[key];
                if (count++ < paramsLength - 1) {
                    _params += '&';
                }
            }
        }
        //console.log(URL_API + url + _params);
        let result = await axios.post(URL_FETCH + url, params);
        if (!!result.data) {
            return result.data;
        } else {
            return false;
        }
    } else {
        return false;
    }
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
    // console.log(result);
    return result;
};

const markbyjson = async (operatorcode, ticket, secret_key) => {
    let signature = md5(operatorcode + secret_key);
    signature = signature.toUpperCase();
    let params = {
        operatorcode: operatorcode,
        ticket: ticket,
        signature: signature,
    };
    let result = await doRequestPOST('markbyjson.aspx', params);
    // console.log(result);
    return result;
};

const cronBetHistory = async () => {
    try {
        let { lastversionkey } = await helpers.getSetting();

        let data = await getHistory(OPERATORCODE, lastversionkey, SECRET_KEY);

        let betHistory = JSON.parse(data.result);
        // console.log(betHistory.sort((a, b) => Number(new Date(a.start_time)) - Number(new Date(b.start_time))));
        if (betHistory.length == 0) return;
        // console.log(betHistory);
        await connection.execute(
            'UPDATE admin SET lastversionkey = ? WHERE id = ?',
            [data.lastversionkey, 1]
        );
        for (const item of betHistory) {
            let [check] = await connection.execute(
                'SELECT * from bet_history WHERE id_bet = ? AND member = ?',
                [item.id, item.member]
            );
            let [UserInfo] = await connection.execute(
                'SELECT * FROM users WHERE phone = ?',
                [item.member]
            );
            if (check.length === 0 && UserInfo.length > 0) {
                await connection.execute(
                    'INSERT INTO bet_history SET id_bet = ?, ref_no = ?, site = ?, product = ?, member = ?, gameid = ?, start_time = ?, end_time = ?, match_time = ?, bet_detail = ?, turnover = ?, bet = ?, payout = ?, commission = ?, p_share = ?, p_win = ?, status = ?',
                    [
                        item.id,
                        item.ref_no,
                        item.site,
                        item.product,
                        item.member,
                        item.game_id,
                        timerJoin2(
                            Number(new Date(item.start_time)) +
                                60 * 1000 * 60 * 7
                        ),
                        timerJoin2(
                            Number(new Date(item.end_time)) + 60 * 1000 * 60 * 7
                        ),
                        timerJoin2(
                            Number(new Date(item.match_time)) +
                                60 * 1000 * 60 * 7
                        ),
                        item.bet_detail,
                        item.turnover,
                        item.bet,
                        item.payout,
                        item.commission,
                        item.p_share,
                        item.p_win,
                        item.status,
                    ]
                );

                let money_bet =
                    UserInfo[0]?.tongcuoc - item.bet > 0
                        ? UserInfo[0]?.tongcuoc - item.bet
                        : 0;
                await connection.execute(
                    'UPDATE users SET tongcuoc = ? WHERE phone = ?',
                    [money_bet, UserInfo[0].phone]
                );
                // const [daily] = await connection.execute(
                //     'SELECT u.*, d.roses from users AS u LEFT JOIN daily AS d ON u.level = d.id WHERE ref = ? AND type = "daily"',
                //     [UserInfo?.invite]
                // );
                // if (daily.length > 0) {
                //     let money_roses =
                //         ((Number(item.payout) - Number(item.bet)) / 100) *
                //         daily[0].roses;
                //     await connection.execute(
                //         'UPDATE users SET money = money + ? WHERE username = ?',
                //         [money_roses, daily[0].username]
                //     );
                //     await connection.execute(
                //         'INSERT INTO daily_logs SET username = ?, player = ?, money = ?, descriptions = ?, time = ?',
                //         [
                //             daily[0].username,
                //             item.member,
                //             money_roses,
                //             `Thay đổi số dư ${money_roses} từ người chơi ${item.member}`,
                //             timerJoin2(),
                //         ]
                //     );
                // }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const cronMarkHisttory = async () => {
    let a = new Date();
    let listBetHistory = await connection.execute('SELECT * FROM bet_history');
    if (listBetHistory[0].length > 0) {
        listBetHistory = listBetHistory[0].map((item) => item.id_bet);
        listBetHistory = listBetHistory.toString();
        await markbyjson(OPERATORCODE, listBetHistory, SECRET_KEY);
    }
};

const cronJob = () => {
    console.log('chay cron start!!');
    // cronBetHistory();
    //  # ┌────────────── second (optional)
    //  # │ ┌──────────── minute
    //  # │ │ ┌────────── hour
    //  # │ │ │ ┌──────── day of month
    //  # │ │ │ │ ┌────── month
    //  # │ │ │ │ │ ┌──── day of week
    //  # │ │ │ │ │ │
    //  # │ │ │ │ │ │
    //  # * * * * * *
    // cronBetHistory();
    // second	0-59
    // minute	0-59
    // hour	0-23
    // day of month	1-31
    // month	1-12 (or names)
    // day of week	0-7 (or names, 0 or 7 are sunday)
    cron.schedule('*/1 * * * *', function () {
        cronBetHistory(); //hoan tra luon cho dai ly theo lich su cuoc roi nhe
    });
    // cron.schedule('* * * * *', function () {
    //     cronMarkHisttory();
    // });
};
module.exports = { cronBetHistory, cronMarkHisttory };
