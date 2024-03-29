import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadImage(blob: Blob) {
    const formData = new FormData();
    formData.append('image', blob);

    return this.http.post('/api/upload', formData);
  }
}
