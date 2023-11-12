import connection from "../config/connectDB";
import jwt from "jsonwebtoken";
import md5 from "md5";
import e from "express";
import helpers from "../../helpers";
require("dotenv").config();

const winGoPage = async (req, res) => {
  return res.render("bet/sicbo/sicbo.ejs", {
    title: "Tài Xỉu",
    betContent: [
      {
        title: "Tài",
        tiLe: 1.985,
      },
      {
        title: "Xỉu",
        tiLe: 1.985,
      },
      {
        title: "Lẻ",
        tiLe: 1.985,
      },
      {
        title: "Chẵn",
        tiLe: 1.985,
      },
      {
        title: "3",
        tiLe: 194,
      },
      {
        title: "4",
        tiLe: 64,
      },
      {
        title: "5",
        tiLe: 32,
      },
      {
        title: "6",
        tiLe: 19,
      },
      {
        title: "7",
        tiLe: 12,
      },
      {
        title: "8",
        tiLe: 9,
      },
      {
        title: "9",
        tiLe: 7,
      },
      {
        title: "10",
        tiLe: 7,
      },
      {
        title: "11",
        tiLe: 7,
      },
      {
        title: "12",
        tiLe: 7,
      },
      {
        title: "13",
        tiLe: 9,
      },
      {
        title: "14",
        tiLe: 12,
      },
      {
        title: "15",
        tiLe: 19,
      },
      {
        title: "16",
        tiLe: 32,
      },
      {
        title: "17",
        tiLe: 64,
      },
      {
        title: "18",
        tiLe: 194,
      },
    ],
  });
};

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

var formateT = function (params) {
  let result = params < 10 ? "0" + params : params;
  return result;
};

var timerJoin = function (params = "") {
  let date = "";
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
    "-" +
    months +
    "-" +
    days +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

const rosesPlus = async (auth, money) => {
  const [level] = await connection.query("SELECT * FROM level ");
  let level0 = level[0];

  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
    [auth]
  );
  let userInfo = user[0];
  const [f1] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
    [userInfo.invite]
  );
  if (money >= 10000) {
    if (f1.length > 0) {
      let infoF1 = f1[0];
      let rosesF1 = (money / 100) * level0.f1;
      await connection.query(
        "UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
        [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone]
      );
      const [f2] = await connection.query(
        "SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
        [infoF1.invite]
      );
      if (f2.length > 0) {
        let infoF2 = f2[0];
        let rosesF2 = (money / 100) * level0.f2;
        await connection.query(
          "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
          [rosesF2, rosesF2, rosesF2, infoF2.phone]
        );
        const [f3] = await connection.query(
          "SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
          [infoF2.invite]
        );
        if (f3.length > 0) {
          let infoF3 = f3[0];
          let rosesF3 = (money / 100) * level0.f3;
          await connection.query(
            "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
            [rosesF3, rosesF3, rosesF3, infoF3.phone]
          );
          const [f4] = await connection.query(
            "SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
            [infoF3.invite]
          );
          if (f4.length > 0) {
            let infoF4 = f4[0];
            let rosesF4 = (money / 100) * level0.f4;
            await connection.query(
              "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
              [rosesF4, rosesF4, rosesF4, infoF4.phone]
            );
          }
        }
      }
    }
  }
};

