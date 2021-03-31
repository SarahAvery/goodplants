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

fetch("./img/data.json")
  .then((res) => res.json())
  .then((json) => {
    const data = { products: json };

    Handlebars.registerHelper("include", function (source) {
      return new Handlebars.SafeString(source);
    });

    Handlebars.registerHelper("isActive", function (category) {
      let params = Qs.parse(window.location.search.substr(1));
      const categoriesParam = params.categories || null;

      return category === categoriesParam ? "active" : "";
    });

    const nav = document.querySelectorAll("#nav li a span");
    let params = Qs.parse(window.location.search.substr(1));
    const categoriesParam = params.categories || null;
    Array.from(nav).forEach((n) => {
      if (n.textContent === categoriesParam + "s") {
        n.classList.add("active");
      }
    });

    // Select partials from scripts with type "text/x-handlebars-template"
    const card = document.getElementById("card");
    const searchInput = document.getElementById("search");
    // const loader = document.getElementById("loader");

    if (card) {
      // Register partials
      Handlebars.registerPartial("cardPartial", card.innerHTML);

      // Define main template
      const cardList = `
    <div class="card-container">
      {{#each products}}
          {{> cardPartial}}
      {{/each}}
    </div>
  `;

      // compile the template
      var template = Handlebars.compile(cardList);

      const renderProducts = (output) => {
        document.getElementById("products-root").innerHTML = output;
      };

      // let params = new URL(document.location).searchParams;
      // const categoriesParam = params.get("categories").split("|") || null;
      let params = Qs.parse(window.location.search.substr(1));
      const categoriesParam = params.categories || null;

      searchInput.addEventListener("keyup", (e) => {
        // loader.innerHTML = "loading...";
        const val = e.target.value;

        if (val.length > 2 || val.length === 0) {
          const predicate = (product) => product.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
          const matches = data.products.filter(predicate);

          const compiled = template({ products: matches });
          renderProducts(compiled);
        }
        // loader.innerHTML = "";
      });

      const filterOnLoad = () => {
        const filterByCategory = (product) =>
          categoriesParam ? product.categories.some((cat) => categoriesParam.includes(cat)) : true;
        const matches = data.products.filter(filterByCategory);
        // execute the compiled template and print the output to the console
        const compiled = template({ products: matches });

        // Render products once on load
        renderProducts(compiled);
      };

      filterOnLoad();
    }
  });

// const asyncFilter = async (arr, predicate) => {
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
