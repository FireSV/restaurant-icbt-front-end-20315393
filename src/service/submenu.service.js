import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createSubMenu = async (data) => {
  const response = await getApi()
    .post(`/menu-type`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getDonationByid = async (gMedicineId, pharmacyId) => {
  const response = await getApi()
    .get(`/medicines/global-medicines/${gMedicineId}/pharmacies/${pharmacyId}`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getAllMenu = async (pharmacyId, page, limit, orderBy) => {
  const response = await getApi()
    .get(`/restaurant-menu/0/1000/0`, {
      params: {
        page,
        limit,
        orderBy,
      },
    })
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getAllSubMenu = async (pharmacyId, page, limit, orderBy) => {
  const response = await getApi()
    .get(`/menu-type/0/1000/0`, {
      params: {
        page,
        limit,
        orderBy,
      },
    })
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const addMenuType = async (body) => {
  const response = await getApi()
    .post(`/menu-type-assign`, body)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
