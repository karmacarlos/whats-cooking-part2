/* eslint-disable max-len */
// IMPORTS

import './styles.css';
//use scss file instead of css

// classes
import RecipeRepository from './classes/RecipeRepository';
import IngredientRepository from './classes/IngredientRepository';
import User from './classes/User';
import Pantry from './classes/Pantry';

// fetch calls & data variables
import {
  fetchUsers,
  fetchIngredients,
  fetchRecipes,
  modifyPantry,
} from './apiCalls';
import domUpdates from './domUpdates';

const {
  showAllRecipeBtn,
  showRecipeByTagBtn,
  showFavBtn,
  showQueueBtn,
  dropBtn,
  showPantryBtn,
  addRecipeFromCookBookModal,
  addRecipeFromFavoritesModal,
  favoriteModal,
  recipesToCookModal,
  closeSpanFavorites,
  closeSpanQueue,
  recipeTagForm,
  searchInputField,
  searchBtn,
  poolAndSearchView,
  recipePoolView,
  favoriteView,
  cookbookView,
  recipeDetailView,
  pantryView,
  pantryContainer,
} = domUpdates;

// SELECTORS

// buttons
// const showAllRecipeBtn = document.getElementById('show-all-recipes');
// const showRecipeByTagBtn = document.getElementById('show-recipe-by-tag');
// const showFavBtn = document.getElementById('show-favorites');
// const showQueueBtn = document.getElementById('show-queue');
// // const dropBtn = document.querySelector('.dropbtn');
// const dropBtn = document.querySelector('.dropdown-button');
// const showPantryBtn = document.getElementById('show-pantry');

// // modals
// const addRecipeFromCookBookModal = document.getElementById(
//   'show-all-recipes-cookbook'
// );
// const addRecipeFromFavoritesModal = document.getElementById(
//   'show-all-recipes-favorites'
// );
// const favoriteModal = document.getElementById('favorite-recipe-modal');
// const recipesToCookModal = document.getElementById('recipes-to-cook-modal');
// const closeSpanFavorites = document.querySelectorAll('.close')[0];
// const closeSpanQueue = document.querySelectorAll('.close')[1];

// // search & filter
// const recipeTagForm = document.getElementById('recipe-tag-form');
// const searchInputField = document.getElementById('search-input-field');
// const searchBtn = document.getElementById('search-button');

// // containers
// const poolAndSearchView = document.getElementById('pool-and-search-parent');
// const recipePoolView = document.querySelector('.recipe-pool-view');
// const favoriteView = document.querySelector('.favorite-view');
// const cookbookView = document.querySelector('.cookbook-view');
// const recipeDetailView = document.querySelector('.recipe-detail-view');
// const pantryView = document.querySelector('.pantry-view');
// const pantryContainer = document.getElementById('pantry-container');
// // const recipeContainer = document.getElementById('recipe-container');

// GLOBAL VARIABLES
let recipeRepository;
let ingredientRepository;
let recipePool;
let ingredientPool;
let selectedTags;
let user;
let pantryInstance;
let userData = [];
let ingredientsData = [];
let recipeData = [];

// EVENTLISTENERS

// page load
window.addEventListener('load', getApis);

// view switching
showAllRecipeBtn.addEventListener('click', function () {
  recipePool = recipeRepository.recipes;
  showAllRecipes();
  hide(pantryView);
});

showFavBtn.addEventListener('click', function () {
  recipePool = user.favoriteRecipes;
  showFavorite();
  hide(pantryView);
});

showQueueBtn.addEventListener('click', function () {
  recipePool = user.recipesToCook;
  showQueue();
  hide(pantryView);
});

showPantryBtn.addEventListener('click', showPantry);

// tag filtering
recipeTagForm.addEventListener('click', collectTags);

// search
searchBtn.addEventListener('click', function () {
  recipePool = [];
  collectTags();
  generateAllTags();
  searchByName();
  searchByIngredient();
  hide(recipeDetailView);
  show(poolAndSearchView);
  hide(favoriteView);
  hide(cookbookView);
  show(recipePoolView);
  // allRecipesDomUpdate();
  domUpdates.renderAllRecipes(recipePool);
});

// expand individual recipe
recipePoolView.addEventListener('click', showRecipeDetails);
favoriteView.addEventListener('click', showRecipeDetails);
cookbookView.addEventListener('click', showRecipeDetails);

// modals
addRecipeFromCookBookModal.addEventListener('click', function () {
  favoriteModal.style.display = 'none';
  showAllRecipes();
});

addRecipeFromFavoritesModal.addEventListener('click', function () {
  recipesToCookModal.style.display = 'none';
  showAllRecipes();
});

closeSpanFavorites.addEventListener('click', function () {
  favoriteModal.style.display = 'none';
});

