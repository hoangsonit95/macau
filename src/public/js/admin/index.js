var socket = io();
let typeid = $('html').attr('data-change');
let game = '';
if (typeid == '1') game = 'wingo';
if (typeid == '2') game = 'wingo3';
if (typeid == '3') game = 'wingo5';
if (typeid == '4') game = 'wingo10';
$(
    `.container-fluid:eq(1) .row:eq(0) .info-box-content:eq(${
        Number(typeid) - 1
    }) .info-box-text`
).css('color', '#e67e22');

function formatMoney(money, type) {
    return String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${type}`);
}

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
const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
};

function alertMess(text, sic) {
    $('body').append(
        `
    <div data-v-1dcba851="" class="msg" style="position: fixed; top: 0; left:0; width: 100%; height: 100dvh; z-index: 1000000; display: flex; justify-content: center; align-items: center;">
        <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style="text-color:white; background: rgb(0,0,0,0.9); padding: 4px 8px"> ${text} </div>
    </div>
    `
    );
    setTimeout(() => {
        $('.msg .msg-content').removeClass('v-enter-active v-enter-to');
        $('.msg .msg-content').addClass('v-leave-active v-leave-to');
        setTimeout(() => {
            $('.msg').remove();
        }, 100);
    }, 1000);
}

function showJoinMember(data) {
    let phone = data.phone;
    let bet = data.bet;
    let money = formatMoney(data.money + data.fee, ',');
    let name = data.bet;
    let time = timerJoin(data.time);
    let result = '';
    result += `
      <div class="direct-chat-infos clearfix">
        <span class="direct-chat-name float-left"></span>
        <span class="direct-chat-timestamp float-right text-primary">${time}</span>
      </div>
      <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
      <div class="direct-chat-text" style="background-color: ${
          isNumber(bet)
              ? '#007acc'
              : bet == 'x'
              ? '#1eb93d'
              : bet == 'd'
              ? '#f52828'
              : bet == 't'
              ? '#ea3af0'
              : bet == 'l'
              ? '#ffc511'
              : '#5cba47'
      }">
        User: ${phone} -> Tham gia <input type="text" style="background-color: #1eb93d; width:55px; border: 1px solid white" id="${
        data.id
    }-bet" value="${
        isNumber(bet)
            ? bet
            : bet == 'd'
            ? 'Red'
            : bet == 'x'
            ? 'Green'
            : bet == 't'
            ? 'Violet'
            : bet == 'l'
            ? 'Big'
            : 'Small'
    }"/> ${money}<button id="${
        data.id
    }-submit" class="submit_bet" style="background: blue; color:white; padding: 4px">Thay đổi</button>
      </div>`;
    $('.direct-chat-msg').append(result);
    $('.submit_bet').click(function () {
        let id = $(this).attr('id').split('-')[0];
        let bet = $(`#${id}-bet`).val();
        let type = 'wingo';
        $.ajax({
            type: 'POST',
            url: '/api/webapi/admin/change/bet',
            data: {
                id,
                bet,
                type,
            },
            dataType: 'json',
            success: function (res) {
                let { status, msg } = res;
                alertMess(msg);
            },
        });
    });
}

function showJoinMember2(data) {
    let game = $('html').attr('data-change');
    if (game == 1 && data.game != 'wingo') return;
    if (game == 2 && data.game != 'wingo3') return;
    if (game == 3 && data.game != 'wingo5') return;
    if (game == 4 && data.game != 'wingo10') return;
    if (data.change == 1) return;
    let bet = data.join;
    let money = formatMoney(data.money, ',');
    let name = data.bet;
    let time = timerJoin(data.time);
    let result = '';
    result += `
      <div class="direct-chat-infos clearfix">
        <span class="direct-chat-name float-left"></span>
        <span class="direct-chat-timestamp float-right text-primary">${time}</span>
      </div>
      <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
      <div class="direct-chat-text" style="background-color: ${
          isNumber(bet)
              ? '#007acc'
              : bet == 'x'
              ? '#1eb93d'
              : bet == 'd'
              ? '#f52828'
              : bet == 't'
              ? '#ea3af0'
              : bet == 'l'
              ? '#ffc511'
              : '#5cba47'
      }">
       User: ${
           data.phone
       } -> Tham gia <input type="text" style="background-color: #1eb93d; width:55px; border: 1px solid white" id="${
        data.id
    }-bet" value="${
        isNumber(bet)
            ? bet
            : bet == 'd'
            ? 'Red'
            : bet == 'x'
            ? 'Green'
            : bet == 't'
            ? 'Violet'
            : bet == 'l'
            ? 'Big'
            : 'Small'
    }"/> ${money}<button id="${
        data.id
    }-submit" class="submit_bet" style="background: blue; color:white; padding: 4px">Thay đổi</button>
      </div>`;
    $('.direct-chat-msg').append(result);
    $('.submit_bet').click(function () {
        let id = $(this).attr('id').split('-')[0];
        let bet = $(`#${id}-bet`).val();
        let type = 'wingo';
        $.ajax({
            type: 'POST',
            url: '/api/webapi/admin/change/bet',
            data: {
                id,
                bet,
                type,
            },
            dataType: 'json',
            success: function (res) {
                let { status, msg } = res;
                alertMess(msg);
            },
        });
    });
}

