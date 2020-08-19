import { Injectable,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsApiService {

  constructor(protected http: HttpClient) { }

  getMaterials(): Observable<any>{
    return this.http.get<any>('api/buildings');
  }

  addMaterials(body: any){
    return this.http.post('api/buildings', body);
  }

  updateMaterials(id:number, body: any): Observable<any>{
    return this.http.put('api/buildings/' + id, body);
  }

  deleteMaterials(id:number): Observable<any>{
    return this.http.delete('api/buildings/' + id);
  }
}
