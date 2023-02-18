
//define all the var
let i = 0;
let msg;
const ngwords ="";

let requestURL = 'https://raw.githubusercontent.com/dariusk/wordfilter/master/lib/badwords.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
const ng = request.onload = function(){
    const ngwords = request.response;
    return{
        ngwords
    };
};



// 入室
let room = null;
$('#join').click(function(){
     chatlog('<i>' + $('#roomName').val() + '</i>に入室しました');
     console.log(ng().ngwords.length);
// XMLHttpRequest(XHR)を使ってJSONを読み込む。

// チャットを送信
    $('#send').click(function(obj){
        let msg = $('#msg').val()
        for(i=0; i < ng().ngwords.length; i++){
            if(msg.indexOf(ng().ngwords[i]) != -1){
                chatlog('Stop that trashtalk');
                msg = "Hashtag";
                break;
            }
        }
        chatlog("自分> " + msg);
    });
});

// 退室
$('#leave').click(function(){
    room.close();
    chatlog('<i>' + $('#roomName').val() + '</i>から退室しました');
})

// チャットログに記録するための関数
function chatlog(msg){$('#chatLog').append('<p>' + msg + '</p>');
}