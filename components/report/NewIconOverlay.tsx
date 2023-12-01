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
import { useRouter } from "next/router";
import { useState } from "react";

import {
  StyledContainerOne,
  StyledContainerTwo,
  StyledContainerZero,
} from "@/components/styledComponents/StyledContainer";
import theme from "@/styles/theme";
import { StyledButton } from "../layout/BackOfficeLayout";
import instance from "@/utils/axios_interceptor";

const NewIconOverlay = ({
  oldData,
  setOpenBackdrop,
}: {
  oldData: any;
  setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [thumbnailURL, setThumbnailURL] = useState<string>("");

  const router = useRouter();
  const { pathname } = router;

  const handleNew = async () => {
    const initData = {
      ...oldData,
      thumbnailUrl: thumbnailURL, //https://drive.google.com/uc?id=id
    };
    try {
      const firstResponse = await instance.patch(
        `/admin/reports/types/${router.query.animal}`,
        initData
      );
      if (firstResponse.status === 200) {
        alert("아이콘이 변경되었습니다");
        setOpenBackdrop(false);
        window.location.reload();
        // window.location.reload();
      } else {
        console.error("아이콘 변경에 에러가 있었습니다:", firstResponse);
      }
    } catch (error) {
      console.error("오류가 있었습니다:", error);
    }
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
        <Typography variant="h2">아이콘 새로 추가하기</Typography>
      </StyledContainerZero>
      <Divider />
      <StyledContainerZero>
        <FormControl fullWidth>
          <Typography variant="body1">아이콘</Typography>

          <TextField
            variant="standard"
            name={"thumbnailURL"}
            placeholder="입력해주세요"
            value={thumbnailURL}
            onChange={(e) => {
              setThumbnailURL(e.target.value);
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
          disabled={!thumbnailURL}
        >
          변경하기
        </StyledButton>
      </StyledContainerZero>
    </Container>
  );
};
export default NewIconOverlay;
