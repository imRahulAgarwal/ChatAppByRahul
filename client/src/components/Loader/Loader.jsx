import React from "react";
import { BarLoader } from "react-spinners";

const Loader = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <BarLoader className="z-20" color="#ffffff" width={300} />

            <div className="z-10 absolute bottom-0 top-0 right-0 left-0 bg-[#000000e0]"></div>
        </div>
    );
};

export default Loader;
