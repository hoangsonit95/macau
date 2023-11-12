// function showListOrder3(list_orders, x) {
//     if (list_orders.length == 0) {
//         return $(`.game-list .con-box:eq(${x}) .hb`).html(
//             `
//                     <div data-v-a9660e98="" class="van-empty">
//                         <div class="van-empty__image">
//                             <img src="/images/empty-image-default.png" />
//                         </div>
//                         <p class="van-empty__description">Không có dữ liệu</p>
//                     </div>
//                     `
//         );
//     }
//     let htmls = '';
//     let result = list_orders.map((list_orders) => {
//         return (htmls += `
//                     <div data-v-a9660e98="" class="c-tc item van-row">
//                         <div data-v-a9660e98="" class="van-col van-col--8">
//                             <div data-v-a9660e98="" class="c-tc goItem">${
//                                 list_orders.period
//                             }</div>
//                         </div>
//                         <div data-v-a9660e98="" class="van-col van-col--5">
//                             <div data-v-a9660e98="" class="c-tc goItem">
//                                 <!---->
//                                 <span data-v-a9660e98="" class="${
//                                     list_orders.amount % 2 == 0
//                                         ? 'red'
//                                         : 'green'
//                                 }"> ${list_orders.amount} </span>
//                             </div>
//                         </div>
//                         <div data-v-a9660e98="" class="van-col van-col--5">
//                             <div data-v-a9660e98="" class="c-tc goItem">
//                                 <span data-v-a9660e98=""> ${
//                                     list_orders.amount < 5 ? 'Nhỏ' : 'Lớn'
//                                 } </span>
//                                 <!---->
//                             </div>
//                         </div>
//                         <div data-v-a9660e98="" class="van-col van-col--6">
//                             <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
//                                 <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
//                                     <span data-v-a9660e98="" class="li ${
//                                         list_orders.amount % 2 == 0
//                                             ? 'yellow'
//                                             : 'green'
//                                     }"></span>
//                                     ${
//                                         list_orders.amount == 0 ||
//                                         list_orders.amount == 5
//                                             ? '<span data-v-a9660e98="" class="li violet"></span>'
//                                             : ''
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     `);
//     });
//     $(`.game-list .con-box:eq(${x}) .hb`).prepend(htmls);
//     $(`.game-list .con-box:eq(${x}) .hb .c-tc`).last().remove();
// }
var socket = io();
var pageno = 0;
var limit = 10;
var page = 1;
// socket.on("data-server", function (msg) {
//   if(msg.data[0].game != 'wingo') return;
//   $(".Loading").fadeIn(0);
//   setTimeout(() => {
//     let data1 = msg.data[0]; // lấy ra cầu mới nhất
//     let data2 = []; // lấy ra cầu cũ
//     let data3 = data2.push(msg.data[1]);
//     $(".time-box .info .number").text(data1.period);
//     showListOrder3(data2, 0);
//     pageno = 0;
//     limit = 10;
//     page = 1;
//     $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("block-click");
//     $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass("action");
//     $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
//       "color",
//       "#7f7f7f"
//     );
//     $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
//       "block-click"
//     );
//     $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
//     $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
//       "color",
//       "#fff"
//     );
//       //copy1
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("block-click");
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass("action");
//     $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
//       "color",
//       "#7f7f7f"
//     );
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
//       "block-click"
//     );
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
//     $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
//       "color",
//       "#fff"
//     );

//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("block-click");
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass("action");
//     $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
//       "color",
//       "#7f7f7f"
//     );
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
//       "block-click"
//     );
//     $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
//     $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
//       "color",
//       "#fff"
//     );
//     $.ajax({
//       type: "POST",
//       url: "/api/webapi/GetMyEmerdList",
//       data: {
//         typeid: "1",
//         pageno: "0",
//         pageto: "10",
//         language: "vi",
//       },
//       dataType: "json",
//       success: function (response) {
//         let data = response.data.gameslist;
//         $(".game-list .con-box:eq(1) .page-nav .number").text(
//           "1/" + `${(response.page) ? response.page : '1'}`
//         );
//         showListOrder2(data, 2);
//       },
//     });
//     //copy2
//     $.ajax({
//       type: "POST",
//       url: "/api/webapi/GetNoaverageEmerdList",
//       data: {
//         typeid: "1",
//         pageno: "0",
//         pageto: "10",
//         language: "vi",
//       },
//       dataType: "json",
//       success: function (response) {
//         let list_orders = response.data.gameslist;
//         $(".time-box .info .number").text(response.period);
//         $(".game-list .con-box:eq(1) .page-nav .number").text(
//           "1/" + response.page
//         );
//         showListOrder(list_orders, 1);
//       },
//     });

//     $.ajax({
//       type: "POST",
//       url: "/api/webapi/GetNoaverageEmerdList",
//       data: {
//         typeid: "1",
//         pageno: "0",
//         pageto: "10",
//         language: "vi",
//       },
//       dataType: "json",
//       success: function (response) {
//         let list_orders = response.data.gameslist;
//         $(".time-box .info .number").text(response.period);
//         $(".game-list .con-box:eq(0) .page-nav .number").text(
//           "1/" + response.page
//         );
//         showListOrder(list_orders, 0);
//       },
//     });
//     fetch("/api/webapi/GetUserInfo")
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.status === false) {
//         unsetCookie();
//         return false;
//       }
//       $(".num span").text(`${data.data.money_user}.00 USD `);
//     });
//     $(".Loading").fadeOut(0);
//   }, 1000);
// });
// $('body').click(function (e) {
//     e.preventDefault();
//     socket.emit('data-server', {
//         name: 'Longdz',
//     });
// });

function timerJoinxs(params, n) {
  let date = new Date();
  if (params && n) {
    now = params.split('-');
    date.setFullYear(now[2], Number(now[1]) - 1, Number(now[0]) + n);
    console.log(n);
  } else if (params) {
    now = params.split('-');
    date.setFullYear(now[2], Number(now[1]) - 1, Number(now[0]));
  } else {
    date = new Date();
  }
  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());
  return days + '-' + months + '-' + years;
}

var audio1 = new Audio('/audio/di1.da40b233.mp3');
var audio2 = new Audio('/audio/di2.317de251.mp3');

var clicked = false;

function openAudio() {
  audio1.muted = true;
  audio1.play();
  audio2.muted = true;
  audio2.play();
}

$('body').click(function (e) {
  e.preventDefault();
  if (clicked) return;
  openAudio();
  clicked = true;
});

function playAudio1() {
  audio1.muted = false;
  audio1.play();
}

function playAudio2() {
  audio2.muted = false;
  audio2.play();
}

fetch('/api/webapi/GetUserInfo')
  .then(response => response.json())
  .then(data => {
    $('.Loading').fadeOut(0);
    if (data.status === false) {
      unsetCookie();
      return false;
    }
    $('.num span').text(`${data.data.money_user}.00 USD `);
  });

$('.reload_money').click(function (e) {
  e.preventDefault();
  $(this).addClass('action block-click');
  setTimeout(() => {
    $(this).removeClass('action block-click');
  }, 3000);
  fetch('/api/webapi/GetUserInfo')
    .then(response => response.json())
    .then(data => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $('.num span').text(`${data.data.money_user}.00 USD `);
    });
});
$('.van-overlay, .foot .left').click(function (e) {
  e.preventDefault();
  $('.van-overlay').fadeOut();
  $('.van-popup-vf').fadeOut(100);
  $('.popup-join').css('transform', 'translateY(600px)');
  $('.betting-mark .amount-box .li, .multiple-box .li').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(0, 0, 0)',
  });
  $('.betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(255, 255, 255)',
  });
  $('.stepper-box .digit-box input').val(1);
  $('.amount-box').attr('data-money', '1000');
  $('.foot .right span:eq(1)').text(1000 + '.00 USD');
});

function xlad(x, color) {
  $('.multiple-box .li').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(0, 0, 0)',
  });
  $(`.multiple-box .li:eq(${x})`).css({
    'background-color': `${color}`,
    color: 'rgb(255, 255, 255)',
  });
}

function selectX(x, color) {
  switch (String(x)) {
    case '1':
      xlad(0, color);
      break;
    case '5':
      xlad(1, color);
      break;
    case '10':
      xlad(2, color);
      break;
    case '20':
      xlad(3, color);
      break;
    case '50':
      xlad(4, color);
      break;
    case '100':
      xlad(5, color);
      break;
    default:
      $('.multiple-box .li').css({
        'background-color': 'rgb(240, 240, 240)',
        color: 'rgb(0, 0, 0)',
      });
      break;
  }
}

$('.stepper-box .plus').click(function (e) {
  e.preventDefault();
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  let value = $('.stepper-box .digit-box input').val().trim();
  value = Number(value) + 1;
  selectX(value, color);
  if (value > 1) {
    $('.stepper-box .minus').css({
      'background-color': `${color}`,
      color: '#fff',
    });
  } else {
    $('.stepper-box .minus').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(200, 201, 204)',
    });
  }
  $('.stepper-box .digit-box input').val(value);
  totalMoney();
});

$('.stepper-box .digit-box input').on('input', function () {
  let value = $(this).val();
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  // if (!value)  $(this).val(1);
  value = $(this).val();
  if (value <= 1) {
    $('.stepper-box .minus').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(200, 201, 204)',
    });
  } else if (value) {
    $('.stepper-box .minus').css({
      'background-color': `${color}`,
      color: 'rgb(200, 201, 204)',
    });
  }
  selectX(value, color);
  totalMoney();
});

$('.stepper-box .minus').click(function (e) {
  e.preventDefault();
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  let value = $('.stepper-box .digit-box input').val().trim();
  value = Number(value) - 1;
  if (value <= 0) return;
  selectX(value, color);
  if (value == 1) {
    $('.stepper-box .minus').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(200, 201, 204)',
    });
  }
  $('.stepper-box .digit-box input').val(value);
  totalMoney();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function selectCss(color, bg, text) {
  $('.betting-mark').attr('class', 'betting-mark');
  $('.color').css('color', bg);
  $('.color .p-l-10').text(text);
  $('.betting-mark').addClass(color);
  $('.amount-box .li:eq(0)').css('background-color', bg);
  $('.plus').css('background-color', bg);
  $('.multiple-box .li:eq(0)').css('background-color', bg);
  $('.foot .right').css('background-color', bg);
}

function totalMoney() {
  let value = $('.stepper-box .digit-box input').val().trim();
  let money = $('.amount-box').attr('data-money');
  let total = value * money;
  $('.foot .right span:eq(1)').text(total + '.00 USD');
}

function alertBox(join, addText) {
  $('.foot .right').attr('data-join', join);
  switch (join) {
    case 'x':
      selectCss('colorgreen', 'rgb(92, 186, 71)', addText);
      break;
    case 't':
      selectCss('colorviolet', 'rgb(152, 49, 233)', addText);
      break;
    case 'd':
      selectCss('colorbig', 'rgb(255, 197, 17)', addText); //red //rgb(251, 78, 78)
      break;
    case 'l':
      selectCss('colorbig', 'rgb(255, 197, 17)', addText);
      break;
    case 'n':
      selectCss('colorsmall', 'rgb(92, 186, 71)', addText);
      break;
    default:
      if (join % 2 == 0) {
        selectCss('colorbig', 'rgb(255, 197, 17)', addText);
      } else {
        selectCss(`color${join}`, 'rgb(92, 186, 71)', addText);
      }
      break;
  }
  $('.van-overlay').fadeIn();
  $('.popup-join').fadeIn();
  $('.stepper-box .minus').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(200, 201, 204)',
  });
  $('.popup-join').css('transform', 'translateY(1px)');
  let active = $('.random-box .c-row .active').attr('data-x');
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  $('.stepper-box input').val(active);
  totalMoney();
  selectX(active, color);
  if (active <= 1) {
    $('.stepper-box .minus').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(200, 201, 204)',
    });
  } else {
    $('.stepper-box .minus').css({
      'background-color': `${color}`,
      color: 'rgb(255, 255, 255)',
    });
  }
}

$('.popup-join .info .txt').click(function (e) {
  e.preventDefault();
  $('.popup-qt').fadeIn();
});

$('.betting-mark .amount-box .li').click(function (e) {
  e.preventDefault();
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  $('.betting-mark .amount-box .li').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(0, 0, 0)',
  });

  $(this).css({
    'background-color': `${color}`,
    color: 'rgb(255, 255, 255)',
  });
  let thisValue = $(this).attr('data-x');
  $('.amount-box').attr('data-money', thisValue);
  totalMoney();
});
$('.multiple-box .li').click(function (e) {
  e.preventDefault();
  let color = $('.foot .right').attr('style').split(':');
  color = color[1].split(';')[0].trim();
  $('.multiple-box .li').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(0, 0, 0)',
  });
  $(this).css({
    'background-color': `${color}`,
    color: 'rgb(255, 255, 255)',
  });
  let x = $(this).attr('data-x');
  if (x > 1) {
    $('.stepper-box .minus').css({
      'background-color': `${color}`,
      color: '#fff',
    });
  } else {
    $('.stepper-box .minus').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(200, 201, 204)',
    });
  }
  $('.stepper-box .digit-box input').val(x);
  totalMoney();
});

$('.popup-qt .van-button').click(function (e) {
  e.preventDefault();
  $('.popup-qt').fadeOut();
});

$('.con-box button').click(function (e) {
  e.preventDefault();
  let addTop = $(this).attr('data-join'); // xanh - do - tim (x - d - t)
  let addText = $(this).text(); // xanh - do - tim
  alertBox(addTop, addText);
});
$('.number-box button').click(function (e) {
  e.preventDefault();
  let addTop = $(this).text().trim(); // xanh - do - tim (x - d - t)
  let addText = $(this).text(); // xanh - do - tim
  alertBox(addTop, addText);
});
$('.btn-box button').click(function (e) {
  e.preventDefault();
  //let addTop = $(this).attr('data-join'); // xanh - do - tim (x - d - t)
  //let addText = $(this).text(); // xanh - do - tim
  let addTop = $(this).attr('data-join');
  let addText = $('#number').text();
  alertBox(addTop, addText);
});

$('.random-box .c-row .item').click(function (e) {
  e.preventDefault();
  $('.random-box .c-row .item').css({
    'background-color': 'rgb(240, 240, 240)',
    color: 'rgb(0, 0, 0)',
  });

  $(this).css({
    'background-color': 'rgb(92, 186, 71)',
    color: 'rgb(255, 255, 255)',
  });
  $('.random-box .c-row .item').removeClass('active');
  $(this).addClass('active');
});

$('.random').click(async function (e) {
  e.preventDefault();
  let random = 0;
  for (let i = 0; i < 55; i++) {
    random = Math.floor(Math.random() * 10);
    $('.number-box button').removeClass('action');
    $(`.number-box button:eq(${random})`).addClass('action');
    await sleep(50);
  }
  $('.van-overlay').fadeIn();
  $('.popup-join').fadeIn();
  $('.popup-join').css('transform', 'translateY(1px)');
  alertBox(random, random);
});
//copy
$('.game-list .tab .li:eq(0)').click(function (e) {
  console.log('click 0');
  pageno = 0;
  limit = 10;
  page = 1;
  e.preventDefault();
  $('.game-list .con-box').css('display', 'none');
  $('.game-list .li .txt').removeClass('action');
  $('.game-list .li .txt:eq(0)').addClass('action');
  $('.game-list .li').removeClass('block-click');
  $(this).addClass('block-click');
  $('.game-list .con-box:eq(0)').css('display', 'block');
  $('.history-xsmb').empty();
  $('.game-list .con-box:eq(0) .page-nav .number').text(timerJoinxs());
  $.ajax({
    type: 'POST',
    url: '/api/xsmb/history',
    data: {
      date: timerJoinxs(),
    },
    dataType: 'json',
    success: function (response) {
      let list_orders = response;
      $('.time-box .info .number').text(response.period);
      $('.game-list .con-box:eq(0) .page-nav .number').text(response.date);
      showListOrder(list_orders, 0);
    },
  });
});

// lichsucuoc
$('.game-list .tab .li:eq(1)').click(function (e) {
  e.preventDefault();
  console.log('click 2');
  $('.game-list .con-box').css('display', 'none');
  $('.game-list .li .txt').removeClass('action');
  $('.game-list .li .txt:eq(1)').addClass('action');
  $('.game-list .li').removeClass('block-click');
  $(this).addClass('block-click');
  $('.game-list .con-box:eq(1)').css('display', 'block');
  $.ajax({
    type: 'POST',
    url: '/api/xsmb/historybet',
    data: { page: 1 },
    dataType: 'json',
    success: function (response) {
      let { list, totalPage } = response;
      // $('.time-box .info .number').text(response.period);
      $('.page-nav .number').text('1/' + totalPage);
      $('.game-list .con-box:eq(1) .page-nav .number').text(
        '1/' + `${totalPage ? totalPage : '1'}`,
      );
      showListOrder2(list, 1);
    },
  });
  setTimeout(() => {
    let check = true;
    $('#history-order .item').click(function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      // let show = parent.children();
      let myVar = parent.find('.details');
      if (check) {
        check = false;
        myVar.fadeIn(0);
      } else {
        check = true;
        myVar.fadeOut(0);
      }
    });
  }, 1000);
});

function alertMessJoin(msg) {
  $('body').append(
    `
                <div data-v-1dcba851="" class="msg">
                    <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${msg} </div>
                </div>
                `,
  );
  setTimeout(() => {
    $('.msg .msg-content').removeClass('v-enter-active v-enter-to');
    $('.msg .msg-content').addClass('v-leave-active v-leave-to');
    setTimeout(() => {
      $('body .msg').remove();
    }, 500);
  }, 1000);
}

$('.foot .right').click(function (e) {
  e.preventDefault();
  let join = $(this).attr('data-join');
  let x = $('.stepper-box input').val().trim();
  let money = $('.amount-box').attr('data-money');
  if (!join || !x || !money) {
    return;
  }
  $(this).addClass('block-click');
  $.ajax({
    type: 'POST',
    url: '/api/webapi/action/join',
    data: {
      typeid: '1',
      join: join,
      x: x,
      money: money,
    },
    dataType: 'json',
    success: function (response) {
      alertMessJoin(response.message);
      if (response.status === false) return;
      $('#history-order').prepend(response.data);
      $('.total-box .num span').text(response.money + '.00 USD ');
      socket.emit('data-server_2', {
        money: x * money,
        join,
        phone: response.phone,
        time: Date.now(),
        change: response.change,
        conlai: response.money,
        ctv: response.ctv,
      });
    },
  });

  setTimeout(() => {
    $('.van-overlay').fadeOut();
    $('.popup-join').css('transform', 'translateY(600px)');
    $('.betting-mark .amount-box .li, .multiple-box .li').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(0, 0, 0)',
    });
    $('.betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)').css({
      'background-color': 'rgb(240, 240, 240)',
      color: 'rgb(255, 255, 255)',
    });
    $('.stepper-box .digit-box input').val(1);
    $('.amount-box').attr('data-money', '1000');
    $('.foot .right span:eq(1)').text(1000 + '.00 USD');
    $('.foot .right').removeClass('block-click');
  }, 500);
});

//copy
$(document).on('click', '.tab', e => {
  $(document)?.find('.leader-line')?.remove();
});

function renderLines() {
  let idArray = [];
  setTimeout(() => {
    $(document)?.find('.leader-line')?.remove();
    let srr = [];
    srr = Array.from($(document).find('#app').find('.lineRed'));

    srr = srr.sort();
    for (let i = 0; i < srr.length; i++) {
      if (typeof srr[i + 1] != 'undefined') {
        new LeaderLine(
          LeaderLine.pointAnchor(srr[i]),
          LeaderLine.pointAnchor(srr[i + 1]),
          {
            path: 'straight',
            color: 'red',
            //startPlug: 'disc',
            size: 2,
            startPlug: 'behind',
            endPlug: 'behind',
          },
        );
      }
    }
    let newLines = $(document).find('.leader-line');

    let current_position =
      document.documentElement.scrollTop || document.body.scrollTop;

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      // some code..
    } else {
      newLines.each((i, elm) => {
        $(elm).addClass('svg-bd');
        let top = parseInt($(elm).css('top'));
        console.log('top', top);
        $(elm).css({ top: top + current_position });
      });
    }
  }, 10);
}

function showListOrder(list_orders, x) {
  let html = `<tbody>
    <tr class="history-row">
        <td class="price">ĐB</td>
        <td class="number">
            <span class="number-s">${list_orders.gdb}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">1</td>
        <td class="number">${list_orders.g1}</td>
    </tr>
    <tr class="history-row">
        <td class="price">2</td>
        <td class="number">
            <span>${list_orders.g2[0]}</span><span>${list_orders.g2[1]}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">3</td>
        <td class="number">
            <span class="number-3">${list_orders.g3[0]}</span>
            <span class="number-3">${list_orders.g3[1]}</span>
            <span class="number-3">${list_orders.g3[2]}</span>
            <span class="number-3">${list_orders.g3[3]}</span>
            <span class="number-3">${list_orders.g3[4]}</span>
            <span class="number-3">${list_orders.g3[5]}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">4</td>
        <td class="number">
            <span>${list_orders.g4[0]}</span>
            <span>${list_orders.g4[1]}</span>
            <span>${list_orders.g4[2]}</span>
            <span>${list_orders.g4[3]}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">5</td>
        <td class="number">
            <span class="number-3">${list_orders.g5[0]}</span>
            <span class="number-3">${list_orders.g5[1]}</span>
            <span class="number-3">${list_orders.g5[2]}</span>
            <span class="number-3">${list_orders.g5[3]}</span>
            <span class="number-3">${list_orders.g5[4]}</span>
            <span class="number-3">${list_orders.g5[5]}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">6</td>
        <td class="number">
            <span>${list_orders.g6[0]}</span>
            <span>${list_orders.g6[1]}</span>
            <span>${list_orders.g6[2]}</span>
        </td>
    </tr>
    <tr class="history-row">
        <td class="price">7</td>
        <td class="number">
            <span class="number-s">${list_orders.g7[0]}</span>
            <span class="number-s">${list_orders.g7[1]}</span>
            <span class="number-s">${list_orders.g7[2]}</span>
            <span class="number-s">${list_orders.g7[3]}</span>
        </td>
    </tr>
