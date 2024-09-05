//

import { React, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { getallChildrenhome } from "../../service/childrenhome.service";
import { getData, searchData } from "../../service/donation.service";
import donation from "../../models/donation";
import Popup from "./Popup";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  colors,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { popAlert } from "../../utils/alerts";
import { getApi } from "../../utils/axios";
import { buildResponse } from "../../utils/responseBuilder";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

function srcset(image, width, height, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function Gallery() {
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
  const [searchValue, setSearchValue] = useState("");
  const timeoutRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  console.log("authState", authState);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [keyword, setKeyword] = useState("");

  const [selectedItem, setSelectedItem] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (item) => {
    setSearchValue(item);
  };
  const handleImageClick = (item) => {
    setSelectedItem(item);
    // navigate(`/rate/${id}`);
    console.log(item);

    setShowPopup(true);
  };

  const [array, setArray] = useState([]);

  const memoizedLabel = useMemo(
    () => globalMedicines.find((medi) => medi.id === inputs.id)?.label || "",
    [inputs.id]
  );
  // getData;

  useEffect(() => {
    const fetchAndSet = async () => {
      // const response = await getData();
      const response = await searchData({ search: searchValue });
      console.log("responseresponse", response);
      let gMedicineArr = [];

      if (response.success) {
        if (!response.data) return;

        for (var i = 0; i < response.data.content.length; i += 1) {
          for (
            var j = 0;
            j < response.data.content[i].menuTypeAssignList.length;
            j += 1
          ) {
            gMedicineArr.push({
              menu: response.data.content[i],
              menuType: response.data.content[i].menuTypeAssignList[j],
              img: itemData[j].img,
              title:
                (response.data.content[i].typeName === null
                  ? ""
                  : response.data.content[i].typeName) +
                (response.data.content[i].menuTypeAssignList[j].menuType
                  .type === null
                  ? " "
                  : " -> " +
                    response.data.content[i].menuTypeAssignList[j].menuType
                      .type),
              author: itemData[i].author,
              featured: itemData[i].featured,
            });
          }
        }
        setArray(gMedicineArr);
        // for (const gMedicine of response.data.content) {
        //   // itemData;
        //   // gMedicineArr.push({
        //   //   label: gMedicine.branchName === null ? "" : gMedicine.branchName,
        //   //   id: gMedicine.id,
        //   // });
        // }
      } else {
        console.error(response?.data);
      }
      setArray(gMedicineArr);
    };
    fetchAndSet();
  }, [searchValue]);
  console.log("selectedItemselectedItem", selectedItem);

  const handleSubmit = async (e) => {
    // console.log("selectedItem", selectedItem);
    // popAlert("Success!", "success").then((res) => {
    //   setShowPopup(false);
    //   seteditShowPopup(false);
    // });
    const body = {
      branch: inputs.id,
      menuId: selectedItem.menuType.id,
      restaurantMenuItem: selectedItem.menu.id,
      userId: authState.user.id,
      complete_status: 1,
    };
    const response = await getApi()
      .post(`reservation`, body)
      .then((res) => {
        popAlert("Success!", "success").then((res) => {
          setShowPopup(false);
        });
        return buildResponse(true, res.data);
      })
      .catch((err) => {
        popAlert("Fully Booked !", "error").then((res) => {
          setShowPopup(false);
        });
        return buildResponse(false, err.response.data, err.response.status);
      });
  };

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

  return (
    <ImageList
      sx={{
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        padding: "16px",
        boxSizing: "border-box",
      }}
      rowHeight={100}
      gap={1}
    >
      <Grid container spacing={0}>
        <Grid item xs={110}>
          <SearchBar
            // onChange={(event) => {
            //   console.log("Searchhh", event.target.value);
            // }}
            //
            onSearch={(e) => {
              handleSearch(e);
            }}
            placeholderText="Search ... "
          />
        </Grid>
      </Grid>

      {array.map((item) => {
        const cols = 0;
        const rows = 5;
        // const cols = item.featured ? 2 : 1;
        // const rows = item.featured ? 2 : 1;

        return (
          <ImageListItem
            key={item.img}
            cols={cols}
            rows={rows}
            sx={{
              padding: "8px",
              boxSizing: "border-box",
            }}
          >
            <img
              {...srcset(item.img, 250, 200, rows, cols)}
              alt={item.title}
              loading="lazy"
              style={{
                borderRadius: "8px",
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                padding: "8px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(item)}
            />
            {/* <ImageListItemBar
              sx={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, " +
                  "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
              }}
              title={item.title}
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: "white" }}
                  aria-label={`star ${item.title}`}
                >
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition="left"
            /> */}

            <ImageListItemBar
              sx={{
                "& .MuiImageListItemBar-title": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: "10px 10px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                },
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, " +
                  "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
              }}
              title={item.title}
              position="top"
              // actionIcon={
              //   <IconButton
              //     sx={{ color: "white" }}
              //     aria-label={`star ${item.title}`}
              //   >
              //     <StarBorderIcon />
              //   </IconButton>
              // }
              actionPosition="left"
            />
          </ImageListItem>
        );
      })}

      <Popup
        title="Place Order"
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
                      type: value.label,
                    });
                  } else {
                    setInputs({
                      ...inputs,
                      id: "",
                      type: "",
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
                    label="Branch"
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: (
                    //     <React.Fragment>
                    //       {isSelectDataLoading ? (
                    //         <CircularProgress color="inherit" size={20} />
                    //       ) : null}
                    //       {params.InputProps.endAdornment}
                    //     </React.Fragment>
                    //   ),
                    // }}
                  />
                )}
              />
              {errors["name"] && (
                <Typography color="error">{errors["name"]}</Typography>
              )}
              {/* 
              <TextField
                name="status"
                variant="filled"
                label="Table Count"
                helperText="Please Enter Table Count ."
                fullWidth
                value={inputs.tableCount}
                type="number"
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    tableCount: e.target.value,
                  })
                }
              /> */}

              {errors["status"] && (
                <Typography color="error">{errors["status"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="reset"
                variant="contained"
                onClick={() => {
                  setShowPopup(false);
                }}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  "Place Order"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>
    </ImageList>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
  },
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
  },
];
