const scrollData = {};
scrollData.delay = 150;
scrollData.lastCall = 0;
scrollData.deltaStart = 0;


var $app = new Vue({
  el: '#app',
  data: {
    isMobile: (document.documentElement.clientWidth > 992) ? false : true,
    infoStatus: true,
    screenActive: 0,
    screenLength: 0,
    chickenClub: false,
    chickenClubBtn: false,
    cheezeClub: false,
    cheezeClubBtn: false,
    bezier: 'cubic-bezier(0.94, 0.12, 0.51, 0.26)'
  },
  watch: {
    screenActive: function() {
      document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('visible')
        s.classList.add('nonvisible')
      });
      document.querySelector('.screen[data-index="'+this.screenActive+'"]').classList.add('visible');
      document.querySelector('.screen[data-index="'+this.screenActive+'"]').classList.remove('nonvisible');
    }
  },
  computed: {
    classInsta1: function () {
      return {
        'bg_primary': !this.chickenClub && !this.cheezeClub || this.cheezeClub,
        'bg_white': this.chickenClub
      }
    },
    classInsta2: function () {
      return {
        'bg_white': !this.chickenClub && !this.cheezeClub,
        'bg_primary': this.chickenClub
      }
    }
  },
  methods: {
    toHomeScreen() {
      if (!this.isMobile) {
        this.screenAnimate(1,'up')
        this.screenActive = 0
      } else {
        window.scrollTo(0,0)
      }
      this.infoStatus = false
    },
    //попап с информацией
    infoVisibility(event) {
      this.infoStatus = !this.infoStatus

      if (this.infoStatus === false && document.getElementById('m_screen_home')) {
        setTimeout(function(){
          document.getElementById('m_screen_home').classList.add('visible');
        },500);
      }
    },
    //анимируем элементы на первом экране
    screenOneEnter(el, done){
      const d = document;
      let logo = d.querySelectorAll('.club-promo-logo');
      gsap.to(logo, {x: 0, opacity: 1, duration: 1, delay: 0.5, ease: this.bezier, onComplete: done})
    },
    screenOneLeave(el, done) {
      const d = document;
      let logo1 = d.querySelector('.chicken .club-promo-logo');
      let logo2 = d.querySelector('.cheeze .club-promo-logo');

      let tl = gsap.timeline()
      tl.to(logo1, {x: '-40%', opacity: 0, duration: 1, ease: this.bezier})
        .to(logo2, {x: '40%', opacity: 0, duration: 1, delay: -1, ease: this.bezier, onComplete: done})
    },
    //анимируем элементы на втором экране
    screenTwoEnter(el, done) {
      const d = document;
      let burgers = d.querySelectorAll('.burger .burger-img')
      let info = d.querySelectorAll('.burger .burger-info')
      let btn = d.querySelectorAll('.burger .burger-btn')

      const tl = gsap.timeline()
      tl.to(burgers, {scale: 1, duration: 0.8, delay: 0.8, ease: this.bezier})
        .to(info, {y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: this.bezier})
        .to(btn, {y: 0, opacity: 1, duration: 0.6, delay: -0.6, ease: this.bezier, onComplete: done})
    },
    screenTwoLeave(el, done) {
      const d = document;
      let burgers = d.querySelectorAll('.burger .burger-img')
      let info = d.querySelectorAll('.burger .burger-info')
      let btn = d.querySelectorAll('.burger .burger-btn')

      const tl = gsap.timeline()
      tl.to(info, {y: '-30%', opacity: 0, duration: 0.35, ease: this.bezier})
        .to(btn, {y: '30%', opacity: 0, duration: 0.35, delay: -0.35, ease: this.bezier})
        .to(burgers, {scale: 0.75, duration: 0.4, ease: this.bezier, onComplete: done})
    },
    //анимируем сколл экранов
    screenAnimate(index, direction) {
      let vector = (direction === 'down') ? index+1 : index-1;
      let scrollSize = '-'+(vector*100)+'vh';
      this.$refs.screens.style.transform = `translate3d(0,${scrollSize},0)`
    },
    //скроллим экраны
    screenScroll(event) {
      if (!this.isMobile) {
        event.preventDefault()

        let delta = event.deltaY
        let nowCall = Date.now()

        if (nowCall - scrollData.lastCall > scrollData.delay && delta > scrollData.deltaStart) {
          if (this.screenActive < this.screenLength - 1) {
            this.screenAnimate(this.screenActive,'down');
            this.screenActive++;
            this.chickenClub = false;
            this.cheezeClub = false;
          }
        } else if (nowCall - scrollData.lastCall > scrollData.delay && delta < scrollData.deltaStart) {
          if (this.screenActive !== 0) {
            this.screenAnimate(this.screenActive,'up');
            this.screenActive--;
          }
        }

        scrollData.lastCall = nowCall;
      }//if end
    },
    //тянем фото из инсты
    getInstaPhotos(el,hash) {
      fetch('https://www.instagram.com/explore/tags/'+hash+'/?__a=1')
        .then(response => response.json())
        .then(arr => {
          let arrLength = arr.graphql.hashtag.edge_hashtag_to_media.edges.length || 0;
          arrLength = arrLength > 9 ? 9 : arrLength;
          for(let i=0; i < arrLength; i++) {
            let node = arr.graphql.hashtag.edge_hashtag_to_media.edges[i].node;
            let output = `
            <div class="flx-4">
              <a href="${node.display_url}" rel="nofollow" class="insta-photo">
                <img src="${node.thumbnail_resources[2].src}" loading="lazy">
              </a>
            </div>`;
            el.insertAdjacentHTML('beforeend',output);
          }
          lightGallery(el, {
            selector: 'a'
          });
        })
        .catch(error => {
          console.log(error)
          el.insertAdjacentHTML('beforeend',`<div class="alert">Посты по хештегу: <a target="_blank" rel="nofollow" href="https://www.instagram.com/explore/tags/${hash}/">#${hash}</a>  не найдены либо произошла непредвиденная ошибка. Попробуйте позже.</div>`);
        });
    },
    //вступаем в клубы
    showChickenClub() {
      this.chickenClub = true
      this.cheezeClub = false

      this.chickenClubBtn = true
      this.cheezeClubBtn = false

      localStorage.setItem('club','chicken')
      gtag("event", "chickenClubEntry", {
        event_category: "clubEntry",
        event_action: "chickenClub"
      })
    },
    showCheezeClub() {
      this.cheezeClub = true
      this.chickenClub = false

      this.chickenClubBtn = false
      this.cheezeClubBtn = true

      localStorage.setItem('club','cheeze')
      gtag("event", "cheezeClubEntry", {
        event_category: "clubEntry",
        event_action: "cheezeClub"
      })
    },
    //проверяем LS на предмет выбора клуба
    localStorageCheck(value) {
      if (localStorage.getItem(value) !== null) {
        let lsValue = localStorage.getItem(value)
        lsValue === 'chicken'
          ? this.chickenClubBtn = true
          : this.cheezeClubBtn = true
      }
    },
    //анимируем экраны клубов
    chickenClubEnter(el,done) {
      let bg = this.$refs.club_chicken_bg
      let logo = this.$refs.club_chicken_logo
      let burger = this.$refs.club_chicken_burger
      let congratulate = this.$refs.club_chicken_congratulate
      let text = this.$refs.club_chicken_text

      let tl = gsap.timeline()
      tl.to(bg, {x: 0, duration: 1.5, ease: this.bezier})
        .to(burger, {scale: 1, opacity: 1, duration: 1, ease: this.bezier})
        .to(logo, {y: 1, scale: 1, opacity: 1, delay: -0.8, duration: 1.2, ease: this.bezier})
        .to(congratulate, {x: 0, opacity: 1, duration: 0.7, ease: this.bezier})
        .to(text, {x: 0, opacity: 1, duration: 0.7, ease: this.bezier, onComplete: done})
    },
    cheezeClubEnter(el,done) {
      let bg = this.$refs.club_cheeze_bg
      let logo = this.$refs.club_cheeze_logo
      let burger = this.$refs.club_cheeze_burger
      let congratulate = this.$refs.club_cheeze_congratulate
      let text = this.$refs.club_cheeze_text

      let tl = gsap.timeline()
      tl.to(bg, {x: 0, duration: 1.5, ease: this.bezier})
        .to(burger, {scale: 1, opacity: 1, duration: 1, ease: this.bezier})
        .to(logo, {y: 1, scale: 1, opacity: 1, delay: -0.8, duration: 1.2, ease: this.bezier})
        .to(congratulate, {x: 0, opacity: 1, duration: 0.7, ease: this.bezier})
        .to(text, {x: 0, opacity: 1, duration: 0.7, ease: this.bezier, onComplete: done})
    },
    clubLeave(el,done) {
      gsap.to(el, {x: '40%', duration: 2, ease: this.bezier, onComplete: done})
    },
    //анимация на адаптиве
    mchickenClubEnter(el,done) {
      let bg = this.$refs.club_chicken_bg
      let logo = this.$refs.club_chicken_logo
      let burger = this.$refs.club_chicken_burger
      let congratulate = this.$refs.club_chicken_congratulate
      let text = this.$refs.club_chicken_text

      el.scrollIntoView();
      window.scrollBy(0,-80);

      let tl = gsap.timeline()
      tl.to(burger, {scale: 1, opacity: 1, duration: 1, delay:0.1, ease: this.bezier})
        .to(logo, {y: 1, scale: 1, opacity: 1, delay: -0.8, duration: 1.2, ease: this.bezier})
        .to(congratulate, {y: 0, opacity: 1, duration: 0.7, ease: this.bezier})
        .to(text, {y: 0, opacity: 1, duration: 0.7, ease: this.bezier, onComplete: done})
    },
    mcheezeClubEnter(el,done) {
      let bg = this.$refs.club_cheeze_bg
      let logo = this.$refs.club_cheeze_logo
      let burger = this.$refs.club_cheeze_burger
      let congratulate = this.$refs.club_cheeze_congratulate
      let text = this.$refs.club_cheeze_text

      el.scrollIntoView();
      window.scrollBy(0,-80);

      let tl = gsap.timeline()
      tl.to(burger, {scale: 1, opacity: 1, duration: 1, delay:0.1, ease: this.bezier})
        .to(logo, {y: 1, scale: 1, opacity: 1, delay: -0.8, duration: 1.2, ease: this.bezier})
        .to(congratulate, {y: 0, opacity: 1, duration: 0.7, ease: this.bezier})
        .to(text, {y: 0, opacity: 1, duration: 0.7, ease: this.bezier, onComplete: done})
    },
    mclubLeave(el,done) {
      gsap.to(el, {opacity: 0, duration: 0.1, ease: this.bezier, onComplete: done})
    },
    mobileScroll(event) {
      let scrollTop = event.target.scrollingElement.scrollTop
      document.querySelectorAll('.m-animate').forEach((el,index,array) => {
        let elCoords = getCoords(el)
        let last = array.length - 1
        console.log(array,last)

        if(elCoords.halfTop <= scrollTop && elCoords.halfHeight > scrollTop) {
          el.classList.add('visible')
          el.classList.remove('nonvisible')
        } else {
          el.classList.remove('visible')
          el.classList.add('nonvisible')
        }
        array[last].classList.add('last-anim');
      })
    }
  },
  created () {
    this.screenLength = document.querySelectorAll('.screen').length;
  },
  mounted () {
    this.localStorageCheck('club')

    this.getInstaPhotos(this.$refs.insta_chicken,'зачикенпремьер')
    this.getInstaPhotos(this.$refs.insta_cheeze,'затройнойчиз')
  }
})

window.onload = function() {
  document.querySelector('.preloader').classList.add('leave');
  setTimeout(function(){
    document.querySelector('.preloader').remove();
  },301)

  window.addEventListener('scroll',$app.mobileScroll)
}

if(matchMedia) {
  var screen992 = window.matchMedia('(max-width:992px)');
  screen992.addListener(changes);
  changes(screen992);
}
function changes(screen992) {
  if(screen992.matches) {
    $app.isMobile = true
  } else {
    $app.isMobile = false
  }
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  let half = (document.documentElement.clientHeight - 80) / 2;
  return {
    // top: box.top - 80 + pageYOffset,
    // height: box.top - 80 + box.height + pageYOffset,
    halfTop: box.top - 80 + pageYOffset - half,
    halfHeight: box.top - 80 + box.height + pageYOffset - half
  };
}