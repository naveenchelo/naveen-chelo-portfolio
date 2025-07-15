import { Component, OnInit } from '@angular/core';
import { PersonalInfoInterface } from '../../core/models/portfolio.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  personalInfo$: Observable<PersonalInfoInterface | undefined>;
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private portfolioSandbox: PortfolioSandbox,
    private fb: FormBuilder
  ) {
    this.personalInfo$ = this.portfolioSandbox.personalInfo$;
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    // Component initialization
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      setTimeout(() => {
        console.log('Form submitted:', this.contactForm.value);
        this.isSubmitting = false;
        this.contactForm.reset();
        alert('Thank you for your message! I will get back to you soon.');
      }, 2000);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
