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
  setId: number = 0;
  selectedQuestionsFromLibrary: any[] = [];
  flyoutData: Flyout<any> = new Flyout<any>();
  isLoading: boolean = false;

  get questions() {
    return this.setForm.get("questions") as unknown as FormArray;
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
    if (this.setId > 0) {
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
    if (!this.setForm.dirty)
      return;
    
    this.isLoading = true;
    let saveCall = this.setId ? this.quizSetTemplateService.updateSet(this.setForm.value) : this.quizSetTemplateService.createNewSet(this.setForm.value);
    saveCall.subscribe(() => {
      this.isLoading = false;
    });

  }

  removeQuestion = (questionIndex: number) => {
    this.setForm.controls.questions.removeAt(questionIndex);
  }

  openQuestionLibraryFlyout() {
    this.flyoutData.title = "Novo pitanje"
    this.flyoutData.content = QuestionsLibraryComponent
    this.flyoutData.onClose = () => {
      if (this.selectedQuestionsFromLibrary.length > 0)
        this.onQuestionLibraryClose();
    }

    this.flyoutService.create<QuestionsLibraryComponent>(this.flyoutData).subscribe(questionForm => {
      questionForm.canSelect = true;
      questionForm.selectedQuestionIdsChange.asObservable().subscribe(result => {
        this.selectedQuestionsFromLibrary = result;
      })
    })
  }

  private onQuestionLibraryClose() {
    this.selectedQuestionsFromLibrary.forEach(x => {
      this.addNewQuestionToSet(x);
    })
    this.selectedQuestionsFromLibrary = [];
  }

  openNewQuestionFlyout() {
    this.flyoutData.title = "Novo pitanje"
    this.flyoutData.content = QuestionFormComponent

    this.flyoutService.create<QuestionFormComponent>(this.flyoutData).subscribe(questionForm => {
      questionForm.onSubmitEvent.asObservable().subscribe(result => {
        this.addNewQuestionToSet(result);
        this.setForm.markAsDirty();
      })
    })
  }

  private addNewQuestionToSet(event: any) {
    let questionControl = this.formControlMappers.mapQuestionToFbGroup(event);
    this.questions.push(questionControl);
  }
}
