import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendAPIService {

  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) {}

  getCities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cities`);
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/regions`)
  }
}
