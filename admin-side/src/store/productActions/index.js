import { SET_LOADING, SET_PRODUCTS } from "../actionTypes";
import { fetching } from "../../helpers";
import { baseUrl } from "../../config/config";
function setProducts(resp) {
  return {
    type: SET_PRODUCTS,
    data: resp,
  };
}
function setLoading(data) {
  return {
    type: SET_LOADING,
    data,
  };
}

export function productsFetch() {
  return (dispatch, getState) => {
    dispatch(setProducts([]));
    dispatch(setLoading("fetch"));
    return fetching(`${baseUrl}/product`, 'GET', {
      access_token: localStorage.getItem("access_token"),
    })
      .then((resp) => {
        if (resp?.error) {
          dispatch(setLoading(false));
          return resp
        }
        dispatch(setProducts(resp));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function addProduct(payload) {
  return (dispatch, getState) => {
    dispatch(setLoading("add"));
    return fetching(
      `${baseUrl}/product`,
      "POST",
      {
        access_token: localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      payload
    )
      .then((resp) => {
        if (resp?.error) {
          dispatch(setLoading(false));
          return resp;
        }
        dispatch(productsFetch()).then((resp) => {
          if (resp?.error) {
            dispatch(setLoading(false));
            return resp;
          }
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function productEdit(data) {
  return (dispatch, getState) => {
    dispatch(setLoading('edit'));
    return fetching(
      `${baseUrl}/product/${data.id}`,
      "PUT",
      {
        access_token: localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      data
    )
      .then((resp) => {
        if (resp?.error) {
          dispatch(setLoading(false));
          return resp;
        }
        dispatch(productsFetch()).then((resp) => {
          if (resp?.error) {
            dispatch(setLoading(false));
            return resp;
          }
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function productDelete(id) {
  return (dispatch, getState) => {
    dispatch(setLoading("delete"));
    return fetching(`${baseUrl}/product/${id}`, "DELETE", {
      access_token: localStorage.getItem("access_token"),
    })
      .then((resp) => {
        if (resp?.error) {
          dispatch(setLoading(false));
          return resp;
        }
        dispatch(productsFetch()).then((resp) => {
          if (resp?.error) {
            dispatch(setLoading(false));
            return resp;
          }
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function getProduct(id, access_token) {
  return (dispatch, getState) => {
    return fetching(`${baseUrl}/product/${id}`, "GET", {
      access_token,
    }).then((resp) => {
      return resp;
    });
  };
}