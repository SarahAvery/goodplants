// import { Qs } from "qs";
console.log("description"); //COUNTER//

/** Counter using an es5 style "class" */

var Counter = function Counter() {
  var initialCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  this.count = initialCount;
};

Counter.prototype.add = function () {
  this.count = this.count + 1;
};

Counter.prototype.subtract = function () {
  this.count = this.count > 0 ? this.count - 1 : 0;
}; // const counter1 = new Counter(0);
// counter1.add();
// counter1.add();
// console.log(counter1.count);

/** counterMaker factory function
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#emulating_private_methods_with_closures
 */


var counterMaker = function () {
  return function () {
    var initialCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var count = initialCount;

    var add = function add() {
      return count = count + 1;
    };

    var subtract = function subtract() {
      return count = count > 0 ? count - 1 : 0;
    };

    var value = function value() {
      return count;
    };

    return {
      add: add,
      subtract: subtract,
      value: value
    };
  };
}();
/**
 * Creates a new slider.
 * @param HTMLElemment el - Provide a root element to use as the slider context
 * @returns function
 */


var slider = function () {
  return function (el) {
    if (!el) {
      console.warn("A root el must be provided to slider");
      return;
    }

    var slideIndex = 0;
    var prevArrowEl = el.querySelector(".prev");
    var nextArrowEl = el.querySelector(".next");
    var images = el.querySelectorAll(".column img");
    prevArrowEl.addEventListener("click", function () {
      showSlides(slideIndex - 1);
    });
    nextArrowEl.addEventListener("click", function () {
      showSlides(slideIndex + 1);
    });
    Array.from(images).forEach(function (img, index) {
      img.addEventListener("click", function () {
        showSlides(index);
      });
    });
    /**
     * Updates slider index
     * @param {number} n - slide index
     */

    function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("lg-img");
      var dots = document.getElementsByClassName("demo");

      if (slides) {
        if (n > slides.length - 1) {
          slideIndex = 0;
        } else if (n < 0) {
          slideIndex = slides.length - 1;
        } else {
          slideIndex = n;
        }

        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }

        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace("active", "");
        }

        slides[slideIndex].style.display = "block";
        dots[slideIndex].classList.add("active");
      }
    }

    return {
      showSlides: showSlides
    };
  };
}();

fetch("./img/data.json").then(function (res) {
  return res.json();
}).then(function (json) {
  var params = Qs.parse(window.location.search.substr(1));

  if (params && params.itemId) {
    var plantData = json.find(function (p) {
      return p.id === parseInt(params.itemId);
    });

    var render = function render(id, data, target) {
      // handlebars template root
      var root = document.getElementById(id);
      var targetRoot = document.getElementById(target);
      var html = root.innerHTML; // returns a function for passing data

      var templateCompiled = Handlebars.compile(html); // inject data into compiled template

      var output = templateCompiled(data); // update the innderHTML

      targetRoot.innerHTML = output;
    }; // pass id of handlebars script template, pass data to inject


    render("details", {
      product: plantData
    }, "details-root"); // ---
    // handlebars template rendered, initialize slider and add event listeners to counter buttons
    // ---

    var images = document.querySelector("[data-slider]");
    var slider1 = slider(images);
    slider1.showSlides(0); //COUNTER//

    var addBtn = document.querySelector(".plus");
    var subBtn = document.querySelector(".minus");
    var input = document.querySelector(".number input");
    var quantityCounter = counterMaker(0);
    addBtn.addEventListener("click", function (e) {
      quantityCounter.add();
      input.value = quantityCounter.value();
    });
    subBtn.addEventListener("click", function (e) {
      quantityCounter.subtract();
      input.value = quantityCounter.value();
    });
    var sizesRadio = document.querySelectorAll('.sizes input[type="radio"]');
    var price = document.querySelector(".details-section .page-content .product-info .price");
    var radioChecked = null;
    Array.from(sizesRadio).forEach(function (r) {
      return r.addEventListener("click", function (e) {
        radioChecked = e.target.value;
        price.textContent = "$" + radioChecked;
      });
    });
  }
});