socket.on("data-server-k3", function (msg) {
  if (msg) {
    let checkData = $("html").attr("data-dpr");
    if (checkData == msg.data.gameslist[0]?.game) {
      pageno = 0;
      limit = 10;
      page = 1;
      let notResult = msg.data[0];
      let Result = msg.data.gameslist[0];
      // console.log(msg);
      let check = $("#number_result").attr("data-select");
      if (check == "all") {
        reload_money();
        callListOrder();
        RenderResult(Result.result);
      } else if (check == "bd") {
        reload_money();
        callAjaxBD();
        RenderResult(Result.result);
      } else {
        reload_money();
        callAjaxMeJoin();
        RenderResult(Result.result);
      }

      $("#period").text(Number(notResult.period) - 1);
      $("#period-next").text(notResult.period);
      $("#previous").addClass("block-click");
      $("#previous").removeClass("action");
      $("#previous .van-icon-arrow").css("color", "#7f7f7f");
      $("#next").removeClass("block-click");
      $("#next").addClass("action");
      $("#next .van-icon-arrow").css("color", "#fff");
      showMeJoin();
    }
  }
});

function ShowListOrder(list_orders) {
  if (list_orders.length == 0) {
    return $(`#list_order`).html(
      `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">Không có dữ liệu</p>
            </div>
            `
    );
  }
  let htmls = "";
  let result = list_orders.map((list_orders) => {
    let total = String(list_orders.result).split("");
    let total2 = 0;
    for (let i = 0; i < total.length; i++) {
      total2 += Number(total[i]);
    }

    let html2 = "";
    for (let i = 0; i < total.length; i++) {
      html2 += `
                <div data-v-03b808c2="" class="li img${total[i]}"></div>
            `;
    }

    return (htmls += `
            <div data-v-03b808c2="" class="c-tc item van-row">
                <div data-v-03b808c2="" class="van-col van-col--6">
                    <div data-v-03b808c2="" class="c-tc goItem lh">...${String(
                      list_orders.period
                    ).slice(-8)}</div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh"> ${total2} </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${
                          total2 >= 3 && total2 <= 10 ? "Xỉu" : "Tài"
                        }</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${
                          total2 % 2 == 0 ? "Chẵn" : "Lẻ"
                        }</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="goItem c-row c-tc c-row-between c-row-middle">
                        ${html2}
                    </div>
                </div>
            </div>
        `);
  });
  $(`#list_order`).html(htmls);
}

function ShowBD(list_orders) {
  if (list_orders.length == 0) {
    return $(`#list_order`).html(
      `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">Không có dữ liệu</p>
            </div>
            `
    );
  }
  let htmls = "";
  let result = list_orders.map((list_orders) => {
    let total = String(list_orders.result).split("");
    let total2 = 0;
    for (let i = 0; i < total.length; i++) {
      total2 += Number(total[i]);
    }

    let html2 = "";
    let html3 = [
      '<div data-v-03b808c2="" class="numberLi"></div>',
      '<div data-v-03b808c2="" class="numberLi"></div>',
      '<div data-v-03b808c2="" class="numberLi"></div>',
      '<div data-v-03b808c2="" class="numberLi"></div>',
      '<div data-v-03b808c2="" class="numberLi"></div>',
      '<div data-v-03b808c2="" class="numberLi"></div>',
    ];
    let numb;
    let T = 1;
    for (let i = 0; i < total.length; i++) {
      html2 += `
                <div data-v-03b808c2="" class="li img${total[i]}"></div>
            `;
      let tti = total[i];
      if (numb == total[i]) {
        T++;
        html3[
          tti - 1
        ] = `<div data-v-03b808c2="" class="numberLi"><div data-v-03b808c2="" class="num">${T}</div><div data-v-03b808c2="" class="li img${total[i]}"></div></div>`;
      } else {
        html3[
          tti - 1
        ] = `<div data-v-03b808c2="" class="numberLi"><div data-v-03b808c2="" class="li img${total[i]}"></div></div>`;
      }

      numb = total[i];
    }
    let html4 = "";
    html3.map((item) => {
      html4 += item;
    });
    return (htmls += `
            <div data-v-03b808c2="" class="c-tc item van-row">
                <div data-v-03b808c2="" class="van-col van-col--6">
                    <div data-v-03b808c2="" class="c-tc goItem lh">...${String(
                      list_orders.period
                    ).slice(-8)}</div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="goItem c-row c-tc c-row-between c-row-middle">
                        ${html2}
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--3">
                    <div data-v-03b808c2="" class="c-tc goItem lh"> ${total2} </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--10">
                <div data-v-03b808c2="" class="goItem c-row c-tc c-row-between c-row-middle">
                    ${html4}
                </div>
                </div>
            </div>
        `);
  });
  $(`#list_order`).html(htmls);
}

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

