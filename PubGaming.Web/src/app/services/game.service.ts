import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  protected url:string = environment.apiUrl + "api/Game/";

  constructor(private httpClient:HttpClient) { }

  public GetGameTemplateById(id:any){
    return this.httpClient.get(this.url + `GetGameTemplateById?id=${id}`)
  }

  public CreateGameTemplate(quizTemplate:any){
    return this.httpClient.post(this.url + "CreateGameTemplate", quizTemplate)
  }

  public CreateEmptyGame(){
    return this.httpClient.get(this.url + "CreateEmptyGame")
  }

  public UpdateGame(data:any){
    return this.httpClient.put(this.url + "UpdateGame", data)
  }

  public GetGamesList(pageSize:number, pageNo:number){
    return this.httpClient.get<any[]>(this.url + `GetGamesList?pageSize=${pageSize}&pageNo=${pageNo}`)
  }
}
