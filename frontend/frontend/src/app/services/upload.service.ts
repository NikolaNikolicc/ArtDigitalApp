import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private server = "http://localhost:8080"

  constructor(private http: HttpClient) { }

  // define function to upload Files
  upload(imageBlobs: Blob[], imageNames: string[]): Observable<HttpEvent<string[]>> {
    const formData = new FormData();
    
    // Append each file; filenames are handled automatically
    imageBlobs.forEach((blob, index) => {
      formData.append('files', blob, imageNames[index]);
    });

    return this.http.post<string[]>(`${this.server}/file/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // define function to download files

}
