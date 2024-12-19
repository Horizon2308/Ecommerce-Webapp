import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly urlLikes = `${environment.apiBaseUrl}/likes`;

  constructor(private http: HttpClient) {}

  isLikedByThisUser(user_id: number, comment_id: number): Observable<any> {
    const params = new HttpParams()
      .set('user_id', user_id.toString())
      .set('comment_id', comment_id.toString());
    return this.http.get(this.urlLikes, { params });
  }
}
