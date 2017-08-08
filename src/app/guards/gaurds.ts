import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class CanActivateViaFirebaseAuth implements CanActivate {

    constructor(private auth: AngularFireAuth, private router: Router){   
    }

    canActivate() : boolean{
        if(this.auth.auth.currentUser != null) return true;
        
        this.router.navigate(['/login']);
        return false;
    }

}
