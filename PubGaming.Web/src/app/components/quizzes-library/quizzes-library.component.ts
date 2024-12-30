import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { QuizBuilderComponent } from '../quiz-builder/quiz-builder.component';

@Component({
  selector: 'app-quizzes-library',
  templateUrl: './quizzes-library.component.html',
  styleUrls: ['./quizzes-library.component.css']
})
export class QuizzesLibraryComponent implements OnInit {
  quizzes:any[] = [];
  currentPage:number= 0;
  currentPageSize:number= 12;
  isQuizDetailsOpen:boolean= false;
  selectedQuizId!: string
  
  constructor(
    private quizService: GameService
  ){}

  @ViewChild('quizDetails') questionFlyout!: QuizBuilderComponent;

  async ngOnInit(): Promise<void> {
    this.quizService.GetGamesList(this.currentPageSize,this.currentPage).subscribe(result => {
      console.log(result);
      this.quizzes = result;
    })
  }

  calculateQuizQuizestionsCount(quizSets:any[]){
    return quizSets.reduce((total,set) => total += set.questions.length,0)
  }

  openQuizDetails(quizId: string, $event:any){
    this.selectedQuizId = quizId;
    this.isQuizDetailsOpen = true;
    $event.stopPropagation()
  }

  onQuizCardClick(quizId: string, $event:any){
    this.openQuizDetails(quizId, $event);
  }

  next(){
    this.currentPage += 1
    this.quizService.GetGamesList(12,this.currentPage)
    .subscribe(result =>{
      this.quizzes = result;
    })
  }

  previous(){
    this.currentPage -= 1
    this.quizService.GetGamesList(12,this.currentPage)
    .subscribe(result =>{
      this.quizzes = result;
    })
  }

  isNextAvailable = () => this.currentPageSize === this.quizzes.length;

  isFirstPage = () => this.currentPage === 0;
}