closeSpanQueue.addEventListener('click', function () {
  recipesToCookModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target == favoriteModal) {
    favoriteModal.style.display = 'none';
  } else if (event.target == recipesToCookModal) {
    recipesToCookModal.style.display = 'none';
  }
});

// FUNCTIONS

// page load - fetch calls and instantiation
function getApis() {
  Promise.all([fetchUsers(), fetchIngredients(), fetchRecipes()])
    .then((allArrays) => storeData(allArrays))
    .then(() => {
      return showAllRecipes();
    });
}

function storeData(arrays) {
  arrays[0].forEach((user) => userData.push(user));
  arrays[1].forEach((ingredient) => ingredientsData.push(ingredient));
  arrays[2].forEach((recipe) => recipeData.push(recipe));
  createUserAndRecipePool();
}

function createUserAndRecipePool() {
  generateRandomUser();
  generateAllRecipes();
  generateAllIngredients();
  generatePantry();
  hide(showRecipeByTagBtn);
  dropBtn.innerText = `Welcome, ${user.name}!`;
}

function generateRandomUser() {
  let randomIndex = Math.floor(Math.random() * userData.length);
  let randomUser = userData[randomIndex];
  user = new User(randomUser);
}

function generateAllRecipes() {
  recipeRepository = new RecipeRepository(recipeData);
  recipeRepository.makeRecipes();
  recipePool = recipeRepository.recipes;
}

function generateAllIngredients() {
  ingredientRepository = new IngredientRepository(ingredientsData);
  ingredientRepository.makeIngredients();
  ingredientPool = ingredientRepository.ingredients;
}

function generatePantry() {
  pantryInstance = new Pantry(user);
}

function showPantry() {
  pantryView.classList.remove('hidden');
  poolAndSearchView.classList.add('hidden');
  recipeDetailView.classList.add('hidden');
  let pantry = new Pantry(user);
  let pantryForDisplay = pantry.addNamesToPantry(ingredientsData);
  pantryContainer.innerHTML = '';
  pantryForDisplay.forEach((ingredient) => {
    pantryContainer.innerHTML += `
      <p> ${ingredient.name} Amount: ${ingredient.amount}</p>
    `;
  });
}

// data source switching
function showRecipePool() {
  hide(recipeDetailView);
  show(poolAndSearchView);
  hide(pantryView);
  if (!recipePoolView.classList.contains('hidden')) {
    recipePool = recipeRepository.recipes;
    // allRecipesDomUpdate();
    domUpdates.renderAllRecipes(recipePool);
  }
  if (!favoriteView.classList.contains('hidden')) {
    recipePool = user.favoriteRecipes;
    // favoritesDomUpdate();
    domUpdates.renderFavoriteRecipes(recipePool);
  }
  if (!cookbookView.classList.contains('hidden')) {
    recipePool = user.recipesToCook;
    // cookbookDomUpdate();
    domUpdates.renderCookbookRecipes(recipePool);
  }
}

// tag filtering
function collectTags() {
  selectedTags = [];
  let checkBoxes = document.querySelectorAll('input[type=checkbox]:checked');
  for (let i = 0; i < checkBoxes.length; i++) {
    selectedTags.push(checkBoxes[i].value);
  }
  if (!selectedTags.length) {
    showRecipePool();
  } else {
    showRecipesByTag(selectedTags);
  }
}

function generateAllTags() {
  show(showRecipeByTagBtn);
  let recipeTags = [];
  recipePool.forEach((recipe) => {
    recipeTags.push(recipe.tags);
  });
  let uniqRecipeTags = [...new Set(recipeTags.flat())];
  recipeTagForm.innerHTML = '';
  uniqRecipeTags.forEach((tag) => {
    recipeTagForm.innerHTML += `
      <label for="${tag}">
        <input type="checkbox" class="recipe-tag" id="${tag}" value="${tag}"> ${tag}
      </label>
    `;
  });
}

function showRecipesByTag(selectedTags) {
  if (!recipePoolView.classList.contains('hidden')) {
    recipePool = recipeRepository.returnRecipesByTag(selectedTags);
    // allRecipesDomUpdate();
    domUpdates.renderAllRecipes(recipePool);
  }

  if (!favoriteView.classList.contains('hidden')) {
    recipePool = user.filterRecipesByTag(user.favoriteRecipes, selectedTags);
    // favoritesDomUpdate();
    domUpdates.renderFavoriteRecipes(recipePool);
  }

  if (!cookbookView.classList.contains('hidden')) {
    recipePool = user.filterRecipesByTag(user.recipesToCook, selectedTags);
    // cookbookDomUpdate();
    domUpdates.renderCookbookRecipes(recipePool);
  }
}

// search functions
function searchByName() {
  event.preventDefault();
  if (searchInputField.value) {
    recipePool = recipeRepository.returnRecipesByName(searchInputField.value);
  }
}