const betSicbo = async (req, res) => {
  try {
    let { typeid, join, x, money } = req.body;
    let auth = req.cookies.auth;
    let newJoin = join.split(" ")[0];
    console.log(newJoin);

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
      return res.status(200).json({
        message: "Error!",
        status: true,
      });
    }

    let gameJoin = "";
    if (typeid == 1) gameJoin = "sicbo1";
    if (typeid == 3) gameJoin = "sicbo3";
    if (typeid == 5) gameJoin = "sicbo5";
    if (typeid == 10) gameJoin = "sicbo10";
    const [sicboNow] = await connection.query(
      `SELECT period FROM taixiu WHERE thanhtoan = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1`
    );
    const [user] = await connection.query(
      "SELECT id_user, phone, code, invite, level, money, tongcuoc FROM users WHERE token = ? AND veri = 1 LIMIT 1",
      [auth]
    );
    if (!sicboNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
      return res.status(200).json({
        message: "Error!",
        status: true,
      });
    }

    let userInfo = user[0];
    let period = sicboNow[0].period;
    let fee = x * money * 0.02;
    let total = x * money - fee;
    let timeNow = helpers.timerJoin();
    let check = userInfo.money - total;

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product =
      years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let checkJoin = "";

    if ((!isNumber(join) && join == "l") || join == "n") {
      checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${
              join == "n" ? "small" : "big"
            }.png" class="van-image__img">
        </div>
        `;
    } else {
      checkJoin = `
        <span data-v-a9660e98="">${isNumber(join) ? join : ""}</span>
        `;
    }

    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-green">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

    function timerJoin(params = "") {
      let date = "";
      if (params) {
        date = new Date(Number(params));
      } else {
        date = new Date();
      }
      let years = formateT(date.getFullYear());
      let months = formateT(date.getMonth() + 1);
      let days = formateT(date.getDate());
      return years + "-" + months + "-" + days;
    }
    let checkTime = timerJoin(date.getTime());

    if (check >= 0) {
      const sql =
        "INSERT INTO taixiu_cuoc SET phien = ?, UID = ?, cuadat = ?, money = ?, win = ?, ref = ?, thanhtoan = ?, date = ?";
      await connection.execute(sql, [
        period,
        userInfo.id_user,
        newJoin,
        total,
        0,
        userInfo.invite,
        0,
        timeNow,
      ]);
      await connection.execute(
        "UPDATE users SET money = money - ? WHERE token = ? ",
        [money * x, auth]
      );

      let TTm = Number(money * x);
      let tongC = Number(userInfo.tongcuoc);
      let TC = tongC - TTm < 0 ? 0 : tongC - TTm; //tong cuoc tru bet
      // console.log(""+ TTm + tongC + TC);
      await connection.execute(
        "UPDATE users SET tongcuoc = ? WHERE token = ? ",
        [TC, auth]
      );

      const [users] = await connection.query(
        "SELECT money, level, phone FROM users WHERE token = ? AND veri = 1  LIMIT 1",
        [auth]
      );
      await rosesPlus(auth, money * x);
      const [level] = await connection.query("SELECT * FROM level ");
      let level0 = level[0];
      const sql2 =
        "INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, f2 = ?, f3 = ?, f4 = ?, time = ?";

      let total_m = money * x;
      let f1 = (total_m / 100) * level0.f1;
      let f2 = (total_m / 100) * level0.f2;
      let f3 = (total_m / 100) * level0.f3;
      let f4 = (total_m / 100) * level0.f4;
      await connection.execute(sql2, [
        userInfo.phone,
        userInfo.code,
        userInfo.invite,
        f1,
        f2,
        f3,
        f4,
        timeNow,
      ]);
      const [idU] = await connection.query(
        "SELECT `id_user` FROM users WHERE phone = ? LIMIT 1 ",
        [users[0].ctv]
      );
      let ctv = idU.length > 0 ? idU[0].id_user : "0";
      // const [wingoall] = await connection.query(
      //   `SELECT id, phone, bet, money, fee, game FROM minutes_1 WHERE phone = ? AND status = 0 AND level = 0 ORDER BY id DESC LIMIT 1 `,
      //   [userInfo.phone]
      // );
      return res.status(200).json({
        message: "Đặt cược thành công",
        status: true,
        data: result,
        change: users[0].level,
        money: users[0].money,
        phone: users[0].phone,
        // bet: wingoall,
        ctv: ctv,
      });
    } else {
      return res.status(200).json({
        message: "Số tiền không đủ",
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const listOrderOld = async (req, res) => {
  let { typeid, pageno, pageto } = req.body;

  if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }
  if (pageno < 0 || pageto < 0) {
    return res.status(200).json({
      code: 0,
      msg: "Không còn dữ liệu",
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  let auth = req.cookies.auth;
  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
    [auth]
  );

  let game = "";
  if (typeid == 1) game = "sicbo1";
  if (typeid == 3) game = "sicbo3";
  if (typeid == 5) game = "sicbo5";
  if (typeid == 10) game = "sicbo10";

  const [sicbo] = await connection.query(
    `SELECT id, period, ketqua, game, date FROM taixiu WHERE thanhtoan != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto} `
  );
  const [sicboAll] = await connection.query(
    `SELECT * FROM taixiu WHERE thanhtoan != 0 AND game = '${game}' `
  );
  const [period] = await connection.query(
    `SELECT period FROM taixiu WHERE thanhtoan = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `
  );
  if (!sicbo[0]) {
    return res.status(200).json({
      code: 0,
      msg: "Không còn dữ liệu",
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  if (!pageno || !pageto || !user[0] || !sicbo[0] || !period[0]) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }
  let page = Math.ceil(sicboAll.length / 10);
  return res.status(200).json({
    code: 0,
    msg: "Nhận thành công",
    data: {
      gameslist: sicbo,
    },
    period: period[0].period,
    page: page,
    status: true,
  });
};

const GetMyEmerdList = async (req, res) => {
  let { typeid, pageno, pageto } = req.body;

  // if (!pageno || !pageto) {
  //     pageno = 0;
  //     pageto = 10;
  // }

  if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }

  if (pageno < 0 || pageto < 0) {
    return res.status(200).json({
      code: 0,
      msg: "Không còn dữ liệu",
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  let auth = req.cookies.auth;

  let game = "";
  if (typeid == 1) game = "wingo";
  if (typeid == 3) game = "wingo3";
  if (typeid == 5) game = "wingo5";
  if (typeid == 10) game = "wingo10";

  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ",
    [auth]
  );
  const [minutes_1] = await connection.query(
    `SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${
      Number(pageno) + "," + Number(pageto)
    }`,
    [user[0].phone]
  );
  const [minutes_1All] = await connection.query(
    `SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC `,
    [user[0].phone]
  );

  if (!minutes_1[0]) {
    return res.status(200).json({
      code: 0,
      msg: "Không còn dữ liệu",
      data: {
        gameslist: [],
      },
      status: false,
    });
  }
  if (!pageno || !pageto || !user[0] || !minutes_1[0]) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }
  let page = Math.ceil(minutes_1All.length / 10);

  let datas = minutes_1.map((data) => {
    let { id, phone, code, invite, level, game, ...others } = data;
    return others;
  });

  return res.status(200).json({
    code: 0,
    msg: "Nhận thành công",
    data: {
      gameslist: datas,
    },
    page: page,
    status: true,
  });
};

const addSicbo = async (game) => {
  try {
    let join = "";
    if (game == 1) join = "sicbo1";
    if (game == 3) join = "sicbo3";
    if (game == 5) join = "sicbo5";
    if (game == 10) join = "sicbo10";

    let dice1 = helpers.randomINT(1, 6);
    let dice2 = helpers.randomINT(1, 6);
    let dice3 = helpers.randomINT(1, 6);
    let insert1 = dice1 + "," + dice2 + "," + dice3;

    const [SicboNow] = await connection.query(
      `SELECT period FROM taixiu WHERE thanhtoan = 0 ORDER BY id DESC LIMIT 1`
    );

    let period = SicboNow[0].period;

    await connection.execute(
      "INSERT INTO taixiu SET period = ?, game = ?, ketqua = ?, date = ?",
      [Number(period) + 1, join, insert1, helpers.timerJoin()]
    );
  } catch (error) {
    console.log(error);
  }
};

const handlingWinGo1P = async (typeid) => {
  let game = "";
  if (typeid == 1) game = "wingo";
  if (typeid == 3) game = "wingo3";
  if (typeid == 5) game = "wingo5";
  if (typeid == 10) game = "wingo10";

  const [winGoNow] = await connection.query(
    `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `
  );

  // update ket qua
  await connection.execute(
    `UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = '${game}'`,
    [winGoNow[0].amount]
  );
  let result = Number(winGoNow[0].amount);
  switch (result) {
    case 0:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t" `,
        []
      );
      break;
    case 1:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1" `,
        []
      );
      break;
    case 2:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2" `,
        []
      );
      break;
    case 3:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3" `,
        []
      );
      break;
    case 4:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4" `,
        []
      );
      break;
    case 5:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t" `,
        []
      );
      break;
    case 6:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6" `,
        []
      );
      break;
    case 7:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7" `,
        []
      );
      break;
    case 8:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8" `,
        []
      );
      break;
    case 9:
      await connection.execute(
        `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9" `,
        []
      );
      break;
    default:
      break;
  }

  if (result < 5) {
    await connection.execute(
      `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "l" `,
      []
    );
  } else {
    await connection.execute(
      `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "n" `,
      []
    );
  }

  // lấy ra danh sách đặt cược chưa xử lý
  const [order] = await connection.execute(
    `SELECT * FROM minutes_1 WHERE status = 0 AND game = '${game}' `
  );
  for (let i = 0; i < order.length; i++) {
    let orders = order[i];
    let result = orders.result;
    let bet = orders.bet;
    let total = orders.money;
    let id = orders.id;
    let phone = orders.phone;
    var nhan_duoc = 0;

    if (bet == "l" || bet == "n") {
      nhan_duoc = total * 2;
    } else {
      if (result == 0 || result == 5) {
        if (bet == "d" || bet == "x") {
          nhan_duoc = total * 1.5;
        } else if (bet == "t") {
          nhan_duoc = total * 4.5;
        } else if (bet == "0" || bet == "5") {
          nhan_duoc = total * 9;
        }
      } else {
        if (result == 1 && bet == "1") {
          nhan_duoc = total * 9;
        } else {
          if (result == 1 && bet == "x") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 2 && bet == "2") {
          nhan_duoc = total * 9;
        } else {
          if (result == 2 && bet == "d") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 3 && bet == "3") {
          nhan_duoc = total * 9;
        } else {
          if (result == 3 && bet == "x") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 4 && bet == "4") {
          nhan_duoc = total * 9;
        } else {
          if (result == 4 && bet == "d") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 6 && bet == "6") {
          nhan_duoc = total * 9;
        } else {
          if (result == 6 && bet == "d") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 7 && bet == "7") {
          nhan_duoc = total * 9;
        } else {
          if (result == 7 && bet == "x") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 8 && bet == "8") {
          nhan_duoc = total * 9;
        } else {
          if (result == 8 && bet == "d") {
            nhan_duoc = total * 2;
          }
        }
        if (result == 9 && bet == "9") {
          nhan_duoc = total * 9;
        } else {
          if (result == 9 && bet == "x") {
            nhan_duoc = total * 2;
          }
        }
      }
    }
    const [users] = await connection.execute(
      "SELECT `money` FROM `users` WHERE `phone` = ?",
      [phone]
    );
    let totals = users[0].money + nhan_duoc;
    await connection.execute(
      "UPDATE `minutes_1` SET `get` = ?, `status` = 1 WHERE `id` = ? ",
      [nhan_duoc, id]
    );
    const sql = "UPDATE `users` SET `money` = ? WHERE `phone` = ? ";
    await connection.execute(sql, [totals, phone]);
  }
};

module.exports = {
  winGoPage,
  betSicbo,
  listOrderOld,
  GetMyEmerdList,
  handlingWinGo1P,
  addSicbo,
};
