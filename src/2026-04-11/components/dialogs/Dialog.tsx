import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface Props {
    title: string;
    children?: React.ReactNode;
    buttonName?: string[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

function DialogComp({
    title,
    children,
    buttonName = ["cancel", "success"],
    isOpen,
    onClose,
    onSubmit,
}: Props) {
    if (!isOpen) return null;
    return (
        <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            role="alertdialog"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {children}
            <DialogActions>
                <Button variant="outlined" onClick={onClose} color="error">
                    {buttonName[0]}
                </Button>
                <Button variant="outlined" onClick={onSubmit} color="success">
                    {buttonName[1]}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogComp;
