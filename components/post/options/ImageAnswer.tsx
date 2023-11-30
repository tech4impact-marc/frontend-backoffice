import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { IconButton, ImageListItem, Typography } from "@mui/material";
import EXIF from "exif-js";
import Image from "next/image";
import Script from "next/script";
import React, { memo, useState } from "react";

import {
  ImageAnswerType,
  UpdateAnswersType,
} from "@/components/post/AnswerChoice";

interface ImageAnswerProps {
  currentAnswer: ImageAnswerType[];
  updateAnswers: UpdateAnswersType;
}

const ImageAnswer: React.FC<ImageAnswerProps> = ({
  currentAnswer,
  updateAnswers,
}) => {
  const [imageID, setImageID] = useState(0);
  const handleImageChange = (e: React.ChangeEvent<any>) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > 10485760) {
      alert("이미지 파일의 크기를 줄이세요!");
      return;
    }
    const newImage: ImageAnswerType = {
      //항상 이미지 답변이 있어야 한다
      type: currentAnswer[0].type,
      questionId: currentAnswer[0].questionId,
      value: {
        fileType: "IMAGE",
        fileKey: `admin_image_${currentAnswer[0].questionId}_${imageID}`,
        fileUrl: e.target.files[0],
      },
      modified: true,
    };
    updateAnswers([newImage, ...currentAnswer]);
    setImageID((prev) => prev + 1);
  };
  const getUrl = (imageUrl: string | File) => {
    if (typeof imageUrl === "object" && imageUrl instanceof File) {
      return URL.createObjectURL(imageUrl);
    }
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return `https://${imageUrl}`;
  };
  const validUrl = (imageUrl: string | File | undefined) => {
    if (imageUrl === undefined) {
      return false;
    }
    if (typeof imageUrl === "object" && imageUrl instanceof File) {
      return true;
    }
    if (
      process.env.NEXT_PUBLIC_IMAGE_DOMAINS &&
      process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",").includes(
        new URL(getUrl(imageUrl)).hostname
      )
    ) {
      return true;
    }
    return false;
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "120px !important",
    borderRadius: "8px",
    flexShrink: "0",
  };

  if (!currentAnswer) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          width: "100%",
          height: "120px",
        }}
      >
        <label
          htmlFor="imageUpload"
          className="custom-file-upload"
          style={{
            ...containerStyle,
            border: "1px dashed rgba(34, 48, 71, 0.50)",
            cursor: "pointer",
          }}
        >
          <AddRoundedIcon sx={{ color: "rgba(34, 48, 71, 0.50)" }} />
        </label>
        <input
          id="imageUpload"
          type="file"
          multiple
          capture="environment"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          // enctype="multipart/form-data"
        />
        <div
          style={{
            display: "flex",
            columnGap: "1rem",
            overflow: "scroll",
            width: "100%",
          }}
        >
          {currentAnswer.map(
            (answer, index) =>
              answer.value.fileUrl &&
              validUrl(answer.value.fileUrl) && (
                <ImageListItem key={index}>
                  <IconButton
                    id={`${index}`}
                    sx={{ position: "absolute", right: "0" }}
                    onClick={() =>
                      updateAnswers(
                        currentAnswer.filter(
                          (ans) => ans.value.fileUrl !== answer.value.fileUrl
                        )
                      )
                    }
                  >
                    <CancelRoundedIcon />
                  </IconButton>

                  {`${answer.value.fileUrl}`}
                  <Image
                    src={getUrl(answer.value.fileUrl)}
                    alt="Selected Image"
                    width={parseInt(containerStyle.width)}
                    height={parseInt(containerStyle.height)}
                    style={{
                      ...containerStyle,
                      objectFit: "contain",
                      backgroundColor: "#eee",
                    }}
                  />
                </ImageListItem>
              )
          )}
        </div>
      </div>
      <Typography variant="subtitle1">
        {currentAnswer.length - 1} / 3
      </Typography>
    </React.Fragment>
  );
};

export default memo(ImageAnswer);
