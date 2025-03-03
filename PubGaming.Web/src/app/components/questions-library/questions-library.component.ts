import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseWithLoaderComponent } from 'src/app/infrastructure/baseComponents/base-with-loader/base-with-loader.component';
import { QuestionTemplateService } from 'src/app/services/question.service';

@Component({
  selector: 'app-questions-library',
  templateUrl: './questions-library.component.html',
  styleUrls: ['./questions-library.component.css']
})
export class QuestionsLibraryComponent extends BaseWithLoaderComponent{
  @Input() canSelect:boolean = false;
  @Output() selectedQuestionIdsChange = new EventEmitter<number[]>();

  selectedQuestionIds: any[]=[];
  currentViewItems:any[]= [];
  currentPage:number= 0;
  currentPageSize:number= 26;
  
  constructor(
    private questionService:QuestionTemplateService
  ) {
    super();
  }

  OnInit(): Subscription {
    return this.questionService.getQuestionTemplates(this.currentPageSize,this.currentPage).subscribe((questions)=>{
      this.currentViewItems = questions;
    });
  }

  changeSelectedState(question:any){
    let index = this.selectedQuestionIds.findIndex((x:any) => x.id === question.id);
    index < 0 ? this.selectedQuestionIds.push(question) : this.selectedQuestionIds.splice(index,1);
  }

  questionSelectedEvent(questionId: number) {
    this.changeSelectedState(questionId);
    this.selectedQuestionIdsChange.emit(this.selectedQuestionIds);
  }

  next = () => {
    this.currentPage += 1
    this.questionService.getQuestionTemplates(this.currentPageSize,this.currentPage)
    .subscribe(result =>{
      this.currentViewItems = result;
    })
  }

  previous = () => {
    this.currentPage -= 1;
    this.questionService.getQuestionTemplates(this.currentPageSize,this.currentPage)
    .subscribe(result =>{
      this.currentViewItems = result;
    })
  }

  isNextAvailable = () => this.currentPageSize === this.currentViewItems.length;

  isFirstPage = () => this.currentPage === 0;
}
