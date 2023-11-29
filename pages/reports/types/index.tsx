import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Backdrop, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import React from "react";

import NewReportOverlay from "@/components/report/NewReportOverlay";
import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import { GetServerSideProps } from "next";
import theme from "@/styles/theme";
import Image from "next/image";

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

const BackOfficeForm = ({ animals }: { animals: Animal[] }) => {
  const router = useRouter();
  const { pathname } = router;

  console.log(animals);

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
                src={thumbnailUrl ? thumbnailUrl : "/marc_logo.png"}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const animalResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types`
  );
  const animals: Animal[] = await animalResponse.data.contents;

  return { props: { animals } };
};
