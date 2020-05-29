import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-create-fish-modal',
  templateUrl: './create-fish-modal.component.html',
  styleUrls: ['./create-fish-modal.component.scss']
})
export class CreateFishModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateFishModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
