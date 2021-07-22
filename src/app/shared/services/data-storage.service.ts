import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipe.model";
import { RecipeService } from "./recipe.service";
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService
    ) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipe();
        this.http.put('https://recipe-shopping-9691c-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
            console.log(response);
        })
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>('https://recipe-shopping-9691c-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    })
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            )
            
    }
}