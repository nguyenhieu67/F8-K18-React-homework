import Sidebar from "../components/Sidebar";

interface Props {
    children: React.ReactNode;
}

function DefaultLayout({ children }: Props) {
    return (
        <div className="grid grid-cols-12">
            <div className="col-span-3 bg-[#2d3e51]">
                <Sidebar />
            </div>
            <div className="col-span-9 p-5">{children}</div>
        </div>
    );
}

export default DefaultLayout;
