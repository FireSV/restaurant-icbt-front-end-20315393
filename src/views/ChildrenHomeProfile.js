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
} from "../service/donor.service";
import { createDonation, getAllDonation } from "../service/donation.service";
import { popAlert, popDangerPrompt } from "../utils/alerts";
import donation from "../models/donation";
import Popup from "../components/common/Popup";
import DeleteButton from "../components/common/DeleteButton";
import EditButton from "../components/common/EditButton";
import {
  getChildrenHomeById,
  updateChildrenhome,
  deleteChildrenhome,
} from "../service/childrenhome.service";
import MapGoogalTwo from "./MapGoogalTwo";
import Header from "../components/common/Header";
import Footer from "../pages/Footer/Footer";

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

const ChildrenHomeProfile = () => {
  const { id } = useParams();

  const timeoutRef = useRef(null);

  const [inputs, setInputs] = useState(donation);
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

  //update childrenHome
  const updatePharmacyhandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await updateChildrenhome(id, input);
    console.log(input);
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
      "Are You sure you want to delete this Childrenhome!",
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
    setInputs(donation);
  };

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
      const globalDonnerData = response.data;
      setInput({
        name: globalDonnerData.name,
        nic: globalDonnerData.nic,
        contactNumber: globalDonnerData.contactNumber,
        address: globalDonnerData.address,
        type: globalDonnerData.type,
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

  const handleMapInput = (input) => {};

  const memoizedLabel = useMemo(
    () =>
      globalMedicines.find((medi) => medi.id === inputs.globalMedicine._id)
        ?.label || "",
    [inputs.globalMedicine._id]
  );

  const throttle = (func, time) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(func, time);
  };

  //select childrenhome
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
        for (const donation of response.data.content) {
          console.log("medicine", donation);
          tableDataArr.push({
            id: donation.global._id,
            name: donation.global.doc.name,
            nic: donation.global.doc.nic,
            contactNumber: donation.global.doc.contactNumber,
            type: donation.global.doc.type,
            address: donation.global.doc.address,
            email: donation.global.doc.email,
            action: (
              <TableAction
                id={donation.global._id}
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

  //pharmacy find by id
  useEffect(() => {
    let unmounted = false;

    const fetchAndSet = async () => {
      const response = await getChildrenHomeById(id);

      if (response.success) {
        if (!unmounted) {
          setPharmacydata(response?.data);
          setInput(response?.data);
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
          Children Home Profile
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
            src="https://www.faithtoaction.org/wp-content/uploads/2015/05/Screen-Shot-2015-05-19-at-4.23.24-PM.png"
            alt=""
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />

          <Grid container sx={{ ml: 5 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                <Typography variant="p">{pharmacydata.name}</Typography>
              </Box>

              <Box>
                <Typography variant="p">
                  {pharmacydata.registrationNumber}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ marginBottom: "5px" }}>
                <Typography variant="p">{pharmacydata.address}</Typography>
              </Box>

              <Box>
                <Typography variant="p">
                  {pharmacydata.contactNumber}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ marginBottom: "5px" }}>
              <EditButton onClick={() => seteditShowPopup(true)} />
            </Box>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ marginBottom: "5px" }}>
              <DeleteButton onClick={() => deletePharmacyhandleSubmit()} />
            </Box>
          </Grid>
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
          <Grid item xs={8} sx={{ mb: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>
              Children Home Location
            </Typography>

            {pharmacydata?.location?.longitude &&
              pharmacydata?.location?.latitude && (
                <MapGoogalTwo
                  longitude={pharmacydata.location.longitude}
                  latitude={pharmacydata.location.latitude}
                  name={pharmacydata.name}
                  registrationNumber={pharmacydata.registrationNumber}
                  OnLocationChange={handleMapInput}
                  style={{ height: "150%" }}
                />
              )}
          </Grid>
          <Grid item xs={4} sx={{ mt: 5 }}>
            <Box display="flex" flexDirection="column">
              <Typography sx={{ fontWeight: "bold" }} variant="p">
                Email:
              </Typography>
              <Typography>{pharmacydata.email}</Typography>
              <Typography sx={{ fontWeight: "bold" }} variant="p">
                Postal Code:
              </Typography>
              <Typography>{pharmacydata.postalCode}</Typography>
              <Typography sx={{ fontWeight: "bold" }} variant="p">
                Number Of Beneficiaries:
              </Typography>
              <Typography>{pharmacydata.numberofChildren}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <div style={{ display: "flex" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt: 4, ml: 5 }}>
          Donations
        </Typography>
      </div>
      <Box
        sx={{
          borderRadius: 4,
          mt: 2,
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          ml: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <SearchBar
              onSearch={handleSearch}
              placeholderText="Search Donations..."
            />
          </Grid>

          <Grid item xs={1}>
            <AddButton onClick={() => setShowPopup(true)} /> {/**/}
          </Grid>
        </Grid>

        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              mt: "3%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ mr: 2 }} />
            Loading...
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
              mt: "3%",
            }}
          >
            <ReusableTable
              rows={tableRows}
              columns={tableColumns}
              totalElements={totalElements}
              limit={pagination.limit}
              page={pagination.page}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </Box>
        )}
      </Box>

      {/* custom popup */}
      <Popup
        title="Approve Donation"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Box sx={{ mb: 2, mt: 1 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                id="combo-box-demo"
                fullWidth
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                value={memoizedLabel}
                onChange={(event, value) => {
                  if (value?.id) {
                    setInputs({
                      ...inputs,
                      globalMedicine: { _id: value.id },
                    });
                  } else {
                    setInputs({
                      ...inputs,
                      globalMedicine: { _id: "" },
                    });
                  }
                }}
                options={globalMedicines}
                loading={isLoading}
                onInputChange={(event, inputValue) => {
                  setKeyword(inputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Donation"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isSelectDataLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
              {errors["name"] && (
                <Typography color="error">{errors["name"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                select
                name="status"
                variant="filled"
                label="Status"
                helperText="Please Approve Donation."
                fullWidth
                value={inputs.status}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="approve">Approve</MenuItem>
                <MenuItem value="non-approve">Non-Approve</MenuItem>
              </TextField>
              {errors["status"] && (
                <Typography color="error">{errors["status"]}</Typography>
              )}
            </Box>
            {/* <Box sx={{ mb: 2 }}>
              <TextField
                name="stockLevel"
                variant="filled"
                label="Stock Level"
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                fullWidth
                value={inputs.stockLevel}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    stockLevel: e.target.value,
                  })
                }
              />
              {errors["stockLevel"] && (
                <Typography color="error">{errors["stockLevel"]}</Typography>
              )}
            </Box> */}

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
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>

      {/*Update Pharmacy */}
      <Popup
        title="Edit Children Home"
        width={800}
        show={editShowPopup}
        onClose={edithandlePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={updatePharmacyhandleSubmit}>
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

            {/* <Box sx={{ mb: 1 }}>
              <Typography>Select Location</Typography>
                  <Paper elevation={0} sx={{height:200 }} >
                    <MapGoogal input={input} OnLocationChange={handleMapInput}/>
                  </Paper>
                       

                  {errors["location"] && (
                    <Typography color="error">{errors["location"]}</Typography>
                  )}
            </Box> */}

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

      {/*View Donation*/}
      <Popup
        title="View Donation"
        width={800}
        show={editShowDonationPopup}
        onClose={edithandleDonationPopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={updatePharmacyhandleSubmit}>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="name"
                variant="filled"
                label="Donation Name"
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
                name="nic"
                variant="filled"
                label="Donner NIC"
                fullWidth
                value={input.nic}
                onChange={(e) =>
                  setInput({
                    ...input,
                    nic: e.target.value,
                  })
                }
              />
              {errors["nic"] && (
                <Typography color="error">{errors["nic"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="contactNumber"
                variant="filled"
                label="Contact Number"
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
                name="address"
                variant="filled"
                label="Donner Contact Number"
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
                name="type"
                variant="filled"
                label="Donation Type"
                fullWidth
                value={input.type}
                onChange={(e) =>
                  setInput({
                    ...input,
                    type: e.target.value,
                  })
                }
              />
              {errors["type"] && (
                <Typography color="error">{errors["type"]}</Typography>
              )}
            </Box>

            {/* <Box sx={{ mb: 1 }}>
              <Typography>Select Location</Typography>
                  <Paper elevation={0} sx={{height:200 }} >
                    <MapGoogal input={input} OnLocationChange={handleMapInput}/>
                  </Paper>
                       

                  {errors["location"] && (
                    <Typography color="error">{errors["location"]}</Typography>
                  )}
            </Box> */}

            {/* <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
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
            </Box> */}
          </form>
        </Box>
      </Popup>
      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default ChildrenHomeProfile;
