import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { isPlatform } from '@ionic/angular';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient
  private currentUser: BehaviorSubject<boolean | User> = new BehaviorSubject<boolean | User>(false);

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('SET USER');
    
        if (sess) {
          this.currentUser.next(sess.user);
        } else {
          this.currentUser.next(false);
        }
      } else {
        this.currentUser.next(false);
      }
    });    

    // Trigger initial session load
    this.loadUser()
  }

  async loadUser() {
    if (this.currentUser.value !== null) {
      // User is already set or null, no need to do anything else
      return;
    }
    const userResponse = await this.supabase.auth.getUser();
  
    if (userResponse.data?.user) {
      this.currentUser.next(userResponse.data.user);
    } else {
      this.currentUser.next(false);
    }
  }
  

  signUp(credentials: { email: any; password: any }) {
    return this.supabase.auth.signUp(credentials)
  }

  signIn(credentials: { email: any; password: any }) {
    return this.supabase.auth.signInWithPassword(credentials)
  }

  sendPwReset(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email)
  }

  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
  }

  getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable()
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return 'null'
    }
  }

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

}