socket.on('data-server_2', function (msg) {
    console.log(msg);
    showJoinMember2(msg.bet[0]);
    $('.direct-chat-warning .direct-chat-messages').animate(
        {
            scrollTop: $('.direct-chat-msg').prop('scrollHeight'),
        },
        750
    );
    if (msg.level == 1) return;
    var red = Number($('.orderRed').attr('totalmoney'));
    var green = Number($('.orderViolet').attr('totalmoney'));
    var violet = Number($('.orderGreen').attr('totalmoney'));
    var n0 = Number($('.orderNumber:eq(0)').attr('totalmoney'));
    var n1 = Number($('.orderNumber:eq(1)').attr('totalmoney'));
    var n2 = Number($('.orderNumber:eq(2)').attr('totalmoney'));
    var n3 = Number($('.orderNumber:eq(3)').attr('totalmoney'));
    var n4 = Number($('.orderNumber:eq(4)').attr('totalmoney'));
    var n5 = Number($('.orderNumber:eq(5)').attr('totalmoney'));
    var n6 = Number($('.orderNumber:eq(6)').attr('totalmoney'));
    var n7 = Number($('.orderNumber:eq(7)').attr('totalmoney'));
    var n8 = Number($('.orderNumber:eq(8)').attr('totalmoney'));
    var n9 = Number($('.orderNumber:eq(9)').attr('totalmoney'));
    var n = Number($('.orderNumber:eq(10)').attr('totalmoney'));
    var l = Number($('.orderNumber:eq(11)').attr('totalmoney'));
    var ns = Number($('.orderNumbers').attr('totalmoney', ns));

    if (msg.join == '0') n0 += msg.money - msg.money * 0.02;
    if (msg.join == '1') n1 += msg.money - msg.money * 0.02;
    if (msg.join == '2') n2 += msg.money - msg.money * 0.02;
    if (msg.join == '3') n3 += msg.money - msg.money * 0.02;
    if (msg.join == '4') n4 += msg.money - msg.money * 0.02;
    if (msg.join == '5') n5 += msg.money - msg.money * 0.02;
    if (msg.join == '6') n6 += msg.money - msg.money * 0.02;
    if (msg.join == '7') n7 += msg.money - msg.money * 0.02;
    if (msg.join == '8') n8 += msg.money - msg.money * 0.02;
    if (msg.join == '9') n9 += msg.money - msg.money * 0.02;
    if (msg.join == 'x') green += msg.money - msg.money * 0.02;
    if (msg.join == 't') violet += msg.money - msg.money * 0.02;
    if (msg.join == 'd') red += msg.money - msg.money * 0.02;
    if (msg.join == 'l') l += msg.money - msg.money * 0.02;
    if (msg.join == 'n') n += msg.money - msg.money * 0.02;
    ns = n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;

    $('.orderRed').text(formatMoney(red, ','));
    $('.orderViolet').text(formatMoney(violet, ','));
    $('.orderGreen').text(formatMoney(green, ','));
    $('.orderNumber:eq(0)').text(formatMoney(n0, ','));
    $('.orderNumber:eq(1)').text(formatMoney(n1, ','));
    $('.orderNumber:eq(2)').text(formatMoney(n2, ','));
    $('.orderNumber:eq(3)').text(formatMoney(n3, ','));
    $('.orderNumber:eq(4)').text(formatMoney(n4, ','));
    $('.orderNumber:eq(5)').text(formatMoney(n5, ','));
    $('.orderNumber:eq(6)').text(formatMoney(n6, ','));
    $('.orderNumber:eq(7)').text(formatMoney(n7, ','));
    $('.orderNumber:eq(8)').text(formatMoney(n8, ','));
    $('.orderNumber:eq(9)').text(formatMoney(n9, ','));
    $('.orderNumber:eq(10)').text(formatMoney(l, ','));
    $('.orderNumber:eq(11)').text(formatMoney(n, ','));
    $('.orderNumbers').text(formatMoney(ns, ','));

    $('.orderRed').attr('totalmoney', red);
    $('.orderViolet').attr('totalmoney', green);
    $('.orderGreen').attr('totalmoney', violet);
    $('.orderNumber:eq(0)').attr('totalmoney', n0);
    $('.orderNumber:eq(1)').attr('totalmoney', n1);
    $('.orderNumber:eq(2)').attr('totalmoney', n2);
    $('.orderNumber:eq(3)').attr('totalmoney', n3);
    $('.orderNumber:eq(4)').attr('totalmoney', n4);
    $('.orderNumber:eq(5)').attr('totalmoney', n5);
    $('.orderNumber:eq(6)').attr('totalmoney', n6);
    $('.orderNumber:eq(7)').attr('totalmoney', n7);
    $('.orderNumber:eq(8)').attr('totalmoney', n8);
    $('.orderNumber:eq(9)').attr('totalmoney', n9);
    $('.orderNumber:eq(10)').attr('totalmoney', n);
    $('.orderNumber:eq(11)').attr('totalmoney', l);
    $('.orderNumbers').attr('totalmoney', ns);
});

