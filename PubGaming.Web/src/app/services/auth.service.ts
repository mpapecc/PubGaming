import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected url:string = environment.apiUrl + "api/Auth/";
  public jwt:string = "";

  constructor(private httpClient: HttpClient) { }

  public login(loginModel:any){
    return this.httpClient.post(this.url + "Login", loginModel);
  }

  public authentificate(){
    return this.httpClient.get(this.url)
  }
}
