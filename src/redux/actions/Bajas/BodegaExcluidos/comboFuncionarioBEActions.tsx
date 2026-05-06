import axiosInstance from "../../../../services/axiosConfig";


// Types para Redux
export const COMBO_FUNCIONARIO_BE_REQUEST = 'COMBO_FUNCIONARIO_BE_REQUEST';
export const COMBO_FUNCIONARIO_BE_SUCCESS = 'COMBO_FUNCIONARIO_BE_SUCCESS';
export const COMBO_FUNCIONARIO_BE_FAIL = 'COMBO_FUNCIONARIO_BE_FAIL';

export const comboFuncionarioBEActions = () => async (dispatch: any, getState: any) => {
    dispatch({ type: COMBO_FUNCIONARIO_BE_REQUEST });
    const token = getState().loginReducer.token;
    if (token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        };
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/ComboFuncionarioBE/`, config);
            dispatch({
                type: COMBO_FUNCIONARIO_BE_SUCCESS,
                payload: Array.isArray(res.data) ? res.data : [res.data],
            });
            return true;
        } catch (error) {
            dispatch({ type: COMBO_FUNCIONARIO_BE_FAIL });
            return false;
        }
    } else {
        dispatch({ type: COMBO_FUNCIONARIO_BE_FAIL });
        return false;
    }
};
