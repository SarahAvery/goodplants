//STICKY NAV//
window.onscroll = function () {
  myFunction();
};

var nav = document.getElementById("nav");
var sticky = nav.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
} //MOBILE MENU//


var menu = document.querySelector("#menu");
var menuBtn = document.querySelector("#menu-btn");
var isOpen = document.querySelector("#nav-mobile");
menuBtn.addEventListener("click", function () {
  menu.classList.toggle("open");
  isOpen.style.transition = "2s, ease in out";
});