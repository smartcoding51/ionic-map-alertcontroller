import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;

  private options: GeolocationOptions;
  private currentPos: Geoposition;
  private userLat: any;
  private userLong: any;
  private map: any;

  constructor(private geolocation: Geolocation, public alertController: AlertController) {}

  ionViewDidEnter() {
    this.getUserPosition();
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy : false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
      this.userLat = pos.coords.latitude;
      this.userLong = pos.coords.longitude;
      this.addMap(pos.coords.latitude, pos.coords.longitude);
    }, (err: PositionError) => {
      console.log('error: ' + err.message);
    });
  }

  addMap(lat, long) {
    const latLng = new google.maps.LatLng(lat, long);

    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

  addMarker() {
    // const userMarker = 'assets/img/custom_icon.jpg';
    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      // icon: userMarker
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.presentAlert();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'My Location',
      subHeader: '',
      message: 'latitude: ' + this.userLat + '<br>Longitude: ' + this.userLong,
      buttons: ['OK']
    });

    await alert.present();
  }
}
