import {
  Component,
  Signal,
  signal,
  ChangeDetectionStrategy,
  inject,
  Inject,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgIf } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { AlertModule } from '@coreui/angular';
/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'app-quoter',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    MatCardModule,
    AlertModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule

  ],
  templateUrl: './quoter.component.html',
  styleUrl: './quoter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoterComponent {
  _quoterForm!: Signal<FormGroup>;

  ngOnInit(): void {
    this._quoterForm = signal<FormGroup>(
      new FormGroup({
        length: new FormControl(1, [Validators.required]),
        width: new FormControl(1, [Validators.required, Validators.min(1)]),
        height: new FormControl(1, [Validators.required, Validators.min(1)]),
      })
    );
  }

  get length() {
    return this._quoterForm().get('length');
  }

  get width() {
    return this._quoterForm().get('width');
  }

  get height() {
    return this._quoterForm().get('height');
  }

  largo: number = 1;
  ancho: number = 1;
  alto: number = 1;
  volumen: number = 0;
  costo: number = 0;
  mensaje: string = '';
  pedidoId: string = '';
  fechaIngreso: string = '';

  calcularCotizacion(): void {
    this.volumen = this.largo * this.ancho * this.alto;

    if (this.volumen > 2000000) {
      this.mensaje = 'El volumen supera los 2m³. Debe operar con un ejecutivo.';
      this.costo = 0;
      this.resetForm();
    } else {
      this.costo = Math.ceil(this.volumen / 20) * 2000;
      this.mensaje = `Pedido ingresado exitosamente. Volumen: ${this.volumen} cm³, Costo: ${this.costo} CLP.`;

      this.pedidoId = this.generarPedidoId();
      this.fechaIngreso = this.obtenerFechaActual();
    }

    this.openDialog('0ms', '0ms');
  }

  generarPedidoId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  }

  resetForm(): void {
    this.largo = 1;
    this.ancho = 1;
    this.alto = 1;
    this.volumen = 0;
    this.costo = 0;
    // this.mensaje = '';
    this.pedidoId = '';
    this.fechaIngreso = '';
  }

  readonly dialog = inject(MatDialog);

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { message: this.mensaje },
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    AlertModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  // readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
