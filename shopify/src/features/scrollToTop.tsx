import { useEffect } from "react";

const ScrollToTop = () => {
    useEffect(() => {
        const handleScroll = () => {
            window.scrollTo(0, 0);
        };

        // Listen for URL changes
        const observer = new MutationObserver(handleScroll);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return null;
};

export default ScrollToTop;