function searchByIngredient() {
  event.preventDefault();
  let ingredientIds = ingredientRepository.getIngredientId(
    searchInputField.value
  );
  let recipesContainingIngredient =
    recipeRepository.returnRecipesByIngredient(ingredientIds);
  recipesContainingIngredient.forEach((recipe) => {
    if (!recipePool.some((el) => el.name === recipe.name)) {
      recipePool.push(recipe);
    }
  });
}

// expand individual recipe on click
function showRecipeDetails(event) {
  let recipeId = event.target.parentNode.id;
  let recipeClicked = recipePool.find((ele) => ele.id == recipeId);
  let ingredients = recipeClicked.ingredients.map(
    (ingredient, index) =>
      `${ingredient.quantity.amount} ${ingredient.quantity.unit} ${
        recipeClicked.showIngredientsByName()[index]
      }`
  );
  let instructions = recipeClicked.showInstructions();
  let cost = recipeClicked.calculateRecipeCostInDollars();

  hide(poolAndSearchView);
  show(recipeDetailView);
  hide(pantryView);

  recipeDetailView.innerHTML = `
    <article class="recipe-detail-container">
      <h3>${recipeClicked.name}</h3>
      <img src="${recipeClicked.image}">
      <div class="container-fave-queue-btns">
        <button id="fave-button">
          <!-- <span id="fave-text">Add to Favorites</span> -->
          <span id="fave-text">🤍</span>
          <!-- <span id="unfave-text" class="hidden">Remove from favorites</span> -->
          <span id="unfave-text" class="hidden">❤️</span>
        </button>
        <button id="add-to-recipes-to-cook-button">
          <span id="add-to-cook-text">Add to My Cookbook</span>
          <span id="remove-from-cook-text" class="hidden">Remove from My Cookbook</span>
        </button>
      </div>
      <!-- <p>Ingredients: <span>${ingredients}</span></p> -->
      <p id="total-cost">Total cost: <span>$${cost}</span></p>
      <section class="ingredient-list">
        <p>Ingredients:</p>
      </section>
      <button id="cook-button">GIMME OVEN!</button>
      <p id="display-message"></p>
      <section id="display-message2"></section>
      <button id="buy-ingredients" class=" hidden">Buy Ingredients</button>
    </article>
  `;

  let ingredientList = document.querySelector('.ingredient-list');

  ingredients.forEach((ingredient) => {
    ingredientList.innerHTML += `
      <p>${ingredient}</p>
    `;
  });

  instructions.forEach((ele) => {
    let key = Object.keys(ele).toString();
    let instruction = Object.values(ele).toString();
    recipeDetailView.innerHTML += `
    <span class="steps">Step ${key}</span>
    <p>${instruction}</p>
    `;
  });

  activateFaveButton(recipeClicked);
  activateAddToRecipesToCookButton(recipeClicked);
  activateCookingBtn(recipeClicked);
}

// dynamic favorite/queue button activation
function activateCookingBtn(recipeClicked) {
  let cookBtn = document.getElementById('cook-button');
  let displayMessage = document.getElementById('display-message');
  let displayMessage2 = document.getElementById('display-message2');
  let buyIngredientsButton = document.getElementById('buy-ingredients');

  cookBtn.addEventListener('click', function () {
    if (pantryInstance.checkIfIsPossibleToCookARecipe(recipeClicked)) {
      displayMessage.innerText = "Success! You've given some oven";
      let cookingList = recipeClicked.ingredients.map((ingredient) => {
        return {
          id: ingredient.id,
          amount: -1 * ingredient.quantity.amount,
        };
      });
      Promise.all(
        cookingList.map((ingredient) => {
          return modifyPantry(user.userId, ingredient.id, ingredient.amount);
        })
      ).then(() => {
        fetchUsers()
          .then((users) => users.find((userP) => userP.id === user.userId))
          .then((updatedUser) => {
            user = new User(updatedUser);
            pantryInstance = new Pantry(user);
          });
      });
      hide(cookBtn);
    } else {
      displayMessage.innerText =
        'Oh no! You need more ingredients. Do you want to buy them?';
      let shoppingList =
        pantryInstance.determineMissingIngAmounts(recipeClicked);
      let displayList = shoppingList.map((ingredient) => {
        return {
          id: ingredient.id,
          name: ingredientPool.find((ing) => ing.id === ingredient.id).name,
          amount: ingredient.missingAmount,
        };
      });
      displayList.forEach((ingList) => {
        displayMessage2.innerHTML += `<p>${ingList.name}: ${ingList.amount} units</p>`;
      });
      show(buyIngredientsButton);
      hide(cookBtn);
      buyIngredientsButton.addEventListener('click', function () {
        Promise.all(
          displayList.map((ingredient) => {
            return modifyPantry(user.userId, ingredient.id, ingredient.amount);
          })
        ).then(() => {
          fetchUsers()
            .then((users) => users.find((userP) => userP.id === user.userId))
            .then((updatedUser) => {
              user = new User(updatedUser);
              pantryInstance = new Pantry(user);
            });
        });
        show(cookBtn);
        hide(buyIngredientsButton);
        displayMessage.innerText =
          'Now you have all the ingredients you need to give some oven!';
        displayMessage2.innerHTML = '';
      });
    }
  });
}

