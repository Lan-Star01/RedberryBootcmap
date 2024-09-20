import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class BackendAPIService {

  private token ='9d0a52a6-430e-4970-8364-9fd7a8de23fa'
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private hashedToken!: string;

  constructor(private http: HttpClient) {
    this.hashedToken = this.hashToken();
  }

  // Method to hash the token
  private hashToken(): string {
    return CryptoJS.SHA256(this.token).toString(CryptoJS.enc.Hex);
  }
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

  postAgents(body: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/agents`, body, { headers: this.headers });
  }

  postRealEstates(body: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/real-estates`, body, { headers: this.headers });
  }
}

// interfaces
export interface Region {
  id: number;
  name: string;
}

export interface City {
  id: number;
  region_id: number;
  name: string;
}

export interface Agent {
  id: number;
  name: string;
  surname: string;
  avatar: string;
}

export interface AgentBodyParameters {
  name: string;
  surname: string;
  email: string;
  phone: string;
  avatar: any;
}