</tbody>`;

  $('.history-xsmb').empty();
  $('.history-xsmb').append(html);
}

const isNumber = params => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

function showListOrder2(list_orders, x) {
  if (list_orders.length == 0) {
    return $(`.game-list .con-box:eq(${x}) #history-order`).html(
      `
                    <div data-v-a9660e98="" class="van-empty">
                        <div class="van-empty__image">
                            <img src="/images/empty-image-default.png" />
                        </div>
                        <p class="van-empty__description">Không có dữ liệu</p>
                    </div>
                    `,
    );
  }
  let htmls = '';
  let i = -1;
  let result = list_orders.map(list_orders => {
    i++;
    let join = list_orders.bet;
    let color = '';
    if (join == 'l') {
      color = 'big';
    } else if (join == 'n') {
      color = 'small';
    } else if (join == 't') {
      color = 'violet';
    } else if (join == 'd') {
      color = 'yellow';
    } else if (join == 'x') {
      color = 'green';
    } else if (join == '0') {
      color = 'yellow-violet';
    } else if (join == '5') {
      color = 'green-violet';
    } else if (Number(join) % 2 == 0) {
      color = 'yellow';
    } else if (Number(join) % 2 != 0) {
      color = 'green';
    }
    if ((!isNumber(join) && join == 'l') || join == 'n') {
      checkJoin = `
                    <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
                        <img src="/images/${
                          join == 'n' ? 'small' : 'big'
                        }.png" class="van-image__img">
                    </div>
                    `;
    } else {
      checkJoin = `
                    <span data-v-a9660e98="">${
                      isNumber(join) ? join : ''
                    }</span>
                    `;
    }
    return (htmls += `
        <div data-v-a9660e98="" issuenumber="${
          list_orders.stage
        }" addtime="${timerJoin(
      list_orders.time,
    )}" colour="red" number="6" rowid="${i}" class="hb">
            <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${list_orders.date} ${
      list_orders.status == 1
        ? '<span data-v-a9660e98="" class="state green">Thành công</span>'
        : list_orders.status == 2
        ? '<span data-v-a9660e98="" lass="state red">Thất bại</span>'
        : ''
    }
                    </div>
                    <div data-v-a9660e98="" class="tiem">
                        ${timerJoin(list_orders.time)}
                    </div>
                </div>
                <div
                    data-v-a9660e98=""
                    class="money"
                    style="display: flex; flex-direction: column"
                >
                    <span data-v-a9660e98="" class="state"
                        >${list_orders.so}</span
                    >
    
                    <span data-v-a9660e98="" class="state"
                        >${formatMoneyVND(list_orders.cuoc)}</span
                    >
                </div>
            </div>
        </div>
    
        <div data-v-a9660e98="" class="details" style="display: none">
            <div data-v-a9660e98="" class="tit">Chi tiết</div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Mã đơn hàng</div>
                <div
                    data-v-a9660e98=""
                    data-clipboard-text="${list_orders.id}"
                    class="tag-read c-row c-row-between c-row-middle"
                >
                    ${list_orders.id}
                    <img
                        data-v-a9660e98=""
                        width="18px"
                        height="15px"
                        src="/images/copy.png"
                        class="m-l-5"
                    />
                </div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Số tiền mua</div>
                <div data-v-a9660e98="">${list_orders.cuoc}</div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Chọn</div>
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="">${list_orders.so}</div>
                </div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Loại</div>
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="">${list_orders.type}</div>
                </div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Tỉ lệ</div>
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="">${list_orders.rate}</div>
                </div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Thắng thua</div>
                <div
                    data-v-a9660e98=""
                    class="${
                      list_orders.status == 1
                        ? 'green'
                        : list_orders.status == 2
                        ? 'yellow'
                        : ''
                    }"
                >
                    ${list_orders.win}
                </div>
            </div>
            <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                <div data-v-a9660e98="">Thời gian mua</div>
                <div data-v-a9660e98="">${timerJoin(list_orders.time)}</div>
            </div>
        </div>
    </div>
    `);
  });
  $(`.game-list .con-box:eq(${x}) .list #history-order`).html(htmls);
}

