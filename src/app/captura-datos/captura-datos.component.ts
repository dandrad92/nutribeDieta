import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-captura-datos',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './captura-datos.component.html',
  styleUrl: './captura-datos.component.css'
})
export class CapturaDatosComponent {
  paciente = {
    nombre: '',
    sexo: 'masculino',
    fechaNacimiento: '',
    edad: 0,
    telefono: '',
    motivoConsulta: '',
    peso: 0,
    pesoHabitual: 0,
    alturaCm: 0,
    alturaM: 0,
    imc: 0,
    cintura: 0,
    cadera: 0,
    relacionCC: 0,
    circMuneca: 0,
    complecion: '',
    formula: 'Harris-Benedict',
    factorActividad: 0,
    factorEstres: 0,
    geb: null as number | null,
    eta: null as number | null,
    get: null as number | null
  };


  macronutrientes = {
    carbohidratosGrKg: 0,
    proteinasGrKg: 0,
    lipidosGrKg: 0,
    carbohidratosGramos: 0,
    proteinasGramos: 0,
    lipidosGramos: 0,
    carbohidratosKcal: 0,
    proteinasKcal: 0,
    lipidosKcal: 0,
    carbohidratosPorcentaje: 0,
    proteinasPorcentaje: 0,
    lipidosPorcentaje: 0,
    kcalTotales: null as number | null,
    rcp: 0,
    rcpEstado: '',
    rcnp: 0,
    rcnpEstado: '',
    gNitrogeno: 0,
    gUrea: 0,
    flujoGlucosa: 0
  };

  // Variables adicionales para cálculos antropométricos
  pesoIdeal: number = 0;
  pesoAjustado: number = 0;
  pesoMinimo: number = 0;
  pesoMaximo: number = 0;
  ict: number = 0;
  riesgoCardiovascular: string = '';
  porcentajePesoIdeal: number = 0;
  interpretacionPI: string = '';
  porcentajePesoHabitual: number = 0;
  interpretacionPH: string = '';
  porcentajePerdidaPeso: number = 0;

  calcularComplecion(): void {
    if (this.paciente.alturaCm > 0 && this.paciente.circMuneca > 0) {
      const relacion = this.paciente.alturaCm / this.paciente.circMuneca;
      if (this.paciente.sexo === 'femenino') {
        if (relacion > 10.9) {
          this.paciente.complecion = 'Pequeña';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 21;
        } else if (relacion >= 9.9 && relacion <= 10.9) {
          this.paciente.complecion = 'Mediana';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 22;
        } else {
          this.paciente.complecion = 'Grande';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 23;
        }
      } else {
        if (relacion > 10.4) {
          this.paciente.complecion = 'Pequeña';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 22;
        } else if (relacion >= 9.6 && relacion <= 10.4) {
          this.paciente.complecion = 'Mediana';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 23;
        } else {
          this.paciente.complecion = 'Grande';
          this.pesoIdeal = (this.paciente.alturaCm / 100) ** 2 * 24;
        }
      }
    }
  }

  // Función para calcular índices antropométricos
  calcularIndicesAntropometricos(): void {
    const alturaM = this.paciente.alturaCm / 100;

    // Peso Ajustado
    this.pesoAjustado = (this.paciente.peso - this.pesoIdeal) * 0.25 + this.pesoIdeal;

    // Peso Mínimo
    this.pesoMinimo = alturaM * alturaM * 18.5;

    // Peso Máximo
    this.pesoMaximo = alturaM * alturaM * 24.9;

    // ICT (Índice Cintura/Talla)
    this.ict = this.paciente.cintura / this.paciente.alturaCm;
    this.riesgoCardiovascular = this.ict > 0.5 ? 'Sí' : 'No';
  }

