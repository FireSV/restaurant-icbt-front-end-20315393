import React, { useState, useEffect, useRef, useMemo } from "react";
import "./MenuType.css";
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
import colors from "../../assets/styles/colors";
import SearchBar from "../../components/common/SearchBar";
import AddButton from "../../components/common/AddButton";
import ReusableTable from "../../components/common/ReusableTable";
import TableAction from "../../components/common/TableActions";
import { useParams } from "react-router-dom";
import {
  getGolbalDonationByid,
  getGlobalDonner,
} from "../../service/donor.service";
import { createDonation, getAllDonation } from "../../service/donation.service";
import { popAlert, popDangerPrompt } from "../../utils/alerts";
import donation from "../../models/donation";
import subMenu from "../../models/donation";
import Popup from "../../components/common/Popup";
import DeleteButton from "../../components/common/DeleteButton";
import EditButton from "../../components/common/EditButton";
import {
  getChildrenHomeById,
  updateChildrenhome,
  deleteChildrenhome,
} from "../../service/childrenhome.service";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import {
  addMenuType,
  getAllMenu,
  getAllSubMenu,
} from "../../service/submenu.service";
import { getAllTableData } from "../../service/menuType.service";

const tableColumns = [
  {
    id: "typeName",
    label: "Menu",
    minWidth: 140,
    align: "left",
  },
  {
    id: "menuType",
    label: "Menu Type",
    align: "left",
  },
];

