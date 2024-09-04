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
import { createSubMenu, getAllSubMenu } from "../../service/submenu.service";
import subMenuM from "../../models/subMenu";

const tableColumns = [
  {
    id: "type",
    label: "Name",
    minWidth: 140,
    align: "left",
  },

  // {
  //   id: "contactNumber",
  //   label: "Contact Number",
  //   align: "right",
  // },
  // // {
  // //   id: "type",
  // //   label: "Donation Type",
  // //   align: "right",
  // // },
  // {
  //   id: "address",
  //   label: "Address",
  //   align: "right",
  // },
  // {
  //   id: "email",
  //   label: "Email",
  //   align: "right",
  // },
  // {
  //   id: "action",
  //   label: "Action",
  //   align: "right",
  // },
];

const MenuType = () => {
  const { id } = useParams();

  const timeoutRef = useRef(null);

  const [inputs, setInputs] = useState(subMenuM);
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await createSubMenu( inputs);

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
    if (response.success) {
      setRefresh(!refresh);
     
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          seteditShowPopup(false);
        });
    } else {
   
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setIsLoading(false);
  };




  //Global find by id
  useEffect(() => {
    let unmounted = false;
    const fetchAndSet = async () => {
      const response = await getAllSubMenu();

      
      if (response.success===true) {
        if (!unmounted) {
          setTableRows(response?.data.content);
        }
      }
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [id, refresh]);


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


  const handleDelete = (id) => {
    console.log(id);
  };

  const handleSearch = (input) => {
    setKeyword(input);
  };







  return (
    <div className="main-container">
      <Header />
      <div className="content">
        <div style={{ display: "flex" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, mt: 4, ml: 5 }}
          >
            Menu Sub
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
                placeholderText="Search Menu Type..."
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

        <Popup
          title="Add Sub Menu"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 1 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="type"
                  variant="filled"
                  label="Menu Name"
                  fullWidth
                  value={inputs.type}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      type: e.target.value,
                    })
                  }
                />
                {errors["type"] && (
                  <Typography color="error">{errors["type"]}</Typography>
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
