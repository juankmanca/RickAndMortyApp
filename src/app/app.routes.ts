import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { CharactersComponent } from './characters/characters.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'episodes',
    component: EpisodesComponent
  },
  {
    path: 'characters/:id',
    component: CharactersComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  }
];
