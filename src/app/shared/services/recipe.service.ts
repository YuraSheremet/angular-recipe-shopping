import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../ingredients.model";
import { Recipe } from "../recipe.model";
import { ShoppingListService } from "./shopping-list.service";

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    
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

    getRec(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }


}