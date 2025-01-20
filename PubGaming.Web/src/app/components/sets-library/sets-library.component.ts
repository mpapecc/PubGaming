import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SetFormComponent } from 'src/app/forms/set-form/set-form.component';
import { Flyout, FlyoutService } from 'src/app/services/flyout.service';
import { SetTemplateService } from 'src/app/services/set-template.service';

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
  flyout: Flyout<any> = new Flyout<any>();

  constructor(
    public quizSetTemplateService: SetTemplateService,
    public router: Router,
    public flyoutService: FlyoutService
  ) { }

  ngOnInit(): void {
    this.quizSetTemplateService.getSetTemplates(12, this.currentPage)
      .subscribe(result => {
        this.currentViewItems = result;
      })
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
        this.flyout.closeFlyout();
      })
  }

  openSetFormFlyout = (setId: number = 0) => {
    this.flyout.content = SetFormComponent;
    this.flyout.title = setId === 0 ? "Novi set" : "Editiraj set";


    this.flyoutService.create<SetFormComponent>(this.flyout).subscribe((setForm) => {
      setForm.id = setId;
      this.flyout.onClose = () => {
        setForm.onSubmit();

        if (setForm.setForm.dirty)
          this.closeSetFormFlyout();
        else
          this.flyout.closeFlyout();
      }
    })
  }
}
