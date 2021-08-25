import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredients.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface ShoppingListState {
    ingredients: Ingredient[];
    // editedIngredient: Ingredient;
    // editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
};


export function shoppingListReducer(state: ShoppingListState = initialState, action: ShoppingListActions.ShoppingListActions): ShoppingListState {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: 
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT: 
            const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT: 
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== action.payload;
                })
            };
        default: 
            return state;
    }
}