const d = document;
let lazyLoadInstance

function lazyLoad () {
  if ('loading' in HTMLImageElement.prototype) {
    let imgs = document.querySelectorAll('img.lazy')
    imgs.forEach(img => {
      img.src = img.dataset.src
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset
      }
    })
  } else {
    lazyLoadInstance = new LazyLoad({
      elements_selector: 'img.lazy'
    })
  }
}

function asyncLazyLoad () {
  if ('loading' in HTMLImageElement.prototype) {
    let imgs = document.querySelectorAll('img.lazy:not(.loaded)')
    imgs.forEach(img => {
      img.src = img.dataset.src
      img.srcset = img.dataset.srcset
    })
  } else {
    lazyLoadInstance.update()
  }
}

// lazyLoad()




d.addEventListener('DOMContentLoaded',function(){



}) //DOMContentLoaded
