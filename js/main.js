const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "Phuc_Player";

const options = $(".options");
const playlist = $(".playlist");
const cd = $(".playing_part");
const heading = $(`.song_title p:nth-child(${1})`);
const singer = $(`.song_title p:nth-child(${2})`);
const cdThumb = $("#img");
const audio = $("#audio");
const currentTime = $(".range_slider p");
const playBtn = $("#play_btn");
const progress = $(".progress");
const nextBtn = $("#next-btn");
const prevBtn = $("#previous-btn");
const repeatBtn = $("#repeat-btn");
const likeBtn = $("#like");
const randomBtn = $("#random-btn");
const optionLeft = $(".menu-left");
const optionRight = $(".menu-right");
const volume = $(".volume");
const volumnIcon = $("#volumn_icon");
const recent_volume = $("#volume");
var selectedSong = '';

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isLiked: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Sau này, hãy gặp lại nhau khi hoa nở",
      singer: "Nguyên Hà",
      path: "audio/Nguyên Hà – Sau Này, Hãy Gặp Lại Nhau Khi Hoa Nở.mp3",
      image:"img/1 (2).jfif"
    },
    {
      name: "Tình yêu khủng long",
      singer: "Fay",
      path: "audio/TinhYeuKhungLong-FAY-6247040.mp3",
      image: "img/1 (5).png",
    },
    {
      name: "Hôm nay tôi buồn",
      singer: "Phùng Khánh Linh",
      path: "audio/Phùng Khánh Linh - Hôm Nay Tôi Buồn.mp3",
      image:"img/1 (4).jfif"
    },
    {
      name: "Đi qua hoa cúc",
      singer: "Cover NHA",
      path: "audio/DiQuaHoaCucCover-NHA-5051450.mp3",
      image:"img/1 (3).jfif",
    },    
    {
      name: "Cổ điển",
      singer: "Tofu x VoVanDuc",
      path:"audio/Cổ Điển - Classic Love - Tofu x VoVanDuc. (Official Audio).mp3",
      image: "img/1 (11).jpg"
    },
    {
      name: "Ghé qua",
      singer: "Dick x PC x Tofu",
      path: "audio/GHÉ QUA - OFFICIAL MV - Dick x PC x Tofu.mp3",
      image:"img/1 (12).jpg"
    },
    {
      name: "Lãng du",
      singer: "Tofu ft.An",
      path: "audio/Lãng Du - ToFu ft. An (Prod. by VoVanDuc) - tas release.mp3",
      image:"img/1 (4).jpg"
    },
    {
      name: "Mãi mãi sẽ hết vào ngày mai",
      singer: "Andiez",
      path:"audio/MÃI MÃI SẼ HẾT VÀO NGÀY MAI - ANDIEZ - OFFICIAL MV.mp3",
      image:"img/1 (10).jpg"
    },
    {
      name: "Nhẹ (Nhắm Mắt Thấy Mùa Hè OST)",
      singer: "Uyên Pím",
      path:"audio/Uyên Pím – Nhẹ (Nhắm Mắt Thấy Mùa Hè OST).mp3",
      image:"img/1 (5).jpg"
    },
    {
      name: "Mẹ ơi, cho con về nhà",
      singer: "Trang - Phùng khánh Linh",
      path:"audio/MeOiChoConVeNha-TrangPhungKhanhLinh-5886286.mp3",
      image:"img/1 (5).jfif"
    },
    {
      name: "Thế là thôi",
      singer: "Hoàng Phương Trà My",
      path:"audio/[lyric video] Thế là thôi ‣ Hoàng Phương Trà My.mp3",
      image:"img/1 (15).jpg"
    },
    {
      name: "Mascara",
      singer: "Chillies",
      path:"audio/Mascara - Chillies x BLAZE [OFFICIAL MUSIC VIDEO].mp3",
      image:"img/1 (6).png"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="p_song ${
                            index === this.currentIndex ? "active_song" : ""
                          }" data-index="${index}">
                            <p id="p_title">${song.name}</p>
                            <p id="p_artist">${song.singer}</p>
                            <i class='bx bx-heart-circle' ></i>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
    selectedSong = $(".p_song.active_song"); 
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 15000, // 15 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý làm mờ khi cuộn
    playlist.onscroll = function () {
        var i = document.querySelectorAll(".p_song")
        var arr = Array.prototype.slice.call(i);
        for(var j = 0; j< arr.length; j++){
          var position = arr[j].getBoundingClientRect().top;
          if(position > 140){
            arr[j].classList.remove("scroll");
            arr[j].classList.remove("over_scroll");
          } else if(position > 100){
            arr[j].classList.add("scroll");
          } else 
            arr[j].classList.add("over_scroll");
        }
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      playBtn.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      playBtn.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {

        //đổi từ second sang chuỗi
        // convert second time to string
        var date = new Date(0);
        date.setSeconds(audio.currentTime); 
        currentTime.textContent = date.toISOString().substr(14, 5);
        

        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        // console.log(Math.floor(
        //   (audio.currentTime ) 
        // ));
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    // Handling when seek
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      } 
      audio.play();
      _this.loadActiveSong();
      if(!selectedSong.classList.contains("liked"))
        likeBtn.classList.remove("liked");
      else 
        likeBtn.classList.add("liked");
    };

    // Khi prev song
    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.loadActiveSong();
      
      if(!selectedSong.classList.contains("liked"))
        likeBtn.classList.remove("liked");
      else 
        likeBtn.classList.add("liked");
        
    };

    // Xử lý bật / tắt random song
    // Handling on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("actives", _this.isRandom);
    };

    // Xử lý lặp lại một song
    // Single-parallel repeat processing
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("actives", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".p_song:not(.active_song)");
      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.loadActiveSong();
          if(!selectedSong.classList.contains("liked"))
          likeBtn.classList.remove("liked");
          else 
          likeBtn.classList.add("liked");
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };


    /// xử lí mở/ tắt menu
    // Handling on / off menu
    optionLeft.onclick = function(){
        options.classList.toggle('active2');
        if(!options.classList.contains('active2')){
            volume.classList.remove('active_volumn');
        }
         
    }

    optionRight.onclick = function(){
        playlist.classList.toggle('active');
    }

    //xử lí click icon volumn
    volumnIcon.onclick = function(){
        volume.classList.toggle('active_volumn');
    }

    //xử lí khi âm thanh audio thay đổi
    // Handle volume change
    recent_volume.onchange = function () {
      audio.volume = recent_volume.value/100;
      if(audio.volume===0)
        volumnIcon.classList.add("stop");
      else 
        volumnIcon.classList.remove("stop");

      if(audio.volume > 0.5)
        volumnIcon.classList.add("maximum");
      else
        volumnIcon.classList.remove("maximum");
    }

    likeBtn.onclick = function () {
      likeBtn.classList.toggle('liked');
      selectedSong.classList.toggle('liked');
    }
  },
  
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.src = `${this.currentSong.image}`;
    singer.textContent = this.currentSong.singer;
    audio.src = this.currentSong.path;
    currentTime.textContent = '00:00'; 
    recent_volume.onchange();
  },
  loadActiveSong: function () {
    var i = document.querySelectorAll(".p_song")
    var arr = Array.prototype.slice.call(i);
    for(var j = 0; j< arr.length; j++){
      if(this.currentIndex === Number(arr[j].dataset.index)){
        // Bỏ active bài hát trước đó
        selectedSong.classList.remove("active_song");
        //gán bằng hát được chọn
        selectedSong = arr[j];
        selectedSong.classList.add("active_song");
        break;
      }    
    } 
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Render playlist
    this.render();
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    // Listening / handling events (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    // Load the first song information into the UI when running the app
    this.loadCurrentSong();
       
    

  }
};

app.start();