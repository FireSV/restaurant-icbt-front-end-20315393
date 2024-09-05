import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createDonation = async (id, data) => {
  const response = await getApi()
    .post(`/medicines/pharmacies/${id}`, data)
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

export const getAllDonation = async (pharmacyId, page, limit, orderBy) => {
  const response = await getApi()
    .get(`/medicines/pharmacies/${pharmacyId}`, {
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

export const createTableData = async (data) => {
  const response = await getApi()
    .post(`/branch-tables`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
export const getTableData = async () => {
  const response = await getApi()
    .get(`/branch-tables/0/100000`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
export const getReservation = async () => {
  const response = await getApi()
    .get(`/reservation/0/100000/0`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
export const completeReservation = async (id) => {
  const response = await getApi()
    .get(`/reservation/`+id)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};



export const getData = async () => {
  const response = await getApi()
    .get(`/restaurant-menu/0/10000/0`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
