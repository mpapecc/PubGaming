import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Flyout, FlyoutService } from 'src/app/services/flyout.service';
import { FormControlMappersService } from 'src/app/services/form-control-mappers.service';
import { SetTemplateService } from 'src/app/services/set-template.service';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { QuestionsLibraryComponent } from 'src/app/components/questions-library/questions-library.component';

@Component({
  selector: 'app-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.css']
})
export class SetFormComponent implements OnInit {
  @Input()
  set id(id: number) {
    this.setId = id
  }

  @Input() canEdit: boolean = true;
  onSubmitCallback!: () => void
  setId: number = 0;
  isQuestionLibraryOpen: boolean = false;
  isNewQuestionOpen: boolean = false;
  selectedQuestionsFromLibrary: any[] = [];
  flyoutData: Flyout<any> = new Flyout<any>();
  isLoading: boolean = false;

  get questions() {
    return this.setForm.get('questions') as unknown as FormArray;
  }

  getQuestionAnswers(questionIndex: number) {
    return this.questions.at(questionIndex)?.get("answers") as unknown as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private quizSetTemplateService: SetTemplateService,
    public router: Router,
    public formControlMappers: FormControlMappersService,
    public flyoutService: FlyoutService
  ) { }


  ngOnInit(): void {
    if (this.setId) {
      this.quizSetTemplateService.getSetTemplateById(this.setId)
        .subscribe(result => {
          this.setForm = this.formControlMappers.mapSetToFbGroup(result);
        })
    }
  }

  setForm = this.fb.group({
    id: this.fb.control(0),
    name: this.fb.control("Novi set"),
    description: this.fb.control("Novi set"),
    gameId: this.fb.control(0),
    questions: this.fb.array([])
  });

  onSubmit() {
    if (this.setForm.dirty) {
      this.isLoading = true;
      let saveCall = this.setId ? this.quizSetTemplateService.updateSet(this.setForm.value) : this.quizSetTemplateService.createNewSet(this.setForm.value);
      saveCall.subscribe(() => {
        this.onSubmitCallback()
        this.isLoading = false;
      });
    }
    else
      this.onSubmitCallback();
  }

  removeQuestion(questionIndex: number) {
    this.setForm.controls.questions.removeAt(questionIndex);
  }

  private convertAnswersToFbControls(question: any) {
    switch (question.questionType) {
      case 0:
        return question.answers?.map((answer: any) => {
          return this.fb.group({
            text: this.fb.control(answer.text),
            isCorrect: this.fb.control(answer.isCorrect)
          })
        })
      case 1:
        return 2;
      default:
        break;
    }
  }

  openQuestionLibraryFlyout() {
    // this.isQuestionLibraryOpen = !this.isQuestionLibraryOpen;
    this.flyoutData.title = "Novo pitanje"
    this.flyoutData.content = QuestionsLibraryComponent
    this.flyoutData.onClose = () => {
      if (this.selectedQuestionsFromLibrary.length > 0) {
        this.selectedQuestionsFromLibrary.forEach(q => {
          this.onQuestionLibraryClose();
        })
      }
    }

    this.flyoutService.create<QuestionsLibraryComponent>(this.flyoutData).subscribe(questionForm => {
      questionForm.canSelect = true;
      questionForm.selectedQuestionIdsChange.asObservable().subscribe(result => {
        this.selectedQuestionsChanged(result)
      })
    })
  }

  onQuestionLibraryClose() {
    this.isQuestionLibraryOpen = false;
    console.log(this.selectedQuestionsFromLibrary)
    this.selectedQuestionsFromLibrary.forEach(x => {
      let questionFormControl = this.fb.group({
        id: this.fb.control(x.id),
        text: this.fb.control(x.text),
        set: this.fb.control(this.setId),
        questionType: this.fb.control(x.questionType),
        answers: this.fb.array(this.convertAnswersToFbControls(x))
      });
      this.questions.push(questionFormControl);
    })
    this.selectedQuestionsFromLibrary = [];
  }

  selectedQuestionsChanged(event: any) {
    this.selectedQuestionsFromLibrary = event;
  }

  openNewQuestionFlyout() {
    this.flyoutData.title = "Novo pitanje"
    this.flyoutData.content = QuestionFormComponent

    this.flyoutService.create<QuestionFormComponent>(this.flyoutData).subscribe(questionForm => {
      questionForm.onSubmitEvent.asObservable().subscribe(result => {
        this.addNewQuestionToSet(result)
      })
    })
  }

  addNewQuestionToSet(event: any) {
    let questionControl = this.formControlMappers.mapQuestionToFbGroup(event);
    this.questions.push(questionControl);
    this.setForm.markAsDirty();
  }
}
