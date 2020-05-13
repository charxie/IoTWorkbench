/*
 * @author Charles Xie
 */

import * as d3 from 'd3';

export class ColorSchemes {

  static getInterpolateColorScheme(scheme: string): void {
    switch (scheme) {
      case "Reds":
        return d3.interpolateReds;
      case "Greens":
        return d3.interpolateGreens;
      case "Blues":
        return d3.interpolateBlues;
      case "Greys":
        return d3.interpolateGreys;
      case "Oranges":
        return d3.interpolateOranges;
      case "Purples":
        return d3.interpolatePurples;
      case "RdYlBu":
        return d3.interpolateRdYlBu;
      case "RdYlGn":
        return d3.interpolateRdYlGn;
      case "RdGy":
        return d3.interpolateRdGy;
      case "RdBu":
        return d3.interpolateRdBu;
      case "PuOr":
        return d3.interpolatePuOr;
      case "PiYG":
        return d3.interpolatePiYG;
      case "PRGn":
        return d3.interpolatePRGn;
      case "BrBG":
        return d3.interpolateBrBG;
      case "YlOrRd":
        return d3.interpolateYlOrRd;
      case "YlOrBr":
        return d3.interpolateYlOrBr;
      case "PuRd":
        return d3.interpolatePuRd;
      case "RdPu":
        return d3.interpolateRdPu;
      case "YlGnBu":
        return d3.interpolateYlGnBu;
      case "YlGn":
        return d3.interpolateYlGn;
      case "BuGn":
        return d3.interpolateBuGn;
      case "OrRd":
        return d3.interpolateOrRd;
      case "GnBu":
        return d3.interpolateGnBu;
      case "BuPu":
        return d3.interpolateBuPu;
      case "PuBu":
        return d3.interpolatePuBu;
      case "PuBuGn":
        return d3.interpolatePuBuGn;
      case "Rainbow":
        return d3.interpolateRainbow;
      case "Sinebow":
        return d3.interpolateSinebow;
      case "Cubehelix":
        return d3.interpolateCubehelixDefault;
      case "Warm":
        return d3.interpolateWarm;
      case "Cool":
        return d3.interpolateCool;
      case "Cividis":
        return d3.interpolateCividis;
      case "Viridis":
        return d3.interpolateViridis;
      case "Spectral":
        return d3.interpolateSpectral;
      case "Inferno":
        return d3.interpolateInferno;
      case "Magma":
        return d3.interpolateMagma;
      case "Plasma":
        return d3.interpolatePlasma;
      default:
        return d3.interpolateTurbo; // I like Turbo!
    }
  }

}
