// http://music.163.com/api/playlist/detail?id=14493305 网易音乐单地址
// 基础数据
var controller = document.getElementById("controller").getElementsByTagName("span");
var player = {
    playlist: result.tracks,
    music: document.getElementById("music"),
    currentIndex: 0,
    singleLoop: false,
    el: {
        background: $("#bg"),
        diskImg:document.getElementById("diskImg"),
        needle:document.getElementById("needle"),
        diskCover:document.getElementById("diskCover"),
        loop: document.getElementById("loopBtn"),
        pre: controller[1],
        start: controller[2],
        stop: controller[3],
        next: controller[4],
        showList: controller[5],
        songName: document.getElementById("songName"),
        author: document.getElementById("artist"),
        currentTime: document.getElementById("currentTime"),
        totalTime: document.getElementById("totalTime"),
        processBar: document.getElementById("processBar"),
        readyBar: document.getElementById("readyBar"),
        currentBar: document.getElementById("currentBar"),
        processBtn: document.getElementById("processBtn")
    }
};
// 功能函数
function validateTime(number) {
    return isNaN(number) ? '00' : (number > 10 ? number + '' : '0' + number).substring(0, 2);
}
// 控制台操作
player.init = function () {
    var currentSong = player.playlist[player.currentIndex];
    player.el.songName.innerHTML = currentSong.name;
    player.el.author.innerHTML = currentSong.artists[0].name;
    player.el.background.css('background-image', 'url(' + currentSong.album.picUrl + ')');
    player.el.diskImg.src=currentSong.album.picUrl;
    player.music.src = currentSong.mp3Url;
};
player.start = function () {
    player.music.play();
    player.el.diskCover.style.animationPlayState="running";
    player.el.diskCover.style.webkitAnimationPlayState="running";
    player.el.needle.classList.remove("pause-needle");
    player.el.start.style.display = "none";
    player.el.stop.style.display = "";
};
player.stop = function () {
    player.music.pause();
    player.el.diskCover.style.animationPlayState="paused";
    player.el.diskCover.style.webkitAnimationPlayState="paused";
    player.el.needle.classList.add("pause-needle");
    player.el.start.style.display = "";
    player.el.stop.style.display = "none";
};
player.toggle=function () {
    player.music.paused?player.start():player.stop();
};
player.next = function () {
    if (player.currentIndex < player.playlist.length)player.currentIndex++;
    player.init();
    player.start();
};
player.pre = function () {
    if (player.currentIndex > 0)player.currentIndex--;
    player.init();
    player.start();
};
player.changeStyle = function () {
    if (player.singleLoop) {
        player.singleLoop = false;
        player.el.loop.innerHTML = "";
    } else {
        player.singleLoop = true;
        player.el.loop.innerHTML = 1;
    }
};
// 进度条
player.updateProcess = function () {
    var totalTime = player.music.duration,
        bufferTime = player.music.buffered.end(0) - player.music.buffered.start(0),
        currentTime = player.music.currentTime;
    player.el.currentTime.innerHTML = validateTime(currentTime / 60) + ":" + validateTime(currentTime % 60);
    player.el.totalTime.innerHTML = validateTime(totalTime / 60) + ":" + validateTime(totalTime % 60);
    player.el.readyBar.style.width = bufferTime / totalTime * 100 + "%";
    player.el.currentBar.style.width = currentTime / totalTime * 100 + "%";
};
player.processControl = function (e) {
    e.preventDefault();
    var x = e.clientX,
        w = player.el.currentBar.offsetWidth;
    document.onmousemove = function (e) {
        e.preventDefault();
        if (e.clientX - x + w > 0 && e.clientX - x + w < 274) {
            player.el.currentBar.style.width = w + e.clientX - x + "px";
        }
    };
    document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
        player.music.currentTime = player.el.currentBar.offsetWidth / player.el.processBar.offsetWidth * player.music.duration;
    };
};
// 初始化
player.init();
processTimer = setInterval(player.updateProcess, 500);
player.music.addEventListener('ended', function () {
    if (player.singleLoop) {
        player.start();
    } else {
        player.next();
    }
});
player.el.start.addEventListener("click", player.start);
player.el.stop.addEventListener("click", player.stop);
player.el.diskCover.addEventListener("click",player.toggle);
player.el.next.addEventListener("click", player.next);
player.el.pre.addEventListener("click", player.pre);
player.el.loop.addEventListener("click", player.changeStyle);
player.el.processBtn.addEventListener("mousedown", player.processControl);