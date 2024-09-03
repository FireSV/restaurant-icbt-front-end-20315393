import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Typography,
  Box,
  Stack,
  Grid,
  Autocomplete,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import colors from "../assets/styles/colors";
import SearchBar from "../components/common/SearchBar";
import AddButton from "../components/common/AddButton";
import ReusableTable from "../components/common/ReusableTable";
import TableAction from "../components/common/TableActions";
import { useParams } from "react-router-dom";
import {
  getGolbalDonationByid,
  getGlobalDonner,
  updateGlobalDonation,
} from "../service/donor.service";
import { createDonation, getAllDonation } from "../service/donation.service";
import { popAlert, popDangerPrompt } from "../utils/alerts";
import medicine from "../models/donation";
import Popup from "../components/common/Popup";
import DeleteButton from "../components/common/DeleteButton";
import EditButton from "../components/common/EditButton";
import {
  deleteChildrenhome,
  updateChildrenhome,
} from "../service/childrenhome.service";
import MapGoogalTwo from "./MapGoogalTwo";
import Header from "../components/common/Header";
import Footer from "../pages/Footer/Footer";
import DonationCalendar from "./DonationCalendar";

const tableColumns = [
  {
    id: "name",
    label: "Name",
    minWidth: 140,
    align: "left",
  },
  {
    id: "nic",
    label: "NIC",
    align: "right",
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    align: "right",
  },
  {
    id: "type",
    label: "Donation Type",
    align: "right",
  },
  {
    id: "address",
    label: "Address",
    align: "right",
  },
  {
    id: "email",
    label: "Email",
    align: "right",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const DonationProfile = () => {
  const { id } = useParams();

  const timeoutRef = useRef(null);

  const [inputs, setInputs] = useState(medicine);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectDataLoading, setIsSelectDataLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editShowPopup, seteditShowPopup] = useState(false);
  const [pharmacydata, setPharmacydata] = useState("");
  const [input, setInput] = useState({});
  const handlePopupClose = () => setShowPopup(false);
  const edithandlePopupClose = () => seteditShowPopup(false);
  const [editShowDonationPopup, seteditShowDonationPopup] = useState(false);
  const edithandleDonationPopupClose = () => seteditShowDonationPopup(false);

  // const [showDonationPopup, setShowDonationPopup] = useState(false);
  // const [editShowDonationPopup, setEditShowDonationPopup] = useState(false);

  // select medicine
  const [globalMedicines, setGlobalMedicines] = useState([]);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [keyword, setKeyword] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [gobalMedicine, setGobalMedicine] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await createDonation(id, inputs);

    if (response.success) {
      setRefresh(!refresh);
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          setShowPopup(false);
          seteditShowPopup(false);
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setIsLoading(false);
  };

  const updateDonnerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await updateGlobalDonation(id, input);

    if (response.success) {
      setRefresh(!refresh);
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          seteditShowPopup(false);
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setIsLoading(false);
  };

  //delete childrenHome
  const deletePharmacyhandleSubmit = async () => {
    setIsLoading(true);

    popDangerPrompt(
      "DELETE",
      "Are You sure you want to delete this pharmacy!",
      "error"
    ).then(async (res) => {
      if (res.isConfirmed) {
        const response = await deleteChildrenhome(id);

        if (response.success) {
          response?.data?.message &&
            popAlert("Success!", response?.data?.message, "success").then(
              (res) => {
                setShowPopup(false);
                window.location.replace("/childrenHome");
              }
            );
        } else {
          response?.data?.message &&
            popAlert("Error!", response?.data?.message, "error");
          response?.data?.data && setErrors(response.data.data);
        }
      }
    });
    setIsLoading(false);
  };

  //Global find by id
  useEffect(() => {
    let unmounted = false;

    const fetchAndSet = async () => {
      const response = await getGolbalDonationByid(id);
      console.log("responseddd", response);

      if (response.success) {
        if (!unmounted) {
          setGobalMedicine(response?.data);
          // setInput(response?.data);
        }
      }
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [id, refresh]);

  console.log("gobalMedicine", gobalMedicine);

  const handleUpdateClear = () => {
    setInput(updateChildrenhome);
  };

  const handleClear = () => {
    setInputs(medicine);
  };

  // const handleMapInput = (input) =>{
  //   setInput(input);
  // };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handleEdit = async (id) => {
    const response = await getGolbalDonationByid(id);
    console.log("responsessds", response);

    if (response.success) {
      const globalMedicineData = response.data;
      setInput({
        name: globalMedicineData.name,
        nic: globalMedicineData.nic,
        contactNumber: globalMedicineData.contactNumber,
        address: globalMedicineData.address,
        type: globalMedicineData.type,
        // ... add other fields here based on the actual data structure
      });

      seteditShowDonationPopup(true);
    }
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const handleMapInput = (input) => {
    // setInput(input);
  };

  const memoizedLabel = useMemo(
    () =>
      globalMedicines.find((medi) => medi.id === inputs.globalMedicine._id)
        ?.label || "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs.globalMedicine._id]
  );

  const throttle = (func, time) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(func, time);
  };

  //select pharmacies
  useEffect(() => {
    let unmounted = false;

    if (!unmounted && open) setIsSelectDataLoading(true);

    const fetchAndSet = async () => {
      const response = await getGlobalDonner(1, 20, "desc", keyword);

      if (response.success) {
        if (!response.data) return;

        let gMedicineArr = [];

        for (const gMedicine of response.data.content) {
          gMedicineArr.push({ label: gMedicine.name, id: gMedicine._id });
        }

        if (!unmounted) {
          setGlobalMedicines(gMedicineArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsSelectDataLoading(false);
    };

    if (open) throttle(() => fetchAndSet(), 500);

    return () => {
      unmounted = true;
    };
  }, [keyword, open]);

  useEffect(() => {
    let unmounted = false;

    if (!open && !unmounted) {
      setGlobalMedicines([]);
    }

    return () => {
      unmounted = true;
    };
  }, [open]);

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getAllDonation(
        id,
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      if (response.success) {
        if (!response.data) return;
        console.log("responsssse", response);
        let tableDataArr = [];
        for (const medicine of response.data.content) {
          console.log("medicine", medicine);
          tableDataArr.push({
            id: medicine.global._id,
            name: medicine.global.doc.name,
            nic: medicine.global.doc.nic,
            contactNumber: medicine.global.doc.contactNumber,
            type: medicine.global.doc.type,
            address: medicine.global.doc.address,
            email: medicine.global.doc.email,
            action: (
              <TableAction
                id={medicine.global._id}
                onView={handleEdit}
                // onView={() => handleEdit(medicine.global._id)}
                // onDelete={handleDelete}
              />
            ),
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
  }, [pagination, refresh, keyword, id]);

  //Global find by id
  useEffect(() => {
    let unmounted = false;

    const fetchAndSet = async () => {
      const response = await getGolbalDonationByid(id);
      console.log("responseddd", response);

      if (response.success) {
        if (!unmounted) {
          setGobalMedicine(response?.data);
          // setInput(response?.data);
        }
      }
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [id, refresh]);

  return (
    <React.Fragment>
      <Header />
      <div style={{ display: "flex" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, mt: 2, ml: 5 }}>
          Donner Profile
        </Typography>
      </div>
      <Box
        sx={{
          borderRadius: 4,
          backgroundColor: colors.secondary,
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
          p: 3,
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          ml: 5,
        }}
      >
        <Stack flexDirection="row" alignItems="center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxwN6ZNPxCJCRIpteP6pT84WMUGtt69wRpGg&usqp=CAU"
            alt=""
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />

          <Grid container sx={{ ml: 5 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                <Typography variant="p">Name : {gobalMedicine.name}</Typography>
              </Box>

              <Box>
                <Typography variant="p">
                  Email :{gobalMedicine.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ marginBottom: "5px" }}>
                <Typography variant="p">
                  Contact Number:{gobalMedicine.contactNumber}
                </Typography>
              </Box>
              <Box>
                <Typography variant="p">
                  Address:{gobalMedicine.address}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ marginBottom: "5px" }}>
                <Typography variant="p">NIC :{gobalMedicine.nic}</Typography>
              </Box>
              <Box>
                <Typography variant="p">
                  Donation Type: {gobalMedicine.type}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} md={2}>
              <Box sx={{ marginBottom: "5px" }}>
                <EditButton onClick={() => seteditShowPopup(true)}/>
              </Box>
            </Grid>

          <Grid item xs={12} md={2}>
              <Box sx={{ marginBottom: "5px" }}>
                <DeleteButton onClick={() => deletePharmacyhandleSubmit()}/>
              </Box>
            </Grid> */}
        </Stack>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          mt: 5,
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          ml: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Typography variant="h3" fontWeight="bold">
              Your Donation Dates
            </Typography>
            <DonationCalendar events={gobalMedicine} />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}></Grid>

      {/*Update Pharmacy */}
      <Popup
        title="Edit Donner Details"
        width={800}
        show={editShowPopup}
        onClose={edithandlePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={updateDonnerSubmit}>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="name"
                variant="filled"
                label="Enter Name"
                fullWidth
                value={input.name}
                onChange={(e) =>
                  setInput({
                    ...input,
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
                value={input.registrationNumber}
                onChange={(e) =>
                  setInput({
                    ...input,
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
                name="address"
                variant="filled"
                label="Enter Address"
                fullWidth
                value={input.address}
                onChange={(e) =>
                  setInput({
                    ...input,
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
                name="contactNumber"
                variant="filled"
                label="Enter Contact Number"
                fullWidth
                value={input.contactNumber}
                onChange={(e) =>
                  setInput({
                    ...input,
                    contactNumber: e.target.value,
                  })
                }
              />
              {errors["contactNumber"] && (
                <Typography color="error">{errors["contactNumber"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="email"
                variant="filled"
                label="Enter Email"
                fullWidth
                value={input.email}
                onChange={(e) =>
                  setInput({
                    ...input,
                    email: e.target.value,
                  })
                }
              />
              {errors["email"] && (
                <Typography color="error">{errors["email"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="reset"
                variant="contained"
                onClick={handleUpdateClear}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>

      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default DonationProfile;
