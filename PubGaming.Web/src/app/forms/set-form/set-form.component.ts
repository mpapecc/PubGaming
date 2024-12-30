import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControlMappersService } from 'src/app/services/form-control-mappers.service';
import { QuizSetTemplateService } from 'src/app/services/quiz-set-template.service';

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
  
  setId:number = 0;
  isQuestionLibraryOpen:boolean = false;
  isNewQuestionOpen:boolean = false;
  selectedQuestionsFromLibrary : any[] = [];

  get questions() {
    return this.setForm.get('questions') as unknown as FormArray;
  }

  getQuestionAnswers(questionIndex:number){
    return this.questions.at(questionIndex)?.get("answers") as unknown as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private quizSetTemplateService: QuizSetTemplateService,
    public router: Router,
    public formControlMappers: FormControlMappersService
  ) { }


  ngOnInit(): void {
    if(this.setId){
      this.quizSetTemplateService.getSetTemplateById(this.setId)
      .subscribe(result => {
        this.setForm = this.formControlMappers.mapSetToFbGroup(result);
      })
    }
  }

  setForm = this.fb.group({
    id: this.fb.control(0),
    name: this.fb.control("Novi set"),
    gameId: this.fb.control(0),
    questions: this.fb.array([])
  });

  onSubmit() {
    if(this.setId){
      this.quizSetTemplateService.updateSet(this.setForm.value).subscribe();
      return;
    }
    this.quizSetTemplateService.createNewSet(this.setForm.value).subscribe(result =>{
      this.router.navigate(['/edit-set', result.id]);
    });
  }

  addNewQuestion(){
    this.onNewQuestionClose();
  }

  removeQuestion(questionIndex:number){
    this.setForm.controls.questions.removeAt(questionIndex);
  }

  private convertAnswersToFbControls(question:any){
    switch (question.questionType) {
      case 0:
        return question.answers?.map((answer:any)=>{
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

  openQuestionLibrary(){
    this.isQuestionLibraryOpen = !this.isQuestionLibraryOpen;
  }

  onQuestionLibraryClose(){
    this.isQuestionLibraryOpen = false;
    console.log(this.selectedQuestionsFromLibrary)
    this.selectedQuestionsFromLibrary.forEach(x=>{
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

  selectedQuestionsChanged(event:any){
    this.selectedQuestionsFromLibrary = event;
  }

  onNewQuestionClose(){
    this.isNewQuestionOpen = !this.isNewQuestionOpen;
  }

  addNewQuestionToSet(event:any){
    let questionControl = this.formControlMappers.mapQuestionToFbGroup(event);
    this.questions.push(questionControl);
  }
}