  // Función para calcular porcentajes de peso ideal y habitual
  calcularPorcentajesPeso(): void {
    if (this.pesoIdeal > 0) {
      // % Peso Ideal
      this.porcentajePesoIdeal = (this.paciente.peso / this.pesoIdeal) * 100;

      if (this.porcentajePesoIdeal > 120) this.interpretacionPI = 'Obesidad';
      else if (this.porcentajePesoIdeal >= 110) this.interpretacionPI = 'Sobrepeso';
      else if (this.porcentajePesoIdeal >= 90) this.interpretacionPI = 'Normal';
      else if (this.porcentajePesoIdeal >= 85) this.interpretacionPI = 'Desnutrición Leve';
      else if (this.porcentajePesoIdeal >= 76) this.interpretacionPI = 'Desnutrición Moderada';
      else this.interpretacionPI = 'Desnutrición Grave';
    }

    if (this.paciente.pesoHabitual > 0) {
      // % Peso Habitual
      this.porcentajePesoHabitual = (this.paciente.peso / this.paciente.pesoHabitual) * 100;

      if (this.porcentajePesoHabitual > 90) this.interpretacionPH = 'Normal';
      else if (this.porcentajePesoHabitual >= 85) this.interpretacionPH = 'Desnutrición Leve';
      else if (this.porcentajePesoHabitual >= 75) this.interpretacionPH = 'Desnutrición Moderada';
      else this.interpretacionPH = 'Desnutrición Grave';

      // % Pérdida de Peso
      this.porcentajePerdidaPeso = ((this.paciente.pesoHabitual - this.paciente.peso) / this.paciente.pesoHabitual) * 100;
    }
  }

  
  calcularDistribucionMacronutrientes() {
    const peso = this.paciente.peso;
    const get = this.paciente.get ?? 2000;

    // Carbohidratos
    this.macronutrientes.carbohidratosGramos = this.macronutrientes.carbohidratosGrKg * peso;
    this.macronutrientes.carbohidratosKcal = this.macronutrientes.carbohidratosGramos * 4;
    this.macronutrientes.carbohidratosPorcentaje = (this.macronutrientes.carbohidratosKcal / get) * 100;

    // Proteínas
    this.macronutrientes.proteinasGramos = this.macronutrientes.proteinasGrKg * peso;
    this.macronutrientes.proteinasKcal = this.macronutrientes.proteinasGramos * 4;
    this.macronutrientes.proteinasPorcentaje = (this.macronutrientes.proteinasKcal / get) * 100;

    // Lípidos
    this.macronutrientes.lipidosGramos = this.macronutrientes.lipidosGrKg * peso;
    this.macronutrientes.lipidosKcal = this.macronutrientes.lipidosGramos * 9;
    this.macronutrientes.lipidosPorcentaje = (this.macronutrientes.lipidosKcal / get) * 100;

    // Total kcal
    this.macronutrientes.kcalTotales = this.macronutrientes.carbohidratosKcal + this.macronutrientes.proteinasKcal + this.macronutrientes.lipidosKcal;

    // Relación Calórico-Proteica (RCP)
    this.macronutrientes.rcp = this.macronutrientes.kcalTotales / this.macronutrientes.proteinasGramos;

    if (this.macronutrientes.rcp > 40) {
      this.macronutrientes.rcpEstado = 'Catabolismo';
    } else if (this.macronutrientes.rcp < 30) {
      this.macronutrientes.rcpEstado = 'Catabolismo';
    } else {
      this.macronutrientes.rcpEstado = 'Anabolismo';
    }

    // Cálculo de g Nitrógeno
    this.macronutrientes.gNitrogeno = this.macronutrientes.proteinasGramos / 6.25;

    // Cálculo de Calorías No Proteicas Totales
    const caloriasNoProteicas = this.macronutrientes.kcalTotales - this.macronutrientes.proteinasKcal;

    // Cálculo de RCNP
    this.macronutrientes.rcnp = caloriasNoProteicas / this.macronutrientes.gNitrogeno;

    if (this.macronutrientes.rcnp >= 150 && this.macronutrientes.rcnp <= 300) {
      this.macronutrientes.rcnpEstado = 'Anabolismo';
    } else {
      this.macronutrientes.rcnpEstado = 'Catabolismo';
    }

    // Cálculo de g Urea
    this.macronutrientes.gUrea = this.macronutrientes.gNitrogeno * 0.33;
    // Cálculo de Flujo de Glucosa
    this.macronutrientes.flujoGlucosa = ((this.macronutrientes.carbohidratosGramos * 1000) / peso) / 1440;
  }


  calcularIMC() {
    if (this.paciente.peso > 0 && this.paciente.alturaCm > 0) {
      const alturaM = this.paciente.alturaCm / 100;
      this.paciente.imc = parseFloat((this.paciente.peso / (alturaM * alturaM)).toFixed(2));
    }
  }

  calcularRelacionCC() {
    if (this.paciente.cintura > 0 && this.paciente.cadera > 0) {
      this.paciente.relacionCC = parseFloat((this.paciente.cintura / this.paciente.cadera).toFixed(2));
    }
  }

  convertirAltura() {
    this.paciente.alturaM = this.paciente.alturaCm / 100;
  }

  calcularGastoEnergeticoBasal() {
    let tmb = 0;

    switch (this.paciente.formula) {
      case 'Harris-Benedict':
        if (this.paciente.sexo === 'masculino') {
          tmb = 66.5 + (13.75 * this.paciente.peso) + (5 * this.paciente.alturaCm) - (6.79 * this.paciente.edad);
        } else {
          tmb = 655 + (9.56 * this.paciente.peso) + (1.85 * this.paciente.alturaCm) - (4.68 * this.paciente.edad);
        }
        break;

      case 'Mifflin':
        tmb = 10 * this.paciente.peso + 6.25 * this.paciente.alturaCm - 5 * this.paciente.edad;
        if (this.paciente.sexo === 'femenino') {
          tmb -= 161;
        } else {
          tmb += 5;
        }
        break;

      case 'FAO':
        if (this.paciente.edad >= 18 && this.paciente.edad <= 30) {
          tmb = (this.paciente.sexo === 'masculino' ? 15.3 : 14.7) * this.paciente.peso + 679;
        } else if (this.paciente.edad >= 31 && this.paciente.edad <= 60) {
          tmb = (this.paciente.sexo === 'masculino' ? 11.6 : 8.7) * this.paciente.peso + 879;
        } else {
          tmb = (this.paciente.sexo === 'masculino' ? 13.5 : 10.5) * this.paciente.peso + 487;
        }
        break;

      default:
        alert('Por favor selecciona una fórmula válida.');
        return;
    }

    this.paciente.geb = Math.round(tmb);
    this.paciente.eta = Math.round(tmb * 0.1); // ETA es el 10% del GEB
  }

  calcularGastoEnergeticoTotal() {
    if (this.paciente.geb !== null && this.paciente.eta !== null) {
      const eta = this.paciente.eta;
      const faf = this.paciente.factorActividad / 100; // Convertir porcentaje a decimal
      const fe = this.paciente.factorEstres / 100; // Convertir porcentaje a decimal

      const gastoEnergeticoTotal =
        this.paciente.geb + eta + (this.paciente.geb * faf) + (this.paciente.geb * fe);

      this.paciente.get = Math.round(gastoEnergeticoTotal);
    }
  }

  onSubmit() {
    console.log('Formulario enviado:', this.paciente);
  }
}
