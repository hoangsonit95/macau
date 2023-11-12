import connection from '../config/connectDB';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
const fs = require('fs');
require('dotenv').config();

let timeNow = Date.now();

const adminPage = async (req, res) => {
  return res.render('manage/index.ejs');
};

const adminPage3 = async (req, res) => {
  return res.render('manage/a-index-bet/index3.ejs');
};

const adminPageXsmbCuoc = async (req, res) => {
  return res.render('manage/xsmbcuoc.ejs');
};

const adminPageXsmbRate = async (req, res) => {
  return res.render('manage/xsmbrate.ejs');
};

const adminPage5 = async (req, res) => {
  return res.render('manage/a-index-bet/index5.ejs');
};

const adminPage10 = async (req, res) => {
  return res.render('manage/a-index-bet/index10.ejs');
};

const adminPage5d = async (req, res) => {
  return res.render('manage/5d.ejs');
};

const adminPageK3 = async (req, res) => {
  return res.render('manage/k3.ejs');
};

const adminRatioPageK3 = async (req, res) => {
  return res.render('manage/ratiok3.ejs');
};

const ctvProfilePage = async (req, res) => {
  var phone = req.params.phone;
  return res.render('manage/profileCTV.ejs', { phone });
};

const giftPage = async (req, res) => {
  return res.render('manage/giftPage.ejs');
};

const membersPage = async (req, res) => {
  return res.render('manage/members.ejs');
};

const ctvPage = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  return res.render('manage/ctv.ejs');
};

const infoMember = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  let phone = req.params.id;
  return res.render('manage/profileMember.ejs', { phone });
};

const statistical = async (req, res) => {
  return res.render('manage/statistical.ejs');
};

const rechargePage = async (req, res) => {
  return res.render('manage/recharge.ejs');
};

const rechargeRecord = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  return res.render('manage/rechargeRecord.ejs');
};

const withdraw = async (req, res) => {
  return res.render('manage/withdraw.ejs');
};

const withdrawRecord = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  return res.render('manage/withdrawRecord.ejs');
};
const settings = async (req, res) => {
  let [[{ balance_bacarat }]] = await connection.execute(
    'SELECT balance_bacarat FROM admin',
  );
  balance_bacarat = new Intl.NumberFormat('vi-vn', {
    style: 'currency',
    currency: 'VND',
  }).format(balance_bacarat);

  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  return res.render('manage/settings.ejs', { balance_bacarat });
};

