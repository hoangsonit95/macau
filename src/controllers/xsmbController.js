import connection from "../config/connectDB";
var request = require("request");
var cheerio = require("cheerio");
require("dotenv").config();

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

function formateT(params) {
  let result = params < 10 ? "0" + params : params;
  return result;
}

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
}

function timerJoinxs(params) {
  let date = new Date();
  if (params) {
    date = date.setDate(date.getDate() - 1);
  } else {
    date = new Date();
  }
  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());
  return days + "-" + months + "-" + years;
}
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

const checkSo = async (soArr, type) => {
  if (soArr.length > 10) {
    return {
      message: "Chọn tối đa 10 số!",
      status: false,
    };
  }
  switch (type) {
    case "xien2":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }
      if (soArr.length != 2) {
        return {
          message: "Chọn 2 số!",
          status: false,
        };
      }
      break;
    case "xien3":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }
      if (soArr.length != 3) {
        return {
          message: "Chọn 3 số!",
          status: false,
        };
      }
      break;
    case "xien4":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }
      if (soArr.length != 4) {
        return {
          message: "Chọn 4 số!",
          status: false,
        };
      }
      break;
    case "lo2":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }

      break;
    case "de":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }

      break;
    case "daude":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 2) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }

      break;
    case "dau":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 1) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }

      break;
    case "duoi":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 1) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }

      break;
    case "3cang":
      soArr = soArr.map(function (obj) {
        obj = obj.trim();
        if (obj.length === 3) {
          return obj;
        }
        return void 0;
      });
      soArr = soArr.filter(function (obj) {
        return obj !== void 0;
      });
      if (soArr.length === 0) {
        return {
          message: "Số chọn không hợp lệ!",
          status: false,
        };
      }
      break;
  }
  return { status: true };
};

