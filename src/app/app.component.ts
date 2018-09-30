import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Mortgage Calculator';

  color: number[] = [];

  public graph = {data:[], layout:{}};

  constructor() {
    for (let i = 0; i < 256; i++) {
      this.color.push(i);
    }

    this.graph = {
      data: [
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          z: [10, 20, 30],
          type: 'scatter3d',
          marker: {
            size: 4,
            gradient: {
              type: 'horizontal'
            }
          }
        },
      ],
      layout: { width: 2048, height: 1396, title: 'A Fancy Plot' }
    }

    this.updateGraph(1300000, 360, 4.0, 5.5, 0.05, 20, 35, 1);

  }

  reloadGraph(interestRates: number[], downPaymentPercent: number[], mortgage: number[]) {
    this.graph.data[0]['x'] = interestRates;
    this.graph.data[0]['y'] = downPaymentPercent;
    this.graph.data[0]['z'] = mortgage;
  }

  updateGraph(
    principal: number,
    months: number,
    startInterestRate: number,
    endInterestRate: number,
    incrementInterestRate,
    startDownPercent: number,
    endDownPercent: number,
    incrementDownPercent: number,
  ) {
    let interestRates: number[] = [];
    for (let i = startInterestRate; i <= endInterestRate; i += incrementInterestRate) {
      interestRates.push(i);
    }

    let downPercents: number[] = [];
    for (let i = startDownPercent; i <= endDownPercent; i += incrementDownPercent) {
      downPercents.push(i);
    }

    let mortgages: number[] = [];
    let down: number[] = [];
    let interests: number[] = [];
    for (let dp of downPercents) {
      for (let i of interestRates) {
        let m = this.calculateMortgage(principal, i, dp, months);
        mortgages.push(m);
        down.push(dp);
        interests.push(i);
      }
    }

    this.reloadGraph(interests, down, mortgages);
  }

  calculateMortgage(principal: number, interestRate: number, downPercent: number, months: number) {
    let p = principal * (1 - downPercent / 100); // amount on which to charge
    let r = interestRate / (12 * 100); // monthly interest
    let n = months;

    let r_plus_1_powern = Math.pow(1 + r, n);
    let m = p * (r * r_plus_1_powern) / (r_plus_1_powern - 1);
    return m;
  }

}
