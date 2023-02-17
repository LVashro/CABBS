let ngwords = [];
let Id = [];

// peerオブジェクト
const peer = new Peer({
    key: '1b703875-3805-4c38-93d2-3c9f2f5c9c57',// 自分のAPIキーを入力
debug: 3
});

// 入室
let room = null;
    $('#join').click(function()
    {room = peer.joinRoom($('#roomName').val(),{mode: 'mesh'});
    chatlog('<i>' + $('#roomName').val() + '</i>に入室しました');

// NGワードリストを読み込む?
//    $.getJSON('data/ngwords.json',
//    json => {ngwords = json.data;});

// チャットを送信
    $('#send').click(function(){
        var msg = $('#msg').val();
        room.send(msg);
        chatlog('自分> ' + msg);
    });

// チャットを受信
    room.on('data', function(data){

        chatlog('ID: ' + data.src + '> ' + data.data); //data.src = 送信者のpeerid, data.data = 送信されたメッセージ
    });

    room.on("open", (peerId) => {
        Id.push(peerId);
        chatlog("There are " + Id.length + " users here.");
        //Id.forEach(element => chatlog(element));
    });
});


// 退室
$('#leave').click(function(){
    room.close();
    chatlog('<i>' + $('#roomName').val() + '</i>から退室しました');
})

// チャットログに記録するための関数
function chatlog(msg){  $('#chatLog').append('<p>' + msg + '</p>');
}