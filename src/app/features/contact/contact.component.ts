import { Component, OnInit } from '@angular/core';
import { PersonalInfoInterface } from '../../core/models/portfolio.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  personalInfo$: Observable<PersonalInfoInterface | undefined>;
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' | '' = '';

  private readonly WEB3FORMS_ACCESS_KEY =
    'c579947d-cd4b-4cb7-a472-12a59355c8a5';

  constructor(
    private portfolioSandbox: PortfolioSandbox,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.personalInfo$ = this.portfolioSandbox.personalInfo$;
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitMessageType = '';

      try {
        const formData = new FormData();
        const formValues = this.contactForm.value;

        // Add Web3Forms required fields
        formData.append('access_key', this.WEB3FORMS_ACCESS_KEY);
        formData.append('name', formValues.name);
        formData.append('email', formValues.email);
        formData.append('subject', formValues.subject);
        formData.append('message', formValues.message);

        // Optional: Add additional fields for better email formatting
        formData.append('from_name', formValues.name);
        formData.append('replyto', formValues.email);

        // Send the form to Web3Forms
        const response: any = await this.http
          .post('https://api.web3forms.com/submit', formData)
          .toPromise();

        if (response.success) {
          console.log('Email sent successfully:', response);
          this.submitMessage =
            'Thank you for your message! I will get back to you soon.';
          this.submitMessageType = 'success';
          this.contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        this.submitMessage =
          'Sorry, there was an error sending your message. Please try again or contact me directly.';
        this.submitMessageType = 'error';
      } finally {
        this.isSubmitting = false;

        // Clear message after 5 seconds
        setTimeout(() => {
          this.submitMessage = '';
          this.submitMessageType = '';
        }, 5000);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
