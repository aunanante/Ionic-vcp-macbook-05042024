import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickedElementService {

  private clickedCommerceSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {}

  // Method to set the clicked commerce
  setClickedCommerce(commerce: any) {
    this.clickedCommerceSubject.next(commerce);
  }

  // Method to get the clicked commerce as an Observable
  getClickedCommerce(): Observable<any> {
    return this.clickedCommerceSubject.asObservable();
  }
}
