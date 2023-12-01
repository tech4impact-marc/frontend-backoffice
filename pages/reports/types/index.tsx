import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Backdrop, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import React from "react";

import NewReportOverlay from "@/components/report/NewReportOverlay";
import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import theme from "@/styles/theme";
import Image from "next/image";
import { validUrl } from "@/utils/image";
import instance from "@/utils/axios_interceptor";

export interface Animal {
  id: number;
  label: string;
  subject: string;
  thumbnailUrl: string;
  title: string;
  subtitle: string;
  description: string;
}

export const NewFormButton = () => {
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const handleCloseBackdrop = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      setOpenBackdrop(false);
    }
  };

  return (
    <React.Fragment>
      <StyledButton
        sx={{
          marginLeft: "auto",
        }}
        onClick={() => {
          setOpenBackdrop(true);
        }}
      >
        새로 추가하기
      </StyledButton>
      <Backdrop
        open={openBackdrop}
        onClick={(e) => handleCloseBackdrop(e)}
        sx={{ zIndex: "9999" }}
      >
        <NewReportOverlay setOpenBackdrop={setOpenBackdrop} />
      </Backdrop>
    </React.Fragment>
  );
};

const BackOfficeForm = () => {
  const router = useRouter();
  const { pathname } = router;
  const [animals, setAnimals] = useState<Animal[]>();

  console.log(animals);

  useEffect(() => {
    async function load() {
      const animalResponse = await instance
        .get(`/admin/reports/types`, {
          headers: {
            Origin: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setAnimals(response.data.contents);
          }
        })
        .catch((error) => {
          alert("에러");
        });
    }
    load();
  }, []);

  return (
    <Grid container spacing={2}>
      {animals &&
        animals.map(({ id, subject, thumbnailUrl }, index) => (
          <Grid key={index} item>
            <div
              color="secondary"
              onClick={() => {
                router.push(`${pathname}/${id}`);
              }}
              style={{
                background: "#FFF",
                borderRadius: "1rem",
                padding: "2rem",
                width: "10rem",
                height: "10rem",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <Typography variant="h3">{subject}</Typography>

              <Image
                src={validUrl(thumbnailUrl) ? thumbnailUrl : "/marc_logo.png"}
                alt={"animal icon"}
                width={80}
                height={80}
                style={{ marginLeft: "auto", marginTop: "auto" }}
              ></Image>
            </div>
          </Grid>
        ))}
    </Grid>
  );
};

export default BackOfficeForm;

BackOfficeForm.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);
