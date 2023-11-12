const socket = io();

$(window).on("load", function () {
  setTimeout(() => {
    $("#preloader").fadeOut(0);
  }, 100);
});
$(document).ready(function () {
  $(`a[href="${window.location.pathname}"]`).addClass("active");
  $(`a[href="${window.location.pathname}"]`).css("pointerEvents", "none");
});

$(".back-to-tops").click(function () {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    800
  );
  return false;
});

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

function formatMoney(money) {
  return String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function cownDownTimer() {
  var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
  setInterval(function () {
    let checkID = $("html").attr("data-change");
    if (checkID?.length == 3) checkID = 20;
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var minute = Math.ceil(minutes % Number(checkID));
    var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
    var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
    if (checkID != 1) {
      $(".time .time-sub:eq(1)").text(minute);
    }

    $(".time .time-sub:eq(2)").text(seconds1);
    $(".time .time-sub:eq(3)").text(seconds2);
  }, 0);
}

cownDownTimer();

// -------------------------------------------------------------------------------------

function showListOrder(datas) {
  let html = "";

  datas.map((data) => {
    let list_kq = "";
    let total = 0;
    String(data.result)
      .split("")
      .forEach((e) => {
        total += Number(e);
        list_kq += `<span data-v-a9660e98="" class="red box-xs"> ${e} </span>`;
      });
    html += `
        <div data-v-a9660e98="" class="c-tc item van-row">
            <div data-v-a9660e98="" class="van-col van-col--8">
                <div data-v-a9660e98="" class="c-tc goItem">${data.period}</div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5">
                <div data-v-a9660e98="" class="c-tc goItem" style="display: flex;justify-content: center;">
                    <!---->
                    ${list_kq}
                    <span data-v-a9660e98="" class="red box-xs"> = </span>
                    <span data-v-a9660e98="" class="red box-xs" style="font-size: 14px"> ${total} </span>
                </div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5">
                <div data-v-a9660e98="" class="c-tc goItem">
                    <span data-v-a9660e98=""> ${
                      total >= 3 && total <= 10 ? "Nhỏ" : "Lớn"
                    } </span>
                </div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5">
                <div data-v-a9660e98="" class="c-tc goItem">
                    <span data-v-a9660e98=""> ${
                      total % 2 == 0 ? "Chẵn" : "Lẻ"
                    } </span>
                </div>
            </div>
        </div>
        `;
  });
  $("#list-orders").html(html);
}

function alertMess(text, sic) {
  $("body").append(
    `
    <div data-v-1dcba851="" class="msg" style="position: fixed; top: 0; left:0; width: 100%; height: 100dvh; z-index: 1000000; display: flex; justify-content: center; align-items: center;">
        <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style="text-color:white; background: rgb(0,0,0,0.9); padding: 4px 8px"> ${text} </div>
    </div>
    `
  );
  setTimeout(() => {
    $(".msg .msg-content").removeClass("v-enter-active v-enter-to");
    $(".msg .msg-content").addClass("v-leave-active v-leave-to");
    setTimeout(() => {
      $(".msg").remove();
    }, 100);
  }, 1000);
}

function messNewJoin2(datas) {
  let result = "";

  datas.map((data) => {
    let list_join = data.bet.split(""); // là người dùng tham gia đặt cược
    let list_join2 = data.bet; // là người dùng tham gia đặt cược
    let x = data.amount; // là người dùng tham gia đặt cược

    let total_money = Number(data.money) * Number(x) * list_join.length;
    let money = formatMoney(total_money, ",");

    result += `
        <div class="direct-chat-infos clearfix mt-2">
            <span class="direct-chat-name float-left"></span>
        </div>
        <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
        <div class="direct-chat-text" style="background-color: #1eb93d">User: ${
          data.phone
        } -> Tham gia <input type="text" ${
      data.typeGame !== "total" ? "disabled" : ""
    } style="background-color: #1eb93d; width:55px; border: 1px solid white" value=${
      isNumber(list_join2)
        ? list_join2
        : list_join2 == "b"
        ? "Lớn"
        : list_join2 == "s"
        ? "Nhỏ"
        : list_join2 == "c"
        ? "Chẵn"
        : list_join2 == "l"
        ? "Lẻ"
        : list_join2
    } id="${data.id}-bet" /> ${money} <button id="${
      data.id
    }-submit" class="submit_bet" style="background: blue; color:white; padding: 4px">Thay đổi</button></div>
        `;
  });
  $(".direct-chat-msg").html(result);
  $(".direct-chat-warning .direct-chat-messages").animate(
    {
      scrollTop: $(".direct-chat-msg").prop("scrollHeight"),
    },
    750
  );
  $(".submit_bet").click(function () {
    let id = $(this).attr("id").split("-")[0];
    let bet = $(`#${id}-bet`).val();
    let type = "k3";
    $.ajax({
      type: "POST",
      url: "/api/webapi/admin/change/bet",
      data: {
        id,
        bet,
        type,
      },
      dataType: "json",
      success: function (res) {
        let { status, msg } = res;
        alertMess(msg);
      },
    });
  });
}

function messNewJoin3(datas) {
  datas.map((data) => {
    let typeGame = data.typeGame;
    if (typeGame == "total") {
      let game = 0;
      for (let i = 0; i < data.length; i++) {
        game += datas[i].money;
      }
      $(`#total`).attr("totalMoney", data.price);
      $(`#total`).text(data.price);
    }
  });
}

function callListOrder() {
  let game = $("html").attr("data-change");
  $.ajax({
    type: "POST",
    url: "/api/webapi/admin/k3/listOrders",
    data: {
      gameJoin: game,
    },
    dataType: "json",
    success: function (response) {
      showListOrder(response.data.gameslist);
      messNewJoin2(response.bet);
      messNewJoin3(response.bet);
      let settings = response.settings[0];
      if (game == 1)
        $("#ketQua").text(
          "kết quả tiếp theo: " +
            `${settings.k5d == "-1" ? "Random" : settings.k5d}`
        );
      if (game == 3)
        $("#ketQua").text(
          "kết quả tiếp theo: " +
            `${settings.k5d3 == "-1" ? "Random" : settings.k5d3}`
        );
      if (game == 5)
        $("#ketQua").text(
          "kết quả tiếp theo: " +
            `${settings.k5d5 == "-1" ? "Random" : settings.k5d5}`
        );
      if (game == 10)
        $("#ketQua").text(
          "kết quả tiếp theo: " +
            `${settings.k5d10 == "-1" ? "Random" : settings.k5d10}`
        );
      $(".reservation-chunk-sub-num").text(response.period);
      $("#preloader").fadeOut(0);
    },
  });
}
callListOrder();
socket.on("data-server-k3", function (msg) {
  if (msg) {
    callListOrder();
    $(".direct-chat-msg").html("");
  }
});

function messNewJoin(data) {
  let game = $("html").attr("data-change");
  if (game != data.game) return;
  let list_join = data.bet.split(""); // là người dùng tham gia đặt cược
  let list_join2 = data.bet; // là người dùng tham gia đặt cược
  let x = data.amount; // là người dùng tham gia đặt cược

  let total_money = Number(data.money) * Number(x) * list_join.length;
  let money = formatMoney(total_money, ",");

  let result = "";
  result += `
    <div class="direct-chat-infos clearfix mt-2">
    <span class="direct-chat-name float-left"></span>
</div>
<img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
<div class="direct-chat-text" style="background-color: #1eb93d">User: ${
    data.phone
  } -> Tham gia <input type="text" ${
    data.typeGame !== "total" ? "disabled" : ""
  } style="background-color: #1eb93d; width:55px; border: 1px solid white" value=${
    isNumber(list_join2)
      ? list_join2
      : list_join2 == "b"
      ? "Lớn"
      : list_join2 == "s"
      ? "Nhỏ"
      : list_join2 == "c"
      ? "Chẵn"
      : list_join2 == "l"
      ? "Lẻ"
      : list_join2
  } id="${data.id}-bet" /> ${money} <button id="${
    data.id
  }-submit" class="submit_bet" style="background: blue; color:white; padding: 4px">Thay đổi</button></div>
        `;
  $(".direct-chat-msg").append(result);
  $(".direct-chat-warning .direct-chat-messages").animate(
    {
      scrollTop: $(".direct-chat-msg").prop("scrollHeight"),
    },
    750
  );
  $(".submit_bet").click(function () {
    let id = $(this).attr("id").split("-")[0];
    let bet = $(`#${id}-bet`).val();
    let type = "k3";
    $.ajax({
      type: "POST",
      url: "/api/webapi/admin/change/bet",
      data: {
        id,
        bet,
        type,
      },
      dataType: "json",
      success: function (res) {
        let { status, msg } = res;
        alertMess(msg);
      },
    });
  });
}

function messNewJoin5(data) {
  console.log("newjohn5" + JSON.stringify(data));
  let game = $("html").attr("data-change");
  if (data.chane == 1) return;
  if (data.game != game) return;

  let bet = data.listJoin.split(""); // là người dùng tham gia đặt cược

  for (let i = 0; i < bet.length; i++) {
    let money = Number(data.money);
    let totalM = Number($(`#${bet[i]}`).attr("totalMoney"));
    $(`#${bet[i]}`).attr("totalMoney", totalM + money);
    $(`#${bet[i]}`).text(totalM + money);
  }
}

socket.on("data-server-3", function (msg) {
  console.log(msg);
  messNewJoin(msg.bet[0]);
  messNewJoin5(msg);
});

$("#manage .col-12").click(async function (e) {
  e.preventDefault();
  $("#preloader").fadeIn(0);
  let game = $(this).attr("data");
  $("html").attr("data-change", game);
  await callListOrder();
  $("#manage .col-12").removeClass("block-click");
  $(this).addClass("block-click");
  $("#manage .col-12").find(".info-box-content").removeClass("active-game");
  $(this).find(".info-box-content").addClass("active-game");
});
