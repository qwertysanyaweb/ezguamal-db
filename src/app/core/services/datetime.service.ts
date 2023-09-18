import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  convertDateForDB(datetime: any): string {
    let obj = this.parseDateIntoElements(datetime);
    return obj.year + '-' + obj.month + '-' + obj.day;
  }

  parseDateIntoElements(dete: any): any {
    let datetime = new Date(dete);
    let month = datetime.getMonth() + 1;
    return {
      year: datetime.getFullYear(),
      month: month < 10 ? '0' + month : month,
      day: datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate(),
      hours: datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
      minutes: datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
      seconds: datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds(),
    };
  }

  convertDateTime(value: string): string {
    return moment(value).format('DD.MM.yyyy, HH:mm');
  }

  convertTime(value: string): string {
    return moment(value).format('HH:mm');
  }

  convertDate(value: string): string {
    return moment(value).format('yyyy-MM-DD');
  }
}
