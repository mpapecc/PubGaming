import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionTemplateService {

  constructor(private http: HttpClient) { }

  getQuestionTemplates(pageSize:number, pageNo:number){
    return this.http.get<any[]>(environment.apiUrl + `api/QuestionTemplate/GetTemplateQuestions?pageSize=${pageSize}&pageNo=${pageNo}`);
  }

  createQuestionTemplate(question:any){
    return this.http.post<any[]>(environment.apiUrl + "api/QuestionTemplate/CreateQuestionTemplate",question);
  }
}
