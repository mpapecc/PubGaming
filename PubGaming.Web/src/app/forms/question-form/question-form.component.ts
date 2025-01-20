import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QuestionTemplateService } from 'src/app/services/question.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent {
  @Output() onSubmitEvent = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder, 
    private questionTemplateService:QuestionTemplateService,
    private toastMessageService: ToastMessageService
  ) { }

  get answers() {
    return this.profileForm.get('Answers') as unknown as FormArray;
  }

  profileForm : FormGroup = this.fb.group({
    text: this.fb.control(''),
    Answers: this.fb.array([
      this.fb.group({
        Text: this.fb.control(''),
        IsCorrect: this.fb.control(false)
      }),
      this.fb.group({
        Text: this.fb.control(''),
        IsCorrect: this.fb.control(false)
      }),
      this.fb.group({
        Text: this.fb.control(''),
        IsCorrect: this.fb.control(false)
      }),
      this.fb.group({
        Text: this.fb.control(''),
        IsCorrect: this.fb.control(false)
      })
    ])
  });

  onSubmit() {
    this.questionTemplateService.createQuestionTemplate(this.profileForm.value)
    .subscribe((result)=> {
      this.onSubmitEvent.emit(result)
      this.toastMessageService.showToast("Pitanje spremljeno")
    });
  }
}
