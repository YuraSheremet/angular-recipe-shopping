import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/shared/recipe.model';
// import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;
  @Input() index: number;
  // @Output() recipeSelected = new EventEmitter<void>();

  // constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

  

}
