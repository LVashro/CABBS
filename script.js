let ngwords = [];
let Id = [];
let delayInMilliseconds = 1000;

//Load JSON file for the "word ban" feature. Takes about 2000ms async.
let requestURL = 'https://raw.githubusercontent.com/dariusk/wordfilter/master/lib/badwords.json';
let request = new XMLHttpRequest(); 
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
const ng = request.onload = function(){ //When the JSON has been loaded.
    const ngwords = request.response; //ngwords = JS object(array) that contains a list of bad words in it.
    return{ //Output ngwords(array) outside of the function to utilize it as a list.
        ngwords 
    };
};

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
    chatlog('Now joining <i>' + $('#roomName').val() + '</i> room.');

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
        chatlog('You> ' + msg);
    });

// チャットを受信
    room.on('data', function(data){
        for(i = 0; i < ng().ngwords.length; i++){ //Search for the bad word
            if(data.data.indexOf(ng().ngwords[i]) != -1){
                chatlog('Stop that trashtalk');
                data.data = "Hashtag"; //Convert the bad word with "Hashtag" if the received message contains a bad word.
                break;
            }
        }
        chatlog('ID: ' + data.src + '> ' + data.data); //data.src = 送信者のpeerid, data.data = 送信されたメッセージ
    });
    
    room.on("peerJoin", () => {
        count++;
        chatlog("User joined: " + count + " user(s) now.");
    });

    room.on("peerLeave", () => {
        count--;
        chatlog("User left: " + count + " user(s) now.");
    });

    room.on("close", () => {
        Id.splice(0);
    });
    
});


// 退室
$('#leave').click(function(){
    room.close();
    chatlog('Now leaving: <i>' + $('#roomName').val() + '</i> room.');
})

// チャットログに記録するための関数
function chatlog(msg){  $('#chatLog').append('<p>' + msg + '</p>');
}