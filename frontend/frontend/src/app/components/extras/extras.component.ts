import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent {

  @ViewChild('errorModal') modalError!: ElementRef;
  error: String = "";
  showError: boolean = false;
  extrasChosen: String = "ne";
  extrasNames: String[] = ["Privezak", "Privezak", "Poster", "Magnet", "Bedž", "Stoni ram vertikalni"]
  extrasBlobs: (Blob | null)[] = [];

  constructor(private router: Router, private uploadService: UploadService){
    for(let i = 0; i < this.extrasNames.length; i++){
      this.extrasBlobs.push(null);
    }
  }

  triggerFileInputClick(index: number): void {
    let fileInput = document.getElementById('photo-' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event, index:number) {
    localStorage.setItem("photos uploaded", "true")

    const input = event.target as HTMLInputElement;
    if(input.files == null)return;
    if (!input.files.length) return;
    
    const files = input.files;

    for (let i = 0; i < files.length; i++) {
      const blob = new Blob([files[i]], { type: files[i].type });
      this.extrasBlobs[index] = blob;
    }
  }

  chooseLocation(){
    this.showError = false;
    this.error = "";
    if(this.extrasChosen === "da"){
      for(let i = 0; i < this.extrasBlobs.length; i++){
        if(this.extrasBlobs[i] == null){
          this.error = "Ukoliko želite poklon morate dodati fotografiju za svaki poklon da biste presli na sledeći korak.";
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
    this.router.navigate(["details"]);
  }
}
