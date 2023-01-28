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

      }
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
  errores: string;
}
