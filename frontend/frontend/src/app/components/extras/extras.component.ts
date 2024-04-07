import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit{

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('termsModal') modalElementRef!: ElementRef;
  error: String = "";
  showError: boolean = false;
  extrasChosen: String = "ne";
  extrasNames: String[] = ["Privezak", "Privezak", "Poster", "Magnet", "Bedž", "Stoni ram vertikalni"]
  extrasBlobs: (Blob | null)[] = [];
  imagePreviews: string[] = [];
  numberOfPosibleExtras: number = 0;
  numberOfChosenExtras: number = -1;
  termsOfUsage: boolean = false;

  constructor(private router: Router, private uploadService: UploadService){

  }
  ngOnInit(): void {
    let numOfPhotos = localStorage.getItem("photosUploaded");
    if(numOfPhotos != null){
      // convert string to number and get floor value
      this.numberOfPosibleExtras = Math.floor(parseInt(numOfPhotos, 10) / 100);
    }
    for(let i = 0; i < this.extrasNames.length; i++){
      this.extrasBlobs.push(null);
      this.imagePreviews.push("");
    }

  }

  range(size: number){
    let array = [];
    for(let i = 0; i < size; i++){
      array.push(i);
    }
    return array;
  }

  update(){
    let numOfExtrasItems = this.extrasNames.length;
    if(this.extrasBlobs.length / numOfExtrasItems < this.numberOfChosenExtras){
      this.extrasBlobs.splice(-numOfExtrasItems, numOfExtrasItems);
      this.imagePreviews.splice(-numOfExtrasItems, numOfExtrasItems);
    }else if(this.extrasBlobs.length / numOfExtrasItems > this.numberOfChosenExtras){
      for(let i = 0; i < numOfExtrasItems; i++){
        this.extrasBlobs.push(null);
        this.imagePreviews.push("");
      }
    }
    return;
  }

  triggerFileInputClick(index: number): void {
    let fileInput = document.getElementById('photo-' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event, index:number) {
    const input = event.target as HTMLInputElement;
    if(input.files == null)return;
    if (!input.files.length) return;
    
    const files = input.files;

    for (let i = 0; i < files.length; i++) {
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

  next(){
    this.showError = false;
    this.error = "";
    if(this.extrasChosen === "da"){
      for(let i = 0; i < this.extrasBlobs.length; i++){
        if(this.extrasBlobs[i] == null){
          this.error = "Ukoliko želite poklon morate dodati fotografiju za svaki poklon da biste prešli na sledeći korak.";
          this.showError = true;
        }
      }
    }
    if(this.showError){
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false // Prevents closing with the escape key
      });
      modal.show();
      return;
    }
    localStorage.setItem("extras", JSON.stringify(this.extrasBlobs));

    const modalNative: HTMLElement = this.modalElementRef.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });

    modal.show();
  }

  moveToNextPage(){
    if(this.termsOfUsage)this.router.navigate(["details"]);
  }

}