function isNumber(params) {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
}

function GetMyEmerdList(list_orders) {
  if (list_orders.length == 0) {
    return $(`#list_order`).html(
      `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">Không có dữ liệu</p>
            </div>
            `
    );
  }
  let htmls = "";
  let result = list_orders.map((list_order) => {
    let arr = list_order.result.split("");
    let resultData = ``;
    let total = 0;

    for (let i = 0; i < arr.length; i++) {
      total += Number(arr[i]);
      resultData += `
          <div data-v-42f27458="" class="li circle-black">${arr[i]}</div>
        `;
    }

    let join = "";
    let arr2 = list_order.bet.split("");
    for (let i = 0; i < arr2.length; i++) {
      let check = isNumber(list_order.bet);
      if (check) {
        join += `
          <div data-v-42f27458="">
              <span data-v-42f27458="" style="color: rgb(0, 0, 0);">
                <span data-v-42f27458="" class="li circle-black" style="color: rgb(0, 0, 0);">${arr2[i]}</span>  
              </span>
          </div>`;
      } else {
        join += `
          <div data-v-42f27458="">
            <span data-v-42f27458="" style="color: rgb(0, 0, 0);">${
              arr2[i] == "c"
                ? "Chẵn"
                : arr2[i] == "l"
                ? "Lẻ"
                : arr2[i] == "b"
                ? "Lớn"
                : "Nhỏ"
            }</span>
          </div>
          `;
      }
    }
    return (htmls += `
            <div data-v-03b808c2="" class="lscuoc">
                <div data-v-03b808c2="" class="item c-row">
                    <div data-v-03b808c2="" class="c-row c-row-between c-row-middle info">
                        <div data-v-03b808c2="">
                            <div data-v-03b808c2="" class="issueName">
                                ${list_order.stage}
                                <!---->
                                <span data-v-03b808c2="" class="state ${
                                  list_order.status == 1 ? "green" : "red"
                                } ${list_order.status == 0 ? "d-none" : ""}">${
      list_order.status == 1 ? "Thành công" : "Thất bại"
    }</span>
                            </div>
                            <div data-v-03b808c2="" class="tiem">${timerJoin(
                              list_order.time
                            )}</div>
                        </div>
                        <div data-v-03b808c2="" class="money ${
                          list_order.status == 0 ? "d-none" : ""
                        }">
                            <!---->
                            <span data-v-03b808c2="" class="${
                              list_order.status == 1 ? "success" : "fail"
                            }"> ${list_order.status == 1 ? "+" : "-"} ${
      list_order.status == 1 ? list_order.get : list_order.price
    }.00</span>
                        </div>
                    </div>
                </div>
                <!---->
                <div data-v-42f27458="" class="details display-none">
    <div data-v-42f27458="" class="tit">Chi tiết</div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Mã đơn hàng</div>
        <div
            data-v-42f27458=""
            class="tag-read c-row c-row-between c-row-middle"
        >
            ${list_order.id_product}
            <img
                data-v-42f27458=""
                data-clipboard-text="${list_order.id_product}"
                width="18px"
                height="15px"
                src="/images/copy.png"
                class="m-l-5 copy-to-img"
            />
        </div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Kỳ xổ</div>
        <div data-v-42f27458="">${list_order.stage}</div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Số tiền mua</div>
        <div data-v-42f27458="">${list_order.money}.00</div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Số lượng mua</div>
        <div data-v-42f27458="">${list_order.amount}</div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Số tiền sau thuế</div>
        <div data-v-42f27458="" class="red">${list_order.price}.00</div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Thuế</div>
        <div data-v-42f27458="">${list_order.fee}.00</div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Giá mở cửa</div>
        <div
            data-v-42f27458=""
            style="display: ${list_order.status == 0 ? "none" : ""};"
        >
            ${list_order.result}
        </div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Kết quả</div>
        <div
            data-v-42f27458=""
            class="c-row"
            style="display: ${list_order.status == 0 ? "none" : ""};"
        >
            ${resultData}
        </div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Chọn</div>
        <div data-v-42f27458="" class="c-row c-row-middle">
            <div data-v-42f27458="" class="c-row m-r-5">
                <div data-v-42f27458="">
                    
                
                </div>
            </div>
            ${join}
        </div>
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Trang thái</div>
        <div
            data-v-42f27458=""
            class="${list_order.get > 0 ? "green" : "red"}"
            style="display: ${list_order.status == 0 ? "none" : ""};"
        >
            ${list_order.get > 0 ? "Thành công" : "Thất bại"}
        </div>
        <!---->
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Thắng thua</div>
        <div
            data-v-42f27458=""
            class="${list_order.get > 0 ? "green" : "red"}"
            style="display: ${list_order.status == 0 ? "none" : ""};"
        >
            ${list_order.get > 0 ? "+" : "-"} ${
      list_order.get > 0 ? list_order.get : list_order.price
    }.00
        </div>
        <!---->
    </div>
    <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
        <div data-v-42f27458="">Thời gian mua</div>
        <div data-v-42f27458="">${timerJoin(list_order.time)}</div>
    </div>
</div>

            </div>    
        `);
  });
  $(`#list_order`).html(htmls);
}

