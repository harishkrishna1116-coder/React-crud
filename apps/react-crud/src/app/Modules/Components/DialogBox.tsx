import { Dialog, DialogHeader, DialogContent, DialogActions, StackLayout, FlexLayout, useId } from "@salt-ds/core";
import { JSX } from "react";

interface DialogBoxProps {
  open: boolean;
  size: "small" | "medium" | "large";
  status: "info" | "warning" | "error" | "success";
  content: string;
  direction: "row" | "column";
  closeButton?: JSX.Element;
  confirm?: JSX.Element;
  cancel?: JSX.Element;
}

const DialogBox = ({open,size,status,content,direction,closeButton,confirm,cancel}:DialogBoxProps) => {

  return <>
      <Dialog
        open={open}
        // onOpenChange={onOpenChange}
        size={size}
        status={status}
      >
        <DialogHeader disableAccent header="Confirmation?" actions={closeButton}/>
        <DialogContent>
         {content}
        </DialogContent>
        <DialogActions>
          {direction === "column" ? (
            <StackLayout gap={1} style={{ width: "100%" }}>
              {confirm}
              {cancel}
            </StackLayout>
          ) : (
            <FlexLayout gap={1}>
              {cancel}
              {confirm}
            </FlexLayout>
          )}
        </DialogActions>
      </Dialog>
  </>;
}

export default DialogBox;