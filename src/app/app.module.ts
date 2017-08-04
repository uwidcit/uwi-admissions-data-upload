import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

@NgModule({
  declarations: [
    AppComponent,
    DegreeCardComponent,
    RequirementsCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    CdkTableModule,
    MdTableModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PapaParseModule
  ],
  providers: [PapaParseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
