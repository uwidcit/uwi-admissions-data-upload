import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MdCardModule, MdButtonModule, MdInputModule, MdTableModule } from '@angular/material';
import { CdkTableModule } from "@angular/cdk"
import { PapaParseModule, PapaParseService } from 'ngx-papaparse';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { DegreeCardComponent } from './components/degree-card/degree-card.component';
import { RequirementsCardComponent } from './components/requirements-card/requirements-card.component';
import { LoginComponent } from './components/login/login.component';
import { UploadComponent } from './components/upload/upload.component';
import { CanActivateViaFirebaseAuth } from './guards/gaurds';

const routes: Route[] = [
  {path: '', component: UploadComponent, canActivate: [CanActivateViaFirebaseAuth] },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DegreeCardComponent,
    RequirementsCardComponent,
    LoginComponent,
    UploadComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    CdkTableModule,
    MdTableModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PapaParseModule
  ],
  providers: [PapaParseService, CanActivateViaFirebaseAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