function callListOrder() {
  $.ajax({
    type: "POST",
    url: "/api/webapi/k3/GetNoaverageEmerdList",
    data: {
      gameJoin: $("html").attr("data-dpr"),
      pageno: "0",
      pageto: "1",
    },
    dataType: "json",
    success: function (response) {
      let list_orders = response.data.gameslist;
      RenderResult(list_orders[0].result);
      $("#period").text(Number(response.period) - 1);
      $("#period-next").text(response.period);
      $("#number_result").text("1/" + response.page);
      ShowListOrder(list_orders);
      $(".Loading").fadeOut(0);
    },
  });
}

$(function () {
  callListOrder();
});

function callAjaxMeJoin() {
  $.ajax({
    type: "POST",
    url: "/api/webapi/k3/GetMyEmerdList",
    data: {
      gameJoin: $("html").attr("data-dpr"),
      pageno: "0",
      pageto: "10",
    },
    dataType: "json",
    success: function (response) {
      let data = response.data.gameslist;
      $("#number_result").text("1/" + response.page);
      GetMyEmerdList(data);
      $(".Loading").fadeOut(0);
    },
  });
}

function callAjaxBD() {
  $.ajax({
    type: "POST",
    url: "/api/webapi/k3/GetNoaverageEmerdList",
    data: {
      gameJoin: $("html").attr("data-dpr"),
      pageno: "0",
      pageto: "10",
    },
    dataType: "json",
    success: function (response) {
      let data = response.data.gameslist;
      $("#number_result").text("1/" + response.page);
      ShowBD(data);
      $(".Loading").fadeOut(0);
    },
  });
}

async function showMeJoin() {
  await callAjaxMeJoin();
  setTimeout(() => {
    $(".lscuoc").click(function (e) {
      e.preventDefault();
      console.log(1);
      $(this).find(".details").toggleClass("display-none");
    });
    //
  }, 500);
}

$("#history").click(function (e) {
  e.preventDefault();
  // callListOrder();
  $(".header-history").removeClass("d-none");
  $(".header-bd").addClass("d-none");
  $(this).addClass("block-click action");
  $("#myBet").removeClass("block-click action");
  $("#bd-btn").removeClass("block-click action");
  $("#number_result").attr("data-select", "all");
  pageno = 0;
  limit = 10;
  page = 1;
  $("#next").removeClass("block-click");
  $("#next").addClass("action");
  $("#next .van-icon-arrow").css("color", "#fff");
  $("#previous").addClass("block-click");
  $("#previous").removeClass("action");
  $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
});

$("#myBet").click(function (e) {
  e.preventDefault();
  callAjaxMeJoin();
  $(".header-history").addClass("d-none");
  $(".header-bd").addClass("d-none");
  $(this).addClass("block-click action");
  $("#history").removeClass("block-click action");
  $("#bd-btn").removeClass("block-click action");
  $("#number_result").attr("data-select", "mybet");
  pageno = 0;
  limit = 10;
  page = 1;
  showMeJoin();
  $("#next").removeClass("block-click");
  $("#next").addClass("action");
  $("#next .van-icon-arrow").css("color", "#fff");
  $("#previous").addClass("block-click");
  $("#previous").removeClass("action");
  $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
});

