import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  public getDateFromText(text: string): Date {
    return new Date(text);
  }
}