//lichsuxsmb;

$('.game-list .con-box:eq(0) .page-nav .number').text(timerJoinxs());

$.ajax({
  type: 'POST',
  url: '/api/xsmb/history',
  data: {
    date: timerJoinxs(),
  },
  dataType: 'json',
  success: function (response) {
    let list_orders = response;
    // $('.time-box .info .number').text(response.period);
    $('.game-list .con-box:eq(0) .page-nav .number').text(timerJoinxs());
    if (list_orders.length !== 0) {
      showListOrder(list_orders, 0);
    }
  },
});

function formateT(params) {
  let result = params < 10 ? '0' + params : params;
  return result;
}

const formatMoneyVND = money =>
  new Intl.NumberFormat('vi-vn', {
    style: 'currency',
    currency: 'VND',
  }).format(money);

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

  return years + '-' + months + '-' + days + ' ';
}

$.ajax({
  type: 'POST',
  url: '/api/webapi/GetMyEmerdList',
  data: {
    typeid: '1',
    pageno: '0',
    pageto: '10',
    language: 'vi',
  },
  dataType: 'json',
  success: function (response) {
    let data = response.data.gameslist;
    $('.game-list .con-box:eq(1) .page-nav .number').text(
      '1/' + `${response.page ? response.page : '1'}`,
    );
    showListOrder2(data, 2);
  },
});

