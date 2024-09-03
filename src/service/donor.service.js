import { getApi} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createDonner = async (data) => {
  const response = await getApi()
    .post("/global-medicines", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getGlobalDonner = async (page, limit, orderBy, keyword) => {
  const response = await getApi()
    .get("/global-medicines", {
      params: {
        page,
        limit,
        orderBy,
        keyword
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

export const getGolbalDonationByid = async(globalMedicineId) =>{
  const response = await getApi()
  .get(`/global-medicines/${globalMedicineId}`)
  .then((res) => {
    return buildResponse(true, res.data);
  })
  .catch((err) => {
    return buildResponse(false, err.response.data, err.response.status);
  });

  return response;
}

export const updateGlobalDonation = async (globalMedicineId,data) => {
  const response = await getApi()
    .patch(`/global-medicines/${globalMedicineId}`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};