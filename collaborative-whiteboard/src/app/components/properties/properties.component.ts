import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PropertiesService } from 'src/app/services/properties/properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnDestroy {
  elementSelected = false;
  elementPropertiesSub: Subscription;
  strokeWidth = '4';
  elementId = '';
  strokeColorValue = '#000000';
  fillColorValue = '#FFFFFF';
  fillOpacityValue = '1';
  clearSelectedSub: Subscription;

  // @ViewChild('strokeColor') strokeColorPicker!: ElementRef;
  // @ViewChild('fillColor') fillColorPicker!: ElementRef;
  constructor(private propertiesService: PropertiesService) {
    this.elementPropertiesSub =
      this.propertiesService.sendPropertiesEventEmmiter.subscribe(
        (properties) => {
          this.strokeWidth = properties['stroke-width'];
          this.strokeColorValue = properties.stroke;
          this.fillColorValue = properties.fill;
          this.elementId = properties.id;
          this.elementSelected = true;
          this.fillOpacityValue = properties['fill-opacity'];
        }
      );

    this.clearSelectedSub =
      this.propertiesService.clearSelectedEventEmmiter.subscribe(() => {
        this.elementSelected = false;
      });
  }
  ngOnInit(): void {
    // this.fillColorPicker.nativeElement.value = this.fillColorV;
    // this.strokeColorPicker.nativeElement.value = this.strokeColorPicker;
  }
  ngOnDestroy(): void {
    this.clearSelectedSub.unsubscribe();
    this.elementPropertiesSub.unsubscribe();
  }

  onStrokeChange(value: string) {
    this.strokeWidth = value;
    this.sendProperties();
  }

  onStrokeColorChange(value: string) {
    this.strokeColorValue = value;
    this.sendProperties();
  }

  onFillColorChange(value: string) {
    this.fillColorValue = value;
    this.sendProperties();
  }

  onFillOpacityChange(value: string) {
    this.fillOpacityValue = value;
    this.sendProperties();
  }

  sendProperties() {
    this.propertiesService.updatePropertiesEventEmmiter.next({
      id: this.elementId,
      'stroke-width': this.strokeWidth,
      stroke: this.strokeColorValue,
      fill: this.fillColorValue,
      'fill-opacity': this.fillOpacityValue,
    });
  }
}
