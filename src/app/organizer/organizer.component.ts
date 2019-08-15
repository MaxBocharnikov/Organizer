import { Component, OnInit } from '@angular/core';
import {DateService} from "../shared/services/date.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TasksService} from "../shared/services/tasks.service";
import {Task} from "../shared/interfaces/task";
import {switchMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup;
  tasks: Task[] = [];
  constructor(private dateService: DateService, private taskService: TasksService) { }

  ngOnInit() {
    console.log(this.tasks.length);
    this.load();
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  load() {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onSubmit() {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.taskService.create(task).subscribe(() => {
      this.form.reset();
      this.load();
    }, (error) => {
      console.log(error);
    })
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(() => {
      this.load();
    },(error) => {
      console.log(error);
    })
  }

}
