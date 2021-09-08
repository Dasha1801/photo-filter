"use strict";


document.querySelector(".fullscreen").addEventListener("click", switchScreen);
function switchScreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen();
  }else{
    if(document.fullscreenEnabled){
      document.exitFullscreen();
    }
  }
}

const image = document.querySelector("img");
const inputs = document.querySelectorAll("input[type=range]");
const filters = document.querySelector(".filters");
const btnReset =  document.querySelector(".btn-reset");
const btnNext = document.querySelector(".btn-next");
const btnLoad = document.querySelector("input[type=file]");
const btnSave = document.querySelector(".btn-save");



function getValue(){
  const suffix = this.dataset.sizing;
  image.style.setProperty(`--${this.name}`, this.value + suffix);
  this.parentNode.childNodes[3].value = this.value;
}
inputs.forEach(input => input.addEventListener("input", getValue));


btnReset.onclick = function resetFilters(){
  filters.childNodes.forEach(element =>{
    if(element.nodeName !== "#text"){
      element.childNodes[1].value = element.childNodes[1].defaultValue;
      element.childNodes[3].value = element.childNodes[3].defaultValue;
      const suffix = element.childNodes[1].dataset.sizing;
      image.style.setProperty(`--${element.childNodes[1].name}`, element.childNodes[1].defaultValue + suffix);
    }
  })
};

const link = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg','05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;

function viewImage(src) {  
  const img = new Image();
  img.src = src;
  img.onload = () => {
  image.src = src;
}; 
}

btnNext.onclick = function newImage(){
  let date = new Date();
  let hour = date.getHours();
  let timesOfDay="";
  if (hour>=0 && hour<6) {
    timesOfDay = "night/";
  } else if(hour>=18 && hour<24) {
    timesOfDay = "evening/";
  } else if(hour>=12 && hour<18) {
    timesOfDay = "day/";
  } else if (hour>=6 && hour<12) {
    timesOfDay = "morning/";
  }
  const index = i % images.length;
  const imageSrc = link+ timesOfDay + images[index];
  viewImage(imageSrc);
  i++;
  btnNext.disabled = true;
  setTimeout(function() { btnNext.disabled = false }, 1000);
}


btnLoad.addEventListener('change', function(e) {
  const file = btnLoad.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    image.src =  img.src;

  }
  reader.readAsDataURL(file);
  btnLoad.value = "";
});


btnSave.onclick = function saveImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const saveLinkImg = document.createElement('a');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  
  const filtersStyle =image.style.cssText.replace(/--/g, "").replace(/;/g, ") ").replace(/:/g, "(").replace(/hue/, "hue-rotate");
  const check = filtersStyle.split("px")[0].split('(');

  if(check[0] === "blur"){
    const ratioWidth = image.naturalWidth/image.width;
    const ratioHeight = image.naturalHeight/image.height;
    if(ratioWidth >  ratioHeight){
      check[1]= +check[1] * ratioWidth;
    }else{
      check[1]= +check[1] * ratioHeight;
    }
    
    let  checkReturn = check.join("(")+"px)";
    let filtersStyle2 = checkReturn + filtersStyle.replace(/blur....../g, "");
    ctx.filter = filtersStyle2;
  }
  else {
    ctx.filter = filtersStyle;
  }
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  saveLinkImg.download = "image.png";
  saveLinkImg.href = canvas.toDataURL('image/png', 1);
  
  saveLinkImg.click();
  saveLinkImg.delete;
}


  