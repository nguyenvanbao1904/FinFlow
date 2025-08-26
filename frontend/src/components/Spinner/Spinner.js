import { Box, CircularProgress, Typography } from "@mui/material";
const Spinner = ({ text }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress></CircularProgress>
        <Typography>{text}</Typography>
      </Box>
    </>
  );
};

export default Spinner;