$("#bd-btn").click(function (e) {
  e.preventDefault();
  callAjaxBD();
  $(".header-bd").removeClass("d-none");
  $(".header-history").addClass("d-none");
  $(this).addClass("block-click action");
  $("#history").removeClass("block-click action");
  $("#myBet").removeClass("block-click action");
  $("#number_result").attr("data-select", "bd");
  pageno = 0;
  limit = 10;
  page = 1;
  $("#next").removeClass("block-click");
  $("#next").addClass("action");
  $("#next .van-icon-arrow").css("color", "#fff");
  $("#previous").addClass("block-click");
  $("#previous").removeClass("action");
  $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
});

var pageno = 0;
var limit = 10;
var page = 1;
$("#next").click(function (e) {
  e.preventDefault();
  let check = $("#number_result").attr("data-select");
  $(".Loading").fadeIn(0);
  $("#previous").removeClass("block-click");
  $("#previous").addClass("action");
  $("#previous .van-icon-arrow-left").css("color", "#fff");
  pageno += 10;
  let pageto = limit;
  let url = "";
  if (check == "all") {
    url = "/api/webapi/k3/GetNoaverageEmerdList";
  } else if (check == "bd") {
    url = "/api/webapi/k3/GetNoaverageEmerdList";
  } else {
    url = "/api/webapi/k3/GetMyEmerdList";
  }
  $.ajax({
    type: "POST",
    url: url,
    data: {
      gameJoin: $("html").attr("data-dpr"),
      pageno: pageno,
      pageto: pageto,
    },
    dataType: "json",
    success: async function (response) {
      $(".Loading").fadeOut(0);
      if (response.status === false) {
        pageno -= 10;
        $("#next").addClass("block-click");
        $("#next").removeClass("action");
        $("#next .van-icon-arrow").css("color", "#7f7f7f");
        alertMess(response.msg);
        return false;
      }
      let list_orders = response.data.gameslist;
      $("#period").text(Number(response.period) - 1);
      $("#period-next").text(response.period);
      $("#number_result").text(++page + "/" + response.page);
      if (check == "all") {
        ShowListOrder(list_orders);
      } else if (check == "bd") {
        ShowBD(list_orders);
      } else {
        await GetMyEmerdList(list_orders);
        setTimeout(() => {
          $(".lscuoc").click(function (e) {
            e.preventDefault();
            console.log(1);
            $(this).find(".details").toggleClass("display-none");
          });
          //
        }, 500);
      }
    },
  });
});
$("#previous").click(function (e) {
  e.preventDefault();
  let check = $("#number_result").attr("data-select");
  $(".Loading").fadeIn(0);
  $("#next").removeClass("block-click");
  $("#next").addClass("action");
  $("#next .van-icon-arrow").css("color", "#fff");
  pageno -= 10;
  let pageto = limit;
  let url = "";
  if (check == "all" || check == "bd") {
    url = "/api/webapi/k3/GetNoaverageEmerdList";
  } else {
    url = "/api/webapi/k3/GetMyEmerdList";
  }
  $.ajax({
    type: "POST",
    url: url,
    data: {
      gameJoin: $("html").attr("data-dpr"),
      pageno: pageno,
      pageto: pageto,
    },
    dataType: "json",
    success: async function (response) {
      $(".Loading").fadeOut(0);
      if (page - 1 < 2) {
        $("#previous").addClass("block-click");
        $("#previous").removeClass("action");
        $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
      }
      if (response.status === false) {
        pageno = 0;
        $("#previous .arr:eq(0)").addClass("block-click");
        $("#previous .arr:eq(0)").removeClass("action");
        $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
        alertMess(response.msg);
        return false;
      }
      let list_orders = response.data.gameslist;
      $("#period").text(Number(response.period) - 1);
      $("#period-next").text(response.period);
      $("#number_result").text(--page + "/" + response.page);
      if (check == "all") {
        ShowListOrder(list_orders);
      } else if (check == "bd") {
        ShowBD(list_orders);
      } else {
        await GetMyEmerdList(list_orders);
        setTimeout(() => {
          $(".lscuoc").click(function (e) {
            e.preventDefault();
            console.log(1);
            $(this).find(".details").toggleClass("display-none");
          });
          //
        }, 500);
      }
    },
  });
});