var pageno = 0;
var limit = 10;
var page = 1;

// previousxsmb
$('.game-list .con-box:eq(0) .page-nav .arr:eq(1)').click(function (e) {
  e.preventDefault();
  $('.game-list .con-box:eq(0) .page-nav .arr:eq(0)').removeClass(
    'block-click',
  );
  $('.game-list .con-box:eq(0) .page-nav .arr:eq(0)').addClass('action');
  let date = $('.game-list .con-box:eq(0) .page-nav .number').text();
  date = timerJoinxs(date, -1);
  $.ajax({
    type: 'POST',
    url: '/api/xsmb/history',
    data: {
      date,
    },
    dataType: 'json',
    success: function (response) {
      let list_orders = response;
      $('.game-list .con-box:eq(0) .page-nav .number').text(response.date);
      showListOrder(list_orders, 0);
    },
  });
});

// nextxsmb
$('.game-list .con-box:eq(0) .page-nav .arr:eq(0)').click(function (e) {
  e.preventDefault();
  $('.game-list .con-box:eq(0) .page-nav .arr:eq(1)').removeClass(
    'block-click',
  );
  $('.game-list .con-box:eq(0) .page-nav .arr:eq(1)').addClass('action');
  $('.game-list .con-box:eq(0) .page-nav .van-icon-arrow-right').css(
    'color',
    '#fff',
  );
  let date = $('.game-list .con-box:eq(0) .page-nav .number').text();
  date = timerJoinxs(date, 1);

  $.ajax({
    type: 'POST',
    url: '/api/xsmb/history',
    data: {
      date,
    },
    dataType: 'json',
    success: function (response) {
      let list_orders = response;
      $('.game-list .con-box:eq(0) .page-nav .number').text(response.date);
      showListOrder(list_orders, 0);
    },
  });
});

