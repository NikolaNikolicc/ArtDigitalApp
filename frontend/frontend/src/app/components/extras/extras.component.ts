import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('termsModal') modalElementRef!: ElementRef;
  error: String = "";
  showError: boolean = false;
  extrasChosen: String = "ne";
  extrasNames: String[] = ["Privezak", "Privezak", "Poster", "Magnet", "Bedž", "Stoni ram vertikalni"]
  extrasSave: String[] = ["privezak", "privezak", "poster", "magnet", "bedz", "ram"]
  extrasBlobs: Blob[] = [];
  extrasNamesForSavig: string[] = []
  imagePreviews: string[] = [];
  imageID: number = 0;
  numberOfPosibleExtras: number = 0;
  numberOfChosenExtras: number = -1;
  termsOfUsage: boolean = false;
  maxIndex: number = 0;
  fileStatus = { status: '', requestType: '', percent: 0 };

  constructor(private router: Router, private uploadService: UploadService) {

  }
  ngOnInit(): void {
    let iq = localStorage.getItem("imageQuantities");
    let iid = localStorage.getItem("imageID");
    if (iq == null || iid == null) return;
    let iqparsed = JSON.parse(iq);
    this.imageID = JSON.parse(iid);
    let photos = 0;
    for (let i = 0; i < iqparsed.length; i++) {
      photos += iqparsed[i];
    }
    this.numberOfPosibleExtras = Math.floor(photos / 100);
  }

  range(size: number) {
    let array = [];
    for (let i = 0; i < size; i++) {
      array.push(i);
    }
    return array;
  }

  update() {
    if (this.numberOfChosenExtras > this.maxIndex) {
      // this.extrasBlobs.push(new Blob());
      // this.imagePreviews.push("");
      this.maxIndex = this.numberOfChosenExtras;
    }
  }

  triggerFileInputClick(index: number): void {
    let fileInput = document.getElementById('photo-' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files == null) return;
    if (!input.files.length) return;

    const files = input.files;

    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'raw',
      'cr2',
      'nef',
      'arw',
      'tif',
      'gif',
    ];

    for (let i = 0; i < files.length; i++) {

      const extension = files[i].name.split('.').pop()?.toLocaleLowerCase();
      if (!extension) continue;
      if (!allowedExtensions.includes(extension!)) {
        if (this.showError) continue;
        else {
          this.showError = true;
          this.error =
            'Format izabrane fotografije nije podržan, molimo Vas da izaberete drugu.';
          const modalNative: HTMLElement = this.modalError.nativeElement;
          const modal = new bootstrap.Modal(modalNative, {
            backdrop: 'static', // Prevents closing when clicking outside
            keyboard: false, // Prevents closing with the escape key
          });
          modal.show();
          return;
        }
      }

      this.extrasNamesForSavig.push(extension);

      const blob = new Blob([files[i]], { type: files[i].type });
      this.extrasBlobs[index] = blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[index] = e.target.result;
      };
      reader.readAsDataURL(blob);
    }
  }

  setImageStyles() {
    const styles = {
      height: '200px', // Set the desired height
      width: '100%', // Set width to 100% of the card width
      'object-fit': 'contain', // Ensures the entire image fits within the dimensions
      overflow: 'hidden', // Hides parts of the image that overflow the dimensions (just in case)
    };
    return Object.entries(styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
  }

  back() {
    localStorage.setItem("backFromExtras", "true");
    this.router.navigate([""]);
  }

  next() {
    this.showError = false;
    this.error = "";
    if (this.extrasChosen === "da" && this.imagePreviews.length < this.numberOfChosenExtras * this.extrasNames.length) {
      this.error = "Ukoliko želite poklon morate dodati fotografiju za svaki poklon da biste prešli na sledeći korak.";
      this.showError = true;
    }
    for(let i = 0; i < this.numberOfChosenExtras * this.extrasNames.length; i++){
      if(this.imagePreviews[i] == null){
        this.error = "Ukoliko želite poklon morate dodati fotografiju za svaki poklon da biste prešli na sledeći korak.";
      this.showError = true;
      }
    }
    if (this.showError) {
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false // Prevents closing with the escape key
      });
      modal.show();
      return;
    }

    for (let i = 0; i < this.numberOfChosenExtras * this.extrasNames.length; i++) {
      let name = '';
      name +=
        'img' +
        ++this.imageID + // photo serial number
        '_' +
        this.extrasSave[i % this.extrasSave.length] + // instead of format write extra name
        '_' +
        "1" + // quantity 
        "_" +
        this.extrasNamesForSavig[i]; // extension
      this.extrasNamesForSavig[i] = name;
    }

    this.onUploadFiles();
  }

  onUploadFiles() {
    this.uploadService.upload(this.extrasBlobs, this.extrasNamesForSavig)
      .pipe(
        finalize(() => {
          const modalNative: HTMLElement = this.modalElementRef.nativeElement;
          const modal = new bootstrap.Modal(modalNative, {
            backdrop: 'static', // Prevents closing when clicking outside
            keyboard: false, // Prevents closing with the escape key
          });

          modal.show();
        })
      )
      .subscribe({
        next: data => {
          if (data) {
            // Optionally, you can handle successful upload here
          }
        },
        error: error => {
          // Optionally, you can handle errors here
          console.error('Upload error:', error);
        }
      });
  }

  private reportProgress(httpEvent: HttpEvent<string[]>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, "Uploading");
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, "Downloading");
        break;
      case HttpEventType.ResponseHeader:
        console.log("Header returned", httpEvent);
        break;
      default:
        console.log(httpEvent);
    }
  }

  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round((loaded / total!) * 100);
  }

  moveToNextPage() {
    if (this.termsOfUsage) {
      localStorage.setItem("extras", JSON.stringify(this.extrasBlobs));
      localStorage.setItem("extrasLength", JSON.stringify(this.extrasBlobs.length));
      localStorage.setItem("extrasChosen", JSON.stringify(this.extrasChosen));
      this.router.navigate(["details"]);
    }
  }

  toggleTermsOfUsage() {
    this.termsOfUsage = !this.termsOfUsage;
  }

}
