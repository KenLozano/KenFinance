import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import {
  Auth as FirebaseAuth,
  GoogleAuthProvider,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth =
    inject(FirebaseAuth);

  private readonly injector =
    inject(Injector);

  readonly user$: Observable<User | null> =
    authState(this.auth);

  login(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return runInInjectionContext(
      this.injector,
      () =>
        signInWithEmailAndPassword(
          this.auth,
          email,
          password,
        ),
    );
  }

  register(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return runInInjectionContext(
      this.injector,
      () =>
        createUserWithEmailAndPassword(
          this.auth,
          email,
          password,
        ),
    );
  }

  logout(): Promise<void> {
    return runInInjectionContext(
      this.injector,
      () =>
        signOut(this.auth),
    );
  }

  sendPasswordReset(
    email: string,
  ): Promise<void> {
    return runInInjectionContext(
      this.injector,
      () =>
        sendPasswordResetEmail(
          this.auth,
          email,
        ),
    );
  }

  updateDisplayName(
    user: User,
    name: string,
  ): Promise<void> {
    return runInInjectionContext(
      this.injector,
      () =>
        updateProfile(
          user,
          {
            displayName: name,
          },
        ),
    );
  }

  loginWithGoogle():
    Promise<UserCredential> {
    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    return runInInjectionContext(
      this.injector,
      () =>
        signInWithPopup(
          this.auth,
          provider,
        ),
    );
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}