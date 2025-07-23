// Get elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");

let mood = "create";
let tmpIndex;
let searchMood = "title";

// Get localStorage data or initialize
let data = localStorage.products ? JSON.parse(localStorage.products) : [];

// ==================
// Total Calculation
// ==================
function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = `$${result}`;
    total.style.background = "green";
  } else {
    total.innerHTML = "$0";
    total.style.background = "rgb(153, 10, 10)";
  }
}

// ==================
// Clear Inputs
// ==================
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  category.value = "";
  count.value = "";
}

// ==================
// Create / Update Product
// ==================
submit.onclick = function () {
  let newdata = {
    title: title.value.trim(),
    price: price.value.trim(),
    taxes: taxes.value.trim(),
    ads: ads.value.trim(),
    discount: discount.value.trim(),
    count: count.value.trim(),
    category: category.value.trim(),
  };

  if (
    newdata.title !== "" &&
    newdata.price !== "" &&
    newdata.category !== "" &&
    newdata.count !== "" &&
    newdata.count <= 100
  ) {
    if (mood === "create") {
      if (newdata.count > 1) {
        for (let i = 0; i < newdata.count; i++) {
          data.push(newdata);
        }
      } else {
        data.push(newdata);
      }
    } else {
      data[tmpIndex] = newdata;
      mood = "create";
      submit.innerHTML = "submit";
      count.style.display = "block";
    }

    localStorage.setItem("products", JSON.stringify(data));
    clearData();
    showData();
  } else {
    alert("Please fill in all required fields");
  }
};

// ==================
// Display Data in Table
// ==================
function showData() {
  let tbody = "";

  data.map((product, index) => {
    tbody += `
      <tr>
        <td>${index + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${
          +product.price + +product.taxes + +product.ads - +product.discount
        }</td>
        <td>${product.discount}</td>
        <td>${product.category}</td>
        <td><button onclick="deleteProduct(${index})">delete</button></td>
        <td><button onclick="updateProduct(${index})">update</button></td>
      </tr>
    `;
  });

  document.getElementById("tbody").innerHTML = tbody;

  // Show delete all button
  let deleteAll = document.getElementById("deleteAll");
  if (data.length > 0) {
    deleteAll.innerHTML = `
      <button onclick="deleteAllProducts()">Delete All (${data.length})</button>
    `;
  } else {
    deleteAll.innerHTML = "";
  }
}

// ==================
// Delete Single Product
// ==================
function deleteProduct(index) {
  data.splice(index, 1);
  localStorage.products = JSON.stringify(data);
  showData();
}

// ==================
// Delete All Products
// ==================
function deleteAllProducts() {
  localStorage.clear();
  data.splice(0);
  showData();
}

// ==================
// Update Product
// ==================
function updateProduct(index) {
  title.value = data[index].title;
  price.value = data[index].price;
  taxes.value = data[index].taxes;
  ads.value = data[index].ads;
  discount.value = data[index].discount;
  count.value = data[index].count;
  category.value = data[index].category;
  getTotal();
  count.style.display = "none";
  submit.innerHTML = "Update";
  mood = "update";
  tmpIndex = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==================
// Search Mode Switcher
// ==================
function searchFunction(id) {
  if (id === "SearchTitle") {
    searchMood = "title";
    search.placeholder = "Search by Title";
  } else if (id === "SearchCategory") {
    searchMood = "category";
    search.placeholder = "Search by Category";
  }
  search.focus();
}

// ==================
// Search Products
// ==================
function searchData(value) {
  let tbody = "";

  data.map((product, index) => {
    if (
      (searchMood === "title" &&
        product.title.toLowerCase().includes(value.toLowerCase())) ||
      (searchMood === "category" &&
        product.category.toLowerCase().includes(value.toLowerCase()))
    ) {
      tbody += `
        <tr>
          <td>${index + 1}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product.taxes}</td>
          <td>${product.ads}</td>
          <td>${
            +product.price + +product.taxes + +product.ads - +product.discount
          }</td>
          <td>${product.discount}</td>
          <td>${product.category}</td>
          <td><button onclick="deleteProduct(${index})">delete</button></td>
          <td><button onclick="updateProduct(${index})">update</button></td>
        </tr>
      `;
    }
  });

  document.getElementById("tbody").innerHTML = tbody;
}

// Show products on load
showData();