// xác nhận admin
const middlewareAdminController = async (req, res, next) => {
  // xác nhận token
  const auth = req.cookies.auth;
  if (!auth) {
    return res.redirect('/login');
  }
  const [rows] = await connection.execute(
    'SELECT `token`,`level`, `status` FROM `users` WHERE `token` = ? AND veri = 1',
    [auth],
  );
  if (!rows) {
    return res.redirect('/login');
  }
  try {
    if (auth == rows[0].token && rows[0].status == 1) {
      if (rows[0].level == 1) {
        next();
      } else {
        return res.redirect('/home');
      }
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    return res.redirect('/login');
  }
};

const totalJoin = async (req, res) => {
  let auth = req.cookies.auth;
  let typeid = req.body.typeid;
  if (!typeid) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let game = '';
  if (typeid == '1') game = 'wingo';
  if (typeid == '2') game = 'wingo3';
  if (typeid == '3') game = 'wingo5';
  if (typeid == '4') game = 'wingo10';

  const [rows] = await connection.query(
    'SELECT * FROM users WHERE `token` = ? ',
    [auth],
  );

  if (rows.length > 0) {
    const [wingoall] = await connection.query(
      `SELECT * FROM minutes_1 WHERE game = "${game}" AND status = 0 AND level = 0 ORDER BY id ASC `,
      [auth],
    );
    const [winGo1] = await connection.execute(
      `SELECT * FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `,
      [],
    );
    const [winGo10] = await connection.execute(
      `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `,
      [],
    );
    const [setting] = await connection.execute(`SELECT * FROM admin `, []);

    return res.status(200).json({
      message: 'Success',
      status: true,
      datas: wingoall,
      lotterys: winGo1,
      list_orders: winGo10,
      setting: setting,
      timeStamp: timeNow,
    });
  } else {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
};

const listMember = async (req, res) => {
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  const [users] = await connection.query(
    `SELECT * FROM users WHERE veri = 1 AND level != 2 ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
  );
  const [total_users] = await connection.query(
    `SELECT * FROM users WHERE veri = 1 AND level != 2`,
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: users,
    page_total: Math.ceil(total_users.length / limit),
  });
};

const listCTV = async (req, res) => {
  let { pageno, pageto } = req.body;

  if (!pageno || !pageto) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || pageto < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  const [wingo] = await connection.query(
    `SELECT * FROM users WHERE veri = 1 AND level = 2 ORDER BY id DESC LIMIT ${pageno}, ${pageto} `,
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: wingo,
  });
};

function formateT2(params) {
  let result = params < 10 ? '0' + params : params;
  return result;
}

function timerJoin2(params = '') {
  let date = '';
  if (params) {
    date = new Date(Number(params));
  } else {
    date = Date.now();
    date = new Date(Number(date));
  }
  let years = formateT2(date.getFullYear());
  let months = formateT2(date.getMonth() + 1);
  let days = formateT2(date.getDate());

  return years + '-' + months + '-' + days;
}

const statistical2 = async (req, res) => {
  let dateCheck = '' + req.body.date;
  //console.log(dateCheck);

  const [wingo] = await connection.query(
    'SELECT SUM(`get`) as total FROM minutes_1 WHERE status = 1 AND today = ? ',
    [dateCheck],
  );
  const [wingo2] = await connection.query(
    `SELECT SUM(money) as total FROM minutes_1 WHERE status = 2 AND today = ? `,
    [dateCheck],
  );
  const [k3] = await connection.query(
    'SELECT SUM(`get`) as total FROM result_k3 WHERE status = 1 AND today = ? ',
    [dateCheck],
  );
  const [k32] = await connection.query(
    `SELECT SUM(money) as total FROM result_k3 WHERE status = 2 AND today = ? `,
    [dateCheck],
  );
  const [k5] = await connection.query(
    'SELECT SUM(`get`) as total FROM result_5d WHERE status = 1 AND today = ? ',
    [dateCheck],
  );
  const [k52] = await connection.query(
    `SELECT SUM(money) as total FROM result_5d WHERE status = 2 AND today = ? `,
    [dateCheck],
  );
  const [users] = await connection.query(
    `SELECT COUNT(id) as total FROM users WHERE status = 1`,
  );
  const [users2] = await connection.query(
    `SELECT COUNT(id) as total FROM users WHERE status = 0`,
  );
  const [recharge] = await connection.query(
    `SELECT SUM(money) as total FROM recharge WHERE status = 1`,
  );
  const [withdraw] = await connection.query(
    `SELECT SUM(money) as total FROM withdraw WHERE status = 1`,
  );

  const [recharge_today] = await connection.query(
    `SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?`,
    [dateCheck],
  );
  const [withdraw_today] = await connection.query(
    `SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?`,
    [dateCheck],
  );

  var win = 0;
  var loss = 0;

  if (wingo[0].total != null) {
    let w1 = parseInt(wingo[0].total);
    win += w1;
  }
  if (wingo2[0].total != null) {
    let w2 = parseInt(wingo2[0].total);
    loss += w2;
  }
  if (k3[0].total != null) {
    let kw = parseInt(k3[0].total);
    win += kw;
  }
  if (k32[0].total != null) {
    let kl = parseInt(k32[0].total);
    loss += kl;
  }
  if (k5[0].total != null) {
    let dw = parseInt(k5[0].total);
    win += dw;
  }
  if (k52[0].total != null) {
    let dl = parseInt(k52[0].total);
    loss += dl;
  }

  let usersOnline = users[0].total;
  let usersOffline = users2[0].total;
  let recharges = recharge[0].total;
  let withdraws = withdraw[0].total;
  return res.status(200).json({
    message: 'Success',
    status: true,
    win: win,
    loss: loss,
    usersOnline: usersOnline,
    usersOffline: usersOffline,
    recharges: recharges,
    withdraws: withdraws,
    rechargeToday: recharge_today[0].total,
    withdrawToday: withdraw_today[0].total,
  });
};

const changeAdmin = async (req, res) => {
  let auth = req.cookies.auth;
  let value = req.body.value;
  let type = req.body.type;
  let typeid = req.body.typeid;

  if (!value || !type || !typeid)
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  let game = '';
  let bs = '';
  if (typeid == '1') {
    game = 'wingo1';
    bs = 'bs1';
  }
  if (typeid == '2') {
    game = 'wingo3';
    bs = 'bs3';
  }
  if (typeid == '3') {
    game = 'wingo5';
    bs = 'bs5';
  }
  if (typeid == '4') {
    game = 'wingo10';
    bs = 'bs10';
  }
  switch (type) {
    case 'change-wingo1':
      // return res.status(200).json({
      //     message: 'Thanh toán để sử dụng full chức năng!',
      //     status: false
      // });
      await connection.query(`UPDATE admin SET ${game} = ? `, [value]);
      return res.status(200).json({
        message: 'Editing results successfully',
        status: true,
        timeStamp: timeNow,
      });
      break;
    case 'change-win_rate':
      await connection.query(`UPDATE admin SET ${bs} = ? `, [value]);
      return res.status(200).json({
        message: 'Editing win rate successfully',
        status: true,
        timeStamp: timeNow,
      });
      break;

    default:
      return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
      break;
  }
};

function formateT(params) {
  let result = params < 10 ? '0' + params : params;
  return result;
}

function timerJoin3(params = '') {
  let date = '';
  if (params) {
    date = new Date(Number(params));
  } else {
    date = Date.now();
    date = new Date(Number(date));
  }
  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());
  let weeks = formateT(date.getDay());

  let hours = formateT(date.getHours());
  let minutes = formateT(date.getMinutes());
  let seconds = formateT(date.getSeconds());
  // return years + '-' + months + '-' + days + ' ' + hours + '-' + minutes + '-' + seconds;
  return years + '-' + months + '-' + days;
}

function timerJoin(params = '') {
  let date = '';
  if (params) {
    date = new Date(Number(params));
  } else {
    date = Date.now();
    date = new Date(Number(date));
  }
  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());
  let weeks = formateT(date.getDay());

  let hours = formateT(date.getHours());
  let minutes = formateT(date.getMinutes());
  let seconds = formateT(date.getSeconds());
  // return years + '-' + months + '-' + days + ' ' + hours + '-' + minutes + '-' + seconds;
  return years + ' - ' + months + ' - ' + days;
}

const userInfo = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];
  // cấp dưới trực tiếp all
  const [f1s] = await connection.query(
    'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
    [userInfo.code],
  );

  // cấp dưới trực tiếp hôm nay
  let f1_today = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_time = f1s[i].time; // Mã giới thiệu f1
    let check = timerJoin(f1_time) == timerJoin() ? true : false;
    if (check) {
      f1_today += 1;
    }
  }

  // tất cả cấp dưới hôm nay
  let f_all_today = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const f1_time = f1s[i].time; // time f1
    let check_f1 = timerJoin(f1_time) == timerJoin() ? true : false;
    if (check_f1) f_all_today += 1;
    // tổng f1 mời đc hôm nay
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code; // Mã giới thiệu f2
      const f2_time = f2s[i].time; // time f2
      let check_f2 = timerJoin(f2_time) == timerJoin() ? true : false;
      if (check_f2) f_all_today += 1;
      // tổng f2 mời đc hôm nay
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      for (let i = 0; i < f3s.length; i++) {
        const f3_code = f3s[i].code; // Mã giới thiệu f3
        const f3_time = f3s[i].time; // time f3
        let check_f3 = timerJoin(f3_time) == timerJoin() ? true : false;
        if (check_f3) f_all_today += 1;
        const [f4s] = await connection.query(
          'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
          [f3_code],
        );
        // tổng f3 mời đc hôm nay
        for (let i = 0; i < f4s.length; i++) {
          const f4_code = f4s[i].code; // Mã giới thiệu f4
          const f4_time = f4s[i].time; // time f4
          let check_f4 = timerJoin(f4_time) == timerJoin() ? true : false;
          if (check_f4) f_all_today += 1;
          // tổng f3 mời đc hôm nay
        }
      }
    }
  }

  // Tổng số f2
  let f2 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    f2 += f2s.length;
  }

  // Tổng số f3
  let f3 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code;
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      if (f3s.length > 0) f3 += f3s.length;
    }
  }

  // Tổng số f4
  let f4 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code;
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      for (let i = 0; i < f3s.length; i++) {
        const f3_code = f3s[i].code;
        const [f4s] = await connection.query(
          'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
          [f3_code],
        );
        if (f4s.length > 0) f4 += f4s.length;
      }
    }
  }
  // console.log("TOTAL_F_TODAY:" + f_all_today);
  // console.log("F1: " + f1s.length);
  // console.log("F2: " + f2);
  // console.log("F3: " + f3);
  // console.log("F4: " + f4);

  const [recharge] = await connection.query(
    'SELECT SUM(`money`) as total FROM recharge WHERE phone = ? AND status = 1 ',
    [phone],
  );
  const [withdraw] = await connection.query(
    'SELECT SUM(`money`) as total FROM withdraw WHERE phone = ? AND status = 1 ',
    [phone],
  );
  const [bank_user] = await connection.query(
    'SELECT * FROM user_bank WHERE phone = ? ',
    [phone],
  );
  const [telegram_ctv] = await connection.query(
    'SELECT `telegram` FROM point_list WHERE phone = ? ',
    [userInfo.ctv],
  );
  const [ng_moi] = await connection.query(
    'SELECT `phone` FROM users WHERE code = ? ',
    [userInfo.invite],
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: user,
    total_r: recharge,
    total_w: withdraw,
    f1: f1s.length,
    f2: f2,
    f3: f3,
    f4: f4,
    bank_user: bank_user,
    telegram: !!telegram_ctv[0] ? telegram_ctv[0] : { telegram: '0' },
    ng_moi: !!ng_moi[0] ? ng_moi[0] : { ng_moi: '0' },
    daily: !!userInfo.ctv ? userInfo.ctv : { daily: '0' },
  });
};

const recharge = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [recharge] = await connection.query(
    'SELECT * FROM recharge WHERE status = 0 ',
  );
  const [recharge2] = await connection.query(
    'SELECT * FROM recharge WHERE status != 0 ',
  );
  const [withdraw] = await connection.query(
    'SELECT * FROM withdraw WHERE status = 0 ',
  );
  const [withdraw2] = await connection.query(
    'SELECT * FROM withdraw WHERE status != 0 ',
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: recharge,
    datas2: recharge2,
    datas3: withdraw,
    datas4: withdraw2,
  });
};

const settingGet = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [bank_recharge] = await connection.query(
    'SELECT * FROM bank_recharge ',
  );
  const [settings] = await connection.query('SELECT * FROM admin ');
  return res.status(200).json({
    message: 'Success',
    status: true,
    settings: settings,
    datas: bank_recharge,
  });
};

const settingDeleteUser = async (req, res) => {
  //let auth = req.cookies.auth;
  let phone = req.body.phone;
  if (!phone) {
    return res.status(200).json({
      message: 'Nhập SĐT',
      status: false,
      timeStamp: timeNow,
    });
  }

  await connection.query('DELETE FROM `users` WHERE `phone`= ?', [phone]);
  return res.status(200).json({
    message: 'Success',
    status: true,
  });
};

const rechargeDuyet = async (req, res) => {
  let auth = req.cookies.auth;
  let id = req.body.id;
  let type = req.body.type;
  if (!auth || !id || !type) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  if (type == 'confirm') {
    await connection.query(`UPDATE recharge SET status = 1 WHERE id = ?`, [id]);
    const [info] = await connection.query(
      `SELECT * FROM recharge WHERE id = ?`,
      [id],
    );

    const [check] = await connection.query(
      'SELECT `napdau` FROM `users` WHERE `phone`= ?',
      [info[0].phone],
    );
    const amount = info[0].money;

    let hoahong = 0;
    if (check[0].napdau == 0 || check[0].napdau == 1) {
      hoahong = (amount * 3) / 100;
      await connection.query('UPDATE users SET napdau = ? WHERE phone = ? ', [
        1,
        info[0].phone,
      ]);
    }

    await connection.query(
      'UPDATE users SET money = money + ?, total_money = total_money + ?, tongcuoc = tongcuoc + ? WHERE phone = ? ',
      [info[0].money + hoahong, info[0].money, info[0].money, info[0].phone],
    );
    const [invite] = await connection.query(
      'SELECT `invite`, `code` FROM `users` WHERE `phone`= ? LIMIT 1',
      [info[0].phone],
    );
    const [ctv] = await connection.query(
      'SELECT `phone`, `code` FROM `users` WHERE `code`= ? LIMIT 1',
      [invite[0].invite],
    );

    if (check[0].napdau == 0) {
      var time = new Date().getTime();
      //thuc hien cong tien nap dau tien cho nguoi gioi thieu
      hoahong = 0;
      if (amount >= 100000 && amount < 500000) {
        hoahong = 30000;
      } else if (amount >= 500000 && amount < 1000000) {
        hoahong = 100000;
      } else if (amount >= 1000000 && amount < 5000000) {
        hoahong = 150000;
      } else if (amount >= 5000000 && amount < 10000000) {
        hoahong = 500000;
      } else if (amount >= 10000000 && amount < 30000000) {
        hoahong = 1000000;
      } else if (amount >= 30000000 && amount < 50000000) {
        hoahong = 3000000;
      } else if (amount >= 50000000 && amount < 100000000) {
        hoahong = 5000000;
      } else if (amount >= 100000000) {
        hoahong = 10000000;
      }

      await connection.query(
        `UPDATE users SET money = money + ?, total_money = total_money + ?, roses_today = roses_today + ?, roses_f = roses_f + ? WHERE phone = ? `,
        [hoahong, hoahong, hoahong, hoahong, ctv[0].phone],
      );
      let sql =
        'INSERT INTO `roses` SET `phone` = ?, `f1` = ?, `code` = ?, `invite` = ?, `time` = ?, `chitiet` = ?';
      await connection.query(sql, [
        info[0].phone,
        hoahong,
        invite[0].code,
        ctv[0].code,
        time,
        'Nạp Tiền',
      ]);
      //await connection.query('UPDATE `users` SET `napdau` = 1 WHERE `phone` = ?', [ info[0].phone ]);
    }
    return res.status(200).json({
      message: 'Xác nhận đơn thành công',
      status: true,
      datas: recharge,
    });
  }
  if (type == 'delete') {
    await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);

    return res.status(200).json({
      message: 'Hủy đơn thành công',
      status: true,
      datas: recharge,
    });
  }
  if (type == 'del') {
    await connection.query(`DELETE FROM recharge WHERE id = ?`, [id]);

    return res.status(200).json({
      message: 'Xóa đơn thành công',
      status: true,
      datas: recharge,
    });
  }
};

const handlWithdraw = async (req, res) => {
  let auth = req.cookies.auth;
  let id = req.body.id;
  let type = req.body.type;
  if (!auth || !id || !type) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  if (type == 'del') {
    await connection.query(`DELETE FROM withdraw WHERE id = ?`, [id]);
    return res.status(200).json({
      message: 'Xóa thành công',
      status: true,
      datas: recharge,
    });
  }
  if (type == 'confirm') {
    await connection.query(`UPDATE withdraw SET status = 1 WHERE id = ?`, [id]);
    //const [info] = await connection.query(`SELECT * FROM withdraw WHERE id = ?`, [id]);
    //const [user] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [ info[0].phone ]);
    //await connection.query(`UPDATE recharge SET statusTongCuoc = 1 WHERE phone = ?`, [ info[0].phone ]);
    //await connection.query(`UPDATE users SET tongcuoc = 0 WHERE phone = ?`, [ info[0].phone ]);

    return res.status(200).json({
      message: 'Xác nhận đơn thành công',
      status: true,
      datas: recharge,
    });
  }
  if (type == 'delete') {
    await connection.query(`UPDATE withdraw SET status = 2 WHERE id = ?`, [id]);
    const [info] = await connection.query(
      `SELECT * FROM withdraw WHERE id = ?`,
      [id],
    );
    await connection.query(
      'UPDATE users SET money = money + ? WHERE phone = ? ',
      [info[0].money, info[0].phone],
    );
    return res.status(200).json({
      message: 'Hủy thành công',
      status: true,
      datas: recharge,
    });
  }
};

const settingBank = async (req, res) => {
  let files = req.files;
  let bank, momo;
  if (files?.bank) {
    bank = `/images/${files.bank[0].filename}`;
  }
  if (files?.momo) {
    momo = `/images/${files.momo[0].filename}`;
  }
  files = {
    bank,
    momo,
  };
  let auth = req.cookies.auth;
  let name_bank = req.body.name_bank;
  let name = req.body.name;
  let info = req.body.info;
  let typer = req.body.typer;
  if (!auth || !typer) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  if (typer == 'bank') {
    const [[bankInfo]] = await connection.query(
      `SELECT * FROM bank_recharge WHERE id = '1'`,
    );
    if (bankInfo.qr) {
      let path = `./src/public${bankInfo.qr}`;
      fs.unlink(path, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    await connection.query(
      `UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr = ? WHERE type = 'bank'`,
      [name_bank, name, info, bank],
    );
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
      datas: recharge,
    });
  }
  if (typer == 'momo') {
    const [[bankInfo]] = await connection.query(
      'SELECT * FROM bank_recharge WHERE id = ?',
      [2],
    );
    if (bankInfo.qr) {
      let path = `./src/public${bankInfo.qr}`;
      fs.unlink(path, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    await connection.query(
      `UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr = ? WHERE type = 'momo'`,
      [name_bank, name, info, momo],
    );
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
      datas: recharge,
    });
  }
};

const settingCskh = async (req, res) => {
  let auth = req.cookies.auth;
  let telegram = req.body.telegram;
  let cskh = req.body.cskh;
  let notice = req.body.notice;
  let myapp_web = req.body.myapp_web;
  if (!auth || !cskh || !telegram || !notice) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  await connection.query(
    `UPDATE admin SET telegram = ?, cskh = ?, app = ?, notice = ?`,
    [telegram, cskh, myapp_web, notice],
  );
  return res.status(200).json({
    message: 'Thay đổi thành công',
    status: true,
  });
};

const banned = async (req, res) => {
  let auth = req.cookies.auth;
  let id = req.body.id;
  let type = req.body.type;
  if (!auth || !id) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [userById] = await connection.query(
    'SELECT money, dongbang_tk FROM users WHERE id = ?',
    [id],
  );

  if (type == 'open') {
    await connection.query(`UPDATE users SET status = 1 WHERE id = ?`, [id]);
  }
  if (type == 'close') {
    await connection.query(`UPDATE users SET status = 2 WHERE id = ?`, [id]);
  }

  if (userById.length < 1) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  } else {
    if (type == 'freeze') {
      await connection.query(
        `UPDATE users SET dongbang_tk = ?, money = 0 WHERE id = ?`,
        [userById[0].money, id],
      );
    } else if (type == 'unfreeze') {
      await connection.query(
        `UPDATE users SET dongbang_tk = 0, money = ? WHERE id = ?`,
        [userById[0].dongbang_tk, id],
      );
    }
  }

  return res.status(200).json({
    message: 'Thay đổi thành công',
    status: true,
  });
};

const createBonus = async (req, res) => {
  const randomString = length => {
    var result = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  function timerJoin(params = '') {
    let date = '';
    if (params) {
      date = new Date(Number(params));
    } else {
      date = Date.now();
      date = new Date(Number(date));
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let weeks = formateT(date.getDay());

    let hours = formateT(date.getHours());
    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());
    // return years + '-' + months + '-' + days + ' ' + hours + '-' + minutes + '-' + seconds;
    return years + '' + months + '' + days;
  }
  const d = new Date();
  const time = d.getTime();

  let auth = req.cookies.auth;
  let money = req.body.money;
  let type = req.body.type;

  if (!money || !auth) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];

  if (type == 'all') {
    let select = req.body.select;
    if (select == '1') {
      await connection.query(
        `UPDATE point_list SET money = money + ? WHERE level = 2`,
        [money],
      );
    } else {
      await connection.query(
        `UPDATE point_list SET money = money - ? WHERE level = 2`,
        [money],
      );
    }
    return res.status(200).json({
      message: '成功的改变',
      status: true,
    });
  }

  if (type == 'two') {
    let select = req.body.select;
    if (select == '1') {
      await connection.query(
        `UPDATE point_list SET money_us = money_us + ? WHERE level = 2`,
        [money],
      );
    } else {
      await connection.query(
        `UPDATE point_list SET money_us = money_us - ? WHERE level = 2`,
        [money],
      );
    }
    return res.status(200).json({
      message: '成功的改变',
      status: true,
    });
  }

  if (type == 'one') {
    let select = req.body.select;
    let phone = req.body.phone;
    const [user] = await connection.query(
      'SELECT * FROM point_list WHERE phone = ? ',
      [phone],
    );
    if (user.length == 0) {
      return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
    if (select == '1') {
      await connection.query(
        `UPDATE point_list SET money = money + ? WHERE level = 2 and phone = ?`,
        [money, phone],
      );
    } else {
      await connection.query(
        `UPDATE point_list SET money = money - ? WHERE level = 2 and phone = ?`,
        [money, phone],
      );
    }
    return res.status(200).json({
      message: '成功的改变',
      status: true,
    });
  }

  if (type == 'three') {
    let select = req.body.select;
    let phone = req.body.phone;
    const [user] = await connection.query(
      'SELECT * FROM point_list WHERE phone = ? ',
      [phone],
    );
    if (user.length == 0) {
      return res.status(200).json({
        message: '帐号不存在',
        status: false,
        timeStamp: timeNow,
      });
    }
    if (select == '1') {
      await connection.query(
        `UPDATE point_list SET money_us = money_us + ? WHERE level = 2 and phone = ?`,
        [money, phone],
      );
    } else {
      await connection.query(
        `UPDATE point_list SET money_us = money_us - ? WHERE level = 2 and phone = ?`,
        [money, phone],
      );
    }
    return res.status(200).json({
      message: '成功的改变',
      status: true,
    });
  }

  if (!type) {
    let id_redenvelops = String(timerJoin()) + randomString(16);
    let sql = `INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?`;
    await connection.query(sql, [
      id_redenvelops,
      userInfo.phone,
      money,
      1,
      1,
      0,
      time,
    ]);
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
      id: id_redenvelops,
    });
  }
};

const listRedenvelops = async (req, res) => {
  let auth = req.cookies.auth;

  let [redenvelopes] = await connection.query(
    'SELECT * FROM redenvelopes WHERE status = 0 ',
  );
  return res.status(200).json({
    message: 'Thay đổi thành công',
    status: true,
    redenvelopes: redenvelopes,
  });
};

const settingctv = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  let daily = req.body.daily;
  if (!phone && !daily) {
    return res.status(200).json({
      message: 'Vui lòng nhập dữ liệu',
      status: true,
      timeStamp: timeNow,
    });
  }
  const [user_id] = await connection.query(
    `SELECT * FROM users WHERE phone = ?`,
    [phone],
  );
  const [ctv] = await connection.query(
    'SELECT `code` FROM users WHERE phone = ?',
    [daily],
  );
  if (ctv.length == 0) {
    return res.status(200).json({
      message: 'Đại lý không tồn tại',
      status: true,
    });
  }

  if (user_id.length > 0) {
    await connection.query(
      `UPDATE users SET ctv = ?, invite = ? WHERE phone = ?`,
      [daily, ctv[0].code, phone],
    );
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
    });
  } else {
    return res.status(200).json({
      message: 'User không tồn tại',
      status: false,
    });
  }
};

const settingtc = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  let so = parseInt(req.body.so);
  if ((!phone && !so) || so <= 0) {
    return res.status(200).json({
      message: 'Vui lòng nhập dữ liệu',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_id] = await connection.query(
    `SELECT * FROM users WHERE phone = ?`,
    [phone],
  );

  if (user_id.length > 0) {
    await connection.query(
      `UPDATE users SET tongcuoc = tongcuoc + ? WHERE phone = ?`,
      [so, phone],
    );
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
    });
  } else {
    return res.status(200).json({
      message: 'User không tồn tại',
      status: false,
    });
  }
};

const doipassU = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  let pass = req.body.pass;
  if (!phone && !pass) {
    return res.status(200).json({
      message: 'Vui lòng nhập dữ liệu',
      status: false,
      timeStamp: timeNow,
    });
  }
  if (phone.length != 9) {
    return res.status(200).json({
      message: 'SĐT 9 số và không có số 0 ở đầu',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_id] = await connection.query(
    `SELECT * FROM users WHERE phone = ?`,
    [phone],
  );

  if (user_id.length > 0) {
    let MK = md5(pass);
    await connection.query(`UPDATE users SET password = ? WHERE phone = ?`, [
      MK,
      phone,
    ]);
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
    });
  } else {
    return res.status(200).json({
      message: 'User không tồn tại',
      status: false,
    });
  }
};

const settingLevelVip = async (req, res) => {
  let auth = req.cookies.auth;
  let id_user = req.body.id_user;
  let level_vip = req.body.level_vip;
  if (!id_user || !level_vip) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_id] = await connection.query(
    `SELECT * FROM users WHERE phone = ?`,
    [id_user],
  );

  if (user_id.length > 0) {
    await connection.execute('UPDATE users SET level_vip = ? WHERE phone = ?', [
      level_vip,
      id_user,
    ]);
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
    });
  } else {
    return res.status(200).json({
      message: 'Thất bại',
      status: false,
    });
  }
};

const settingbuff = async (req, res) => {
  let auth = req.cookies.auth;
  let id_user = req.body.id_user;
  let buff_acc = req.body.buff_acc;
  let money_value = req.body.money_value;
  if (!id_user || !buff_acc || !money_value) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_id] = await connection.query(
    `SELECT * FROM users WHERE phone = ?`,
    [id_user],
  );

  if (user_id.length > 0) {
    if (buff_acc == '1') {
      await connection.query(
        `UPDATE users SET money = money + ? WHERE phone = ?`,
        [money_value, id_user],
      );
    }
    if (buff_acc == '2') {
      await connection.query(
        `UPDATE users SET money = money - ? WHERE phone = ?`,
        [money_value, id_user],
      );
    }
    return res.status(200).json({
      message: 'Thay đổi thành công',
      status: true,
    });
  } else {
    return res.status(200).json({
      message: 'Thất bại',
      status: false,
    });
  }
};
const randomNumber = (min, max) => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const randomString = length => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const ipAddress = req => {
  let ip = '';
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }
  return ip;
};

const timeCreate = () => {
  const d = new Date();
  const time = d.getTime();
  return time;
};

const register = async (req, res) => {
  let { username, password, invitecode } = req.body;
  let id_user = randomNumber(10000, 99999);
  let name_user = 'Member' + randomNumber(10000, 99999);
  let code = randomString(5) + randomNumber(10000, 99999);
  let ip = ipAddress(req);
  let time = timeCreate();

  invitecode = '2cOCs36373';

  if (!username || !password || !invitecode) {
    return res.status(200).json({
      message: 'ERROR!!!',
      status: false,
    });
  }

  if (!username) {
    return res.status(200).json({
      message: 'phone error',
      status: false,
    });
  }

  try {
    const [check_u] = await connection.query(
      'SELECT * FROM users WHERE phone = ? ',
      [username],
    );
    if (check_u.length == 1) {
      return res.status(200).json({
        message: '注册账户', //Số điện thoại đã được đăng ký
        status: false,
      });
    } else {
      const sql = `INSERT INTO users SET 
            id_user = ?,
            phone = ?,
            name_user = ?,
            password = ?,
            money = ?,
            level = ?,
            code = ?,
            invite = ?,
            veri = ?,
            ip_address = ?,
            status = ?,
            time = ?`;
      await connection.execute(sql, [
        id_user,
        username,
        name_user,
        md5(password),
        0,
        2,
        code,
        invitecode,
        1,
        ip,
        1,
        time,
      ]);
      await connection.execute(
        'INSERT INTO point_list SET phone = ?, level = 2',
        [username],
      );
      return res.status(200).json({
        message: '注册成功', //Register Sucess
        status: true,
      });
    }
  } catch (error) {
    if (error) console.log(error);
  }
};

const profileUser = async (req, res) => {
  let phone = req.body.phone;
  if (!phone) {
    return res.status(200).json({
      message: 'Phone Error',
      status: false,
      timeStamp: timeNow,
    });
  }
  let [user] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [
    phone,
  ]);

  if (user.length == 0) {
    return res.status(200).json({
      message: 'Phone Error',
      status: false,
      timeStamp: timeNow,
    });
  }
  let [recharge] = await connection.query(
    `SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 10`,
    [phone],
  );
  let [withdraw] = await connection.query(
    `SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 10`,
    [phone],
  );
  return res.status(200).json({
    message: 'Nhận thành công',
    status: true,
    recharge: recharge,
    withdraw: withdraw,
  });
};

const infoCtv = async (req, res) => {
  const phone = req.body.phone;

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: 'Phone Error',
      status: false,
    });
  }
  let userInfo = user[0];
  // cấp dưới trực tiếp all
  const [f1s] = await connection.query(
    'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
    [userInfo.code],
  );

  // cấp dưới trực tiếp hôm nay
  let f1_today = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_time = f1s[i].time; // Mã giới thiệu f1
    let check = timerJoin(f1_time) == timerJoin() ? true : false;
    if (check) {
      f1_today += 1;
    }
  }

  // tất cả cấp dưới hôm nay
  let f_all_today = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const f1_time = f1s[i].time; // time f1
    let check_f1 = timerJoin(f1_time) == timerJoin() ? true : false;
    if (check_f1) f_all_today += 1;
    // tổng f1 mời đc hôm nay
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code; // Mã giới thiệu f2
      const f2_time = f2s[i].time; // time f2
      let check_f2 = timerJoin(f2_time) == timerJoin() ? true : false;
      if (check_f2) f_all_today += 1;
      // tổng f2 mời đc hôm nay
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      for (let i = 0; i < f3s.length; i++) {
        const f3_code = f3s[i].code; // Mã giới thiệu f3
        const f3_time = f3s[i].time; // time f3
        let check_f3 = timerJoin(f3_time) == timerJoin() ? true : false;
        if (check_f3) f_all_today += 1;
        const [f4s] = await connection.query(
          'SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ',
          [f3_code],
        );
        // tổng f3 mời đc hôm nay
        for (let i = 0; i < f4s.length; i++) {
          const f4_code = f4s[i].code; // Mã giới thiệu f4
          const f4_time = f4s[i].time; // time f4
          let check_f4 = timerJoin(f4_time) == timerJoin() ? true : false;
          if (check_f4) f_all_today += 1;
          // tổng f3 mời đc hôm nay
        }
      }
    }
  }

  // Tổng số f2
  let f2 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    f2 += f2s.length;
  }

  // Tổng số f3
  let f3 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code;
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      if (f3s.length > 0) f3 += f3s.length;
    }
  }

  // Tổng số f4
  let f4 = 0;
  for (let i = 0; i < f1s.length; i++) {
    const f1_code = f1s[i].code; // Mã giới thiệu f1
    const [f2s] = await connection.query(
      'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
      [f1_code],
    );
    for (let i = 0; i < f2s.length; i++) {
      const f2_code = f2s[i].code;
      const [f3s] = await connection.query(
        'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
        [f2_code],
      );
      for (let i = 0; i < f3s.length; i++) {
        const f3_code = f3s[i].code;
        const [f4s] = await connection.query(
          'SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ',
          [f3_code],
        );
        if (f4s.length > 0) f4 += f4s.length;
      }
    }
  }
  // select SUM(r.money) FROM recharge AS r LEFT JOIN users AS u ON r.phone = u.ctv WHERE u.ctv = 'daily1';
  const [list_mem] = await connection.query(
    'SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ',
    [phone],
  );
  const [list_mem_baned] = await connection.query(
    'SELECT * FROM users WHERE ctv = ? AND status = 2 AND veri = 1 ',
    [phone],
  );
  let [[{ total_recharge }]] = await connection.execute(
    'SELECT SUM(r.money) AS total_recharge FROM recharge AS r LEFT JOIN users AS u ON r.phone = u.phone WHERE u.ctv = ? AND r.status = ?',
    [phone, 1],
  );
  let [[{ total_withdraw }]] = await connection.execute(
    'SELECT SUM(r.money) AS total_withdraw FROM withdraw AS r LEFT JOIN users AS u ON r.phone = u.phone WHERE u.ctv = ? AND r.status = ?',
    [phone, 1],
  );

  // for (let i = 0; i < list_mem.length; i++) {
  //     let phone = list_mem[i].phone;
  //     const [recharge] = await connection.query(
  //         'SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     const [withdraw] = await connection.query(
  //         'SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     if (recharge[0].money) {
  //         total_recharge += Number(recharge[0].money);
  //     }
  //     if (withdraw[0].money) {
  //         total_withdraw += Number(withdraw[0].money);
  //     }
  // }

  let [[{ total_recharge_today }]] = await connection.execute(
    'SELECT SUM(r.money) AS total_recharge_today FROM recharge AS r LEFT JOIN users AS u ON r.phone = u.phone WHERE u.ctv = ? AND r.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [[{ total_withdraw_today }]] = await connection.execute(
    'SELECT SUM(r.money) AS total_withdraw_today FROM withdraw AS r LEFT JOIN users AS u ON r.phone = u.phone WHERE u.ctv = ? AND r.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  // for (let i = 0; i < list_mem.length; i++) {
  //     let phone = list_mem[i].phone;
  //     const [recharge_today] = await connection.query(
  //         'SELECT `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     const [withdraw_today] = await connection.query(
  //         'SELECT `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     for (let i = 0; i < recharge_today.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(recharge_today[i].time);
  //         if (time == today) {
  //             total_recharge_today += recharge_today[i].money;
  //         }
  //     }
  //     for (let i = 0; i < withdraw_today.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(withdraw_today[i].time);
  //         if (time == today) {
  //             total_withdraw_today += withdraw_today[i].money;
  //         }
  //     }
  // }

  let win = 0;
  let loss = 0;

  let [test] = await connection.execute(
    'SELECT * FROM result_5d WHERE status = ? AND today = ?',
    [2, timerJoin3()],
  );
  // console.log(test, timerJoin3());
  let [[{ total_win_today_wingo }]] = await connection.execute(
    'SELECT SUM(m.get) AS total_win_today_wingo FROM minutes_1 AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [[{ total_win_today_5d }]] = await connection.execute(
    'SELECT SUM(m.get) AS total_win_today_5d FROM result_5d AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [[{ total_win_today_k3 }]] = await connection.execute(
    'SELECT SUM(m.get) AS total_win_today_k3 FROM result_k3 AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );

  let [[{ total_loss_today_wingo }]] = await connection.execute(
    'SELECT SUM(m.money) AS total_loss_today_wingo FROM minutes_1 AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [[{ total_loss_today_5d }]] = await connection.execute(
    'SELECT SUM(m.money) AS total_loss_today_5d FROM result_5d AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [[{ total_loss_today_k3 }]] = await connection.execute(
    'SELECT SUM(m.money) AS total_loss_today_k3 FROM result_k3 AS m LEFT JOIN users AS u ON m.phone = u.phone WHERE u.ctv = ? AND m.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );

  total_win_today_wingo = total_win_today_wingo || 0;
  total_win_today_5d = total_win_today_5d || 0;
  total_win_today_k3 = total_win_today_k3 || 0;
  total_loss_today_wingo = total_loss_today_wingo || 0;
  total_loss_today_5d = total_loss_today_5d || 0;
  total_loss_today_k3 = total_loss_today_k3 || 0;

  win =
    Number(total_win_today_wingo) +
    Number(total_win_today_5d) +
    Number(total_win_today_k3);
  loss =
    Number(total_loss_today_wingo) +
    Number(total_loss_today_5d) +
    Number(total_loss_today_k3);

  // for (let i = 0; i < list_mem.length; i++) {
  //     let phone = list_mem[i].phone;
  //     const [wins] = await connection.query(
  //         'SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     const [losses] = await connection.query(
  //         'SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 2 ',
  //         [phone]
  //     );
  //     for (let i = 0; i < wins.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(wins[i].time);
  //         if (time == today) {
  //             win += wins[i].money;
  //         }
  //     }
  //     for (let i = 0; i < losses.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(losses[i].time);
  //         if (time == today) {
  //             loss += losses[i].money;
  //         }
  //     }
  // }

  let list_mems = [];

  const [list_mem_today] = await connection.query(
    'SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 AND time = ?',
    [phone, timerJoin3()],
  );
  // for (let i = 0; i < list_mem_today.length; i++) {
  //     let today = timerJoin();
  //     let time = timerJoin(list_mem_today[i].time);
  //     if (time == today) {
  //         list_mems.push(list_mem_today[i]);
  //     }
  // }

  const [point_list] = await connection.query(
    'SELECT * FROM point_list WHERE phone = ? ',
    [phone],
  );
  let moneyCTV = point_list[0].money;

  let [list_recharge_news] = await connection.execute(
    'SELECT r.id, r.status, r.type, r.phone, r.money, r.time FROM recharge AS r LEFT JOIN users AS u ON r.phone = u.phone WHERE u.ctv = ? AND r.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  let [list_withdraw_news] = await connection.execute(
    'SELECT w.id, w.status, w.phone, w.money, w.time FROM withdraw AS w LEFT JOIN users AS u ON w.phone = u.phone WHERE u.ctv = ? AND w.status = ? AND today = ?',
    [phone, 1, timerJoin3()],
  );
  // for (let i = 0; i < list_mem.length; i++) {
  //     let phone = list_mem[i].phone;
  //     const [recharge_today] = await connection.query(
  //         'SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     const [withdraw_today] = await connection.query(
  //         'SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ',
  //         [phone]
  //     );
  //     for (let i = 0; i < recharge_today.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(recharge_today[i].time);
  //         if (time == today) {
  //             list_recharge_news.push(recharge_today[i]);
  //         }
  //     }
  //     for (let i = 0; i < withdraw_today.length; i++) {
  //         let today = timerJoin();
  //         let time = timerJoin(withdraw_today[i].time);
  //         if (time == today) {
  //             list_withdraw_news.push(withdraw_today[i]);
  //         }
  //     }
  // }

  const [redenvelopes_used] = await connection.query(
    'SELECT * FROM redenvelopes_used WHERE phone = ? ',
    [phone],
  );
  let redenvelopes_used_today = [];
  for (let i = 0; i < redenvelopes_used.length; i++) {
    let today = timerJoin();
    let time = timerJoin(redenvelopes_used[i].time);
    if (time == today) {
      redenvelopes_used_today.push(redenvelopes_used[i]);
    }
  }

  const [financial_details] = await connection.query(
    'SELECT * FROM financial_details WHERE phone = ? ',
    [phone],
  );
  let financial_details_today = [];
  for (let i = 0; i < financial_details.length; i++) {
    let today = timerJoin();
    let time = timerJoin(financial_details[i].time);
    if (time == today) {
      financial_details_today.push(financial_details[i]);
    }
  }

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: user,
    f1: f1s.length,
    f2: f2,
    f3: f3,
    f4: f4,
    list_mems: list_mem_today || 0,
    total_recharge: total_recharge || 0,
    total_withdraw: total_withdraw || 0,
    total_recharge_today: total_recharge_today || 0,
    total_withdraw_today: total_withdraw_today || 0,
    list_mem_baned: list_mem_baned.length || 0,
    win: win || 0,
    loss: loss || 0,
    list_recharge_news: list_recharge_news || 0,
    list_withdraw_news: list_withdraw_news || 0,
    moneyCTV: moneyCTV || 0,
    redenvelopes_used: redenvelopes_used_today || 0,
    financial_details_today: financial_details_today || 0,
  });
};

const infoCtv2 = async (req, res) => {
  const phone = req.body.phone;
  const timeDate = req.body.timeDate;

  function timerJoin(params = '') {
    let date = '';
    if (params) {
      date = new Date(Number(params));
    } else {
      date = Date.now();
      date = new Date(Number(date));
    }
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let weeks = formateT(date.getDay());

    let hours = formateT(date.getHours());
    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());
    // return years + '-' + months + '-' + days + ' ' + hours + '-' + minutes + '-' + seconds;
    return years + '-' + months + '-' + days;
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: 'Phone Error',
      status: false,
    });
  }
  let userInfo = user[0];
  const [list_mem] = await connection.query(
    'SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ',
    [phone],
  );

  let list_mems = [];
  const [list_mem_today] = await connection.query(
    'SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ',
    [phone],
  );
  for (let i = 0; i < list_mem_today.length; i++) {
    let today = timeDate;
    let time = timerJoin(list_mem_today[i].time);
    if (time == today) {
      list_mems.push(list_mem_today[i]);
    }
  }

  let list_recharge_news = [];
  let list_withdraw_news = [];
  for (let i = 0; i < list_mem.length; i++) {
    let phone = list_mem[i].phone;
    const [recharge_today] = await connection.query(
      'SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ',
      [phone],
    );
    const [withdraw_today] = await connection.query(
      'SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ',
      [phone],
    );
    for (let i = 0; i < recharge_today.length; i++) {
      let today = timeDate;
      let time = timerJoin(recharge_today[i].time);
      if (time == today) {
        list_recharge_news.push(recharge_today[i]);
      }
    }
    for (let i = 0; i < withdraw_today.length; i++) {
      let today = timeDate;
      let time = timerJoin(withdraw_today[i].time);
      if (time == today) {
        list_withdraw_news.push(withdraw_today[i]);
      }
    }
  }

  const [redenvelopes_used] = await connection.query(
    'SELECT * FROM redenvelopes_used WHERE phone = ? ',
    [phone],
  );
  let redenvelopes_used_today = [];
  for (let i = 0; i < redenvelopes_used.length; i++) {
    let today = timeDate;
    let time = timerJoin(redenvelopes_used[i].time);
    if (time == today) {
      redenvelopes_used_today.push(redenvelopes_used[i]);
    }
  }

  const [financial_details] = await connection.query(
    'SELECT * FROM financial_details WHERE phone = ? ',
    [phone],
  );
  let financial_details_today = [];
  for (let i = 0; i < financial_details.length; i++) {
    let today = timeDate;
    let time = timerJoin(financial_details[i].time);
    if (time == today) {
      financial_details_today.push(financial_details[i]);
    }
  }

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: user,
    list_mems: list_mems,
    list_recharge_news: list_recharge_news,
    list_withdraw_news: list_withdraw_news,
    redenvelopes_used: redenvelopes_used_today,
    financial_details_today: financial_details_today,
  });
};

