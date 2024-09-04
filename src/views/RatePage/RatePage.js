// import React, { useState, useEffect, useRef, useMemo } from "react";
// import "./RatePage.css";
// import {
//   Typography,
//   Box,
//   Stack,
//   Grid,
//   Autocomplete,
//   Button,
//   TextField,
//   CircularProgress,
//   MenuItem,
// } from "@mui/material";
// import colors from "../../assets/styles/colors";
// import SearchBar from "../../components/common/SearchBar";
// import AddButton from "../../components/common/AddButton";
// import ReusableTable from "../../components/common/ReusableTable";
// import TableAction from "../../components/common/TableActions";
// import { useParams } from "react-router-dom";
// import {
//   getGolbalDonationByid,
//   getGlobalDonner,
// } from "../../service/donor.service";
// import { createDonation, getAllDonation } from "../../service/donation.service";
// import { popAlert, popDangerPrompt, popRatePrompt } from "../../utils/alerts";
// import donation from "../../models/donation";
// import Popup from "../../components/common/Popup";
// import DeleteButton from "../../components/common/DeleteButton";
// import EditButton from "../../components/common/EditButton";
// import {
//   getChildrenHomeById,
//   updateChildrenhome,
//   deleteChildrenhome,
// } from "../../service/childrenhome.service";
// import MapGoogalTwo from "../MapGoogalTwo";
// import Header from "../../components/common/Header";
// import Footer from "../../pages/Footer/Footer";
// import Rate from "../../components/common/Rate";

// const tableColumns = [
//   {
//     id: "name",
//     label: "Name",
//     minWidth: 140,
//     align: "left",
//   },
//   {
//     id: "nic",
//     label: "NIC",
//     align: "right",
//   },
//   {
//     id: "contactNumber",
//     label: "Contact Number",
//     align: "right",
//   },
//   {
//     id: "type",
//     label: "Donation Type",
//     align: "right",
//   },
//   {
//     id: "address",
//     label: "Address",
//     align: "right",
//   },
//   {
//     id: "email",
//     label: "Email",
//     align: "right",
//   },
//   {
//     id: "action",
//     label: "Action",
//     align: "right",
//   },
// ];

// const RatePage = () => {
//   const { id } = useParams();

//   const timeoutRef = useRef(null);

//   const [inputs, setInputs] = useState(donation);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSelectDataLoading, setIsSelectDataLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [editShowPopup, seteditShowPopup] = useState(false);
//   const [pharmacydata, setPharmacydata] = useState("");
//   const [input, setInput] = useState({});
//   const handlePopupClose = () => setShowPopup(false);
//   const edithandlePopupClose = () => seteditShowPopup(false);
//   const [editShowDonationPopup, seteditShowDonationPopup] = useState(false);
//   const edithandleDonationPopupClose = () => seteditShowDonationPopup(false);

//   // select medicine
//   const [globalMedicines, setGlobalMedicines] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     orderBy: "desc",
//   });
//   const [keyword, setKeyword] = useState("");
//   const [tableRows, setTableRows] = useState([]);
//   const [totalElements, setTotalElements] = useState(0);
//   const [gobalMedicine, setGobalMedicine] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const response = await createDonation(id, inputs);

//     if (response.success) {
//       setRefresh(!refresh);
//       response?.data?.message &&
//         popAlert("Success!", response?.data?.message, "success").then((res) => {
//           setShowPopup(false);
//           seteditShowPopup(false);
//         });
//     } else {
//       response?.data?.message &&
//         popAlert("Error!", response?.data?.message, "error");
//       response?.data?.data && setErrors(response.data.data);
//     }
//     setIsLoading(false);
//   };

//   //update childrenHome
//   const updatePharmacyhandleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const response = await updateChildrenhome(id, input);
//     console.log(input);
//     if (response.success) {
//       setRefresh(!refresh);
//       response?.data?.message &&
//         popAlert("Success!", response?.data?.message, "success").then((res) => {
//           seteditShowPopup(false);
//         });
//     } else {
//       response?.data?.message &&
//         popAlert("Error!", response?.data?.message, "error");
//       response?.data?.data && setErrors(response.data.data);
//     }
//     setIsLoading(false);
//   };

//   //delete rate
//   const deleteRateandleSubmit = async () => {
//     setIsLoading(true);

//     popDangerPrompt(
//       "DELETE",
//       "Are You sure you want to delete this Rate!",
//       "error"
//     ).then(async (res) => {
//       if (res.isConfirmed) {
//         const response = await deleteChildrenhome(id);

