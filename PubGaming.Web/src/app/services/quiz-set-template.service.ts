import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizSetTemplateService {

  constructor(private http:HttpClient, private fb: FormBuilder) { }

  getSetTemplateById(id:number){
    return this.http.get<any>(environment.apiUrl + `api/QuizSetTemplate/GetSetTemplateById?id=${id}`)
  }

  GetSetTemplateByIdList(idList:number[]){
    return this.http.post<any[]>(environment.apiUrl + `api/QuizSetTemplate/GetSetTemplateByIdList`,idList)
  }

  getSetTemplates(pageSize:number, pageNo:number){
    return this.http.get<any[]>(environment.apiUrl + `api/QuizSetTemplate/GetSetTemplates?pageSize=${pageSize}&pageNo=${pageNo}`)
  }

  createNewSet(data:any){
    return this.http.post<any>(environment.apiUrl + "api/QuizSetTemplate/CreateNewSet", data)
  }

  updateSet(data:any){
    return this.http.post<any[]>(environment.apiUrl + "api/QuizSetTemplate/UpdateSet", data)
  }
}