const listRechargeMem = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [recharge] = await connection.query(
    `SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM recharge WHERE phone = ?`,
    [phone],
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: recharge,
    page_total: Math.ceil(total_users.length / limit),
  });
};

//capduoi
/*
const listCapduoi = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let {pageno, limit } = req.body;

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "Không còn dữ liệu",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "Không còn dữ liệu",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    let { token, password, otp, level, invite, code,...userInfo } = user[0];

    const [Capduoi] = await connection.query(`SELECT * FROM users WHERE invite = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [user[0].code]);
    const [total_users] = await connection.query(`SELECT * FROM users WHERE invite = ?`, [user[0].code]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: Capduoi,
        page_total: Math.ceil(total_users.length / limit)
    });
}
*/

const listCapduoiF = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let f = req.params.f;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  var dataT = [];
  var pageTT;
  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );
  var userInfo = user[0];

  const [f1s] = await connection.query(
    `SELECT f1.id, f1.phone, f1.status, f1.money, f1.total_money, f1.time,
		r.total_recharge,
        COALESCE(SUM(w.money), 0) AS total_withdraw
        FROM users AS f1 
        LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
        ON f1.phone = r.phone
        LEFT JOIN withdraw AS w
        ON f1.phone = w.phone AND w.status = 1
        WHERE f1.invite = ?
        GROUP BY f1.phone
        ORDER BY f1.time DESC`,
    [userInfo.code],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM users WHERE invite = ?`,
    [userInfo.code],
  );
  if (f === 'f1') {
    if (f1s.length > 0) dataT = dataT.concat(f1s);
  }

  // Tổng số f2
  if (f === 'f2') {
    let [f2s] = await connection.execute(
      `SELECT f2.id, f2.phone, f2.status, f2.money, f2.total_money, f2.time,
            r.total_recharge,
            COALESCE(SUM(w.money), 0) AS total_withdraw
            FROM users AS f1 
            JOIN users AS f2 
            ON f1.code = f2.invite 
            LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
            ON f2.phone = r.phone
            LEFT JOIN withdraw AS w
            ON f2.phone = w.phone AND w.status = 1
            WHERE f1.invite = ?
            GROUP BY f2.phone
            ORDER BY f2.time DESC`,
      [userInfo.code],
    );
    if (f2s.length > 0) dataT = dataT.concat(f2s);
  }

  // Tổng số f3

  if (f === 'f3') {
    let [f3s] = await connection.execute(
      `SELECT f3.id, f3.phone, f3.status, f3.money, f3.total_money, f3.time,
            r.total_recharge,
            COALESCE(SUM(w.money), 0) AS total_withdraw
            FROM users AS f1 
            JOIN users AS f2 
            ON f1.code = f2.invite 
            JOIN users AS f3 
            ON f2.code = f3.invite 
            LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
            ON f3.phone = r.phone
            LEFT JOIN withdraw AS w
            ON f3.phone = w.phone AND w.status = 1
            WHERE f1.invite = ?
            GROUP BY f3.phone
            ORDER BY f3.time DESC`,
      [userInfo.code],
    );
    if (f3s.length > 0) dataT = dataT.concat(f3s);
  }

  // Tổng số f4
  if (f === 'f4') {
    let [f4s] = await connection.execute(
      `SELECT f4.id, f4.phone, f4.status, f4.money, f4.total_money, f4.time,
            r.total_recharge,
            COALESCE(SUM(w.money), 0) AS total_withdraw
            FROM users AS f1 
            JOIN users AS f2 
            ON f1.code = f2.invite 
            JOIN users AS f3 
            ON f2.code = f3.invite 
            JOIN users AS f4 
            ON f3.code = f4.invite 
            LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
            ON f4.phone = r.phone
            LEFT JOIN withdraw AS w
            ON f4.phone = w.phone AND w.status = 1
            WHERE f1.invite = ?
            GROUP BY f4.phone
            ORDER BY f4.time DESC`,
      [userInfo.code],
    );
    if (f4s.length > 0) dataT = dataT.concat(f4s);
  }

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: dataT,
    //page_total: Math.ceil(total_users.length / limit)
  });
};

const listCapduoi = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  var dataT = [];
  var pageTT;
  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );
  var userInfo = user[0];

  const [f1s] = await connection.query(
    `SELECT f1.id, f1.phone, f1.status, f1.money, f1.total_money, f1.time,
        r.total_recharge,
        COALESCE(SUM(w.money), 0) AS total_withdraw
        FROM users AS f1 
        LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
        ON f1.phone = r.phone
        LEFT JOIN withdraw AS w
        ON f1.phone = w.phone AND w.status = 1
        WHERE f1.invite = ?
        GROUP BY f1.phone
        ORDER BY f1.time DESC`,
    [userInfo.code],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM users WHERE invite = ?`,
    [userInfo.code],
  );
  if (f1s.length > 0) dataT = dataT.concat(f1s);

  // Tổng số f2

  let [f2s] = await connection.execute(
    `SELECT f2.id, f2.phone, f2.status, f2.money, f2.total_money, f2.time,
        r.total_recharge,
        COALESCE(SUM(w.money), 0) AS total_withdraw
        FROM users AS f1 
        JOIN users AS f2 
        ON f1.code = f2.invite 
        LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
        ON f2.phone = r.phone
        LEFT JOIN withdraw AS w
        ON f2.phone = w.phone AND w.status = 1
        WHERE f1.invite = ?
        GROUP BY f2.phone
        ORDER BY f2.time DESC`,
    [userInfo.code],
  );
  if (f2s.length > 0) dataT = dataT.concat(f2s);

  // for (let i = 0; i < f1s.length; i++) {
  //     const f1_code = f1s[i].code; // Mã giới thiệu f1
  //     const [f2s] = await connection.query(
  //         'SELECT * FROM users WHERE `invite` = ? ',
  //         [f1_code]
  //     );
  //     if (f2s.length > 0) dataT = dataT.concat(f2s);
  // }

  // Tổng số f3

  let [f3s] = await connection.execute(
    `SELECT f3.id, f3.phone, f3.status, f3.money, f3.total_money, f3.time,
            r.total_recharge,
            COALESCE(SUM(w.money), 0) AS total_withdraw
            FROM users AS f1 
            JOIN users AS f2 
            ON f1.code = f2.invite 
            JOIN users AS f3 
            ON f2.code = f3.invite 
            LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
            ON f3.phone = r.phone
            LEFT JOIN withdraw AS w
            ON f3.phone = w.phone AND w.status = 1
            WHERE f1.invite = ?
            GROUP BY f3.phone
            ORDER BY f3.time DESC`,
    [userInfo.code],
  );
  if (f3s.length > 0) dataT = dataT.concat(f3s);
  // for (let i = 0; i < f1s.length; i++) {
  //     const f1_code = f1s[i].code; // Mã giới thiệu f1
  //     const [f2s] = await connection.query(
  //         'SELECT * FROM users WHERE `invite` = ? ',
  //         [f1_code]
  //     );
  //     for (let i = 0; i < f2s.length; i++) {
  //         const f2_code = f2s[i].code;
  //         const [f3s] = await connection.query(
  //             'SELECT * FROM users WHERE `invite` = ? ',
  //             [f2_code]
  //         );
  //         if (f3s.length > 0) dataT = dataT.concat(f3s);
  //     }
  // }

  // Tổng số f4
  let [f4s] = await connection.execute(
    `SELECT f4.id, f4.phone, f4.status, f4.money, f4.total_money, f4.time,
        r.total_recharge,
        COALESCE(SUM(w.money), 0) AS total_withdraw
        FROM users AS f1 
        JOIN users AS f2 
        ON f1.code = f2.invite 
        JOIN users AS f3 
        ON f2.code = f3.invite 
        JOIN users AS f4 
        ON f3.code = f4.invite 
        LEFT JOIN (SELECT phone, SUM(money) AS total_recharge FROM recharge WHERE status = 1 GROUP BY phone) AS r 
        ON f4.phone = r.phone
        LEFT JOIN withdraw AS w
        ON f4.phone = w.phone AND w.status = 1
        WHERE f1.invite = ?
        GROUP BY f4.phone
        ORDER BY f4.time DESC`,
    [userInfo.code],
  );
  if (f4s.length > 0) dataT = dataT.concat(f4s);
  // for (let i = 0; i < f1s.length; i++) {
  //     const f1_code = f1s[i].code; // Mã giới thiệu f1
  //     const [f2s] = await connection.query(
  //         'SELECT * FROM users WHERE `invite` = ? ',
  //         [f1_code]
  //     );
  //     for (let i = 0; i < f2s.length; i++) {
  //         const f2_code = f2s[i].code;
  //         const [f3s] = await connection.query(
  //             'SELECT * FROM users WHERE `invite` = ? ',
  //             [f2_code]
  //         );
  //         for (let i = 0; i < f3s.length; i++) {
  //             const f3_code = f3s[i].code;
  //             const [f4s] = await connection.query(
  //                 'SELECT * FROM users WHERE `invite` = ? ',
  //                 [f3_code]
  //             );
  //             if (f4s.length > 0) dataT = dataT.concat(f4s);
  //         }
  //     }
  // }

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: dataT,
    //page_total: Math.ceil(total_users.length / limit)
  });
};