//         if (response.success) {
//           response?.data?.message &&
//             popAlert("Success!", response?.data?.message, "success").then(
//               (res) => {
//                 setShowPopup(false);
//                 window.location.replace("/childrenHome");
//               }
//             );
//         } else {
//           response?.data?.message &&
//             popAlert("Error!", response?.data?.message, "error");
//           response?.data?.data && setErrors(response.data.data);
//         }
//       }
//     });
//     setIsLoading(false);
//   };

//   const rateandleSubmit = async () => {
//     setIsLoading(true);

//     popRatePrompt(
//       "ADD RATE",
//       <div>
//         <p>Are You sure you want to delete this rate?</p>
//         <Rate />
//       </div>
//     ).then(async (res) => {
//       if (res.isConfirmed) {
//         const response = await deleteChildrenhome(id);

//         if (response.success) {
//           response?.data?.message &&
//             popAlert("Success!", response?.data?.message, "success").then(
//               (res) => {
//                 setShowPopup(false);
//                 window.location.replace("/childrenHome");
//               }
//             );
//         } else {
//           response?.data?.message &&
//             popAlert("Error!", response?.data?.message, "error");
//           response?.data?.data && setErrors(response.data.data);
//         }
//       }
//     });
//     setIsLoading(false);
//   };

//   //Global find by id
//   useEffect(() => {
//     let unmounted = false;

//     const fetchAndSet = async () => {
//       const response = await getGolbalDonationByid(id);
//       console.log("responseddd", response);

//       if (response.success) {
//         if (!unmounted) {
//           setGobalMedicine(response?.data);
//           // setInput(response?.data);
//         }
//       }
//     };

//     fetchAndSet();

//     return () => {
//       unmounted = true;
//     };
//   }, [id, refresh]);

//   console.log("gobalMedicine", gobalMedicine);

//   const handleUpdateClear = () => {
//     setInput(updateChildrenhome);
//   };

//   const handleClear = () => {
//     setInputs(donation);
//   };

//   const handlePageChange = (page) => {
//     setPagination({ ...pagination, page: page });
//   };

//   const handleLimitChange = (limit) => {
//     setPagination({ ...pagination, limit: limit });
//   };

//   const handleEdit = async (id) => {
//     const response = await getGolbalDonationByid(id);
//     console.log("responsessds", response);

//     if (response.success) {
//       const globalDonnerData = response.data;
//       setInput({
//         name: globalDonnerData.name,
//         nic: globalDonnerData.nic,
//         contactNumber: globalDonnerData.contactNumber,
//         address: globalDonnerData.address,
//         type: globalDonnerData.type,
//       });

//       seteditShowDonationPopup(true);
//     }
//   };

//   const handleDelete = (id) => {
//     console.log(id);
//   };

//   const handleSearch = (input) => {
//     setKeyword(input);
//   };

//   const handleMapInput = (input) => {};

//   const memoizedLabel = useMemo(
//     () =>
//       globalMedicines.find((medi) => medi.id === inputs.globalMedicine._id)
//         ?.label || "",
//     [inputs.globalMedicine._id]
//   );

//   const throttle = (func, time) => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(func, time);
//   };

//   //select childrenhome
//   useEffect(() => {
//     let unmounted = false;

//     if (!unmounted && open) setIsSelectDataLoading(true);

//     const fetchAndSet = async () => {
//       const response = await getGlobalDonner(1, 20, "desc", keyword);

//       if (response.success) {
//         if (!response.data) return;

//         let gMedicineArr = [];

//         for (const gMedicine of response.data.content) {
//           gMedicineArr.push({ label: gMedicine.name, id: gMedicine._id });
//         }

//         if (!unmounted) {
//           setGlobalMedicines(gMedicineArr);
//         }
//       } else {
//         console.error(response?.data);
//       }
//       if (!unmounted) setIsSelectDataLoading(false);
//     };

//     if (open) throttle(() => fetchAndSet(), 500);

//     return () => {
//       unmounted = true;
//     };
//   }, [keyword, open]);

//   useEffect(() => {
//     let unmounted = false;

//     if (!open && !unmounted) {
//       setGlobalMedicines([]);
//     }

//     return () => {
//       unmounted = true;
//     };
//   }, [open]);

//   useEffect(() => {
//     let unmounted = false;

//     if (!unmounted) setIsLoading(true);

//     const fetchAndSet = async () => {
//       const response = await getAllDonation(
//         id,
//         pagination.page,
//         pagination.limit,
//         pagination.orderBy,
//         keyword
//       );

