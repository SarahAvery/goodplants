// import { Qs } from "qs";

//COUNTER//

/** Counter using an es5 style "class" */
const Counter = function (initialCount = 0) {
  this.count = initialCount;
};
Counter.prototype.add = function () {
  this.count = this.count + 1;
};
Counter.prototype.subtract = function () {
  this.count = this.count > 0 ? this.count - 1 : 0;
};

// const counter1 = new Counter(0);
// counter1.add();
// counter1.add();
// console.log(counter1.count);

/** counterMaker factory function
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#emulating_private_methods_with_closures
 */
const counterMaker = (() => {
  return (initialCount = 0) => {
    let count = initialCount;
    const add = () => (count = count + 1);
    const subtract = () => (count = count > 0 ? count - 1 : 0);
    const value = () => count;

    return { add, subtract, value };
  };
})();

/**
 * Creates a new slider.
 * @param HTMLElemment el - Provide a root element to use as the slider context
 * @returns function
 */
const slider = (() => {
  return (el) => {
    if (!el) {
      console.warn("A root el must be provided to slider");
      return;
    }

    let slideIndex = 0;
    const prevArrowEl = el.querySelector(".prev");
    const nextArrowEl = el.querySelector(".next");
    const images = el.querySelectorAll(".column img");

    prevArrowEl.addEventListener("click", () => {
      showSlides(slideIndex - 1);
    });
    nextArrowEl.addEventListener("click", () => {
      showSlides(slideIndex + 1);
    });

    Array.from(images).forEach((img, index) => {
      img.addEventListener("click", () => {
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

    return { showSlides };
  };
})();

fetch("./img/data.json")
  .then((res) => res.json())
  .then((json) => {
    const params = Qs.parse(window.location.search.substr(1));

    if (params && params.itemId) {
      const plantData = json.find((p) => p.id === parseInt(params.itemId));

      const render = (id, data, target) => {
        // handlebars template root
        const root = document.getElementById(id);
        const targetRoot = document.getElementById(target);
        const html = root.innerHTML;

        // returns a function for passing data
        var templateCompiled = Handlebars.compile(html);

        // inject data into compiled template
        var output = templateCompiled(data);

        // update the innderHTML
        targetRoot.innerHTML = output;
      };

      // pass id of handlebars script template, pass data to inject
      render("details", { product: plantData }, "details-root");

      // ---
      // handlebars template rendered, initialize slider and add event listeners to counter buttons
      // ---

      const images = document.querySelector("[data-slider]");
      const slider1 = slider(images);
      slider1.showSlides(0);

      //COUNTER//

      const addBtn = document.querySelector(".plus");
      const subBtn = document.querySelector(".minus");
      const input = document.querySelector(".number input");
      const quantityCounter = counterMaker(0);

      addBtn.addEventListener("click", (e) => {
        quantityCounter.add();
        input.value = quantityCounter.value();
      });

      subBtn.addEventListener("click", (e) => {
        quantityCounter.subtract();
        input.value = quantityCounter.value();
      });

      const sizesRadio = document.querySelectorAll('.sizes input[type="radio"]');
      const price = document.querySelector(".details-section .page-content .product-info .price");
      let radioChecked = null;
      Array.from(sizesRadio).forEach((r) =>
        r.addEventListener("click", (e) => {
          radioChecked = e.target.value;
          price.textContent = "$" + radioChecked;
        })
      );
    }
  });
