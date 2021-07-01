import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../ingredients.model";
import { Recipe } from "../recipe.model";
import { ShoppingListService } from "./shopping-list.service";

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();
    
    private recipes: Recipe[] = [
        new Recipe('test', 'hello world', 'https://realfood.tesco.com/media/images/RFO-1400x919-AsianSalmon-9a9cf566-eaad-4107-aa79-886ec53e6b31-0-1400x919.jpg', [
            new Ingredient('meat', 1),
            new Ingredient('french fries', 20)
        ]),
        new Recipe('test', 'hello world', 'https://realfood.tesco.com/media/images/RFO-1400x919-FLSSalmon-975577ff-7dbe-4e7b-9047-b7d82a44ed62-0-1400x919.jpg', [
            new Ingredient('meat', 1),
            new Ingredient('french fries', 20)
        ])
    ]

    constructor(private slService: ShoppingListService) {}

    getRecipe() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }


}