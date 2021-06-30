import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedName = 'recipe';

  onNavigate(name: string) {
    this.loadedName = name;
  }
}
