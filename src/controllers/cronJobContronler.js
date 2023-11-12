import connection from "../config/connectDB";
import winGoController from "./winGoController";
import k5Controller from "./k5Controller";
import k3Controller from "./k3Controller";
import getHistory from "./APIcontroller/getHistory";
import xsmbController from "./xsmbController";
import sicboController from "./sicboController";
import cron from "node-cron";

const cronJobGame1p = io => {
  cron.schedule("*/1 * * * *", async () => {
    // await Promise.all([
    //   winGoController.addWinGo(1),
    //   winGoController.handlingWinGo1P(1),
    //   k5Controller.add5D(1),
    //   k5Controller.handling5D(1),
    //   k3Controller.addK3(1),
    //   k3Controller.handlingK3(1),
    // ]);
    // await winGoController.addWinGo(1);
    // await winGoController.handlingWinGo1P(1);
    // const [winGo1] = await connection.execute(
    //   'SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2 ',
    //   [],
    // );
    // const data = winGo1; // Cầu mới chưa có kết quả
    // io.emit("data-server", { data: data });

    // await k5Controller.add5D(1);
    // await k5Controller.handling5D(1);
    // const [k5D] = await connection.execute(
    //   "SELECT * FROM 5d WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ",
    //   [],
    // );
    // const data2 = k5D; // Cầu mới chưa có kết quả
    // io.emit("data-server-5d", { data: data2, game: "1" });
    await k3Controller.addK3(1);
    await k3Controller.handlingK3(1);
    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "1" });

    // await sicboController.addSicbo(1);
    // const [sicbo1] = await connection.execute(
    //   "SELECT id, period, ketqua, game, date FROM `taixiu` ORDER BY `id` DESC LIMIT 2",
    //   []
    // );
    // const data4 = sicbo1;
    // io.emit("data-server-sicbo", { data: data4 });

    //Lịch sử cược
    await getHistory.cronBetHistory();
  });

  cron.schedule("30 * * * * *", function () {
    getHistory.cronMarkHisttory();
  });

  cron.schedule("*/3 * * * *", async () => {
    // await winGoController.addWinGo(3);
    // await winGoController.handlingWinGo1P(3);
    // const [winGo1] = await connection.execute(
    //   'SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2 ',
    //   [],
    // );
    // const data = winGo1; // Cầu mới chưa có kết quả
    // io.emit("data-server", { data: data });

    // await k5Controller.add5D(3);
    // await k5Controller.handling5D(3);
    // const [k5D] = await connection.execute(
    //   "SELECT * FROM 5d WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ",
    //   [],
    // );
    // const data2 = k5D; // Cầu mới chưa có kết quả
    // io.emit("data-server-5d", { data: data2, game: "3" });

    await k3Controller.addK3(3);
    await k3Controller.handlingK3(3);
    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "3" });
  });
  cron.schedule("*/5 * * * *", async () => {
    // await winGoController.addWinGo(5);
    // await winGoController.handlingWinGo1P(5);
    // const [winGo1] = await connection.execute(
    //   'SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2 ',
    //   [],
    // );
    // const data = winGo1; // Cầu mới chưa có kết quả
    // io.emit("data-server", { data: data });

    // await k5Controller.add5D(5);
    // await k5Controller.handling5D(5);
    // const [k5D] = await connection.execute(
    //   "SELECT * FROM 5d WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ",
    //   [],
    // );
    // const data2 = k5D; // Cầu mới chưa có kết quả
    // io.emit("data-server-5d", { data: data2, game: "5" });

    await k3Controller.addK3(5);
    await k3Controller.handlingK3(5);
    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả

    io.emit("data-server-k3", { data: data3, game: "5" });
  });
  cron.schedule("*/10 * * * *", async () => {
    // await winGoController.addWinGo(10);
    // await winGoController.handlingWinGo1P(10);
    // const [winGo1] = await connection.execute(
    //   'SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2 ',
    //   [],
    // );
    // const data = winGo1; // Cầu mới chưa có kết quả
    // io.emit("data-server", { data: data });

    // await k5Controller.add5D(10);
    // await k5Controller.handling5D(10);
    // const [k5D] = await connection.execute(
    //   "SELECT * FROM 5d WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ",
    //   [],
    // );
    // const data2 = k5D; // Cầu mới chưa có kết quả
    // io.emit("data-server-5d", { data: data2, game: "10" });

    await k3Controller.addK3(10);
    await k3Controller.handlingK3(10);
    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "10" });
  });

  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(201),
      await k3Controller.handlingK3(201),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 201 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "201" });
  });
  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(202),
      await k3Controller.handlingK3(202),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 202 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "202" });
  });
  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(203),
      await k3Controller.handlingK3(203),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 203 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "203" });
  });
  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(204),
      await k3Controller.handlingK3(204),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 204 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "204" });
  });
  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(205),
      await k3Controller.handlingK3(205),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 205 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "205" });
  });

  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(206),
      await k3Controller.handlingK3(206),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 206 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "206" });
  });
  cron.schedule("*/20 * * * *", async () => {
    Promise.all([
      await k3Controller.addK3(207),
      await k3Controller.handlingK3(207),
    ]);

    const [k3] = await connection.execute(
      "SELECT * FROM k3 WHERE `game` = 207 ORDER BY `id` DESC LIMIT 2 ",
      [],
    );
    const data3 = k3; // Cầu mới chưa có kết quả
    io.emit("data-server-k3", { data: data3, game: "207" });
  });

  cron.schedule("* * 0 * * *", async () => {
    await connection.execute("UPDATE users SET roses_today = ?", [0]);
    await connection.execute("UPDATE point_list SET money = ?", [0]);
  });

  cron.schedule("40 18 * * *", async () => {
    await xsmbController.CronKQ();
  });

  cron.schedule("45 18 * * *", async () => {
    await xsmbController.trathuong();
  });
};

module.exports = {
  cronJobGame1p,
};