//lichsucuocpre

$('.game-list .con-box:eq(1) .page-nav .arr:eq(1)').click(function (e) {
  e.preventDefault();
  console.log(1);
  $('.game-list .con-box:eq(1) .page-nav .arr:eq(1)').removeClass(
    'block-click',
  );
  $('.game-list .con-box:eq(1) .page-nav .arr:eq(1)').addClass('action');
  $('.game-list .con-box:eq(1) .page-nav .van-icon-arrow-right').css(
    'color',
    '#fff',
  );
  let page = $('.game-list .con-box:eq(1) .page-nav .number').text();
  page = page.split('/');
  if (page[0] < page[1]) {
    page = Number(page[0]) + 1;
  } else {
    return;
  }
  $.ajax({
    type: 'POST',
    url: '/api/xsmb/historybet',
    data: { page },
    dataType: 'json',
    success: function (response) {
      let { list, totalPage, page } = response;
      // $('.time-box .info .number').text(response.period);
      $('.page-nav .number').text('1/' + totalPage);
      $('.game-list .con-box:eq(1) .page-nav .number').text(
        page + '/' + `${totalPage ? totalPage : '1'}`,
      );
      showListOrder2(list, 1);
    },
  });
  setTimeout(() => {
    let check = true;
    $('#history-order .item').click(function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      // let show = parent.children();
      let myVar = parent.find('.details');
      if (check) {
        check = false;
        myVar.fadeIn(0);
      } else {
        check = true;
        myVar.fadeOut(0);
      }
    });
  }, 1000);
});