//       if (response.success) {
//         if (!response.data) return;
//         console.log("responsssse", response);
//         let tableDataArr = [];
//         for (const donation of response.data.content) {
//           console.log("medicine", donation);
//           tableDataArr.push({
//             id: donation.global._id,
//             name: donation.global.doc.name,
//             nic: donation.global.doc.nic,
//             contactNumber: donation.global.doc.contactNumber,
//             type: donation.global.doc.type,
//             address: donation.global.doc.address,
//             email: donation.global.doc.email,
//             action: (
//               <TableAction
//                 id={donation.global._id}
//                 onView={handleEdit}
//                 // onView={() => handleEdit(medicine.global._id)}
//                 // onDelete={handleDelete}
//               />
//             ),
//           });
//         }

//         if (!unmounted) {
//           setTotalElements(response.data.totalElements);
//           setTableRows(tableDataArr);
//         }
//       } else {
//         console.error(response?.data);
//       }
//       if (!unmounted) setIsLoading(false);
//     };

//     fetchAndSet();

//     return () => {
//       unmounted = true;
//     };
//   }, [pagination, refresh, keyword, id]);

//   //pharmacy find by id
//   useEffect(() => {
//     let unmounted = false;

//     const fetchAndSet = async () => {
//       const response = await getChildrenHomeById(id);

//       if (response.success) {
//         if (!unmounted) {
//           setPharmacydata(response?.data);
//           setInput(response?.data);
//         }
//       }
//     };

//     fetchAndSet();

//     return () => {
//       unmounted = true;
//     };
//   }, [id, refresh]);

//   return (
//     <React.Fragment>
//       <Header />

//       <Box sx={{ ml: 5 }}>
//         <img
//           src="https://www.faithtoaction.org/wp-content/uploads/2015/05/Screen-Shot-2015-05-19-at-4.23.24-PM.png"
//           alt=""
//           style={{
//             width: 100,
//             height: 100,
//             objectFit: "cover",
//             borderRadius: 5,
//           }}
//         />
//       </Box>

//       <Box
//         sx={{
//           borderRadius: 4,
//           backgroundColor: colors.secondary,
//           boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
//           p: 3,
//           width: "95%",
//           justifyContent: "center",
//           alignItems: "center",
//           ml: 5,
//         }}
//       >
//         <Stack flexDirection="row" alignItems="center">
//           {/* <img
//             src="https://www.faithtoaction.org/wp-content/uploads/2015/05/Screen-Shot-2015-05-19-at-4.23.24-PM.png"
//             alt=""
//             style={{
//               width: 100,
//               height: 20,
//               objectFit: "cover",
//               borderRadius: 5,
//             }}
//           /> */}
//           <Rate />
//           <Grid container sx={{ ml: 5 }}>
//             <Grid item xs={12} md={6}>
//               <Box sx={{ marginBottom: "5px", fontWeight: "bold" }}>
//                 <Typography variant="p">{pharmacydata.name}</Typography>
//               </Box>

//               <Box>
//                 <Typography variant="p">
//                   {pharmacydata.registrationNumber}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box sx={{ marginBottom: "5px" }}>
//                 <Typography variant="p">{pharmacydata.address}</Typography>
//               </Box>

//               <Box>
//                 <Typography variant="p">
//                   {pharmacydata.contactNumber}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//           {/* <Grid item xs={12} md={2}>
//             <Box sx={{ marginBottom: "5px" }}>
//               <EditButton onClick={() => rateandleSubmit()} />
//             </Box>
//           </Grid> */}

//           <Grid item xs={12} md={2}>
//             <Box sx={{ marginBottom: "5px" }}>
//               <DeleteButton onClick={() => deleteRateandleSubmit()} />
//             </Box>
//           </Grid>
//         </Stack>
//       </Box>

//       <Box  sx={{ mt: 2 }}>
//         <Footer />
//       </Box>
//     </React.Fragment>
//   );
// };

// export default RatePage;

import React, { useState, useEffect } from "react";
import "./RatePage.css";
import SearchBar from "../../components/common/SearchBar";
import AddButton from "../../components/common/AddButton";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import Popup from "../../components/common/Popup";
import ReusableTable from "../../components/common/ReusableTable";
import {
  createChildrenHome,
  getallChildrenhome,
} from "../../service/childrenhome.service";
import ChildrenHomeModel from "../../models/Childrenhome";
import { popAlert } from "../../utils/alerts";
import colors from "../../assets/styles/colors";
import TableAction from "../../components/common/TableActions";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import Rate from "../../components/common/Rate";
import RateCard1 from "../../components/RateCard/RateCard1";
import RateCard2 from "../../components/RateCard/RateCard2";
import RateCard3 from "../../components/RateCard/RateCard3";
import RateCard4 from "../../components/RateCard/RateCard4";

