"use strict";

const form = document.querySelector(".form");
const input = document.querySelector(".form-control");
const result = document.querySelector(".result");
const randomCocktail = document.querySelector(".random-cocktail");
const letterWrapper = document.querySelector(".letters");

const allLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const displayLertters = allLetter.map(
  (letter) => `<a onclick="getCocktailsByLetter(event)" href="">${letter}</a>`
);
letterWrapper.innerHTML = displayLertters.join("");

console.log(allLetter);
console.log(displayLertters);
console.log(displayLertters.join(""));

let cokctailsArray = [];

const page = JSON.parse(localStorage.getItem("page"));
if (page) displayCocktails(page);

console.log(window.location);

function getCocktailsByLetter(e) {
  e.preventDefault();
  const getLetter = e.target.textContent.toLowerCase();

  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + getLetter)
    .then((res) => res.json())
    .then((data) => {
      displayCocktails(data.drinks);
      localStorage.setItem("page", JSON.stringify(data.drinks));
    })
    .catch((err) => console.log(err));
}

function displayCocktails(cocktails = cokctailsArray) {
  let html = "";

  cocktails.forEach((coctail) => {
    html += `
        <div class="cocktail col-4 mb-3" data-id="${coctail.idDrink}">
            <img src="${coctail.strDrinkThumb}" alt=""/>
            <h3>${coctail.strDrink}</h3>
        </div>`;
  });

  result.innerHTML = html;
}

function displaySingleCocktail(cocktail) {
  let ingredients = "";

  for (let i = 0; i <= 15; i++) {
    const ing = cocktail["strIngredient" + i];
    if (!ing) continue;
    ingredients += `<li><a onclick="getByCategory(event, 'i') " href="" >${ing}</a></li>`;
  }

  result.innerHTML = "";
  const html = `
        <div class="col-6">
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
        </div>

        <div class="col-6">
            <h2>${cocktail.strDrink}</h2>
            <p>${cocktail.strInstructions}</p>
            <ul>
                <li><a onclick="getByCategory(event, 'a')" href="">${cocktail.strAlcoholic}</a></li>
                <li>Category: <a onclick="getByCategory(event, 'c')" href="">${cocktail.strCategory}</a></li>
                <li>Glass Type: <a onclick="getByCategory(event, 'g')" href="">${cocktail.strGlass}</a></li>
                <li>IBA: ${cocktail.strIBA}</li>
                <li>Image Atribution: ${cocktail.strImageAttribution}</li>
            </ul>
        <h4>Ingredients:</h4>
        <ul>
            ${ingredients}
        </ul>
        <button class="btn btn-primary" onclick="displayCocktails()">Back to cocktail list</button>
        </div>
  `;

  result.innerHTML = html;
}

function onSubmit(e) {
  e.preventDefault();

  fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + input.value
  )
    .then((res) => res.json())
    .then((data) => {
      cokctailsArray = data.drinks;
      displayCocktails(data.drinks);
      localStorage.setItem("page", JSON.stringify(data.drinks));
    })
    .catch((err) => console.log(err));
}

function openCocktail(e) {
  e.preventDefault();
  const cocktail = e.target.closest(".cocktail");
  if (!cocktail) return;

  fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
      cocktail.dataset.id
  )
    .then((res) => res.json())
    .then((data) => {
      displaySingleCocktail(data.drinks[0]);
      localStorage.setItem("page", JSON.stringify(data.drinks[0]));
    })
    .catch((err) => console.log(err));
}

function displayRandom() {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      displaySingleCocktail(data.drinks[0]);
      localStorage.setItem("page", JSON.stringify(data.drinks[0]));
    })
    .catch((err) => console.log(err));
}

function getByCategory(e, filter) {
  e.preventDefault();
  const getCategory = e.target.textContent;

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filter}=${getCategory}`
  )
    .then((res) => res.json())
    .then((data) => {
      cokctailsArray = data.drinks;
      displayCocktails(data.drinks);
      localStorage.setItem("page", JSON.stringify(data.drinks));
    })
    .catch((err) => console.log(err));
}

form.addEventListener("submit", onSubmit);
result.addEventListener("click", openCocktail);
randomCocktail.addEventListener("click", displayRandom);
