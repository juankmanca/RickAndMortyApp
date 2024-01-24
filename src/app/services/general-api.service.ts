import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { http } from '../helpers/enums';

@Injectable({
  providedIn: 'root'
})
export class GeneralAPIService {

  constructor(
    private http: HttpClient
  ) { }

  public async sendRequest(url: string, body: any, method: http): Promise<any>{
    const header = new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )

    const options = {
      headers: header,
      body: null
    }

    if (method === 'post') {
      return this.http.post(url, body, options)
    }

    if (method === 'get') {
      return this.http.get(url, options)
    }

    if (method === 'patch') {
      return this.http.patch(url, body, options)
    }

    if (method === 'delete') {
      options.body = body;
      return this.http.delete(url, options)
    }

  }
}
