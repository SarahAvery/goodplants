console.log("pizza pizza");

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
}

//MOBILE MENU//

const menu = document.querySelector("#menu");
const menuBtn = document.querySelector("#menu-btn");
const isOpen = document.querySelector("#nav-mobile");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("open");
  isOpen.style.transition = "2s, ease in out";
});
