// type Category = {
//     id: string;
//     name: string;
//     description: string;
//     color: string;
//   }
//   type Image = {
//     url: string;
//     alt: string;
//   }
//   type Plant = {
//     id: string | number;
//     price: number;
//     name: string;
//     description: string;
//     scientific_name: string;
//     categories: Category[];
//     care: string;
//     image: Image;
//   }
fetch("http://localhost:3000/img/data.json").then(function (res) {
  return res.json();
}).then(function (json) {
  var data = {
    products: json
  };
  Handlebars.registerHelper("include", function (source) {
    return new Handlebars.SafeString(source);
  });
  Handlebars.registerHelper("isActive", function (category) {
    var params = Qs.parse(window.location.search.substr(1));
    var categoriesParam = params.categories || null;
    return category === categoriesParam ? "active" : "";
  });
  var nav = document.querySelectorAll("#nav li a span");
  var params = Qs.parse(window.location.search.substr(1));
  var categoriesParam = params.categories || null;
  Array.from(nav).forEach(function (n) {
    if (n.textContent === categoriesParam + "s") {
      n.classList.add("active");
    }
  }); // Select partials from scripts with type "text/x-handlebars-template"

  var card = document.getElementById("card");
  var searchInput = document.getElementById("search"); // const loader = document.getElementById("loader");

  if (card) {
    // Register partials
    Handlebars.registerPartial("cardPartial", card.innerHTML); // Define main template

    var cardList = "\n    <div class=\"card-container\">\n      {{#each products}}\n          {{> cardPartial}}\n      {{/each}}\n    </div>\n  "; // compile the template

    var template = Handlebars.compile(cardList);

    var renderProducts = function renderProducts(output) {
      document.getElementById("products-root").innerHTML = output;
    }; // let params = new URL(document.location).searchParams;
    // const categoriesParam = params.get("categories").split("|") || null;


    var _params = Qs.parse(window.location.search.substr(1));

    var _categoriesParam = _params.categories || null;

    searchInput.addEventListener("keyup", function (e) {
      // loader.innerHTML = "loading...";
      var val = e.target.value;

      if (val.length > 2 || val.length === 0) {
        var predicate = function predicate(product) {
          return product.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        };

        var matches = data.products.filter(predicate);
        var compiled = template({
          products: matches
        });
        renderProducts(compiled);
      } // loader.innerHTML = "";

    });

    var filterOnLoad = function filterOnLoad() {
      var filterByCategory = function filterByCategory(product) {
        return _categoriesParam ? product.categories.some(function (cat) {
          return _categoriesParam.includes(cat);
        }) : true;
      };

      var matches = data.products.filter(filterByCategory); // execute the compiled template and print the output to the console

      var compiled = template({
        products: matches
      }); // Render products once on load

      renderProducts(compiled);
    };

    filterOnLoad();
  }
}); // const asyncFilter = async (arr, predicate) => {
//   const promises = arr.map(predicate);
//   return Promise.all(promises).then((result) => arr.filter((element, index) => result[index]));
// };
// sequentially
// const asyncFilterSequential = async (arr, predicate) =>
//   arr.reduce(async (memo, e) => [...(await memo), ...((await predicate(e)) ? [e] : [])], []);
// const predicate = async (product) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(product.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
//     }, 200);
//   });
// };
// asyncFilterSequential(data.products, predicate).then((matches) => {
//   const compiled = template({ products: matches });
//   renderProducts(compiled);
//   loader.innerHTML = "";
// });