function showListOrder4(list_orders, x) {
    let htmls = '';
    let result = list_orders.map((list_orders) => {
        return (htmls += `
                    <div data-v-a9660e98="" class="c-tc item van-row">
                        <div data-v-a9660e98="" class="van-col van-col--8">
                            <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                            }</div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <!---->
                                <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0
                                        ? 'red'
                                        : 'green'
                                }"> ${list_orders.amount} </span>
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? 'Nhỏ' : 'Lớn'
                                } </span>
                                <!---->
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--6">
                            <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                    <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                            ? 'red'
                                            : 'green'
                                    }"></span>
                                    ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                            ? '<span data-v-a9660e98="" class="li violet"></span>'
                                            : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
    });
    $(`#list-orders`).html(htmls);
}

socket.on('data-server', function (msg) {
    if (msg.data[0].game != game) return;
    $('.direct-chat-msg').html('');
    $('.info-box-number').text('0');
    let data1 = msg.data[0]; // lấy ra cầu mới nhất
    $('.reservation-chunk-sub-num').text(data1.period);
    let data2 = []; // lấy ra cầu cũ
    let data3 = data2.push(msg.data[1]);
    $('.direct-chat-warning .direct-chat-messages').animate(
        {
            scrollTop: $('.direct-chat-msg').prop('scrollHeight'),
        },
        750
    );
    $.ajax({
        type: 'POST',
        url: '/api/webapi/admin/totalJoin',
        data: {
            typeid: typeid,
        },
        dataType: 'json',
        success: function (response) {
            var red = 0;
            var green = 0;
            var violet = 0;
            var n0 = 0;
            var n1 = 0;
            var n2 = 0;
            var n3 = 0;
            var n4 = 0;
            var n5 = 0;
            var n6 = 0;
            var n7 = 0;
            var n8 = 0;
            var n9 = 0;
            var n = 0;
            var l = 0;
            var ns = 0;
            var length = response.datas.length;
            var datas = response.datas;
            for (let i = 0; i < length; i++) {
                if (datas[i].bet == '0') n0 += datas[i].money;
                if (datas[i].bet == '1') n1 += datas[i].money;
                if (datas[i].bet == '2') n2 += datas[i].money;
                if (datas[i].bet == '3') n3 += datas[i].money;
                if (datas[i].bet == '4') n4 += datas[i].money;
                if (datas[i].bet == '5') n5 += datas[i].money;
                if (datas[i].bet == '6') n6 += datas[i].money;
                if (datas[i].bet == '7') n7 += datas[i].money;
                if (datas[i].bet == '8') n8 += datas[i].money;
                if (datas[i].bet == '9') n9 += datas[i].money;
                if (datas[i].bet == 'x') green += datas[i].money;
                if (datas[i].bet == 't') violet += datas[i].money;
                if (datas[i].bet == 'd') red += datas[i].money;
                if (datas[i].bet == 'l') l += datas[i].money;
                if (datas[i].bet == 'n') n += datas[i].money;
            }
            ns = n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;
            $('.orderRed').text(formatMoney(red, ','));
            $('.orderViolet').text(formatMoney(violet, ','));
            $('.orderGreen').text(formatMoney(green, ','));
            $('.orderNumber:eq(0)').text(formatMoney(n0, ','));
            $('.orderNumber:eq(1)').text(formatMoney(n1, ','));
            $('.orderNumber:eq(2)').text(formatMoney(n2, ','));
            $('.orderNumber:eq(3)').text(formatMoney(n3, ','));
            $('.orderNumber:eq(4)').text(formatMoney(n4, ','));
            $('.orderNumber:eq(5)').text(formatMoney(n5, ','));
            $('.orderNumber:eq(6)').text(formatMoney(n6, ','));
            $('.orderNumber:eq(7)').text(formatMoney(n7, ','));
            $('.orderNumber:eq(8)').text(formatMoney(n8, ','));
            $('.orderNumber:eq(9)').text(formatMoney(n9, ','));
            $('.orderNumber:eq(10)').text(formatMoney(l, ','));
            $('.orderNumber:eq(11)').text(formatMoney(n, ','));
            $('.orderNumbers').text(formatMoney(ns, ','));

            $('.orderRed').attr('totalmoney', red);
            $('.orderViolet').attr('totalmoney', violet);
            $('.orderGreen').attr('totalmoney', green);
            $('.orderNumber:eq(0)').attr('totalmoney', n0);
            $('.orderNumber:eq(1)').attr('totalmoney', n1);
            $('.orderNumber:eq(2)').attr('totalmoney', n2);
            $('.orderNumber:eq(3)').attr('totalmoney', n3);
            $('.orderNumber:eq(4)').attr('totalmoney', n4);
            $('.orderNumber:eq(5)').attr('totalmoney', n5);
            $('.orderNumber:eq(6)').attr('totalmoney', n6);
            $('.orderNumber:eq(7)').attr('totalmoney', n7);
            $('.orderNumber:eq(8)').attr('totalmoney', n8);
            $('.orderNumber:eq(9)').attr('totalmoney', n9);
            $('.orderNumber:eq(10)').attr('totalmoney', l);
            $('.orderNumber:eq(11)').attr('totalmoney', n);
            $('.orderNumbers').attr('totalmoney', ns);

            response.datas.map((data) => {
                showJoinMember(data);
            });
            showListOrder3(response.list_orders);
            $('.direct-chat-warning .direct-chat-messages').animate(
                {
                    scrollTop: $('.direct-chat-msg').prop('scrollHeight'),
                },
                750
            );
            $('.reservation-chunk-sub-num').text(response.lotterys[0].period);
            let is = '';
            if (typeid == '1')
                is = $('#ketQua').text(
                    `kết quả tiếp theo: ${
                        response.setting[0].wingo1 == '-1'
                            ? 'Random'
                            : response.setting[0].wingo1
                    }`
                );
            if (typeid == '2')
                is = $('#ketQua').text(
                    `kết quả tiếp theo: ${
                        response.setting[0].wingo3 == '-1'
                            ? 'Random'
                            : response.setting[0].wingo3
                    }`
                );
            if (typeid == '3')
                is = $('#ketQua').text(
                    `kết quả tiếp theo: ${
                        response.setting[0].wingo5 == '-1'
                            ? 'Random'
                            : response.setting[0].wingo5
                    }`
                );
            if (typeid == '4')
                is = $('#ketQua').text(
                    `kết quả tiếp theo: ${
                        response.setting[0].wingo10 == '-1'
                            ? 'Random'
                            : response.setting[0].wingo10
                    }`
                );

            if (typeid == '1')
                $('#winrate').text(
                    `Kết quả tiếp theo: ${
                        response.setting[0].bs1 == '-1'
                            ? 'Random'
                            : response.setting[0].bs1
                    }`
                );
            if (typeid == '2')
                $('#winrate').text(
                    `Kết quả tiếp theo: ${
                        response.setting[0].bs3 == '-1'
                            ? 'Random'
                            : response.setting[0].bs3
                    }`
                );
            if (typeid == '3')
                $('#winrate').text(
                    `Kết quả tiếp theo: ${
                        response.setting[0].bs5 == '-1'
                            ? 'Random'
                            : response.setting[0].bs5
                    }`
                );
            if (typeid == '4')
                $('#winrate').text(
                    `Kết quả tiếp theo: ${
                        response.setting[0].bs10 == '-1'
                            ? 'Random'
                            : response.setting[0].bs10
                    }`
                );
        },
    });
});
function showListOrder3(list_orders, x) {
    let htmls = '';
    let result = list_orders.map((list_orders) => {
        return (htmls += `
                    <div data-v-a9660e98="" class="c-tc item van-row">
                        <div data-v-a9660e98="" class="van-col van-col--8">
                            <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                            }</div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <!---->
                                <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0
                                        ? 'red'
                                        : 'green'
                                }"> ${list_orders.amount} </span>
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--5">
                            <div data-v-a9660e98="" class="c-tc goItem">
                                <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? 'Nhỏ' : 'Lớn'
                                } </span>
                                <!---->
                            </div>
                        </div>
                        <div data-v-a9660e98="" class="van-col van-col--6">
                            <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                    <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                            ? 'red'
                                            : 'green'
                                    }"></span>
                                    ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                            ? '<span data-v-a9660e98="" class="li violet"></span>'
                                            : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
    });
    $(`#list-orders`).html(htmls);
    // $(`.game-list .con-box:eq(${x}) .hb .c-tc`).last().remove();
}

$.ajax({
    type: 'POST',
    url: '/api/webapi/admin/totalJoin',
    data: {
        typeid: typeid,
    },
    dataType: 'json',
    success: function (response) {
        var red = 0;
        var green = 0;
        var violet = 0;
        var n0 = 0;
        var n1 = 0;
        var n2 = 0;
        var n3 = 0;
        var n4 = 0;
        var n5 = 0;
        var n6 = 0;
        var n7 = 0;
        var n8 = 0;
        var n9 = 0;
        var n = 0;
        var l = 0;
        var ns = 0;
        var length = response.datas.length;
        var datas = response.datas;
        for (let i = 0; i < length; i++) {
            if (datas[i].bet == '0') n0 += datas[i].money;
            if (datas[i].bet == '1') n1 += datas[i].money;
            if (datas[i].bet == '2') n2 += datas[i].money;
            if (datas[i].bet == '3') n3 += datas[i].money;
            if (datas[i].bet == '4') n4 += datas[i].money;
            if (datas[i].bet == '5') n5 += datas[i].money;
            if (datas[i].bet == '6') n6 += datas[i].money;
            if (datas[i].bet == '7') n7 += datas[i].money;
            if (datas[i].bet == '8') n8 += datas[i].money;
            if (datas[i].bet == '9') n9 += datas[i].money;
            if (datas[i].bet == 'x') green += datas[i].money;
            if (datas[i].bet == 't') violet += datas[i].money;
            if (datas[i].bet == 'd') red += datas[i].money;
            if (datas[i].bet == 'l') l += datas[i].money;
            if (datas[i].bet == 'n') n += datas[i].money;
        }
        ns = n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9;
        $('.orderRed').text(formatMoney(red, ','));
        $('.orderViolet').text(formatMoney(violet, ','));
        $('.orderGreen').text(formatMoney(green, ','));
        $('.orderNumber:eq(0)').text(formatMoney(n0, ','));
        $('.orderNumber:eq(1)').text(formatMoney(n1, ','));
        $('.orderNumber:eq(2)').text(formatMoney(n2, ','));
        $('.orderNumber:eq(3)').text(formatMoney(n3, ','));
        $('.orderNumber:eq(4)').text(formatMoney(n4, ','));
        $('.orderNumber:eq(5)').text(formatMoney(n5, ','));
        $('.orderNumber:eq(6)').text(formatMoney(n6, ','));
        $('.orderNumber:eq(7)').text(formatMoney(n7, ','));
        $('.orderNumber:eq(8)').text(formatMoney(n8, ','));
        $('.orderNumber:eq(9)').text(formatMoney(n9, ','));
        $('.orderNumber:eq(10)').text(formatMoney(l, ','));
        $('.orderNumber:eq(11)').text(formatMoney(n, ','));
        $('.orderNumbers').text(formatMoney(ns, ','));

        $('.orderRed').attr('totalmoney', red);
        $('.orderViolet').attr('totalmoney', violet);
        $('.orderGreen').attr('totalmoney', green);
        $('.orderNumber:eq(0)').attr('totalmoney', n0);
        $('.orderNumber:eq(1)').attr('totalmoney', n1);
        $('.orderNumber:eq(2)').attr('totalmoney', n2);
        $('.orderNumber:eq(3)').attr('totalmoney', n3);
        $('.orderNumber:eq(4)').attr('totalmoney', n4);
        $('.orderNumber:eq(5)').attr('totalmoney', n5);
        $('.orderNumber:eq(6)').attr('totalmoney', n6);
        $('.orderNumber:eq(7)').attr('totalmoney', n7);
        $('.orderNumber:eq(8)').attr('totalmoney', n8);
        $('.orderNumber:eq(9)').attr('totalmoney', n9);
        $('.orderNumber:eq(10)').attr('totalmoney', l);
        $('.orderNumber:eq(11)').attr('totalmoney', n);
        $('.orderNumbers').attr('totalmoney', ns);

        response.datas.map((data) => {
            showJoinMember(data);
        });
        showListOrder3(response.list_orders);
        $('.direct-chat-warning .direct-chat-messages').animate(
            {
                scrollTop: $('.direct-chat-msg').prop('scrollHeight'),
            },
            750
        );
        $('.reservation-chunk-sub-num').text(response.lotterys[0].period);
        let is = '';
        if (typeid == '1')
            is = $('#ketQua').text(
                `kết quả tiếp theo: ${
                    response.setting[0].wingo1 == '-1'
                        ? 'Random'
                        : response.setting[0].wingo1
                }`
            );
        if (typeid == '2')
            is = $('#ketQua').text(
                `kết quả tiếp theo: ${
                    response.setting[0].wingo3 == '-1'
                        ? 'Random'
                        : response.setting[0].wingo3
                }`
            );
        if (typeid == '3')
            is = $('#ketQua').text(
                `kết quả tiếp theo: ${
                    response.setting[0].wingo5 == '-1'
                        ? 'Random'
                        : response.setting[0].wingo5
                }`
            );
        if (typeid == '4')
            is = $('#ketQua').text(
                `kết quả tiếp theo: ${
                    response.setting[0].wingo10 == '-1'
                        ? 'Random'
                        : response.setting[0].wingo10
                }`
            );

        if (typeid == '1')
            $('#winrate').text(
                `Kết quả tiếp theo: ${
                    response.setting[0].bs1 == '-1'
                        ? 'Random'
                        : response.setting[0].bs1
                }`
            );
        if (typeid == '2')
            $('#winrate').text(
                `Kết quả tiếp theo: ${
                    response.setting[0].bs3 == '-1'
                        ? 'Random'
                        : response.setting[0].bs3
                }`
            );
        if (typeid == '3')
            $('#winrate').text(
                `Kết quả tiếp theo: ${
                    response.setting[0].bs5 == '-1'
                        ? 'Random'
                        : response.setting[0].bs5
                }`
            );
        if (typeid == '4')
            $('#winrate').text(
                `Kết quả tiếp theo: ${
                    response.setting[0].bs10 == '-1'
                        ? 'Random'
                        : response.setting[0].bs10
                }`
            );
    },
});

$('.start-order').click(function (e) {
    e.preventDefault();
    let value = $('#editResult').val();
    let arr = value.split('|');
    for (let i = 0; i < arr.length; i++) {
        let check = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(
            String(arr[i])
        );
        if (arr[i] == '' || arr[i].length > 1 || !check) {
            alert('Vui lòng nhập đúng định dạng (VD: 1|4|5|1|5)');
            return false;
        }
    }
    if (value != '') {
        $.ajax({
            type: 'POST',
            url: '/api/webapi/admin/change',
            data: {
                type: 'change-wingo1',
                value: value,
                typeid: typeid,
            },
            dataType: 'json',
            success: function (response) {
                Swal.fire('Good job!', `${response.message}`, 'success');
                $('#ketQua').text(`kết quả tiếp theo: ${value}`);
            },
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
});

// $('.editWinRate').click(function (e) {
//     e.preventDefault();
//     let value = $('#editWinRate').val();
//     let arr = value.split('|');
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] == "" || arr[i].length > 1 || arr[i] != 0 && arr[i] != '1') {
//             alert("Vui lòng nhập đúng định dạng (VD: 1|0|0|1|1)");
//             return false;
//         }
//     }
//     if (value != '') {
//         $.ajax({
//             type: "POST",
//             url: "/api/webapi/admin/change",
//             data: {
//                 type: 'change-win_rate',
//                 value: value,
//                 typeid: typeid,
//             },
//             dataType: "json",
//             success: function (response) {
//                 Swal.fire(
//                     'Good job!',
//                     `${response.message}`,
//                     'success'
//                 );
//                 $('#ketQua').text(`kết quả tiếp theo: ${value}`);
//             }
//         });
//     } else {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: 'Something went wrong!',
//         })
//     }
// });
