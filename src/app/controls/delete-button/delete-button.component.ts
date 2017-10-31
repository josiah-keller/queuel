import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss'],
  animations: [
    trigger("deleteButton", [
      state("in", style({
        transform: "translateX(0)",
        opacity: "1",
      })),
      state("out", style({
        transform: "translateX(-20%)",
        opacity: "0",
      })),
      transition("in <=> out", animate("100ms ease-out")),
    ]),
    trigger("confirmation", [
      state("in", style({
        transform: "translateX(0)",
        opacity: "1",
      })),
      state("out", style({
        transform: "translateX(20%)", 
        opacity: "0",
      })),
      transition("in <=> out", animate("100ms ease-out")),
    ])
  ],
})
export class DeleteButtonComponent implements OnInit {
  confirming : Boolean = false;

  @Output() onConfirm : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  startDelete() : void {
    this.confirming = true;
  }
  cancelDelete() : void {
    this.confirming = false;
  }
  confirmDelete() : void {
    this.onConfirm.emit();
  }
}
