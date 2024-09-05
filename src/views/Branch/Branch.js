import React, { useState, useEffect } from "react";
import "./Branch.css";
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

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    minWidth: 140,
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    align: "left",
  },
];

const Branch = () => {
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
      // response?.data?.message &&
      popAlert("Success!", response?.data?.message, "success").then((res) => {
        setShowPopup(false);
      });
    } else {
      // response?.data?.message &&
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
        for (const branch of response.data.content) {
          tableDataArr.push({
            name: branch.branchName,
            address: branch.address,
            contactNumber: branch.contactNumber,
            action: <TableAction id={branch._id} onView={handleView} />,
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Create New Branch
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={10}>
              {/* <SearchBar
                onSearch={handleSearch}
                placeholderText="Search Branch..."
              /> */}
            </Grid>
            <Grid item xs={1}>
              <AddButton onClick={() => setShowPopup(true)} />
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
          title="Add Branch"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 1 }}>
            <form onSubmit={handleSubmit}>
              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}
              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}
              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}
              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}

              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}

              {/* <Box sx={{ mb: 1 }}>
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
              </Box> */}
              {/* 
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
              </Box> */}
              <Box sx={{ mb: 1 }}>
                <TextField
                  name="branchName"
                  variant="filled"
                  label="Branch Name"
                  fullWidth
                  value={inputs.branchName}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      branchName: e.target.value,
                    })
                  }
                />
                {errors["branchName"] && (
                  <Typography color="error">{errors["branchName"]}</Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
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

export default Branch;
