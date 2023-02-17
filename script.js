let ngwords = [];
let Id = [];
let delayInMilliseconds = 2000;

// peerオブジェクト
const peer = new Peer({
    key: '1b703875-3805-4c38-93d2-3c9f2f5c9c57',// 自分のAPIキーを入力
debug: 3
});

// 入室
let room = null;
let count = 0;
    $('#join').click(function()
    {room = peer.joinRoom($('#roomName').val(),{mode: 'mesh'});
    chatlog('<i>' + $('#roomName').val() + '</i>に入室しました');

    setTimeout(function() {
    const pcs = room.getPeerConnections();
    
    for ([peerId, pc] of Object.entries(pcs)) {
      Id.push(peerId);
    }
    count = (Id.length + 1)
    chatlog("There are " + count + " user(s) here.");
    }, delayInMilliseconds);

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
    
    room.on("open", () => {
        if (count != 0){
            count++;
            chatlog("User joined: " + count + " users now.");
        }
    });

    room.on("peerLeave", () => {
        count--;
        chatlog("User left: " + count + " users now.");
    });

    room.on("close", () => {
        Id.splice(0);
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