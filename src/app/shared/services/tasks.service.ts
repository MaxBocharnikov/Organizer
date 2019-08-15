import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../interfaces/task";
import {map} from "rxjs/internal/operators";
import {Observable} from "rxjs/index";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url = 'https://organizer-84903.firebaseio.com/';

  constructor(private http: HttpClient) { }

  create(task: Task): Observable<Task> {
    return this.http.post<any>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id:res.name}
      }))
  }

  load(date:moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if(!tasks) {
          return []
        }
        return Object.keys(tasks).map(key => ({...tasks[key], id: key}))
      }))
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }

}