//lichsucuocnext
$('.game-list .con-box:eq(1) .page-nav .arr:eq(0)').click(function (e) {
  e.preventDefault();
  console.log('click');
  $('.game-list .con-box:eq(1) .page-nav .arr:eq(0)').removeClass(
    'block-click',
  );
  $('.game-list .con-box:eq(1) .page-nav .arr:eq(0)').addClass('action');
  $('.game-list .con-box:eq(1) .page-nav .van-icon-arrow-right').css(
    'color',
    '#fff',
  );
  let page = $('.game-list .con-box:eq(1) .page-nav .number').text();
  page = page.split('/');
  if (page[0] > 1) {
    page = Number(page[0]) - 1;
  } else {
    return;
  }
  $.ajax({
    type: 'POST',
    url: '/api/xsmb/historybet',
    data: { page },
    dataType: 'json',
    success: function (response) {
      let { list, totalPage, page } = response;
      // $('.time-box .info .number').text(response.period);
      $('.page-nav .number').text('1/' + totalPage);
      $('.game-list .con-box:eq(1) .page-nav .number').text(
        page + '/' + `${totalPage ? totalPage : '1'}`,
      );
      showListOrder2(list, 1);
    },
  });
  setTimeout(() => {
    let check = true;
    $('#history-order .item').click(function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      // let show = parent.children();
      let myVar = parent.find('.details');
      if (check) {
        check = false;
        myVar.fadeIn(0);
      } else {
        check = true;
        myVar.fadeOut(0);
      }
    });
  }, 1000);
});

