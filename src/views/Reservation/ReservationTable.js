import React, { useState, useEffect, useRef, useMemo } from "react";
import "./BranchTable.css";
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
  IconButton,
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
import {
  completeReservation,
  createDonation,
  createTableData,
  getAllDonation,
  getReservation,
  getTableData,
} from "../../service/donation.service";
import { popAlert, popDangerPrompt } from "../../utils/alerts";
import donation from "../../models/donation";
import Popup from "../../components/common/Popup";
import DeleteButton from "../../components/common/DeleteButton";
import EditButton from "../../components/common/EditButton";
import {
  getChildrenHomeById,
  updateChildrenhome,
  deleteChildrenhome,
  getallChildrenhome,
} from "../../service/childrenhome.service";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import { getAllSubMenu } from "../../service/submenu.service";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// id: item.id,
// tablesCount: item.tablesCount,
// branch: item.branch.branchName,
// name: item.user.username,
// complete_status:
//   item.complete_status === 1 ? "Pending" : "Complete",
// reservationDate: item.reservationDate,
const tableColumns = [
  {
    id: "id",
    label: "ID",
    minWidth: 140,
    align: "left",
  },
  {
    id: "branch",
    label: "Branch",
    align: "left",
  },
  {
    id: "name",
    label: "Customer Name",
    align: "left",
  },
  {
    id: "complete_status",
    label: "Status",
    align: "left",
  },
  {
    id: "reservationDate",
    label: "Reservation Date",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "left",
  },
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

const ReservationTable = () => {
  const { id } = useParams();
  const authState = useSelector((state) => state.auth);
  console.log("authState", authState);

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
  const [selectedId, setSelectedId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // const body = {
    //   tablesCount: inputs.tableCount,
    //   branchId: inputs.id,
    // };
    // const response = await createTableData(body);
    // console.log("Fireeeeeeeee", response);

    // if (response.success) {
    //   setRefresh(!refresh);
    //   popAlert("Success!", response?.data?.message, "success").then((res) => {
    //     setShowPopup(false);
    //     seteditShowPopup(false);
    //   });
    // } else {
    //   popAlert("Error!", response?.data?.message, "error");
    //   response?.data?.data && setErrors(response.data.data);
    // }

    const response = await completeReservation(selectedId);

    if (response.success) {
      popAlert("Success!", "success").then((res) => {
        // setShowPopup(false);
        // seteditShowPopup(false);
        window.location.reload();
      });
    } else {
      console.error(response?.data);
    }

    setIsLoading(false);
  };

  const handleUpdateClear = () => {
    setShowPopup(false);
    seteditShowPopup(false);
  };

  const handleClear = () => {
    setInputs(donation);
    setShowPopup(false);
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
  console.log("globalMedicines", globalMedicines);

  const memoizedLabel = useMemo(
    () => globalMedicines.find((medi) => medi.id === inputs.id)?.label || "",
    [inputs.id]
  );

  const throttle = (func, time) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(func, time);
  };

  //  menu
  useEffect(() => {
    let unmounted = false;

    if (!unmounted && open) setIsSelectDataLoading(true);

    const fetchAndSet = async () => {
      const response = await getallChildrenhome();

      if (response.success) {
        if (!response.data) return;

        let gMedicineArr = [];

        for (const gMedicine of response.data.content) {
          gMedicineArr.push({
            label: gMedicine.branchName === null ? "" : gMedicine.branchName,
            id: gMedicine.id,
          });
        }

        // if (!unmounted) {
        setGlobalMedicines(gMedicineArr);
        // }
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
      const response = await getReservation();

      if (response.success) {
        if (!response.data) return;
        console.log("responsssse", response);
        let tableDataArr = [];
        for (const item of response.data.content) {
          tableDataArr.push({
            id: item.id,
            tablesCount: item.tablesCount,
            branch: item.branchDetails.branchName,
            name: item.user.username,
            complete_status:
              item.complete_status === 1 ? "Pending" : "Complete",
            reservationDate: item.reservationDate,
            action: (
              <IconButton onClick={() => handleActionClick(item.id)}>
                <CheckCircleIcon style={{ color: "green" }} />
              </IconButton>
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

  const handleActionClick = async (id) => {
    setSelectedId(id);
    setShowPopup(true);
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
            Reservation Table
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
          <Grid container spacing={2}></Grid>

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
          title="Do you want to complete this reservation ?"
          width={800}
          show={showPopup}
          onClose={handlePopupClose}
        >
          <Box sx={{ mb: 2, mt: 1 }}>
            <form onSubmit={handleSubmit}>
              {/* Wrap fields in a flex container */}
              <Box sx={{ mb: 2, display: "flex", gap: 2 }}></Box>

              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="reset"
                  variant="contained"
                  onClick={handleClear}
                  sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
                >
                  No
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ py: 2, px: 5 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress color="secondary" /> : "Yes"}
                </Button>
              </Box>
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

export default ReservationTable;
