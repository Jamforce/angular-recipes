import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per il download di file
 */
@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    download(observable$: Observable<HttpResponse<Blob>>) {
        return observable$
            .pipe(tap(response => {
                const fileName = this.getFileName(response);
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(response.body, fileName);
                } else {
                    const url = window.URL.createObjectURL(response.body);
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display: none');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                }
            }));
    }

    private getFileName(response: HttpResponse<Blob>) {
        let fileName = '';
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const matches = new RegExp(/filename="(.*?)"/).exec(disposition);
            if (matches != null && matches[1]) {
                fileName = matches[1].replace(/['"]/g, '');
            }
        }
        return fileName;
    }

}
