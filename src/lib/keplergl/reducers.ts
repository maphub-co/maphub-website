import keplerGlReducer from "@kepler.gl/reducers";

/*======= REDUCERS =======*/
export const custom_keplergl_reducers = keplerGlReducer.initialState({
  uiState: {
    currentModal: null,
    mapControls: {
      mapLegend: {
        show: true,
        active: true,
      },
    },
  },
});
