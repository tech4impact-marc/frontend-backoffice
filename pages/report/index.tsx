import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Backdrop } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import React from "react";

import NewReportOverlay from "@/components/report/NewReportOverlay";
import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";

export interface Animal {
  id: number;
  label: string;
  icon?: React.ReactNode;
}

const BackOfficeForm = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types`)
      .then((response) => {
        setAnimals(
          response.data.map(({ id, label }: Animal) => ({
            id: id,
            label: label,
          }))
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  return (
    <React.Fragment>
      {animals &&
        animals.map(({ id, label }, index) => (
          <StyledButton
            key={index}
            variant="contained"
            color="secondary"
            onClick={() => {
              router.push(`/report/${id}`);
            }}
            disableElevation
          >
            {label}
          </StyledButton>
        ))}
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={() => {
          setOpenBackdrop(true);
        }}
        disableElevation
      >
        <AddRoundedIcon />
      </StyledButton>

      <Backdrop open={openBackdrop} sx={{ zIndex: "9999" }}>
        <NewReportOverlay setOpenBackdrop={setOpenBackdrop} />
      </Backdrop>
    </React.Fragment>
  );
};

export default BackOfficeForm;

BackOfficeForm.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);
