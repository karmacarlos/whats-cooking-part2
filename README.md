# What's Cookin'?

## Abstract

What's Cookin' is a recipe tracking / meal planning application that allows users to view their favorite recipes and plan shopping trips around them. The idea is similar to sites like All Recipes or New York Times Cooking. Users should view a list of recipes, favorite their own recipes, and choose recipes to cook.

## Installation

1. Clone down [client side app](https://github.com/n0land0/whats-cookin) to your local machine.
2. Clone down [local server](https://github.com/turingschool-examples/whats-cookin-api) to a different folder.
3. Run `npm install` on your root folder of the two cloned down repo.
4. In local server folder, run `npm start` to launch local server.
5. In client app folder, run `npm start` and visit the opened port in browser.
6. Start messing around on the page!

## Usage and Demonstration

  * On load the user can see all recipes and a list of tags to filer them
  
![Screen Shot 2021-10-25 at 7 12 41 AM](https://user-images.githubusercontent.com/81398850/138701797-81bd15b4-b283-46d3-a23f-00538572f1fe.png)

  * After clicking a recipe the user can see the recipe details, and can save it as favorite and/or want to cook
  
![Screen Shot 2021-10-25 at 7 15 04 AM](https://user-images.githubusercontent.com/81398850/138702204-f5d897be-bede-4cc3-bc5a-2de08cc0687f.png)

  * When trying to cook a recipe the user will see a message if there are missing ingredients from the recipe and it will be presented with the option to get the ingredients

![Screen Shot 2021-10-25 at 7 16 53 AM](https://user-images.githubusercontent.com/81398850/138702478-f16b2e8c-6332-43b9-9be9-ccc48c11401a.png)

  * After buying the ingredients the user can cook the recipe, at any point the user can visit favorites, want to cook or pantry sections
  
![Screen Shot 2021-10-25 at 7 18 07 AM](https://user-images.githubusercontent.com/81398850/138702670-21dd1cf2-9697-4c6d-8d7b-50849c19227c.png)

## Programming Languages and Dependencies

**This app was developed using:**

- HTML
- CSS
- SCSS
- JavaScript
- NPM
- Mocha and chai testing frameworks
- DOM API
- Fetch API
- Webpack

## Wins and Challenges

**Wins**

- We gained better understanding of asynchronous JS
  - We have used DOM API to some extent in previous projects, but by making extensive use of the fetch API, we had to learn how to control the flow and timing and events
- Our app achieved excellent accessiblity according to the Lighthouse score (97)
- We managed to dry our CSS file using SCSS
- We separate data structure (user info, recipes, ingredients)and DOM manipulations into different folders.

**Challenges**

- Error handling in our fetch POST and GET in response to different types of network errors
- Keeping a smooth project board workflow

## Future Additions

- Be able to tab through drop down menu
- Be able to filter recipes by tags based on search result.
- Display a featured blog post at page load.

## Contributions

**Developers:**

_This app was developed by:_

- [Carlos Gomez](https://github.com/karmacarlos)
- [Bei Zhang](https://github.com/lokiandfengshui)
- [Raquel Hill](https://github.com/Raquelhill)
- [Nolan Caine](https://github.com/n0land0)

_Carlos, Bei, Raquel, and Nolan are students of front-end engineering at the Turing School of Software & Design._

**Project Manager**

- [Nik Seif](https://github.com/niksseif)

[Project spec](https://frontend.turing.edu/projects/What%27sCookin-PartOne.html) and assets provided by the [Turing School of Software & Design](https://turing.edu/).
