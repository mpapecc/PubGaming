import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { QuestionFormComponent } from 'src/app/forms/question-form/question-form.component';
import { SetFormComponent } from 'src/app/forms/set-form/set-form.component';
import { FlyoutService } from 'src/app/services/flyout.service';
import { QuizSetTemplateService } from 'src/app/services/quiz-set-template.service';

@Component({
  selector: 'app-sets-library',
  templateUrl: './sets-library.component.html',
  styleUrls: ['./sets-library.component.css']
})
export class SetsLibraryComponent implements OnInit {
  @Output() selectedSetIdEvent = new EventEmitter<any>();
  @Input() canSelect: boolean = false;
  currentViewItems: any[] = [];
  selectedSetsIds: number[] = [];
  currentPage: number = 0;
  currentPageSize: number = 12;
  selectedSetId!: number;
  isSetFormFlyoutOpen: boolean = false;
  flyouts: any[] = [1];
  constructor(
    public quizSetTemplateService: QuizSetTemplateService,
    public router: Router,
    public flyoutService: FlyoutService
  ) { }

  ngOnInit(): void {
    this.quizSetTemplateService.getSetTemplates(12, this.currentPage)
      .subscribe(result => {
        this.currentViewItems = result;
      })
    setTimeout(() => this.flyouts.push(SetFormComponent)
    )
  }

  next() {
    this.currentPage += 1
    this.quizSetTemplateService.getSetTemplates(12, this.currentPage)
      .subscribe(result => {
        this.currentViewItems = result;
      })
  }

  previous() {
    this.currentPage -= 1
    this.quizSetTemplateService.getSetTemplates(12, this.currentPage)
      .subscribe(result => {
        this.currentViewItems = result;
      })
  }

  openSet = (setId: number) => {
    // this.router.navigate(['/edit-set', setId])
    this.selectedSetId = setId;
    this.isSetFormFlyoutOpen = true;
  }

  addSetToList(setId: number) {
    if (this.isSetSelected(setId)) {
      let index = this.selectedSetsIds.indexOf(setId);
      this.selectedSetsIds.splice(index, 1);
    } else {
      this.selectedSetsIds.push(setId);
    }
    console.log(this.selectedSetsIds)
    this.selectedSetIdEvent.emit(this.selectedSetsIds);

  }

  isSetSelected(setId: number) {
    return this.selectedSetsIds.includes(setId);
  }

  emitSelectedSetId(setId: number) {
    console.log("emiting set id")
    this.selectedSetIdEvent.emit(setId);
  }

  isNextAvailable = () => this.currentPageSize === this.currentViewItems.length;

  isFirstPage = () => this.currentPage === 0;

  closeSetFormFlyout = () => {
    this.quizSetTemplateService.getSetTemplates(12, this.currentPage)
      .subscribe(result => {
        this.currentViewItems = result;
        this.isSetFormFlyoutOpen = false;
      })
    return true;
  }


  openSetFormFlyout(){
    this.flyoutService.create(SetFormComponent).subscribe((setForm)=>{
      
    })
  }

}
