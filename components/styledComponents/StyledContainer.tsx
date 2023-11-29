import { Container, styled } from "@mui/system";

export const StyledContainerZero = styled(Container)`
  flex-direction: row;
  padding: 0.3rem;
  column-gap: 2rem;
  min-width: 100%;
  align-items: center;
  justify-content: center;
`;

export const StyledContainerOne = styled(Container)`
  padding: 2rem;
  row-gap: 2rem;
  height: 100%;
  min-width: 100%;
`;

export const StyledContainerTwo = styled(Container)`
  padding: 0 !important;
  row-gap: 1rem;
  max-width: none;
`;

export const StyledContainerThree = styled(Container)`
  padding: 0 !important;
  row-gap: 0.5rem;
  max-width: none;
`;

export const StyledContainerHeader = styled(Container)`
  padding: 0 !important;
  justify-content: center;
  height: 2rem;
  margin-bottom: -1rem;
`;

export const StyledDivHeader = styled("div")`
  width: 100%;
  height: auto;
  min-height: 3rem;
  display: flex;
  align-items: center;
`;
