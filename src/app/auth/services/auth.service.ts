import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { User } from 'src/app/dashboard/pages/users/models';
import { environment } from 'src/environments/environment.local';
import { LoginPayload } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authUser$ = new BehaviorSubject<User | null>(null);

  public authUser$ = this._authUser$.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(payload: LoginPayload): void {


    this.httpClient
    .get<User[]>(`${environment.baseUrl}/users?${payload.email}&password=${payload.password}`
    )
    .subscribe({
      next:(response) => {
        if(!response.length) {
          alert('Usuario o Contraseña invalidos')
        }else {
          const authUser = response[0];
          this._authUser$.next(authUser);
          localStorage.setItem('token', authUser.token);
          this.router.navigate(['dashboard/home']); 
        }
      },
      error: (err) => {
        alert('Error de conexion')
      }
    });
  }
  verifyToken(): Observable<boolean> {
    return this.httpClient
    .get<User[]>(`${environment.baseUrl}/users?token=${localStorage.getItem('token')}`
    ).pipe(
      map((users) => {
        if(!users.length) {
          return false;
        } else {
          const authUser = users[0];
          this._authUser$.next(authUser);
          localStorage.setItem('token', authUser.token);
          return true;
        }
      })
    );
  }
  logout(): void {
    this._authUser$.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);

  }
}


// CODIGO VIEJO

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, map, of } from 'rxjs';
// import { User } from 'src/app/dashboard/pages/users/models';
// import { environment } from 'src/environments/environment.local';
// import { LoginPayload } from '../models';
// import { Router } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { AuthActions } from 'src/app/store/auth/auth.actions';
// import { selectAuthUser } from 'src/app/store/auth/auth.selectors';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // private _authUser$ = new BehaviorSubject<User | null>(null);

//   public authUser$ = this.store.select(selectAuthUser)

//   constructor(private httpClient: HttpClient, private router: Router, private store: Store) { }

//   private handleAuthUser(authUser: User): void {
//     // this._authUser$.next(authUser);
//     this.store.dispatch(AuthActions.setAuthUser({ data: authUser }));
//     localStorage.setItem('token', authUser.token);
//   }

//   login(payload: LoginPayload): void {

//     this.httpClient
//     .get<User[]>(`${environment.baseUrl}/users?${payload.email}&password=${payload.password}`
//     )
//     .subscribe({
//       next:(response) => {
//         if(!response.length) {
//           alert('Invalid username or password')
//         }else {
//           const authUser = response[0];
//           this.handleAuthUser(authUser);
//           this.router.navigate(['dashboard/home']); 
//         }
//       },
//       error: (err) => {
//         alert('Error de conexion')
//       }
//     });
//   }
//   verifyToken(): Observable<boolean> {
//     return this.httpClient
//     .get<User[]>(`${environment.baseUrl}/users?token=${localStorage.getItem('token')}`
//     ).pipe(
//       map((users) => {
//         if(!users.length) {
//           return false;
//         } else {
//           const authUser = users[0];
//           this.handleAuthUser(authUser);
//           return true;
//         }
//       })
//     );
//   }
//   logout(): void {
//     // this._authUser$.next(null);
//     this.store.dispatch(AuthActions.resetState());
//     localStorage.removeItem('token');
//     this.router.navigate(['/auth/login']);

//   }
// }
