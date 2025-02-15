import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import { AUTH_PATH, CHAT_PATH } from "../../constant";
import Footer from "../Footer";

// component: 레이아웃 //
export default function Container() {

    // state: 현재 페이지 path name //
    const {pathname} = useLocation();

    // render: 레이아웃 렌더링 //
    return (
        <>
            <Header />
            <Outlet />
            {pathname !== AUTH_PATH() && <Footer />}
        </>
    )
}