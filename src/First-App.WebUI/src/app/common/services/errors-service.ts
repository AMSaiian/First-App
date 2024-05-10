import { Injectable } from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({ providedIn: "root" })
export class ErrorsService {
  private errorSubject = new Subject<string>();

  public error$ = this.errorSubject.asObservable();

  setError(error: string) {
    this.errorSubject.next(error);
  }
}
