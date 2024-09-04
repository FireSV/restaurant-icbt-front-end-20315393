//

import { React, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { getallChildrenhome } from "../../service/childrenhome.service";
import { getData } from "../../service/donation.service";
import donation from "../../models/donation";
import Popup from "./Popup";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  colors,
  TextField,
  Typography,
} from "@mui/material";
import { popAlert } from "../../utils/alerts";

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });

  const [selectedItem, setSelectedItem] = useState(false);

  const navigate = useNavigate();

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
      const response = await getData();
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
    };
    fetchAndSet();
  }, []);
  const handleSubmit = async (e) => {
    console.log("selectedItem", selectedItem);
    popAlert("Success!", "success").then((res) => {
      setShowPopup(false);
      seteditShowPopup(false);
    });
  };
  return (
    <ImageList
      sx={{
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        padding: "16px",
        boxSizing: "border-box",
      }}
      rowHeight={200}
      gap={1}
    >
      {array.map((item) => {
        const cols = item.featured ? 2 : 1;
        const rows = item.featured ? 2 : 1;

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
            <ImageListItemBar
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
              {/* <Autocomplete
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
              )} */}
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