const cuoc = async (req, res) => {
  try {
    let banDate = new Date();
    banDate.setHours(18, 0, 0, 0);
    let timeCL = banDate - new Date();
    // console.log(timeCL);
    if (timeCL < 0) {
      //check time dat cuoc cho phep
      return res.status(200).json({
        message: "Hết thời gian đặt cược!",
        status: false,
      });
    }
    let { type, so, money } = req.body;
    if (!type || !so || !money) {
      //check null
      return res.status(200).json({
        message: "Hãy nhập đầy đủ thông tin!",
        status: false,
      });
    }

    let auth = req.cookies.auth;
    const [user] = await connection.query(
      "SELECT `phone`, `code`, `invite`, `level`, `money`, `tongcuoc` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
      [auth]
    );

    let userInfo = user[0];

    let total = 0;
    let soArr = so.split(",");
    let checkso = await checkSo(soArr, type);
    if (checkso.status === false) {
      return res.status(200).json(checkso);
    }
    total = soArr.length * money;

    let check = userInfo.money - total;
    if (check >= 0) {
      let timeNow = Date.now();

      await connection.execute(
        "UPDATE `users` SET `money` = `money` - ? WHERE `token` = ? ",
        [total, auth]
      );
      await connection.execute(
        "INSERT INTO `xsmb_cuoc` SET `phone` = ?, ref = ?, date = ?, type = ?, so = ?, amount = ?, cuoc = ?, time = ?",
        [
          userInfo.phone,
          userInfo.invite,
          timerJoinxs(),
          type,
          JSON.stringify(soArr),
          money,
          total,
          Date.now(),
        ]
      );

      let tongC = userInfo.tongcuoc;
      let TC = tongC - total < 0 ? 0 : tongC - total; //tong cuoc tru bet
      await connection.execute(
        "UPDATE `users` SET `tongcuoc` = ? WHERE `token` = ? ",
        [TC, auth]
      );

      const [users] = await connection.query(
        "SELECT `money`, `level`, `phone`, `ctv` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
        [auth]
      );
      await rosesPlus(auth, total);
      const [level] = await connection.query("SELECT * FROM level ");
      const [idU] = await connection.execute(
        "SELECT `id_user` FROM users WHERE phone = ? LIMIT 1",
        [users[0].ctv]
      );
      const ctv = idU.length > 0 ? idU[0].id_user : "0";
      let level0 = level[0];
      const sql2 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,time = ?`;
      let total_m = total;
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
      return res.status(200).json({
        message: "Đặt cược thành công",
        status: true,
        // data: result,
        change: users[0].level,
        money: users[0].money,
        phone: users[0].phone,
        ctv: ctv,
      });
    } else {
      return res.status(200).json({
        message: "Số tiền không đủ",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ status: false, message: "Lỗi bất ngờ" });
  }
};

const CronKQ = async () => {
  try {
    let today = timerJoinxs();
    // let today = '14-04-2023';
    let [check] = await connection.execute(
      "SELECT * FROM xsmb WHERE date = ?",
      [today]
    );
    if (check.length > 0) {
      console.log("da cap nhat roi");
      return;
    }
    let url = "https://xskt.com.vn/xsmb/ngay-" + today;
    // console.log('url= ' + url);
    request(url, async (error, response, html) => {
      if (!error) {
        var $ = cheerio.load(html, { decodeEntities: false });

        var data1 = $(".result");
        var listDai = data1.find("tr").eq(1);
        // giải đặc biệt
        var giaiDB = listDai.find("td").eq(1).text();
        console.log("giải đặc biệt=" + giaiDB);

        // giải nhất
        var listgiainhat = data1.find("tr").eq(2);
        var giainhat = listgiainhat.find("td").eq(1).text();
        console.log("giải nhất=" + giainhat);
        // giải nhì
        var listgiainhi = data1.find("tr").eq(3);
        var giainhi2 = listgiainhi.find("td").eq(1).text().split(" ");
        console.log("giải nhi=" + giainhi2);

        // giải 3
        var listgiai3 = data1.find("tr").eq(4);
        var giau3 = listgiai3.find("td").eq(1).text();
        var giai3plist = (
          giau3.substring(0, 17) +
          " " +
          giau3.substring(17)
        ).split(" ");

        console.log("giải 3=" + giai3plist);

        // giải 4
        var listgiai4 = data1.find("tr").eq(6);
        var giau4 = listgiai4.find("td").eq(1).text().split(" ");
        console.log("giải 4=" + giau4);
        // giải 5

        var listgiai5 = data1.find("tr").eq(7);
        var giau5 = listgiai5.find("td").eq(1).text();
        var giai5plist = (
          giau5.substring(0, 14) +
          " " +
          giau5.substring(14)
        ).split(" ");
        console.log("giải 5=" + giai5plist);

        // giải 6

        var listgiai6 = data1.find("tr").eq(9);
        var giau6 = listgiai6.find("td").eq(1).text().split(" ");

        console.log("giải 6=" + giau6);

        // giải 7

        var listgia7 = data1.find("tr").eq(10);
        var giau7 = listgia7.find("td").eq(1).text().split(" ");

        console.log("giải 7=" + giau7);
        console.log("today " + today);
        await connection.execute(
          "INSERT INTO xsmb SET date = ?, gdb = ?, g1 = ?, g2 = ?, g3 = ?, g4 = ?, g5 = ?, g6 = ?, g7 = ?",
          [
            today,
            giaiDB,
            giainhat,
            JSON.stringify(giainhi2),
            JSON.stringify(giai3plist),
            JSON.stringify(giau4),
            JSON.stringify(giai5plist),
            JSON.stringify(giau6),
            JSON.stringify(giau7),
          ]
        );
      }
    });
  } catch (error) {
    if (error) {
      console.log("loi lay ket qua xs: ", error);
    }
  }
};

const trathuong = async () => {
  try {
    let today = timerJoinxs();
    // let today = '07-04-2023';
    let [check] = await connection.execute(
      "SELECT * FROM xsmb WHERE date = ? AND pay = 0",
      [today]
    );
    if (check.length === 0) {
      console.log("Khong co du lieu tra thuong");
      return;
    }
    var data = check[0];
    data.g2 = JSON.parse(data.g2);
    data.g3 = JSON.parse(data.g3);
    data.g4 = JSON.parse(data.g4);
    data.g5 = JSON.parse(data.g5);
    data.g6 = JSON.parse(data.g6);
    data.g7 = JSON.parse(data.g7);
    console.log(data);
    let lo2so = [
      data.g1.substring(data.g1.length - 2),
      data.gdb.substring(data.gdb.length - 2),
      ...data.g2.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
      ...data.g3.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
      ...data.g4.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
      ...data.g5.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
      ...data.g6.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
      ...data.g7.map(function (obj) {
        return obj.substring(obj.length - 2);
      }),
    ];
    lo2so = lo2so.filter(function (obj) {
      return obj !== "";
    });
    if (lo2so.length !== 27) {
      console.log("Thieu cac giai, khong the tra thuong");
      return;
    }
    let de = data.gdb.substring(data.gdb.length - 2);
    let daude = data.gdb.substring(0, 2);
    let cang3 = data.gdb.substring(data.gdb.length - 3);
    let dau = data.gdb.charAt();
    let duoi = data.gdb.charAt(data.gdb.length - 1);

    let lo2soNot2 = [...new Set(lo2so)]; // loại bỏ trùng nặp lô 2 số
    let tongCuoc = 0;
    let tongTra = 0;
    let [listCuoc] = await connection.execute(
      "SELECT * FROM xsmb_cuoc WHERE date = ? AND thanhtoan = 0",
      [today]
    );
    if (listCuoc.length === 0) {
      console.log("Khong co nguoi choi cuoc xo so, dung tra thuong");
      return;
    }
    const [[rate]] = await connection.execute("SELECT * FROM xsmb_rate"); // lay ra ti le
    await Promise.all(
      listCuoc.map(async (objC) => {
        tongCuoc += objC.cuoc * 1;
        let diem = objC.amount;
        let win = 0;
        let trung = 0;
        objC.so = JSON.parse(objC.so);

        switch (objC.type) {
          case "lo2":
            // 'Lô 2 Số'
            objC.so.forEach(function (so) {
              lo2so.forEach(function (item) {
                if (so === item) {
                  win += diem * rate.lo2;
                }
              });
            });
            break;
          case "xien2":
            // 'Xiên 2'
            trung = 0;
            objC.so.forEach(function (so) {
              lo2soNot2.forEach(function (item) {
                if (so === item) {
                  trung++;
                }
              });
            });
            if (trung === 2) {
              win += diem * rate.xien2;
            }
            break;
          case "xien3":
            // 'Xiên 3'
            trung = 0;
            objC.so.forEach(function (so) {
              lo2soNot2.forEach(function (item) {
                if (so === item) {
                  trung++;
                }
              });
            });
            if (trung === 3) {
              win += diem * rate.xien3;
            }
            break;
          case "xien4":
            // 'Xiên 4'
            trung = 0;
            objC.so.forEach(function (so) {
              lo2soNot2.forEach(function (item) {
                if (so === item) {
                  trung++;
                }
              });
            });
            if (trung === 4) {
              win += diem * rate.xien4;
            }
            break;
          case "de":
            // 'Đề'
            objC.so.forEach(function (so) {
              if (so === de) {
                win += diem * rate.de;
              }
            });
            break;
          case "daude":
            // 'Đầu Đề'
            objC.so.forEach(function (so) {
              if (so === daude) {
                win += diem * rate.daude;
              }
            });
            break;
          case "3cang":
            // '3 Càng'
            objC.so.forEach(function (so) {
              if (so === cang3) {
                win += diem * rate["3cang"];
              }
            });
            break;
          case "dau":
            // 'Đầu'
            objC.so.forEach(function (so) {
              if (so === dau) {
                win += diem * rate.dau;
              }
            });
            break;
          case "duoi":
            // 'Đuôi'
            objC.so.forEach(function (so) {
              if (so === duoi) {
                win += diem * rate.duoi;
              }
            });
            break;
        }
        if (win > 0) {
          tongTra += win;
          objC.win = win;
          await connection.execute(
            "UPDATE users SET money = money + ? WHERE phone = ?",
            [win, objC.phone]
          );
        }
        await connection.execute(
          "UPDATE xsmb_cuoc SET thanhtoan = 1, win = ? WHERE id = ?",
          [win, objC.id]
        );
      })
    );

    await connection.execute(
      "UPDATE xsmb SET pay = 1, cuoc = ?, tra = ? WHERE date = ?",
      [tongCuoc, tongTra, today]
    );
    console.log("Tra thuong thanh cong");
    console.log("Tong cuoc: ", tongCuoc);
    console.log("Tong tra: ", tongTra);
    console.log("Ngay: ", today);
  } catch (error) {
    console.log(error);
  }
};

const xsmb_page = async (req, res) => {
  return res.render("bet/xsmb/index.ejs", { title: "XSMB" });
};

const betHistory = async (req, res) => {
  let auth = req.cookies.auth;
  let { page } = req.body;
  let [list] = await connection.execute(
    "SELECT xc.* FROM xsmb_cuoc AS xc LEFT JOIN users AS u ON u.phone = xc.phone WHERE token = ? ORDER BY id DESC LIMIT ? OFFSET ?",
    [auth, 10, page * 10 - 10]
  );
  let [[rate]] = await connection.execute("SELECT * FROM xsmb_rate");
  list = list.map((item) => {
    item.so = JSON.parse(item.so).toString();
    item.rate = rate[item.type];
    item.type =
      item.type === "de"
        ? "Đề"
        : item.type === "lo2"
        ? "LÔ"
        : item.type === "xien2"
        ? "Xiên 2"
        : item.type === "xien3"
        ? "Xiên 3"
        : item.type === "xien4"
        ? "Xiên 4"
        : item.type === "daude"
        ? "Đầu đề"
        : item.type === "3cang"
        ? "3 càng"
        : item.type === "dau"
        ? "Đầu"
        : "Đuôi";
    return item;
  });
  let [[{ totalPage }]] = await connection.execute(
    "SELECT COUNT(*) AS totalPage FROM xsmb_cuoc AS xc LEFT JOIN users AS u ON u.phone = xc.phone WHERE token = ?",
    [auth]
  );
  totalPage = Math.ceil(totalPage / 10);
  return res.json({ list, page, totalPage });
};

const history = async (req, res) => {
  let { date } = req.body;
  let [list] = await connection.execute("SELECT * FROM xsmb WHERE date = ?", [
    date,
  ]);
  if (list.length !== 0) {
    [list] = list;
    list.g2 = JSON.parse(list.g2);
    list.g3 = JSON.parse(list.g3);
    list.g4 = JSON.parse(list.g4);
    list.g5 = JSON.parse(list.g5);
    list.g6 = JSON.parse(list.g6);
    list.g7 = JSON.parse(list.g7);
  }
  return res.json(list);
};

module.exports = {
  xsmb_page,
  CronKQ,
  cuoc,
  trathuong,
  betHistory,
  history,
};
