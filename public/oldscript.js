var CryptoJS = require('crypto-js');
// data fetching

const inputTextDOM = document.getElementById("tweetBox__input");
//formDomを追加する。
const formDOM = document.querySelector(".tweetBox");
const threadSectionDOM = document.querySelector(".thread-section");
let inputText = "";

let ngwords = [];
let Id = [];
let delayInMilliseconds = 2000;


//Load JSON file for the "word ban" feature. Takes about 2000ms async.
let requestURL = 'https://raw.githubusercontent.com/dariusk/wordfilter/master/lib/badwords.json';
let request = new XMLHttpRequest(); 


//最初はThreadを全て読み込む
const getAllThreads = async () => {
  try {
    console.log("show");
    let allThreads = await axios.get("/api/v1/threads");
    console.log(allThreads);
    let { data } = allThreads;
    //出力
    allThreads = data
      .map((thread) => {
        const { title } = thread;
        console.log(title);
        return `
        <div class="single-thread">
          <div class="thread" onclick="module.thread()">${title}</div>
        </div>
      `;
      })
      .join("");
    //挿入
    threadSectionDOM.innerHTML = allThreads;
  } catch (err) {
    console.log(err);
  }
};

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (inputText) {
    console.log("success");
    //postメソッドで送信する。

    try {
      console.log(inputText);
      await axios.post("/ap1/v1/thread", {
        title: inputText,
      });
      getAllThreads();
    } catch (err) {
      console.log(err);
    }

    //投稿したらinputのvalueを削除
    inputText = "";
    inputTextDOM.value = "";
  } else {
    console.log("error");
  }
});

//getAllThreads();

//タイトルと内容を打ち込んだらpostメソッドを実装してデータ追加。
inputTextDOM.addEventListener("change", (e) => {
  //   console.log(e.target.value);
  inputText = e.target.value;
});



//tunagime
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
const ng = request.onload = function(){ //When the JSON has been loaded.
    const ngwords = request.response; //ngwords = JS object(array) that contains a list of bad words in it.
    return{ 
        ngwords //Output ngwords(array) outside of the function to utilize it as a list.
    };
};

// peerオブジェクト
const peer = new Peer({
    key: '1b703875-3805-4c38-93d2-3c9f2f5c9c57',// 自分のAPIキーを入力
    debug: 3,
});

//ボタンでページ遷移
async function check(){
    var check = document.getElementById("tweetBox__input").value;
    if (check == '') {
      alert("The title cannot be empty!");
    }
    else {
      console.log(inputText);
      //await axios.post("/ap1/v1/thread", {
      //  title: inputText,
      //});
      getAllThreads();

      window.location.href = 'thread.html?room=' + check;
      return false;
    }
}

function thread(){
    $(document).click(function(event) {
        var text = $(event.target).text();
        var url = "thread.html";
        location.href = url + '?room=' + text; // new ur
    });
};

// Usage:
//async function demo() {
//  await waitFor(_ => flag === true);
//  console.log('the wait is over!');
//}

// 入室
let room = null;
let count = 0;
    function join(roomname)
    {
    room = peer.joinRoom(roomname,{mode: 'mesh'});
    sidelog('Now joining <i>' + roomname + '</i> room.');
	setTimeout(function() {
	const pcs = room.getPeerConnections();
		
	for ([peerId, pc] of Object.entries(pcs)) {
	  Id.push(peerId);
	}
	count = (Id.length + 1)
	sidelog("There are " + count + " user(s) here.");
	const log = document.getElementById('count');
	log.textContent = ("USER COUNT: " + count);
	}, 2000); // We have to wait 2 seconds, or it won't work lol

// チャットを送信
    $('#send').click(function(){
        var msg = $('#msg').val();
        if (msg.indexOf("<") != -1 || msg.indexOf(">") != -1){
        alert("XSS Protection!")
        } else{
          room.send(msg);
          chatlog('You> ' + msg);
        }
    });

// チャットを受信
    room.on('data', function(data){
        msgRecieve = data.data;
        for(i = 0; i < ng().ngwords.length; i++){ //Search for the bad word
            if(msgRecieve.indexOf(ng().ngwords[i]) != -1){
                msgRecieve = msgRecieve.length; //Convert the bad word with "Hashtag" if the received message contains a bad word.
                msgRecieve = '#'.repeat(msgRecieve);
                break;
            }
        }
        chatlog('ID: ' + String(CryptoJS.SHA256(data.src)).substring(0,16) + '> ' + msgRecieve); //data.src = 送信者のpeerid, data.data = 送信されたメッセージ
    });
    
    room.on("peerJoin", (peerId) => {
        count++;
        const log = document.getElementById('count');
        sidelog("User: " + String(CryptoJS.SHA256(peerId)).substring(0,16) + " joined.");
        log.textContent = ("USER COUNT: " + count);
    });

    room.on("peerLeave", (peerId) => {
        count--;
        const log = document.getElementById('count');
        sidelog("User: " + String(CryptoJS.SHA256(peerId)).substring(0,16) + " left.");
        log.textContent = ("USER COUNT: " + count);
    });

    room.on("close", () => {
        Id.splice(0);
    });
    
};


// 退室
$('#leave').click(function(){
    roomname = room.name;
    room.close();
    chatlog('Now leaving: <i>' + roomname + '</i> room.');
    setTimeout(function() {
        location.href = 'index.html';
    }, 1500);
})

// チャットログに記録するための関数
function chatlog(msg){  $('#chatLog').append('<p>' + msg + '</p>');
}

function sidelog(msg){  $('.sidebar').append('<p>' + msg + '</p>');
}