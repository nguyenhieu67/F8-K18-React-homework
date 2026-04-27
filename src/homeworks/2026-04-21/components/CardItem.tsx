import { Card, CardContent } from "@mui/material";

interface Props {
    children?: React.ReactNode;
    borderColor?: string;
}

function CardItem({ children, borderColor }: Props) {
    return (
        <Card sx={{ borderLeft: `5px solid ${borderColor || "#333"}` }}>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default CardItem;
