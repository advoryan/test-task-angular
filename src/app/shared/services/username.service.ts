import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CheckUserResponseData } from '../interface/responses';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  private http = inject(HttpClient);

  public isAvailable(username: string): Observable<boolean> {
    return this.http.post<CheckUserResponseData>(
      '/api/checkUsername',
      { username }
    ).pipe(
      map(({ isAvailable }) => isAvailable )
    );
  }
}
