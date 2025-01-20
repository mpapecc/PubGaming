import { Component, inject, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LoaderService } from "src/app/services/loader.service";

@Component({ template: '' })
export abstract class BaseWithLoaderComponent implements OnInit {

  constructor() {}
  
  private loaderService = inject(LoaderService);
  
  abstract OnInit() : Subscription

   ngOnInit(): void {
    this.loaderService.showLoader();
    this.OnInit().add(() => this.loaderService.hideLoader());
  }

}
