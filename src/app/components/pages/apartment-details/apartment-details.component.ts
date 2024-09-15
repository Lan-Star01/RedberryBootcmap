import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartment-details',
  standalone: true,
  imports: [],
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.css'
})
export class ApartmentDetailsComponent implements OnInit {

  apartmentId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.apartmentId = params['id'];
    });
  }

}
