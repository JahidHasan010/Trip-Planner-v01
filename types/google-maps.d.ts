declare interface Window {
  google: {
    maps: {
      places: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: google.maps.places.AutocompleteOptions
        ) => google.maps.places.Autocomplete;
        AutocompleteOptions: google.maps.places.AutocompleteOptions;
      };
    };
  };
}

declare namespace google.maps.places {
  interface Autocomplete {
    addListener(event: string, handler: () => void): void;
    getPlace(): {
      formatted_address?: string;
    };
  }

  interface AutocompleteOptions {
    types?: string[];
  }
}