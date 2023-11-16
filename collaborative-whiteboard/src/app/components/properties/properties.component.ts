import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shape } from 'src/app/enums/shape.enum';

import { PropertiesService } from 'src/app/services/properties/properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnDestroy {
  elementSelected = false;
  elementType: Shape = Shape.RECTANGLE;
  elementPropertiesSub: Subscription;
  clearSelectedSub: Subscription;

  positionInputsActive = false;
  dimensionsInputsActive = false;
  radiusInputActive = false;
  strokeInputsActive = false;
  fillInputsActive = false;
  textInputsActive = false;

  elementId: string | undefined;
  positionXValue: string | undefined;
  positionYValue: string | undefined;
  widthValue: string | undefined;
  heightValue: string | undefined;
  radiusValue: string | undefined;
  strokeWidthValue: string | undefined;
  strokeColorValue: string | undefined;
  fillColorValue: string | undefined;
  fillOpacityValue: string | undefined;
  fontSizeValue: string | undefined;
  textValue: string | undefined;

  constructor(private propertiesService: PropertiesService) {
    this.elementPropertiesSub =
      this.propertiesService.sendPropertiesEventEmmiter.subscribe(
        (properties) => {
          this.elementType = properties.shapeType;
          this.elementId = properties.id;
          this.positionXValue = properties.x;
          this.positionYValue = properties.y;
          this.widthValue = properties.width;
          this.heightValue = properties.height;
          this.radiusValue = properties.r;
          this.strokeWidthValue = properties['stroke-width'];
          this.strokeColorValue = properties.stroke;
          this.fillColorValue = properties.fill;
          this.fillOpacityValue = properties['fill-opacity'];
          this.textValue = properties.text;
          this.fontSizeValue = properties['font-size'];
          this.calulateActiveInputs(this.elementType);
          this.elementSelected = true;
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

  // resetPropertiesValues() {
  //   this.positionXValue = null;
  //   this.positionYValue = null;
  //   this.widthValue = null;
  //   this.heightValue = null;
  //   this.radiusValue = null;
  //   this.textValue = null;
  //   this.fontSizeValue = null;
  // }

  onStrokeChange(value: string) {
    this.strokeWidthValue = value;
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

  onPositionXChange(value: string) {
    this.positionXValue = value;
    this.sendProperties();
  }

  onPositionYChange(value: string) {
    this.positionYValue = value;
    this.sendProperties();
  }

  onWidthChange(value: string) {
    this.widthValue = value;
    this.sendProperties();
  }

  onHeightChange(value: string) {
    this.heightValue = value;
    this.sendProperties();
  }

  onRadiusChange(value: string) {
    this.radiusValue = value;
    this.sendProperties();
  }

  onTextChange(value: string) {
    this.textValue = value;
    this.sendProperties();
  }

  onFontSizeChange(value: string) {
    this.fontSizeValue = value;
    this.sendProperties();
  }

  sendProperties() {
    this.propertiesService.updatePropertiesEventEmmiter.next({
      id: this.elementId!,
      shapeType: this.elementType,
      x: this.positionXValue,
      y: this.positionYValue,
      width: this.widthValue,
      height: this.heightValue,
      r: this.radiusValue,
      stroke: this.strokeColorValue,
      'stroke-width': this.strokeWidthValue,
      fill: this.fillColorValue,
      'fill-opacity': this.fillOpacityValue,
      text: this.textValue,
      'font-size': this.fontSizeValue,
    });
  }

  calulateActiveInputs(shapeType: Shape) {
    this.positionInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.TEXT;
    this.dimensionsInputsActive = shapeType === Shape.RECTANGLE;
    this.radiusInputActive = shapeType === Shape.CIRCLE;
    this.strokeInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.PATH ||
      shapeType === Shape.LINE;
    this.fillInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.PATH;
    this.textInputsActive = shapeType === Shape.TEXT;
  }
}
