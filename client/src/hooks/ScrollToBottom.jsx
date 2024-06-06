import { useEffect, useRef } from "react";

const ScrollToBottom = () => {
    const elementRef = useRef();

    useEffect(() => elementRef.current.scrollIntoView());

    return <div ref={elementRef}></div>;
};

export default ScrollToBottom;
