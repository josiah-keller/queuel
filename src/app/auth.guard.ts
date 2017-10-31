import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RealtimeService } from './services/realtime.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private realtimeService : RealtimeService, private router : Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Observable(observer => {
      let subscription = this.realtimeService.isAuthenticated().subscribe(authenticated => {
        if (! authenticated) {
          this.router.navigate(['/admin/login']);
        }
        observer.next(authenticated);
        subscription.unsubscribe();
      });
    });
  }
}
