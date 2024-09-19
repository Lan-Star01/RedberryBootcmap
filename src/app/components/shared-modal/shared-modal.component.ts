import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendAPIService } from '../backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './shared-modal.component.html',
  styleUrl: './shared-modal.component.css'
})
export class SharedModalComponent implements AfterViewInit {
  constructor(private fb: FormBuilder, private APIServices: BackendAPIService, private elementRef: ElementRef) {
    this.myForm();
  }

  addAgentForm!: FormGroup;
  @Input() closeModal!: () => void;
  previewUrl: string | ArrayBuffer | null = null;
  

  ngAfterViewInit() {
    const modalElement = this.elementRef.nativeElement.querySelector('#addAgentModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);

    (this as any).modalInstance = modal;
  }

  myForm() {
    this.addAgentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.min(0)]],
    })
  }
  
  onSubmit() {
    if (this.addAgentForm.valid) {
      console.log(this.addAgentForm.value);
    } else {
      Object.keys(this.addAgentForm.controls).forEach(key => {
        const control = this.addAgentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.closeModal();
    const modalElement = this.elementRef.nativeElement.querySelector('#addAgentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.preventDefault();
    this.previewUrl = null;
  }
}
