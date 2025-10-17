import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private defaultConfig: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
    };

    constructor(private snackBar: MatSnackBar) { }

    showSuccess(message: string, duration?: number): void {
        this.snackBar.open(message, 'Cerrar', {
            ...this.defaultConfig,
            duration: duration || this.defaultConfig.duration,
            panelClass: ['success-snackbar']
        });
    }

    showError(message: string, duration?: number): void {
        this.snackBar.open(message, 'Cerrar', {
            ...this.defaultConfig,
            duration: duration || this.defaultConfig.duration,
            panelClass: ['error-snackbar']
        });
    }

    showInfo(message: string, duration?: number): void {
        this.snackBar.open(message, 'Cerrar', {
            ...this.defaultConfig,
            duration: duration || this.defaultConfig.duration,
            panelClass: ['info-snackbar']
        });
    }
}