// dynamic favorite/queue button activation

function activateFaveButton(recipeClicked) {
  let faveButton = document.getElementById('fave-button');
  let faveText = document.getElementById('fave-text');
  let unFaveText = document.getElementById('unfave-text');

  if (user.favoriteRecipes.includes(recipeClicked)) {
    resetClassList(faveText);
    resetClassList(unFaveText);
    hide(faveText);
  }

  faveButton.addEventListener('click', function () {
    if (!user.favoriteRecipes.includes(recipeClicked)) {
      user.favoriteRecipes.push(recipeClicked);
      hide(faveText);
      show(unFaveText);
    } else {
      let indexOfRecipeClicked = user.favoriteRecipes.indexOf(recipeClicked);
      user.favoriteRecipes.splice(indexOfRecipeClicked, 1);
      toggle(faveText);
      toggle(unFaveText);
    }
  });
}

function activateAddToRecipesToCookButton(recipeClicked) {
  let addToRecipesToCookButton = document.getElementById(
    'add-to-recipes-to-cook-button'
  );
  let addToCookText = document.getElementById('add-to-cook-text');
  let removeFromCookText = document.getElementById('remove-from-cook-text');

  if (user.recipesToCook.includes(recipeClicked)) {
    resetClassList(addToCookText);
    resetClassList(removeFromCookText);
    hide(addToCookText);
  }

  addToRecipesToCookButton.addEventListener('click', function () {
    if (!user.recipesToCook.includes(recipeClicked)) {
      user.recipesToCook.push(recipeClicked);
      hide(addToCookText);
      show(removeFromCookText);
    } else {
      let indexOfRecipeClicked = user.recipesToCook.indexOf(recipeClicked);
      user.recipesToCook.splice(indexOfRecipeClicked, 1);
      toggle(addToCookText);
      toggle(removeFromCookText);
    }
  });
}

// view switching
function showAllRecipes() {
  hide(recipeDetailView);
  show(poolAndSearchView);
  hide(favoriteView);
  hide(cookbookView);
  show(recipePoolView);
  showRecipePool();
  generateAllTags();
}

function showFavorite() {
  hide(recipeDetailView);
  show(poolAndSearchView);
  show(favoriteView);
  hide(recipePoolView);
  hide(cookbookView);
  if (!user.favoriteRecipes.length) {
    favoriteView.innerHTML = '';
    favoriteModal.style.display = 'block';
    generateAllTags();
  } else {
    favoriteModal.style.display = 'none';
    showRecipePool();
    generateAllTags();
  }
}

function showQueue() {
  hide(recipeDetailView);
  show(poolAndSearchView);
  hide(favoriteView);
  hide(recipePoolView);
  show(cookbookView);
  if (!user.recipesToCook.length) {
    cookbookView.innerHTML = '';
    recipesToCookModal.style.display = 'block';
    generateAllTags();
  } else {
    recipesToCookModal.style.display = 'none';
    showRecipePool();
    generateAllTags();
  }
}

// update DOM
// function allRecipesDomUpdate() {
//   recipePoolView.innerHTML = '';
//   recipePool.forEach((recipe) => {
//     recipePoolView.innerHTML += `
//         <article class="recipe-card" id="${recipe.id}">
//           <img src=${recipe.image} alt="">
//           <p>${recipe.name}</p>
//         </article>
//       `;
//   });
// }

// function favoritesDomUpdate() {
//   favoriteView.innerHTML = '';
//   recipePool.forEach((recipe) => {
//     favoriteView.innerHTML += `
//         <article class="recipe-card" id="${recipe.id}">
//           <img src=${recipe.image} alt="">
//           <p>${recipe.name}</p>
//         </article>
//       `;
//   });
// }

// function  {
//   cookbookView.innerHTML = '';
//   recipePool.forEach((recipe) => {
//     cookbookView.innerHTML += `
//         <article class="recipe-card" id="${recipe.id}">
//           <img src=${recipe.image} alt="">
//           <p>${recipe.name}</p>
//         </article>
//       `;
//   });
// }

// utility fxns
function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function toggle(element) {
  element.classList.toggle('hidden');
}

function resetClassList(element) {
  element.classList = '';
}
