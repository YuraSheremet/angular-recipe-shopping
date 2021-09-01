import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
// import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
// import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  sub: Subscription;
  editMode = false;
  // editedItemIndex: number;
  editedItem: Ingredient | null;

  constructor(
    // private slService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.sub = this.store.select('shoppingList').subscribe(stateDate => {
      if (stateDate.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateDate.editedIngredient;
        // this.editedItemIndex = stateDate.editedIngredientIndex;
        this.slForm.setValue({
          name: this.editedItem?.name,
          amount: this.editedItem?.amount
        })
      } else {
        this.editMode = false;
      }
    });
    // this.sub = this.slService.startedEditing.subscribe((index: number) => {
    //   this.editedItemIndex = index;
    //   this.editMode = true;
    //   this.editedItem = this.slService.getIngredient(index);
      
    // });
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(
        // index: this.editedItemIndex, 
        newIngredient
      ));
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
