// import { getApi } from "../utils/axios";
// import { buildResponse } from "../utils/responseBuilder";

// export const registerUser = async (data) => {
//   const response = await getApi()
//     .post("/users", data)
//     .then((res) => {
//       return buildResponse(true, res.data);
//     })
//     .catch((err) => {
//       return buildResponse(false, err.response.data, err.response.status);
//     });

//   return response;
// };

import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const registerUser = async (data) => {
  // const validRoles = [
  //   "customer",
  //   "donner",
  //   "children home",
  //   "admin",
  // ];

  // if (!validRoles.includes(data.role)) {
  //   return buildResponse(false, { message: "Invalid role selected!" });
  // }

  const response = await getApi()
    .post("/register", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
