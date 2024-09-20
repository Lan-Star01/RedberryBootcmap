import { AfterViewInit, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentBodyParameters, BackendAPIService } from '../backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModalService } from '../services/shared-modal.service';


@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './shared-modal.component.html',
  styleUrl: './shared-modal.component.css'
})
export class SharedModalComponent implements AfterViewInit, OnDestroy {
  constructor(private fb: FormBuilder, private APIServices: BackendAPIService, private elementRef: ElementRef, public modalService: SharedModalService) {
    this.myForm();
  }

  addAgentForm!: FormGroup;
  @Input() closeModal!: () => void;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.modalService.closeModal();
  }

  myForm() {
    this.addAgentForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[5][0-9]*$')]],
      
    })
  }
  
  onSubmit() {
    if (this.addAgentForm.valid) {
      const formValue = this.addAgentForm.value;
      const formData = new FormData();
      
      formData.append('name', formValue.firstname);
      formData.append('surname', formValue.lastName);
      formData.append('email', formValue.email);
      formData.append('phone', formValue.phoneNumber);
      if (this.selectedFile instanceof File) {
        formData.append('avatar', this.selectedFile);
      }

      this.postAgents(formData);
      this.addAgentForm.reset();
      this.selectedFile = null;
      this.previewUrl = null;
      this.modalService.closeModal();
    
    } else {
      this.markFormGroupTouched(this.addAgentForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.modalService.closeModal();
  }


  removeImage(event: Event): void {
    event.preventDefault();
    this.previewUrl = null;
    this.selectedFile = null;
  }

  postAgents(agentData: FormData): void {
    this.APIServices.postAgents(agentData).subscribe(
      response => {
        console.log("Agent added successfully", response);
      },
      error => {
        console.error("Error adding agent", error);
      }
    );
  }
}
