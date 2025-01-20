import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlMappersService {

  constructor(private fb:FormBuilder) { }

  mapGameToFbGroup(game:any){
    return this.fb.group({
      id: this.fb.control(game.id),
      gameType: this.fb.control(game.gameType),
      name: this.fb.control(game.name),
      description: this.fb.control(game.description),
      sets:this.fb.array(game.sets?.map((set:any) => {
        set.gameId = game.id;
        return this.mapSetToFbGroup(set);
      }))
    });
  }

  mapSetToFbGroup(set:any){
    return this.fb.group({
      id: this.fb.control(set.id),
      name: this.fb.control(set.name),
      description: this.fb.control(set.description),
      gameId: this.fb.control(set.gameId),
      questions:this.fb.array(set.questions?.map((question:any) => {
        question.setId = set.id;
        return this.mapQuestionToFbGroup(question);
      }))
    });
  }

  mapQuestionToFbGroup(question:any){
    console.log(question)
    return this.fb.group({
      id: this.fb.control(question.id),
      text: this.fb.control(question.text),
      setId: this.fb.control(question.setId),
      questionType: this.fb.control(question.questionType),
      answers: this.fb.array(this.convertAnswersToFbControls(question))
    })
  }

  convertAnswersToFbControls(question:any){
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
}
