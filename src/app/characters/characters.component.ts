import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { environment } from '../../environments/environment';
import { http } from '../helpers/enums';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent, } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GeneralAPIService } from '../services/general-api.service';
import { IAPICharacterResult, ICharacter, IEpisode } from '../interfaces/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [NavComponent, MatCardModule, MatButtonModule, MatPaginatorModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css'
})
export class CharactersComponent implements OnChanges {
  dataSource: ICharacter[] = [];
  filterDataSource: ICharacter[] = [];
  page: number = 0;
  totalData: number = 0;
  pageSize: number = 5;
  showPagination = true;
  episodeId: string = '0'
  favCharacters: number[] = [];

  constructor(
    private GeneralService: GeneralAPIService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // Obtener array de números del local storage al inicializar el componente
    const storedData = localStorage.getItem('favs');
    this.favCharacters = storedData ? JSON.parse(storedData) : [];
    console.log('this.favCharacters >>:', this.favCharacters);
    this.getParams();
  }

  private getParams(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.episodeId = id ?? '0';
      if (this.episodeId == '0') this.getCharacters();
      else this.getCharactersFromEpisodeId(this.episodeId);
    });
  }

  private updateLocalStorage() {
    localStorage.setItem('favs', JSON.stringify(this.favCharacters));
  }

  private async getCharactersFromEpisodeId(episodeId: string) {
    try {
      this.showPagination = false;
      const responseHttp = await this.GeneralService.sendRequest(`${environment.searchEpisodes}/${episodeId}`, null, http.get)
      let charactersUrls: string[] = [];
      responseHttp.subscribe(async (data: IEpisode) => {
        charactersUrls = data.characters;
        await this.getCharactersByUrls(charactersUrls);
        this.filterDataSource = this.dataSource;
      });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {

    }
  }

  async getCharactersByUrls(charactersUrls: string[]): Promise<void> {
    try {
      const promises: Promise<void>[] = charactersUrls.map(async (url) => {
        const responseHttp = await this.GeneralService.sendRequest(url, null, http.get);
        responseHttp.subscribe((data: ICharacter) => {
          const index = this.favCharacters.findIndex(x => x === data.id);
          data.favorite = index != -1
          this.dataSource.push(data);
        });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      // Código que se ejecuta independientemente del éxito o fallo de las solicitudes
    }

    return Promise.resolve(); // Retorna una promesa vacía resuelta
  }


  private async getCharacters() {
    try {
      const responseHttp = await this.GeneralService.sendRequest(`${environment.searchCharacters}?page=${this.page + 1}`, null, http.get)
      responseHttp.subscribe((data: IAPICharacterResult) => {
        console.log('data.results >>:', data.results);
        this.dataSource = data.results;
        this.addFavoritesToDataSource();
        this.filterDataSource = this.dataSource;
        this.totalData = data.info.count;
      });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {

    }
  }

  addFavoritesToDataSource(): void {
    this.dataSource.forEach(character => {
      this.favCharacters.forEach(characterFavId => {
        if (characterFavId == character.id) character.favorite = true;
      })
    })
  }

  filter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value.trim();
    if (!filtro) {
      this.filterDataSource = this.dataSource.slice();
      return;
    }
    this.filterDataSource = this.dataSource.filter(x => x.name.includes(filtro));
  }

  public onChangePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getCharacters();
  }

  selectCharacter(characterId: number): void {
    try {
      const index = this.filterDataSource.findIndex(x => x.id === characterId);

      if (index === -1) return;

      if (!this.filterDataSource[index].favorite) {
        this.filterDataSource[index].favorite = true;
      } else {
        this.filterDataSource[index].favorite = false;
      }
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

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
}
