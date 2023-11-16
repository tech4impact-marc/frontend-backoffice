import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import { StyledButton } from "@/components/layout/BackOfficeLayout";
import { StyledContainerOne } from "@/components/styledComponents/StyledContainer";
const NewReportOverlay = ({
  setOpenBackdrop,
}: {
  setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newAnimal, setNewAnimal] = useState<string>("");

  const router = useRouter();

  const handleNew = () => {
    const initData = {
      label: newAnimal,
      title: `${newAnimal} 설문지`,
      subtitle: `${newAnimal} 분포 및 서식 조사`,
      description: `${newAnimal} 서포터즈로 참여하신 여러분께 감사드립니다.\n 여러분의 관찰 기록을 바탕으로 제주 ${newAnimal}의 분포 및 생태를 파악하고, 보전자료로 활용하고자 합니다.`,
      questions: [],
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types`, initData)
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          alert("설문이 추가되었습니다");
          router.push(`/report/${response.data.id}`);
        } else {
          console.log(response);
          alert("오류가 있었습니다");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("오류가 있었습니다");
      });
  };

  return (
    <StyledContainerOne
      style={{
        backgroundColor: "white",
        minWidth: "auto",
        width: "50rem",
        height: "auto",
        borderRadius: "1rem",
      }}
    >
      <IconButton
        style={{ margin: "-0.5rem 0 -2.5rem auto" }}
        onClick={() => {
          setOpenBackdrop(false);
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <Typography variant="h2">동물 이름을 입력하세요</Typography>

      <TextField
        variant="outlined"
        name={"title"}
        value={newAnimal}
        onChange={(e) => {
          setNewAnimal(e.target.value);
        }}
      />
      <StyledButton
        variant="contained"
        onClick={handleNew}
        disabled={!newAnimal}
        disableElevation
      >
        새로운 설문으로 갈까요?
      </StyledButton>
    </StyledContainerOne>
  );
};
export default NewReportOverlay;
