import { Toast, ToastContent, Button, Text } from "@salt-ds/core";
import { CloseIcon, IconProps } from "@salt-ds/icons";
import { JSX, ReactElement, ReactNode } from "react";

interface ToastMessagePopUp {
    status:"success" | "error" | "info" | "warning"
    headText:string
    content?:ReactNode;
    icon?:ReactElement<IconProps>
    handleClose:() => void;
}

export const ToastMessage = ({status,headText,content,icon,handleClose}:ToastMessagePopUp):JSX.Element => (
    <Toast status={status} style={{ width: 240}} icon={icon}>
    <ToastContent>
      <Text>
        <strong>{headText}</strong>
      </Text>
      <div>
        {content}
      </div>
    </ToastContent>
    <Button appearance="transparent"  onClick={handleClose} >  
      <CloseIcon aria-hidden/>
    </Button>
  </Toast>
)