//table columns
const tableColumns = [
  {
    id: "registrationNumber",
    label: "Reg Number",
    minWidth: 140,
    align: "left",
  },
  {
    id: "name",
    label: "Name",
    align: "right",
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    align: "right",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const RatePage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(ChildrenHomeModel);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await createChildrenHome(inputs);

    if (response.success) {
      setRefresh(!refresh);
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          setShowPopup(false);
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  const handleMapInput = (input) => {
    setInputs(input);
  };

  const handleClear = () => {
    setInputs(createChildrenHome);
  };

  const handleView = (id) => {
    navigate(`/childrenHome/${id}`);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handlePopupClose = () => setShowPopup(false);

  const handleSearch = (input) => {
    setKeyword(input);
  };

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getallChildrenhome(
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const addPharmacy of response.data.content) {
          tableDataArr.push({
            name: addPharmacy.name,
            registrationNumber: addPharmacy.registrationNumber,
            address: addPharmacy.address,
            contactNumber: addPharmacy.contactNumber,
            action: <TableAction id={addPharmacy._id} onView={handleView} />,
          });
        }

        if (!unmounted) {
          setTotalElements(response.data.totalElements);
          setTableRows(tableDataArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsLoading(false);
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [pagination, refresh, keyword]);

  return (
    <div className="main-container">
      <Header />
      <div className="content">
        <Box
          sx={{
            width: "100%",
            mt: "3%",
            padding: "10px",
          }}
        >
          {/* <Box sx={{ ml: 5 }}>
            <img
              src="https://www.faithtoaction.org/wp-content/uploads/2015/05/Screen-Shot-2015-05-19-at-4.23.24-PM.png"
              alt=""
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          </Box> */}

          <Box sx={{ width: "100%", mt: 5 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <RateCard1/>
              </Grid>
              <Grid item xs={3}>
                <RateCard2 />
              </Grid>
              <Grid item xs={3}>
                <RateCard3 />
              </Grid>
              <Grid item xs={3}>
                <RateCard4 />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* custom popup */}
        <Popup
          title="Add Branch"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 1 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="name"
                  variant="filled"
                  label="Enter Name"
                  fullWidth
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      name: e.target.value,
                    })
                  }
                />
                {errors["name"] && (
                  <Typography color="error">{errors["name"]}</Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="registrationNumber"
                  variant="filled"
                  label="Enter Registration Number"
                  fullWidth
                  value={inputs.registrationNumber}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      registrationNumber: e.target.value,
                    })
                  }
                />
                {errors["registrationNumber"] && (
                  <Typography color="error">
                    {errors["registrationNumber"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="numberofChildren"
                  variant="filled"
                  label="Test"
                  fullWidth
                  value={inputs.numberofChildren}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      numberofChildren: e.target.value,
                    })
                  }
                />
                {errors["numberofChildren"] && (
                  <Typography color="error">
                    {errors["numberofChildren"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="address"
                  variant="filled"
                  label="Enter Address"
                  fullWidth
                  value={inputs.address}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      address: e.target.value,
                    })
                  }
                />
                {errors["address"] && (
                  <Typography color="error">{errors["address"]}</Typography>
                )}
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  name="city"
                  variant="filled"
                  label="Enter City"
                  fullWidth
                  value={inputs.city}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      city: e.target.value,
                    })
                  }
                />
                {errors["city"] && (
                  <Typography color="error">{errors["city"]}</Typography>
                )}
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  name="postalCode"
                  variant="filled"
                  label="Enter Postal Code"
                  fullWidth
                  value={inputs.postalCode}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      postalCode: e.target.value,
                    })
                  }
                />
                {errors["postalCode"] && (
                  <Typography color="error">{errors["postalCode"]}</Typography>
                )}
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  name="contactNumber"
                  variant="filled"
                  label="Enter Contact Number"
                  fullWidth
                  value={inputs.contactNumber}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      contactNumber: e.target.value,
                    })
                  }
                />
                {errors["contactNumber"] && (
                  <Typography color="error">
                    {errors["contactNumber"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="email"
                  variant="filled"
                  label="Enter Email"
                  fullWidth
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      email: e.target.value,
                    })
                  }
                />
                {errors["email"] && (
                  <Typography color="error">{errors["email"]}</Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="password"
                  variant="filled"
                  label="Enter Password"
                  fullWidth
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      password: e.target.value,
                    })
                  }
                />
                {errors["password"] && (
                  <Typography color="error">{errors["password"]}</Typography>
                )}
              </Box>

              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="reset"
                  variant="contained"
                  onClick={handleClear}
                  sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ py: 2, px: 5 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress color="secondary" /> : "Save"}
                </Button>
              </Box>
            </form>
          </Box>
        </Popup>
      </div>
      <Footer />
    </div>
  );
};

export default RatePage;
