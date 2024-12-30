import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FlyoutComponent } from 'src/app/infrastructure/flyout/flyout.component';
import { FormControlMappersService } from 'src/app/services/form-control-mappers.service';
import { QuizSetTemplateService } from 'src/app/services/quiz-set-template.service';
import { GameService } from 'src/app/services/game.service';
import { FlyoutService } from 'src/app/services/flyout.service';
import { SetFormComponent } from 'src/app/forms/set-form/set-form.component';
import { QuestionFormComponent } from 'src/app/forms/question-form/question-form.component';

@Component({
  selector: 'app-quiz-builder',
  templateUrl: './quiz-builder.component.html',
  styleUrls: ['./quiz-builder.component.css']
})
export class QuizBuilderComponent implements OnInit {
  @ViewChild('questionFlyout') questionFlyout!: FlyoutComponent;

  quiz: any;
  questionAddedFromLibrary: any[] = [];
  setsAddedFromLibrary: any[] = [];
  currentSetIndex: number = 0;
  quizId: any = "";
  isEditModeAllowed: boolean = false;
  quizPicture: any;
  isQuestionLibraryOpen: boolean = false;
  isNewQuestionOpen: boolean = false;
  isSetLibraryOpen: boolean = false;

  @Input()
  set id(id: string) {
    this.quizId = id
  }

  quizForm = this.fb.group({
    gameType: this.fb.control(0),
    id: this.fb.control(''),
    name: this.fb.control(''),
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
    public quizSetTemplateService: QuizSetTemplateService,
    private fb: FormBuilder,
    private formControlMappers: FormControlMappersService,
    public router: Router,
    public flyoutService: FlyoutService
  ) { }

  ngOnInit(): void {

    if (this.quizId) {
      this.gameService.GetGameTemplateById(this.quizId).subscribe((quiz: any) => {
        console.log(quiz)
        this.quiz = quiz;
        this.quizForm = this.formControlMappers.mapGameToFbGroup(quiz);
      });
      return;
    }
    this.gameService.CreateEmptyGame().subscribe((quiz: any) => {
      this.quiz = quiz
      this.quizForm.patchValue({
        id: quiz.id,
        gameType: quiz.gameType,
        name: quiz.name
      });

      quiz.sets.forEach((s: any) => {
        const set = this.fb.group({
          id: this.fb.control(s.id),
          gameId: this.fb.control(quiz.id),
          name: this.fb.control(s.name),
          questions: this.fb.array([])
        })

        this.sets.push(set);
      });
    });

    this.sets.disable();

    let form = this.flyoutService.create(SetFormComponent);
    let form1 = this.flyoutService.create(QuestionFormComponent);
    

    // form.instance.contentComponent = SetFormComponent;
    // form1.instance.contentComponent = QuestionFormComponent;    
  }

  selectedQuestionIdsChange(event: any) {
    this.questionAddedFromLibrary = event;
    console.log(event)
  }

  addNewSet() {
    this.sets.push(this.fb.group({
      name: this.fb.control("New sett"),
      gameId: this.fb.control(this.quiz.id),
      questions: this.fb.array([])
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

  removeSet(setIndex: number) {
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

  onQuestionLibraryClose() {
    this.isQuestionLibraryOpen = false;
    console.log(this.questionAddedFromLibrary);
    this.questionAddedFromLibrary.forEach(x => {
      x.setId = this.getQuizSetId(this.currentSetIndex);
      x.id = 0;
      let questionFormControl = this.formControlMappers.mapQuestionToFbGroup(x);
      this.getQuizSetQuestions(this.currentSetIndex).push(questionFormControl);
    })
    this.questionAddedFromLibrary = [];
  }

  openQuestionLibrary(setIndex: number) {
    this.currentSetIndex = setIndex;
    this.isQuestionLibraryOpen = !this.isQuestionLibraryOpen;
  }

  addQuestionToForm(question: any) {
    question.id = 0;
    question.setId = this.getQuizSetId(this.currentSetIndex);
    let questionControl = this.formControlMappers.mapQuestionToFbGroup(question);
    this.getQuizSetQuestions(this.currentSetIndex).push(questionControl);
    // this.questionFlyout.backdropClick();
  }

  onSetsLibraryClose() {
    this.isSetLibraryOpen = false;
    console.log(this.setsAddedFromLibrary)
    if (this.setsAddedFromLibrary.length === 0) {
      return;
    }
    this.quizSetTemplateService.GetSetTemplateByIdList(this.setsAddedFromLibrary)
      .subscribe(result => {
        result.forEach(x => {
          x.id = 0;
          x.gameId = this.quiz.id;
          x.questions.forEach((x: any) => x.id = 0);
          let setControl = this.formControlMappers.mapSetToFbGroup(x);
          this.sets.push(setControl);
        })
        this.setsAddedFromLibrary = [];
        this.quizForm.markAsDirty();
      })

  }

  openSetsLibrary() {
    this.isSetLibraryOpen = true;
  }

  selectSetFromLibrary(event: any) {
    this.setsAddedFromLibrary = event;
  }

}
