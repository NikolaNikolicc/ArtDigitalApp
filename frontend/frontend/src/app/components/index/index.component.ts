import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements AfterViewInit, OnInit {
  // You can use the non-null assertion operator (!) to tell TypeScript that the property will be initialized for sure, and it will not be null or undefined
  @ViewChild('notificationModal') modalElementRef!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('photoInput') photoInput!: ElementRef;
  imageBlobs: Blob[] = []; // pictures
  imageFormats: string[] = []; // dimension for printing
  imagePreviews: string[] = []; // for src (for user preview)
  imageNames: string[] = [];
  imageQuantities: number[] = []; // quantity for printing
  imageID: number = 0;
  photoFormat: string = '';
  error: string = '';
  showError: boolean = false;
  paperBacking: string = 'mat';
  // for pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  firstTimeUploadedPhotos: boolean = true;
  fileStatus = {status: '', requestType: '', percent: 0};

  // constructor
  constructor(private uploadService: UploadService, private router: Router) { }

  ngOnInit(): void { }

  // display modal on page load
  ngAfterViewInit(): void {
    localStorage.clear();
    const modalNative: HTMLElement = this.modalElementRef.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  // adding photos
  onFilesSelected(event: Event) {
    this.showError = false;

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
      // format validation
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLocaleLowerCase();
      if (!extension) continue;
      if (!allowedExtensions.includes(extension!)) {
        if (this.showError) continue;
        else {
          this.showError = true;
          this.error =
            'Neki od formata unetih fotografija nisu podržani, pa stoga te fotografije ne mogu biti obradjene.';
          continue;
        }
      }

      this.imageNames.push(extension);

      const blob = new Blob([files[i]], { type: files[i].type });
      this.imageBlobs.push(blob);
      this.imageQuantities.push(1);

      // add photo format if it is selected
      if (this.photoFormat != '') {
        this.imageFormats.push(this.photoFormat);
      } else {
        this.imageFormats.push('izaberi');
      }
      // Here you can either upload each blob right away or collect them in an array to upload later

      // Create a FileReader to read the blob
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(blob);
    }

    // show error modal if necessary
    if (this.showError) {
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
    }

    this.setupPagination();
    if (this.firstTimeUploadedPhotos == true) {
      this.currentPage = 1;
      this.firstTimeUploadedPhotos = false;
    } else {
      this.currentPage = this.totalPages;
    }
  }

  // for image  removing
  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.imageBlobs.splice(index, 1);
    this.imageNames.splice(index, 1);
    this.imageQuantities.splice(index, 1);
    this.imageFormats.splice(index, 1);
    this.setupPagination();
    if (this.totalPages < this.currentPage) {
      this.currentPage = this.totalPages;
    }
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.imageBlobs.length / this.itemsPerPage);
  }

  // get items that are located on certain page
  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.imagePreviews.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // moving through pagination
  goToPage(page: number) {
    this.currentPage = page;
  }

  // button prethodna
  onPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // button sledeca
  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // set all formats for all uploaded pictures
  setAllFormats(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.photoFormat = target.value;
    }
    this.imageFormats = [];
    for (let i = 0; i < this.imageBlobs.length; i++) {
      this.imageFormats.push(this.photoFormat);
    }
  }

  // decrement quantity of certain picture
  decrementValue(index: number) {
    this.imageQuantities[index] =
      this.imageQuantities[index] > 1 ? this.imageQuantities[index] - 1 : 1;
  }

  // increment quantity of certain picture
  incrementValue(index: number) {
    this.imageQuantities[index] = this.imageQuantities[index] + 1;
  }

  // set quantity manually
  changeValue(index: number, event: Event) {
    // The target is asserted to be an HTMLInputElement
    const inputElement = event.target as HTMLInputElement;
    // Now you can safely access the value property
    const newValue = inputElement.value;
    const numericValue = parseInt(newValue, 10);

    if (!isNaN(numericValue)) {
      if (numericValue > 0) {
        this.imageQuantities[index] = numericValue;
      } else {
        this.imageQuantities[index] = 1;
      }
    } else {
      // Handle the case where the new value is not a number
      this.imageQuantities[index] = 1; // Or some other default value
    }
  }

  // img preview
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

  // switches between components and preparing local storage
  next() {
    // error handling
    this.showError = false;
    this.error = '';
    if (this.imageBlobs.length == 0) {
      this.error = 'Niste uneli ni jednu fotografiju.';
      this.showError = true;
    }

    for (let i = 0; i < this.imageFormats.length; i++) {
      if (this.imageFormats[i] == 'izaberi') {
        this.error = 'Morate izabrati format izrade svih fotografija.';
        this.showError = true;
        break;
      }
    }

    if (this.showError) {
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
      return;
    }
    for (let i = 0; i < this.imageBlobs.length; i++) {
      let name = '';
      name +=
        'img' +
        ++this.imageID + // photo ID
        '_' +
        this.imageFormats[i] + // photo format for printing
        '_' +
        this.imageQuantities[i] + // quantity of photo for printing
        "_" +
        this.imageNames[i]; // photo extension
      this.imageNames[i] = name;
    }

    localStorage.setItem('imageBlobsLength', String(this.imageBlobs.length));
    localStorage.setItem('imageBlobs', JSON.stringify(this.imageBlobs));
    localStorage.setItem('imageFormats', JSON.stringify(this.imageFormats));
    localStorage.setItem("imageID", JSON.stringify(this.imageID));
    localStorage.setItem(
      'imageQuantities',
      JSON.stringify(this.imageQuantities)
    );
    localStorage.setItem('paperBacking', this.paperBacking);
    this.onUploadFiles();
  }

  onUploadFiles() {
    this.uploadService.upload(this.imageBlobs, this.imageNames)
      .pipe(
        finalize(() => {
          this.router.navigate(['extras']);
        })
      )
      .subscribe({
        next: event => this.reportProgress(event),
        error: (error: HttpErrorResponse) => {
          console.error("Error during file upload:", error);
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

}