window.onload = function () {
  function cownDownTimer() {
    var countDownDate = new Date(Date.now());
    countDownDate.setHours(18, 0, 0);
    setInterval(function () {
      var now = Date.now();
      var distance = countDownDate - now;
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      hours = hours < 10 ? `0${hours}` : hours;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      $('.number .item:eq(0)').text(hours.toString().at(0));
      $('.number .item:eq(1)').text(hours.toString().at(1));
      $('.number .item:eq(3)').text(minutes.toString().at(0));
      $('.number .item:eq(4)').text(minutes.toString().at(1));
      $('.number .item:eq(6)').text(seconds.toString().at(0));
      $('.number .item:eq(7)').text(seconds.toString().at(1));
    }, 0);
    // setInterval(() => {
    //     var now = new Date().getTime();
    //     var distance = countDownDate - now;
    //     var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
    //     var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
    //     if (seconds1 == 0 && seconds2 <= 5) {
    //         if (clicked) {
    //             playAudio1();
    //         }
    //     }
    //     if (seconds1 == 5 && seconds2 == 9) {
    //         if (clicked) {
    //             playAudio2();
    //         }
    //     }
    // }, 1000);
    // setInterval(function () {
    //     var now = new Date().getTime();
    //     var distance = countDownDate - now;
    //     var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
    //     var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
    //     if (seconds1 == 0 && seconds2 <= 5) {
    //         $('.van-overlay').fadeOut();
    //         $('.popup-join').css('transform', 'translateY(600px)');
    //         $('.betting-mark .amount-box .li, .multiple-box .li').css({
    //             'background-color': 'rgb(240, 240, 240)',
    //             color: 'rgb(0, 0, 0)',
    //         });
    //         $(
    //             '.betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)'
    //         ).css({
    //             'background-color': 'rgb(240, 240, 240)',
    //             color: 'rgb(255, 255, 255)',
    //         });
    //         $('.stepper-box .digit-box input').val(1);
    //         $('.amount-box').attr('data-money', '1000');
    //         $('.foot .right span:eq(1)').text(1000 + '.00 USD');

    //         $('.box .mark-box ').css('display', 'flex');
    //         $('.box .mark-box .item:eq(0)').text(seconds1);
    //         $('.box .mark-box .item:eq(1)').text(seconds2);
    //     } else {
    //         $('.box .mark-box ').css('display', 'none');
    //     }
    // }, 0);
  }

  cownDownTimer();
  setTimeout(() => {
    let check = true;
    $('#history-order .item').click(function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      // let show = parent.children();
      let myVar = parent.find('.details');
      if (check) {
        check = false;
        myVar.fadeIn(0);
      } else {
        check = true;
        myVar.fadeOut(0);
      }
    });
  }, 1000);
};

$('.van-notice-bar__wrap .van-notice-bar__content').css({
  'transition-duration': '48.9715s',
  transform: 'translateX(-2448.57px)',
});
setInterval(() => {
  $('.van-notice-bar__wrap .van-notice-bar__content').css({
    'transition-duration': '0s',
    transform: 'translateX(0)',
  });
  setTimeout(() => {
    $('.van-notice-bar__wrap .van-notice-bar__content').css({
      'transition-duration': '48.9715s',
      transform: 'translateX(-2448.57px)',
    });
  }, 100);
}, 48000);

