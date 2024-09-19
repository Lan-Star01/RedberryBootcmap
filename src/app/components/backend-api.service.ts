import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendAPIService {

  private token ='9d0a52a6-430e-4970-8364-9fd7a8de23fa'
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  getCities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cities`);
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/regions`)
  }

  getRealEstates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/real-estates`, { headers: this.headers })
  }

  getAgents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/agents`, { headers: this.headers })
  }
}
