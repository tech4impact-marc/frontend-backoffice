import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  StyledContainerOne,
  StyledContainerTwo,
  StyledContainerZero,
} from "@/components/styledComponents/StyledContainer";
import theme from "@/styles/theme";
import { StyledButton } from "../layout/BackOfficeLayout";

const NewReportOverlay = ({
  setOpenBackdrop,
}: {
  setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newAnimal, setNewAnimal] = useState<string>("");

  const router = useRouter();
  const { pathname } = router;

  const handleNew = () => {
    const initData = {
      label: newAnimal,
      subject: newAnimal,
      title: `${newAnimal} 설문지`,
      subtitle: `${newAnimal} 분포 및 서식 조사`,
      description: `${newAnimal} 서포터즈로 참여하신 여러분께 감사드립니다.\n 여러분의 관찰 기록을 바탕으로 제주 ${newAnimal}의 분포 및 생태를 파악하고, 보전자료로 활용하고자 합니다.`,
      memo: ``,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types`,
        initData
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          alert("설문이 추가되었습니다");
          router.push(`/${pathname}/${response.data.id}`);
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
    <Container
      style={{
        backgroundColor: "white",
        minWidth: "auto",
        maxWidth: "30rem",
        height: "auto",
        borderRadius: "1rem",
        padding: "1rem 0rem",
        rowGap: "1rem",
      }}
    >
      <StyledContainerZero>
        <Typography variant="h2">리포트 새로 추가하기</Typography>
      </StyledContainerZero>
      <Divider />
      <StyledContainerZero>
        <FormControl fullWidth>
          <TextField
            variant="standard"
            name={"title"}
            label="동물 이름"
            value={newAnimal}
            onChange={(e) => {
              setNewAnimal(e.target.value);
            }}
          />
        </FormControl>
      </StyledContainerZero>

      <StyledContainerZero
        style={{ flexDirection: "row", columnGap: "0.6rem", width: "100%" }}
      >
        <StyledButton
          onClick={() => setOpenBackdrop(false)}
          sx={{
            flex: "1",
          }}
        >
          닫기
        </StyledButton>
        <StyledButton
          onClick={handleNew}
          sx={{
            flex: "1",
          }}
          disabled={!newAnimal}
        >
          추가하기
        </StyledButton>
      </StyledContainerZero>
    </Container>
  );
};
export default NewReportOverlay;
