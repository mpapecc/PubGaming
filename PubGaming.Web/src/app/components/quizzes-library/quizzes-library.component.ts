import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { QuizBuilderComponent } from '../quiz-builder/quiz-builder.component';
import { Flyout, FlyoutService } from 'src/app/services/flyout.service';

@Component({
  selector: 'app-quizzes-library',
  templateUrl: './quizzes-library.component.html',
  styleUrls: ['./quizzes-library.component.css']
})
export class QuizzesLibraryComponent implements OnInit {
  quizzes: any[] = [];
  currentPage: number = 0;
  currentPageSize: number = 20;
  isQuizDetailsOpen: boolean = false;
  flyoutData: Flyout<any> = new Flyout<any>();
  constructor(
    private quizService: GameService,
    private flyoutService: FlyoutService
  ) { }

  ngOnInit(): void {
    this.quizService.GetGamesList(this.currentPageSize, this.currentPage).subscribe(result => {
      this.quizzes = result;
    })
  }

  calculateQuizQuizestionsCount(quizSets: any[]) {
    return quizSets.reduce((total, set) => total += set.questions.length, 0)
  }

  openQuizDetailsFlyout = (quizId: number) => {
    this.flyoutData.content = QuizBuilderComponent;
    this.flyoutData.title = "Novi kviz";

    this.flyoutService.create(this.flyoutData).subscribe((quizBuilder) => {
      console.log(quizBuilder)
      if(quizId > 0)
        quizBuilder.quizId = quizId;
    });

    // $event.stopPropagation()
  }

  onQuizCardClick = (quizId: number) => {
    this.openQuizDetailsFlyout(quizId);
  }

  next = () => {
    this.currentPage += 1
    this.quizService.GetGamesList(this.currentPageSize, this.currentPage)
      .subscribe(result => this.quizzes = result);
  }

  previous = () => {
    this.currentPage -= 1
    this.quizService.GetGamesList(this.currentPageSize, this.currentPage)
      .subscribe(result => this.quizzes = result);
  }

  isNextAvailable = () => this.currentPageSize === this.quizzes.length;

  isFirstPage = () => this.currentPage === 0;
}
