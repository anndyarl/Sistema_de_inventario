import { Dispatch } from 'redux';
export const limpiarDataActions = () => async (dispatch: Dispatch): Promise<boolean> => {
    // persistor.purge();
    // persistor.flush();
    dispatch({ type: "LIMPIAR_DATA" });
    return true;
};