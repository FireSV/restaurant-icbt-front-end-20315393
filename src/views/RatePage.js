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

const RatePage = () => {
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

      <Box sx={{ ml: 5 }}>
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
      </Box>

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

      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default RatePage;
