import { AfterViewInit, Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GeneralAPIService } from '../services/general-api.service';
import { IAPIResult, IEpisode } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { http } from '../helpers/enums';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [NavComponent, MatTableModule, MatPaginatorModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css'
})

export class EpisodesComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'episode', 'air_date', 'created', 'characters'];
  episodes: IEpisode[] = [];
  page: number = 0;
  totalData: number = 0;
  pageSize: number = 5;
  dataSource: any;

  constructor(
    private GeneralService: GeneralAPIService,
  ) {
  }



  ngAfterViewInit() {
    this.getEpisodes();
  }
  private async getEpisodes() {
    try {
      const responseHttp = await this.GeneralService.sendRequest(`${environment.searchEpisodes}?page=${this.page + 1}`, null, http.get)
      responseHttp.subscribe((data: IAPIResult) => {
        this.episodes = data.results;
        console.log('this.episodes >>:', this.episodes);

        this.dataSource = new MatTableDataSource(this.episodes);
        this.totalData = data.info.count;
      });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {

    }
  }

  public onChangePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getEpisodes();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.pageSize;
    this.page = 0; // Reset to the first page when the page size changes
    this.getEpisodes();
  }

  filter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
