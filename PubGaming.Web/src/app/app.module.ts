import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { QuestionFormComponent } from './forms/question-form/question-form.component';
import { provideRouter, RouterModule, Routes, withComponentInputBinding } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavigationComponent } from './infrastructure/navigation/navigation.component';
import { QuestionsLibraryComponent } from './components/questions-library/questions-library.component';
import { ToastMessageComponent } from './infrastructure/toast-message/toast-message.component';
import { ErrorDisplayComponent } from './infrastructure/error-display/error-display.component';
import { ErrorDisplayInterceptor } from './infrastructure/interceptors/error-display.interceptor';
import { LoaderComponent } from './infrastructure/loader/loader.component';
import { JoinGameFormComponent } from './forms/join-game-form/join-game-form.component';
import { QuizBuilderComponent } from './components/quiz-builder/quiz-builder.component';
import { SetsLibraryComponent } from './components/sets-library/sets-library.component';
import { SetCardComponent } from './components/sets-library/set-card/set-card.component';
import { SetFormComponent } from './forms/set-form/set-form.component';
import { FlyoutComponent } from './infrastructure/flyout/flyout.component';
import { QuizzesLibraryComponent } from './components/quizzes-library/quizzes-library.component';
import { CreateGameRoomComponent } from './components/create-game-room/create-game-room.component';
import { DialogComponent } from './infrastructure/dialog/dialog.component';
import { PlayerComponent } from './components/player/player.component';
import { HostComponent } from './components/host/host.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { AuthInterceptor } from './infrastructure/interceptors/auth.interceptor';
import { ButtonComponent } from './ui/button/button.component';
import { InputComponent } from './ui/input/input.component';

const routes: Routes =[
  { path: 'add-question', component: QuestionFormComponent },
  { path: 'questions-library', component: QuestionsLibraryComponent },
  { path: 'sets-library', component: SetsLibraryComponent },
  { path: 'add-set', component: SetFormComponent },
  { path: 'edit-set/:id', component: SetFormComponent },
  { path: 'quiz-builder', component: QuizBuilderComponent },
  { path: 'quiz-builder/:id', component: QuizBuilderComponent },
  { path: 'quizzes-library', component: QuizzesLibraryComponent },
  { path: 'create-game-room', component: CreateGameRoomComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'host/:roomId', component: HostComponent },
  { path: '', component: JoinGameFormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionFormComponent,
    NavigationComponent,
    QuestionsLibraryComponent,
    ToastMessageComponent,
    ErrorDisplayComponent,
    LoaderComponent,
    JoinGameFormComponent,
    QuizBuilderComponent,
    SetsLibraryComponent,
    SetCardComponent,
    SetFormComponent,
    FlyoutComponent,
    QuizzesLibraryComponent,
    CreateGameRoomComponent,
    DialogComponent,
    PlayerComponent,
    HostComponent,
    LoginFormComponent,
    ButtonComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorDisplayInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(routes,withComponentInputBinding())
  ],
  bootstrap: [AppComponent],
  exports:[]
})
export class AppModule { }
