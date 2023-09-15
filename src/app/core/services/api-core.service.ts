import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiCoreService {
  constructor(private http: HttpClient) {
  }

  get(
    url: string,
    parametrs: any = '',
    project: string = 'ezguamal',
    type: string = 'private',
  ): Observable<any> {

    let params: string = '';

    if (typeof parametrs == 'string' || typeof parametrs == 'number') {
      params = parametrs ? '/' + parametrs : '';
    }

    if (typeof parametrs == 'object') {
      params = '?';

      let i: number = 1;

      for (let key in parametrs) {
        params += key + '=' + parametrs[key];

        if (this.objSize(parametrs) > i) {
          params += '&';
        }

        i++;
      }
    }

    // @ts-ignore
    return this.http.get(environment.apiUrls[project][type] + '/' + url + params);
  }

  post(
    url: string,
    params: any,
    project: string = 'ezguamal',
    type: string = 'private',
    options?: any,
  ): Observable<any> {
    // @ts-ignore
    return this.http.post(environment.apiUrls[project][type] + '/' + url, params, options);
  }

  put(
    url: string,
    params: any,
    project: string = 'ezguamal',
    type: string = 'private',
  ): Observable<any> {
    // @ts-ignore
    return this.http.put(environment.apiUrls[project][type] + '/' + url, params);
  }

  patch(
    url: string,
    params: any,
    project: string = 'ezguamal',
    type: string = 'private',
  ): Observable<any> {
    // @ts-ignore
    return this.http.patch(environment.apiUrls[project][type] + '/' + url, params);
  }

  delete(
    url: string,
    params: any,
    project: string = 'ezguamal',
    type: string = 'private',
  ): Observable<any> {
    // @ts-ignore
    return this.http.delete(environment.apiUrls[project][type] + '/' + url + '/' + params);
  }

  deleteByParams(
    url: string,
    params: any,
    project: string = 'ezguamal',
    type: string = 'private',
  ): Observable<any> {
    // @ts-ignore
    return this.http.delete(environment.apiUrls[project][type] + '/' + url, params);
  }

  objSize(obj: any) {
    let size = 0;

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }

    return size;
  }
}
