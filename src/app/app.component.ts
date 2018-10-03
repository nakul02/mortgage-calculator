import { Component } from '@angular/core';
import { formatCurrency} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Mortgage Calculator';

  // Input options
  loanAmount: number;
  interestRate: number;
  downPaymentPercent: number;
  loanTermInYears: number;
  hoa: number;
  propertyTaxRate: number ;
  pmi: number;        // yearly pmi amount
  insurance: number;  // Yearly insurance
  series: string;
  seriesNum:number;
  firstSeries : string;

  multipleData = false;

  public reset() {
    this.loanAmount = 1500000;
    this.interestRate = 4.75;
    this.downPaymentPercent = 20;
    this.loanTermInYears = 30;
    this.hoa = 500;
    this.propertyTaxRate = 1.20;
    this.pmi = 0;
    this.insurance = 1000;
    this.series = 'series 1';
    this.firstSeries = this.series;
    this.seriesNum = 1;
    this.multipleData = false;
    this.updateGraph(true);
  }
  constructor(){
    console.log('called constructor');
    this.reset();
  }

  // Graph Options
  view = [];
  explodeSlices = false;
  doughnut = false;
  showLabels = true;
  colorScheme: string = 'cool';
  schemeType: string = 'ordinal';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  showXAxisLabel = false;
  tooltipDisabled = false;
  xAxisLabel = 'Metric';
  showYAxisLabel = false;
  yAxisLabel = 'Total Monthly Payment';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = true;
  data: any[] = [];

  // Graph Event Handling
  onLegendLabelClick($event) {
    console.log(event);
  }

  select($event) {
    console.log(event);
  }

  pieTooltipText({ data }) {
    const label = data.name;
    const val = formatCurrency(data.value, 'en-US', 'USD');

    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">$${val}</span>
    `;
  }

  
  // Update the graph
  updateGraph(replace: boolean){
    console.log(`isMultipleData? : ${this.multipleData}`);
    console.log('called updateGraph');
    let monthly = this.calculateMortgage(this.loanAmount, this.interestRate, this.downPaymentPercent, this.loanTermInYears*12);
    let propertyTax = (this.loanAmount * this.propertyTaxRate)/1200;
    let toAdd = {
      "name": this.series,
      "series": [
        {
          "name": "P&I",
          "value": monthly
        },
        {
          "name": "Taxes",
          "value": propertyTax
        },
        {
          "name": "PMI",
          "value": this.pmi / 12
        },
        {
          "name": "Insurance",
          "value": this.insurance / 12
        },
        {
          "name": "HOA",
          "value": this.hoa
        }
      ]
    };
    if (replace) {
      this.firstSeries = this.series;
      this.data = toAdd.series;
    } else{
      if (!this.isMultipleData(this.data)){
        this.data = [{
          "name" :  this.firstSeries,
          "series" : [...this.data]
        }]
      }
      this.data.push(toAdd);
      this.data = [...this.data];
    }
    
    if (this.isMultipleData(this.data)){
      this.multipleData = true;
    } else {
      this.multipleData = false;
    }

    console.log(this.data);
    this.series = `series ` + this.seriesNum;
    this.seriesNum += 1;
  } 

  isMultipleData(data:any[]){
    if (data && data[0].series){
      return true;
    } else {
      return false;
    }
  }
  
  calculateMortgage(
    principal: number, 
    interestRate: number, 
    downPercent: number, 
    months: number
  ) {
    let p = principal * (1 - downPercent / 100); // amount on which to charge
    let r = interestRate / (12 * 100); // monthly interest
    let n = months;

    let r_plus_1_powern = Math.pow(1 + r, n);
    let m = p * (r * r_plus_1_powern) / (r_plus_1_powern - 1);
    return m;
  }

}
