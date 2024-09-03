import React, { useState, useEffect } from "react";
import "./Recepies.css";
import SearchBar from "../../components/common/SearchBar";
import AddButton from "../../components/common/AddButton";
// import ReportButton from "../components/common/ReportButton";
import {
  Grid,
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

import Popup from "../../components/common/Popup";
import globalMedicine from "../../models/donor";
import {
  createDonner,
  getGolbalDonationByid,
  getGlobalDonner,
} from "../../service/donor.service";
import { popAlert } from "../../utils/alerts";
import colors from "../../assets/styles/colors";
import ReusableTable from "../../components/common/ReusableTable";
import TableAction from "../../components/common/TableActions";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "../Calendar";
import axios from "axios";
import { useSelector } from "react-redux";
import PayButton from "../PayButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Chip from "@mui/material/Chip";

//table columns
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
    id: "address",
    label: "Address",
    align: "right",
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    align: "right",
  },
  {
    id: "email",
    label: "Email",
    align: "right",
  },
  {
    id: "type",
    label: "Donation Type",
    align: "right",
  },

  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const Recepies = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [inputs, setInputs] = useState(globalMedicine);
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

  console.log("tableRowshghg", tableRows);
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await createDonner(inputs);

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

  const handleClear = () => {
    setInputs(globalMedicine);
  };

  const handleEdit = (id) => {
    navigate(`/donation/${id}`);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const handlePopupClose = () => setShowPopup(false);

  const handleTypeClick = (type) => {
    if (type === "cash") {
      // window.open("https://donate.stripe.com/test_5kA7vY30G8sxbM44gg");
      window.open("https://donate.stripe.com/test_dR66oX1lhh0ra1WbII");
    }
  };

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getGlobalDonner(
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      console.log("cvresponse", response);

      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const globalMedicine of response.data.content) {
          console.log("globalMedicineklkl", globalMedicine);
          const isCash = globalMedicine.type === "cash";
          tableDataArr.push({
            donationDate: globalMedicine.donationDate.substring(0, 10) || "",
            createdAt: globalMedicine.createdAt.substring(0, 10) || "",
            name: globalMedicine.name,
            address: globalMedicine.address,
            nic: globalMedicine.nic,
            contactNumber: globalMedicine.contactNumber,
            email: globalMedicine.email,
            type:
              globalMedicine.type === "cash" ? (
                <Chip
                  label="Cash Donation"
                  color="primary"
                  onClick={() => handleTypeClick(globalMedicine.type)}
                  clickable
                />
              ) : (
                globalMedicine.type
              ),

            action: (
              <TableAction
                id={globalMedicine._id}
                onView={handleEdit}
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
  }, [pagination, refresh, keyword]);

  const handlePayment = (inputs) => {
    console.log("cartItems", inputs);
    // navigate("/payment");
  };

  return (
    <React.Fragment>
      <Header />
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, mt: 2, ml: 3 }}>
        Donation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10} sx={{ ml: 3 }}>
          <SearchBar
            onSearch={handleSearch}
            placeholderText="Search Donation..."
          />
        </Grid>
        {/* <Grid item xs={1}> */}
        {/* <AddButton onClick={() => setShowPopup(true)} /> */}
        {/* <Typography
            variant="subtitle1"
            color="primary"
            onClick={() => setShowPopup(true)}
          >
            Add Donation
          </Typography>
        </Grid> */}

        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowPopup(true)}
          >
            Add Donation
          </Button>
        </Grid>

        <Grid item xs={1}>
          {/* <ReportButton /> */}
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
            p: 2,
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

          {/* <Box
            sx={{
              mt: 4,
              ml: 16,
              width: "80%",
              justifyContent: "center",
            }}
          >
            <Calendar events={tableRows} />
          </Box> */}
        </Box>
      )}

      {/* custom popup */}
      <Popup
        title="Add Donation"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Box sx={{ mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="name"
                variant="filled"
                label="Name"
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
            <Box sx={{ mb: 2 }}>
              <TextField
                name="nic"
                variant="filled"
                label="NIC"
                fullWidth
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                value={inputs.nic}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    nic: e.target.value,
                  })
                }
              />
              {errors["nic"] && (
                <Typography color="error">{errors["nic"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="address"
                variant="filled"
                label="Address"
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
            <Box sx={{ mb: 2 }}>
              <TextField
                name="contactNumber"
                variant="filled"
                label="Contact Number"
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
                <Typography color="error">{errors["contactNumber"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  label="Donation Date"
                  fullWidth
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={inputs.donationDate}
                  onChange={(nValue) =>
                    setInputs({
                      ...inputs,
                      donationDate: nValue,
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              {errors["donationDate"] && (
                <Typography color="error">{errors["donationDate"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                name="email"
                variant="filled"
                label="Email"
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
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                name="type"
                variant="filled"
                label="Type"
                helperText="Please Select Donation Type."
                fullWidth
                value={inputs.type}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setInputs({
                    ...inputs,
                    type: e.target.value,
                  });
                }}
              >
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="medicine">Medicine</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="other-items">Other Items</MenuItem>
              </TextField>
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
              {/* {selectedType === "cash" ? (
                // <Button
                //   variant="contained"
                //   sx={{ py: 2, px: 5 }}
                //   disabled={loading}
                //   onClick={() => handlePayment(inputs)}
                // >
                //   Payment
                // </Button>
                <PayButton cartItems={inputs} />
              ) : ( */}
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
              {/* )} */}
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

export default Recepies;
