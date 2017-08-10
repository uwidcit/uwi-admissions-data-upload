import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MdCardModule, MdButtonModule, MdInputModule, MdToolbarModule } from '@angular/material';
import { PapaParseModule, PapaParseService } from 'ngx-papaparse';
import { NG_TABLE_DIRECTIVES } from 'ng2-expanding-table';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UploadComponent } from './components/upload/upload.component';
import { RowContentComponent } from './components/upload/row-content.component'
import { CanActivateViaFirebaseAuth } from './guards/gaurds';

const routes: Route[] = [
  {path: '', component: UploadComponent, canActivate: [CanActivateViaFirebaseAuth] },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    NG_TABLE_DIRECTIVES,
    AppComponent,
    LoginComponent,
    UploadComponent,
    RowContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    MdToolbarModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PapaParseModule
  ],
  entryComponents: [
    RowContentComponent
  ],
  providers: [PapaParseService, CanActivateViaFirebaseAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
