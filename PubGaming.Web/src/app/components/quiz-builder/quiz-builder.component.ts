import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControlMappersService } from 'src/app/services/form-control-mappers.service';
import { SetTemplateService } from 'src/app/services/set-template.service';
import { GameService } from 'src/app/services/game.service';
import { Flyout, FlyoutService, FlyoutSize } from 'src/app/services/flyout.service';
import { QuestionsLibraryComponent } from '../questions-library/questions-library.component';
import { QuestionFormComponent } from 'src/app/forms/question-form/question-form.component';
import { SetsLibraryComponent } from '../sets-library/sets-library.component';

@Component({
  selector: 'app-quiz-builder',
  templateUrl: './quiz-builder.component.html',
  styleUrls: ['./quiz-builder.component.css']
})
export class QuizBuilderComponent implements OnInit {
  quiz: any;
  questionAddedFromLibrary: any[] = [];
  setsAddedFromLibrary: any[] = [];
  currentSetIndex: number = 0;
  quizId: any = "";
  quizPicture: any;
  flyoutData: Flyout<any> = new Flyout<any>();

  @Input()
  set id(id: string) {
    this.quizId = id
  }

  quizForm = this.fb.group({
    gameType: this.fb.control(0),
    id: this.fb.control(''),
    name: this.fb.control(''),
    description: this.fb.control(''),
    sets: this.fb.array([])
  });

  get sets() {
    return this.quizForm.get('sets') as unknown as FormArray;
  }

  getQuizSetQuestions(setIndex: number) {
    return this.sets.at(setIndex)?.get("questions") as unknown as FormArray;
  }

  getQuizSetId(setIndex: number) {
    return this.sets.at(setIndex)?.get("id")?.value
  }

  getQuestionAnswers(setIndex: number, questionIndex: number) {
    return this.getQuizSetQuestions(setIndex)?.at(questionIndex)?.get("answers") as unknown as FormArray;
  }

  constructor(
    public gameService: GameService,
    public quizSetTemplateService: SetTemplateService,
    private fb: FormBuilder,
    private formControlMappers: FormControlMappersService,
    public router: Router,
    public flyoutService: FlyoutService
  ) { }

  ngOnInit(): void {
    if (this.quizId) {
      this.gameService.GetGameTemplateById(this.quizId).subscribe((quiz: any) => {
        this.quiz = quiz;
        this.quizForm = this.formControlMappers.mapGameToFbGroup(quiz);
      });
      return;
    }

    this.gameService.CreateEmptyGame().subscribe((quiz: any) => {
      this.quiz = quiz
      this.quizForm = this.formControlMappers.mapGameToFbGroup(quiz);
    });

    this.sets.disable();
  }

  addNewSet() {
    this.sets.push(this.fb.group({
      name: this.fb.control("New sett"),
      gameId: this.fb.control(this.quiz.id),
      questions: this.fb.array([]),
      description: this.fb.control('')
    }));
  }

  setCurrentSet(setIndex: number) {
    this.currentSetIndex = setIndex;
  }

  onSubmit() {
    if (!this.quizForm.dirty) {
      return;
    }
    this.gameService.UpdateGame(this.quizForm.getRawValue()).subscribe((result: any) => {
      if (!this.quizId) {
        this.router.navigate([`/quiz-builder/${result.id}`]);
      }
    });
    return false;
  }

  removeSet = (setIndex: number) => {
    this.sets.removeAt(setIndex)
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log(file)
      var image = document.getElementById('output');
      this.quizPicture = URL.createObjectURL(event.target.files[0]);
      // this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      // const upload$ = this.http.post("/api/thumbnail-upload", formData);

      // upload$.subscribe();
    }
  }

  openQuestionLibraryFlyout = (setIndex: number) => {
    this.currentSetIndex = setIndex;

    this.flyoutData.content = QuestionsLibraryComponent,
    this.flyoutData.title = "Baza pitanja";
    this.flyoutData.size = FlyoutSize.Large;
    this.flyoutData.onClose = () => {
      this.onQuestionLibraryClose();
    }

    this.flyoutService.create<QuestionsLibraryComponent>(this.flyoutData).subscribe(questionsLibrary => {
      questionsLibrary.canSelect = true;
      questionsLibrary.selectedQuestionIdsChange.asObservable().subscribe((data) => {
        this.questionAddedFromLibrary = data
      })
    });
  }

  private onQuestionLibraryClose() {
    if(this.questionAddedFromLibrary.length === 0)
      return;
    
    this.quizForm.markAsDirty();
    this.questionAddedFromLibrary.forEach(x => {
      x.setId = this.getQuizSetId(this.currentSetIndex);
      x.id = 0;
      let questionFormControl = this.formControlMappers.mapQuestionToFbGroup(x);
      this.getQuizSetQuestions(this.currentSetIndex).push(questionFormControl);
    })
    this.questionAddedFromLibrary = [];
  }

  openNewQuestionFormFlyot = () => {
    this.flyoutData.content = QuestionFormComponent;
    this.flyoutData.title = "Novo pitanje";
    this.flyoutData.size = FlyoutSize.Small;

    this.flyoutService.create<QuestionFormComponent>(this.flyoutData).subscribe(questionForm =>{
      questionForm.onSubmitEvent.asObservable().subscribe(data=>{
        this.addQuestionToForm(data);
      })
    })
  }

  private addQuestionToForm(question: any) {
    this.quizForm.markAsDirty();
    question.id = 0;
    question.setId = this.getQuizSetId(this.currentSetIndex);
    let questionControl = this.formControlMappers.mapQuestionToFbGroup(question);
    this.getQuizSetQuestions(this.currentSetIndex).push(questionControl);
  }

  openSetsLibrary() {
    this.flyoutData.content = SetsLibraryComponent;
    this.flyoutData.title = "Baza setova";
    this.flyoutData.size = FlyoutSize.Large;
    this.flyoutData.onClose = () => this.onSetsLibraryClose();

    this.flyoutService.create<SetsLibraryComponent>(this.flyoutData).subscribe(setsLibrary => {
      setsLibrary.canSelect = true;
      setsLibrary.selectedSetIdEvent.asObservable().subscribe(data => {
        this.setsAddedFromLibrary = data;
      })
    })

  }

  private onSetsLibraryClose() {
    if (this.setsAddedFromLibrary.length === 0) {
      return;
    }
    this.quizSetTemplateService.GetSetTemplateByIdList(this.setsAddedFromLibrary)
      .subscribe(result => {
        result.forEach(x => {
          x.id = 0;
          x.gameId = this.quiz.id;
          x.questions.forEach((x: any) => x.id = 0);
          x.description ?? "";
          let setControl = this.formControlMappers.mapSetToFbGroup(x);
          this.sets.push(setControl);
        })
        this.setsAddedFromLibrary = [];
        this.quizForm.markAsDirty();
      })

  }
}