const MenuType = () => {
  const { id } = useParams();

  const timeoutRef = useRef(null);

  const [inputs, setInputs] = useState(subMenu);
  const [inputs2, setInputs2] = useState(subMenu);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isSelectDataLoading, setIsSelectDataLoading] = useState(false);
  const [isSelectDataLoading2, setIsSelectDataLoading2] = useState(false);
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
  const [menu, setMenu] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [keyword, setKeyword] = useState("");
  const [keyword2, setKeyword2] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [gobalMedicine, setGobalMedicine] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      menuTypeHeader: inputs.id,
      menuTypeId: inputs2.id,
      enable: true,
    };
    console.log("body", body);

    const response = await addMenuType(body);
    console.log("responseresponseresponseresponse", response);

    if (response.success) {
      setRefresh(!refresh);
      popAlert("Success!", response?.data?.message, "success").then((res) => {
        setShowPopup(false);
        seteditShowPopup(false);
      });
    } else {
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

  // //Global find by id
  // useEffect(() => {
  //   let unmounted = false;

  //   const fetchAndSet = async () => {
  //     const response = await getGolbalDonationByid(id);
  //     console.log("responseddd", response);

  //     if (response.success) {
  //       if (!unmounted) {
  //         setGobalMedicine(response?.data);
  //         // setInput(response?.data);
  //       }
  //     }
  //   };

  //   fetchAndSet();

  //   return () => {
  //     unmounted = true;
  //   };
  // }, [id, refresh]);

  // console.log("gobalMedicine", gobalMedicine);

  const handleUpdateClear = () => {
    setInput(updateChildrenhome);
  };

  const handleClear = () => {
    setInputs(donation);
    setInputs2(donation);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  // const handleEdit = async (id) => {
  //   const response = await getGolbalDonationByid(id);
  //   console.log("responsessds", response);

  //   if (response.success) {
  //     const globalDonnerData = response.data;
  //     setInput({
  //       name: globalDonnerData.name,
  //       nic: globalDonnerData.nic,
  //       contactNumber: globalDonnerData.contactNumber,
  //       address: globalDonnerData.address,
  //       type: globalDonnerData.type,
  //     });

  //     seteditShowDonationPopup(true);
  //   }
  // };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const handleMapInput = (input) => {};

  const memoizedLabel = useMemo(
    () => menu.find((medi) => medi.id === inputs.id)?.label || "",
    [inputs.id]
  );
  const memoizedLabel1 = useMemo(
    () => globalMedicines.find((medi) => medi.id === inputs2.id)?.label || "",
    [inputs2.id]
  );

  const throttle = (func, time) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(func, time);
  };
  // sub menu
  useEffect(() => {
    let unmounted = false;

    if (!unmounted && open) setIsSelectDataLoading(true);

    const fetchAndSet = async () => {
      const response = await getAllSubMenu();
      console.log("Fireeeee1", response);

      if (response.success) {
        if (!response.data) return;

        let gMedicineArr = [];

        for (const gMedicine of response.data.content) {
          gMedicineArr.push({ label: gMedicine.type, id: gMedicine.id });
        }
        console.log("Fireeeee", gMedicineArr);

        if (!unmounted) {
          setGlobalMedicines(gMedicineArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsSelectDataLoading2(false);
    };

    if (open2) throttle(() => fetchAndSet(), 500);

    return () => {
      unmounted = true;
    };
  }, [keyword2, open2]);

  // menu type
  useEffect(() => {
    let unmounted = false;

    if (!unmounted && open) setIsSelectDataLoading2(true);

    const fetchAndSet = async () => {
      const response = await getAllMenu();
      if (response.success) {
        if (!response.data) return;

        let array = [];

        for (const menuItem of response.data.content) {
          array.push({
            label: menuItem?.typeName === null ? "" : menuItem?.typeName,
            id: menuItem.id,
          });
        }

        if (!unmounted) {
          setMenu(array);
        }

        console.log("Fire", array);
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsSelectDataLoading2(false);
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
      const response = await getAllTableData(
        id,
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      let array = [];
      let menuTypes;
      for (const menuItem of response.data.content) {
        menuTypes = "";

        for (const item of menuItem?.menuTypeAssignList) {
          menuTypes += item?.menuType?.type + " ,";
        }
        array.push({
          menuType: menuTypes,
          typeName: menuItem.typeName,
        });
      }
      // menuType;
      console.log("responsssse", array);

      if (response.success) {
        if (!response.data) return;

        if (!unmounted) {
          setTotalElements(response.data.totalElements);
          setTableRows(array);
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
    <div className="main-container">
      <Header />
      <div className="content">
        {/* <div style={{ display: "flex" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, mt: 4, ml: 5 }}
          >
            Menu Type
          </Typography>
        </div> */}

        <Box
          sx={{
            width: "100%",
            mt: "3%",
            padding: "10px",
          }}
        ></Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Menu Type
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
              {/* <SearchBar
                onSearch={handleSearch}
                placeholderText="Search Menu Type..."
              /> */}
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

        <Popup
          title="Add Menu Type"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 2, mt: 1 }}>
            <form onSubmit={handleSubmit}>
              {/* Wrap fields in a flex container */}
              <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
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
                        id: value.id,
                      });
                    } else {
                      setInputs({
                        ...inputs,
                        menu: { id: "" },
                      });
                    }
                  }}
                  options={menu}
                  loading={isLoading}
                  onInputChange={(event, inputValue) => {
                    setKeyword(inputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Menu"
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
                {errors["Menu"] && (
                  <Typography color="error">{errors["Menu"]}</Typography>
                )}

                {/* submenu */}
                <Autocomplete
                  id="subMenu"
                  fullWidth
                  onOpen={() => {
                    setOpen2(true);
                  }}
                  onClose={() => {
                    setOpen2(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  value={memoizedLabel1}
                  onChange={(event, value) => {
                    if (value?.id) {
                      setInputs2({
                        ...inputs2,
                        id: value.id,
                      });
                    } else {
                      setInputs2({
                        ...inputs2,
                        globalMedicine: { id: "" },
                      });
                    }
                  }}
                  options={globalMedicines}
                  loading={isLoading2}
                  onInputChange={(event, inputValue) => {
                    setKeyword2(inputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub Menu"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isSelectDataLoading2 ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />

                {errors["subMenu"] && (
                  <Typography color="error">{errors["subMenu"]}</Typography>
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
                  disabled={isLoading2}
                >
                  {isLoading2 ? <CircularProgress color="secondary" /> : "Save"}
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
                  <Typography color="error">
                    {errors["contactNumber"]}
                  </Typography>
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
      </div>
      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </div>
  );
};

export default MenuType;
