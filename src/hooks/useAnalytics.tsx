// src/hooks/useAnalytics.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// ID GOOGLE ANALITYCS
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function useAnalytics() {
    const location = useLocation();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            ReactGA.initialize(MEASUREMENT_ID);
            initialized.current = true;
        }
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location]);
}
