import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "90%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.25rem",
  color: theme.palette.text.primary,
  textAlign: "center",
  padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  padding: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  padding: theme.spacing(2),
  "& .MuiButton-root": {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 500,
    padding: theme.spacing(1, 3),
  },
  "& .MuiButton-containedError": {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  "& .MuiButton-outlined": {
    marginLeft: theme.spacing(2),
    borderColor: theme.palette.grey[400],
    color: theme.palette.text.primary,
  },
}));

const DialogBox = ({
  open,
  handleClose,
  title,
  description,
  color,
  buttonText,
  handleOperation,
}) => {
  return (
    <StyledDialog onClose={handleClose} open={open}>
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <StyledDialogContent>{description}</StyledDialogContent>
      <StyledDialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color={color} onClick={handleOperation}>
          {buttonText}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DialogBox;