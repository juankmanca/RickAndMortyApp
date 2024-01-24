import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ICharacter, IEpisode } from '../interfaces/interfaces';
import { GeneralAPIService } from '../services/general-api.service';
import { environment } from '../../environments/environment';
import { http } from '../helpers/enums';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NavComponent, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

  favCharacters: number[] = [];
  dataSource: ICharacter[] = [];
  filterDataSource: ICharacter[] = [];
  page: number = 0;
  totalData: number = 0;
  pageSize: number = 5;
  constructor(
    private GeneralService: GeneralAPIService
  ) {

  }

  ngOnInit() {
    // Obtener array de números del local storage al inicializar el componente
    const storedData = localStorage.getItem('favs');
    this.favCharacters = storedData ? JSON.parse(storedData) : [];
    this.getFavCharacters();
    this.filterDataSource = this.dataSource;
  }

  getFavCharacters(): void {
    try {
      this.favCharacters.forEach(async x => {
        const responseHttp = await this.GeneralService.sendRequest(`${environment.searchCharacters}/${x}`, null, http.get)
        responseHttp.subscribe(async (data: ICharacter) => {
          data.favorite = true;
          this.dataSource.push(data);
        });
      })
    } catch (error) {

    }
  }

  public filter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value.trim();
    if (!filtro) {
      this.filterDataSource = this.dataSource.slice();
      return;
    }
    this.filterDataSource = this.dataSource.filter(x => x.name.includes(filtro));
  }

  selectCharacter(characterId: number): void {
    try {
      const index = this.filterDataSource.findIndex(x => x.id === characterId);
      if (index === -1) return;
      this.filterDataSource.splice(index, 1);
      this.selectCharacterIntoLocalStorage(characterId);
    } catch (error) {
      console.log('error >>:', error);

    }
  }

  selectCharacterIntoLocalStorage(characterId: number): void {
    const index: number = this.favCharacters.findIndex(x => x == characterId);
    if (index == -1) {
      this.favCharacters.push(characterId);
    } else {
      this.favCharacters.splice(index, 1);
    }
    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    localStorage.setItem('favs', JSON.stringify(this.favCharacters));
  }
}
