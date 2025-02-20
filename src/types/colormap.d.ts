declare module 'colormap' {
  interface ColormapOptions {
    colormap: string;
    nshades: number;
    format: 'hex' | 'rgbaString' | 'rgba' | 'float';
    alpha: number;
  }

  function colormap(options: ColormapOptions): string[];
  
  export = colormap;
} 