import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundColor = '#e5e8e8';
  }

  error = "";
  csvFile: File | null = null;
  companies = [];

  // On file Select
  onChange(event) {
    this.csvFile = event.target.files[0];
    this.error = "";
  }

  validateCsv(){
    if( this.csvFile == null){
      this.error = "No se ha seleccionado un archivo a validar";
      return;
    }

    let ext = this.csvFile.name.split('.').pop();

    if(ext != "csv"){
      this.error = "Por favor, selecciona un archivo con extension .csv";
      return;
    }

    this.readCsv();

  }

  readCsv(){
    let reader: FileReader = new FileReader();
         reader.readAsText(this.csvFile);
         
         reader.onload = (e) => {
          let csv: any = reader.result;
          let allTextLines = [];
          allTextLines = csv.split(/\r\n|\r|\n/, -1);
          
          
          for(let i = 1; i < allTextLines.length; i++){
            let company:string[] = allTextLines[i].split(',');

            let oCompany: Company = {
              line: i+1,
              id: company[0],
              empresa: company[1],
              rfc: company[2],
              email: company[3],
              telefono : company[4],
              extranjera: company[5],
              errores: null
            };

            this.companies.push(oCompany);
          }

          this.validateCompanies();

      }
  }

  validateCompanies(){
    for(let i = 0; i < this.companies.length; i++){
      let errores = new Array<string>;
      let aux:Company = this.companies[i];

      if(this.wrongNumber(aux.id)){
        errores.push("Campo ID no es un numerico");
      }
      if(this.isNotAlphanumeric(aux.empresa)){
        errores.push("Campo EMPRESA solo puede contener letras, números y espacios con máximo de 50 caracteres");
      }
      if(this.isNotRfcValid(aux.rfc)){
        errores.push("Campo RFC invalido");
      }
      if(this.isNotValidEmail(aux.email)){
        errores.push("Campo EMAIL invalido");
      }
      if(this.isNotValidPhone(aux.telefono)){
        errores.push("Campo TELEFONO invalido");
      }
      if(this.isNotBoolean(aux.extranjera)){
        errores.push("Campo EXTRANJERA invalido");
      }

      aux.errores = errores;

      this.companies[i] = aux;
    }


  }

  wrongNumber(str:string){
    if(!isNaN(+str)){
      if(Number(str) > 0){
        return false;
      }
    }
    return true;
  }

  isNotAlphanumeric(str:string){
    if(str===null || str===""){
      return false
    }
    var regex = /^[a-zA-Z0-9 ]*$/;
    if(!regex.test(str) || str.length > 50){
      return true;
    }
    return false;
  }

  isNotRfcValid(str:string){
    if(str===null || str===""){
      return true
    }
    var regex = /^[A-Z0-9]*$/;
    if(!regex.test(str) || str.length > 13){
      return true;
    }
    return false;
  }

  isNotValidEmail(str:string){
    if(str===null || str===""){
      return true
    }
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!regex.test(str)){
      return true;
    }
    return false;
  }

  isNotValidPhone(str:string){
    if(str===null || str===""){
      return false
    }
    var regex = /^[\d]/;
    if(!regex.test(str) || str.length > 9){
      return true;
    }
    return false;
  }

  isNotBoolean(str:string){
    if(str===null || str===""){
      return true
    }
    if(str === "true"
      || str === "1"
      || str === "false"
      || str === "0"
      || str === "verdadero"
      || str ===  "falso"){
      return false;
      }
      return true;
  }

}

interface Company  {
  line: number;
  id: string;
  empresa: string;
  rfc: string;
  email: string;
  telefono: string;
  extranjera: string;
  errores: string[];
}
