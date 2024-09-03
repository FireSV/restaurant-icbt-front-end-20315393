import { getApi} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createChildrenHome = async (data) => {
  const response = await getApi()
    .post("/branch", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getallChildrenhome = async (page, limit, orderBy,keyword) => {
  const response = await getApi()
    .get("/branch/0/1000", {
      params: {
        page,
        limit,
        orderBy,
        keyword,
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

export const getChildrenHomeById = async(pharmacyId) =>{
  const response = await getApi()
  .get(`/pharmacies/${pharmacyId}`)
  .then((res) => {
    return buildResponse(true, res.data);
  })
  .catch((err) => {
    return buildResponse(false, err.response.data, err.response.status);
  });

  return response;
}

export const updateChildrenhome = async (pharmacyId,data) => {
  const response = await getApi()
    .patch(`/pharmacies/${pharmacyId}`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const deleteChildrenhome = async (pharmacyId) => {
  const response = await getApi()
    .delete(`/pharmacies/${pharmacyId}`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};