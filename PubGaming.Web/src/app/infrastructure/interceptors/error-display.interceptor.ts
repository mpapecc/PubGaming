import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import {Observable, tap } from 'rxjs';
import { ErrorDisplayService } from 'src/app/services/error-display.service';

@Injectable()
export class ErrorDisplayInterceptor implements HttpInterceptor {

  constructor(private errorDisplay:ErrorDisplayService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    return next.handle(request)
    .pipe(
      tap({
        // Operation failed; error is an HttpErrorResponse
        error: (error) => {
          console.log(error)
          this.errorDisplay.showError(`Error : ${error.error.title}. Error Message :  ${error.error.detail}`)
        }
      })
    );;
  }
}
