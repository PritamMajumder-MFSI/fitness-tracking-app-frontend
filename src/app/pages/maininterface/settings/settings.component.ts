import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import getErrorMessage from '../../../../utils/getErrorMessage';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormatCamelCasePipe } from '../../../pipes/format-camel-case.pipe';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast.service';
import { ThemingService } from '../../../services/theming.service';
import { CommonModule } from '@angular/common';
type Mode = 'dark' | 'light';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormatCamelCasePipe,
    CommonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  public settingsForm: FormGroup;
  public dateFormats = [
    {
      value: 1,
      displayName: 'dd/mm/yyyy',
    },
    {
      value: 2,
      displayName: 'mm/dd/yyyy',
    },
  ];
  public themes = ['dark', 'light'];
  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private themeService: ThemingService
  ) {
    this.settingsForm = this.fb.group({
      theme: ['', [Validators.required]],
      dateFormat: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.getSettings();
  }
  getSettings() {
    const dateFormat =
      localStorage.getItem('dateFormat') || this.dateFormats[0].value;
    const theme = localStorage.getItem('theme') || this.themes[0];
    this.settingsForm.setValue({
      dateFormat: Number(dateFormat),
      theme,
    });
  }
  saveUserDetails() {
    if (this.settingsForm.invalid) {
      this.toast.add(
        'Please make sure all the inputs are valid!',
        3000,
        'error'
      );
      return;
    }
    localStorage.setItem('theme', this.settingsForm.value.theme);
    localStorage.setItem('dateFormat', this.settingsForm.value.dateFormat);
    this.themeService.updateCurrentMode(this.settingsForm.value.theme as Mode);
    this.toast.add('Settings saved successfully!', 3000, 'success');
  }
  public getErrorMessage = getErrorMessage;
}
