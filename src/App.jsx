import React, { useState, useEffect } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch categories and areas on load
  useEffect(() => {
    const fetchFilters = async () => {
      const categoriesResponse = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const areasResponse = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );

      const categoriesData = await categoriesResponse.json();
      const areasData = await areasResponse.json();

      setCategories(categoriesData.categories);
      setAreas(areasData.meals);
    };

    fetchFilters();
  }, []);

  // Fetch recipes based on search, category, or area
  const fetchRecipes = async () => {
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    if (selectedCategory) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
    } else if (selectedArea) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setRecipes(data.meals || []);
  };

  // Fetch detailed recipe info
  const fetchRecipeDetails = async (id) => {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    setSelectedRecipe(data.meals[0]);
  };

  return (

    <div className="min-h-screen max-w-[60rem] border shadow-lg shadow-green-400  border-black m-auto bg-gray-50 flex">
      {/* Left Section: Recipe List */}
      <div className="w-1/3  p-4 border-r overflow-y-scroll  snap-both h-[100vh] bg-slate-200 border-gray-300">
        <header className="bg-green-500 rounded-lg text-white py-4">
          <h1 className="text-center text-xl p-1 font-bold">Recipe Hunter</h1>
        </header>

        {/* Search Bar */}
        <div className="flex gap-4 flex-col mt-5 snap-x mb-4 ">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1  px-4 py-2 border rounded-md focus:outline-none"
          />
          <button
            onClick={fetchRecipes}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-orange-700"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-4">
          <select
            className="flex-1 px-4 py-2 border rounded-md"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedArea("");
              fetchRecipes();
            }}
          >
            <option value="">Filter by Category</option>
            {categories.map((category) => (
              <option key={category.idCategory} value={(category.strCategory == ("Beef" && "beef")) ? "" : ""}>
                {category.strCategory === "Beef" ? null : category.strCategory}
              </option>
            ))}
          </select>

          <select
            className="flex-1 px-4 py-2 border rounded-md"
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setSelectedCategory("");
              fetchRecipes();
            }}
          >
            <option value="">Filter by Area</option>
            {areas.map((area) => (
              <option key={area.strArea} value={area.strArea}>
                {area.strArea}
              </option>
            ))}
          </select>
        </div>

        {/* Recipe List */}
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="bg-white shadow-md  rounded-md overflow-hidden cursor-pointer hover:shadow-lg"
              onClick={() => fetchRecipeDetails(recipe.idMeal)}
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold p-4">{recipe.strMeal}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Recipe Details */}
      {selectedRecipe ? (
        <div className="w-2/3 p-4 bg-slate-200 overflow-y-scroll border border-black h-[100vh]">
          <div className=" b rounded-md shadow-md p-6">
            <button
              className="text-xl bg-red-600 p-3 rounded-full text-white text-gray-500 float-right"
              onClick={() => setSelectedRecipe(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.strMeal}</h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="w-[20rem] m-auto rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <ul className="list-disc list-inside mb-4">
              {Array.from({ length: 20 }, (_, i) =>
                selectedRecipe[`strIngredient${i + 1}`] ? (
                  <li key={i}>
                    {selectedRecipe[`strIngredient${i + 1}`]} -{" "}
                    {selectedRecipe[`strMeasure${i + 1}`]}
                  </li>
                ) : null
              )}
            </ul>
            <h3 className="text-lg font-semibold">Instructions</h3>
            <div>
              {selectedRecipe.strInstructions.split('.').map((instruction, index) => (
                <p key={index}>{instruction.trim()}</p>
                
              ))}
              {selectedRecipe.strYoutube && (
                <a
                  href={selectedRecipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-center mt-4 block bg-red-600 w-[80%] m-auto p-4 rounded-md"
                >
                  Watch Tutorial
                </a>
              )}
            </div>

          </div>
        </div>
      ):<div className="w-2/3 p-4 border border-black  bg-slate-200 h-[100vh]"></div>}
    </div>
  );
};

export default App;
