import { Component, OnInit } from '@angular/core';
import { PersonalInfoInterface } from '../../core/models/portfolio.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

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
    emailjs.init(environment.emailjs.publicKey);
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitMessageType = '';

      try {
        const formData = this.contactForm.value;

        // EmailJS send method using environment configuration
        const result = await emailjs.send(
          environment.emailjs.serviceId,
          environment.emailjs.templateId,
          {
            name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            time: new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short',
            }),
            reply_to: formData.email,
            to_email: 'chelonaveen07@gmail.com',
          }
        );

        console.log('Email sent successfully:', result);
        this.submitMessage =
          'Thank you for your message! I will get back to you soon.';
        this.submitMessageType = 'success';
        this.contactForm.reset();
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
