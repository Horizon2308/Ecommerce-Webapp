import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlGetAllProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}
  getAllProducts(
    categoryId: number,
    keyword: string,
    page: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('category_id', categoryId.toString())
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(`${environment.apiNest}/products`, {
      params,
    });
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(
      `${environment.apiBaseUrl}/products/by-ids`,
      {
        params,
      }
    );
  }

  getProductDetails(productId: number): Observable<any> {
    return this.http.get<Product[]>(
      `${environment.apiNest}/products/${productId}`
    );
  }
}