$('.van-button--default').click(function (e) {
  e.preventDefault();
  $('.van-popup-vf, .van-overlay').fadeOut(100);
});

$('.circular').click(function (e) {
  e.preventDefault();
  $('.van-popup-vf, .van-overlay').fadeIn(100);
});

let selectPageTime = Number($('html').attr('data-dpr'));
console.log(selectPageTime - 1);
$(`.game-betting .box .item:eq(${selectPageTime - 1})`).addClass('action');
$(`.game-betting .box .item:eq(${selectPageTime - 1}) .img`).addClass(
  'block-click',
);
$(`.game-betting .box .item .img .van-image img`).attr(
  'src',
  '/images/icon_clock-gerrn.webp',
);
$(
  `.game-betting .box .item:eq(${selectPageTime - 1}) .img .van-image img`,
).attr('src', '/images/icon_clock-red.webp');

function renderList10(from, to) {
  let list100 = ``;
  for (let i = from; i < to; i++) {
    list100 += `<button
        data-v-a9660e98=""
        type="button"
        class="item action c-row c-row-middle-center m-b-10"
        >
        <div data-v-a9660e98="" class="number c-row c-row-middle-center">
            <span data-v-a9660e98="" class="txt number-bet">${i}</span>
        </div></button
        >`;
  }
  return list100;
}

function renderList100(from, to) {
  let list100 = ``;
  for (let i = from; i < to; i++) {
    let number = i < 10 ? `0${i}` : i;
    list100 += `<button
        data-v-a9660e98=""
        type="button"
        class="item action c-row c-row-middle-center m-b-10"
        >
        <div data-v-a9660e98="" class="number c-row c-row-middle-center">
            <span data-v-a9660e98="" class="txt number-bet">${number}</span>
        </div></button
        >`;
  }
  return list100;
}

function renderList1000(from, to) {
  let list100 = ``;
  for (let i = from; i < to; i++) {
    let number = i < 10 ? `00${i}` : i < 100 ? `0${i}` : i;
    list100 += `<button
        data-v-a9660e98=""
        type="button"
        class="item action c-row c-row-middle-center m-b-10"
        >
        <div data-v-a9660e98="" class="number c-row c-row-middle-center">
            <span data-v-a9660e98="" class="txt number-bet">${number}</span>
        </div></button
        >`;
  }
  return list100;
}

$('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
  renderList100(0, 100),
);

function choseNumber(maxChose) {
  $('[data-v-a9660e98].txt.number-bet').each(function () {
    $(this).click(function () {
      let values = $('#number').text();
      values = values.split(',');

      if (values.length < maxChose) {
        if ($('#number').text().includes($(this).text())) {
          values = values.filter(item => item !== $(this).text());
          values = values.toString();
          $(this).removeAttr('style');
          $('#number').empty();
          $('#number').append(values);
        } else if ($('#number').text() === '') {
          $(this).css('background-color', 'blue');
          $('#number').append($(this).text());
        } else {
          $(this).css('background-color', 'blue');
          $('#number').append(`,${$(this).text()}`);
        }
      }
    });
  });
}

choseNumber(100);

$('#today').append(function () {
  return `Ngày </br>${timerJoin2()}`;
});

$('#clear-bet').click(function () {
  $('#number').empty();
  $('#so-cuoc').empty();
  $('[data-v-a9660e98].txt.number-bet').removeAttr('style');
});

$('.btn[data-v-a9660e98=""').each(function (index) {
  $(this).click(function () {
    $('.btn[data-v-a9660e98=""').removeClass('green');
    $('.btn[data-v-a9660e98=""').addClass('violet');
    $(this).removeClass('violet');
    $(this).addClass('green');
    $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').empty();
    $('#number').empty();
    if (index === 4) {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList100(0, 100),
      );
      choseNumber(2);
    } else if (index === 5) {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList100(0, 100),
      );
      choseNumber(3);
    } else if (index === 6) {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList100(0, 100),
      );
      choseNumber(4);
    } else if (index === 8) {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList1000(0, 1000),
      );
      choseNumber(1000);
    } else if (index == 9 || index === 10) {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList10(0, 10),
      );
      choseNumber(10);
    } else {
      $('.number-box.action.m-t-10.c-row.c-row-between.c-flex-warp').append(
        renderList100(0, 100),
      );
      choseNumber(100);
    }
  });
});

$('#submit-bet-xsmb').click(function () {
  let so = $('#so-cuoc').text();
  let money = $('#total-money-bet').text();
  // money.replaceAll('.', '');
  money = money.slice(0, -5);
  let type;
  $('.btn[data-v-a9660e98=""').each(function (index) {
    let a = $(this).attr('class');
    if (a === 'btn green') {
      return (type = $(this).attr('data-join'));
    }
  });
  if (so && money) {
    $.ajax({
      type: 'POST',
      url: '/api/xsmb',
      data: {
        so,
        type,
        money,
      },
      dataType: 'json',
      success: function (response) {
        const { status, message } = response;
        alertMessJoin(message);
        if (status === false) return;
        $('#number').text('');
      },
    });
  }
  setTimeout(() => {
    $('.van-overlay').fadeOut();
    $('.popup-join').css('transform', 'translateY(600px)');
  }, 500);
});