const listWithdrawMem = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [withdraw] = await connection.query(
    `SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM withdraw WHERE phone = ?`,
    [phone],
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: withdraw,
    page_total: Math.ceil(total_users.length / limit),
  });
};

const listRedenvelope = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [redenvelopes_used] = await connection.query(
    `SELECT * FROM redenvelopes_used WHERE phone_used = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM redenvelopes_used WHERE phone_used = ?`,
    [phone],
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: redenvelopes_used,
    page_total: Math.ceil(total_users.length / limit),
  });
};

const listBet = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [listBet] = await connection.query(
    `SELECT * FROM minutes_1 WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_users] = await connection.query(
    `SELECT * FROM minutes_1 WHERE phone = ? AND status != 0`,
    [phone],
  );
  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: listBet,
    page_total: Math.ceil(total_users.length / limit),
  });
};
const listBetk3 = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [listBetk3] = await connection.query(
    `SELECT * FROM result_k3 WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_usersk3] = await connection.query(
    `SELECT * FROM result_k3 WHERE phone = ? AND status != 0`,
    [phone],
  );

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: listBetk3,
    page_total: Math.ceil(total_usersk3.length / limit),
  });
};

const listBetk5 = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [listBetk5] = await connection.query(
    `SELECT * FROM result_5d WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_usersk5] = await connection.query(
    `SELECT * FROM result_5d WHERE phone = ? AND status != 0`,
    [phone],
  );

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: listBetk5,
    page_total: Math.ceil(total_usersk5.length / limit),
  });
};

const listBetBaccarat = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.params.phone;
  let { pageno, limit } = req.body;

  if (!pageno || !limit) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (pageno < 0 || limit < 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!phone) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    'SELECT * FROM users WHERE phone = ? ',
    [phone],
  );
  const [auths] = await connection.query(
    'SELECT * FROM users WHERE token = ? ',
    [auth],
  );

  if (user.length == 0 || auths.length == 0) {
    return res.status(200).json({
      message: 'Failed',
      status: false,
      timeStamp: timeNow,
    });
  }
  let { token, password, otp, level, ...userInfo } = user[0];

  const [listBetBaccarat] = await connection.query(
    `SELECT * FROM bet_history WHERE member = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `,
    [phone],
  );
  const [total_usersBaccarat] = await connection.query(
    `SELECT * FROM bet_history WHERE member = ?`,
    [phone],
  );

  return res.status(200).json({
    message: 'Success',
    status: true,
    datas: listBetBaccarat,
    page_total: Math.ceil(total_usersBaccarat.length / limit),
  });
};

const listOrderOld = async (req, res) => {
  let { gameJoin } = req.body;

  let checkGame = [
    '1',
    '3',
    '5',
    '10',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
  ].includes(String(gameJoin));
  if (!checkGame) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  let game = Number(gameJoin);

  let join = '';
  if (game == 1) join = 'k5d';
  if (game == 3) join = 'k5d3';
  if (game == 5) join = 'k5d5';
  if (game == 10) join = 'k5d10';

  const [k5d] = await connection.query(
    `SELECT * FROM 5d WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `,
  );
  const [period] = await connection.query(
    `SELECT period FROM 5d WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `,
  );
  const [waiting] = await connection.query(
    `SELECT id, phone, money, price, amount, bet, game, join_bet FROM result_5d WHERE status = 0 AND level = 0 AND game = '${game}' ORDER BY id ASC `,
  );
  const [settings] = await connection.query(`SELECT ${join} FROM admin`);
  if (k5d.length == 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  if (!k5d[0] || !period[0]) {
    return res.status(200).json({
      message: 'Error!',
      status: false,
    });
  }
  return res.status(200).json({
    code: 0,
    msg: 'Nhận thành công',
    data: {
      gameslist: k5d,
    },
    bet: waiting,
    settings: settings,
    join: join,
    period: period[0].period,
    status: true,
  });
};

const listOrderOldK3 = async (req, res) => {
  let { gameJoin } = req.body;

  let checkGame = [
    '1',
    '3',
    '5',
    '10',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
  ].includes(String(gameJoin));
  if (!checkGame) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  let game = Number(gameJoin);

  let join = `k3d${game == 1 ? '' : game}`;
  // if (game == 1) join = 'k3d';
  // if (game == 3) join = 'k3d3';
  // if (game == 5) join = 'k3d5';
  // if (game == 10) join = 'k3d10';

  const [k3d] = await connection.query(
    `SELECT * FROM k3 WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `,
  );
  const [period3] = await connection.query(
    `SELECT period FROM k3 WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `,
  );
  const [waiting3] = await connection.query(
    `SELECT id, phone, money, price, typeGame, amount, bet FROM result_k3 WHERE status = 0 AND level = 0 AND game = '${game}' ORDER BY id ASC `,
  );
  const [settings3] = await connection.query(`SELECT ${join} FROM admin`);
  if (k3d.length == 0) {
    return res.status(200).json({
      code: 0,
      msg: 'Không còn dữ liệu',
      data: {
        gameslist: [],
      },
      status: false,
    });
  }

  if (!k3d[0] || !period3[0]) {
    return res.status(200).json({
      message: 'Error!',
      status: false,
    });
  }
  return res.status(200).json({
    code: 0,
    msg: 'Nhận thành công',
    data: {
      gameslist: k3d,
    },
    bet: waiting3,
    settings: settings3,
    join: join,
    period: period3[0].period,
    status: true,
  });
};
const editResultK3 = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  let { game, list } = req.body;

  if (!list || !game) {
    return res.status(200).json({
      message: 'ERROR!!!',
      status: false,
    });
  }
  let join = `k3d${game == 1 ? '' : game}`;
  // if (game == 1) join = 'k3d';
  // if (game == 3) join = 'k3d3';
  // if (game == 5) join = 'k3d5';
  // if (game == 10) join = 'k3d10';

  const sqlk3 = `UPDATE admin SET ${join} = ?`;
  await connection.execute(sqlk3, [list]);
  return res.status(200).json({
    message: 'Chỉnh sửa thành công', //Register Sucess
    status: true,
  });
};
const editResult = async (req, res) => {
  // return res.status(200).json({
  //     message: 'Thanh toán để sử dụng full chức năng!',
  //     status: false
  // });
  let { game, list } = req.body;

  if (!list || !game) {
    return res.status(200).json({
      message: 'ERROR!!!',
      status: false,
    });
  }

  let join = '';
  if (game == 1) join = 'k5d';
  if (game == 3) join = 'k5d3';
  if (game == 5) join = 'k5d5';
  if (game == 10) join = 'k5d10';

  const sql = `UPDATE admin SET ${join} = ?`;
  await connection.execute(sql, [list]);
  return res.status(200).json({
    message: 'Chỉnh sửa thành công', //Register Sucess
    status: true,
  });
};
const editBank = async (req, res) => {
  //let auth = req.cookies.auth;
  let phone = req.body.phone;
  let userbank = req.body.userbank;
  let stk = req.body.stk;
  let namebank = req.body.namebank;
  /*     let tp = req.body.tp;
    let email = req.body.email;
    let sdt = req.body.sdt;
    let tinh = req.body.tinh;
    let chi_nhanh = req.body.chi_nhanh; */
  // data: {
  //     phone: phone,
  //     userbank: userbank,
  //     stk: stk,
  // },

  if (!phone || !userbank || !stk) {
    return res.status(200).json({
      message: 'Nhập đầy đủ thông tin',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    'SELECT `phone`, `code`,`invite` FROM users WHERE `phone` = ? ',
    [phone],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: 'không tồn tại user',
      status: false,
      timeStamp: timeNow,
    });
  }
  const [check] = await connection.query(
    'SELECT * FROM user_bank WHERE `phone` = ? ',
    [phone],
  );
  if (check.length > 0) {
    let time = new Date().getTime();
    const sql = `UPDATE user_bank SET 
        name_bank = ?,
        name_user = ?,
        stk = ?
        WHERE phone = ?`;
    try {
      await connection.execute(sql, [namebank, userbank, stk, phone]);
    } catch (err) {
      console.log(err);
    }
    return res.status(200).json({
      message: 'Sửa ngân hàng thành công',
      status: true,
      timeStamp: timeNow,
    });
  } else {
    return res.status(200).json({
      message: 'Không tồn tại bank',
      status: false,
      timeStamp: timeNow,
    });
  }
};

const changeBet = async (req, res, next) => {
  let { id, type, bet, join_bet, game, phone, oldJoinBet, oldBet } = req.body;
  console.log(phone, join_bet, game, bet);
  let betWingo = [
    't',
    'd',
    'x',
    'n',
    'l',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  let bet5d = [
    'b',
    's',
    'c',
    'l',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  let betk3 = [
    'b',
    's',
    'c',
    'l',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
  ];
  let join_bet5d = ['a', 'b', 'c', 'd', 'e', 'total'];
  if (type === 'wingo') {
    if (!betWingo.includes(bet)) {
      return res.json({ status: false, msg: 'Sai quy tắc' });
    }
    await connection.execute('UPDATE minutes_1 SET bet = ? WHERE id = ?', [
      bet,
      id,
    ]);
  }
  if (type === '5d') {
    if (!bet5d.includes(bet) || !join_bet5d.includes(join_bet)) {
      return res.json({ status: false, msg: 'Sai quy tắc' });
    }
    await connection.execute(
      'UPDATE result_5d SET join_bet = ?, bet = ? WHERE id = ?',
      [join_bet, bet, id],
    );
  }
  if (type === 'k3') {
    if (!betk3.includes(bet)) {
      return res.json({ status: false, msg: 'Sai quy tắc' });
    }
    await connection.execute('UPDATE result_k3 SET bet = ? WHERE id = ?', [
      bet,
      id,
    ]);
  }
  return res.json({ status: true, msg: 'Sửa thành công' });
};

const listXsmbBet = async (req, res) => {
  let { page } = req.body;
  let [list] = await connection.execute(
    'SELECT * FROM xsmb_cuoc ORDER BY time DESC',
  );
  if (list.length > 0) {
    list = list.map(item => {
      item.type =
        item.type === 'de'
          ? 'Đề'
          : item.type === 'lo2'
          ? 'LÔ'
          : item.type === 'xien2'
          ? 'Xiên 2'
          : item.type === 'xien3'
          ? 'Xiên 3'
          : item.type === 'xien4'
          ? 'Xiên 4'
          : item.type === 'daude'
          ? 'Đầu đề'
          : item.type === '3cang'
          ? '3 càng'
          : item.type === 'dau'
          ? 'Đầu'
          : 'Đuôi';
      item.so = JSON.parse(item.so).toString();
      item.time = timerJoin3(item.time);
      return item;
    });
  }
  return res.json({ list, page });
};

const xsmbRate = async (req, res) => {
  const [[list]] = await connection.execute('SELECT * FROM xsmb_rate');
  return res.json(list);
};

const editXsmbRate = async (req, res) => {
  await connection.execute(
    'UPDATE xsmb_rate SET de = ?, lo2 = ?, xien2 = ?, xien3 = ?, xien4 = ?, daude = ?, 3cang = ?, dau = ?, duoi = ?',
    [
      req.body.de,
      req.body.lo2,
      req.body.xien2,
      req.body.xien3,
      req.body.xien4,
      req.body.daude,
      req.body.bacang,
      req.body.dau,
      req.body.duoi,
    ],
  );
  return res.json({ status: true, msg: 'Cập nhật thành công' });
};

const editPrice = async (req, res) => {
  const { game, gameCode, position, value } = req.body;
  if (!game || !gameCode || !position || !value) {
    return res.status(200).json({
      message: 'Thiếu dữ liệu',
      status: false,
      timeStamp: timeNow,
    });
  }

  await connection.execute(
    `UPDATE price_k3 SET value = ? WHERE game = ? AND game_code = ? AND position = ?`,
    [value, game, gameCode, position],
  );
  return res.json({ status: true, msg: 'Cập nhật thành công' });
};

const getPrice = async (req, res) => {
  const { game } = req.body;

  const [list] = await connection.execute(
    `SELECT * FROM price_k3 WHERE game = ? `,
    [game],
  );

  function groupByGameCode(data) {
    const groupedData = new Map();
    for (const item of data) {
      const gameCode = item.game_code;
      if (!groupedData.has(gameCode)) {
        groupedData.set(gameCode, { gameCode: gameCode, data: [] });
      }
      const group = groupedData.get(gameCode);
      group.data.push({
        position: item.position,
        value: parseFloat(item.value),
      });
    }
    return Array.from(groupedData.values());
  }

  const groupedData = groupByGameCode(list);
  return res.json(groupedData);
};

module.exports = {
  settingDeleteUser,
  editBank,
  adminPage,
  adminPage3,
  adminPage5,
  adminPage10,
  listCapduoi,
  totalJoin,
  middlewareAdminController,
  changeAdmin,
  membersPage,
  listMember,
  infoMember,
  userInfo,
  statistical,
  statistical2,
  rechargePage,
  recharge,
  rechargeDuyet,
  rechargeRecord,
  withdrawRecord,
  withdraw,
  handlWithdraw,
  settings,
  settingBank,
  settingGet,
  settingCskh,
  settingbuff,
  register,
  ctvPage,
  listCTV,
  profileUser,
  ctvProfilePage,
  infoCtv,
  infoCtv2,
  giftPage,
  createBonus,
  listRedenvelops,
  banned,
  listRechargeMem,
  listWithdrawMem,
  listRedenvelope,
  listBet,
  listBetk3,
  listBetk5,
  adminPage5d,
  listOrderOld,
  listOrderOldK3,
  editResult,
  adminPageK3,
  adminRatioPageK3,
  editResultK3,
  settingctv,
  doipassU,
  settingtc,
  listCapduoiF,
  listBetBaccarat,
  changeBet,
  settingLevelVip,
  adminPageXsmbCuoc,
  listXsmbBet,
  adminPageXsmbRate,
  xsmbRate,
  editXsmbRate,
  editPrice,
  getPrice,
};
