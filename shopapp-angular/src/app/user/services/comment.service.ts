import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { CommentDTO } from '../dtos/comment.dto';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly urlComments = `${environment.apiBaseUrl}/comments`;

  constructor(private http: HttpClient) {}

  addComment(commentDTO: CommentDTO): Observable<any> {
    return this.http.post(this.urlComments, commentDTO);
  }

  getAllCommentsByProductId(
    product_id: number,
    page: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('product_id', product_id.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get(`${this.urlComments}`, { params });
  }
}
