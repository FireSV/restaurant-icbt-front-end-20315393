import React, { useState, useEffect } from "react";
import "./Recepies.css";
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
import { getRestaurantMenu, restaurantMenu } from "../../service/restaurantMenu.service";

import ChildrenHomeModel from "../../models/Childrenhome";
import { popAlert } from "../../utils/alerts";
import colors from "../../assets/styles/colors";
import TableAction from "../../components/common/TableActions";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import restaurantMenu1 from "../../models/restaurantMenu1";

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    align: "center",
  }
];

const Recepies = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(restaurantMenu1);
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

    const response = await restaurantMenu(inputs);

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
      const response = await getRestaurantMenu(
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const Menu of response.data.content) {
          tableDataArr.push({
            name: Menu.typeName,
            // registrationNumber: Menu.registrationNumber,
            // address: addPharmacy.address,
            // contactNumber: addPharmacy.contactNumber,
            // action: <TableAction id={addPharmacy._id} onView={handleView} />,
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
              Create New Recepies
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={10}>
              <SearchBar
                onSearch={handleSearch}
                placeholderText="Search Recepies..."
              />
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
          title="Add Recepies"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 1 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 1 }}>
                <TextField
                  typeName="typeName"
                  variant="filled"
                  label="Menu Name"
                  fullWidth
                  value={inputs.typeName}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      typeName: e.target.value,
                    })
                  }
                />
                {errors["typeName"] && (
                  <Typography color="error">{errors["typeName"]}</Typography>
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

export default Recepies;
