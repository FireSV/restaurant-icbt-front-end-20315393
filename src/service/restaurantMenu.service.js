import { getApi} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const restaurantMenu = async (data) => {
  const response = await getApi()
    .post("/restaurant-menu", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getRestaurantMenu = async (page, limit, orderBy, keyword) => {
  const response = await getApi()
    .get("/restaurant-menu/0/1000/0", {
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
