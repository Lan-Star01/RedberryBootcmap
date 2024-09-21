import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentBodyParameters, BackendAPIService } from '../services/backend-api.service';
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
export class SharedModalComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor(private fb: FormBuilder, private APIServices: BackendAPIService, private renderer: Renderer2, 
              private el: ElementRef, public modalService: SharedModalService) {
    //this.myForm();
  }
  
  addAgentForm!: FormGroup;
  previewUrlModal: string | ArrayBuffer | null = null;
  selectedFileModal: File | null = null;
  
  myForm() {
    this.addAgentForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[5][0-9]*$')]],
      
    })
  }

  ngOnInit(): void {
    this.myForm();

    const savedData = localStorage.getItem('addAgentForm');
    if (savedData) {
      this.addAgentForm.patchValue(JSON.parse(savedData));
    }

    const savedPreview = localStorage.getItem('selectedFilePreview');
    if (savedPreview) {
      this.previewUrlModal = savedPreview;
    }

    this.addAgentForm.valueChanges.subscribe(value => {
      localStorage.setItem('addAgentForm', JSON.stringify(value));
    });
  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.modalService.closeModal();
  }
  
  onSubmit() {
    if (this.addAgentForm.valid) {
      const formValue = this.addAgentForm.value;
      const formData = new FormData();
      
      formData.append('name', formValue.firstname);
      formData.append('surname', formValue.lastName);
      formData.append('email', formValue.email);
      formData.append('phone', formValue.phoneNumber);
      if (this.selectedFileModal instanceof File) {
        formData.append('avatar', this.selectedFileModal);
      }

      this.postAgents(formData);
    
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
  
  onFileSelectedModal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileModal = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrlModal = reader.result;
        localStorage.setItem('selectedFilePreview', this.previewUrlModal as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.modalService.closeModal();
    this.addAgentForm.reset();
    this.selectedFileModal = null;
    this.previewUrlModal = null;
    localStorage.removeItem('addAgentForm');
    localStorage.removeItem('selectedFilePreview');
  }

  onClose() {
    this.modalService.closeModal();
  }


  removeImage(event: Event): void {
    event.preventDefault();
    this.previewUrlModal = null;
    this.selectedFileModal = null;
    localStorage.removeItem('selectedFilePreview');
  }

  postAgents(agentData: FormData): void {
    this.APIServices.postAgents(agentData).subscribe(
      response => {
        this.addAgentForm.reset();
        this.selectedFileModal = null;
        this.previewUrlModal = null;
        this.modalService.closeModal();

        localStorage.removeItem('addAgentForm');
        localStorage.removeItem('selectedFilePreview');
      },
      error => {
        console.error("Error adding agent", error);
      }
    );
  }
}
