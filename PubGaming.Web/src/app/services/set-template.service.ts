import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetTemplateService {
  protected url: string = environment.apiUrl + "api/SetTemplate/";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  getSetTemplateById(id: number) {
    return this.http.get<any>(this.url + `GetSetTemplateById?id=${id}`)
  }

  GetSetTemplateByIdList(idList: number[]) {
    return this.http.post<any[]>(this.url + `GetSetTemplateByIdList`, idList)
  }

  getSetTemplates(pageSize: number, pageNo: number) {
    return this.http.get<any[]>(this.url + `GetSetTemplates?pageSize=${pageSize}&pageNo=${pageNo}`)
  }

  createNewSet(data: any) {
    return this.http.post<any>(this.url + "CreateNewSet", data)
  }

  updateSet(data: any) {
    return this.http.post<any[]>(this.url + "UpdateSet", data)
  }
}
