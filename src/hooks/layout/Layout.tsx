import React, { ReactNode } from "react";
import { connect, ConnectedProps } from "react-redux";

type LayoutProps = PropsFromRedux & {
    children: ReactNode;
};

function Layout({ children }: LayoutProps) {
    return (
        <div>{children}</div>
    );
}

const mapStateToProps = (state: any) => ({   
});

// Tipos de las props conectadas con `connect`
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Layout);
