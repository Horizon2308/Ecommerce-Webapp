import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  private readonly urlGetAllCategories = `${environment.apiNest}/categories`;
  getAllCategories(page: number, limit: number): Observable<any> {
    return this.http.get<Category[]>(this.urlGetAllCategories);
  }
}
