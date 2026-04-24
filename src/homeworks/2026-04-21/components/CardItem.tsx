import { Card, CardContent } from "@mui/material";
import { memo } from "react";

interface Props {
    children?: React.ReactNode;
    borderColor?: string;
}

function CardItem({ children, borderColor }: Props) {
    console.log("re-render-Card");
    return (
        <Card sx={{ borderLeft: `5px solid ${borderColor || "#333"}` }}>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default memo(CardItem, (prevProps, nextProps) => {
    return prevProps.borderColor === nextProps.borderColor;
});
