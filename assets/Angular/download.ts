import { Injectable } from '@angular/core';
import * as saver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  iframe: HTMLIFrameElement;

  constructor() {}

  getExtName(url: string): string {
    return url.replace(/.+\./, '').toLowerCase();
  }

  getFileName(url: string): string {
    return url.replace(/(.*\/)*([^.]+).*/ig, '$2');
  }

  download(url: string, name?: string) {
    name = name || this.getFileName(url) + '.' + this.getExtName(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = this.response;
        saver(blob, name);
      }
    };
    xhr.send();
  }

  downByIframe(url) {
    if (this.iframe) {
      document.body.removeChild(this.iframe);
      this.iframe = null;
    }
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.src = url;
    document.body.appendChild(this.iframe);
    setTimeout(() => {
      document.body.removeChild(this.iframe);
      this.iframe = null;
    }, 2000);
  }

  windowOpen(url) {
    window.open(url);
  }

  downByLink(data, fileName, extName) {
    const maps = {
      doc: 'application/msword',
      xls: 'application/vnd.ms-excel',
      zip: 'application/zip'
    };
    const blob = new Blob([data], { type: maps,get[extName] });
    const link = document.createElement('a');
    if ('download' in link) {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      link.style.height = '0px';
      link.style.width = '0px';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  }
}